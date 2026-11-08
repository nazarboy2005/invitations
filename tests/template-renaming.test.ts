import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import renames from "../packages/contracts/src/template-renames.json";
import { TEMPLATES, createInvitation, invitationSchema, templateById, publicTemplateId } from "../packages/contracts/src/index";
import { paymentIdentity, paymentIdentityMatches } from "../packages/contracts/src/payment";
import { templateCapabilities } from "../packages/contracts/src/capabilities";
import { canonicalTemplateAssetPath } from "../apps/web/src/lib/template-asset-aliases.mjs";

test("approved names and canonical IDs agree, including all user corrections and exceptions", () => {
  const approved = { islomiy: "Islomiy", dugonalar: "Dugonalar", gulzor: "Gulzor", oqqushlar: "Oqqushlar", "yashil-makon": "Yashil Makon", zumrad: "Zumrad", marvarid: "Marvarid", zaytun: "Zaytun", orzular: "Orzular", terrakota: "Terrakota", xatna: "Xatna", estelle: "Estelle", velora: "Velora", velvet: "Velvet", aurelia: "Aurelia", monogram: "Monogram", sunset: "Sunset", "oltin-yosh": "Oltin Yosh" };
  for (const [id, name] of Object.entries(approved)) assert.equal(templateById(id)?.name, name, id);
  assert.equal(new Set(TEMPLATES.map(t => t.id)).size, TEMPLATES.length);
  for (const row of renames) {
    const template = TEMPLATES.find(t => t.id === row.id);
    if (!template) { assert.ok(["oppoq-tuygu", "oqqush"].includes(row.id)); continue; }
    assert.equal(template.name, row.name);
    assert.equal(publicTemplateId(row.id), row.id);
    for (const old of row.aliases) {
      assert.equal(templateById(old), template);
      assert.equal(createInvitation(old).templateId, row.id);
      assert.deepEqual(templateCapabilities(old), templateCapabilities(row.id));
    }
  }
  assert.ok(templateById("korporativ")?.supportedEventTypes.includes("korporativ"));
});

test("recovering a browser draft rekeys its template data while retaining hidden settings and authored content", () => {
  const draft = createInvitation("terrakota");
  const legacy = { ...draft, templateId: "taklifla-terracotta", templateData: { "taklifla-terracotta": { infoNote: { "uz-Latn": "Creator note" } }, "taklifla-sharlar": { doorsAt: "18:00" }, custom: { untouched: true } } };
  const parsed = invitationSchema.parse(legacy);
  assert.equal(parsed.templateId, "terrakota");
  assert.deepEqual(parsed.templateData, { terrakota: { infoNote: { "uz-Latn": "Creator note" } }, sharlar: { doorsAt: "18:00" }, custom: { untouched: true } });
  assert.deepEqual(parsed.content, draft.content);
  assert.deepEqual(legacy.templateData["taklifla-sharlar"], { doorsAt: "18:00" });
});

test("immutable purchase snapshots remain valid across the canonical ID migration", () => {
  const invitation = createInvitation("islomiy");
  const identity = JSON.parse(paymentIdentity(invitation));
  const legacy = JSON.stringify({ ...identity, templateId: "islamic-edition" });
  assert.ok(paymentIdentityMatches(invitation, legacy));
  assert.ok(!paymentIdentityMatches(createInvitation("zaytun"), legacy));
  assert.equal(canonicalTemplateAssetPath("/templates/islamic-edition/index.html"), "/templates/islomiy/index.html");
  assert.equal(canonicalTemplateAssetPath("/templates/chorlove/orchid-amplop/assets/a.png"), "/templates/ormon-maktubi/assets/a.png");
});

test("database migration rekeys dependencies and authored namespaces while preserving purchase history and protection", async () => {
  const db = new PGlite();
  const directory = new URL("../packages/database/migrations/", import.meta.url);
  try {
    await db.exec("BEGIN");
    // Use production definitions for every affected table/trigger; unrelated historical
    // publication migrations depend on catalog state specific to their original release.
    for (const file of ["0001_foundation.sql", "0002_template_categories.sql", "0007_template_event_compatibility.sql", "0008_require_template_event_support.sql", "0151_admin_audit_log.sql", "0152_admin_management.sql", "0160_nodze_payments.sql", "0204_template_favorites.sql"]) {
      await db.exec("SET CONSTRAINTS ALL IMMEDIATE; SET CONSTRAINTS ALL DEFERRED");
      await db.exec(await readFile(new URL(file, directory), "utf8"));
    }
    for (const row of renames) {
      await db.query("INSERT INTO templates(id,name,price_minor,published) VALUES($1,$1,50000,false) ON CONFLICT DO NOTHING", [row.previousId]);
      await db.query("INSERT INTO template_supported_event_types(template_id,event_type) VALUES($1,'wedding') ON CONFLICT DO NOTHING", [row.previousId]);
    }
    await db.exec("COMMIT");
    const user = (await db.query<{ id: string }>("INSERT INTO users(telegram_user_id,display_name) VALUES(90001,'Migration test') RETURNING id")).rows[0].id;
    const invitation = randomUUID(), order = randomUUID();
    const data = { templateId: "islamic-edition", templateData: { "taklifla-sharlar": { doorsAt: "18:00" } }, content: { "uz-Latn": { people: ["Authored"] } }, eventType: "wedding" };
    await db.query("INSERT INTO invitations(id,owner_id,template_id,data) VALUES($1,$2,'islamic-edition',$3)", [invitation, user, JSON.stringify(data)]);
    await db.query("INSERT INTO template_favorites(user_id,template_id) VALUES($1,'islamic-edition')", [user]);
    const snapshot = JSON.stringify({ templateId: "islamic-edition", people: ["Authored"] });
    await db.query("INSERT INTO payment_orders(id,invitation_id,owner_id,template_id,template_name,identity_snapshot,amount_minor,currency,request_body,idempotency_key) VALUES($1,$2,$3,'islamic-edition','Islamic', $4,50000,'UZS','signed provider request','migration-test')", [order, invitation, user, snapshot]);
    const before = (await db.query("SELECT * FROM payment_orders WHERE id=$1", [order])).rows[0];
    const catalogBefore = (await db.query("SELECT count(*)::int AS count FROM templates")).rows[0];
    await db.exec("BEGIN");
    await db.exec(await readFile(new URL("0229_canonical_template_identities.sql", directory), "utf8"));
    await db.exec("COMMIT");
    assert.deepEqual((await db.query("SELECT count(*)::int AS count FROM templates")).rows[0], catalogBefore);
    assert.deepEqual((await db.query("SELECT template_id,data FROM invitations WHERE id=$1", [invitation])).rows[0], { template_id: "islomiy", data: { ...data, templateId: "islomiy", templateData: { sharlar: { doorsAt: "18:00" } } } });
    assert.deepEqual((await db.query("SELECT template_id FROM template_favorites WHERE user_id=$1", [user])).rows, [{ template_id: "islomiy" }]);
    const after = (await db.query("SELECT * FROM payment_orders WHERE id=$1", [order])).rows[0];
    assert.deepEqual(after, { ...before, template_id: "islomiy" });
    await assert.rejects(db.query("UPDATE payment_orders SET amount_minor=999 WHERE id=$1", [order]), /immutable/);
    for (const row of renames) {
      assert.deepEqual((await db.query("SELECT name FROM templates WHERE id=$1", [row.id])).rows, [{ name: row.name }]);
      assert.deepEqual((await db.query("SELECT id FROM templates WHERE id=$1", [row.previousId])).rows, []);
    }
  } finally { await db.close(); }
});
