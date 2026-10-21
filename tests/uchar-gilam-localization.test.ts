import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL(
  "../apps/web/public/templates/uchar-gilam/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const template = readFileSync(new URL("template.js", templateRoot), "utf8");
const dictionarySource = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url),
  "utf8",
);
const templateDictionarySource = readFileSync(
  new URL("i18n.js", templateRoot),
  "utf8",
);
const sharedAdapter = readFileSync(
  new URL("../apps/web/src/templates/anor/renderer.tsx", import.meta.url),
  "utf8",
);

test("Uchar Gilam translates every fixed invitation label and metadata", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(dictionarySource, { window });
  runInNewContext(templateDictionarySource, { window });
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
    [...textNodes, ...attributes, ...metadata].filter((text) => !translations[text]),
    [],
  );
  assert.equal(
    translations["Uchar Gilam · Marxaba"][0],
    "Летающий ковёр · Marxaba",
  );
  assert.equal(
    translations["Uchar Gilam · Marxaba"][1],
    "Flying Carpet · Marxaba",
  );
  const dynamicMapTitle = template.match(
    /frame\.title=data\?\.venue\?\.name\|\|'([^']+)'/,
  )?.[1];
  assert.ok(dynamicMapTitle, "map iframe fallback title is missing");
  assert.ok(translations[dynamicMapTitle], "map iframe title needs translation");
  assert.match(template, /reducedMotion|prefers-reduced-motion/);
});

test("Uchar Gilam packages its portrait art, motion scenes, and local fonts", () => {
  for (const asset of [
    "preview.webp",
    "fonts.css",
    "art/terrace.webp",
    "art/sky-night.webp",
    "art/carpet.webp",
    "art/carpet-roll.webp",
    "art/finale.webp",
    "art/chest.webp",
    "art/chest-lid.webp",
  ]) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }

  const previewImage = html.match(
    /property="og:image" content="([^"]+)"/,
  )?.[1];
  assert.equal(previewImage, "preview.webp");

  const cssFiles = ["template.css", "fonts.css"];
  const references: Array<[URL, string]> = [
    ...Array.from(html.matchAll(/\b(?:src|href)="([^"]+)"/g), (match) => [
      templateRoot,
      match[1],
    ] as [URL, string]),
    [templateRoot, previewImage],
  ];
  for (const cssFile of cssFiles) {
    const cssUrl = new URL(cssFile, templateRoot);
    const css = readFileSync(cssUrl, "utf8");
    assert.doesNotMatch(css, /fonts\.(?:googleapis|gstatic)\.com/);
    references.push(
      ...Array.from(css.matchAll(/url\(["']?([^"')]+)["']?\)/g), (match) => [
        cssUrl,
        match[1],
      ] as [URL, string]),
    );
  }
  assert.doesNotMatch(html, /fonts\.(?:googleapis|gstatic)\.com/);
  for (const [base, reference] of references) {
    if (/^(?:[a-z]+:|\/\/|#|data:)/i.test(reference)) continue;
    assert.ok(existsSync(new URL(reference, base)), `missing local asset ${reference}`);
  }

  const threeBundle = template.match(
    /script\.src = '([^']*three\.bundle\.min\.js)'/,
  )?.[1];
  assert.ok(threeBundle, "flight animation renderer URL is missing");
  assert.ok(
    existsSync(new URL(threeBundle, templateRoot)),
    `missing local Three.js bundle ${threeBundle}`,
  );
});

test("Uchar Gilam ignores a late carpet texture after renderer teardown", () => {
  assert.match(template, /if\(!rug\|\|!renderer\|\|renderer\.getContext\(\)\.isContextLost\(\)\)\{tex\.dispose\(\);return;\}/);
  assert.match(template, /if\(!rug\|\|!renderer\|\|renderer\.getContext\(\)\.isContextLost\(\)\)\{composed\.dispose\(\);tex\.dispose\(\);return;\}/);
  assert.match(template, /let disposed = false;[\s\S]*?texture\.addEventListener\('dispose', \(\) => \{ disposed = true; \}\);[\s\S]*?document\.fonts\?\.ready\?\.then\(\(\) => \{\s*if \(disposed \|\| !renderer\) return;/);
});

test("Uchar Gilam writes names directly onto the carpet texture", () => {
  const textureBuilder = template.match(
    /function makeFlightCarpetTexture[\s\S]*?function coverAnchor/,
  )?.[0];
  assert.ok(textureBuilder, "flight carpet texture renderer is missing");
  assert.doesNotMatch(textureBuilder, /roundRect|rgba\(48,17,28/);
  assert.match(textureBuilder, /strokeText\(line, x, y, 670\)/);
  assert.match(textureBuilder, /fillStyle = '#f2d899'/);
  assert.match(html, /intro__scene-lettering[\s\S]*?data-slot="groom"[\s\S]*?data-slot="bride"/);
  assert.match(template, /greetingRun[\s\S]*?run!==greetingRun/);
  assert.match(template, /current\.slice\(0,half\)===current\.slice\(half\)/);
});

test("Uchar Gilam data slots resolve through the shared typed invitation adapter", () => {
  const legacyDataType = sharedAdapter.match(
    /export type LegacyData = \{([\s\S]*?)\n\};/,
  )?.[1];
  assert.ok(legacyDataType, "shared legacy invitation type is missing");

  const slotRoots = Array.from(
    html.matchAll(/data-slot="([^"]+)"/g),
    (match) => match[1].split(".")[0],
  );
  const uncovered = [...new Set(slotRoots)].filter(
    (root) => !new RegExp(`\\b${root}\\s*:`).test(legacyDataType),
  );
  assert.deepEqual(uncovered, []);
  const slotPaths = [...new Set(Array.from(
    html.matchAll(/data-slot="([^"]+)"/g),
    (match) => match[1],
  ))];
  const supportedSlotPaths = new Set([
    "title", "footer", "groom", "bride", "hosts", "hostsLabel",
    "greeting", "monogram", "eventType", "message", "programHeading",
    "dateTime", "date.weekday", "date.weekdayShort", "date.day",
    "date.month", "date.monthNumber", "date.year", "date.time",
    "date.long", "date.short", "venue.name", "venue.address",
    "venue.lat", "venue.lng", "venue.mapUrl", "toyona.enabled",
    "toyona.cardNumber", "toyona.cardHolder", "toyona.note",
    "dressCode.enabled", "dressCode.style", "dressCode.text",
    "dressCode.note", "dressCode.colors", "rsvp", "wishesEnabled",
    "wishes", "gallery", "contacts", "program", "story", "music",
    "timezone",
  ]);
  assert.deepEqual(
    slotPaths.filter((path) => !supportedSlotPaths.has(path)),
    [],
  );
  assert.doesNotMatch(html, /data-slot="toyona\.bank"/);
  assert.match(template, /wish',\(\)=>\{if\(isReduced\(\)\)return;/);
  assert.match(sharedAdapter, /footer:\s*footerLabels\[locale\]/);
  assert.match(sharedAdapter, /"uz-Cyrl":\s*"Marxaba билан яратилди"/);
  assert.match(sharedAdapter, /en:\s*"Made with Marxaba"/);
  assert.match(sharedAdapter, /ru:\s*"Создано с Marxaba"/);
});
