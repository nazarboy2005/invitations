import { chromium } from "../apps/web/node_modules/playwright-core/index.mjs";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import { completeInvitation } from "../tests/fixtures/publication";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
const db = getDb(),
  origin = process.env.APP_URL!;
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
const users = [randomUUID(), randomUUID()],
  tokens = [randomToken(), randomToken()];
const invitation = normalizeInvitation({
  ...completeInvitation(),
  templateId: "ivory-rose-card",
  imageExportedAt: new Date().toISOString(),
});
let browser;
const output = new URL("../.tmp/editing-qa/", import.meta.url);
await mkdir(output, { recursive: true });
try {
  for (const [index, id] of users.entries()) {
    await db`INSERT INTO users(id,telegram_user_id,display_name,is_admin) VALUES(${id},${-Math.floor(Math.random() * 1e12) - 1},'Disposable editing UI QA',${index === 1})`;
    await db`INSERT INTO sessions(user_id,token_hash,expires_at,absolute_expires_at) VALUES(${id},${digest(tokens[index])},now()+interval '1 hour',now()+interval '1 hour')`;
  }
  await db`INSERT INTO invitations(id,owner_id,template_id,status,data,identity_locked_at,edit_deadline_at,approved_event_date) VALUES(${invitation.id},${users[0]},'ivory-rose-card','draft',${db.json(invitation)},now(),'2027-06-14T19:00:00Z','2027-06-14')`;
  browser = await chromium.launch({ headless: true });
  const errors: string[] = [];
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await context.addCookies([
    { name: "taklifnoma_session", value: tokens[0], url: origin },
  ]);
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(origin + `/studio/${invitation.id}`);
  const names = page.getByLabel("Kuyov ismi", { exact: true });
  await names.waitFor();
  assert.equal(await names.isDisabled(), true);
  assert.equal(
    await page
      .locator("section[aria-labelledby=studio-wording-title] textarea")
      .isDisabled(),
    true,
  );
  assert.equal(
    await page
      .locator("section[aria-labelledby=studio-wording-title] input")
      .isDisabled(),
    true,
  );
  await page.getByAltText("Rasm taklifnoma ko‘rinishi").waitFor();
  await page.screenshot({
    path: new URL("desktop-static.png", output).pathname.replace(
      /^\/(\w:)/,
      "$1",
    ),
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Tuzatish so‘rovi", exact: true })
    .click();
  await page.getByLabel("1-ism", { exact: true }).fill("Nodir corrected");
  await page
    .getByLabel("Sababi", { exact: true })
    .fill("Spelling correction for the same person");
  await page
    .getByRole("button", { name: "So‘rov yuborish", exact: true })
    .click();
  await page
    .getByRole("status")
    .filter({ hasText: "So‘rov yuborildi" })
    .waitFor();
  const admin = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await admin.addCookies([
    { name: "taklifnoma_session", value: tokens[1], url: origin },
  ]);
  const queue = await admin.newPage();
  queue.on("pageerror", (e) => errors.push(e.message));
  await queue.goto(origin + "/admin?view=requests");
  const card = queue
    .locator("article")
    .filter({ hasText: "Spelling correction for the same person" });
  await card
    .getByLabel("Ko‘rib chiqish izohi")
    .fill("Same person spelling verified in review");
  await card.scrollIntoViewIfNeeded();
  await queue.screenshot({
    path: new URL("desktop-admin-review.png", output).pathname.replace(
      /^\/(\w:)/,
      "$1",
    ),
    fullPage: true,
  });
  await card.getByRole("button", { name: "Tuzatishni tasdiqlash" }).click();
  await card.getByText("Tasdiqlangan", { exact: true }).waitFor();
  await page.reload();
  await page.getByLabel("Kuyov ismi", { exact: true }).waitFor();
  assert.equal(
    await page.getByLabel("Kuyov ismi", { exact: true }).inputValue(),
    "Nodir corrected",
  );
  await page
    .getByRole("button", { name: /Tadbir tafsilotlari/ })
    .first()
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Tadbir sanasi va vaqtini tanlang" })
      .isEnabled(),
    true,
  );
  assert.equal(
    await page
      .locator("section[aria-labelledby=studio-venue-title] textarea")
      .first()
      .isEnabled(),
    true,
  );
  await page
    .getByRole("button", { name: "Tadbir sanasi va vaqtini tanlang" })
    .click();
  assert.equal(
    await page
      .getByRole("gridcell", { name: "15 Iyun 2027", exact: true })
      .isDisabled(),
    true,
  );
  assert.equal(
    await page
      .getByRole("gridcell", { name: "14 Iyun 2027", exact: true })
      .isEnabled(),
    true,
  );
  await page.getByRole("button", { name: "Tayyor", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: new URL("phone-location.png", output).pathname.replace(
      /^\/(\w:)/,
      "$1",
    ),
    fullPage: true,
  });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
    false,
  );
  await db`UPDATE invitations SET edit_deadline_at=now()-interval '1 minute' WHERE id=${invitation.id}`;
  await page.reload();
  await page.getByText("Tahrirlash muddati tugagan", { exact: true }).waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Saqlash", exact: true })
      .isDisabled(),
    true,
  );
  assert.equal(
    await page
      .getByRole("button", { name: "Tuzatish so‘rovi", exact: true })
      .isEnabled(),
    true,
  );
  assert.equal(
    await page
      .getByRole("button", {
        name: "Saqlangan PNG rasmni yuklab olish",
        exact: true,
      })
      .isEnabled(),
    true,
  );
  await page.screenshot({
    path: new URL("phone-expired.png", output).pathname.replace(
      /^\/(\w:)/,
      "$1",
    ),
    fullPage: true,
  });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
    false,
  );
  assert.deepEqual(errors, []);
  console.log(
    "Editing UI passed: desktop/phone, locked wording, live location/date bounds, correction submission/approval, expired access and no page errors.",
  );
} finally {
  await browser?.close();
  await db.begin(async (tx) => {
    await tx`DELETE FROM invitation_change_requests WHERE invitation_id=${invitation.id}`;
    await tx`DELETE FROM invitation_audit_log WHERE invitation_id=${invitation.id}`;
    await tx`DELETE FROM invitations WHERE id=${invitation.id}`;
    for (const id of users) {
      await tx`DELETE FROM admin_audit_log WHERE actor_id=${id}`;
      await tx`DELETE FROM rate_limits WHERE key IN (${"correction-request:" + id},${"admin-write:" + id})`;
      await tx`DELETE FROM sessions WHERE user_id=${id}`;
      await tx`DELETE FROM users WHERE id=${id}`;
    }
  });
  await closeDb();
}
