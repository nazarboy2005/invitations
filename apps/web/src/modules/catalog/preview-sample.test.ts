import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  createInvitation,
  defaultEventLabel,
  invitationSchema,
  templateById,
} from "@taklifnoma/contracts";
import {
  createLongNamePreview,
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
  hasAuthoredInvitationContent,
} from "./preview-sample";

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
    /wishes:\s*sampleWishes\s*\?\s*getTemplatePreviewWishes\(locale\)\s*:\s*\[\]/,
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
  assert.deepEqual(blank.contacts, { phoneNumber: "", telegramUsername: "" });

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
