import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { createInvitation } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
} from "../apps/web/src/modules/catalog/preview-sample";

const templateRoot = new URL(
  "../apps/web/public/templates/kuzgi-chinor/",
  import.meta.url,
);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/kuzgi-chinor/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const translationsSource = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url),
  "utf8",
);

test("Kuzgi Chinor translates its static invitation copy and metadata", () => {
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
  assert.ok(translations["Kuzgi Chinor · Taklifnoma"]);
  assert.ok(translations["Raqamli taklifnoma"]);
});

test("Kuzgi Chinor preserves captured source and bundles the referenced assets locally", () => {
  const normalize = (value: string) => value.replace(/\r\n/g, "\n");
  const originalHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  const originalCss = readFileSync(new URL("template.css", captureRoot), "utf8");
  const originalJs = readFileSync(new URL("template.js", captureRoot), "utf8");
  const packagedJs = readFileSync(new URL("template.js", templateRoot), "utf8");
  const packagedCss = readFileSync(new URL("template.css", templateRoot), "utf8");
  const originalBody = originalHtml.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim();
  const packagedBody = html.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim();

  assert.equal(
    normalize(packagedBody ?? ""),
    normalize(originalBody ?? ""),
    "the captured invitation body should remain intact",
  );
  assert.equal(
    normalize(packagedJs),
    normalize(originalJs),
    "the captured animation and interaction script should remain intact",
  );
  assert.match(packagedJs, /window\.Marhamat\s*&&\s*Marhamat\.reducedMotion/);
  assert.match(packagedJs, /\|\|reduced\)return/);
  assert.equal(
    normalize(packagedCss),
    normalize(originalCss.replace(/^@import url\([^\r\n]+\);\r?\n/, "")),
    "only the external font import should be replaced by local font files",
  );

  assert.match(html, /href="contract-adapter\.css"/);
  const adapterCss = readFileSync(
    new URL("contract-adapter.css", templateRoot),
    "utf8",
  );
  assert.match(adapterCss, /#toyona \[data-slot="toyona\.bank"\]:empty/);
  assert.match(adapterCss, /#toyona \[data-slot="toyona\.note"\]:empty/);

  for (const asset of [
    "preview.webp",
    "fonts.css",
    "art/avenue-far.webp",
    "art/avenue-mid.svg",
    "art/branches-top.svg",
    "art/kraft-paper.svg",
    "art/leaf.svg",
  ]) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
});

test("Kuzgi Chinor preview maps the shared six-item wedding fixture in four locales", () => {
  const sample = createTemplatePreviewSample("kuzgi-chinor");
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
    assert.equal(Object.keys(content.programTitles).length, 6, locale);
    assert.ok(content.programTitles["sample-arrival"]);
    assert.ok(content.programTitles["sample-farewell"]);
    const wishes = getTemplatePreviewWishes(locale);
    assert.equal(wishes.length, 3);
    assert.ok(wishes.every((wish) => wish.name && wish.text));
  }

  for (const hook of [
    'id="intro"',
    'id="open-invitation"',
    'data-slot="dressCode.style"',
    'data-slot="dressCode.text"',
    'data-slot="dressCode.note"',
    'data-list="program"',
    'data-list="gallery"',
    'data-list="wishes"',
    'data-list="contacts"',
    'data-list="dresscode"',
    'data-section="toyona"',
    'data-slot="toyona.cardNumber"',
    'data-slot="toyona.cardHolder"',
  ]) {
    assert.ok(html.includes(hook), `${hook} should be present in the source renderer`);
  }
});

test("Kuzgi Chinor blank invitations do not contain preview sample details", () => {
  const blank = createInvitation("kuzgi-chinor");
  const sample = createTemplatePreviewSample("kuzgi-chinor");

  assert.equal(blank.gift.cardNumber, "");
  assert.equal(blank.gift.cardHolder, "");
  assert.deepEqual(blank.contacts, { phoneNumber: "", telegramUsername: "", instagramUrl: "" });
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.equal("sampleWishes" in sample, false);
  const serializedSample = JSON.stringify(sample);
  for (const wish of getTemplatePreviewWishes("uz-Latn")) {
    assert.equal(serializedSample.includes(wish.name), false);
    assert.equal(serializedSample.includes(wish.text), false);
  }
});
