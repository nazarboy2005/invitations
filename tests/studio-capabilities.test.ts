import assert from "node:assert/strict";
import test from "node:test";
import { addLanguage, createInvitation, invitationSchema, TEMPLATES } from "../packages/contracts/src/index";
import { normalizeInvitation, templateCapabilities } from "../packages/contracts/src/capabilities";
import { visitorLocale } from "../packages/contracts/src/visitor-locale";
import { publicationIssues } from "../packages/contracts/src/publication";
import { assertManagedImages } from "../apps/web/src/server/publication";
import { paymentIdentity, paymentIdentityMatches } from "../packages/contracts/src/payment";

test("every catalog design explicitly declares supported slots, including maps", () => {
  for (const template of TEMPLATES) {
    const c = templateCapabilities(template.id);
    assert.equal(c, template.capabilities, template.id);
    assert.equal(c.maps, true, template.id);
    assert.ok(c.people >= 1 && c.people <= 20, template.id);
    assert.ok(!c.receipts || c.gift, template.id);
  }
  assert.equal(templateCapabilities("unregistered").gallery, 0);
  assert.equal(templateCapabilities("unregistered").gift, false);
});

test("a crafted unsupported payload is stripped by the server's shared projection", () => {
  const raw = addLanguage(createInvitation("taklifla-asalari"), "ru");
  raw.content["uz-Latn"].people = ["Bola", "Not rendered"];
  raw.content.ru.people = ["Ребёнок", "Not rendered"];
  raw.gallery = [{ id: "private", url: "https://example.com/protected.jpg", alt: "", caption: "" }];
  raw.story = [{ id: "hidden", title: { ru: "Invisible" }, text: {} }];
  raw.gift = { enabled: true, receiptUploadEnabled: true, cardNumber: "sensitive", cardHolder: "unused" };
  raw.contacts = { phoneNumber: "secret", telegramUsername: "secret", instagramUrl: "secret" };
  raw.rsvp = { enabled: true, deadline: "2027-05-01", maxPartySize: 99 };
  raw.templateData = { "other-design": { secret: "unused" } };
  const before = JSON.stringify(raw);
  const saved = normalizeInvitation(raw);
  assert.deepEqual(saved.gallery, []);
  assert.deepEqual(saved.story, []);
  assert.deepEqual(saved.templateData, {});
  assert.equal(saved.gift.cardNumber, "");
  assert.equal(saved.gift.receiptUploadEnabled, false);
  assert.deepEqual(saved.contacts, { phoneNumber: "", telegramUsername: "", instagramUrl: "" });
  assert.deepEqual(saved.rsvp, { enabled: false, deadline: "", maxPartySize: 1 });
  assert.deepEqual(saved.content.ru.people, ["Ребёнок"]);
  assert.equal(JSON.stringify(raw), before);
  assert.deepEqual(normalizeInvitation(saved), saved);
  assert.ok(invitationSchema.safeParse(saved).success);
  assert.doesNotThrow(() => assertManagedImages(saved));
});

test("Barakali stores one portrait, no program/dress, and only its phone contact", () => {
  const raw = createInvitation("taklifla-barakali");
  raw.gallery = [1, 2].map((i) => ({ id: String(i), url: `/api/media/${i}`, alt: "", caption: "" }));
  raw.program = [{ id: "hidden", time: "19:00" }];
  raw.content["uz-Latn"].programTitles.hidden = "unused";
  raw.dressCode = { enabled: true, style: { ru: "unused" }, text: {}, note: {}, colors: [] };
  raw.contacts.phoneNumber = "+998901234567";
  raw.contacts.telegramUsername = "unused";
  const saved = normalizeInvitation(raw);
  assert.equal(saved.gallery.length, 1);
  assert.deepEqual(saved.program, []);
  assert.deepEqual(saved.content["uz-Latn"].programTitles, {});
  assert.equal(saved.dressCode.enabled, false);
  assert.deepEqual(saved.dressCode.style, {});
  assert.equal(saved.contacts.phoneNumber, raw.contacts.phoneNumber);
  assert.equal(saved.contacts.telegramUsername, "");
});

test("RSVP, receipt, age and story limits match different real designs", () => {
  const source = createInvitation("taklifla-tovus");
  source.gift = { enabled: true, receiptUploadEnabled: true, cardNumber: "unused", cardHolder: "unused" };
  source.rsvp = { enabled: true, deadline: "2027-05-01", maxPartySize: 20 };
  source.celebrantAge = 10;
  const saved = normalizeInvitation(source);
  assert.equal(templateCapabilities(source.templateId).rsvp, "deadline");
  assert.equal(saved.rsvp.deadline, "2027-05-01");
  assert.equal(saved.rsvp.maxPartySize, 1);
  assert.equal(saved.gift.enabled, false);
  assert.equal(saved.celebrantAge, null);
  source.templateId = "taklifla-parilar-ertagi";
  assert.equal(normalizeInvitation(source).rsvp.deadline, "");
  source.templateId = "taklifla-toglar-bagrida";
  source.story = [1, 2, 3].map((id) => ({ id: String(id), title: {}, text: {} }));
  assert.equal(normalizeInvitation(source).story.length, 2);
});

test("music defaults on, explicit off survives, and an empty selection is silent without a blocker", () => {
  const draft = createInvitation("anor");
  assert.equal(draft.music.enabled, true);
  assert.equal(draft.music.url, "/music/catalog/emotional-piano.wav");
  draft.music.enabled = false;
  assert.equal(normalizeInvitation(draft).music.enabled, false);
  assert.ok(normalizeInvitation(draft).music.url);
  draft.music = { enabled: true, assetId: null, url: "", filename: "" };
  assert.equal(normalizeInvitation(draft).music.enabled, false);
  assert.equal(publicationIssues(draft).some((issue) => issue.path === "music"), false);
});

test("creator images require verified uploads instead of protected or expiring remote links", () => {
  const draft = createInvitation("anor");
  draft.gallery = [{ id: "x", url: "https://example.com/not-an-image", alt: "", caption: "" }];
  assert.throws(() => assertManagedImages(draft), /fayl sifatida yuklang/);
  draft.gallery[0].url = "/api/media/owned-asset";
  assert.doesNotThrow(() => assertManagedImages(draft));
});

test("removing unused identity slots preserves checkout, while visible identity changes remain locked", () => {
  const old = createInvitation("taklifla-asalari");
  old.content["uz-Latn"].people = ["Bola", "Unused old slot"];
  const snapshot = paymentIdentity(old);
  const normalized = normalizeInvitation(old);
  assert.equal(paymentIdentityMatches(normalized, snapshot), true);
  normalized.content["uz-Latn"].people[0] = "Other child";
  assert.equal(paymentIdentityMatches(normalized, snapshot), false);
  assert.equal(paymentIdentityMatches(old, "malformed"), false);
  const changedDate = { ...old, startsAt: "2027-05-01T18:00" };
  assert.equal(paymentIdentityMatches(changedDate, snapshot), false);
});

test("visitor language honors guest choice, then country/browser hints, within enabled translations", () => {
  const invitation = { defaultLocale: "uz-Latn" as const, enabledLocales: ["uz-Latn", "uz-Cyrl", "ru", "en"] as const };
  const config = { ...invitation, enabledLocales: [...invitation.enabledLocales] };
  assert.equal(visitorLocale(config, "en", "UZ", "ru"), "en");
  assert.equal(visitorLocale(config, undefined, "RU", "en-US"), "ru");
  assert.equal(visitorLocale(config, undefined, "UZ", "uz-Cyrl,ru;q=0.8"), "uz-Cyrl");
  assert.equal(visitorLocale(config, undefined, null, "ru;q=0.5,en-US;q=0.9"), "en");
  assert.equal(visitorLocale(config, undefined, null, "xx,ru;q=0,en;q=0.8"), "en");
  assert.equal(visitorLocale({ ...config, enabledLocales: ["uz-Latn"] }, "en", "RU", "ru"), "uz-Latn");
});
