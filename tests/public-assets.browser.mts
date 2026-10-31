import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import {
  publicAsset,
  publicAssetPrefix,
} from "../apps/web/src/lib/public-asset";
import { publicTemplateId } from "../packages/contracts/src/index";

const require = createRequire(path.resolve("apps/web/package.json"));
const { chromium } =
  require("playwright") as typeof import("../apps/web/node_modules/playwright");
const origin = process.env.CACHE_AUDIT_ORIGIN ?? "http://127.0.0.1:3002";
const output = path.resolve(".data/cache-verification");
await mkdir(output, { recursive: true });
const immutable = "public, max-age=31536000, immutable";

for (const asset of [
  "/images/home/invitation-scene.webp",
  "/audio/site/water-drop.mp3",
  "/templates/anor/source/index.html",
  "/templates/cloud-castle/index.html",
  "/templates/anor/fonts.css",
  "/templates/anor/source/art/stage.webp",
]) {
  const response = await fetch(origin + publicAsset(asset));
  assert.equal(response.status, 200, asset);
  assert.equal(response.headers.get("cache-control"), immutable, asset);
  if (asset === "/templates/cloud-castle/index.html")
    assert.ok((await response.text()).includes(publicAssetPrefix));
}
for (const asset of [
  "/templates/velora/source/velora.html",
  "/templates/velora/source/velora%2ehtml",
  "/templates/invitate-wedding/assets/captured/5b73decb38ff5c8c.js",
  "/images/home/missing.webp",
  "/api/auth/session",
]) {
  const response = await fetch(origin + publicAssetPrefix + asset);
  assert.equal(response.status, 404, asset);
  assert.equal(response.headers.get("cache-control"), "no-store", asset);
}
const stale = await fetch(
  origin + "/_assets/00000000000000000000/images/home/invitation-scene.webp",
);
assert.equal(stale.status, 404);
assert.equal(stale.headers.get("cache-control"), "no-store");
for (const endpoint of [
  "/api/auth/session",
  "/api/invitations",
  "/api/catalog",
]) {
  const response = await fetch(origin + endpoint);
  assert.match(
    response.headers.get("cache-control") ?? "",
    /no-store/,
    endpoint,
  );
}
const original = await fetch(origin + "/images/home/invitation-scene.webp");
const versioned = await fetch(
  origin + publicAsset("/images/home/invitation-scene.webp"),
);
assert.deepEqual(
  Buffer.from(await versioned.arrayBuffer()),
  Buffer.from(await original.arrayBuffer()),
);
const range = await fetch(origin + publicAsset("/audio/site/water-drop.mp3"), {
  headers: { Range: "bytes=0-99" },
});
assert.equal(range.status, 206);
assert.equal((await range.arrayBuffer()).byteLength, 100);

const browser = await chromium.launch({ headless: true });
const visits: object[] = [];
const frameResults: object[] = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  // Routing interception disables Chromium's HTTP cache. Block only the third-
  // party SDK through CDP so first/repeat visits exercise the real browser cache.
  await cdp.send("Network.setBlockedURLs", { urls: ["*telegram.org/*"] });
  let bytes = 0;
  let requests = 0;
  let cached = 0;
  let legacy = 0;
  const assets = new Set<string>();
  const cachedRequests = new Set<string>();
  const failures: string[] = [];
  cdp.on("Network.responseReceived", (event) => {
    const url = new URL(event.response.url);
    if (
      url.origin !== origin ||
      !/^\/(?:images|templates|audio|music|_assets)\//.test(url.pathname)
    )
      return;
    assets.add(event.requestId);
    requests++;
    if (event.response.fromDiskCache || event.response.fromPrefetchCache)
      cached++;
    if (!url.pathname.startsWith(publicAssetPrefix)) legacy++;
    if (event.response.status >= 400)
      failures.push(`${event.response.status} ${url.pathname}`);
  });
  cdp.on("Network.loadingFinished", (event) => {
    if (assets.has(event.requestId)) bytes += event.encodedDataLength;
  });
  cdp.on("Network.requestServedFromCache", (event) => {
    cachedRequests.add(event.requestId);
  });
  const transfers: number[] = [];
  for (let pass = 0; pass < 2; pass++) {
    bytes = requests = cached = legacy = 0;
    assets.clear();
    cachedRequests.clear();
    await page.goto(origin, { waitUntil: "networkidle" });
    if (pass === 0)
      await page.screenshot({ path: path.join(output, "desktop.png") });
    for (const selector of [
      "#occasions",
      "#templates",
      "#why-us",
      "#how-it-works",
      "footer",
    ]) {
      await page.locator(selector).first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
    }
    await page.waitForTimeout(800);
    transfers.push(bytes);
    visits.push({
      pass,
      assetRequests: requests,
      networkBytes: bytes,
      browserCacheResponses: Math.max(cached, [...assets].filter((id) => cachedRequests.has(id)).length),
      unversionedRequests: legacy,
    });
    assert.equal(
      legacy,
      0,
      "landing assets all use the shared versioned namespace",
    );
  }
  assert.equal(failures.length, 0, failures.join("\n"));
  assert.ok(transfers[0] > 100_000, "first visit must exercise real transfers");
  assert.ok(
    transfers[1] < transfers[0] * 0.01,
    "repeat visit reuses public asset bodies",
  );

  for (const id of [
    "anor",
    "aurelia",
    "cloud-castle",
    "taklifla-qogoz-ertagi",
  ]) {
    await page.goto(
      `${origin}/preview?template=${encodeURIComponent(publicTemplateId(id))}&card=1`,
      { waitUntil: "networkidle" },
    );
    await page.waitForFunction(() =>
      [...document.querySelectorAll("iframe")].some(
        (frame) =>
          frame.src.includes("/_assets/") &&
          frame.contentDocument?.readyState === "complete",
      ),
    );
    const frame = page
      .frames()
      .find((item) =>
        item.url().startsWith(origin + publicAssetPrefix + "/templates/"),
      );
    assert.ok(frame, id);
    await frame.waitForFunction(
      () => document.body.innerText.trim().length > 20,
    );
    frameResults.push({ template: id, frame: new URL(frame.url()).pathname });
  }
  assert.equal(failures.length, 0, failures.join("\n"));
  await context.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const mobilePage = await mobile.newPage();
  const session = await mobile.newCDPSession(mobilePage);
  await session.send("Network.enable");
  await session.send("Network.setBlockedURLs", { urls: ["*telegram.org/*"] });
  const heroRequests: string[] = [];
  session.on("Network.requestWillBeSent", (event) => {
    if (event.request.url.includes("invitation-scene"))
      heroRequests.push(event.request.url);
  });
  await mobilePage.goto(origin, { waitUntil: "networkidle" });
  await mobilePage.screenshot({ path: path.join(output, "mobile.png") });
  assert.equal(
    heroRequests.length,
    1,
    "mobile picture and CSS background reuse the same image URL",
  );
  assert.ok(heroRequests[0].endsWith("invitation-scene-mobile.webp"));
  assert.equal(
    await mobilePage.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await mobile.close();
  const result = {
    visits,
    frames: frameResults,
    mobileHeroRequests: heroRequests.length,
    headersAndPrivacy: "passed",
  };
  await writeFile(
    path.join(output, "results.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
