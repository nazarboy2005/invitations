import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL(
  "../apps/web/public/templates/oq-kabutar/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
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
