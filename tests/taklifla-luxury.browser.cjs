// Local app on 3001; read-only reference server: python tests/taklifla-luxury-reference.server.py
const { chromium } = require("../apps/web/node_modules/playwright");
const fs = require("node:fs"),
  assert = require("node:assert/strict"),
  { execFileSync } = require("node:child_process");
const fixtures = JSON.parse(
  execFileSync(
    process.execPath,
    ["--import", "tsx", "tests/taklifla-luxury.fixture.ts"],
    { encoding: "utf8" },
  ),
);
const out = "docs/templates/luxury-uzbek-verification";
fs.mkdirSync(out, { recursive: true });
const blank = (value) =>
  Array.isArray(value)
    ? []
    : value && typeof value === "object"
      ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, blank(v)]))
      : typeof value === "string"
        ? ""
        : null;
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const report = {
    date: "2026-10-29",
    checks: [],
    errors: [],
    failedLocalRequests: [],
    httpErrors: [],
  };
  try {
    for (const fixture of fixtures) {
      const { id, message, invitation } = fixture,
        prefix = id.endsWith("tovus") ? "tv" : "mp";
      for (const viewport of [
        { width: 390, height: 844 },
        { width: 1280, height: 800 },
        { width: 320, height: 740 },
      ]) {
        const page = await browser.newPage({
          viewport,
          timezoneId: "Asia/Tashkent",
        });
        page.on("pageerror", (e) =>
          report.errors.push({ id, message: e.message }),
        );
        page.on("response", (r) => {
          if (r.status() >= 400)
            report.httpErrors.push({ id, url: r.url(), status: r.status() });
        });
        page.on("requestfailed", (r) => {
          if (new URL(r.url()).hostname === "127.0.0.1")
            report.failedLocalRequests.push({
              id,
              url: r.url(),
              error: r.failure(),
            });
        });
        await page.goto(
          `http://127.0.0.1:3001/preview?template=${id}&qaSilent=1`,
          { waitUntil: "domcontentloaded" },
        );
        await page.addStyleTag({
          content: "nextjs-portal{display:none!important}",
        });
        const frame = await (
          await page.locator(`iframe[src*="${id}/index.html"]`).elementHandle()
        ).contentFrame();
        await frame.locator(`#${prefix}-open`).waitFor();
        await frame.evaluate(() => document.fonts.ready);
        const send = async (m) => {
          await page.evaluate(
            (m) =>
              document
                .querySelector("main iframe")
                .contentWindow.postMessage(m, location.origin),
            m,
          );
          await page.waitForTimeout(80);
        };
        await send(message);
        assert.ok(
          (await frame.locator(`#${prefix}-wish-list`).textContent()).includes(
            message.payload.variants["uz-Latn"].wishes[0].message,
          ),
        );
        await page.screenshot({
          path: `${out}/${id}-opening-${viewport.width}.png`,
        });
        assert.equal(
          await frame.locator(`#${prefix}-audio`).evaluate((a) => a.paused),
          true,
        );
        await frame.locator(`#${prefix}-open`).click();
        await page.waitForTimeout(1200);
        assert.equal(
          await frame
            .locator(`#${prefix}-splash`)
            .evaluate((e) => getComputedStyle(e).display),
          "none",
        );
        await page.screenshot({
          path: `${out}/${id}-hero-${viewport.width}.png`,
        });
        assert.equal(
          await frame
            .locator(`#${prefix}-hero-a`)
            .evaluate((e) => parseFloat(getComputedStyle(e).fontSize)),
          prefix === "mp" ? 46 : 64,
        );
        const particles = await frame
          .locator(
            prefix === "mp" ? "#mp-hero-flies > div" : "#tv-particles > div",
          )
          .count();
        assert.equal(particles, prefix === "mp" ? 12 : 6);
        const animation = await frame
          .locator(
            prefix === "mp" ? "#mp-hero-flies > div" : "#tv-particles > div",
          )
          .first()
          .evaluate((e) => getComputedStyle(e).animationName);
        assert.equal(animation, prefix === "mp" ? "mpTwinkle" : "fall");
        for (const section of await frame.locator("[data-reveal]").all()) {
          await section.scrollIntoViewIfNeeded();
          await page.waitForTimeout(35);
        }
        await page.waitForTimeout(1200);
        assert.equal(
          await frame.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
        );
        const rowSelector =
          prefix === "mp" ? "#mp-events .mp-ev-row" : "#tv-events .tv-ev-row";
        assert.deepEqual(
          await frame
            .locator(rowSelector)
            .evaluateAll((xs) =>
              xs.map((x) => x.dataset.programId || x.dataset.itemId),
            ),
          invitation.program.map((x) => x.id),
        );
        for (const locale of message.payload.enabledLocales) {
          await frame
            .locator(`.${prefix}-lang [data-lang="${locale}"]`)
            .click();
          assert.equal(
            await frame.locator("html").getAttribute("lang"),
            locale,
          );
          assert.ok(
            (
              await frame.locator(`#${prefix}-wish-list`).textContent()
            ).includes(message.payload.variants[locale].wishes[0].message),
          );
          assert.equal(
            await frame.locator(`#${prefix}-hero-a`).innerText(),
            invitation.content[locale].people[0],
          );
          assert.equal(
            await frame.locator(`#${prefix}-map`).getAttribute("href"),
            invitation.venue.mapUrl,
          );
        }
        const long = structuredClone(message);
        for (const v of Object.values(long.payload.variants))
          v.people = [
            "Muhammadyusuf-Abdurahmon Abdujalilov",
            "Shahrizodabegim-Mohinur Sayyidabonu",
          ];
        await send(long);
        assert.equal(
          await frame.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
        );
        const nameFit = await frame
          .locator(`#${prefix}-hero-a, #${prefix}-hero-b`)
          .evaluateAll((xs) =>
            xs.map((e) => {
              const s = getComputedStyle(e),
                r = e.getBoundingClientRect();
              return {
                fontSize: parseFloat(s.fontSize),
                lines:
                  (e.scrollHeight -
                    parseFloat(s.paddingTop) -
                    parseFloat(s.paddingBottom)) /
                  parseFloat(s.lineHeight),
                left: r.left,
                right: r.right,
                viewport: innerWidth,
              };
            }),
          );
        assert.ok(
          nameFit.every(
            (n) => n.lines <= 2.1 && n.left >= -1 && n.right <= n.viewport + 1,
          ),
          JSON.stringify(nameFit),
        );
        await frame.locator(`#${prefix}-hero-a`).scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${out}/${id}-long-${viewport.width}.png`,
        });
        const manual = structuredClone(message),
          map = "https://maps.app.goo.gl/manual-qa";
        if (prefix === "mp") manual.payload.mapUrl = map;
        else
          for (const v of Object.values(manual.payload.variants))
            v.venue.mapUrl = map;
        await send(manual);
        assert.equal(
          await frame.locator(`#${prefix}-map`).getAttribute("href"),
          map,
        );
        const empty = structuredClone(message);
        empty.payload.variants = Object.fromEntries(
          Object.keys(empty.payload.variants).map((l) => [
            l,
            blank(empty.payload.variants[l]),
          ]),
        );
        Object.assign(empty.payload, {
          mapUrl: "",
          instant: "",
          phone: "",
          wishesEnabled: false,
          rsvpEnabled: false,
          music: { enabled: false, url: "" },
        });
        await send(empty);
        assert.equal(
          await frame.locator(`#${prefix}-events-section`).isVisible(),
          false,
        );
        assert.equal(await frame.locator(`#${prefix}-map`).isVisible(), false);
        assert.equal(
          await frame.locator(`#${prefix}-wish-form`).isVisible(),
          false,
        );
        assert.doesNotMatch(
          await frame.locator("body").innerText(),
          /Javohir|Madina|Navro.z Saroyi|Karimov|Rahimov|99890/,
        );
        report.checks.push({
          id,
          viewport,
          particles,
          animation,
          overflow: false,
          allLocales: true,
          stableProgramIds: true,
          manualMap: true,
          emptyCreatorData: true,
          longNameFit: nameFit,
        });
        await page.close();
      }
      const page = await browser.newPage({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      });
      await page.goto(
        `http://127.0.0.1:3001/preview?template=${id}&qaSilent=1`,
        { waitUntil: "domcontentloaded" },
      );
      const frame = await (
        await page.locator(`iframe[src*="${id}/index.html"]`).elementHandle()
      ).contentFrame();
      await frame.locator(`#${prefix}-open`).click();
      await page.waitForTimeout(50);
      assert.equal(
        await frame
          .locator(`#${prefix}-splash`)
          .evaluate((e) => getComputedStyle(e).display),
        "none",
      );
      const reduced = await frame
        .locator(`#${prefix}-hero-a`)
        .evaluate((e) => getComputedStyle(e).animationName);
      assert.equal(reduced, "none");
      const send = async (m) => {
        await page.evaluate(
          (m) =>
            document
              .querySelector("main iframe")
              .contentWindow.postMessage(m, location.origin),
          m,
        );
        await page.waitForTimeout(80);
      };
      const music = structuredClone(message);
      music.payload.silentPlayback = false;
      music.payload.music = {
        enabled: true,
        url: "/music/catalog/emotional-piano.wav",
      };
      await send(music);
      const audio = frame.locator(`#${prefix}-audio`);
      if (await audio.evaluate((a) => a.paused))
        await frame.locator(`#${prefix}-music`).click();
      await frame.waitForFunction((p) => {
        const a = document.querySelector("#" + p + "-audio");
        return !a.paused && a.currentTime > 0.05;
      }, prefix);
      await frame.locator(`#${prefix}-music`).click();
      await frame.locator(`.${prefix}-lang [data-lang=en]`).click();
      assert.equal(await audio.evaluate((a) => a.paused), true);
      const publicPayload = structuredClone(message);
      Object.assign(publicPayload.payload, {
        preview: false,
        guestToken: "opaque-qa",
        music: { enabled: false, url: "" },
      });
      let failure = false,
        posts = [];
      await page.route("**/api/public/invitations/*/wishes", (route) =>
        route.request().method() === "GET"
          ? route.fulfill({
              json: {
                wishes: [{ name: "Approved guest", message: "Approved only" }],
              },
            })
          : (posts.push(route.request().postDataJSON()),
            route.fulfill({
              status: failure ? 503 : 201,
              json: failure ? { error: "unavailable" } : { ok: true },
            })),
      );
      await send(publicPayload);
      await frame
        .locator(`#${prefix}-wish-list`)
        .filter({ hasText: "Approved only" })
        .waitFor();
      await frame.locator("[name=wname]").fill("QA <b>guest</b>");
      await frame.locator("[name=wmsg]").fill("Pending QA");
      failure = true;
      await frame.locator(`#${prefix}-wish-form button`).click();
      await page.waitForTimeout(120);
      assert.equal(
        await frame.locator("[name=wmsg]").inputValue(),
        "Pending QA",
      );
      failure = false;
      await frame.locator(`#${prefix}-wish-form button`).click();
      await page.waitForTimeout(150);
      assert.equal(posts.at(-1).guestToken, "opaque-qa");
      assert.doesNotMatch(
        await frame.locator(`#${prefix}-wish-list`).innerText(),
        /Pending QA/,
      );
      const closed = structuredClone(publicPayload);
      if (prefix === "mp")
        closed.payload.instant = new Date(Date.now() - 172800000).toISOString();
      else
        for (const v of Object.values(closed.payload.variants))
          v.target = Date.now() - 172800000;
      await send(closed);
      assert.equal(
        await frame.locator(`#${prefix}-wish-form`).isVisible(),
        false,
      );
      assert.equal(await frame.locator(".wish-closed").isVisible(), true);
      report.checks.push({
        id,
        nativeReducedMotion: true,
        actualAudioPlayback: true,
        pauseSurvivesLocale: true,
        mockedWishes: {
          failureRetainsMessage: true,
          approvedOnly: true,
          pendingHidden: true,
          guestToken: true,
        },
        sourceClosingPanel: true,
      });
      await page.close();
      const reference = await browser.newPage({
        viewport: { width: 390, height: 844 },
        timezoneId: "Asia/Tashkent",
      });
      const q = new URLSearchParams({
        names: invitation.content["uz-Latn"].people.join(" & "),
        date: invitation.startsAt.slice(0, 10),
        time: invitation.startsAt.slice(11),
        venue: invitation.content["uz-Latn"].venueName,
        address: invitation.content["uz-Latn"].address,
        map_url: invitation.venue.mapUrl,
        groom_parents: "",
        bride_parents: "",
        quote: "",
        info_weather: "",
        info_stay: "",
        info_parking: "",
        lang: "uz",
      });
      await reference.goto(`http://127.0.0.1:3087/reference/${id}?${q}`, {
        waitUntil: "domcontentloaded",
      });
      await reference.evaluate(() => document.fonts.ready);
      await reference.screenshot({
        path: `${out}/${id}-reference-opening.png`,
      });
      await reference.locator(`#${prefix}-open`).click();
      await reference.waitForTimeout(1250);
      await reference.screenshot({ path: `${out}/${id}-reference-hero.png` });
      await reference.close();
    }
    assert.deepEqual(report.errors, []);
    assert.deepEqual(report.failedLocalRequests, []);
    // Deliberate 503 wish transport failures are covered above.
    assert.ok(
      report.httpErrors.every(
        (e) => e.status === 503 && e.url.endsWith("/wishes"),
      ),
      JSON.stringify(report.httpErrors),
    );
    fs.writeFileSync(
      `${out}/browser-report.json`,
      JSON.stringify(report, null, 2) + "\n",
    );
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
