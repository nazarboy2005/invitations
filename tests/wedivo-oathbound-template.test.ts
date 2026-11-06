import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { createInvitation, LOCALES } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";
import { makeOathboundPayload } from "../apps/web/src/templates/wedivo-oathbound/adapter";

const packageRoot = path.join(process.cwd(), "apps/web/public/templates/wedivo-oathbound");
const read = (file: string) => readFileSync(path.join(packageRoot, file), "utf8");
const sha = (value: Buffer | string) => createHash("sha256").update(value).digest("hex");
const provenance = JSON.parse(read("source/provenance.json"));

test("Oathbound preserves its original capture and exact procedural game engine", () => {
  const capture = readFileSync(path.join(process.cwd(), provenance.capture));
  assert.equal(sha(capture), provenance.captureSha256);
  const script = /<script id="main-script">([\s\S]*?)<\/script>/.exec(capture.toString("utf8"))![1];
  assert.equal(sha(script), provenance.embeddedScriptSha256);
  const engineBoundary = "/* ---------- DOM helpers & content ---------- */";
  assert.equal(sha(read("source/template.js").split(engineBoundary)[0].replace(/\r\n/g, "\n")), sha(script.split(engineBoundary)[0].replace(/\r\n/g, "\n")));
});

test("all source textures, exact font weights and preview media are local and hash verified", () => {
  assert.equal(provenance.dependencies.length, 20);
  for (const dependency of provenance.dependencies) {
    assert.equal(sha(readFileSync(path.join(packageRoot, dependency.path))), dependency.sha256);
  }
  assert.doesNotMatch(read("assets/fonts.css"), /https?:/);
  assert.doesNotMatch(read("source/template.css"), /https?:\/\/(?!www\.w3\.org)/);
  assert.equal((read("assets/fonts.css").match(/@font-face/g) || []).length, 10);
});

test("production HTML excludes provider runtime, sample invitation data, keys, headcount and card UI", () => {
  const html = read("index.html");
  assert.doesNotMatch(html, /wedivo-parameters|wedivo-preview-stub|Bagas|Aulia|Bapak\/Ibu|Grand Ballroom|AIza|F3Qioc|rsvp-pax|rsvp-minus|rsvp-plus|cardNumber/);
  assert.doesNotMatch(read("source/template.js"), /@rakhapramana|@alunakirana|AIza|https:\/\/wedivo/);
  assert.match(read("platform-adapter.js"), /partySize: status === "yes" \? 1 : 0/);
  assert.match(read("platform-adapter.js"), /event\.source !== parent/);
  assert.match(read("platform-adapter.js"), /Pending wishes are never inserted/);
  assert.match(html, /id="gift-amount"[^>]*disabled|disabled[^>]*id="gift-amount"/);
});

test("canonical gallery is ephemeral, authored media wins and empty public invitations stay empty", () => {
  const invitation = createTemplatePreviewSample("wedivo-oathbound");
  const original = JSON.stringify(invitation);
  const sample = makeOathboundPayload(invitation, "uz-Latn", { invitationId: "qa", preview: true, sampleWishes: true });
  assert.equal(sample.payload.gallery.length, 6);
  assert.deepEqual(sample.payload.gallery.map((photo) => photo.url), provenance.previewOnlyGallery);
  assert.equal(JSON.stringify(invitation), original);
  assert.equal(makeOathboundPayload(invitation, "uz-Latn", { invitationId: "qa" }).payload.gallery.length, 0);
  invitation.gallery = [{ id: "authored", url: "/uploads/my-photo.jpg", alt: "My photo", caption: "My memory" }];
  assert.deepEqual(makeOathboundPayload(invitation, "uz-Latn", { invitationId: "qa", preview: true, sampleWishes: true }).payload.gallery, invitation.gallery);
  assert.equal(makeOathboundPayload(createInvitation(), "en", { invitationId: "empty" }).payload.content.people.length, 0);
});

test("locale, personalized greeting, all repeatable rows and timezone instant map without changing content", () => {
  const invitation = createTemplatePreviewSample("wedivo-oathbound");
  invitation.story = Array.from({ length: 8 }, (_, i) => ({ id: `s${i}`, title: { en: `Chapter ${i}` }, text: { en: `Story ${i}` } }));
  for (const locale of LOCALES) {
    invitation.content[locale].personalGreeting = "Hello {name}";
    const { payload } = makeOathboundPayload(invitation, locale, { invitationId: "qa", guestName: "<Guest>", guestToken: "opaque" });
    assert.equal(payload.content.greeting, "Hello <Guest>");
    assert.deepEqual(payload.content.people, invitation.content[locale].people);
    assert.deepEqual(payload.program.map((item) => item.id), invitation.program.map((item) => item.id));
    assert.equal(payload.wallTime, "17:00");
    assert.equal(payload.instant, "2027-06-12T12:00:00.000Z");
    assert.equal(payload.guestToken, "opaque");
  }
  assert.equal(makeOathboundPayload(invitation, "en", { invitationId: "qa" }).payload.story.length, 8);
  assert.equal("cardNumber" in makeOathboundPayload(invitation, "en", { invitationId: "qa" }).payload, false);
});

test("Uzbek default includes the game, narrative, accessible UI and CSS labels without translating authored data", () => {
  const sandbox = { window: {} as { OathboundUzbek?: Record<string, string> } };
  vm.runInNewContext(read("platform-i18n.js"), sandbox);
  const translations = sandbox.window.OathboundUzbek!;
  assert.equal(translations.Oathbound, "Ahd yo‘li");
  for (const phrase of ["The Wedding Day", "Roll for initiative", "Caster's name", "Close photo", "Previous photo", "Treasure chest", "The Lore Stone", "So… you have come at last, ", "Your blessing"]) {
    assert.ok(translations[phrase], phrase);
    assert.notEqual(translations[phrase], phrase);
  }
  assert.match(read("platform-adapter.js"), /data-oath-authored/);
  assert.match(read("platform-adapter.js"), /input\.setCustomValidity\(requiredMessage\)/);
  assert.match(read("source/template.js"), /who = window\.OATHBOUND\.translate\(who\); text = window\.OATHBOUND\.translate\(text\)/);
  assert.match(read("platform.css"), /--oath-empty/);
  assert.doesNotMatch(read("platform-adapter.js"), /createElement\("nav"\)/);
});

test("catalog art is the actual 450x800 Uzbek source opening with reproducible fixture and source hashes", () => {
  const cover = JSON.parse(read("preview.provenance.json"));
  const png = readFileSync(path.join(packageRoot, cover.image));
  assert.equal(png.readUInt32BE(16), 450);
  assert.equal(png.readUInt32BE(20), 800);
  assert.equal(sha(png), cover.imageSha256);
  assert.equal(sha(readFileSync(cover.fixture)), cover.fixtureSha256);
  assert.equal(sha(readFileSync(path.join(packageRoot, "source/template.js"))), cover.sourceScriptSha256);
  assert.equal(cover.locale, "uz-Latn");
  assert.equal(cover.displayName, "Ahd yo‘li");
});
