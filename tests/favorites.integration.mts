import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { GUEST_FAVORITES_KEY } from "../apps/web/src/modules/favorites/favorites-data";

const require = createRequire(path.resolve("apps/web/package.json"));
const { chromium } = require("playwright");
const origin = process.env.FAVORITES_TEST_ORIGIN ?? "http://127.0.0.1:3001";
const db = getDb();
const users = [randomUUID(), randomUUID()];
const tokens = [randomToken(), randomToken()];
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const output = path.resolve("../output/favorites");
await mkdir(output, { recursive: true });
async function api(method = "GET", user = -1, ids: string[] = [], extra = {}) {
  return fetch(origin + "/api/favorites", {
    method,
    headers: {
      Origin: new URL(process.env.APP_URL!).origin,
      "Content-Type": "application/json",
      ...(user >= 0 ? { Cookie: `taklifnoma_session=${tokens[user]}` } : {}),
      ...extra,
    },
    ...(method === "GET"
      ? {}
      : { body: JSON.stringify({ userId: users[user], templateIds: ids }) }),
  });
}
async function expectStatus(response: Response, status: number) {
  assert.equal(response.status, status, await response.clone().text());
  assert.match(response.headers.get("Cache-Control") ?? "", /no-store/);
  return response.json();
}
try {
  for (let index = 0; index < users.length; index++) {
    await db`INSERT INTO users(id,telegram_user_id,display_name,phone_shared_at) VALUES(${users[index]},${String(Date.now()) + index},'Favorites disposable QA',now())`;
    await db`INSERT INTO sessions(user_id,token_hash,expires_at,absolute_expires_at) VALUES(${users[index]},${digest(tokens[index])},now()+interval '1 hour',now()+interval '1 hour')`;
  }
  const catalog = await (await fetch(origin + "/api/catalog")).json();
  const wedding = catalog.templates.filter((item: any) =>
    item.supportedEventTypes.includes("wedding"),
  );
  const [first, second, third] = [wedding[0], wedding[8], wedding[9]];
  assert.ok(first && second && third);
  assert.equal((await expectStatus(await api(), 200)).userId, null);
  await expectStatus(await api("POST", -1, [first.id]), 401);
  await expectStatus(
    await api("POST", 0, [first.id], { Origin: "https://invalid.example" }),
    403,
  );
  await expectStatus(await api("POST", 0, ["../bad"]), 400);
  const seeded = await expectStatus(
    await api("POST", 0, [first.id, first.id, "unknown-design"]),
    200,
  );
  assert.deepEqual(
    seeded.favorites.map((item: any) => item.templateId),
    [first.id],
  );
  assert.equal(
    (await expectStatus(await api("GET", 1), 200)).favorites.length,
    0,
  );
  const mismatch = await fetch(origin + "/api/favorites", {
    method: "POST",
    headers: {
      Origin: new URL(process.env.APP_URL!).origin,
      "Content-Type": "application/json",
      Cookie: `taklifnoma_session=${tokens[1]}`,
    },
    body: JSON.stringify({ userId: users[0], templateIds: [second.id] }),
  });
  await expectStatus(mismatch, 409);
  console.log(
    "PASS HTTP authentication, origin checks, validation, deduplication and account isolation",
  );

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const errors: string[] = [];
  page.on("pageerror", (error: Error) => errors.push(error.message));
  await page.goto(origin + "/templates", { waitUntil: "domcontentloaded" });
  const card = (id: string) =>
    page.locator(`article[data-template-id="${id}"]`);
  const heart = (id: string) =>
    card(id).getByRole("button", { name: /saralangan/ });
  await heart(second.id).click();
  await page.waitForFunction(
    (key: string) => JSON.parse(localStorage.getItem(key) ?? "[]").length === 1,
    GUEST_FAVORITES_KEY,
  );
  assert.equal(await page.locator("dialog[open]").count(), 0);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    (id: string) =>
      document.querySelector(
        `article[data-template-id="${id}"] button[aria-pressed="true"]`,
      ),
    second.id,
  );
  await heart(third.id).click();
  await page.goto(origin + "/templates?favorites=1");
  await page.waitForFunction(
    () => document.querySelectorAll("article[data-template-id]").length === 2,
  );
  assert.equal(
    await page
      .locator("article[data-template-id]")
      .first()
      .getAttribute("data-template-id"),
    third.id,
  );
  await card(second.id)
    .getByRole("button", { name: /batafsil/ })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /saralanganlardan/ })
    .click();
  await page.getByRole("button", { name: "Yopish", exact: true }).click();
  assert.equal(await page.locator("article[data-template-id]").count(), 2);
  const tab = await context.newPage();
  await tab.goto(origin + "/templates?favorites=1");
  await tab
    .locator(`article[data-template-id="${third.id}"]`)
    .getByRole("button", { name: /saralanganlardan/ })
    .click();
  await page.waitForFunction(() => document.querySelectorAll('article button[aria-pressed="true"]').length === 0);
  await page.reload();
  await page.getByRole("heading", { name: "Hali saralangan dizayn yo‘q" }).waitFor();
  await tab.close();
  console.log(
    "PASS guest save/reload, newest-first list, dialog synchronization and cross-tab removal",
  );

  await page.goto(origin + "/templates");
  await heart(second.id).click();
  await heart(first.id).click();
  // A failed import must leave the guest shortlist recoverable.
  await context.addCookies([
    { name: "taklifnoma_session", value: tokens[0], url: origin },
  ]);
  await page.route("**/api/favorites", async (route: any) => {
    if (route.request().method() === "POST")
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: "{}",
      });
    else await route.continue();
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("alert").waitFor();
  assert.equal(
    await page.evaluate(
      (key: string) => JSON.parse(localStorage.getItem(key) ?? "[]").length,
      GUEST_FAVORITES_KEY,
    ),
    2,
  );
  await page.unroute("**/api/favorites");
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await page.waitForFunction(
    (key: string) => !localStorage.getItem(key),
    GUEST_FAVORITES_KEY,
  );
  const merged = await expectStatus(await api("GET", 0), 200);
  assert.equal(merged.favorites.length, 2);
  const device = await browser.newContext();
  await device.addCookies([
    { name: "taklifnoma_session", value: tokens[0], url: origin },
  ]);
  const other = await device.newPage();
  await other.goto(origin + "/templates?favorites=1");
  await other.waitForFunction(
    () => document.querySelectorAll("article[data-template-id]").length === 2,
  );
  await device.close();
  await context.addCookies([
    { name: "taklifnoma_session", value: tokens[1], url: origin },
  ]);
  await page.goto(origin + "/templates?favorites=1");
  await page
    .getByRole("heading", { name: "Hali saralangan dizayn yo‘q" })
    .waitFor();
  await context.clearCookies();
  await page.reload({ waitUntil: "domcontentloaded" });
  await page
    .getByRole("heading", { name: "Hali saralangan dizayn yo‘q" })
    .waitFor();
  console.log(
    "PASS failed-import recovery, account merge, second device, account switch and signed-out separation",
  );

  // Guest favorites must lead both Studio collections after event filtering.
  await page.evaluate(
    ({ key, id }: any) =>
      localStorage.setItem(
        key,
        JSON.stringify([{ templateId: id, savedAt: new Date().toISOString() }]),
      ),
    { key: GUEST_FAVORITES_KEY, id: second.id },
  );
  await page.goto(origin + "/studio?new=1");
  await page.locator("[data-template-id]").first().waitFor();
  await page.waitForFunction(
    (id: string) =>
      document
        .querySelector("[data-template-id]")
        ?.getAttribute("data-template-id") === id,
    second.id,
  );
  await page
    .getByRole("button", { name: /Barcha dizaynlarni ko‘rish/ })
    .click();
  assert.equal(
    await page
      .locator("dialog[open] [data-template-id]")
      .first()
      .getAttribute("data-template-id"),
    second.id,
  );
  assert.equal(
    await page.getByRole("button", { name: /^Saralanganlar/ }).count(),
    0,
  );
  await page.screenshot({ path: path.join(output, "studio-desktop.png") });
  await page.keyboard.press("Escape");
  await page.getByRole("combobox", { name: "Tadbir turi" }).click();
  await page
    .getByRole("option", { name: "Tug‘ilgan kun", exact: true })
    .click();
  const birthdayIds = new Set(
    catalog.templates
      .filter(
        (item: any) =>
          item.published && item.supportedEventTypes.includes("birthday"),
      )
      .map((item: any) => item.id),
  );
  for (const id of await page
    .locator("[data-template-id]")
    .evaluateAll((elements: Element[]) =>
      elements.map((element) => element.getAttribute("data-template-id")),
    ))
    assert.ok(
      birthdayIds.has(id),
      "Event filtering must still exclude incompatible designs",
    );
  await page.goto(origin + "/templates?favorites=1");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("article[data-template-id]").first().waitFor();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: path.join(output, "favorites-mobile.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Menyuni ochish" }).click();
  await page
    .getByRole("navigation", { name: "Mobil menyu" })
    .getByRole("link", { name: /Saralanganlar/ })
    .waitFor();
  await page.getByRole("button", { name: "Menyuni yopish" }).click();
  await page.goto(origin + "/preview?template=anor&qaSilent=1");
  await page
    .locator("nav[aria-label='Dizayn amallari']")
    .waitFor({ state: "attached" });
  await page.waitForFunction(
    () =>
      document.querySelector("main iframe")?.contentDocument?.readyState ===
      "complete",
  );
  await page
    .locator("main iframe")
    .first()
    .evaluate((frame: HTMLIFrameElement) =>
      frame.contentDocument?.dispatchEvent(
        new WheelEvent("wheel", { deltaY: -100 }),
      ),
    );
  const previewHeart = page.getByRole("button", {
    name: /Anor: saralanganlarga/,
  });
  await previewHeart.focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction(
    (key: string) =>
      JSON.parse(localStorage.getItem(key) ?? "[]").some(
        (item: any) => item.templateId === "anor",
      ),
    GUEST_FAVORITES_KEY,
  );
  console.log(
    "PASS event compatibility and full-preview keyboard favorite action",
  );
  assert.deepEqual(errors, []);
  await context.close();
  console.log(
    "PASS Studio favorites-first order, mobile layout/menu and no page errors",
  );

  const blocked = await browser.newContext();
  await blocked.addInitScript((key: string) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name: string, value: string) {
      if (name === key && !(window as any).allowFavoritesStorage)
        throw new DOMException("Blocked", "QuotaExceededError");
      return original.call(this, name, value);
    };
  }, GUEST_FAVORITES_KEY);
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(origin + "/templates");
  const blockedHeart = blockedPage
    .locator('article[data-template-id="anor"]')
    .getByRole("button", { name: /saralangan/ });
  await blockedHeart.click();
  await blockedPage
    .getByRole("alert")
    .filter({ hasText: "Brauzer saqlashga ruxsat" })
    .waitFor();
  assert.equal(await blockedHeart.getAttribute("aria-pressed"), "false");
  await blockedPage.evaluate(() => {
    (window as any).allowFavoritesStorage = true;
  });
  await blockedPage
    .getByRole("button", { name: "Qayta urinish", exact: true })
    .click();
  await blockedPage.waitForFunction(
    (key: string) =>
      JSON.parse(localStorage.getItem(key) ?? "[]").some(
        (item: any) => item.templateId === "anor",
      ),
    GUEST_FAVORITES_KEY,
  );
  await blocked.close();
  const stale = await browser.newContext();
  await stale.addInitScript(
    (key: string) => {
      if (sessionStorage.getItem("stale-seeded")) return;
      sessionStorage.setItem("stale-seeded", "1");
      localStorage.setItem(
        key,
        JSON.stringify([
          { templateId: "retired-design", savedAt: new Date().toISOString() },
        ]),
      );
    },
    GUEST_FAVORITES_KEY,
  );
  const stalePage = await stale.newPage();
  await stalePage.goto(origin + "/templates?favorites=1");
  await stalePage.getByText("Saqlangan dizayn — hozir mavjud emas").waitFor();
  await stalePage
    .getByRole("button", { name: /Mavjud bo‘lmagan dizayn: saralanganlardan/ })
    .click();
  await stalePage.reload();
  await stalePage.getByRole("heading", { name: "Hali saralangan dizayn yo‘q" }).waitFor();
  await stale.close();
  console.log(
    "PASS blocked browser storage, explicit retry and removing unavailable designs",
  );
} finally {
  await browser.close();
  for (const id of users) {
    await db`DELETE FROM sessions WHERE user_id=${id}`;
    await db`DELETE FROM users WHERE id=${id}`;
  }
  await closeDb();
}
