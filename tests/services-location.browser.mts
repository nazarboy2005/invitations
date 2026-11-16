import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import { closeDb, getDb } from "../packages/database/src/index";
import {
  serviceCategories,
  serviceListings as seed,
} from "../apps/web/src/modules/services/services-data";
import {
  serviceDirectory,
  type ServiceListing,
  type ServiceFilters,
} from "../apps/web/src/modules/services/services-utils";
import {
  CURRENT_LOCATION_LABEL,
  formatServiceDistance,
  serviceDistance,
  validCoordinates,
} from "../apps/web/src/modules/services/service-distance";

const require = createRequire(path.resolve("apps/web/package.json"));
const { chromium } = require("playwright");
const origin = process.env.TEST_ORIGIN ?? "http://127.0.0.1:3015";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
const listings: ServiceListing[] = process.env.DATABASE_URL
  ? (
      await getDb()`SELECT published FROM service_listings WHERE published IS NOT NULL ORDER BY position`
    ).map((row) => row.published as ServiceListing)
  : seed;
await closeDb();
const reference = listings.find(validCoordinates)!;
assert.ok(reference);
const position = {
  latitude: reference.latitude! + 0.0001,
  longitude: reference.longitude!,
};
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
await mkdir(".tmp/services-location", { recursive: true });

async function setup(
  width: number,
  permissionState = "prompt",
  supported = true,
) {
  const context = await browser.newContext({
    viewport: { width, height: 950 },
    reducedMotion: "reduce",
  });
  await context.addInitScript(`(() => {
    const permission = new EventTarget();
    permission.state = ${JSON.stringify(permissionState)};
    const watches = new Map();
    const harness = {
      calls: [], cleared: [], next: 0,
      push(latitude, longitude) {
        for (const callback of watches.values()) callback.success({ coords: { latitude, longitude, accuracy: 5 }, timestamp: Date.now() });
      },
      fail(code) { for (const callback of watches.values()) callback.error({ code }); },
      permit(state) { permission.state = state; permission.dispatchEvent(new Event("change")); },
      visibility(hidden) {
        Object.defineProperty(document, "hidden", { configurable: true, value: hidden });
        document.dispatchEvent(new Event("visibilitychange"));
      },
    };
    Object.defineProperty(navigator, "permissions", { configurable: true, value: { query: async () => permission } });
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: ${supported} ? {
      watchPosition(success, error, options) { harness.calls.push(options); const id = ++harness.next; watches.set(id, { success, error }); return id; },
      clearWatch(id) { harness.cleared.push(id); watches.delete(id); },
    } : undefined });
    window.locationHarness = harness;
  })()`);
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  const errors: string[] = [];
  page.on("pageerror", (error: Error) => errors.push(error.message));
  await page.route("**/api/service-favorites", (route: any) =>
    route.fulfill({ json: { userId: null, favorites: [] } }),
  );
  await page.goto(origin + "/services", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await page.locator("[data-service-card]").first().waitFor();
  return { page, context, errors };
}
async function selectRegion(page: any, label: string) {
  await page.getByRole("combobox", { name: "Hudud", exact: true }).click();
  await page.getByRole("option", { name: label, exact: true }).click();
}
async function checkCards(page: any, filters: ServiceFilters) {
  const expected = serviceDirectory(
    filters,
    listings,
    serviceCategories,
  ).listings;
  await page.waitForFunction(
    (slugs: string[]) => {
      const actual = Array.from(
        document.querySelectorAll(
          "[data-service-card] a[href^='/services/b/']",
        ),
        (node) => node.getAttribute("href")!.split("/").pop(),
      );
      return JSON.stringify(actual) === JSON.stringify(slugs);
    },
    expected.map((item) => item.slug),
  );
  const distances = await page
    .locator("[data-service-card]")
    .evaluateAll((cards: HTMLElement[]) =>
      cards.map(
        (card) =>
          card.querySelector("[data-service-distance]")?.textContent?.trim() ??
          null,
      ),
    );
  assert.deepEqual(
    distances,
    expected.map((item) => {
      const distance = serviceDistance(filters.origin, item);
      return distance === null ? null : formatServiceDistance(distance);
    }),
  );
}

try {
  for (const width of [1440, 390]) {
    const { page, context, errors } = await setup(width);
    assert.equal(
      await page.evaluate(() => (window as any).locationHarness.calls.length),
      0,
      "No prompt on entry",
    );
    assert.equal(await page.locator("[data-service-distance]").count(), 0);
    await selectRegion(page, CURRENT_LOCATION_LABEL);
    await page
      .getByRole("status")
      .filter({ hasText: "Joylashuvingiz aniqlanmoqda" })
      .waitFor();
    assert.ok(!new URL(page.url()).searchParams.has("region"));
    const options = await page.evaluate(() =>
      (window as any).locationHarness.calls.at(-1),
    );
    assert.deepEqual(options, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000,
    });
    await page.evaluate(
      (p: any) => (window as any).locationHarness.push(p.latitude, p.longitude),
      position,
    );
    await page.waitForURL(/region=nearby/);
    await checkCards(page, { region: "nearby", origin: position });
    assert.equal(
      await page.getByRole("link", { name: "Filtrlarni tozalash" }).count(),
      0,
    );
    // Switching tabs and acquiring a fresh position must not introduce a filter summary.
    await page.evaluate(() => (window as any).locationHarness.permit("granted"));
    await page.evaluate(() => (window as any).locationHarness.visibility(true));
    assert.equal(
      await page.getByRole("link", { name: "Filtrlarni tozalash" }).count(),
      0,
    );
    await page.evaluate(() =>
      (window as any).locationHarness.visibility(false),
    );
    await page.waitForFunction(
      () => (window as any).locationHarness.calls.length >= 2,
    );
    await page.evaluate(
      (p: any) => (window as any).locationHarness.push(p.latitude, p.longitude),
      position,
    );
    await checkCards(page, { region: "nearby", origin: position });
    assert.equal(
      await page.getByRole("link", { name: "Filtrlarni tozalash" }).count(),
      0,
    );
    // A real text filter still has a reset, which retains the nearby sort.
    await page.evaluate(() => {
      const url = new URL(window.location.href);
      url.searchParams.set("q", "test");
      window.history.pushState(null, "", url.pathname + url.search);
    });
    const clearFilters = page.getByRole("link", {
      name: "Filtrlarni tozalash",
    });
    await clearFilters.waitFor();
    assert.match(await clearFilters.getAttribute("href"), /region=nearby/);
    await clearFilters.click();
    await page.waitForFunction(
      () => !new URL(location.href).searchParams.has("q"),
    );
    await checkCards(page, { region: "nearby", origin: position });
    assert.equal(await clearFilters.count(), 0);
    assert.ok(
      (await page.locator("[data-service-distance]").allTextContents()).some(
        (text: string) => /\d m$/.test(text.trim()),
      ),
    );
    const layout = await page
      .locator("[data-service-distance]")
      .first()
      .evaluate((node: HTMLElement) => {
        const distance = node.getBoundingClientRect();
        const address = node.previousElementSibling!.getBoundingClientRect();
        return {
          right: distance.left >= address.right,
          sameRow: Math.abs(distance.top - address.top) < 3,
          noOverflow:
            node.closest("article")!.scrollWidth <=
            node.closest("article")!.clientWidth,
        };
      });
    assert.deepEqual(layout, { right: true, sameRow: true, noOverflow: true });
    await page.screenshot({
      path: `.tmp/services-location/nearby-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("link", { name: "Keyingi sahifa", exact: true })
      .click();
    await page.waitForURL(/page=2/);
    await checkCards(page, { region: "nearby", origin: position, page: 2 });
    const moved = { latitude: 39.65, longitude: 66.96 };
    await page.evaluate(
      (p: any) => (window as any).locationHarness.push(p.latitude, p.longitude),
      moved,
    );
    await checkCards(page, { region: "nearby", origin: moved, page: 2 });
    await selectRegion(page, "Barcha hududlar");
    await page.waitForFunction(
      () => !new URL(location.href).searchParams.has("region"),
    );
    await checkCards(page, { origin: moved });
    const region = reference.region;
    await selectRegion(page, region);
    await page.waitForFunction(
      (value: string) =>
        new URL(location.href).searchParams.get("region") === value,
      region,
    );
    await checkCards(page, { region, origin: moved });
    // A category route navigation must retain location and the chosen region.
    const category = serviceCategories.find(
      (item) => item.id === reference.categoryIds[0],
    )!;
    await page
      .locator("a:visible")
      .filter({ hasText: category.name })
      .first()
      .click();
    await page.waitForURL(new RegExp(`/services/${category.id}\\?`));
    await checkCards(page, { category: category.id, region, origin: moved });
    await page.evaluate(() => (window as any).locationHarness.permit("denied"));
    await page.waitForFunction(
      () => !document.querySelector("[data-service-distance]"),
    );
    assert.equal(new URL(page.url()).searchParams.get("region"), region);
    assert.ok(
      await page.evaluate(
        () => (window as any).locationHarness.cleared.length > 0,
      ),
    );
    await page.screenshot({
      path: `.tmp/services-location/no-permission-${width}.png`,
      fullPage: true,
    });
    assert.deepEqual(errors, []);
    await context.close();
  }
  for (const [code, message] of [
    [1, "ruxsat berilmadi"],
    [2, "aniqlab bo‘lmadi"],
    [3, "vaqti tugadi"],
  ] as const) {
    const { page, context, errors } = await setup(390);
    await selectRegion(page, reference.region);
    await page.waitForFunction(
      (region: string) =>
        new URL(location.href).searchParams.get("region") === region,
      reference.region,
    );
    await selectRegion(page, CURRENT_LOCATION_LABEL);
    await page.evaluate(
      (code: number) => (window as any).locationHarness.fail(code),
      code,
    );
    await page.getByRole("status").filter({ hasText: message }).waitFor();
    assert.equal(
      new URL(page.url()).searchParams.get("region"),
      reference.region,
    );
    assert.equal(await page.locator("[data-service-distance]").count(), 0);
    assert.deepEqual(errors, []);
    await context.close();
  }
  {
    const { page, context, errors } = await setup(390, "prompt", false);
    await selectRegion(page, CURRENT_LOCATION_LABEL);
    await page.getByRole("status").filter({ hasText: "imkoni yo‘q" }).waitFor();
    assert.equal(await page.locator("[data-service-distance]").count(), 0);
    assert.deepEqual(errors, []);
    await context.close();
  }
  {
    const { page, context, errors } = await setup(1440, "granted");
    await page.waitForFunction(
      () => (window as any).locationHarness.calls.length > 0,
    );
    await page.evaluate(
      (p: any) => (window as any).locationHarness.push(p.latitude, p.longitude),
      position,
    );
    await checkCards(page, { origin: position });
    // Returning to the tab discards the old position and waits for a new fix.
    await page.evaluate(() => (window as any).locationHarness.visibility(true));
    await page.waitForFunction(
      () => !document.querySelector("[data-service-distance]"),
    );
    await page.evaluate(() =>
      (window as any).locationHarness.visibility(false),
    );
    await page.waitForFunction(
      () => (window as any).locationHarness.calls.length >= 2,
    );
    await page.evaluate(
      (p: any) => (window as any).locationHarness.push(p.latitude, p.longitude),
      position,
    );
    await checkCards(page, { origin: position });
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(
      await page.locator("[data-service-distance]").count(),
      0,
      "Reload must not reuse a saved position",
    );
    assert.deepEqual(errors, []);
    await context.close();
  }
  console.log(
    "PASS desktop/mobile permission gating, fresh updates, all-region nearest sorting, pagination, manual regions, categories, revocation, errors and layout",
  );
} finally {
  await browser.close();
}
