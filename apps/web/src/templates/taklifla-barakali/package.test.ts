import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { createTemplatePreviewSample } from "@/modules/catalog/preview-sample";
import { makeBarakaliPayload } from "./adapter";

const root = resolve(import.meta.dirname, "../../../../..");
const pkg = resolve(root, "apps/web/public/templates/taklifla-barakali");
const read = (file: string) => readFileSync(resolve(pkg, file), "utf8");
const audit = JSON.parse(read("dependencies.json"));
const hash = (bytes: Buffer | string) => createHash("sha256").update(bytes).digest("hex");

test("selected capture stays intact and source CSS/SVG/motion are reused", () => {
  const bytes = readFileSync(resolve(root, audit.capture));
  assert.equal(hash(bytes), audit.captureSha256);
  const source = bytes.toString("utf8");
  const styles = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  assert.equal(read("source/template.css"), styles[0]);
  assert.equal(read("source/language.css"), styles[1]);
  assert.ok(source.includes(read("source/motion.js")));
  for (const svg of source.matchAll(/<svg[^>]*class="(?:floral|photo-blooms)[\s\S]*?<\/svg>/g)) assert.ok(read("index.html").includes(svg[0]));
  assert.equal(audit.sourceLinkedTemplateCount, 24);
  assert.equal(audit.siblingDirectory.present, false);
  assert.equal(audit.siblingDirectory.referencesInSelectedHtml, 0);
});

test("all local font dependencies resolve with recorded bytes", () => {
  assert.equal(audit.assets.length, 10);
  for (const asset of audit.assets) {
    assert.equal(hash(readFileSync(resolve(pkg, asset.file))), asset.sha256);
  }
  const css = read("fonts/fonts.css");
  for (const url of css.matchAll(/url\(([^)]+)\)/g)) assert.ok(existsSync(resolve(pkg, "fonts", url[1])));
  assert.doesNotMatch(css, /https?:/);
  assert.match(css, /Pinyon Script/); assert.match(css, /DM Mono/);
});

test("served package excludes captured personal data, analytics and fake persistence", () => {
  const html = read("index.html"), bridge = read("bridge.js");
  assert.doesNotMatch(html + bridge, /Diyora|Magnum|2026-07-12|998901234567|cloudflareinsights|barakali-wishes|localStorage|\/api\/rsvp/);
  assert.doesNotMatch(bridge, /\b(?:alert|prompt|confirm)\s*\(/);
  assert.match(bridge, /event\.source !== parent/);
  assert.equal(audit.published, true); assert.equal(audit.selectable, true);
});

test("four-language payload is read-only and personalized; fixtures are opt-in only", () => {
  // Canonical shared birthday fixture, used only inside this verification.
  const invitation = createTemplatePreviewSample("taklifla-barakali");
  const before = JSON.stringify(invitation);
  for (const language of invitation.enabledLocales) {
    invitation.content[language].personalGreeting = "{name}, welcome";
  }
  const snapshot = JSON.stringify(invitation);
  const publicPayload = makeBarakaliPayload(invitation, "uz-Cyrl", { invitationId: "authored", guestName: "Guest <name>", sampleWishes: true, catalogMusic: true });
  assert.equal(JSON.stringify(invitation), snapshot);
  assert.notEqual(before, snapshot);
  for (const value of Object.values(publicPayload.payload.variants)) {
    assert.equal(value.greeting, "Guest <name>, welcome"); assert.deepEqual(value.wishes, []);
  }
  assert.deepEqual(publicPayload.payload.music, { enabled: invitation.music.enabled, url: invitation.music.url });
  const preview = makeBarakaliPayload(invitation, "uz-Latn", { invitationId: "preview", preview: true, sampleWishes: true, catalogMusic: true });
  assert.equal(preview.payload.variants["uz-Latn"].wishes.length, 3);
  assert.equal(preview.payload.music.url, "/music/catalog/emotional-piano.wav");
});

test("empty authored content stays empty; unsupported/source-absent data is not fabricated", () => {
  const invitation = createTemplatePreviewSample("taklifla-barakali");
  invitation.startsAt = ""; invitation.gallery = [];
  for (const value of Object.values(invitation.content)) { value.people = []; value.message = ""; value.venueName = ""; value.address = ""; }
  const value = makeBarakaliPayload(invitation, "uz-Latn", { invitationId: "empty" }).payload.variants["uz-Latn"];
  assert.equal(value.names, ""); assert.equal(value.target, null); assert.equal(value.photo, null); assert.equal(value.message, "");
  assert.ok(!("age" in value)); assert.ok(!("rsvp" in value)); assert.ok(!("program" in value)); assert.ok(!("gift" in value));
});
