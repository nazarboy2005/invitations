import assert from "node:assert/strict";
import test from "node:test";
import { createInvitation, invitationSchema } from "@taklifnoma/contracts";
import {
  createLongNamePreview,
  createTemplatePreviewSample,
  hasAuthoredInvitationContent,
} from "./preview-sample";

test("template samples are illustrative complete invitations", () => {
  const sample = createTemplatePreviewSample("anor");
  assert.deepEqual(sample.content["uz-Latn"].people, ["Asadbek", "Gulhayo"]);
  assert.deepEqual(sample.enabledLocales, ["uz-Latn", "uz-Cyrl", "en", "ru"]);
  assert.deepEqual(sample.content["uz-Cyrl"].people, ["Асадбек", "Гулҳаё"]);
  assert.deepEqual(sample.content.en.people, ["Asadbek", "Gulhayo"]);
  assert.deepEqual(sample.content.ru.people, ["Асадбек", "Гулхаё"]);
  assert.equal(sample.content.ru.greeting, "Ассалому алейкум, дорогой гость!");
  assert.equal(sample.content["uz-Cyrl"].eventLabel, "Никоҳ тўйи");
  assert.equal(sample.program.length, 4);
  assert.equal(sample.program[0].time, "16:00");
  assert.equal(
    sample.content["uz-Latn"].programTitles["sample-meal"],
    "Tabriklar va dasturxon",
  );
  assert.equal(hasAuthoredInvitationContent(sample), true);
  assert.equal(sample.content["uz-Latn"].message.includes("ko‘rishdan"), true);
  assert.equal(sample.content["uz-Cyrl"].eventLabel, "Никоҳ тўйи");
  assert.equal(sample.content.ru.greeting, "Ассалому алейкум, дорогой гость!");
});

test("sample objects are isolated so renderer changes cannot mutate the fixture", () => {
  const first = createTemplatePreviewSample("anor");
  first.content.en.people[0] = "Changed";
  first.program[0].time = "09:00";

  const second = createTemplatePreviewSample("another-template");
  assert.equal(second.content.en.people[0], "Asadbek");
  assert.equal(second.program[0].time, "16:00");
});

test("ephemeral draft previews keep the creator's selected language settings", () => {
  const preview = createTemplatePreviewSample("sahifa", {
    defaultLocale: "ru",
    enabledLocales: ["ru", "en"],
  });

  assert.equal(preview.defaultLocale, "ru");
  assert.deepEqual(preview.enabledLocales, ["ru", "en"]);
  assert.equal(preview.content.ru.people[0], "Асадбек");
  assert.equal(preview.content.en.people[1], "Gulhayo");

  const catalogSample = createTemplatePreviewSample("sahifa");
  assert.equal(catalogSample.defaultLocale, "uz-Latn");
  assert.deepEqual(catalogSample.enabledLocales, [
    "uz-Latn",
    "uz-Cyrl",
    "en",
    "ru",
  ]);
});

test("localized names are stored independently in each enabled language", () => {
  const invitation = createTemplatePreviewSample("oltin-nur");
  invitation.content.ru.people[0] = "Создатель";
  const restored = invitationSchema.parse(
    JSON.parse(JSON.stringify(invitation)),
  );

  assert.deepEqual(restored.content["uz-Latn"].people, ["Asadbek", "Gulhayo"]);
  assert.deepEqual(restored.content["uz-Cyrl"].people, ["Асадбек", "Гулҳаё"]);
  assert.deepEqual(restored.content.en.people, ["Asadbek", "Gulhayo"]);
  assert.deepEqual(restored.content.ru.people, ["Создатель", "Гулхаё"]);
});

test("long-name QA preview is isolated from the canonical catalog sample", () => {
  const canonical = createTemplatePreviewSample("oltin-uzuk");
  const stress = createLongNamePreview(canonical);

  assert.deepEqual(stress.content["uz-Latn"].people, [
    "Gulbahor-Marguba Sayyidabonu",
    "Jahongir-Shohruhbek Mirzohid",
  ]);
  assert.deepEqual(canonical.content["uz-Latn"].people, ["Asadbek", "Gulhayo"]);
  assert.deepEqual(stress.content.ru.people, stress.content.en.people);
  assert.deepEqual(stress.enabledLocales, canonical.enabledLocales);
});

test("long-name QA preview preserves every non-name invitation field", () => {
  const canonical = createTemplatePreviewSample("muhabbat-kitobi");
  canonical.content.en.greeting = "English greeting";
  canonical.content.ru.people = ["Creator one", "Creator two"];
  canonical.story = [
    { id: "chapter-a", title: { en: "Chapter" }, text: { en: "Story" } },
  ];
  const stress = createLongNamePreview(canonical);

  assert.deepEqual(stress.content.en.people, [
    "Gulbahor-Marguba Sayyidabonu",
    "Jahongir-Shohruhbek Mirzohid",
  ]);
  assert.deepEqual(stress.content.ru.people, stress.content.en.people);
  assert.equal(stress.content.en.greeting, "English greeting");
  assert.deepEqual(stress.story, canonical.story);
  assert.deepEqual(canonical.content.en.people, ["Asadbek", "Gulhayo"]);
  assert.deepEqual(canonical.content.ru.people, ["Creator one", "Creator two"]);
});

test("only empty template-selection previews may fall back to sample content", () => {
  const blank = createInvitation("anor");
  assert.equal(hasAuthoredInvitationContent(blank), false);

  blank.eventType = "wedding";
  assert.equal(hasAuthoredInvitationContent(blank), true);

  const authored = createInvitation("anor");
  authored.content["uz-Latn"].people = ["Nazar"];
  assert.equal(hasAuthoredInvitationContent(authored), true);

  const storyOnly = createInvitation("muhabbat-kitobi");
  storyOnly.story = [
    { id: "chapter-1", title: { en: "Our meeting" }, text: {} },
  ];
  assert.equal(hasAuthoredInvitationContent(storyOnly), true);

  const dressCodeOnly = createInvitation("sahifa");
  dressCodeOnly.dressCode.text["uz-Latn"] = "Pastel ranglarni tanlang";
  assert.equal(hasAuthoredInvitationContent(dressCodeOnly), true);

  const rsvpDisabledOnly = createInvitation("atlas");
  rsvpDisabledOnly.rsvp.enabled = false;
  assert.equal(hasAuthoredInvitationContent(rsvpDisabledOnly), true);

  const giftDetailsOnly = createInvitation("oltin-uzuk");
  giftDetailsOnly.gift.cardHolder = "Asadbek Karimov";
  assert.equal(hasAuthoredInvitationContent(giftDetailsOnly), true);

  const contactsOnly = createInvitation("anor");
  contactsOnly.contacts.telegramUsername = "@taklifnoma";
  assert.equal(hasAuthoredInvitationContent(contactsOnly), true);
});

test("legacy contact cards migrate to optional phone and Telegram fields", () => {
  const invitation = createInvitation();
  const legacy = {
    ...invitation,
    contacts: [
      {
        id: "phone",
        type: "phone",
        label: "Call us",
        value: "+998 90 123 45 67",
      },
      { id: "telegram", type: "telegram", label: "", value: "@taklifnoma" },
    ],
  };

  const parsed = invitationSchema.parse(legacy);
  assert.deepEqual(parsed.contacts, {
    phoneNumber: "+998 90 123 45 67",
    telegramUsername: "@taklifnoma",
  });
});
