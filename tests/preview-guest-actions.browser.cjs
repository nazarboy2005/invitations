// Run with the local web server on :3001. External calendar pages are never opened.
const { chromium } = require("../apps/web/node_modules/playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const output = path.resolve("docs/qa/2026-11-08-guest-actions");
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.CHROME_PATH ||
      "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const report = [];
  try {
    // The minimal loader remains visible while a source document is delayed.
    await page.route("**/templates/anor/source/index.html*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.continue();
    });
    await page.goto("http://127.0.0.1:3001/preview?template=anor&qaSilent=1");
    // The outer page load waits for the frame; check the live transition on reload.
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("status").waitFor();
    assert.equal(await page.getByRole("status").innerText(), "Taklifnoma ochilmoqda…");
    assert.equal(await page.getByRole("status").locator("img").count(), 0);
    await page.screenshot({ path: path.join(output, "preview-loader.png") });
    await page
      .getByRole("status")
      .waitFor({ state: "detached", timeout: 20000 });
    await page.unroute("**/templates/anor/source/index.html*");

    let lastMusic = "";
    for (const template of [
      "anor",
      "atlas",
      "oq-kabutar",
      "stained-glass",
      "royal-burgundy-edition",
      "wedivo-pulau-sehati",
    ]) {
      await page.goto(
        `http://127.0.0.1:3001/preview?template=${template}&qaSilent=1`,
        { waitUntil: "domcontentloaded" },
      );
      await page
        .locator("main iframe")
        .first()
        .waitFor({ state: "attached", timeout: 20000 });
      await page
        .getByRole("status")
        .waitFor({ state: "detached", timeout: 25000 });
      const source = page
        .frames()
        .find((frame) => /\/templates\//.test(frame.url()));
      assert.ok(source, `${template}: source frame mounted`);
      const music = await page.evaluate(() =>
        sessionStorage.getItem("fotiha:preview-music"),
      );
      assert.ok(music);
      assert.notEqual(
        music,
        lastMusic,
        `${template}: fresh preview does not repeat the last track`,
      );
      lastMusic = music;
      assert.equal(await page.locator("dialog[data-fotiha-calendar]").count(), 0);
      if (template === "anor") {
        const downloadPromise = page.waitForEvent("download");
        await source.locator("[data-ics]").evaluate(button => button.click());
        const download = await downloadPromise;
        assert.match(download.suggestedFilename(), /\.ics$/);
        const file = fs.readFileSync(await download.path(), "utf8");
        assert.match(file, /BEGIN:VCALENDAR/);
        assert.match(file, /DTSTART:\d{8}T\d{6}Z/);
      }
      report.push({ template, music, nativeCalendarRestored: true });
    }
    const fixture = JSON.parse(
      require("node:child_process").execFileSync(
        process.execPath,
        [
          "--import",
          "tsx",
          "-e",
          "const { completeInvitation } = require('./tests/fixtures/publication.ts'); console.log(JSON.stringify(completeInvitation()));",
        ],
        { encoding: "utf8" },
      ),
    );
    fixture.music = {
      enabled: true,
      assetId: null,
      url: "/music/catalog/classical/01-pachelbel-canon.mp3",
      filename: "Creator-selected Canon",
    };
    await page.evaluate(
      (invitation) =>
        sessionStorage.setItem(
          `taklifnoma:full-preview:v1:${invitation.id}`,
          JSON.stringify(invitation),
        ),
      fixture,
    );
    await page.goto(
      `http://127.0.0.1:3001/preview?template=anor&draft=${fixture.id}&qaSilent=1`,
      { waitUntil: "domcontentloaded" },
    );
    await page
      .locator("main iframe")
      .first()
      .waitFor({ state: "attached", timeout: 20000 });
    await page
      .getByRole("status")
      .waitFor({ state: "detached", timeout: 25000 });
    const creatorFrame = page
      .frames()
      .find((frame) => /\/templates\//.test(frame.url()));
    assert.ok(
      (
        await creatorFrame.locator("audio").first().getAttribute("src")
      ).endsWith(fixture.music.url),
    );
    assert.equal(
      await page.evaluate(() => sessionStorage.getItem("fotiha:preview-music")),
      lastMusic,
    );
    const creatorDownloadPromise = page.waitForEvent("download");
    await creatorFrame.locator("[data-ics]").evaluate(button => button.click());
    const creatorDownload = await creatorDownloadPromise;
    const creatorCalendar = fs.readFileSync(await creatorDownload.path(), "utf8");
    assert.match(creatorCalendar, /Nodir test/);
    assert.match(creatorCalendar, /DTSTART:20270614T133000Z/);
    assert.equal(await page.locator("dialog[data-fotiha-calendar]").count(), 0);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("http://127.0.0.1:3001/preview?template=anor&qaSilent=1", {
      waitUntil: "domcontentloaded",
    });
    await page
      .getByRole("status")
      .waitFor({ state: "detached", timeout: 25000 });
    await page.screenshot({ path: path.join(output, "preview-desktop.png") });
    const response = await page.request.get("http://127.0.0.1:3001/", {
      headers: { "user-agent": "TelegramBot (like TwitterBot)" },
    });
    const html = await response.text();
    assert.match(
      html,
      /property="og:title" content="Fotiha — Elektron taklifnomalar"/,
    );
    assert.match(html, /property="og:image:width" content="256"/);
    assert.match(html, /name="twitter:card" content="summary"/);
    assert.doesNotMatch(html, /Quron ilovasi/i);
    assert.deepEqual(errors, []);
    fs.writeFileSync(
      path.join(output, "browser-report.json"),
      JSON.stringify(
        {
          report,
          errors,
          metadata: "passed",
          creatorMusicAndCalendar: "passed",
        },
        null,
        2,
      ),
    );
    console.log(JSON.stringify(report));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
