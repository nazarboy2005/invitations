// Run against a local production server: pnpm exec tsx --test tests/invitation-covers.browser.integration.ts
// Only synthetic API responses are used; no account or invitation records are written.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { completeInvitation } from "./fixtures/publication";

const webRequire = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { chromium } = webRequire("playwright");
const sharp = webRequire("sharp");
const origin = process.env.COVER_TEST_URL || "http://127.0.0.1:3002";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));

test(
  "dashboard cover caching and recovery in the production client",
  { timeout: 120000 },
  async (t) => {
    const browser = await chromium.launch({ headless: true });
    const bytes = await sharp({
      create: { width: 480, height: 800, channels: 3, background: "#c4b8a0" },
    })
      .webp()
      .toBuffer();
    const contexts: any[] = [];
    async function fixture(count = 1) {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 950 },
      });
      contexts.push(context);
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", (error: Error) => errors.push(error.message));
      const items = Array.from({ length: count }, (_, index) => ({
        ...completeInvitation(),
        id: `cover-browser-${index}`,
        status: index ? "published" : "draft",
        slug: index ? "test12" : undefined,
        createdAt: `2026-10-${28 - index}T12:00:00Z`,
      }));
      let requests = 0;
      let owner = "cover-test-owner";
      let respond = async (route: any) =>
        route.fulfill({
          contentType: "image/webp; charset=binary",
          body: bytes,
        });
      await page.route("**/api/auth/session", (route: any) =>
        route.fulfill({
          json: {
            user: {
              id: owner,
              displayName: "Cover test",
              phoneShared: true,
              isAdmin: false,
            },
            configured: true,
          },
        }),
      );
      await page.route("**/api/invitations", (route: any) =>
        route.fulfill({ json: { invitations: items } }),
      );
      await page.route("**/api/invitation-covers", (route: any) => {
        requests++;
        return respond(route);
      });
      return {
        context,
        page,
        items,
        errors,
        requests: () => requests,
        respond: (handler: typeof respond) => {
          respond = handler;
        },
        owner: (id: string) => {
          owner = id;
        },
      };
    }
    async function loaded(page: any, count = 1) {
      await page.waitForFunction((expected: number) => {
        const images = Array.from(
          document.querySelectorAll("article img"),
        ) as HTMLImageElement[];
        return (
          images.length === expected &&
          images.every((image) => image.complete && image.naturalWidth > 0)
        );
      }, count);
    }
    async function refresh(page: any) {
      await page.evaluate(() =>
        window.dispatchEvent(new Event("taklifnoma:session-changed")),
      );
    }
    try {
      await t.test(
        "cold load, filter preservation, reload, edits and account isolation",
        async () => {
          const f = await fixture(2),
            p = f.page;
          await p.goto(`${origin}/dashboard`);
          await loaded(p, 2);
          assert.equal(f.requests(), 2);
          for (const label of ["Qoralamalar", "Nashr qilingan", "Barchasi"]) {
            await p.getByRole("button", { name: new RegExp(label) }).click();
            assert.equal(
              await p
                .getByText("Muqova tayyorlanmoqda…", { exact: true })
                .count(),
              0,
            );
          }
          assert.equal(f.requests(), 2);
          await p.waitForFunction(
            async () =>
              (await (await caches.open("visol-invitation-covers-v1")).keys())
                .length === 2,
          );
          await p.reload();
          await loaded(p, 2);
          assert.equal(
            f.requests(),
            2,
            "reload reads browser cache without generation",
          );
          const urls = await p
            .locator("article img")
            .evaluateAll((images: HTMLImageElement[]) =>
              images.map((image) => image.src),
            );
          await p
            .getByRole("link", { name: "Shablonlar", exact: true })
            .click();
          await p.waitForURL("**/templates");
          await p.goBack();
          await loaded(p, 2);
          assert.equal(
            f.requests(),
            2,
            "client navigation reuses ready covers",
          );
          assert.deepEqual(
            await p
              .locator("article img")
              .evaluateAll((images: HTMLImageElement[]) =>
                images.map((image) => image.src),
              ),
            urls,
          );
          const card = p
            .locator("article")
            .filter({
              has: p.getByRole("heading", {
                name: "Nodir test & Madina test",
                exact: true,
              }),
            })
            .first();
          const oldUrl = await card.locator("img").getAttribute("src");
          const oldCacheKeys = await p.evaluate(async () =>
            (
              await (await caches.open("visol-invitation-covers-v1")).keys()
            ).map((key) => key.url),
          );
          f.items[0].startsAt = "2028-01-01T12:00";
          f.items[0].content["uz-Latn"].venueName = "Updated draft venue";
          const unchanged = p.waitForResponse("**/api/invitations");
          await refresh(p);
          await unchanged;
          await p.waitForTimeout(250);
          assert.equal(
            f.requests(),
            2,
            "date/venue draft edits reuse the cover",
          );
          assert.equal(await card.locator("img").getAttribute("src"), oldUrl);
          let release!: () => void;
          const hold = new Promise<void>((resolve) => {
            release = resolve;
          });
          f.respond(async (route: any) => {
            await hold;
            return route.fulfill({ contentType: "image/webp", body: bytes });
          });
          f.items[0].content["uz-Latn"].people = ["Updated", "Names"];
          await refresh(p);
          const edited = p.locator("article").filter({
            has: p.getByRole("heading", {
              name: "Updated & Names",
              exact: true,
            }),
          });
          await edited.waitFor();
          assert.equal(
            await edited.locator("img").getAttribute("src"),
            oldUrl,
            "previous image stays visible during regeneration",
          );
          release();
          await p.waitForFunction((old: string) => {
            const card = Array.from(document.querySelectorAll("article")).find(
              (item) => item.textContent?.includes("Updated & Names"),
            );
            const image = card?.querySelector("img");
            return (
              image &&
              image.src !== old &&
              image.complete &&
              image.naturalWidth > 0
            );
          }, oldUrl);
          assert.equal(f.requests(), 3, "only the edited cover regenerates");
          await p.waitForFunction(async (previous: string[]) => {
            const cache = await caches.open("visol-invitation-covers-v1");
            const keys = (await cache.keys()).map((key) => key.url);
            return (
              keys.length === 2 &&
              keys.filter((key) => previous.includes(key)).length === 1
            );
          }, oldCacheKeys);
          await p.reload();
          await loaded(p, 2);
          assert.equal(
            f.requests(),
            3,
            "replacement persisted and old cover was removed",
          );
          f.owner("another-cover-owner");
          await p.reload();
          await loaded(p, 2);
          assert.equal(
            f.requests(),
            5,
            "account scopes do not reuse private covers",
          );
          for (const width of [390, 320]) {
            await p.setViewportSize({ width, height: 844 });
            assert.equal(
              await p.evaluate(
                () => document.documentElement.scrollWidth > innerWidth,
              ),
              false,
            );
          }
          assert.deepEqual(f.errors, []);
        },
      );
      await t.test(
        "late draft capture cannot replace the current browser cover",
        async () => {
          const f = await fixture(),
            p = f.page;
          await p.goto(`${origin}/dashboard`);
          await loaded(p);
          const original = [...f.items[0].content["uz-Latn"].people];
          let release!: () => void;
          const hold = new Promise<void>((resolve) => {
            release = resolve;
          });
          f.respond(async (route: any) => {
            await hold;
            return route.fulfill({ contentType: "image/webp", body: bytes });
          });
          f.items[0].content["uz-Latn"].people = ["Superseded", "Names"];
          await refresh(p);
          await p.waitForFunction(() =>
            document.body.textContent?.includes("Superseded & Names"),
          );
          while (f.requests() < 2) await p.waitForTimeout(20);
          f.items[0].content["uz-Latn"].people = original;
          await refresh(p);
          await p.waitForFunction(() =>
            document.body.textContent?.includes("Nodir test & Madina test"),
          );
          release();
          await p.waitForTimeout(250);
          await p.reload();
          await loaded(p);
          assert.equal(
            f.requests(),
            2,
            "obsolete response did not evict the selected cover",
          );
        },
      );
      for (const unavailable of ["storage", "hashing"]) {
        await t.test(
          `loads and reuses memory with unavailable ${unavailable}`,
          async () => {
            const f = await fixture();
            await f.page.addInitScript((kind: string) => {
              if (kind === "storage")
                Object.defineProperty(window, "caches", { value: undefined });
              else
                Object.defineProperty(window.crypto, "subtle", {
                  value: undefined,
                });
            }, unavailable);
            await f.page.goto(`${origin}/dashboard`);
            await loaded(f.page);
            const removed = f.items.pop()!;
            await refresh(f.page);
            await f.page.waitForFunction(
              () => document.querySelectorAll("article").length === 0,
            );
            f.items.push(removed);
            await refresh(f.page);
            await loaded(f.page);
            assert.equal(f.requests(), 1);
            assert.deepEqual(f.errors, []);
          },
        );
      }
      await t.test(
        "corrupt disk images are evicted and fetched again",
        async () => {
          const f = await fixture();
          await f.page.goto(`${origin}/dashboard`);
          await loaded(f.page);
          await f.page.waitForFunction(
            async () =>
              (await (await caches.open("visol-invitation-covers-v1")).keys())
                .length === 1,
          );
          await f.page.evaluate(async () => {
            const cache = await caches.open("visol-invitation-covers-v1");
            for (const key of await cache.keys())
              await cache.put(
                key,
                new Response("broken", {
                  headers: { "Content-Type": "image/webp" },
                }),
              );
          });
          await f.page.reload();
          await loaded(f.page);
          assert.equal(f.requests(), 2);
        },
      );
      await t.test(
        "temporary 500/network/429 failures recover automatically",
        async () => {
          const f = await fixture();
          f.respond(async (route: any) => {
            if (f.requests() === 1)
              return route.fulfill({ status: 500, body: "" });
            if (f.requests() === 2) return route.abort("failed");
            return route.fulfill({ contentType: "image/webp", body: bytes });
          });
          await f.page.goto(`${origin}/dashboard`);
          await loaded(f.page);
          assert.equal(f.requests(), 3);
          const busy = await fixture();
          busy.respond(async (route: any) =>
            busy.requests() === 1
              ? route.fulfill({
                  status: 429,
                  headers: { "Retry-After": "0.01" },
                  body: "busy",
                })
              : route.fulfill({ contentType: "image/webp", body: bytes }),
          );
          await busy.page.goto(`${origin}/dashboard`);
          await loaded(busy.page);
          assert.equal(busy.requests(), 2);
        },
      );
      await t.test(
        "persistent failure stops after three attempts and manual retry stays on dashboard",
        async () => {
          const f = await fixture();
          f.respond(async (route: any) =>
            route.fulfill({ status: 503, body: "unavailable" }),
          );
          await f.page.goto(`${origin}/dashboard`);
          await f.page
            .getByRole("button", { name: "Qayta urinish", exact: true })
            .waitFor();
          assert.equal(f.requests(), 3);
          assert.equal(
            await f.page.locator("a button").count(),
            0,
            "retry is not nested inside the cover link",
          );
          f.respond(async (route: any) =>
            route.fulfill({ contentType: "image/webp", body: bytes }),
          );
          await f.page
            .getByRole("button", { name: "Qayta urinish", exact: true })
            .click();
          await loaded(f.page);
          assert.equal(f.requests(), 4);
          assert.equal(new URL(f.page.url()).pathname, "/dashboard");
          assert.deepEqual(f.errors, []);
        },
      );
    } finally {
      await Promise.all(contexts.map((context) => context.close()));
      await browser.close();
    }
  },
);
