import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { serviceListings } from "../apps/web/src/modules/services/services-data";
import { GUEST_FAVORITES_KEY } from "../apps/web/src/modules/favorites/service-favorites-data";
const require = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { chromium } = require("playwright");
const origin = process.env.FAVORITES_TEST_ORIGIN ?? "http://127.0.0.1:3001";
const db = getDb();
const users = [randomUUID(), randomUUID()];
const tokens = [randomToken(), randomToken()];
const ids = serviceListings.slice(0, 15).map((item) => item.slug);
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
async function api(
  method = "GET",
  user = -1,
  slugs: string[] = [],
  claimedUser?: string,
  requestOrigin = process.env.APP_URL!,
) {
  return fetch(origin + "/api/service-favorites", {
    method,
    headers: {
      Origin: new URL(requestOrigin).origin,
      "Content-Type": "application/json",
      ...(user >= 0 ? { Cookie: `taklifnoma_session=${tokens[user]}` } : {}),
    },
    ...(method === "GET"
      ? {}
      : {
          body: JSON.stringify({
            userId: claimedUser ?? users[user],
            serviceSlugs: slugs,
          }),
        }),
  });
}
try {
  for (let i = 0; i < 2; i++) {
    await db`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${users[i]},${String(Date.now()) + i},'Service favorites disposable QA')`;
    await db`INSERT INTO sessions(user_id,token_hash,expires_at,absolute_expires_at) VALUES(${users[i]},${digest(tokens[i])},now()+interval '1 hour',now()+interval '1 hour')`;
  }
  assert.equal((await api("POST", -1, [ids[0]])).status, 401);
  assert.equal(
    (await api("POST", 0, [ids[0]], undefined, "https://invalid.example"))
      .status,
    403,
  );
  assert.equal((await api("POST", 0, ["../invalid"])).status, 400);
  assert.equal((await api("POST", 0, [ids[0]], users[1])).status, 409);
  const saved = await (
    await api("POST", 0, [ids[0], ids[0], "unknown-service"])
  ).json();
  assert.deepEqual(
    saved.favorites.map((item: any) => item.serviceSlug),
    [ids[0]],
  );
  assert.equal((await (await api("GET", 1)).json()).favorites.length, 0);
  console.log(
    "PASS authentication, origin checks, validation, deduplication, account isolation",
  );
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error: Error) => errors.push(error.message));
  await page.goto(origin + "/services");
  const cardButton = page.locator("[data-service-card] button").first();
  await cardButton.click();
  await page.waitForFunction(
    (key) => JSON.parse(localStorage.getItem(key) || "[]").length === 1,
    GUEST_FAVORITES_KEY,
  );
  await page
    .getByRole("link", { name: "Saralangan xizmatlar", exact: true })
    .last()
    .click();
  await page.waitForURL("**favorites=1");
  await page.waitForFunction(
    () => document.querySelectorAll("[data-service-card]").length === 1,
  );
  await page.reload();
  await page
    .locator('[data-service-card] button[aria-pressed="true"]')
    .waitFor();
  assert.equal(await page.locator("[data-service-card]").count(), 1);
  console.log("PASS guest save, directory filtering and reload persistence");
  // Add guest saves while the account already owns a different favorite.
  await page.evaluate(
    ({ key, ids }) =>
      localStorage.setItem(
        key,
        JSON.stringify(
          ids.map((serviceSlug) => ({
            serviceSlug,
            savedAt: "2026-11-01T10:00:00.000Z",
          })),
        ),
      ),
    { key: GUEST_FAVORITES_KEY, ids: ids.slice(1) },
  );
  await page.route("**/api/service-favorites", async (route) => {
    if (route.request().method() === "POST")
      await route.fulfill({
        status: 503,
        json: { error: "Temporary test failure" },
      });
    else await route.continue();
  });
  await context.addCookies([
    { name: "taklifnoma_session", value: tokens[0], url: origin },
  ]);
  await page.reload();
  await page.getByRole("button", { name: "Qayta urinish" }).first().waitFor();
  assert.ok(
    await page.evaluate(
      (key) => localStorage.getItem(key),
      GUEST_FAVORITES_KEY,
    ),
  );
  await page.unroute("**/api/service-favorites");
  await page.reload();
  await page.waitForFunction(
    (key) => localStorage.getItem(key) === null,
    GUEST_FAVORITES_KEY,
    { timeout: 30000 },
  );
  const merged = await (await api("GET", 0)).json();
  assert.equal(merged.favorites.length, 15);
  assert.equal(
    merged.favorites.find((item: any) => item.serviceSlug === ids[1]).savedAt,
    "2026-11-01T10:00:00.000Z",
  );
  assert.equal(await page.locator("[data-service-card]").count(), 12);
  await page.getByRole("link", { name: "Keyingi sahifa", exact: true }).click();
  await page.waitForURL("**page=2**");
  await page.waitForFunction(
    () => document.querySelectorAll("[data-service-card]").length === 3,
  );
  console.log(
    "PASS sign-in merge preserves account saves and timestamps, clears guest copies, paginates saved services",
  );
  await context.addCookies([
    { name: "taklifnoma_session", value: tokens[1], url: origin },
  ]);
  await page.reload();
  await page
    .getByRole("heading", { name: "Saralangan xizmat topilmadi" })
    .waitFor();
  assert.equal(await page.locator("[data-service-card]").count(), 0);
  await api("POST", 1, ["encore-media"]);
  await page.goto(origin + "/services/b/encore-media");
  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = page.locator('[class*="serviceActionsMobile"]');
  await mobile.locator('button[aria-pressed="true"]').waitFor();
  await mobile.locator('button[aria-pressed="true"]').click();
  await mobile
    .locator('button[aria-pressed="false"]:not([disabled])')
    .waitFor();
  assert.equal((await (await api("GET", 1)).json()).favorites.length, 0);
  const label = await page.locator('[class*="priceHeading"] p').boundingBox();
  const actions = await mobile.boundingBox();
  assert.ok(
    label &&
      actions &&
      Math.abs(label.y + label.height / 2 - actions.y - actions.height / 2) <
        3 &&
      actions.x > label.x,
  );
  await page
    .getByRole("link", { name: "Saralangan xizmatlar", exact: true })
    .filter({ visible: true })
    .click();
  await page.waitForURL("**/services?favorites=1");
  assert.ok(
    await page
      .getByRole("navigation", { name: "Xizmat yo‘nalishlari" })
      .last()
      .isVisible(),
  );
  await page.goto(origin + "/templates");
  assert.ok(
    (await page
      .locator('a[title="Saralanganlar"]')
      .first()
      .getAttribute("href")) === "/templates?favorites=1",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS account switching, mobile detail save placement/removal, categories retained, template navbar unchanged, no browser errors",
  );
  await context.close();
} finally {
  await browser.close();
  await db`DELETE FROM sessions WHERE user_id IN ${db(users)}`;
  await db`DELETE FROM users WHERE id IN ${db(users)}`;
  await closeDb();
}
