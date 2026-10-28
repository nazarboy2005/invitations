const { chromium } = require("../apps/web/node_modules/playwright"),
  assert = require("assert/strict"),
  fs = require("fs");
(async () => {
  const b = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const p = await b.newPage({ reducedMotion: "reduce" });
  await p.route("https://**/*", (r) => r.abort());
  await p.addInitScript(() => {
    window.__qaMessages = [];
    addEventListener("message", (e) => window.__qaMessages.push(e.data));
  });
  await p.goto("http://127.0.0.1:3001/preview?template=anor&qaSilent=1", {
    waitUntil: "domcontentloaded",
  });
  const f = p.frameLocator('iframe[src*="anor/source/index.html"]');
  await f
    .locator("[data-map-toggle][data-google-bound]")
    .waitFor({ state: "attached" });
  await f.locator("[data-map-toggle]").evaluate((e) => e.click());
  assert.match(
    await f.locator(".venue__map iframe").getAttribute("src"),
    /^https:\/\/www.google.com\/maps/,
  );
  const msg = await f
    .locator("body")
    .evaluate(() =>
      window.__qaMessages.find((m) => m.type === "taklifnoma:initialize"),
    );
  msg.payload.data.venue.mapUrl = "https://maps.app.goo.gl/manual-shared-test";
  await p.evaluate(
    (m) =>
      document
        .querySelector("main iframe")
        .contentWindow.postMessage(m, location.origin),
    msg,
  );
  await p.waitForTimeout(100);
  const links = await f
    .locator("[data-map]")
    .evaluateAll((xs) => xs.map((x) => x.href));
  assert.ok(links.every((x) => x === msg.payload.data.venue.mapUrl));
  fs.writeFileSync(
    "docs/templates/tort-fasl-verification/anor-google-maps.json",
    JSON.stringify(
      {
        googleEmbed: true,
        manualUrl: msg.payload.data.venue.mapUrl,
        allControlsFollowManualUrl: true,
      },
      null,
      2,
    ),
  );
  await b.close();
  console.log("Anor Google embed and manual URL pass");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
