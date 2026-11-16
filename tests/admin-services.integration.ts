// Disposable accounts/listings only, against an explicitly local application.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { removeMedia } from "../apps/web/src/server/storage";
import { serviceListings } from "../apps/web/src/modules/services/services-data";

test(
  "Services administration supports active/hidden visibility, URL editing, permanent deletion and audits",
  { timeout: 600000 },
  async () => {
    const origin = process.env.SERVICES_TEST_URL || "http://127.0.0.1:3002";
    assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
    const db = getDb(),
      admin = randomUUID(),
      owner = randomUUID(),
      slug = `qa-services-${randomUUID()}`;
    const renamedSlug = `${slug}-renamed`,
      sharedSlug = `${slug}-shared`;
    const tokens = {
      admin: randomToken(),
      owner: randomToken(),
      stale: randomToken(),
    };
    async function req(
      path: string,
      role: keyof typeof tokens | null = "admin",
      body?: unknown,
      method = "POST",
      headers: Record<string, string> = {},
    ) {
      return fetch(origin + path, {
        redirect: "manual",
        ...(body === undefined
          ? {}
          : {
              method,
              body: Buffer.isBuffer(body) ? body : JSON.stringify(body),
            }),
        headers: {
          Origin: origin,
          ...(role ? { Cookie: `taklifnoma_session=${tokens[role]}` } : {}),
          ...(body === undefined
            ? {}
            : {
                "Content-Type": Buffer.isBuffer(body)
                  ? "image/png"
                  : "application/json",
              }),
          ...headers,
        },
      });
    }
    async function expect(response: Response, status: number, code?: string) {
      assert.equal(
        response.status,
        status,
        (await response.clone().text()).slice(0, 1000),
      );
      assert.match(response.headers.get("Cache-Control") || "", /no-store/);
      const result = await response.json();
      if (code) assert.equal(result.error?.code, code);
      return result;
    }
    try {
      await db`INSERT INTO users(id,telegram_user_id,display_name,is_admin) VALUES(${admin},${Math.floor(Math.random() * 1e12) + 1},'Services QA admin',true),(${owner},${Math.floor(Math.random() * 1e12) + 1},'Services QA creator',false)`;
      for (const [role, token] of Object.entries(tokens))
        await db`INSERT INTO sessions(user_id,token_hash,created_at,expires_at,absolute_expires_at) VALUES(${role === "owner" ? owner : admin},${digest(token)},now()-${role === "stale" ? "8 days" : "0 hours"}::interval,now()+interval '1 hour',now()+interval '1 hour')`;
      for (const path of [
        "/api/admin/services",
        "/api/admin/services/imports",
      ]) {
        await expect(await req(path, null), 401);
        await expect(await req(path, "owner"), 403);
        await expect(await req(path, "stale"), 401, "ADMIN_REAUTH_REQUIRED");
      }
      assert.equal((await req("/admin?view=services", "owner")).status, 404);
      assert.equal((await req("/admin?view=services")).status, 200);
      await expect(
        await req("/api/admin/services", "admin", {}, "POST", {
          Origin: "https://evil.example",
        }),
        403,
      );
      const list = await expect(await req("/api/admin/services"), 200);
      assert.ok(Array.isArray(list.items));
      const bytes = await sharp({
        create: { width: 640, height: 480, channels: 3, background: "#9d7885" },
      })
        .png()
        .toBuffer();
      const { image } = await expect(
        await req("/api/admin/services/images", "admin", bytes),
        201,
      );
      await expect(await req(image.src, null), 401);
      assert.equal((await req(image.src)).status, 200);
      let listing = {
        ...serviceListings.find((s) => s.categoryIds.includes("restaurant"))!,
        slug,
        name: "Services QA original",
        description: "QA published description",
        address: "Disposable QA address",
        images: [image],
        featured: true,
        featuredOrder: 0,
      };
      let { item } = await expect(
        await req("/api/admin/services", "admin", {
          listing,
          revision: 0,
          intent: "hidden",
        }),
        201,
      );
      assert.equal(item.status, "hidden");
      const availability = "/api/admin/services/slug-availability";
      await expect(await req(`${availability}?slug=${slug}`, null), 401);
      await expect(await req(`${availability}?slug=${slug}`, "owner"), 403);
      assert.equal(
        (await expect(await req(`${availability}?slug=${slug}`), 200))
          .available,
        false,
      );
      assert.equal(
        (
          await expect(
            await req(`${availability}?slug=${slug}&current=${slug}`),
            200,
          )
        ).available,
        true,
      );
      assert.equal(
        (await expect(await req(`${availability}?slug=${renamedSlug}`), 200))
          .available,
        true,
      );
      await expect(await req(`${availability}?slug=Invalid!`), 400);

      assert.equal((await req(`/services/b/${slug}`, null)).status, 404);
      assert.equal((await req("/sitemap.xml", null)).status, 200);
      await db`UPDATE service_listings SET review_required=true,evidence=${db.json({ sources: [], missing: ["email"] })} WHERE slug=${slug}`;
      await expect(
        await req(
          `/api/admin/services/${slug}`,
          "admin",
          { listing, revision: item.revision, intent: "active" },
          "PATCH",
        ),
        400,
        "REVIEW_REQUIRED",
      );
      ({ item } = await expect(
        await req(
          `/api/admin/services/${slug}`,
          "admin",
          {
            listing,
            revision: item.revision,
            intent: "active",
            reviewed: true,
          },
          "PATCH",
        ),
        200,
      ));
      assert.equal(item.status, "active");
      assert.equal(item.reviewRequired, false);
      assert.equal((await req(image.src, null)).status, 200);
      const favorites = await expect(
        await req("/api/service-favorites", "owner", {
          userId: owner,
          serviceSlugs: [slug],
        }),
        200,
      );
      assert.ok(
        favorites.favorites.some(
          (f: { serviceSlug: string }) => f.serviceSlug === slug,
        ),
      );
      let html = await (await req(`/services/b/${slug}`, null)).text();
      assert.ok(html.includes("Services QA original"));
      assert.ok(
        (await (await req("/sitemap.xml", null)).text()).includes(
          `/services/b/${slug}`,
        ),
      );
      const directory = await (await req("/services/restaurant", null)).text();
      assert.match(
        directory,
        new RegExp(`data-service-card[^>]*>[\\s\\S]*?Services QA original`),
      );
      await expect(
        await req(
          `/api/admin/services/${slug}`,
          "admin",
          { listing, revision: 1, intent: "hidden" },
          "PATCH",
        ),
        409,
        "SERVICE_CONFLICT",
      );
      listing = {
        ...listing,
        name: "Services QA edited",
        description: "QA changed description",
      };
      ({ item } = await expect(
        await req(
          `/api/admin/services/${slug}`,
          "admin",
          { listing, revision: item.revision, intent: "active" },
          "PATCH",
        ),
        200,
      ));
      html = await (await req(`/services/b/${slug}`, null)).text();
      assert.ok(html.includes("Services QA edited"));
      ({ item } = await expect(
        await req(
          `/api/admin/services/${slug}`,
          "admin",
          { listing, revision: item.revision, intent: "active" },
          "PATCH",
        ),
        200,
      ));
      html = await (await req(`/services/b/${slug}`, null)).text();
      assert.ok(html.includes("Services QA edited"));
      ({ item } = await expect(
        await req(
          `/api/admin/services/${slug}`,
          "admin",
          { listing, revision: item.revision, intent: "hidden" },
          "PATCH",
        ),
        200,
      ));
      assert.equal((await req(`/services/b/${slug}`, null)).status, 404);
      await expect(await req(image.src, null), 401);
      assert.ok(
        !(await (await req("/sitemap.xml", null)).text()).includes(
          `/services/b/${slug}`,
        ),
      );
      const invalid = {
        ...listing,
        images: [{ ...image, src: "https://evil.example/image.webp" }],
      };
      await expect(
        await req(
          `/api/admin/services/${slug}`,
          "admin",
          { listing: invalid, revision: item.revision, intent: "active" },
          "PATCH",
        ),
        400,
      );
      const input = {
        urls: ["https://yandex.uz/maps/org/seoul/91538804082/"],
        city: "Tashkent",
        categoryId: "restaurant",
        region: "Toshkent shahri",
        imageSource: "single",
      };
      const { job } = await expect(
        await req("/api/admin/services/imports", "admin", input),
        202,
      );
      await expect(
        await req("/api/admin/services/imports", "admin", input),
        409,
        "IMPORT_EXISTS",
      );
      await expect(
        await req(
          `/api/admin/services/imports/${job.id}`,
          "admin",
          { action: "cancel" },
          "PATCH",
        ),
        200,
      );
      await expect(
        await req(
          `/api/admin/services/imports/${job.id}`,
          "admin",
          { action: "retry" },
          "PATCH",
        ),
        200,
      );
      await expect(
        await req(
          `/api/admin/services/imports/${job.id}`,
          "admin",
          { action: "cancel" },
          "PATCH",
        ),
        200,
      );
      // Keep a linked history row and a shared image while renaming and deleting.
      await db`UPDATE service_import_jobs SET service_slug=${slug} WHERE id=${job.id}`;
      await expect(
        await req(
          `/api/admin/services/${slug}`,
          "admin",
          {
            listing: { ...listing, slug: serviceListings[0].slug },
            revision: item.revision,
            intent: "hidden",
          },
          "PATCH",
        ),
        409,
        "SERVICE_SLUG_TAKEN",
      );
      ({ item } = await expect(
        await req(
          `/api/admin/services/${slug}`,
          "admin",
          {
            listing: { ...listing, slug: renamedSlug },
            revision: item.revision,
            intent: "hidden",
          },
          "PATCH",
        ),
        200,
      ));
      assert.equal(item.slug, renamedSlug);
      assert.equal(item.draft.slug, renamedSlug);
      assert.equal(
        (
          await db`SELECT service_slug FROM service_import_jobs WHERE id=${job.id}`
        )[0].service_slug,
        renamedSlug,
      );
      assert.equal(
        (
          await db`SELECT service_slug FROM service_favorites WHERE user_id=${owner}`
        )[0].service_slug,
        renamedSlug,
      );
      await expect(await req(`/api/admin/services/${slug}`), 404);
      const { item: shared } = await expect(
        await req("/api/admin/services", "admin", {
          listing: { ...listing, slug: sharedSlug },
          revision: 0,
          intent: "hidden",
        }),
        201,
      );
      await expect(
        await req(
          `/api/admin/services/${renamedSlug}`,
          null,
          { revision: item.revision },
          "DELETE",
        ),
        401,
      );
      await expect(
        await req(
          `/api/admin/services/${renamedSlug}`,
          "owner",
          { revision: item.revision },
          "DELETE",
        ),
        403,
      );
      await expect(
        await req(
          `/api/admin/services/${renamedSlug}`,
          "admin",
          { revision: item.revision },
          "DELETE",
          { Origin: "https://evil.example" },
        ),
        403,
      );
      await expect(
        await req(
          `/api/admin/services/${renamedSlug}`,
          "admin",
          { revision: item.revision - 1 },
          "DELETE",
        ),
        409,
        "SERVICE_CONFLICT",
      );
      const deleted = await expect(
        await req(
          `/api/admin/services/${renamedSlug}`,
          "admin",
          { revision: item.revision },
          "DELETE",
        ),
        200,
      );
      assert.equal(deleted.cleanupPending, false);
      await expect(await req(`/api/admin/services/${renamedSlug}`), 404);
      assert.equal(
        (
          await db`SELECT service_slug FROM service_import_jobs WHERE id=${job.id}`
        )[0].service_slug,
        null,
      );
      assert.equal(
        (await db`SELECT * FROM service_favorites WHERE user_id=${owner}`)
          .length,
        0,
      );
      assert.equal(
        (await req(image.src)).status,
        200,
        "Shared image must survive",
      );
      const deletedShared = await expect(
        await req(
          `/api/admin/services/${sharedSlug}`,
          "admin",
          { revision: shared.revision },
          "DELETE",
        ),
        200,
      );
      assert.equal(deletedShared.cleanupPending, false);
      await expect(await req(image.src), 404);
      await expect(
        await req(
          `/api/admin/services/${renamedSlug}`,
          "admin",
          { revision: item.revision },
          "DELETE",
        ),
        404,
      );
      const audit =
        await db`SELECT action FROM admin_audit_log WHERE actor_id=${admin}`;
      for (const action of [
        "service.create",
        "service.update",
        "service.publish",
        "service.unpublish",
        "service.delete",
        "service.import",
      ])
        assert.ok(audit.some((r) => r.action === action));
    } finally {
      const media =
        await db`SELECT object_key FROM service_media WHERE owner_id=${admin}`;
      for (const m of media) await removeMedia(m.object_key);
      await db.begin(async (tx) => {
        await tx`DELETE FROM service_import_jobs WHERE created_by=${admin}`;
        await tx`DELETE FROM service_listings WHERE slug=ANY(${tx.array([slug, renamedSlug, sharedSlug])}::text[])`;
        await tx`DELETE FROM service_media WHERE owner_id=${admin}`;
        await tx`DELETE FROM admin_audit_log WHERE actor_id=${admin}`;
        await tx`DELETE FROM sessions WHERE user_id=ANY(${tx.array([admin, owner])}::uuid[])`;
        await tx`DELETE FROM service_favorites WHERE user_id=ANY(${tx.array([admin, owner])}::uuid[])`;
        await tx`DELETE FROM rate_limits WHERE key=${"admin-write:" + admin}`;
        await tx`DELETE FROM users WHERE id=ANY(${tx.array([admin, owner])}::uuid[])`;
      });
      const [after] =
        await db`SELECT count(*)::int AS count FROM service_listings WHERE slug=ANY(${db.array([slug, renamedSlug, sharedSlug])}::text[])`;
      assert.equal(after.count, 0);
      await closeDb();
    }
  },
);
