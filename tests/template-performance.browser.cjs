// Real motion and media on a phone-sized viewport; requires local server :3001.
const { chromium } = require("../apps/web/node_modules/playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.CHROME_PATH ||
      "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "no-preference",
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    const session = await page.context().newCDPSession(page);
    await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.goto("http://127.0.0.1:3001/preview?template=anor&qaSilent=1", {
      waitUntil: "domcontentloaded",
    });
    await page
      .getByRole("status")
      .waitFor({ state: "detached", timeout: 30000 });
    const frame = page
      .frames()
      .find((frame) => /\/templates\/anor\//.test(frame.url()));
    await frame.evaluate(() => {
      document.documentElement.classList.remove("is-locked");
      const style = document.createElement("style");
      style.textContent =
        "@keyframes qa-spin{to{transform:rotate(360deg)}} #qa-effects{position:absolute;top:14000px;width:300px;height:500px;background:white;z-index:999999} #qa-effects div{width:20px;height:20px;background:red} #qa-css{animation:qa-spin 2s linear infinite}";
      document.head.append(style);
      const section = document.createElement("section");
      section.id = "qa-effects";
      section.innerHTML =
        '<div id="qa-css"></div><div id="qa-waapi"></div><div id="qa-paused"></div><div id="qa-gsap"></div><video id="qa-video" muted loop playsinline style="width:220px;height:200px" src="/templates/oqqushlar/assets/bg-loop.mp4"></video>';
      document.body.append(section);
      const waapi = document
        .getElementById("qa-waapi")
        .animate([{ opacity: 0.3 }, { opacity: 1 }], {
          duration: 2000,
          iterations: Infinity,
        });
      const paused = document
        .getElementById("qa-paused")
        .animate([{ opacity: 0.3 }, { opacity: 1 }], {
          duration: 2000,
          iterations: Infinity,
        });
      paused.pause();
      const tween = window.gsap?.to("#qa-gsap", {
        rotation: 360,
        duration: 2,
        repeat: -1,
      });
      const video = document.getElementById("qa-video");
      video.muted = true;
      void video.play().catch(() => {});
      window.__qaEffects = { waapi, paused, tween, video };
    });
    await frame.waitForFunction(() => {
      const s = window.__qaEffects;
      return (
        s.waapi.playState === "paused" &&
        document.getElementById("qa-css").getAnimations()[0]?.playState ===
          "paused" &&
        s.video.paused &&
        (!s.tween || s.tween.paused())
      );
    });
    const before = await frame.evaluate(() => ({
      time: window.__qaEffects.waapi.currentTime,
      css: document.getElementById("qa-css").getAnimations()[0].currentTime,
    }));
    await page.waitForTimeout(300);
    const stopped = await frame.evaluate(() => ({
      time: window.__qaEffects.waapi.currentTime,
      css: document.getElementById("qa-css").getAnimations()[0].currentTime,
    }));
    assert.ok(
      Math.abs(stopped.time - before.time) < 40 &&
        Math.abs(stopped.css - before.css) < 40,
      "offscreen CSS and WAAPI clocks stop",
    );

    await frame.evaluate(() =>
      document.getElementById("qa-effects").scrollIntoView(),
    );
    await frame.waitForFunction(() => {
      const s = window.__qaEffects;
      return (
        s.waapi.playState === "running" &&
        document.getElementById("qa-css").getAnimations()[0]?.playState ===
          "running" &&
        !s.video.paused &&
        s.video.currentTime > 0.1 &&
        (!s.tween || !s.tween.paused())
      );
    });
    assert.equal(
      await frame.evaluate(() => window.__qaEffects.paused.playState),
      "paused",
      "source-owned paused animation stays paused",
    );
    const videoBefore = await frame.evaluate(
      () => window.__qaEffects.video.currentTime,
    );
    await frame.evaluate(() => scrollTo(0, 0));
    await frame.waitForFunction(
      () =>
        window.__qaEffects.video.paused &&
        window.__qaEffects.waapi.playState === "paused",
    );
    const atPause = await frame.evaluate(
      () => window.__qaEffects.video.currentTime,
    );
    await page.waitForTimeout(350);
    assert.equal(
      await frame.evaluate(() => window.__qaEffects.video.currentTime),
      atPause,
      "offscreen video retains its current frame",
    );
    assert.ok(atPause >= videoBefore, "pausing never resets video time");
    await frame.evaluate(() =>
      document.getElementById("qa-effects").scrollIntoView(),
    );
    await frame.waitForFunction(
      (time) =>
        !window.__qaEffects.video.paused &&
        window.__qaEffects.video.currentTime > time,
      atPause,
    );

    // Pausing the outer preview also suspends its nested document's effects.
    await page.locator("main iframe").evaluate((frame) => {
      frame.style.visibility = "hidden";
      frame.style.display = "none";
    });
    await frame.waitForFunction(
      () =>
        window.__qaEffects.waapi.playState === "paused" &&
        window.__qaEffects.video.paused,
    );
    await page.locator("main iframe").evaluate((frame) => {
      frame.style.visibility = "";
      frame.style.display = "";
    });
    await frame.waitForFunction(
      () =>
        window.__qaEffects.waapi.playState === "running" &&
        !window.__qaEffects.video.paused,
    );

    // Real template animations survive repeated departures and returns.
    await frame.evaluate(() => {
      document.getElementById("qa-effects").remove();
      scrollTo(0, 0);
    });
    assert.ok(
      await frame.evaluate(() => document.getAnimations().length > 0),
      "original template animations retained",
    );
    await session.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    const media = JSON.parse(
      fs.readFileSync("apps/web/src/generated/template-media.json", "utf8"),
    );
    for (const path of [
      "/templates/oltin-lahza/assets/images/oltin-lahza/footerimage.png",
      "/templates/shisha-naqshi/assets/intro-doors-c.mp4",
    ]) {
      const entry = media[path];
      assert.ok(
        entry && entry.bytes < entry.originalBytes * 0.9,
        `${path}: useful size reduction`,
      );
      const response = await page.request.get("http://127.0.0.1:3001" + path);
      assert.equal(response.status(), 200);
      assert.equal(
        (await response.body()).length,
        entry.bytes,
        `${path}: optimized bytes actually served through original URL`,
      );
      assert.match(
        response.headers()["content-type"],
        entry.kind === "video" ? /video\/mp4/ : /image\/webp/,
      );
      const { version } = JSON.parse(
        fs.readFileSync(
          "apps/web/src/generated/public-asset-version.json",
          "utf8",
        ),
      );
      const versioned = await page.request.get(
        `http://127.0.0.1:3001/_assets/${version}${path}`,
      );
      assert.equal(versioned.status(), 200);
      assert.equal(
        (await versioned.body()).length,
        entry.bytes,
        "versioned media routes serve the derivative too",
      );
      if (entry.kind === "video") {
        const range = await page.request.get("http://127.0.0.1:3001" + path, {
          headers: { Range: "bytes=0-1023" },
        });
        assert.equal(
          range.status(),
          206,
          "video range requests survive rewriting",
        );
        assert.equal((await range.body()).length, 1024);
      }
    }
    for (const template of ["shisha-naqshi", "sunset", "oqqushlar"]) {
      await page.goto(
        `http://127.0.0.1:3001/preview?template=${template}&qaSilent=1`,
        { waitUntil: "domcontentloaded" },
      );
      await page
        .getByRole("status")
        .waitFor({ state: "detached", timeout: 30000 });
      const source = page
        .frames()
        .find((frame) => frame.url().includes(`/templates/${template}/`));
      await source.locator("[data-chorlove-open]").click();
      await source.waitForFunction(
        () => document.querySelector("video")?.currentTime > 0.1,
      );
      await source.waitForFunction(
        () =>
          document.querySelector("[data-chorlove-template]")?.dataset.opened ===
          "true",
        null,
        { timeout: 16000 },
      );
    }
    await page.goto(
      "http://127.0.0.1:3001/preview?template=evelina&qaSilent=1",
      { waitUntil: "domcontentloaded" },
    );
    await page
      .getByRole("status")
      .waitFor({ state: "detached", timeout: 30000 });
    const evelina = page
      .frames()
      .find((frame) => frame.url().includes("/templates/baxt-kaliti/"));
    assert.equal(
      await evelina
        .locator('img[src$="inner-video.gif"]')
        .getAttribute("loading"),
      "lazy",
      "large animated GIF is retained and loads near its section",
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS: offscreen CSS/WAAPI/GSAP loops and videos pause/resume in place; source pauses preserved; outer-frame visibility; real animations retained; optimized HTTP media and video ranges. Phone viewport, 4x CPU throttle.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
