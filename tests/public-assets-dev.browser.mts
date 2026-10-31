import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const require = createRequire(path.resolve("apps/web/package.json"));
const { chromium } =
  require("playwright") as typeof import("../apps/web/node_modules/playwright");
const origin = process.env.CACHE_AUDIT_ORIGIN ?? "http://127.0.0.1:3001";
const browser = await chromium.launch({ headless: true });
const results: object[] = [];
try {
  for (const viewport of [
    { width: 1366, height: 900 },
    { width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setBlockedURLs", { urls: ["*telegram.org/*"] });
    const failures: string[] = [];
    page.on("response", (response) => {
      const url = new URL(response.url());
      if (
        url.origin === origin &&
        /^\/(?:images|templates\/|_assets\/|_next\/image)/.test(url.pathname) &&
        response.status() >= 400
      ) {
        failures.push(`${response.status()} ${url.pathname}`);
      }
    });
    for (const mode of ["navigation", "refresh", "uncached refresh"]) {
      if (mode === "uncached refresh")
        await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
      if (mode === "navigation")
        await page.goto(origin, { waitUntil: "domcontentloaded" });
      else await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => {
        const image = document.querySelector<HTMLImageElement>(
          'img[src*="invitation-scene"]',
        );
        return image?.complete && image.naturalWidth > 0;
      });
      const source = await page
        .locator('img[src*="invitation-scene"]')
        .first()
        .evaluate((image: HTMLImageElement) => image.currentSrc);
      assert.ok(source.startsWith(origin + "/images/home/"), source);
      for (const selector of [
        "#occasions",
        "#templates",
        "#why-us",
        "#how-it-works",
        "footer",
      ]) {
        await page.locator(selector).first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
      }
      results.push({ width: viewport.width, mode, heroLoaded: true });
    }
    await page.goto(origin + "/templates", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() =>
      [...document.querySelectorAll<HTMLImageElement>("main img")].some(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    );
    assert.deepEqual(failures, []);
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await mkdir(".data/cache-verification", { recursive: true });
    await page.screenshot({
      path: `.data/cache-verification/dev-${viewport.width}.png`,
    });
    await context.close();
  }
  console.log(
    JSON.stringify({ refreshChecks: results, failedAssets: 0 }, null, 2),
  );
} finally {
  await browser.close();
}
