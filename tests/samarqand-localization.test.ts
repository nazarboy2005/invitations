import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateHtml = readFileSync(
  new URL(
    "../apps/web/public/templates/samarqand-kechasi/index.html",
    import.meta.url,
  ),
  "utf8",
);
const dictionarySource = readFileSync(
  new URL(
    "../apps/web/public/templates/shared/nikoh/i18n.js",
    import.meta.url,
  ),
  "utf8",
);

test("Samarqand Kechasi has translations for all static invitation copy", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(dictionarySource, { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const textNodes = Array.from(templateHtml.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/\s+/g, " ").trim(),
  ).filter((text) => text.length > 1 && text !== "&amp;" && text !== "00");
  const attributes = Array.from(
    templateHtml.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );

  const untranslated = [...textNodes, ...attributes].filter(
    (text) => !translations[text],
  );
  assert.deepEqual(untranslated, []);
  assert.equal(translations["Oqshom tafsilotlari ↓"][1], "Evening details ↓");
  assert.equal(
    translations["Oqshom tafsilotlari ↓"][0],
    "Подробнее о вечере ↓",
  );
  assert.equal(
    translations["Samarqand Kechasi · Taklifnoma"][0],
    "Samarqand Kechasi · Приглашение",
  );
  assert.equal(
    translations["Yulduzli tun ostidagi Samarqand nikoh taklifnomasi"][1],
    "A Samarkand wedding invitation beneath a starry sky",
  );
});
