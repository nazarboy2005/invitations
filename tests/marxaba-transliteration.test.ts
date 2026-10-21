import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const core = readFileSync(new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url), "utf8");
const start = core.indexOf("function transliterateUzbek");
const end = core.indexOf("function translateText", start);
if (start < 0 || end < 0) throw new Error("Marxaba transliteration not found");
const transliterationSource = core.slice(start, end);
const transliterate = runInNewContext(transliterationSource + "; transliterateUzbek");

test("Marxaba Uzbek Cyrillic transliteration preserves Uzbek letters", () => {
  assert.equal(transliterate("O\u2018zbek to\u2018yi"), "\u040e\u0437\u0431\u0435\u043a \u0442\u045e\u0439\u0438");
  assert.equal(transliterate("G\u2018ulhayo va O\u2018rik"), "\u0492\u0443\u043b\u04b3\u0430\u0451 \u0432\u0430 \u040e\u0440\u0438\u043a");
  assert.equal(transliterate("Shahzoda, Chust va Yangi"), "\u0428\u0430\u04b3\u0437\u043e\u0434\u0430, \u0427\u0443\u0441\u0442 \u0432\u0430 \u042f\u043d\u0433\u0438");
});

test("Marxaba Cyrillic and Russian calendar labels are valid localized text", () => {
  const localeStart = core.indexOf("const LOCALES={");
  const localeEnd = core.indexOf(";const L=LOCALES[lang]", localeStart);
  if (localeStart < 0 || localeEnd < 0) throw new Error("Marxaba locale definitions not found");
  const locales = runInNewContext(transliterationSource + "\n" + core.slice(localeStart, localeEnd) + "; LOCALES");
  assert.equal(locales.ru.months[5], "\u0438\u044e\u043d\u044f");
  assert.equal(locales.uz.long("Shanba", 12, "iyun", 2027, "17:00"), "Shanba \u00b7 12-iyun 2027 \u00b7 17:00");
  assert.equal(locales.en.long("Saturday", 12, "June", 2027, "17:00"), "Saturday \u00b7 12 June 2027 \u00b7 17:00");
  assert.equal(locales.en.no, "Can\u2019t come");
  assert.equal(locales.ru.weekdays[5], "\u0421\u0443\u0431\u0431\u043e\u0442\u0430");
  assert.deepEqual(Array.from(locales.ru.short), ["\u041f\u043d", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041f\u0442", "\u0421\u0431", "\u0412\u0441"]);
  assert.equal(locales["uz-Cyrl"].months[5], "\u0438\u044e\u043d");
  assert.equal(locales["uz-Cyrl"].weekdays[5], "\u0428\u0430\u043d\u0431\u0430");
});
