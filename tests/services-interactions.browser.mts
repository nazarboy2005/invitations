import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(path.resolve("apps/web/package.json"));
const { chromium } = require("playwright");
const origin = process.env.TEST_ORIGIN ?? "http://127.0.0.1:3004";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      isMobile: width === 390,
      hasTouch: width === 390,
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(60000);
    const errors: string[] = [];
    page.on("pageerror", (error: Error) => errors.push(error.message));
    // Exercise slow account saves without creating users or changing live data.
    let favorites: { serviceSlug: string; savedAt: string }[] = [];
    let failSave = false;
    await page.route("**/api/service-favorites", async (route: any) => {
      const method = route.request().method();
      if (method !== "GET") {
        await new Promise((resolve) => setTimeout(resolve, 750));
        if (failSave) return route.fulfill({ status: 503, json: {} });
        const { serviceSlugs } = route.request().postDataJSON();
        favorites =
          method === "POST"
            ? serviceSlugs.map((serviceSlug: string) => ({
                serviceSlug,
                savedAt: new Date().toISOString(),
              }))
            : [];
      }
      await route.fulfill({ json: { userId: "browser-qa", favorites } });
    });
    await page.addInitScript(() => {
      const recorded: any[] = [];
      (window as any).serviceReveals = recorded;
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (frames: any, options: any) {
        if (this.matches("[data-service-card]") && options.duration === 280) {
          recorded.push({
            name: this.querySelector("h2")?.textContent,
            delay: options.delay,
            at: performance.now(),
          });
        }
        return animate.call(this, frames, options);
      };
    });
    await page.goto(origin + "/services", {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    await page.waitForFunction(
      () => (window as any).serviceReveals.length >= 2,
    );
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("[data-service-card]")).every(
        (card) => card.getAnimations().length === 0,
      ),
    );
    const firstNames = await page
      .locator("[data-service-card] h2")
      .allTextContents();
    const reveals = await page.evaluate(() => (window as any).serviceReveals);
    // First observer group is ordered left-to-right, then down the rows.
    const nextBatch = reveals.findIndex(
      (item: any, index: number) => index > 0 && item.delay === 0,
    );
    const firstBatch = nextBatch < 0 ? reveals : reveals.slice(0, nextBatch);
    assert.ok(firstBatch.length >= 2);
    firstBatch.forEach((item: any, index: number) => {
      assert.equal(item.delay, index * 65);
      assert.equal(item.name, firstNames[index]);
    });
    await page.screenshot({
      path: `.tmp/services-interactions-top-${width}.png`,
    });

    const hearts = page.locator("[data-service-card] button[aria-pressed]");
    await hearts.first().waitFor({ state: "visible" });
    await page.waitForFunction(
      () =>
        !document
          .querySelector("[data-service-card] button")
          ?.hasAttribute("disabled"),
    );
    const before = await hearts.evaluateAll((buttons: HTMLElement[]) =>
      buttons.map((button) => {
        const style = getComputedStyle(button);
        return {
          opacity: style.opacity,
          color: style.color,
          background: style.backgroundColor,
          cursor: style.cursor,
        };
      }),
    );
    await hearts.first().click();
    assert.equal(await hearts.first().getAttribute("aria-pressed"), "true");
    const saving = await hearts.evaluateAll((buttons: HTMLElement[]) =>
      buttons.map((button) => {
        const style = getComputedStyle(button);
        return {
          opacity: style.opacity,
          color: style.color,
          background: style.backgroundColor,
          cursor: style.cursor,
        };
      }),
    );
    assert.deepEqual(
      saving,
      before,
      "Saving must not dim hearts or change their cursors",
    );
    assert.ok(
      saving.every(
        (style: any) => style.opacity === "1" && style.cursor === "pointer",
      ),
    );
    await page.waitForFunction(
      () =>
        !document
          .querySelector("[data-service-card] button")
          ?.hasAttribute("disabled"),
    );
    failSave = true;
    await hearts.first().click();
    assert.equal(await hearts.first().getAttribute("aria-pressed"), "false");
    await page.waitForFunction(
      () =>
        document
          .querySelector("[data-service-card] button")
          ?.getAttribute("aria-pressed") === "true",
    );
    assert.ok(
      await page.getByRole("alert").count(),
      "Failed saves still roll back and offer retry",
    );
    failSave = false;
    await page.getByRole("button", { name: "Qayta urinish" }).first().click();
    await page.waitForFunction(
      () =>
        !document
          .querySelector("[data-service-card] button")
          ?.hasAttribute("disabled"),
    );

    await page.evaluate(() => {
      (window as any).serviceReveals.length = 0;
    });
    const nav = page.getByRole("navigation", { name: "Xizmatlar sahifalari" });
    await nav.getByRole("link", { name: "Keyingi sahifa" }).click();
    await page.waitForURL(/page=2/);
    await page.waitForFunction(
      (name: string) =>
        document.querySelector("[data-service-card] h2")?.textContent !== name,
      firstNames[0],
    );
    await page.waitForFunction(
      () => (window as any).serviceReveals.length >= 2,
    );
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("[data-service-card]")).every(
        (card) => card.getAnimations().length === 0,
      ),
    );
    assert.ok(
      (await page.locator("[data-service-card] h2").allTextContents()).every(
        (name: string) => !firstNames.includes(name),
      ),
    );

    const categories = page.getByRole("navigation", {
      name: "Xizmat yo‘nalishlari",
    });
    // Category IDs may be localized; use an actual configured route from the DOM.
    const destination = await categories
      .locator("a")
      .nth(1)
      .getAttribute("href");
    const visibleCategory =
      width === 390 ? categories.last() : categories.first();
    await page.evaluate(() => {
      (window as any).serviceReveals.length = 0;
    });
    await visibleCategory.locator("a").nth(1).click();
    await page.waitForURL(
      (url: URL) => url.pathname === destination?.split("?")[0],
    );
    await page.waitForFunction(
      () => (window as any).serviceReveals.length >= 2,
    );
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("[data-service-card]")).every(
        (card) => card.getAnimations().length === 0,
      ),
    );

    if (width === 390) {
      const edge = await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
        const backdrop = document.querySelector('[class*="backdrop"]')!;
        return {
          html: getComputedStyle(document.documentElement).overscrollBehaviorY,
          body: getComputedStyle(document.body).overscrollBehaviorY,
          rootImage: getComputedStyle(document.documentElement).backgroundImage,
          backdropHeight: backdrop.getBoundingClientRect().height,
        };
      });
      assert.equal(edge.html, "none");
      assert.equal(edge.body, "none");
      assert.equal(edge.rootImage, "none");
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(150);
      const after = await page.evaluate(() => ({
        y: scrollY,
        max: document.documentElement.scrollHeight - innerHeight,
        height: document
          .querySelector('[class*="backdrop"]')!
          .getBoundingClientRect().height,
      }));
      assert.equal(after.height, edge.backdropHeight);
      assert.ok(Math.abs(after.y - after.max) < 2);
    }
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("[data-service-card]")).every(
        (card) => card.getAnimations().length === 0,
      ),
    );
    await page.screenshot({
      path: `.tmp/services-interactions-${width}.png`,
    });
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `PASS ${width}px: steady optimistic hearts, rollback/retry, ordered reveals, pagination/category navigation and page bounds`,
    );
  }

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(origin + "/services", {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await page.waitForSelector("[data-service-card]");
  assert.ok(
    await page
      .locator("[data-service-card]")
      .evaluateAll((cards: HTMLElement[]) =>
        cards.every(
          (card) =>
            getComputedStyle(card).opacity === "1" &&
            card.getAnimations().length === 0,
        ),
      ),
  );
  console.log("PASS reduced motion: immediate cards without reveal animations");
  await context.close();

  const slowContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const slowPage = await slowContext.newPage();
  let releaseCovers!: () => void;
  const coverGate = new Promise<void>((resolve) => {
    releaseCovers = resolve;
  });
  const releaseTimeout = setTimeout(() => releaseCovers(), 20000);
  await slowPage.route("**/_next/image?**", async (route: any) => {
    await coverGate;
    await route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="800" height="450" fill="#dec5b5"/></svg>',
    });
  });
  await slowPage.goto(origin + "/services", {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await slowPage.waitForFunction(() =>
    document
      .querySelector("[data-service-card]")
      ?.getAnimations()
      .some((animation) => animation.effect?.getTiming().fill === "both"),
  );
  await slowPage.waitForFunction(() => {
    const card = document.querySelector("[data-service-card]")!;
    return (
      card.getAnimations().length === 0 &&
      getComputedStyle(card).opacity === "1"
    );
  });
  assert.ok(
    await slowPage
      .locator("[data-service-card] img")
      .evaluateAll((images: HTMLImageElement[]) =>
        images.some((image) => !image.complete),
      ),
    "Slow images must not hold cards blank",
  );
  clearTimeout(releaseTimeout);
  releaseCovers();
  await slowPage.waitForFunction(() =>
    Array.from(document.querySelectorAll("[data-service-card] img")).some(
      (image) =>
        image
          .getAnimations()
          .some((animation) => animation.effect?.getTiming().duration === 240),
    ),
  );
  console.log("PASS slow covers: bounded card wait and separate photo fade");
  await slowContext.close();
} finally {
  await browser.close();
}
