import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL("../apps/web/public/templates/oynavand/", import.meta.url);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/oynavand/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");

test("Oynavand has localized static copy in every supported interface language", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(
    readFileSync(new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url), "utf8"),
    { window },
  );
  runInNewContext(readFileSync(new URL("i18n.js", templateRoot), "utf8"), { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const textNodes = Array.from(html.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter(
    (text) =>
      text.length > 1 &&
      !["&", "№", "✦"].includes(text) &&
      !/^№?\s*[\d /·—-]+$/.test(text),
  );
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
  assert.ok(translations["Marxaba · Oynavand"]);
  assert.ok(translations["Oynavand — oynakori ko‘zgular saroyidagi nikoh taklifnomasi"]);
});

test("Oynavand keeps captured markup, visual source, and interactions", () => {
  const normalize = (value: string) => value.replace(/\r\n/g, "\n");
  const originalHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  const body = (source: string) => source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  assert.equal(normalize(body(html)), normalize(body(originalHtml)));
  assert.ok(!body(html).includes("Javohir"));
  assert.ok(!body(html).includes("Madina"));

  for (const file of ["template.css", "meta.js"]) {
    assert.equal(
      normalize(readFileSync(new URL(file, templateRoot), "utf8")),
      normalize(readFileSync(new URL(file, captureRoot), "utf8")),
      `${file} should remain identical to the captured source`,
    );
  }
  const sourceI18n = normalize(readFileSync(new URL("i18n.js", captureRoot), "utf8"));
  const expectedI18n = sourceI18n
    .replace(
      '"Marxaba · Oynavand": ["Marxaba · Oynavand", "Marxaba · Oynavand"],',
      '"Marxaba · Oynavand": ["Marxaba · Ойнаванд", "Marxaba · Oynavand"],\n  "Oynavand — oynakori ko‘zgular saroyidagi nikoh taklifnomasi": ["Ойнаванд — свадебное приглашение в дворце зеркал", "Oynavand — a wedding invitation in a palace of mirrors"],',
    );
  assert.equal(normalize(readFileSync(new URL("i18n.js", templateRoot), "utf8")), expectedI18n);

  const sourceScript = normalize(readFileSync(new URL("template.js", captureRoot), "utf8"));
  const packagedScript = normalize(readFileSync(new URL("template.js", templateRoot), "utf8"));
  assert.equal(
    packagedScript,
    sourceScript.replace(
      "../../shared/vendor/three/three.bundle.min.js",
      "../shared/nikoh/vendor/three/three.bundle.min.js",
    ),
  );
  for (const marker of [
    'id="open-invitation"',
    'data-calendar',
    'data-list="program"',
    'data-dresscode',
    'data-list="gallery"',
    'data-rsvp',
    'data-list="wishes"',
    'data-wishes-form',
    'data-music-toggle',
    'data-map="google"',
    'data-slot="toyona.cardNumber"',
  ]) {
    assert.ok(body(html).includes(marker), `${marker} is missing`);
  }
  assert.ok(packagedScript.includes("matchMedia('(prefers-reduced-motion: reduce)')"));
  assert.ok(packagedScript.includes("window.Marhamat?.on?.('rsvp'"));
});

test("Oynavand packages every local reference asset and font", () => {
  const assets = [
    "preview.webp",
    "art/casket.webp",
    "art/mirror-tile-pattern.webp",
    "art/poster-dome.webp",
    "fonts/cormorant-sc-500-cyrillic.woff2",
    "fonts/cormorant-sc-600-latin.woff2",
    "fonts/jost-300-cyrillic.woff2",
    "fonts/jost-400-latin.woff2",
    "fonts/jost-500-latin_ext.woff2",
  ];
  for (const asset of assets) assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  const htmlAndFonts =
    html + readFileSync(new URL("fonts.css", templateRoot), "utf8");
  assert.doesNotMatch(htmlAndFonts, /fonts\.(?:googleapis|gstatic)\.com/);
  for (const [, asset] of htmlAndFonts.matchAll(/url\(['"]?([^'")]+\.(?:ttf|woff2))['"]?\)/g)) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
});

test("Oynavand's initial preview uses the shared wishes and dress-code example", () => {
  const sample = JSON.parse(
    readFileSync(new URL("../apps/web/src/modules/catalog/preview-sample.json", import.meta.url), "utf8"),
  ) as {
    wishes: Record<string, Array<{ name: string; text: string }>>;
    dressCode: { enabled: boolean; colors: unknown[] };
  };
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"]) {
    assert.equal(sample.wishes[locale]?.length, 3, `${locale} must have three sample wishes`);
    assert.ok(sample.wishes[locale].every((wish) => wish.name && wish.text));
  }
  assert.equal(sample.dressCode.enabled, true);
  assert.equal(sample.dressCode.colors.length, 5);
  assert.ok(html.includes('class="eyebrow">Yurakdan</p>'));
  assert.ok(html.includes('data-list="wishes"'));
});
