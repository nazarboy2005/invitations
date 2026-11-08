import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { addLanguage, createInvitation, invitationSchema, switchTemplate, TEMPLATES, type Invitation } from "../packages/contracts/src/index";
import { normalizeInvitation, templateCapabilities } from "../packages/contracts/src/capabilities";
import { invitationForStorage, studioSavePayload, unsupportedInvitationInputs } from "../packages/contracts/src/studio-inputs";
import { publicationIssues } from "../packages/contracts/src/publication";

const photo = (id = "photo") => ({ id, url: `/api/media/${id}`, alt: "Photo", caption: "Caption" });
function blank(id: string) { return normalizeInvitation(createInvitation(id)); }

test("all catalog templates enforce every Studio section and individual field before projection", () => {
  let checks = 0;
  for (const template of TEMPLATES) {
    const c = templateCapabilities(template.id);
    const cases: Array<[string, boolean, (i: Invitation) => void]> = [
      ["gallery", c.gallery > 0, i => { i.gallery = [photo()]; }],
      ["program", c.program, i => { i.program = [{ id: "p", time: "18:00" }]; }],
      ["story", c.story > 0, i => { i.story = [{ id: "s", title: { en: "Story" }, text: {} }]; }],
      ["artistLineup", c.artists > 0, i => { i.artistLineup = [{ id: "a", name: { en: "Singer" }, role: {}, imageUrl: "", imageAssetId: null }]; }],
      ["music", c.music, i => { i.music = { enabled: true, url: "/music/catalog/emotional-piano.mp3", assetId: null, filename: "Piano" }; }],
      ["gift.cardNumber", c.gift, i => { i.gift.cardNumber = "8600123456789012"; }],
      ["gift.receiptUploadEnabled", c.gift && c.receipts, i => { i.gift.receiptUploadEnabled = true; }],
      ["contacts.phoneNumber", c.phone, i => { i.contacts.phoneNumber = "+998901234567"; }],
      ["contacts.telegramUsername", c.telegram, i => { i.contacts.telegramUsername = "myusername"; }],
      ["contacts.instagramUrl", false, i => { i.contacts.instagramUrl = "https://example.com/unused"; }],
      ["venue", c.maps, i => { i.venue = { mapUrl: "https://yandex.uz/maps/?ll=69.28,41.31", latitude: 41.31, longitude: 69.28 }; }],
      ["rsvp.enabled", c.rsvp !== "none", i => { i.rsvp.enabled = true; }],
      ["rsvp.deadline", c.rsvp !== "none" && c.rsvpDeadline, i => { i.rsvp.deadline = "2027-01-01"; }],
      ["rsvp.maxPartySize", false, i => { i.rsvp.maxPartySize = 10; }],
      ["wishes.enabled", c.wishes, i => { i.wishes.enabled = true; }],
      ["wishes.requireApproval", false, i => { i.wishes.requireApproval = false; }],
      ["celebrantAge", c.age, i => { i.eventType = "birthday"; i.celebrantAge = 7; }],
      ["dressCode.enabled", c.dressCode, i => { i.dressCode.enabled = true; }],
      ...(["style", "text", "note"] as const).map(field => [
        `dressCode.${field}`, c.dressCode && c.inputs[({ style: "dressStyle", text: "dressText", note: "dressNote" } as const)[field]],
        (i: Invitation) => { i.dressCode[field] = { en: "Creator text" }; },
      ] as [string, boolean, (i: Invitation) => void]),
      ...(["hosts", "greeting", "eventLabel", "programHeading", "programDescriptions"] as const).map(field => [
        `content.uz-Latn.${field}`,
        c.inputs[field] && (!field.startsWith("program") || c.program),
        (i: Invitation) => { if (field === "programDescriptions") i.content["uz-Latn"][field] = { p: "Creator description" }; else i.content["uz-Latn"][field] = "Creator text"; },
      ] as [string, boolean, (i: Invitation) => void]),
    ];
    for (const [path, supported, change] of cases) {
      const i = blank(template.id); change(i);
      const fields = unsupportedInvitationInputs(i);
      assert.equal(fields.some(f => path.startsWith(f.path) || f.path.startsWith(path)), !supported, `${template.id}: ${path}`);
      if (!supported) assert.deepEqual(unsupportedInvitationInputs(studioSavePayload(i)), [], `${template.id}: sanitized ${path}`);
      checks++;
    }
  }
  assert.ok(checks > 3000);
});

test("slot limits reject extra photos, people, story, program and colors for every template", () => {
  for (const t of TEMPLATES) {
    const c = templateCapabilities(t.id);
    const i = blank(t.id);
    i.gallery = Array.from({ length: c.gallery + 1 }, (_, n) => photo(String(n)));
    assert.ok(unsupportedInvitationInputs(i).some(f => f.path === `gallery.${c.gallery}`), t.id);
    i.gallery = [];
    i.content["uz-Latn"].people = Array(c.people + 1).fill("Name");
    assert.ok(unsupportedInvitationInputs(i).some(f => f.path === `content.uz-Latn.people.${c.people}`), t.id);
    i.content["uz-Latn"].people = [];
    i.story = Array.from({ length: c.story + 1 }, (_, n) => ({ id: String(n), title: { en: "Chapter" }, text: {} }));
    assert.ok(unsupportedInvitationInputs(i).some(f => f.path === `story.${c.story}`), t.id);
    i.story = [];
    const limit = c.program ? c.programLimit : 0;
    i.program = Array.from({ length: limit + 1 }, (_, n) => ({ id: String(n), time: "18:00" }));
    assert.ok(unsupportedInvitationInputs(i).some(f => f.path === `program.${limit}`), t.id);
  }
});

test("color names, swatches, and the actual palette count are independent inputs", () => {
  for (const t of TEMPLATES) {
    const c = templateCapabilities(t.id), i = blank(t.id);
    const limit = c.dressCode && (c.inputs.dressColorNames || c.inputs.dressColorHex) ? c.dressColorLimit : 0;
    i.dressCode.colors = [{ id: "c", name: {}, hex: "#000000" }];
    i.dressCode.colors[0].name = { en: "Gold" };
    assert.equal(unsupportedInvitationInputs(i).some(f => f.path.startsWith("dressCode.colors")), !(c.dressCode && c.inputs.dressColorNames), `${t.id} names`);
    i.dressCode.colors[0] = { id: "c", name: {}, hex: "#ccaabb" };
    assert.equal(unsupportedInvitationInputs(i).some(f => f.path.startsWith("dressCode.colors")), !(c.dressCode && c.inputs.dressColorHex), `${t.id} hex`);
    i.dressCode.colors = Array.from({ length: limit + 1 }, (_, n) => ({ id: String(n), name: { en: "Gold" }, hex: "#ccaabb" }));
    assert.ok(unsupportedInvitationInputs(i).some(f => f.path === `dressCode.colors.${limit}`), t.id);
  }
});

test("unsupported values in disabled features and inactive translations cannot bypass validation", () => {
  const i = addLanguage(blank("asalari"), "ru");
  i.enabledLocales = ["uz-Latn"];
  i.content.ru.people = ["Child", "Hidden extra name"];
  i.optionalFeatures.gallery = false;
  i.gallery = [photo()];
  i.gift.enabled = false; i.gift.cardNumber = "8600123456789012";
  assert.ok(unsupportedInvitationInputs(i).some(f => f.path === "gallery.0"));
  assert.ok(unsupportedInvitationInputs(i).some(f => f.path === "gift"));
  assert.ok(unsupportedInvitationInputs(i).some(f => f.path === "content.ru.people.1"));
});

test("switches preserve server-owned hidden content but reject additions and changes", () => {
  const previous = blank("anor");
  previous.gallery = [photo()];
  previous.gift = { enabled: true, receiptUploadEnabled: true, cardNumber: "8600123456789012", cardHolder: "Owner" };
  previous.content["uz-Latn"].hosts = "Family";
  const next = structuredClone(switchTemplate(previous, "asalari"));
  assert.deepEqual(unsupportedInvitationInputs(next, previous), []);
  const stored = invitationForStorage(next);
  assert.deepEqual(stored.gallery, previous.gallery);
  assert.equal(stored.gift.cardHolder, "Owner");
  assert.deepEqual(normalizeInvitation(stored).gallery, []);
  assert.equal(normalizeInvitation(stored).gift.enabled, false);
  assert.deepEqual(switchTemplate(stored, "anor").gallery, previous.gallery);
  next.gallery[0] = { ...next.gallery[0], caption: "Forged hidden edit" };
  assert.ok(unsupportedInvitationInputs(next, previous).some(f => f.path === "gallery.0"));
  assert.deepEqual(studioSavePayload(next, previous).gallery, previous.gallery);
  assert.deepEqual(unsupportedInvitationInputs(studioSavePayload(next, previous), previous), []);
});

test("template-specific input schemas reject unknown, foreign and nested unsupported keys", () => {
  const i = blank("terrakota");
  i.templateData = { "terrakota": { infoNote: { en: "Allowed" }, footerNote: {}, hiddenApiKey: "Forged" } };
  assert.ok(invitationSchema.safeParse(i).success);
  assert.ok(unsupportedInvitationInputs(i).some(f => f.path.endsWith("hiddenApiKey")));
  i.templateData = { "other-template": { text: "Unsupported" } };
  assert.ok(unsupportedInvitationInputs(i).some(f => f.path === "templateData.other-template"));
  i.templateId = "kongillar-oroli";
  i.templateData = { "kongillar-oroli": { media: { videoUrl: "", liveUrl: "", intro: "", hiddenApiKey: "Forged" } } };
  assert.ok(unsupportedInvitationInputs(i).some(f => f.path.endsWith("media.hiddenApiKey")));
  assert.deepEqual(unsupportedInvitationInputs(studioSavePayload(i)), []);
});

test("source regressions: Zarhal photos, Aurelia two slots, prose colors, and Velvet text only", () => {
  assert.match(readFileSync("apps/web/public/templates/zarhal-sahifa/bridge.js", "utf8"), /state\.gallery/);
  assert.equal(templateCapabilities("zarhal-sahifa").gallery, 50);
  assert.match(readFileSync("apps/web/public/templates/aurelia/assets/js/aurelia-adapter.js", "utf8"), /gallery\[1\]/);
  assert.equal(templateCapabilities("aurelia").gallery, 2);
  assert.equal(templateCapabilities("asalari").inputs.dressColorHex, false);
  assert.equal(templateCapabilities("asalari").inputs.dressColorNames, true);
  assert.equal(templateCapabilities("velvet").inputs.dressText, true);
  assert.equal(templateCapabilities("velvet").inputs.dressStyle, false);
  assert.equal(templateCapabilities("velvet").inputs.hosts, false);
  assert.equal(templateCapabilities("qogoz-ertagi").telegram, true);
});

test("publication never demands a hidden event-label input", () => {
  const i = blank("aurelia");
  assert.equal(publicationIssues(i).some(f => f.path.endsWith("eventLabel")), false);
  i.templateId = "anor";
  assert.equal(publicationIssues(i).some(f => f.path.endsWith("eventLabel")), true);
});
