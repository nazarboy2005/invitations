// Run against the local web server. Held responses prove dependency order,
// avoiding timing assertions that vary with dev compilation or the network.
const { chromium } = require("../apps/web/node_modules/playwright");
const assert = require("node:assert/strict");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  let releaseMusic, releaseLater, releaseOpening;
  const musicGate = new Promise(resolve => { releaseMusic = resolve; });
  const laterGate = new Promise(resolve => { releaseLater = resolve; });
  const openingGate = new Promise(resolve => { releaseOpening = resolve; });
  let musicRequested = false, laterRequested = false, openingRequested = false;
  try {
    await page.route("**/api/music", async route => {
      musicRequested = true;
      await musicGate;
      await route.fulfill({ json: { tracks: [{ url: "/music/catalog/classical/01-pachelbel-canon.mp3", filename: "Cached library track" }] } }).catch(() => {});
    });
    await page.route("**/templates/anor/source/index.html*", async route => {
      const response = await route.fetch();
      const html = (await response.text()).replace("</body>", '<img id="qa-later" src="/__qa__/later.png" style="position:absolute;top:10000px;width:20px;height:20px" alt=""> </body>');
      await route.fulfill({ response, body: html });
    });
    await page.route("**/__qa__/later.png", async route => {
      laterRequested = true;
      await laterGate;
      await route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1sAAAAASUVORK5CYII=", "base64") });
    });
    await page.route("**/__qa__/lookahead.png", route => route.fulfill({ status: 204 }));
    await page.route("**/templates/anor/source/art/stage.webp", async route => {
      openingRequested = true;
      await openingGate;
      await route.continue();
    });
    await page.goto("http://127.0.0.1:3001/preview?template=anor&qaSilent=1", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => !!document.querySelector("iframe")?.contentDocument?.documentElement?.dataset.fotihaInitialized);
    assert.ok(musicRequested && laterRequested && openingRequested);
    assert.equal(await page.getByRole("status").count(), 1, "opening artwork must be ready before revealing");
    releaseOpening();
    await page.getByRole("status").waitFor({ state: "detached", timeout: 10000 });
    const source = page.frames().find(frame => /\/templates\/anor\//.test(frame.url()));
    assert.equal(await source.evaluate(() => document.readyState), "interactive", "reveal while offscreen eager image still blocks load");
    assert.ok((await source.locator('[data-slot="groom"]').first().textContent()).trim(), "actual invitation content initialized before reveal");
    assert.ok(await source.locator(".intro__stage").evaluate(image => image.complete && image.naturalWidth > 0));
    const selected = await page.evaluate(() => sessionStorage.getItem("fotiha:preview-music"));
    assert.ok(selected, "bundled music selected without waiting for music API");

    // A near-future image starts before entering the viewport, even if inserted later.
    await source.evaluate(() => {
      // The opening normally removes this scroll lock when the envelope opens.
      document.documentElement.classList.remove("is-locked");
      const image = document.createElement("img");
      image.id = "qa-lookahead";
      image.loading = "lazy";
      image.style.cssText = "position:absolute;top:150vh;width:20px;height:20px";
      image.src = "/__qa__/lookahead.png";
      document.body.append(image);
    });
    await source.waitForFunction(() => document.getElementById("qa-lookahead").loading === "eager");
    releaseMusic();
    await page.waitForFunction(() => !!sessionStorage.getItem("fotiha:preview-music-library:v1"));
    assert.equal(await page.evaluate(() => sessionStorage.getItem("fotiha:preview-music")), selected, "background library fetch never changes the current track");
    releaseLater();
    await source.waitForLoadState("load");
    await page.goto("http://127.0.0.1:3001/preview?template=anor&qaSilent=1", { waitUntil: "domcontentloaded" });
    await page.getByRole("status").waitFor({ state: "detached", timeout: 20000 });
    const next = await page.evaluate(() => sessionStorage.getItem("fotiha:preview-music"));
    assert.ok(["/music/catalog/emotional-piano.mp3", "/music/catalog/classical/01-pachelbel-canon.mp3"].includes(next), `next opening uses refreshed library: ${next}`);

    // These families use different initialization protocols and opening styles.
    for (const template of ["gulchambar", "oltin-lahza", "safir", "kapalak", "yulduzli-tun", "fayzli-xonadon", "zarrin-doppi", "islomiy"]) {
      const navigations = [];
      const navigated = frame => { if (/\/templates\//.test(frame.url())) navigations.push(frame.url()); };
      page.on("framenavigated", navigated);
      await page.goto(`http://127.0.0.1:3001/preview?template=${template}&qaSilent=1`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => !!document.querySelector("main iframe")?.contentDocument?.documentElement?.dataset.fotihaInitialized, { timeout: 20000 });
      await page.getByRole("status").waitFor({ state: "detached", timeout: 15000 });
      assert.ok(await page.locator("main iframe").evaluate(frame => frame.contentDocument.body.innerText.trim().length > 20), `${template}: initialized source content`);
      if (["gulchambar", "oltin-lahza", "safir"].includes(template)) assert.equal(navigations.length, 1, `${template}: no redundant initialization reload`);
      page.off("framenavigated", navigated);
    }
    assert.deepEqual(errors, []);
    console.log("PASS: critical artwork gate; nonblocking music and later assets; initialized content; image lookahead; stable track; refreshed library; eight additional renderer smoke checks");
  } finally {
    releaseOpening(); releaseMusic(); releaseLater();
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
