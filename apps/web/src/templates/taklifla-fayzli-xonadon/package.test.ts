import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { createInvitation, LOCALES } from "../../../../../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../../modules/catalog/preview-sample";
import { makeXonadonPayload } from "./adapter";

const root = path.resolve("apps/web/public/templates/taklifla-fayzli-xonadon");
const read = (name: string) => readFileSync(path.join(root, name), "utf8");
const hash = (data: string | Buffer) => createHash("sha256").update(data).digest("hex");
const provenance = JSON.parse(read("source/provenance.json"));

test("capture stays untouched; all original styles and reveal engine remain auditable", () => {
  const capture = readFileSync(provenance.capture);
  assert.equal(hash(capture), provenance.captureSha256);
  const styles = [...capture.toString().matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]);
  styles.forEach((style, i) => assert.equal(read(`source/style-${i}.css`), style));
  assert.equal(read("template.css"), styles.join("\n").replace(provenance.dependencies[0].url, "assets/art/house.jpg"));
  assert.equal(hash(read("source/reveal.js")), provenance.sourceRevealSha256);
  assert.equal(provenance.requestedSiblingDirectoryPresent, false);
});

test("all exact artwork and font dependencies are local and hash verified", () => {
  assert.equal(provenance.dependencies.length, 15);
  for (const dependency of provenance.dependencies)
    assert.equal(hash(readFileSync(path.join(root, dependency.path))), dependency.sha256);
  assert.equal((read("assets/fonts.css").match(/@font-face/g) ?? []).length, 13);
  assert.doesNotMatch(read("assets/fonts.css") + read("template.css"), /https?:/);
});

test("production markup has no source demo content, runtime, headcount or fabricated menu", () => {
  const html = read("index.html");
  assert.doesNotMatch(html, /Karimov|14\.08\.2026|Magnum|7 Avgust|Smart Casual|mozzarella|ricotta|qo'zichoq|rsvp-guests|cloudflareinsights|localStorage|URLSearchParams/);
  assert.match(html, /class="menu reveal" hidden/);
  assert.doesNotMatch(html, /class="(?:gift|gallery|wishes|program|contacts)/);
  assert.match(read("platform-adapter.js"), /event\.source !== parent/);
  assert.match(read("platform-adapter.js"), /partySize: statusValue === "yes" \? 1 : 0/);
  assert.match(read("platform-adapter.js"), /!response.ok \|\| result.ok !== true/);
  assert.match(read("platform-adapter.js"), /if \(data.preview\)/);
});

test("all locale content, personalized greeting, timezone, dress palette IDs map without mutation", () => {
  const invitation = createTemplatePreviewSample("taklifla-fayzli-xonadon");
  invitation.venue.mapUrl = ""; invitation.venue.latitude = 41.3; invitation.venue.longitude = 69.2;
  const snapshot = JSON.stringify(invitation);
  for (const locale of LOCALES) {
    const c = invitation.content[locale];
    const { payload } = makeXonadonPayload(invitation, locale, { invitationId: "qa", guestName: "<Guest>", guestToken: "opaque" });
    assert.equal(payload.content.hosts, c.hosts || c.people.join(" & "));
    assert.equal(payload.content.greeting, c.personalGreeting.replaceAll("{name}", "<Guest>"));
    assert.equal(payload.content.message, c.message);
    assert.equal(payload.mapUrl, "https://www.google.com/maps/search/?api=1&query=41.3,69.2");
    assert.deepEqual(payload.dressCode.colors.map(c => c.id), invitation.dressCode.colors.map(c => c.id));
    assert.equal(payload.guestToken, "opaque");
    assert.equal(payload.locale, locale);
    assert.ok(payload.dateLabel.includes("2027"));
    assert.equal("gift" in payload, false); assert.equal("gallery" in payload, false); assert.equal(payload.menu.length,4);
  }
  assert.equal(JSON.stringify(invitation), snapshot);
});

test("empty authored invitations have no inserted samples and coordinates zero are valid", () => {
  const invitation = createInvitation();
  invitation.venue.latitude = 0; invitation.venue.longitude = 0;
  const { payload } = makeXonadonPayload(invitation, "uz-Latn", { invitationId: "empty" });
  assert.equal(payload.content.hosts, ""); assert.equal(payload.dateLabel, "");
  assert.match(payload.mapUrl, /query=0,0$/);
  assert.equal(payload.music.url, "");
});
