// Runs only against an explicitly local app; creates and removes disposable data.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { serviceListings } from "../apps/web/src/modules/services/services-data";

const origin = process.env.SERVICES_TEST_URL ?? "http://127.0.0.1:3004";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
const require = createRequire(path.resolve("apps/web/package.json"));
const { chromium } = require("playwright");
const db = getDb(),
  actor = randomUUID(),
  token = randomToken();
const prefix = `qa-service-ui-${randomUUID()}`;
const browser = await chromium.launch({ headless: true, channel: "chrome" });
try {
  await db`INSERT INTO users(id,telegram_user_id,display_name,is_admin) VALUES(${actor},${Math.floor(Math.random() * 1e12) + 1},'Services browser QA',true)`;
  await db`INSERT INTO sessions(user_id,token_hash,expires_at,absolute_expires_at) VALUES(${actor},${digest(token)},now()+interval '1 hour',now()+interval '1 hour')`;
  for (const width of [1440, 390]) {
    const slug = `${prefix}-${width}`,
      renamed = `${slug}-changed`;
    const seed = serviceListings.find(
      (s) => s.address && s.phones.length && s.images.length,
    )!;
    const listing = { ...seed, slug, name: `QA Services browser ${width}` };
    const response = await fetch(`${origin}/api/admin/services`, {
      method: "POST",
      headers: {
        Origin: origin,
        Cookie: `taklifnoma_session=${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listing, revision: 0, intent: "hidden" }),
    });
    assert.equal(response.status, 201, await response.text());
    const context = await browser.newContext({
      viewport: { width, height: 950 },
    });
    await context.addCookies([
      { name: "taklifnoma_session", value: token, url: origin },
    ]);
    const page = await context.newPage();
    page.setDefaultTimeout(60_000);
    const errors: string[] = [];
    page.on("pageerror", (error: Error) => errors.push(error.message));
    await page.goto(`${origin}/admin?view=services`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    await page.getByRole("textbox", { name: "Servis qidirish" }).fill(slug);
    await page.getByRole("button", { name: new RegExp(listing.name) }).click();
    const url = page.getByRole("textbox", { name: "Havola nomi" });
    assert.equal(await url.getAttribute("readonly"), null);
    const visibility = page.getByRole("combobox", { name: "Servis holati" });
    assert.deepEqual(
      await visibility
        .locator("option")
        .evaluateAll((options: HTMLOptionElement[]) =>
          options.map((o) => o.value),
        ),
      ["active", "hidden"],
    );
    assert.equal(
      await page
        .getByRole("button", { name: /Arxivlash|Nashrdan olish|Nashr qilish/ })
        .count(),
      0,
    );
    const checks: string[] = [];
    page.on("request", (request: { url(): string }) => {
      if (request.url().includes("slug-availability?"))
        checks.push(request.url());
    });
    await url.fill(`${slug}-typing`);
    await page.waitForTimeout(220);
    await url.fill(renamed);
    await page.waitForTimeout(220);
    assert.equal(
      checks.length,
      0,
      "Availability must wait for the typing pause",
    );
    await page
      .locator("#service-slug-status")
      .filter({ hasText: "foydalanish mumkin" })
      .waitFor();
    assert.equal(checks.length, 1, "Only the final typed URL is checked");
    await url.fill(seed.slug);
    await page
      .locator("#service-slug-status")
      .filter({ hasText: "Bu havola band" })
      .waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "Saqlash", exact: true })
        .isDisabled(),
      true,
    );
    await url.fill(renamed);
    await page
      .locator("#service-slug-status")
      .filter({ hasText: "foydalanish mumkin" })
      .waitFor();
    await visibility.selectOption("active");
    await page.getByRole("button", { name: "Saqlash", exact: true }).click();
    await page
      .getByRole("status")
      .filter({ hasText: "Saqlandi. Servis saytda ko‘rinadi." })
      .waitFor();
    assert.equal(
      (await context.request.get(`${origin}/services/b/${renamed}`)).status(),
      200,
    );
    assert.equal(
      (await context.request.get(`${origin}/services/b/${slug}`)).status(),
      404,
    );
    await visibility.selectOption("hidden");
    await page.getByRole("button", { name: "Saqlash", exact: true }).click();
    await page
      .getByRole("status")
      .filter({ hasText: "Saqlandi. Servis saytda yashirilgan." })
      .waitFor();
    assert.equal(
      (await context.request.get(`${origin}/services/b/${renamed}`)).status(),
      404,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      "Editor must fit the viewport",
    );
    await page.screenshot({
      path: `.tmp/services-admin-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Servisni o‘chirish", exact: true })
      .click();
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Bekor qilish" })
      .click();
    assert.equal(
      (
        await context.request.get(`${origin}/api/admin/services/${renamed}`)
      ).status(),
      200,
    );
    await page
      .getByRole("button", { name: "Servisni o‘chirish", exact: true })
      .click();
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Butunlay o‘chirish" })
      .click();
    await page.getByRole("textbox", { name: "Servis qidirish" }).waitFor();
    assert.equal(
      (
        await context.request.get(`${origin}/api/admin/services/${renamed}`)
      ).status(),
      404,
    );
    assert.equal(
      (
        await db`SELECT slug FROM service_listings WHERE slug IN (${slug},${renamed})`
      ).length,
      0,
    );
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `PASS ${width}px: 500ms debounce, occupied URL, rename, active/hidden, cancel and permanent deletion, layout`,
    );
  }
} finally {
  await browser.close();
  await db.begin(async (tx) => {
    await tx`DELETE FROM service_listings WHERE created_by=${actor}`;
    await tx`DELETE FROM admin_audit_log WHERE actor_id=${actor}`;
    await tx`DELETE FROM sessions WHERE user_id=${actor}`;
    await tx`DELETE FROM rate_limits WHERE key=${"admin-write:" + actor}`;
    await tx`DELETE FROM users WHERE id=${actor}`;
  });
  await closeDb();
}
