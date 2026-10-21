import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL("../apps/web/public/templates/oltin-uzuk/", import.meta.url);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/oltin-uzuk/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const translationsSource = readFileSync(new URL("i18n.js", templateRoot), "utf8");

test("Oltin Uzuk translates its static invitation copy and metadata", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(translationsSource, { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const textNodes = Array.from(html.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter(
    (text) =>
      text.length > 1 &&
      !["&", "II", "J&M"].includes(text) &&
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
  assert.ok(translations["Oltin Uzuk · Taklifnoma"]);
  assert.ok(translations["Hashamatli nikoh taklifnomasi"]);
});

test("Oltin Uzuk keeps its captured artwork, styles, and ring animation", () => {
  const normalize = (value: string) => value.replace(/\r\n/g, "\n");
  const originalHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  const body = (source: string) => source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  const packagedBody = body(html);

  for (const structuralMarker of [
    'class="intro__copy"',
    'class="hero__stage"',
    'class="section section--date"',
    'class="section section--program"',
    'class="section section--dress"',
    'id="wishes"',
    'data-list="wishes"',
  ]) {
    assert.ok(packagedBody.includes(structuralMarker), `${structuralMarker} is missing`);
    assert.ok(body(originalHtml).includes(structuralMarker), `${structuralMarker} is absent from source`);
  }
  assert.ok(!packagedBody.includes("Javohir"));
  assert.ok(!packagedBody.includes("Madina"));
  assert.ok(!packagedBody.includes('content="Digital invitation"'));

  for (const file of ["template.css", "rings.css", "rings.js", "meta.js"]) {
    assert.equal(
      normalize(readFileSync(new URL(file, templateRoot), "utf8")),
      normalize(readFileSync(new URL(file, captureRoot), "utf8")),
      `${file} should match the captured source`,
    );
  }

  const fontCss = readFileSync(new URL("fonts.css", templateRoot), "utf8");
  for (const [, asset] of fontCss.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
  for (const asset of ["preview.webp", "art/rings-angle-1.webp", "art/rings-angle-2.webp", "art/rings-angle-3.webp"]) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }

  const sourceScript = normalize(readFileSync(new URL("template.js", captureRoot), "utf8"));
  const packagedScript = normalize(readFileSync(new URL("template.js", templateRoot), "utf8"));
  assert.ok(sourceScript.includes("window.__sceneUnion=true"));
  assert.ok(packagedScript.includes("window.__sceneUnion=true"));
  assert.ok(packagedScript.includes("window.Marhamat?.data?.dateTime"));
  assert.ok(!packagedScript.includes("||'Javohir'"));
  assert.ok(!packagedScript.includes("||'Madina'"));
  assert.match(packagedScript, /if\(ceremonyGroup\)openingTl\.to\(ceremonyGroup\.position/);
  assert.match(packagedScript, /if\(rings\[0\]\)openingTl\.to\(rings\[0\]\.position/);
  assert.doesNotMatch(packagedScript, /\?\.position\|\|\{\}/);
  assert.match(packagedScript, /reduced\(\)/);
});
