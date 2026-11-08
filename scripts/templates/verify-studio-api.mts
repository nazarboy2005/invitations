import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { createInvitation, templateById, type Invitation } from "../../packages/contracts/src/index.ts";
import { normalizeInvitation, templateCapabilities } from "../../packages/contracts/src/capabilities.ts";
import { unsupportedInvitationInputs } from "../../packages/contracts/src/studio-inputs.ts";
import { closeDb, getDb } from "../../packages/database/src/index.ts";
import { digest, randomToken } from "../../apps/web/src/server/auth/crypto.ts";

const sql = getDb(), origin = process.env.STUDIO_AUDIT_ORIGIN || "http://127.0.0.1:3001";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
const owner = randomUUID(), token = randomToken(), results: any[] = [];
const headers = { Cookie: `taklifnoma_session=${token}`, Origin: origin, "Content-Type": "application/json" };
const photo = (id: string) => ({ id, url: `/api/media/${id}`, alt: "QA", caption: "QA" });
try {
  const templates = await sql`SELECT t.id,t.published,array_agg(s.event_type ORDER BY s.event_type) FILTER (WHERE s.event_type IS NOT NULL) AS events FROM templates t LEFT JOIN template_supported_event_types s ON s.template_id=t.id GROUP BY t.id ORDER BY t.id`;
  await sql`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${owner},${-Math.floor(Math.random() * 1e12) - 1},'Disposable Studio capability verification')`;
  await sql`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${owner},${digest(token)},'Studio capability verification',now()+interval '1 hour',now()+interval '1 hour')`;
  for (const template of templates) {
    const definition = templateById(template.id);
    if (!definition || !templateCapabilities(template.id).hasRenderer) {
      const unavailable = createInvitation(template.id);
      const response = await fetch(`${origin}/api/invitations`, { method: "POST", headers, body: JSON.stringify({ invitation: unavailable }) });
      assert.equal(response.status, 409, template.id);
      assert.equal((await response.json()).error.code, "TEMPLATE_UNAVAILABLE", template.id);
      results.push({ id: template.id, published: template.published, unavailable: true, capabilities: templateCapabilities(template.id) });
      continue;
    }
    const base = normalizeInvitation(createInvitation(template.id));
    base.eventType = template.events?.[0] ?? definition.supportedEventTypes[0];
    base.startsAt = "2027-06-14T18:30";
    await sql`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${base.id},${owner},${template.id},'draft',${sql.json(base)})`;
    const raw = structuredClone(base), c = templateCapabilities(template.id);
    raw.gallery = Array.from({ length: c.gallery < 50 ? c.gallery + 1 : 1 }, () => photo(randomUUID()));
    raw.content["uz-Latn"].people = Array(Math.min(20, c.people + 1)).fill("QA person");
    raw.story = [{ id: "story", title: { "uz-Latn": "QA story" }, text: {} }];
    raw.artistLineup = [{ id: "artist", name: { "uz-Latn": "QA artist" }, role: {}, imageUrl: "", imageAssetId: null }];
    raw.program = [{ id: "p", time: "18:00" }];
    raw.content["uz-Latn"].programTitles = { p: "QA program" };
    raw.content["uz-Latn"].programDescriptions = { p: "QA program description" };
    raw.content["uz-Latn"].hosts = "QA hosts";
    raw.content["uz-Latn"].greeting = "QA greeting";
    raw.content["uz-Latn"].eventLabel = "QA event";
    raw.content["uz-Latn"].programHeading = "QA heading";
    raw.dressCode = { enabled: true, style: { "uz-Latn": "QA style" }, text: { "uz-Latn": "QA text" }, note: { "uz-Latn": "QA note" }, colors: [{ id: "c", name: { "uz-Latn": "QA color" }, hex: "#ccbbaa" }] };
    raw.gift = { enabled: true, receiptUploadEnabled: true, cardNumber: "8600123412341234", cardHolder: "QA owner" };
    raw.music = { enabled: true, assetId: null, url: "/music/catalog/emotional-piano.mp3", filename: "QA" };
    raw.contacts = { phoneNumber: "+998901234567", telegramUsername: "qa_username", instagramUrl: "https://example.com/unused" };
    raw.rsvp = { enabled: true, deadline: "2027-06-01", maxPartySize: 2 };
    raw.wishes = { enabled: true, requireApproval: true };
    raw.celebrantAge = 7;
    raw.templateData = { "forged-template": { unsupported: "QA" } };
    const expected = unsupportedInvitationInputs(raw, base).map(f => f.path).sort();
    const response = await fetch(`${origin}/api/invitations/${base.id}`, { method: "PUT", headers, body: JSON.stringify({ invitation: raw, capabilities: { gallery: 50, gift: true, story: 20, inputs: { hosts: true } } }) });
    const body = await response.json();
    assert.equal(response.status, 400, `${template.id}: ${JSON.stringify(body)}`);
    assert.equal(body.error.code, "UNSUPPORTED_TEMPLATE_INPUT", template.id);
    assert.deepEqual(body.error.fields.map((f: any) => f.path).sort(), expected, template.id);
    const [unchanged] = await sql`SELECT data FROM invitations WHERE id=${base.id}`;
    assert.deepEqual(unchanged.data, base, `${template.id}: rejected request wrote data`);
    const valid = await fetch(`${origin}/api/invitations/${base.id}`, { method: "PUT", headers, body: JSON.stringify({ invitation: base }) });
    const saved = await valid.json();
    assert.equal(valid.status, 200, `${template.id}: valid baseline ${JSON.stringify(saved)}`);
    assert.equal(saved.invitation.revision, 2);
    results.push({ id: template.id, published: template.published, rejectedFields: expected, validSave: true });
    if (results.length % 20 === 0) console.log(`Verified ${results.length}/${templates.length} database rows`);
  }
  // New records use the same rejection path, before INSERT.
  const create = normalizeInvitation(createInvitation("taklifla-asalari"));
  create.gallery = [photo(randomUUID())];
  const post = await fetch(`${origin}/api/invitations`, { method: "POST", headers, body: JSON.stringify({ invitation: create }) });
  assert.equal(post.status, 400);
  assert.equal((await post.json()).error.code, "UNSUPPORTED_TEMPLATE_INPUT");
  assert.equal((await sql`SELECT id FROM invitations WHERE id=${create.id}`).length, 0);
  // Real switches retain already-owned content; the hidden edit is rejected.
  let previous = normalizeInvitation(createInvitation("anor"));
  previous.gallery = [photo(randomUUID())];
  await sql`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${previous.id},${owner},'anor','draft',${sql.json(previous)})`;
  const switched = { ...previous, templateId: "taklifla-asalari", eventType: "birthday" as const };
  const switchResponse = await fetch(`${origin}/api/invitations/${previous.id}`, { method: "PUT", headers, body: JSON.stringify({ invitation: switched }) });
  const switchBody = await switchResponse.json();
  assert.equal(switchResponse.status, 200, JSON.stringify(switchBody));
  assert.deepEqual(switchBody.invitation.gallery, previous.gallery);
  const edited: Invitation = switchBody.invitation;
  edited.gallery[0].caption = "Hidden edit";
  const hiddenEdit = await fetch(`${origin}/api/invitations/${previous.id}`, { method: "PUT", headers, body: JSON.stringify({ invitation: edited }) });
  assert.equal(hiddenEdit.status, 400);
  assert.equal((await hiddenEdit.json()).error.code, "UNSUPPORTED_TEMPLATE_INPUT");
  mkdirSync("docs/qa/2026-11-08-studio-inputs", { recursive: true });
  writeFileSync("docs/qa/2026-11-08-studio-inputs/api-verification.json", JSON.stringify({ templates: results, postRejectedBeforeInsert: true, switchPreserved: true, hiddenEditRejected: true }, null, 2) + "\n");
  console.log(JSON.stringify({ rows: results.length, published: results.filter(r => r.published).length, unpublished: results.filter(r => !r.published).length, saves: results.filter(r => r.validSave).length, rejectedFields: results.reduce((sum, r) => sum + (r.rejectedFields?.length || 0), 0) }));
} finally {
  await sql`DELETE FROM invitations WHERE owner_id=${owner}`;
  await sql`DELETE FROM sessions WHERE user_id=${owner}`;
  await sql`DELETE FROM users WHERE id=${owner}`;
  await closeDb();
}
