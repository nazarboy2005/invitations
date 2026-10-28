const { chromium } = require("../apps/web/node_modules/playwright");
const fs = require("fs"),
  assert = require("assert/strict");
const out = "apps/web/src/templates/taklifla-tort-fasl/qa";
fs.mkdirSync(out, { recursive: true });
const fixture = JSON.parse(
  fs.readFileSync(".tmp-fasllar-fixture.json", "utf8"),
);
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const report = {
    browser: browser.version(),
    viewports: [],
    checks: [],
    errors: [],
    failedRequests: [],
    httpErrors: [],
  };
  for (const vp of [
    { width: 390, height: 844 },
    { width: 1280, height: 800 },
    { width: 320, height: 740 },
  ]) {
    const page = await browser.newPage({ viewport: vp });
    page.on("pageerror", (e) => report.errors.push(e.message));
    page.on("requestfailed", (r) =>
      report.failedRequests.push({ url: r.url(), error: r.failure() }),
    );
    page.on("response", (r) => {
      if (r.status() >= 400)
        report.httpErrors.push({ url: r.url(), status: r.status() });
    });
    await page.goto("http://127.0.0.1:3086");
    const frame = page.frames()[1];
    await frame.waitForSelector(".fs-ready");
    await frame.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${out}/opening-${vp.width}.png` });
    assert.equal(
      await frame.locator("#fs-splash-n1").innerText(),
      fixture.payload.variants["uz-Latn"].people[0],
    );
    assert.equal(
      await frame.locator("#fs-events .fs-ev-row").count(),
      fixture.payload.variants["uz-Latn"].program.length,
    );
    assert.equal(await frame.locator('[id^="fs-particles-"] img').count(), 82);
    await frame.locator("#fs-open").click();
    assert.equal(
      await frame.locator("#fs-splash").evaluate((e) => e.style.opacity),
      "0",
    );
    await page.waitForTimeout(1050);
    assert.equal(
      await frame
        .locator("#fs-splash")
        .evaluate((e) => getComputedStyle(e).display),
      "none",
    );
    await page.screenshot({ path: `${out}/hero-${vp.width}.png` });
    for (const section of ["fs-summer", "fs-autumn", "fs-winter"]) {
      await frame.locator("#" + section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
    }
    await page.screenshot({
      path: `${out}/full-${vp.width}.png`,
      fullPage: true,
    });
    const overflow = await frame.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    assert.equal(overflow, false);
    const motion = await frame.evaluate(() => ({
      particle: getComputedStyle(
        document.querySelector("#fs-particles-winter img"),
      ).animationName,
      parallax: document.querySelector("[data-plx]").style.transform,
      background: document.body.style.backgroundColor,
    }));
    assert.match(motion.particle, /^fsFall[LR]$/);
    assert.match(motion.parallax, /translateY/);
    report.viewports.push({ ...vp, overflow, motion });
    // Every locale switches authored values and source controls together.
    for (const locale of fixture.payload.enabledLocales) {
      await frame.locator(`.fs-lang [data-lang="${locale}"]`).click();
      assert.equal(await frame.locator("html").getAttribute("lang"), locale);
      assert.equal(
        await frame.locator("#fs-hero-n1").innerText(),
        fixture.payload.variants[locale].people[0],
      );
      assert.equal(
        await frame.locator("#fs-winter-date").innerText(),
        fixture.payload.variants[locale].dateLong,
      );
      assert.equal(
        await frame.locator('[data-i18n="wish_send"]').innerText(),
        await frame.evaluate(
          () => window.fasllarLabels[document.documentElement.lang].wish_send,
        ),
      );
    }
    // Blank author fields never pick up archive demo data. Long names stay inside.
    const stress = structuredClone(fixture);
    stress.payload.locale = "uz-Latn";
    stress.payload.variants["uz-Latn"].people = [
      "Muhammadyusuf-Abdurahmon Abdujalilov",
      "Shahrizodabegim-Mohinur Sayyidabonu",
    ];
    await page.evaluate(
      (p) => frame.contentWindow.postMessage(p, location.origin),
      stress,
    );
    await page.waitForTimeout(150);
    const fits = await frame
      .locator("#fs-hero-names")
      .evaluate((el) => ({
        scroll: el.scrollWidth,
        width: el.clientWidth,
        whiteSpace: getComputedStyle(el).whiteSpace,
      }));
    assert.ok(fits.scroll <= fits.width + 1);
    report.checks.push({ viewport: vp.width, longNameFits: fits });
    const blank = structuredClone(fixture);
    Object.assign(blank.payload, {
      instant: null,
      dateNumeric: "",
      phone: "",
      replyEnabled: false,
      wishesEnabled: false,
      mapUrl: "",
      music: { enabled: false, url: "" },
    });
    for (const v of Object.values(blank.payload.variants))
      Object.assign(v, {
        people: [],
        greeting: "",
        message: "",
        venueName: "",
        address: "",
        dateLong: "",
        time: "",
        deadline: "",
        program: [],
        dressText: "",
        colors: [],
      });
    await page.evaluate(
      (p) => frame.contentWindow.postMessage(p, location.origin),
      blank,
    );
    await page.waitForTimeout(100);
    assert.equal(await frame.locator("#fs-events-wrap").isVisible(), false);
    assert.equal(await frame.locator("#fs-map").isVisible(), false);
    assert.equal(await frame.locator("#fs-details-card").isVisible(), false);
    assert.equal(await frame.locator("#fs-wish-form").isVisible(), false);
    assert.doesNotMatch(
      await frame.locator("body").innerText(),
      /Timur|Madina|Versal|998901234567|2026/,
    );
    await page.close();
  }
  // Native reduced motion must work, not just a query flag.
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await page.goto("http://127.0.0.1:3086");
  const f = page.frames()[1];
  await f.waitForSelector(".fs-ready");
  assert.equal(await f.locator('[id^="fs-particles-"] img').count(), 0);
  assert.equal(
    await f
      .locator("#fs-hero-names")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  await f.locator("#fs-open").click();
  await page.waitForTimeout(50);
  assert.equal(
    await f.locator("#fs-splash").evaluate((e) => e.style.display),
    "none",
  );
  await f.locator("#fs-wish-form").scrollIntoViewIfNeeded();
  await f.locator("[name=wname]").fill("QA");
  await f.locator("[name=wmsg]").fill("QA wish");
  await f.locator("#fs-wish-form button").click();
  assert.match(
    await f.locator("#fs-wish-confirm").innerText(),
    /ko‘rish rejimi/,
  );
  assert.equal(await f.locator("#fs-wish-list").innerText(), "");
  report.checks.push(
    "Native reduced motion: zero particles, no name animation, immediate opening; preview sends nothing",
  );
  // Decode and play the actual local preview audio after a gesture, then preserve pause.
  const music = structuredClone(fixture);
  music.payload.silentPlayback = false;
  music.payload.music = {
    enabled: true,
    url: "/music/catalog/emotional-piano.wav",
  };
  await page.evaluate(
    (p) => frame.contentWindow.postMessage(p, location.origin),
    music,
  );
  await f.waitForFunction(() => !document.querySelector("#fs-audio").paused);
  await f.locator("#fs-music").click();
  assert.equal(await f.locator("#fs-audio").evaluate((a) => a.paused), true);
  await f.locator('.fs-lang [data-lang="en"]').click();
  await page.waitForTimeout(100);
  assert.equal(await f.locator("#fs-audio").evaluate((a) => a.paused), true);
  await f.locator("#fs-music").click();
  await f.waitForFunction(() => !document.querySelector("#fs-audio").paused);
  await f.locator("#fs-music").click();
  await page.evaluate(
    (p) => frame.contentWindow.postMessage(p, location.origin),
    fixture,
  );
  await page.waitForTimeout(100);
  assert.equal(await f.locator("#fs-music").isVisible(), false);
  report.checks.push(
    "Actual local audio decodes and plays on gesture; pause survives language interaction; disabled music hides its control",
  );
  // API boundary checks use explicit local mocks. They are not live service verification.
  let mode = "ok",
    posts = [];
  await page.route("**/api/public/invitations/*/wishes", async (route) => {
    if (route.request().method() === "GET")
      return route.fulfill({
        json: {
          wishes: [{ name: "Approved QA", message: "Visible approved wish" }],
        },
      });
    posts.push(route.request().postDataJSON());
    return route.fulfill({
      status: mode === "ok" ? 201 : 503,
      json: mode === "ok" ? { ok: true } : { error: "unavailable" },
    });
  });
  const pub = structuredClone(fixture);
  pub.payload.preview = false;
  pub.payload.guestToken = "qa-opaque";
  pub.payload.locale = "uz-Latn";
  await page.evaluate(
    (p) => frame.contentWindow.postMessage(p, location.origin),
    pub,
  );
  await page.waitForTimeout(100);
  assert.match(await f.locator("#fs-wish-list").innerText(), /Approved QA/);
  await f.locator("[name=wname]").fill("QA <b>name</b>");
  await f.locator("[name=wmsg]").fill("Pending QA wish");
  await f.locator("#fs-wish-form button").click();
  await page.waitForTimeout(100);
  assert.match(await f.locator("#fs-wish-confirm").innerText(), /tasdiqlagach/);
  assert.doesNotMatch(
    await f.locator("#fs-wish-list").innerText(),
    /Pending QA/,
  );
  assert.equal(posts[0].guestToken, "qa-opaque");
  mode = "fail";
  await f.locator("[name=wmsg]").fill("Retry QA");
  await f.locator("#fs-wish-form button").click();
  await page.waitForTimeout(100);
  assert.match(await f.locator("#fs-wish-confirm").innerText(), /yuborilmadi/);
  assert.equal(await f.locator("[name=wmsg]").inputValue(), "Retry QA");
  report.checks.push(
    "Mocked wishes: approved-only GET, pending POST acknowledgement, token forwarded, no pending insertion, failure retains message",
  );
  pub.payload.instant = Date.now() - 2 * 86400000;
  await page.evaluate(
    (p) => frame.contentWindow.postMessage(p, location.origin),
    pub,
  );
  await page.waitForTimeout(100);
  assert.equal(await f.locator("#fs-wish-form").isVisible(), false);
  assert.match(
    await f.locator("[data-source-closed-panel]").innerText(),
    /Daftar yopildi/i,
  );
  report.checks.push("Source +24h closing panel retained");
  await page.screenshot({ path: `${out}/reduced-closed.png` });
  await page.close();
  // Exact reference source comparison: same canonical fixture through its own query contract.
  const v = fixture.payload.variants["uz-Latn"];
  const q = new URLSearchParams({
    names: v.people.join(" va "),
    date: "2027-06-12",
    time: v.time,
    venue: v.venueName,
    address: v.address,
    invite_text: v.message,
    events: JSON.stringify(v.program),
    info_dress: v.dressText,
    info_rsvp: fixture.payload.phone,
    lang: "uz",
  });
  const reference = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await reference.goto("http://127.0.0.1:3086/reference?" + q);
  await reference.evaluate(() => document.fonts.ready);
  await reference.screenshot({ path: `${out}/reference-opening-390.png` });
  await reference.locator("#fs-open").click();
  await reference.waitForTimeout(1050);
  await reference.screenshot({ path: `${out}/reference-hero-390.png` });
  await reference.locator("#fs-autumn").scrollIntoViewIfNeeded();
  await reference.waitForTimeout(1000);
  await reference.screenshot({ path: `${out}/reference-autumn-390.png` });
  await reference.close();
  fs.writeFileSync(
    `${out}/browser-report.json`,
    JSON.stringify(report, null, 2),
  );
  await browser.close();
  console.log(JSON.stringify(report, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
