import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { getDb, closeDb } from "../packages/database/src/index";
import { GUEST_FAVORITES_KEY } from "../apps/web/src/modules/favorites/service-favorites-data";
const require = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { chromium } = require("playwright");
const origin = process.env.FAVORITES_TEST_ORIGIN ?? "http://localhost:3001";
const userId = randomUUID();
const db = getDb();
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
try {
  await db`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${userId},${String(Date.now())},'Service login disposable QA')`;
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    reducedMotion: "reduce",
  });
  // Simulate only Telegram's external confirmation; use real browser login endpoints and cookies.
  await context.route("https://t.me/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "Test login confirmation",
    }),
  );
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error: Error) => errors.push(error.message));
  await page.goto(origin + "/services/b/encore-media");
  await page
    .locator('[class*="serviceActionsDesktop"] button[aria-pressed="false"]')
    .click();
  await page.waitForFunction(
    (key) => !!localStorage.getItem(key),
    GUEST_FAVORITES_KEY,
  );
  await page.evaluate(() =>
    window.dispatchEvent(new CustomEvent("session-changed")),
  );
  const start = page.waitForResponse((response) =>
    response.url().endsWith("/api/auth/telegram/start"),
  );
  await page
    .getByRole("button", { name: "Kirish", exact: true })
    .first()
    .click();
  const response = await start;
  assert.equal(response.status(), 200);
  const { requestId } = await response.json();
  await db`UPDATE auth_requests SET state='confirmed',user_id=${userId} WHERE id=${requestId}`;
  await page.waitForURL("**/dashboard", { timeout: 30000 });
  await page.waitForFunction(
    (key) => localStorage.getItem(key) === null,
    GUEST_FAVORITES_KEY,
    { timeout: 30000 },
  );
  const rows =
    await db`SELECT service_slug FROM service_favorites WHERE user_id=${userId}`;
  assert.deepEqual(
    rows.map((row) => row.service_slug),
    ["encore-media"],
  );
  await page.goto(origin + "/services?favorites=1");
  await page
    .locator('[data-service-card] button[aria-pressed="true"]')
    .waitFor();
  assert.equal(await page.locator("[data-service-card]").count(), 1);
  assert.deepEqual(errors, []);
  console.log(
    `PASS real browser sign-in on ${new URL(origin).hostname}: guest save transferred after dashboard redirect, persisted in account, no session-event errors`,
  );
} finally {
  await browser.close();
  await db`DELETE FROM auth_requests WHERE user_id=${userId}`;
  await db`DELETE FROM sessions WHERE user_id=${userId}`;
  await db`DELETE FROM users WHERE id=${userId}`;
  await closeDb();
}
