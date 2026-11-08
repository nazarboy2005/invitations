// Run against a local production server. HTTP proxy fixtures preserve native
// browser caching (Playwright request routing would disable it). No DB writes.
import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { createRequire } from "node:module";
import { templateById } from "@taklifnoma/contracts";
import { templatePoster } from "../apps/web/src/modules/catalog/template-poster";
import { completeInvitation } from "./fixtures/publication";

const webRequire = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { chromium } = webRequire("playwright");
const upstream = process.env.COVER_TEST_URL || "http://127.0.0.1:3002";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(upstream).hostname));

const templates = ["anor", "ganch", "oq-atirgul"].map((id) =>
  templateById(id)!,
);

test(
  "catalog and dashboard share cached posters in both directions without generating covers",
  { timeout: 180000 },
  async (t) => {
    let owner = "cover-fixture-owner";
    const invitations = templates.map((template, index) => ({
      ...completeInvitation(),
      templateId: template.id,
      status: index === 1 ? "published" : "draft",
      ...(index === 1 ? { slug: "cover1" } : {}),
      createdAt: new Date(2026, 9, 28 - index).toISOString(),
    }));
    const hits = new Map<string, number>();
    const cacheHeaders = new Map<string, string>();
    let generated = 0;
    const server = createServer(async (request, response) => {
      const path = new URL(request.url!, upstream).pathname;
      const json = (data: unknown) => {
        response.writeHead(200, {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        });
        response.end(JSON.stringify(data));
      };
      if (path === "/api/auth/session")
        return json({
          user: { id: owner, displayName: "Cover fixture", isAdmin: false },
          configured: true,
        });
      if (path === "/api/invitations") return json({ invitations });
      if (path === "/api/favorites") return json({ favorites: [] });
      if (
        path === "/api/invitation-covers" ||
        path === "/api/static-images/preview"
      ) {
        generated++;
        response.writeHead(500);
        return response.end("Dashboard must use catalog posters");
      }
      try {
        const result = await fetch(new URL(request.url!, upstream), {
          headers: {
            ...request.headers,
            host: new URL(upstream).host,
          } as Record<string, string>,
          redirect: "manual",
          signal: AbortSignal.timeout(30000),
        });
        const headers = Object.fromEntries(result.headers);
        for (const key of [
          "content-encoding",
          "content-length",
          "transfer-encoding",
          "connection",
        ])
          delete headers[key];
        if (templates.some((template) => templatePoster(template) === path)) {
          hits.set(path, (hits.get(path) ?? 0) + 1);
          cacheHeaders.set(path, result.headers.get("cache-control") ?? "");
        }
        response.writeHead(result.status, headers);
        response.end(Buffer.from(await result.arrayBuffer()));
      } catch {
        response.writeHead(502);
        response.end("Fixture upstream unavailable");
      }
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const origin =
      "http://127.0.0.1:" + (server.address() as { port: number }).port;
    const browser = await chromium.launch({ headless: true });
    try {
      for (const first of ["catalog", "dashboard"] as const) {
        await t.test(first + " warms the other page's cache", async () => {
          const context = await browser.newContext({
            viewport: { width: 1280, height: 950 },
            reducedMotion: "reduce",
          });
          const page = await context.newPage();
          page.setDefaultTimeout(15000);
          const errors: string[] = [];
          page.on("pageerror", (error: Error) => errors.push(error.message));
          async function dashboard() {
            await page.goto(origin + "/dashboard");
            await page.locator("article").nth(2).waitFor();
            for (const template of templates) {
              const image = page
                .locator('article img[src="' + templatePoster(template) + '"]')
                .first();
              await image.scrollIntoViewIfNeeded();
              await image.evaluate((element: HTMLImageElement) =>
                element.decode(),
              );
            }
            assert.equal(await page.locator("main iframe").count(), 0);
            assert.equal(
              await page
                .getByText("Muqova tayyorlanmoqda…", { exact: true })
                .count(),
              0,
            );
            assert.ok(
              (await page
                .getByRole("heading", { name: "Nodir test & Madina test" })
                .count()) > 0,
            );
          }
          async function catalog() {
            await page.goto(origin + "/templates");
            for (const template of templates) {
              await page
                .getByRole("button", {
                  name:
                    template.format === "image"
                      ? "Rasm taklifnoma"
                      : "Veb taklifnoma",
                  exact: true,
                })
                .click();
              await page
                .getByPlaceholder("Dizayn nomini kiriting…")
                .fill(template.name);
              const image = page
                .locator('[data-template-id="' + template.id + '"] img')
                .first();
              await image.scrollIntoViewIfNeeded();
              assert.equal(
                await image.getAttribute("src"),
                templatePoster(template),
              );
              await image.evaluate((element: HTMLImageElement) =>
                element.decode(),
              );
            }
          }
          try {
            await (first === "catalog" ? catalog() : dashboard());
            const warmed = new Map(hits);
            for (const template of templates) {
              const path = templatePoster(template);
              assert.ok(
                (hits.get(path) ?? 0) > 0,
                "first page fetched " + path,
              );
              assert.match(cacheHeaders.get(path)!, /max-age=31536000/);
              assert.match(cacheHeaders.get(path)!, /immutable/);
            }
            await (first === "catalog" ? dashboard() : catalog());
            for (const template of templates) {
              const path = templatePoster(template);
              assert.equal(
                hits.get(path),
                warmed.get(path),
                "other page reused cached " + path,
              );
            }
            invitations[0].content["uz-Latn"].people[0] = "Edited name";
            owner = "another-fixture-owner";
            await dashboard();
            assert.ok(
              (await page
                .getByRole("heading", { name: /Edited name/ })
                .count()) > 0,
            );
            for (const template of templates)
              assert.equal(
                hits.get(templatePoster(template)),
                warmed.get(templatePoster(template)),
              );
            assert.equal(
              generated,
              0,
              "no screenshot or personalized image endpoint called",
            );
            assert.deepEqual(errors, []);
            invitations[0].content["uz-Latn"].people[0] = "Nodir test";
          } finally {
            await context.close();
          }
        });
      }
    } finally {
      await browser.close();
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  },
);
