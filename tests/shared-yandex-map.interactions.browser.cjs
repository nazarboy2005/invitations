const { chromium } = require("../apps/web/node_modules/playwright");
const assert = require("node:assert/strict");

// Optional browser regression; live-provider checks are separate from this
// predictable renderer test. Run against the local development server.
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.route("https://**/*", route => route.abort());
    for (const template of ["anor", "cloud-castle"]) {
      await page.goto(`http://127.0.0.1:3001/preview?template=${template}&qaSilent=1&qaReducedMotion=1`, { waitUntil: "domcontentloaded" });
      const source = page.frameLocator(`iframe[src*="${template}/"]`);
      const map = source.frameLocator('iframe[src*="/maps/venue?"]');
      const destination = map.getByRole("link", { name: "Joy xaritasi", exact: true });
      await destination.waitFor({ state: "attached" });
      const url = new URL(await destination.getAttribute("href"));
      assert.equal(url.hostname, "yandex.uz");
      assert.equal(url.searchParams.get("lang"), "uz_UZ");
      assert.equal(url.searchParams.get("pt"), "69.2797,41.3111,pm2rdm");
      assert.equal(await source.locator('[data-map-toggle]:visible,a[data-invitation-map-action]:visible').count(), 0);
      assert.equal(await destination.getAttribute("target"), "_top");
    }
    console.log("PASS: Anor and Cloud Castle show a clickable Uzbek Yandex destination without map-action buttons.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
