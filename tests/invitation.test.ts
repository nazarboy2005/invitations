import test from "node:test";
import assert from "node:assert/strict";
import {
  createInvitation,
  defaultEventLabel,
  defaultDressCode,
  defaultInvitationMessage,
  addLanguage,
  removeLanguage,
  switchTemplate,
  invitationSchema,
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  templateIdSchema,
  formatPrice,
} from "../packages/contracts/src/index";
import { assertCreatorCanEdit } from "../packages/contracts/src/policies";

test("prices render consistently without depending on browser Uzbek ICU support", () => {
  assert.equal(formatPrice(15000000), "150\u00a0000 so‘m");
  assert.equal(formatPrice(123456789), "1\u00a0234\u00a0567,89 so‘m");
  assert.equal(formatPrice(0), "0 so‘m");
});

test("default invitation wording is wedding-specific and localized", () => {
  assert.equal(
    defaultInvitationMessage("wedding", "uz-Latn"),
    "Hayotimizning eng quvonchli kunida — nikoh to‘yimizda — Sizni aziz mehmonimiz sifatida ko‘rishdan baxtiyormiz.",
  );
  assert.equal(defaultInvitationMessage("birthday", "uz-Latn"), "");
  assert.ok(
    defaultInvitationMessage("wedding", "uz-Cyrl").includes("никоҳ тўйимизда"),
  );
  assert.ok(defaultInvitationMessage("wedding", "en").includes("wedding day"));
  assert.ok(defaultInvitationMessage("wedding", "ru").includes("свадьбы"));
});

test("default dress code includes editable localized guidance and the five-color palette", () => {
  const dressCode = defaultDressCode();
  assert.equal(dressCode.enabled, true);
  assert.equal(dressCode.style["uz-Latn"], "Kechki libos");
  assert.equal(
    dressCode.text["uz-Latn"],
    "Ayollar uchun uzun kechki ko‘ylak, erkaklar uchun klassik kostyum. Quyidagi ranglardan tanlasangiz, suratlar yanada chiroyli chiqadi.",
  );
  assert.equal(
    dressCode.note["uz-Latn"],
    "Iltimos, oq libosdan saqlaning — bu kun oq rang kelinniki.",
  );
  assert.deepEqual(
    dressCode.colors.map((color) => color.name["uz-Latn"]),
    ["Shampan", "Pudra", "Zaytun", "To‘q ko‘k", "Bordo"],
  );
  assert.ok(dressCode.style.en);
  assert.ok(dressCode.text.ru);
});

test("event name defaults to the selected event type in each enabled locale", () => {
  assert.equal(defaultEventLabel("wedding", "uz-Latn"), "Nikoh to‘yi");
  assert.equal(defaultEventLabel("wedding", "uz-Cyrl"), "Никоҳ тўйи");
  assert.equal(defaultEventLabel("wedding", "en"), "Wedding");
  assert.equal(defaultEventLabel("wedding", "ru"), "Свадьба");
  const invitation = createInvitation();
  invitation.eventType = "wedding";
  const withRussian = addLanguage(invitation, "ru");
  assert.equal(withRussian.content.ru.eventLabel, "Свадьба");
});

test("switching designs preserves authored content, locales, media and optional settings", () => {
  const first = addLanguage(createInvitation(), "uz-Cyrl");
  first.content["uz-Latn"].people = ["Nazar", "Nodira"];
  first.content["uz-Cyrl"].message = "Азиз меҳмонлар, марҳамат!";
  first.story = [
    {
      id: "first-meeting",
      title: { "uz-Latn": "Birinchi uchrashuv", en: "Our first meeting" },
      text: {
        "uz-Latn": "Hikoya matni",
        en: "Story text",
      },
    },
  ];
  first.gallery = [
    {
      id: "photo",
      url: "https://example.com/photo.webp",
      alt: "Family",
      caption: "Our day",
    },
  ];
  first.music = {
    enabled: false,
    assetId: "audio",
    url: "/api/media/audio",
    filename: "my-song.mp3",
  };
  const second = switchTemplate(first, "anor");
  assert.equal(second.id, first.id);
  assert.deepEqual({ ...second, templateId: first.templateId }, first);
  assert.notEqual(second, first);
  assert.deepEqual(
    invitationSchema.parse(JSON.parse(JSON.stringify(second))).story,
    first.story,
  );
});

test("story chapters are optional, localized, repeatable content", () => {
  const draft = createInvitation("muhabbat-kitobi");
  assert.deepEqual(draft.story, []);
  assert.equal(invitationSchema.safeParse(draft).success, true);
  draft.story = Array.from({ length: 20 }, (_, index) => ({
    id: `chapter-${index + 1}`,
    title: { "uz-Latn": `Bob ${index + 1}` },
    text: { "uz-Latn": `Hikoya ${index + 1}` },
  }));
  const parsed = invitationSchema.parse(
    JSON.parse(JSON.stringify(switchTemplate(draft, "anor"))),
  );
  assert.equal(parsed.story.length, 20);
  assert.equal(parsed.story[0].title["uz-Latn"], "Bob 1");
  assert.equal(parsed.story[0].text["uz-Latn"], "Hikoya 1");
  parsed.story.push({ id: "chapter-21", title: {}, text: {} });
  assert.equal(invitationSchema.safeParse(parsed).success, false);
});
test("new invitations start template-free while switching never rewrites event data", () => {
  const birthday = createInvitation();
  birthday.eventType = "birthday";
  assert.equal(birthday.templateId, "");
  assert.equal(birthday.eventType, "birthday");
  const wedding = createInvitation();
  wedding.eventType = "wedding";
  assert.equal(switchTemplate(wedding, "anor").eventType, "wedding");
});

test("Anor is a first-class template and a round trip preserves all shared event data", () => {
  let original = createInvitation();
  for (const locale of ["uz-Cyrl", "en", "ru"] as const) {
    original = addLanguage(original, locale);
    original.content[locale].message = `Authored ${locale}`;
  }
  original.eventType = "osh";
  original.content["uz-Latn"].people = ["Nazar", "Nodira"];
  original.content["uz-Latn"].landmark = "Metro yonida";
  original.venue = {
    latitude: 41.3,
    longitude: 69.2,
    mapUrl: "https://maps.example.com/hall",
  };
  original.gallery = [
    {
      id: "photo-1",
      url: "/api/media/photo-1",
      alt: "Our family",
      caption: "Together",
    },
  ];
  original.music = {
    enabled: true,
    assetId: "music-1",
    url: "/api/media/music-1",
    filename: "our-song.mp3",
  };
  original.gift = {
    enabled: true,
    receiptUploadEnabled: true,
    cardNumber: "8600 0000 0000 0000",
    cardHolder: "Test Owner",
  };
  original.contacts = { phoneNumber: "", telegramUsername: "@example" };
  const switched = invitationSchema.parse(
    JSON.parse(JSON.stringify(switchTemplate(original, "anor"))),
  );
  assert.equal(switched.templateId, "anor");
  assert.deepEqual(switchTemplate(switched, original.templateId), original);
  assert.equal(
    switched.eventType,
    "osh",
    "catalog category must not dictate event type",
  );
  assert.equal(templateIdSchema.parse("anor"), "anor");
  assert.ok(TEMPLATES.some((template) => template.id === "anor"));
  assert.ok(
    TEMPLATES.every((template) =>
      template.categoryIds.every((id) =>
        TEMPLATE_CATEGORIES.some((category) => category.id === id),
      ),
    ),
  );
});
test("a language variant starts with localized defaults and blank names", () => {
  const first = createInvitation();
  first.eventType = "wedding";
  first.content["uz-Latn"].people = ["Asadbek", "Gulhayo"];
  const second = addLanguage(first, "ru");
  assert.deepEqual(second.program, first.program);
  assert.equal(
    second.content.ru.message,
    defaultInvitationMessage("wedding", "ru"),
  );
  assert.deepEqual(second.content.ru.people, []);
  assert.equal(second.content.ru.greeting, "Здравствуйте, дорогой гость!");
  assert.equal(second.content.ru.eventLabel, "Свадьба");
  assert.equal(addLanguage(second, "ru"), second);
});
test("removing a language deletes only that locale and protects the primary locale", () => {
  const draft = addLanguage(addLanguage(createInvitation(), "ru"), "en");
  draft.content.ru.people = ["Асадбек", "Гулҳаё"];
  draft.story = [
    {
      id: "chapter-1",
      title: { ru: "Знакомство", en: "First meeting" },
      text: { ru: "Мы познакомились", en: "We met" },
    },
  ];
  draft.dressCode.style = { ru: "Торжественный" };
  const withoutRussian = removeLanguage(draft, "ru");
  assert.deepEqual(withoutRussian.enabledLocales, ["uz-Latn", "en"]);
  assert.equal(withoutRussian.content.ru, undefined);
  assert.equal(withoutRussian.story[0].title.ru, undefined);
  assert.equal(withoutRussian.story[0].text.ru, undefined);
  assert.equal(withoutRussian.dressCode.style.ru, undefined);
  assert.equal(removeLanguage(withoutRussian, "uz-Latn"), withoutRussian);
  assert.equal(invitationSchema.safeParse(withoutRussian).success, true);
});
test("receipt switch requires gift details; music and gifts are optional", () => {
  const draft = createInvitation();
  assert.equal(draft.music.enabled, false);
  assert.equal(invitationSchema.safeParse(draft).success, true);
  const legacyData = {
    ...draft,
    voiceMessage: {
      enabled: true,
      assetId: "old-voice",
      url: "/api/media/old-voice",
      filename: "old-voice.m4a",
    },
  };
  const cleaned = invitationSchema.parse(legacyData);
  assert.equal("voiceMessage" in cleaned, false);
  draft.gift.receiptUploadEnabled = true;
  assert.equal(invitationSchema.safeParse(draft).success, false);
});
test("legacy gift bank name is ignored while card details remain", () => {
  const draft = createInvitation();
  const legacy = {
    ...draft,
    gift: {
      ...draft.gift,
      cardNumber: "8600 1234 5678 9012",
      cardHolder: "Asadbek",
      bankName: "Legacy bank",
    },
  };
  const cleaned = invitationSchema.parse(legacy);
  assert.equal("bankName" in cleaned.gift, false);
  assert.equal(cleaned.gift.cardNumber, "8600 1234 5678 9012");
  assert.equal(cleaned.gift.cardHolder, "Asadbek");
});
test("schema rejects script URLs and oversized repeatable sections", () => {
  const draft = createInvitation();
  draft.venue.mapUrl = "javascript:alert(1)";
  assert.equal(invitationSchema.safeParse(draft).success, false);
  draft.venue.mapUrl = "";
  draft.program = Array.from({ length: 101 }, (_, i) => ({
    id: String(i),
    time: "12:00",
  }));
  assert.equal(invitationSchema.safeParse(draft).success, false);
});
test("published event identity and deadlines cannot be extended by creator edits", () => {
  const previous = createInvitation();
  previous.status = "published";
  const state = {
    status: "published",
    editDeadlineAt: "2026-12-17T00:00:00+05:00",
  };
  const now = new Date("2026-12-01T00:00:00Z");
  const practical = structuredClone(previous);
  practical.content["uz-Latn"].venueName = "New hall";
  assert.doesNotThrow(() =>
    assertCreatorCanEdit(previous, practical, state, now),
  );
  assert.throws(
    () =>
      assertCreatorCanEdit(
        previous,
        { ...practical, startsAt: "2027-12-16T18:00" },
        state,
        now,
      ),
    /EVENT_CHANGE/,
  );
  const renamed = structuredClone(previous);
  renamed.content["uz-Latn"].people = ["Another person"];
  assert.throws(
    () => assertCreatorCanEdit(previous, renamed, state, now),
    /NAME_CHANGE/,
  );
  assert.throws(
    () =>
      assertCreatorCanEdit(previous, practical, state, new Date("2027-01-01")),
    /DEADLINE/,
  );
  assert.throws(
    () =>
      assertCreatorCanEdit(
        previous,
        practical,
        { status: "archived", editDeadlineAt: null },
        now,
      ),
    /ARCHIVED/,
  );
});
