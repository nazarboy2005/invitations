import { chromium } from "../apps/web/node_modules/playwright-core/index.mjs";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { completeInvitation } from "../tests/fixtures/publication";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
const sql = getDb();
const origin = process.env.APP_URL!;
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
const out = fileURLToPath(
  new URL("../docs/templates/ivory-rose-card-verification/", import.meta.url),
);
await mkdir(out, { recursive: true });
const userId = randomUUID(),
  token = randomToken();
const invitation = normalizeInvitation({
  ...completeInvitation(),
  templateId: "ivory-rose-card",
});
invitation.content["uz-Latn"].people = ["Abdulaziz", "Madinaxon"];
let browser;
try {
  await sql`INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at) VALUES(${userId},${-Math.floor(Math.random() * 1e12) - 1},'Disposable image UI test','+000000000','telegram_contact',now())`;
  await sql`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${userId},${digest(token)},'Image UI verification',now()+interval '1 hour',now()+interval '1 hour')`;
  await sql`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${invitation.id},${userId},'ivory-rose-card','draft',${sql.json(invitation)})`;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await context.addCookies([
    { name: "taklifnoma_session", value: token, url: origin },
  ]);
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      console.log("HTTP", response.status(), new URL(response.url()).pathname);
  });
  console.log("Opening Studio fixture");
  await page.goto(origin + `/studio/${invitation.id}`);
  await page
    .getByAltText("Rasm taklifnoma ko‘rinishi")
    .waitFor({ timeout: 60000 })
    .catch(async (e) => {
      await page.screenshot({ path: out + "studio-debug.png" });
      console.log(
        "Studio debug",
        (await page.locator("body").innerText()).slice(0, 2500),
        errors,
      );
      throw e;
    });
  console.log("Studio preview ready");
  await page.screenshot({ path: out + "studio-desktop.png" });
  await page
    .locator('aside[aria-label="Tahrirlash bo‘limlari"]')
    .getByRole("button")
    .nth(3)
    .click();
  await page
    .getByRole("button", { name: "PNG yuklab olish · Bepul" })
    .waitFor();
  assert.equal(await page.getByText(/Click to‘lovi/).count(), 0);
  await page.screenshot({ path: out + "studio-final-step.png" });
  const [template] =
    await sql`SELECT published FROM templates WHERE id='ivory-rose-card'`;
  if (template.published) {
    const result = page.waitForEvent("download", { timeout: 60000 });
    await page
      .getByRole("button", { name: "PNG yuklab olish · Bepul" })
      .click();
    await (await result).saveAs(out + "studio-download.png");
    await page.getByText("PNG rasm yuklab olindi. Taklifnomangiz “Taklifnomalarim”da saqlangan.", {exact:true}).waitFor({timeout:10000});
  }
  await page.goto(origin + "/dashboard");
  await page
    .getByRole("heading", { name: "Abdulaziz & Madinaxon" })
    .waitFor({ timeout: 30000 });
  await page
    .getByAltText("Rasm taklifnoma ko‘rinishi")
    .waitFor({ timeout: 60000 });
  if (template.published) await page.getByText("Rasm tayyor", {exact:true}).waitFor();
  await page.screenshot({ path: out + "dashboard-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + `/studio/${invitation.id}`);
  await page.getByRole("button", { name: "Ko‘rinishi", exact: true }).click();
  await page
    .getByAltText("Rasm taklifnoma ko‘rinishi")
    .waitFor({ timeout: 60000 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );
  await page.screenshot({ path: out + "studio-mobile.png" });
  await page.goto(origin + "/preview?template=ivory-rose-card");
  await page
    .getByAltText("Rasm taklifnoma ko‘rinishi")
    .waitFor({ timeout: 60000 });
  await page
    .getByRole("link", { name: "Dizaynlar ro‘yxatiga qaytish" })
    .waitFor({ state: "visible" });
  await page.screenshot({ path: out + "preview-mobile.png" });
  if (template.published) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(origin + "/templates");
    await page
      .getByRole("button", { name: "Rasm taklifnoma", exact: true })
      .click();
    await page
      .getByRole("button", {
        name: "Oq atirgul: batafsil ko‘rish",
        exact: true,
      })
      .waitFor();
    await page.locator('img[src*="ivory-rose-card"]').evaluateAll(async images => { await Promise.all(images.map(img => (img as HTMLImageElement).decode())); });
    await page.screenshot({ path: out + "catalog-desktop.png" });
    await page
      .getByRole("button", {
        name: "Oq atirgul: batafsil ko‘rish",
        exact: true,
      })
      .click();
    await page.getByRole("dialog").waitFor();
    await page.screenshot({ path: out + "catalog-detail.png" });
    await page.goto(origin + "/");
    assert.equal(await page.locator('a[href*="ivory-rose-card"]').count(), 0);
    assert.equal(await page.locator('img[src*="ivory-rose-card"]').count(), 0);
  }
  assert.deepEqual(errors, []);
  console.log(
    template.published
      ? "PASS: Studio desktop/mobile/final step, dashboard, full preview, browser download, catalog and no landing placement. Screenshots saved."
      : "PASS: pre-release Studio desktop/mobile/final step, dashboard and full preview. Download/catalog remain gated until publication.",
  );
} finally {
  await browser?.close();
  await sql`DELETE FROM invitation_audit_log WHERE invitation_id=${invitation.id}`;
  await sql`DELETE FROM invitations WHERE id=${invitation.id} AND owner_id=${userId}`;
  await sql`DELETE FROM sessions WHERE user_id=${userId}`;
  await sql`DELETE FROM users WHERE id=${userId}`;
  await closeDb();
}
