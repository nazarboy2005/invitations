// Run against an isolated loopback database/application with local disposable media.
import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";
import sharp from "sharp";
import { getDb, closeDb } from "../packages/database/src/index";
import { saveServiceImage } from "../apps/web/src/server/service-media";
import { removeMedia, putMedia } from "../apps/web/src/server/storage";
import { serviceListings } from "../apps/web/src/modules/services/services-data";
import { servicePhotoUrl } from "../apps/web/src/modules/services/service-photo-url";

test(
  "warmed HTTP/browser caches cannot resurrect replaced, detached, hidden or deleted service photos",
  { timeout: 300000 },
  async () => {
    const origin =
      process.env.SERVICES_CACHE_TEST_ORIGIN ?? "http://127.0.0.1:3014";
    assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
    assert.ok(
      ["127.0.0.1", "localhost"].includes(
        new URL(process.env.DATABASE_URL!).hostname,
      ),
      "never publish test fixtures to a shared database",
    );
    assert.equal(process.env.MEDIA_STORAGE, "local");
    const db = getDb(),
      owner = randomUUID(),
      slug = `qa-cache-${randomUUID()}`;
    const images: Awaited<ReturnType<typeof saveServiceImage>>[] = [];
    const source = serviceListings.find(
      (listing) => listing.images.length >= 5,
    )!;
    const require = createRequire(path.resolve("apps/web/package.json"));
    const browser = await require("playwright").chromium.launch({
      channel: "chrome",
      headless: true,
    });
    async function imageResponse(src: string, etag?: string) {
      return fetch(new URL(servicePhotoUrl(slug, src, 320), origin), {
        headers: etag ? { "If-None-Match": etag } : {},
      });
    }
    async function denied(response: Response, status: number | number[] = 404) {
      assert.ok(
        (Array.isArray(status) ? status : [status]).includes(response.status),
        `${response.status}: ${await response.clone().text()}`,
      );
      assert.match(response.headers.get("Cache-Control")!, /no-store/);
    }
    let listing = {
      ...source,
      slug,
      name: "Service cache QA",
      images: source.images,
    };
    async function publish(next = listing) {
      listing = next;
      await db`UPDATE service_listings SET draft=${db.json(listing)},published=${db.json(listing)},status='published',revision=revision+1 WHERE slug=${slug}`;
    }
    try {
      await db`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${owner},${Date.now()},'Cache QA')`;
      for (const color of ["red", "green", "blue", "yellow", "purple"])
        images.push(
          await saveServiceImage(
            owner,
            await sharp({
              create: {
                width: 1000,
                height: 600,
                channels: 3,
                background: color,
              },
            })
              .png()
              .toBuffer(),
          ),
        );
      listing = { ...listing, images };
      await db`INSERT INTO service_listings(slug,draft,published,status) VALUES(${slug},${db.json(listing)},${db.json(listing)},'published')`;
      const original = await imageResponse(images[0].src);
      assert.equal(original.status, 200);
      assert.match(original.headers.get("Cache-Control")!, /private, no-cache/);
      const originalEtag = original.headers.get("ETag")!;
      assert.equal(
        (await sharp(Buffer.from(await original.arrayBuffer())).metadata())
          .width,
        320,
      );
      assert.equal(
        (await imageResponse(images[0].src, originalEtag)).status,
        304,
      );
      const raw = await fetch(origin + images[0].src);
      assert.equal(
        (
          await fetch(origin + images[0].src, {
            headers: { "If-None-Match": raw.headers.get("ETag")! },
          })
        ).status,
        304,
      );

      const page = await browser.newPage({
        viewport: { width: 1280, height: 900 },
      });
      const errors: string[] = [];
      page.on("pageerror", (error: Error) => errors.push(error.message));
      await page.goto(`${origin}/services/b/${slug}`);
      const gallery = page.getByRole("region", {
        name: `${listing.name} rasmlari`,
        exact: true,
      });
      await gallery.locator("img").first().waitFor();
      assert.equal(
        await gallery.locator("img").count(),
        3,
        "only active and adjacent slides have image sources",
      );
      await page.waitForFunction(() =>
        [...document.querySelectorAll("section img")].some(
          (image) => (image as HTMLImageElement).naturalWidth > 0,
        ),
      );
      const renderedSrc = (await gallery
        .locator("img")
        .first()
        .getAttribute("src"))!;
      assert.ok(
        new URL(renderedSrc, origin).pathname.startsWith(
          "/api/services/photos/",
        ),
        renderedSrc,
      );
      await page.setViewportSize({ width: 390, height: 844 });
      await page.getByRole("button", { name: "4-rasm", exact: true }).click();
      await page.waitForTimeout(400);
      assert.equal(await gallery.locator("img").count(), 3);
      await page
        .getByRole("button", { name: "Rasmni kattalashtirish", exact: true })
        .click();
      assert.equal(await gallery.locator("dialog img").count(), 1);
      await page
        .getByRole("button", { name: "Rasmni yopish", exact: true })
        .click();
      assert.equal(await gallery.locator("dialog img").count(), 0);

      // Removing the old attachment invalidates its scoped URL even though the file remains.
      await publish({
        ...listing,
        name: "Service cache QA updated",
        images: images.slice(1),
      });
      await denied(await imageResponse(images[0].src, originalEtag));
      await denied(
        await fetch(origin + images[0].src, {
          headers: { "If-None-Match": raw.headers.get("ETag")! },
        }),
        [401, 503], // Missing local auth configuration also fails closed.
      );
      await page.reload();
      await page
        .getByRole("heading", { name: listing.name, exact: true })
        .waitFor();
      assert.ok(
        !(await page.content()).includes(encodeURIComponent(images[0].src)),
        "old photo is absent from fresh markup",
      );
      assert.equal((await imageResponse(images[1].src)).status, 200);

      const second = await imageResponse(images[1].src);
      const secondEtag = second.headers.get("ETag")!;
      await db`UPDATE service_listings SET published=NULL,status='draft' WHERE slug=${slug}`;
      await denied(await imageResponse(images[1].src, secondEtag));
      assert.equal((await fetch(`${origin}/services/b/${slug}`)).status, 404);
      await publish();

      // Physical deletion must also reject cached bytes/304s while metadata still exists.
      const [secondMedia] =
        await db`SELECT object_key FROM service_media WHERE id=${images[1].src.split("/").at(-1)!}`;
      await removeMedia(secondMedia.object_key);
      await denied(await imageResponse(images[1].src, secondEtag));
      await denied(await imageResponse(images[1].src));
      await denied(await fetch(origin + images[1].src));
      await page.reload();
      await page.waitForFunction(() => {
        const image = document.querySelector(
          'section[aria-label$=" rasmlari"] span[aria-hidden="false"] img',
        ) as HTMLImageElement | null;
        return image?.style.visibility === "hidden";
      });

      // Even replacing bytes at an existing storage key changes the validator.
      const before = await imageResponse(images[2].src);
      const [thirdMedia] =
        await db`SELECT object_key FROM service_media WHERE id=${images[2].src.split("/").at(-1)!}`;
      await putMedia(
        thirdMedia.object_key,
        await sharp({
          create: {
            width: 1000,
            height: 600,
            channels: 3,
            background: "black",
          },
        })
          .webp()
          .toBuffer(),
        "image/webp",
      );
      const changed = await imageResponse(
        images[2].src,
        before.headers.get("ETag")!,
      );
      assert.equal(changed.status, 200);
      assert.notEqual(changed.headers.get("ETag"), before.headers.get("ETag"));
      await db`DELETE FROM service_media WHERE id=${images[2].src.split("/").at(-1)!}`;
      await denied(
        await imageResponse(images[2].src, changed.headers.get("ETag")!),
      );
      await removeMedia(thirdMedia.object_key);

      // Bundled photos use the same live gate instead of the immutable asset path.
      await publish({ ...listing, images: [source.images[0]] });
      const bundled = await imageResponse(source.images[0].src);
      assert.equal(bundled.status, 200);
      await publish({ ...listing, images: [images[3]] });
      await denied(
        await imageResponse(source.images[0].src, bundled.headers.get("ETag")!),
      );
      const last = await imageResponse(images[3].src);
      await db`DELETE FROM service_listings WHERE slug=${slug}`;
      await denied(
        await imageResponse(images[3].src, last.headers.get("ETag")!),
      );
      assert.equal((await fetch(`${origin}/services/b/${slug}`)).status, 404);
      assert.deepEqual(errors, []);
    } finally {
      await browser.close();
      const media =
        await db`SELECT object_key FROM service_media WHERE owner_id=${owner}`;
      for (const item of media) await removeMedia(item.object_key);
      await db`DELETE FROM service_listings WHERE slug=${slug}`;
      await db`DELETE FROM service_media WHERE owner_id=${owner}`;
      await db`DELETE FROM users WHERE id=${owner}`;
      await closeDb();
    }
  },
);
