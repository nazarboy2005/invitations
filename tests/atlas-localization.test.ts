import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL(
  "../apps/web/public/templates/atlas/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const adapter = readFileSync(new URL("platform-adapter.js", templateRoot), "utf8");
const translationsSource = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url),
  "utf8",
);

test("Atlas translates its static invitation copy and metadata", () => {
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
  const brandCopy = new Set(["A / 26", "— 01 / 26", "2026"]);
  assert.deepEqual(
    [...textNodes, ...attributes, ...metadata].filter(
      (text) => !brandCopy.has(text) && !translations[text],
    ),
    [],
  );

  for (const value of [
    "Атлас таклифномаси",
    "Замонавий атлас ва адрас рангларидаги никоҳ таклифномаси.",
    "Приглашение Atlas",
    "Свадебное приглашение в ярких цветах узбекского атласа и адраса.",
    "Atlas invitation",
    "A wedding invitation inspired by the vivid colours of Uzbek atlas and adras silk.",
  ]) {
    assert.ok(adapter.includes(value), `${value} metadata translation is missing`);
  }
  assert.match(adapter, /document\.title = `\$\{couple\}\$\{copy\.title\}`/);
  assert.match(adapter, /\.intro__side-note/);
  assert.match(adapter, /\.marquee__track > span/);
});

test("Atlas packages its cover, hero, gallery textures and local fonts", () => {
  for (const asset of [
    "preview.webp",
    "art/silk-hero.webp",
    "art/silk-band.webp",
    "art/silk-swatch-1.webp",
    "art/silk-swatch-3.webp",
    "art/pouch.webp",
    "fonts.css",
  ]) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
});
