import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(path.resolve("apps/web/package.json"));
const { chromium } =
  require("playwright") as typeof import("../apps/web/node_modules/playwright");
const origin = process.env.CACHE_AUDIT_ORIGIN ?? "http://127.0.0.1:3002";
const browser = await chromium.launch({ headless: true });
try {
  for (const { mobile, reduced, saveData } of [
    { mobile: false, reduced: false, saveData: false },
    { mobile: true, reduced: false, saveData: false },
    { mobile: true, reduced: true, saveData: true },
  ]) {
    const context = await browser.newContext({
      viewport: mobile
        ? { width: 390, height: 844 }
        : { width: 1366, height: 900 },
      reducedMotion: reduced ? "reduce" : "no-preference",
    });
    if (saveData) {
      await context.addInitScript(() => {
        Object.defineProperty(navigator, "connection", {
          value: { saveData: true, effectiveType: "2g" },
        });
      });
    }
    // Block the unrelated SDK without disabling the real browser HTTP cache.
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setBlockedURLs", { urls: ["*telegram.org/*"] });
    const assets = new Set<string>();
    let bytes = 0;
    const failures: string[] = [];
    const paths = new Set<string>();
    cdp.on("Network.responseReceived", ({ requestId, response }) => {
      if (!response.url.startsWith(origin + "/_assets/")) return;
      assets.add(requestId);
      paths.add(new URL(response.url).pathname);
      if (response.status >= 400) failures.push(response.url);
    });
    cdp.on("Network.loadingFinished", ({ requestId, encodedDataLength }) => {
      if (assets.has(requestId)) bytes += encodedDataLength;
    });
    const transfers: number[] = [];
    for (let visit = 0; visit < 2; visit++) {
      assets.clear();
      bytes = 0;
      await page.goto(origin, { waitUntil: "load" });
      // Never scroll: even the last offscreen image must finish automatically.
      await page.waitForFunction(
        () => {
          const images = [
            ...document.querySelectorAll<HTMLImageElement>("main img"),
          ];
          return (
            images.length > 20 &&
            images.every((image) => image.complete && image.naturalWidth > 0)
          );
        },
        null,
        { timeout: 60_000 },
      );
      await page.waitForFunction(
        () =>
          performance
            .getEntriesByType("resource")
            .some((entry) =>
              entry.name.includes("/audio/site/paper-slide.mp3"),
            ),
        null,
        { timeout: 30_000 },
      );
      await page.waitForLoadState("networkidle");
      assert.equal(await page.evaluate(() => window.scrollY), 0);
      assert.equal(
        await page.locator("#paper-showcase [data-rendered]").count(),
        0,
        "background warming must not initialize offscreen paper renderers",
      );
      const sources = await page
        .locator("main img")
        .evaluateAll((images) =>
          images.map((img) => (img as HTMLImageElement).currentSrc),
        );
      assert.ok(
        sources.some((src) =>
          src.includes(
            mobile ? "invitation-scene-mobile.webp" : "invitation-scene.webp",
          ),
        ),
      );
      assert.ok(
        sources.some((src) =>
          src.includes(mobile ? "gallery-mobile.webp" : "gallery-desktop.webp"),
        ),
      );
      transfers.push(bytes);
    }
    assert.equal(failures.length, 0, failures.join("\n"));
    assert.ok(transfers[0] > 100_000);
    assert.ok(
      transfers[1] < transfers[0] * 0.01,
      "return visits must reuse cached assets",
    );
    assert.equal(
      [...paths].some((p) => p.endsWith("/paper/crumple.bin")),
      !reduced,
      "reduced motion skips geometry",
    );
    // Fast navigation after warming still uses working artwork.
    await page.locator("#paper-showcase").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    assert.equal(
      await page
        .locator("#paper-showcase img")
        .evaluateAll((images) =>
          images.every((img) => (img as HTMLImageElement).naturalWidth > 0),
        ),
      true,
    );
    console.log(
      JSON.stringify({
        mobile,
        reduced,
        saveData,
        firstBytes: transfers[0],
        repeatBytes: transfers[1],
        assets: paths.size,
        failures,
      }),
    );
    await context.close();
  }
} finally {
  await browser.close();
}
