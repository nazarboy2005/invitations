import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { createInvitation, LOCALES, templateById } from "@taklifnoma/contracts";
import { createTemplatePreviewSample } from "@/modules/catalog/preview-sample";
import { makeZarhalPayload } from "./adapter";

const root = process.cwd();
const folder = resolve(root, "apps/web/public/templates/taklifla-zarhal-sahifa");
const provenance = JSON.parse(readFileSync(resolve(folder, "provenance.json"), "utf8"));
const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
test("archive untouched and exact dependency bytes remain packaged", () => {
  assert.equal(hash(readFileSync(resolve(root, provenance.source))), provenance.sourceSha256);
  assert.equal(provenance.dependencies.length, 30);
  for (const item of provenance.dependencies) {
    assert.equal(hash(readFileSync(resolve(folder, item.file))), item.sha256, item.file);
    if (item.capture) assert.equal(hash(readFileSync(resolve(root, "Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Taklifla", item.capture))), item.sha256);
  }
  assert.equal(hash(readFileSync(resolve(folder, "source/template.original.css"))), provenance.sourceCssSha256);
});
test("empty creator data never receives source demo values or absent sections", () => {
  const invitation = createInvitation("taklifla-zarhal-sahifa");
  const before = JSON.stringify(invitation);
  const mapped = makeZarhalPayload(invitation, "uz-Latn", { invitationId: "private", preview: false, sampleWishes: true });
  assert.equal(JSON.stringify(invitation), before);
  assert.deepEqual(mapped.payload.gallery, []);
  assert.equal(mapped.payload.eventInstant, null);
  assert.deepEqual(mapped.payload.variants["uz-Latn"].sampleWishes, []);
  assert.equal(mapped.payload.music.enabled, false);
  for (const key of ["gift", "toyona", "rsvp", "contacts", "story", "program"]) assert.ok(!(key in mapped.payload));
  const html = readFileSync(resolve(folder, "index.html"), "utf8");
  assert.doesNotMatch(html, /Aziza|Sardor|Magnum|Yunusobod|2026|analytics|cloudflareinsights|src=""/);
  assert.ok(html.includes('hidden style="display:none;"'));
  assert.doesNotMatch(html, /<script[^>]+https?:/);
});
test("preview media and wishes are ephemeral and creator uploads replace them", () => {
  const invitation = createTemplatePreviewSample("taklifla-zarhal-sahifa");
  const before = JSON.stringify(invitation);
  for (const locale of LOCALES) {
    const mapped = makeZarhalPayload(invitation, locale, { invitationId: "preview", preview: true, sampleWishes: true, guestName: "Mehmon" });
    assert.equal(mapped.payload.gallery.length, 3);
    assert.equal(mapped.payload.variants[locale].sampleWishes.length, 3);
    assert.deepEqual(mapped.payload.variants[locale].names, invitation.content[locale].people);
    assert.equal(mapped.payload.eventInstant, Date.parse("2027-06-12T12:00:00Z"));
    assert.ok(mapped.payload.variants[locale].greeting.includes("Mehmon"));
  }
  assert.equal(JSON.stringify(invitation), before);
  invitation.gallery = [{id: "own", url:"/own.webp", alt:"Own", caption:"Caption"}];
  assert.equal(makeZarhalPayload(invitation,"en",{invitationId:"preview",preview:true,sampleWishes:true}).payload.gallery[0].id,"own");
  assert.deepEqual(makeZarhalPayload(createInvitation("taklifla-zarhal-sahifa"),"en",{invitationId:"public",preview:false,sampleWishes:true}).payload.gallery, []);
});
test("catalog music is preview-only, silent preference wins, and registry metadata is source-specific", () => {
  const invitation = createInvitation("taklifla-zarhal-sahifa");
  assert.equal(makeZarhalPayload(invitation,"uz-Latn",{invitationId:"x",catalogMusic:true}).payload.music.enabled,false);
  assert.equal(makeZarhalPayload(invitation,"uz-Latn",{invitationId:"x",preview:true,catalogMusic:true}).payload.music.enabled,true);
  assert.equal(makeZarhalPayload(invitation,"uz-Latn",{invitationId:"x",preview:true,catalogMusic:true,silentPlayback:true}).payload.music.enabled,false);
  const definition = templateById("taklifla-zarhal-sahifa");
  assert.ok(definition);
  assert.equal(definition.name, "Zarhal Sahifa");
  assert.equal(definition.previewEventType, "wedding");
  assert.deepEqual(definition.supportedEventTypes, ["wedding"]);
  assert.deepEqual(definition.categoryIds, ["wedding"]);
  assert.equal(definition.published, true);
  assert.equal(definition.priceMinor, 150000);
  const preview = createTemplatePreviewSample("taklifla-zarhal-sahifa");
  assert.deepEqual(preview.gallery.map((photo) => photo.url), [
    "/templates/taklifla-zarhal-sahifa/assets/preview/photo-1519741497674-611481863552.avif",
    "/templates/taklifla-zarhal-sahifa/assets/preview/photo-1606800052052-a08af7148866.avif",
    "/templates/taklifla-zarhal-sahifa/assets/preview/photo-1525772764200-be829a350797.avif",
  ]);
  assert.equal(existsSync(resolve(folder,"preview.webp")),true);
});
