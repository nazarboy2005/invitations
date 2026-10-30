import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  createInvitation,
  defaultEventLabel,
  invitationSchema,
  templateById,
  TEMPLATES,
} from "@taklifnoma/contracts";
import {
  createLongNamePreview,
  createTemplatePreviewSample,
  getTemplatePreviewVenuePhoto,
  getTemplatePreviewWishes,
  hasAuthoredInvitationContent,
} from "./preview-sample";

test("every design shares event content and the canonical Yandex Maps venue", () => {
  const fixture = JSON.parse(readFileSync(join(process.cwd(), "apps/web/src/modules/catalog/preview-sample.json"), "utf8"));
  const profiles = new Map<string, unknown>();
  for (const template of TEMPLATES) {
    const sample = createTemplatePreviewSample(template.id);
    assert.deepEqual(sample.venue, fixture.eventSamples[sample.eventType]?.venue ?? fixture.venue);
    assert.match(sample.venue.mapUrl, /^https:\/\/yandex\.uz\/maps/);
    const shared = { content: sample.content, program: sample.program, venue: sample.venue,
      startsAt: sample.startsAt, contacts: sample.contacts, gift: sample.gift,
      story: sample.story, artists: sample.artistLineup, age: sample.celebrantAge };
    if (profiles.has(sample.eventType)) assert.deepEqual(shared, profiles.get(sample.eventType), template.id);
    else profiles.set(sample.eventType, structuredClone(shared));
    sample.venue.mapUrl = "https://example.com/mutated";
    assert.notEqual(createTemplatePreviewSample(template.id).venue.mapUrl, sample.venue.mapUrl);
  }
});

test("template samples are illustrative complete invitations", () => {
  const sample = createTemplatePreviewSample("anor");
  assert.deepEqual(sample.content["uz-Latn"].people, ["Javohir", "Madina"]);
  assert.deepEqual(sample.enabledLocales, ["uz-Latn", "uz-Cyrl", "en", "ru"]);
  assert.deepEqual(sample.content["uz-Cyrl"].people, ["Жавохир", "Мадина"]);
  assert.deepEqual(sample.content.en.people, ["Javohir", "Madina"]);
  assert.deepEqual(sample.content.ru.people, ["Жавохир", "Мадина"]);
  assert.equal(sample.content.ru.greeting, "Здравствуйте, дорогой гость!");
  assert.equal(sample.content.ru.personalGreeting, "Здравствуйте, {name}!");
  assert.equal(sample.dressCode.enabled, true);
  assert.equal(sample.dressCode.colors.length, 5);
  assert.deepEqual(sample.gift, {
    enabled: true,
    receiptUploadEnabled: false,
    cardNumber: "8600 1234 5678 9012",
    cardHolder: "AZIZ AZIZOV",
  });
  assert.deepEqual(sample.contacts, {
    phoneNumber: "+998 90 123 45 67",
    telegramUsername: "@demo",
    instagramUrl: "",
  });
  for (const locale of sample.enabledLocales) {
    assert.ok(sample.dressCode.style[locale]);
    assert.ok(sample.dressCode.text[locale]);
    assert.ok(sample.dressCode.note[locale]);
    assert.ok(sample.dressCode.colors.every((color) => color.name[locale]));
  }
  assert.equal(sample.content["uz-Cyrl"].eventLabel, "Никоҳ тўйи");
  assert.equal(sample.program.length, 6);
  assert.deepEqual(
    sample.program.map((entry) => entry.time),
    ["17:30", "18:00", "18:30", "20:00", "21:30", "22:30"],
  );
  assert.equal(
    sample.content["uz-Latn"].programTitles["sample-meal"],
    "Tabriklar va dasturxon",
  );
  assert.equal(
    sample.content["uz-Latn"].programTitles["sample-entrance"],
    "Kelin-kuyovning kirib kelishi",
  );
  assert.equal(
    sample.content.ru.programTitles["sample-cake"],
    "Свадебный торт",
  );
  for (const locale of sample.enabledLocales) {
    for (const item of sample.program) {
      assert.ok(
        sample.content[locale].programTitles[item.id],
        `${locale} is missing a title for ${item.id}`,
      );
    }
  }
  assert.equal(sample.gallery.length, 6);
  assert.ok(
    sample.gallery.every((item) => !item.url && !item.alt && !item.caption),
  );
  assert.equal(hasAuthoredInvitationContent(sample), true);
  assert.equal(sample.content["uz-Latn"].message.includes("ko‘rishdan"), true);
  assert.equal(sample.content["uz-Cyrl"].eventLabel, "Никоҳ тўйи");
  assert.equal(sample.content.ru.greeting, "Здравствуйте, дорогой гость!");
});

test("Palace Rose source photos are confined to catalog and initial-selection previews", () => {
  const preview = createTemplatePreviewSample("palace-rose");
  const creatorDraft = createInvitation("palace-rose");
  const galleryFiles = [
    "gallery-2.webp",
    "gallery-1.webp",
    "gallery-3.webp",
    "gallery-6.webp",
    "gallery-4.webp",
    "gallery-5.webp",
  ];
  assert.deepEqual(
    preview.gallery.map(({ url, alt }) => [url, alt]),
    galleryFiles.map((file, index) => [
      `/templates/chorlove/orchid-amplop/assets/${file}`,
      `Wedding photo ${index + 1}`,
    ]),
  );
  assert.equal(
    getTemplatePreviewVenuePhoto("palace-rose"),
    "/images/preview/venue.jpg",
  );
  assert.ok(creatorDraft.gallery.every((photo) => !photo.url && !photo.alt && !photo.caption));
});

test("Modern Floral preview uses its captured gallery images only in its preview sample", () => {
  const modernFloral = createTemplatePreviewSample("modern-floral");
  const otherTemplate = createTemplatePreviewSample("anor");
  const floralWishes = getTemplatePreviewWishes("uz-Latn", "modern-floral");
  assert.deepEqual(
    modernFloral.gallery.map((item) => item.url),
    [
      "/templates/chorlove/orchid-amplop/assets/gallery-2.webp",
      "/templates/chorlove/orchid-amplop/assets/gallery-1.webp",
      "/templates/chorlove/orchid-amplop/assets/gallery-3.webp",
      "/templates/chorlove/orchid-amplop/assets/gallery-6.webp",
      "/templates/chorlove/orchid-amplop/assets/gallery-4.webp",
      "/templates/chorlove/orchid-amplop/assets/gallery-5.webp",
    ],
  );
  assert.equal(floralWishes.length, 3);
  assert.deepEqual(floralWishes, getTemplatePreviewWishes("uz-Latn"), "all designs use the same wishes fixture");
  assert.equal(getTemplatePreviewWishes("uz-Latn").length, 3, "other previews retain their shared sample");
  assert.ok(otherTemplate.gallery.every((item) => !item.url));
});

test("Lace source gallery is provided by the preview fixture only", () => {
  const sample = createTemplatePreviewSample("lace");
  const emptyCreatorInvitation = createInvitation("lace");
  assert.deepEqual(
    sample.gallery.map(({ url }) => url),
    [
      "/templates/lace/assets/gallery-2.webp",
      "/templates/lace/assets/gallery-1.webp",
      "/templates/lace/assets/gallery-3.webp",
      "/templates/lace/assets/gallery-6.webp",
      "/templates/lace/assets/gallery-4.webp",
      "/templates/lace/assets/gallery-5.webp",
    ],
  );
  assert.ok(emptyCreatorInvitation.gallery.every((photo) => !photo.url));
});

test("Green Gold gallery photos come only from the catalog and initial-selection sample", () => {
  const sample = createTemplatePreviewSample("green-gold");
  const creatorDraft = createInvitation("green-gold");
  assert.deepEqual(
    sample.gallery.map((item) => [item.id, item.url]),
    [2, 1, 3, 6, 4, 5].map((number, index) => [
      `green-gold-source-preview-${index + 1}`,
      `/templates/chorlove/orchid-amplop/assets/gallery-${number}.webp`,
    ]),
  );
  assert.ok(creatorDraft.gallery.every((item) => !item.url));
});

test("Luxury Gold uses the captured demo gallery only in catalog preview samples", () => {
  const preview = createTemplatePreviewSample("luxury-gold");
  const creatorInvitation = createInvitation("luxury-gold");
  assert.deepEqual(
    preview.gallery.map((item) => item.url),
    [2, 1, 3, 6, 4, 5].map((index) => `/templates/chorlove/orchid-amplop/assets/gallery-${index}.webp`),
  );
  assert.ok(creatorInvitation.gallery.every((item) => !item.url));
});

test("Green Garden preview uses its captured gallery and venue photos only as sample media", () => {
  const sample = createTemplatePreviewSample("green-garden");
  const blankInvitation = createInvitation("green-garden");
  assert.deepEqual(
    sample.gallery.map((item) => item.url),
    [
      "/templates/chorlove/orchid-amplop/assets/gallery-2.webp",
      "/templates/chorlove/orchid-amplop/assets/gallery-1.webp",
      "/templates/chorlove/orchid-amplop/assets/gallery-3.webp",
      "/templates/chorlove/orchid-amplop/assets/gallery-6.webp",
      "/templates/chorlove/orchid-amplop/assets/gallery-4.webp",
      "/templates/chorlove/orchid-amplop/assets/gallery-5.webp",
    ],
  );
  assert.equal(
    getTemplatePreviewVenuePhoto("green-garden"),
    "/templates/green-garden/assets/preview-venue.jpg",
  );
  assert.equal("venuePhoto" in sample, false);
  assert.equal(getTemplatePreviewVenuePhoto("anor"), undefined);
  assert.ok(blankInvitation.gallery.every((item) => !item.url));
});

test("Love Sakura preview uses the exact captured gallery photo order only in its preview sample", () => {
  const loveSakura = createTemplatePreviewSample("love-sakura");
  const otherTemplate = createTemplatePreviewSample("anor");
  assert.deepEqual(
    loveSakura.gallery.map((item) => item.url),
    [
      "/templates/love-sakura/assets/hero-couple.webp",
      "/templates/love-sakura/assets/bride.webp",
      "/templates/love-sakura/assets/groom.webp",
      "/templates/love-sakura/assets/hero-couple.webp",
      "/templates/love-sakura/assets/bride.webp",
      "/templates/love-sakura/assets/groom.webp",
    ],
  );
  assert.ok(otherTemplate.gallery.every((item) => !item.url));
  assert.equal(hasAuthoredInvitationContent(createInvitation("love-sakura")), false);
});

test("Jasmine White previews use its captured gallery and venue photos only as preview media", () => {
  const preview = createTemplatePreviewSample("jasmine-white");
  const creatorDraft = createInvitation("jasmine-white");
  assert.deepEqual(
    preview.gallery.map((item) => item.url),
    [
      "/templates/jasmine-white/assets/fcd26341-5041-40ad-9cc9-d69a47422378.webp",
      "/templates/jasmine-white/assets/d1c749b4-edb3-4312-84b6-414459c3d89c.webp",
      "/templates/jasmine-white/assets/90085094-65d3-45d4-82da-de8d127a859c.webp",
      "/templates/jasmine-white/assets/d0db2a4e-83f8-4b84-a46d-fc2fefe45cfa.webp",
    ],
  );
  assert.deepEqual(
    preview.gallery.map((item) => item.alt),
    ["Wedding photo 1", "Wedding photo 2", "Wedding photo 3", "Wedding photo 4"],
  );
  assert.equal(
    getTemplatePreviewVenuePhoto("jasmine-white"),
    "/images/preview/venue.jpg",
  );
  assert.ok(creatorDraft.gallery.every((item) => !item.url));
});

test("catalog fixtures use an event type supported by each selected design", () => {
  for (const id of ["lola", "qiz-bazmi", "shahzoda", "chavandoz", "hilol", "yangi-uy"] as const) {
    const template = templateById(id);
    const sample = createTemplatePreviewSample(id);
    assert.ok(template);
    assert.ok(template.supportedEventTypes.includes(sample.eventType));
    if (id === "hilol") {
      assert.equal(sample.content["uz-Latn"].eventLabel, "Iftorlik");
      assert.equal(sample.content.ru.eventLabel, "Ифтар");
    } else if (id === "yangi-uy") {
      assert.equal(sample.content["uz-Latn"].eventLabel, "Yangi uy to‘yi");
      assert.equal(sample.content["uz-Cyrl"].eventLabel, "Янги уй тўйи");
      assert.equal(sample.content.en.eventLabel, "Housewarming celebration");
      assert.equal(sample.content.ru.eventLabel, "Новоселье");
    } else {
      assert.equal(sample.content["uz-Latn"].eventLabel, "");
      assert.equal(sample.content.en.eventLabel, "");
    }
  }
  const nilufar = createTemplatePreviewSample("nilufar");
  assert.equal(nilufar.eventType, "fotiha");
  assert.deepEqual(nilufar.content["uz-Cyrl"].people, ["Жавохир", "Мадина"]);
  assert.equal(nilufar.content["uz-Cyrl"].eventLabel, "Фотиҳа тўйи");
  assert.equal(nilufar.content["uz-Latn"].eventLabel, "Fotiha to‘yi");
  assert.ok(nilufar.program.every((entry) => nilufar.content.ru.programTitles[entry.id]));
  const housewarming = createTemplatePreviewSample("yangi-uy");
  assert.equal(housewarming.eventType, "yangi-uy");
  assert.deepEqual(housewarming.content["uz-Latn"].people, ["Rahmonovlar xonadoni"]);
  assert.deepEqual(housewarming.content["uz-Cyrl"].people, ["Раҳмоновлар хонадони"]);
  assert.deepEqual(housewarming.content.en.people, ["The Rahmonov family home"]);
  assert.deepEqual(housewarming.content.ru.people, ["Дом семьи Рахмоновых"]);
  assert.equal(housewarming.program.length, 6);
  assert.deepEqual(housewarming.program.map((entry) => entry.time), ["16:30", "17:00", "17:30", "18:30", "19:30", "20:00"]);
  for (const locale of housewarming.enabledLocales) {
    const content = housewarming.content[locale];
    assert.ok(content.hosts && content.message && content.eventLabel && content.venueName && content.programHeading);
    assert.ok(content.title);
    for (const entry of housewarming.program) assert.ok(content.programTitles[entry.id]);
    assert.ok(housewarming.dressCode.style[locale]);
    assert.ok(housewarming.dressCode.text[locale]);
    assert.ok(housewarming.dressCode.note[locale]);
    assert.equal(housewarming.dressCode.colors.length, 5);
    assert.ok(housewarming.dressCode.colors.every((color) => color.name[locale]));
  }
  const qizBazmi = createTemplatePreviewSample("qiz-bazmi");
  assert.equal(qizBazmi.eventType, "qiz-uzatish");
  assert.equal(templateById("qiz-bazmi")?.previewEventType, qizBazmi.eventType);
  const honorees = {
    "uz-Latn": "Madina",
    "uz-Cyrl": "Мадина",
    en: "Madina",
    ru: "Мадина",
  } as const;
  const hosts = {
    "uz-Latn": "Madina oilasi",
    "uz-Cyrl": "Мадина оиласи",
    en: "Madina's family",
    ru: "Семья Мадины",
  } as const;
  const headings = {
    "uz-Latn": "Qiz uzatish dasturi",
    "uz-Cyrl": "Қиз узатиш дастури",
    en: "Bride send-off program",
    ru: "Программа проводов невесты",
  } as const;
  for (const locale of qizBazmi.enabledLocales) {
    const content = qizBazmi.content[locale];
    assert.deepEqual(content.people, [honorees[locale]]);
    assert.equal(content.hosts, hosts[locale]);
    assert.equal(content.programHeading, headings[locale]);
    assert.ok(content.greeting && content.message);
    assert.ok(qizBazmi.program.every((item) => content.programTitles[item.id]));
    assert.ok(qizBazmi.dressCode.style[locale]);
    assert.ok(qizBazmi.dressCode.text[locale]);
    assert.ok(qizBazmi.dressCode.note[locale]);
    assert.ok(qizBazmi.dressCode.colors.every((color) => color.name[locale]));
  }
  assert.equal(qizBazmi.program.length, 6);
  assert.equal(qizBazmi.gallery.length, 6);
  const sunnat = createTemplatePreviewSample("shahzoda");
  assert.deepEqual(sunnat.content["uz-Latn"].people, ["Javohir"]);
  assert.equal(
    sunnat.content["uz-Latn"].programTitles["sample-entrance"],
    "Bayram sohibining kirib kelishi",
  );
  assert.equal(
    sunnat.content.ru.programTitles["sample-entrance"],
    "Выход виновника торжества",
  );
  assert.equal(sunnat.dressCode.style.ru, "Праздничный наряд");
  assert.ok(!sunnat.dressCode.note.ru?.includes("невесте"));
  const beshik = createTemplatePreviewSample("beshik");
  assert.equal(beshik.eventType, "beshik-toyi");
  assert.deepEqual(beshik.content["uz-Latn"].people, ["Javohir"]);
  assert.equal(beshik.content["uz-Latn"].hosts, "Rahmonovlar oilasi");
  assert.equal(
    beshik.content.ru.programHeading,
    "Программа праздника в честь колыбели",
  );
  assert.equal(
    beshik.content.ru.programTitles["sample-entrance"],
    "Обряд укладывания малыша в колыбель",
  );
  assert.equal(beshik.dressCode.style.ru, "Наряд для семейного праздника");
  const birthday = createTemplatePreviewSample("shirin-bayram");
  assert.equal(birthday.eventType, "birthday");
  assert.deepEqual(birthday.content["uz-Latn"].people, ["Javohir"]);
  assert.equal(birthday.content.ru.eventLabel, "День рождения");
  assert.equal(birthday.content.ru.hosts, "Семья Жавохира");
  assert.equal(birthday.content.ru.programHeading, "Программа дня рождения");
  assert.equal(
    birthday.content.ru.programTitles["sample-entrance"],
    "Выход именинника",
  );
  assert.equal(birthday.content.en.venueName, "Celebration hall");
  assert.equal(birthday.dressCode.style.ru, "Праздничный наряд");
  assert.equal(
    birthday.dressCode.note.ru,
    "Пожалуйста, учитывайте комфорт детей, чтобы они могли свободно играть.",
  );
  assert.deepEqual(
    birthday.dressCode.colors.map((color) => color.hex),
    ["#ff8fb1", "#7cc6ff", "#ffd45c", "#7fdcb5", "#5b3a2e"],
  );
  assert.equal(birthday.dressCode.colors[0].name.ru, "Розовый");
  const anniversary = createTemplatePreviewSample("oltin-kuz");
  assert.equal(anniversary.eventType, "birthday");
  assert.equal(anniversary.content.ru.eventLabel, "День рождения");
  assert.equal(anniversary.content.ru.programHeading, "Программа дня рождения");
  assert.equal(
    anniversary.content.ru.programTitles["sample-entrance"],
    "Выход именинника",
  );
  assert.equal(anniversary.startsAt, "2027-06-12T17:00");
  const jubilee = createTemplatePreviewSample("oltin-yosh");
  assert.equal(jubilee.eventType, "yubiley");
  assert.equal(jubilee.content.ru.eventLabel, "Юбилей");
  assert.equal(jubilee.content.ru.programHeading, "Программа юбилея");
  const morningOsh = createTemplatePreviewSample("nahor");
  assert.equal(morningOsh.eventType, "osh");
  assert.equal(morningOsh.content.ru.eventLabel, "Утренний ош");
  assert.equal(morningOsh.content.ru.hosts, "Семья Рахмоновых");
  assert.equal(
    morningOsh.content.ru.programTitles["sample-entrance"],
    "Подача оша",
  );
  assert.equal(
    morningOsh.content.en.message,
    "Join us for a warm morning gathering and a festive table.",
  );
  assert.equal(morningOsh.content.ru.venueName, "Районный банкетный зал");
  assert.equal(morningOsh.startsAt, "2027-06-12T07:00");
  assert.equal(morningOsh.program[0].time, "06:30");
  assert.equal(morningOsh.program[5].time, "11:00");
  const iftorlik = createTemplatePreviewSample("hilol");
  assert.equal(iftorlik.eventType, "iftorlik");
  assert.equal(iftorlik.startsAt, "2027-02-12T18:00");
  assert.equal(iftorlik.content.ru.programHeading, "Программа ифтара");
  assert.equal(iftorlik.program[0].time, "17:30");
  assert.equal(iftorlik.content.ru.venueName, "Банкетный зал «Хилол»");
  assert.equal(defaultEventLabel("iftorlik", "uz-Latn"), "Iftorlik");
  assert.equal(defaultEventLabel("iftorlik", "uz-Cyrl"), "Ифторлик");
  assert.equal(defaultEventLabel("iftorlik", "en"), "Iftar gathering");
  assert.equal(defaultEventLabel("iftorlik", "ru"), "Ифтар");
  const brideSendoff = createTemplatePreviewSample("lola");
  assert.deepEqual(brideSendoff.content["uz-Latn"].people, ["Madina"]);
  assert.equal(
    brideSendoff.content.en.programTitles["sample-entrance"],
    "The bride’s entrance",
  );
});

test("preview wishes are populated and localized without entering invitation data", () => {
  const expected = {
    "uz-Latn":
      "Baxtingiz abadiy bo‘lsin! Bir umr bir-biringizni qadrlab yashang.",
    "uz-Cyrl": "Бахтингиз абадий бўлсин! Бир умр бир-бирингизни қадрлаб яшанг.",
    en: "May your happiness last forever! Treasure each other throughout your life.",
    ru: "Пусть ваше счастье будет вечным! Всю жизнь цените друг друга.",
  } as const;
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
    const wishes = getTemplatePreviewWishes(locale);
    assert.equal(wishes.length, 3);
    assert.equal(wishes[0].text, expected[locale]);
    assert.ok(wishes.every((wish) => wish.name && wish.text));
  }
  const sample = createTemplatePreviewSample("oq-kabutar");
  assert.deepEqual(sample.wishes, { enabled: true, requireApproval: true });
  assert.equal("sampleWishes" in sample, false);
});

test("Oq Kabutar keeps the preview wishes section connected to localized samples", () => {
  const sample = createTemplatePreviewSample("oq-kabutar");
  const source = readFileSync(
    join(process.cwd(), "apps/web/public/templates/oq-kabutar/index.html"),
    "utf8",
  );

  assert.equal(sample.wishes.enabled, true);
  assert.match(source, /<section[^>]*data-section="wishes"/);
  assert.match(
    source,
    /<ul[^>]*data-list="wishes"[^>]*>[\s\S]*?data-field="text"[\s\S]*?data-field="name"/,
  );
  for (const locale of sample.enabledLocales) {
    const wishes = getTemplatePreviewWishes(locale);
    assert.equal(wishes.length, 3);
    assert.ok(wishes.every((wish) => wish.name.trim() && wish.text.trim()));
  }
});

test("Shahzoda keeps its wishes section connected to localized preview samples", () => {
  const sample = createTemplatePreviewSample("shahzoda");
  const source = readFileSync(
    join(process.cwd(), "apps/web/public/templates/shahzoda/index.html"),
    "utf8",
  );
  const adapter = readFileSync(
    join(process.cwd(), "apps/web/src/templates/anor/renderer.tsx"),
    "utf8",
  );

  assert.equal(sample.wishes.enabled, true);
  assert.match(source, /<section[^>]*data-section="wishes"/);
  assert.match(
    source,
    /<ul[^>]*data-list="wishes"[^>]*>[\s\S]*?data-field="text"[\s\S]*?data-field="name"/,
  );
  assert.match(adapter, /wishesEnabled:\s*invitation\.wishes\.enabled/);
  assert.match(
    adapter,
    /wishes:\s*sampleWishes\s*\?\s*getTemplatePreviewWishes\(locale(?:,\s*templateId)?\)\s*:\s*\[\]/,
  );
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
    const wishes = getTemplatePreviewWishes(locale);
    assert.equal(wishes.length, 3);
    assert.ok(wishes.every((wish) => wish.name.trim() && wish.text.trim()));
  }
});

test("sample objects are isolated so renderer changes cannot mutate the fixture", () => {
  const first = createTemplatePreviewSample("anor");
  first.content.en.people[0] = "Changed";
  first.program[0].time = "09:00";
  first.dressCode.colors[0].name.en = "Changed";
  first.gallery[0].id = "changed";

  const second = createTemplatePreviewSample("another-template");
  assert.equal(second.content.en.people[0], "Javohir");
  assert.equal(second.program[0].time, "17:30");
  assert.equal(second.dressCode.colors[0].name.en, "Champagne");
  assert.equal(second.gallery[0].id, "sample-memory-1");
});

test("ephemeral draft previews keep the creator's selected language settings", () => {
  const preview = createTemplatePreviewSample("sahifa", {
    defaultLocale: "ru",
    enabledLocales: ["ru", "en"],
  });

  assert.equal(preview.defaultLocale, "ru");
  assert.deepEqual(preview.enabledLocales, ["ru", "en"]);
  assert.equal(preview.content.ru.people[0], "Жавохир");
  assert.equal(preview.content.en.people[1], "Madina");

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

  assert.deepEqual(restored.content["uz-Latn"].people, ["Javohir", "Madina"]);
  assert.deepEqual(restored.content["uz-Cyrl"].people, ["Жавохир", "Мадина"]);
  assert.deepEqual(restored.content.en.people, ["Javohir", "Madina"]);
  assert.deepEqual(restored.content.ru.people, ["Создатель", "Мадина"]);
});

test("long-name QA preview is isolated from the canonical catalog sample", () => {
  const canonical = createTemplatePreviewSample("oltin-uzuk");
  const stress = createLongNamePreview(canonical);

  assert.deepEqual(stress.content["uz-Latn"].people, [
    "Gulbahor-Marguba Sayyidabonu",
    "Jahongir-Shohruhbek Mirzohid",
  ]);
  assert.deepEqual(canonical.content["uz-Latn"].people, ["Javohir", "Madina"]);
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
  assert.deepEqual(canonical.content.en.people, ["Javohir", "Madina"]);
  assert.deepEqual(canonical.content.ru.people, ["Creator one", "Creator two"]);
});

test("only empty template-selection previews may fall back to sample content", () => {
  const blank = createInvitation("anor");
  assert.equal(hasAuthoredInvitationContent(blank), false);
  assert.equal(blank.gift.enabled, false);
  assert.equal(blank.gift.cardNumber, "");
  assert.deepEqual(blank.contacts, { phoneNumber: "", telegramUsername: "", instagramUrl: "" });

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
    instagramUrl: "",
  });
});

test("Glass Pink source gallery photos stay in its preview sample only", () => {
  const preview = createTemplatePreviewSample("glass-pink");
  const emptyDraft = createInvitation("glass-pink");
  assert.deepEqual(
    preview.gallery.map(({ url, alt }) => [url, alt]),
    [
      ["/templates/chorlove/orchid-amplop/assets/gallery-2.webp", "Gallery photo 1"],
      ["/templates/chorlove/orchid-amplop/assets/gallery-1.webp", "Gallery photo 2"],
      ["/templates/chorlove/orchid-amplop/assets/gallery-3.webp", "Gallery photo 3"],
      ["/templates/chorlove/orchid-amplop/assets/gallery-6.webp", "Gallery photo 4"],
      ["/templates/chorlove/orchid-amplop/assets/gallery-4.webp", "Gallery photo 5"],
      ["/templates/chorlove/orchid-amplop/assets/gallery-5.webp", "Gallery photo 6"],
    ],
  );
  assert.deepEqual(emptyDraft.gallery, []);
  assert.equal(hasAuthoredInvitationContent(emptyDraft), false);
  assert.ok(
    createTemplatePreviewSample("anor").gallery.every((item) => !item.url),
  );

  const sourceRoot = join(
    process.cwd(),
    "Invitations - this folder will be removed from production/Chorlove/Web invitations/images/templates/orchid-amplop",
  );
  const packagedRoot = join(
    process.cwd(),
    "apps/web/public/templates/chorlove/orchid-amplop/assets",
  );
  for (const { url } of preview.gallery) {
    const file = url.split("/").at(-1)!;
    assert.deepEqual(
      readFileSync(join(packagedRoot, file)),
      readFileSync(join(sourceRoot, file)),
      `${file} must remain byte-identical to the Chorlove source image`,
    );
  }
});
