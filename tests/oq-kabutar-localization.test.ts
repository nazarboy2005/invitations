import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { createInvitation } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
} from "../apps/web/src/modules/catalog/preview-sample";

const templateRoot = new URL(
  "../apps/web/public/templates/oq-kabutar/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const sourceRoot = new URL(
  "../Invitations%20-%20this%20folder%20will%20be%20removed%20from%20production/Marxaba/Nikoh/templates/oq-kabutar/",
  import.meta.url,
);
const translationsSource = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url),
  "utf8",
);

test("Oq Kabutar translates its static invitation copy and metadata", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(translationsSource, { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const textNodes = Array.from(html.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/\s+/g, " ").trim(),
  ).filter((text) => text.length > 1 && text !== "&amp;" && text !== "00");
  const attributes = Array.from(
    html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  const metadata = Array.from(
    html.matchAll(/<meta\s+[^>]*?(?:name="description"|property="og:(?:title|description)")[^>]*?content="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );

  assert.deepEqual(
    [...textNodes, ...attributes, ...metadata].filter(
      (text) => !translations[text],
    ),
    [],
  );
  assert.ok(translations["Oq Kabutar · Taklifnoma"]);
  assert.ok(translations["Raqamli taklifnoma"]);
});

test("Oq Kabutar packages its original portrait artwork, local fonts, and motion assets", () => {
  for (const asset of [
    "preview.webp",
    "fonts.css",
    "art/feathers.webp",
    "art/doves-perched.webp",
    "art/dove-sprite.webp",
  ]) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
});

test("Oq Kabutar preserves its captured opening and clothing section source", () => {
  const normalizeMarkup = (markup: string) =>
    markup.replace(/>\s+</g, "><").trim();
  const capturedHtml = readFileSync(new URL("index.html", sourceRoot), "utf8");
  const body = (markup: string) =>
    markup.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? "";

  assert.equal(normalizeMarkup(body(html)), normalizeMarkup(body(capturedHtml)));
  for (const file of ["template.css", "template.js", "meta.js"]) {
    const captured = readFileSync(new URL(file, sourceRoot), "utf8").replace(
      /\r\n/g,
      "\n",
    );
    const packaged = readFileSync(new URL(file, templateRoot), "utf8").replace(
      /\r\n/g,
      "\n",
    );
    assert.equal(packaged, captured, `${file} must retain the captured source`);
  }

  assert.match(html, /id="intro"[\s\S]*?id="open-invitation"/);
  assert.ok(html.includes("dresscode-section"));
  assert.ok(html.includes('data-slot="dressCode.text"'));
  assert.match(html, /data-slot="dressCode\.style"/);
  assert.match(html, /data-slot="dressCode\.note"/);
});

test("Oq Kabutar maps the canonical preview sections and all four locales", () => {
  const sample = createTemplatePreviewSample("oq-kabutar");
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"] as const;

  assert.deepEqual(sample.enabledLocales, [...locales]);
  assert.equal(sample.program.length, 6);
  assert.equal(sample.dressCode.colors.length, 5);
  assert.equal(sample.gallery.length, 6);
  assert.ok(
    sample.gallery.every((item) => !item.url && !item.alt && !item.caption),
  );
  assert.equal(sample.gift.cardNumber, "8600 1234 5678 9012");
  assert.equal(sample.gift.cardHolder, "AZIZ AZIZOV");
  assert.equal(sample.contacts.phoneNumber, "+998 90 123 45 67");
  assert.equal(sample.contacts.telegramUsername, "@demo");

  for (const locale of locales) {
    const content = sample.content[locale];
    assert.equal(
      Object.keys(content.programTitles).length,
      6,
      `${locale} should have a title for every program item`,
    );
    assert.ok(content.programTitles["sample-arrival"]);
    assert.ok(content.programTitles["sample-farewell"]);
    const wishes = getTemplatePreviewWishes(locale);
    assert.equal(wishes.length, 3);
    assert.ok(wishes.every((wish) => wish.name && wish.text));
  }

  for (const slot of [
    'data-list="program"',
    'data-list="gallery"',
    'data-list="wishes"',
    'data-list="contacts"',
    'data-list="dresscode"',
    'data-section="toyona"',
    'data-slot="toyona.cardNumber"',
    'data-slot="toyona.cardHolder"',
  ]) {
    assert.ok(html.includes(slot), `${slot} should render through the source page`);
  }
});

test("Oq Kabutar does not put catalog-only samples into a blank invitation", () => {
  const blank = createInvitation("oq-kabutar");
  const sample = createTemplatePreviewSample("oq-kabutar");

  assert.equal(blank.gift.cardNumber, "");
  assert.equal(blank.gift.cardHolder, "");
  assert.deepEqual(blank.contacts, { phoneNumber: "", telegramUsername: "" });
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.equal(getTemplatePreviewWishes("uz-Latn").length, 3);
  assert.equal("sampleWishes" in sample, false);
  const serializedSample = JSON.stringify(sample);
  for (const wish of getTemplatePreviewWishes("uz-Latn")) {
    assert.equal(serializedSample.includes(wish.name), false);
    assert.equal(serializedSample.includes(wish.text), false);
  }
});

test("Oq Kabutar hides unsupported empty To‘yona rows with a scoped adapter", () => {
  const adapter = readFileSync(
    new URL("contract-adapter.css", templateRoot),
    "utf8",
  );
  assert.match(html, /href="contract-adapter\.css"/);
  assert.match(adapter, /\.gift__details \[data-slot="toyona\.bank"\]:empty/);
  assert.match(adapter, /\.gift-section \[data-slot="toyona\.note"\]:empty/);
  assert.match(adapter, /display:\s*none/);
  assert.match(
    readFileSync(new URL("SOURCE_ADAPTATIONS.md", templateRoot), "utf8"),
    /no fields in the approved contract/,
  );
});
