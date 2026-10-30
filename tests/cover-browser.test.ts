import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  CoverBrowser,
  captureCoverPixels,
} from "../apps/web/src/server/cover-browser";

const webRequire = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { chromium } = webRequire("playwright-core");
const sharp = webRequire("sharp");

test(
  "warm browser isolates drafts, captures despite a stalled font, and recovers after discard",
  { timeout: 30000 },
  async () => {
    let launches = 0;
    const pool = new CoverBrowser(async () => {
      launches++;
      return chromium.launch({ headless: true });
    });
    const first = await pool.acquire();
    try {
      const context = await first.newContext({
        viewport: { width: 480, height: 800 },
      });
      await context.addInitScript(() => {
        (window as any).privateDraft = "first owner";
      });
      await context.route("https://cover.test/**", async (route) => {
        if (route.request().url().endsWith("font.woff2")) return;
        if (route.request().url().includes("/templates/")) {
          await route.fulfill({
            contentType: "text/html",
            body: '<style>body{margin:0}#hero{width:120px;height:160px;background:red}</style><div id="hero"></div>',
          });
          return;
        }
        await route.fulfill({
          contentType: "text/html",
          body: `
        <style>@font-face{font-family:pending;src:url('/font.woff2')}body{margin:0;background:rgb(200,100,50)}span{font-family:pending}</style>
        <span>Personalized cover</span><iframe src="/templates/hero"></iframe>`,
        });
      });
      const page = await context.newPage();
      await page.goto("https://cover.test/preview", {
        waitUntil: "domcontentloaded",
      });
      assert.equal(
        await page.evaluate(() => (window as any).privateDraft),
        "first owner",
      );
      const started = Date.now();
      const bytes = await captureCoverPixels(page);
      assert.ok(Date.now() - started < 5000);
      const image = await sharp(bytes).metadata();
      assert.equal(image.width, 480);
      assert.equal(image.height, 800);
      await page.frames()[1].waitForLoadState("domcontentloaded");
      const cropped = await sharp(
        await captureCoverPixels(page, "#hero"),
      ).metadata();
      assert.equal(cropped.width, 120);
      assert.equal(cropped.height, 160);
      await context.close();
      pool.release(first);
      const second = await pool.acquire();
      assert.equal(second, first);
      assert.equal(launches, 1);
      const isolated = await second.newContext();
      const isolatedPage = await isolated.newPage();
      assert.equal(
        await isolatedPage.evaluate(() => (window as any).privateDraft),
        undefined,
      );
      await isolated.close();
      await pool.discard(second);
      const replacement = await pool.acquire();
      assert.notEqual(replacement, first);
      assert.equal(launches, 2);
      await pool.discard(replacement);
    } finally {
      await pool.discard(first);
    }
  },
);
