import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { createInvitation, type Invitation } from "../../packages/contracts/src/index.ts";
import { normalizeInvitation, templateCapabilities } from "../../packages/contracts/src/capabilities.ts";
import { getDb, closeDb } from "../../packages/database/src/index.ts";
import { digest, randomToken } from "../../apps/web/src/server/auth/crypto.ts";
const require = createRequire(new URL("../../apps/web/package.json", import.meta.url));
const { chromium } = require("playwright");
const origin = process.env.STUDIO_AUDIT_ORIGIN || "http://127.0.0.1:3001";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
const sql = getDb(), owner = randomUUID(), token = randomToken(), rows: any[] = [];
let browser: any;
try {
  await sql`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${owner},${-Math.floor(Math.random() * 1e12) - 1},'Disposable Studio UI verification')`;
  await sql`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${owner},${digest(token)},'Studio UI verification',now()+interval '1 hour',now()+interval '1 hour')`;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await context.addCookies([{ name: "taklifnoma_session", value: token, url: origin }]);
  const ids = ["anor", "taklifla-asalari", "taklifla-barakali", "taklifla-zarhal-sahifa", "aurelia", "velvet", "velora", "jasmine-white", "sunset", "invitate-wedding", "ivory-rose-card", "taklifla-osmon", "wedivo-pulau-sehati"];
  for (const id of ids) {
    const c = templateCapabilities(id), i = normalizeInvitation(createInvitation(id));
    const [event] = await sql`SELECT event_type FROM template_supported_event_types WHERE template_id=${id} ORDER BY event_type LIMIT 1`;
    i.eventType = event.event_type;
    if (c.program) { i.program = [{ id: "p", time: "18:00" }]; i.content["uz-Latn"].programTitles.p = "QA program"; }
    if (c.dressCode) {
      i.dressCode.enabled = true;
      i.dressCode.colors = c.inputs.dressColorNames || c.inputs.dressColorHex ? [{ id: "c", hex: c.inputs.dressColorHex ? "#ccbbaa" : "#000000", name: c.inputs.dressColorNames ? { "uz-Latn": "QA color" } : {} }] : [];
    }
    await sql`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${i.id},${owner},${id},'draft',${sql.json(i)})`;
    const page = await context.newPage();
    page.setDefaultTimeout(30000);
    const errors: string[] = [];
    page.on("pageerror", (error: Error) => errors.push(error.message));
    await page.goto(`${origin}/studio/${i.id}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    const steps = page.locator('aside[aria-label="Tahrirlash bo‘limlari"]').getByRole("button");
    await steps.nth(1).click();
    await page.getByRole("heading", { name: "Tadbir egalari", exact: true }).waitFor();
    const expectField = async (label: string, supported: boolean) => assert.equal(await page.getByLabel(new RegExp(`^${label}`)).count() > 0, supported, `${id}: ${label}`);
    await expectField("Oila yoki mezbonlar", c.inputs.hosts);
    await expectField("Tadbir nomi", c.inputs.eventLabel);
    await expectField("Mehmonlarga salomlashish", c.inputs.greeting);
    await steps.nth(2).click();
    await page.locator("#studio-venue-title").waitFor();
    await expectField("Dastur sarlavhasi", c.program && c.inputs.programHeading);
    await expectField("Dastur bandi izohi", c.program && c.inputs.programDescriptions);
    await expectField("Kiyinish uslubi", c.dressCode && c.inputs.dressStyle);
    await expectField("Mehmonlar uchun izoh", c.dressCode && c.inputs.dressText);
    await expectField("Qo‘shimcha eslatma", c.dressCode && c.inputs.dressNote);
    await expectField("Rang kodi", c.dressCode && c.inputs.dressColorHex);
    await steps.nth(3).click();
    await page.waitForTimeout(200);
    const targets = await page.locator("[data-preview-target]").evaluateAll((nodes: Element[]) => nodes.map(node => node.getAttribute("data-preview-target")));
    for (const [target, supported] of [["gallery", c.gallery > 0], ["music", c.music], ["gift", c.gift], ["rsvp", c.rsvp !== "none"], ["contacts", c.phone || c.telegram]] as const)
      assert.equal(targets.includes(target), supported, `${id}: ${target}`);
    if (id === "velora") {
      await page.locator('[data-preview-target="contacts"] button[aria-expanded]').click();
      await expectField("Telefon raqami", true);
      await expectField("Telegram nomi", false);
    }
    if (id === "taklifla-asalari") {
      await page.setViewportSize({ width: 390, height: 844 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false, "Studio mobile overflow");
    }
    // Only top-level application exceptions matter; archived source effects are
    // checked separately by the complete renderer audit.
    rows.push({ id, fieldsChecked: true, optionalSections: targets, errors });
    await page.close();
    console.log(`Verified Studio ${id}`);
  }
  mkdirSync("docs/qa/2026-11-08-studio-inputs", { recursive: true });
  writeFileSync("docs/qa/2026-11-08-studio-inputs/ui-verification.json", JSON.stringify(rows, null, 2) + "\n");
} finally {
  await browser?.close();
  await sql`DELETE FROM invitations WHERE owner_id=${owner}`;
  await sql`DELETE FROM sessions WHERE user_id=${owner}`;
  await sql`DELETE FROM users WHERE id=${owner}`;
  await closeDb();
}
