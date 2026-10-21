import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createInvitation, templateById, type Locale } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
} from "../apps/web/src/modules/catalog/preview-sample";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => { module.exports = {}; };
const moduleRuntime = require("node:module") as { _resolveFilename: (...args: any[]) => string };
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/") ? path.resolve(webSourceRoot, request.slice(2)) : request;
  return resolveFilename.call(this, resolved, ...args);
};

const templateRoot = new URL("../apps/web/public/templates/sahifa/", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, templateRoot), "utf8");
const html = read("index.html");

test("Sahifa's typed catalog release flag matches its additive publish migration", () => {
  const template = templateById("sahifa");
  const migration = readFileSync(
    new URL("../packages/database/migrations/0020_publish_sahifa.sql", import.meta.url),
    "utf8",
  );
  assert.equal(template?.published, true);
  assert.equal(template?.priceMinor, 15000000);
  assert.match(migration, /UPDATE templates[\s\S]*SET published = true[\s\S]*WHERE id = 'sahifa'/);
});

test("Sahifa preview binds clothing, six program entries, wishes, gifts, and contacts from the shared fixture", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const fixture = createTemplatePreviewSample("sahifa");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  for (const locale of locales) {
    const data = makeLegacyData(fixture, locale, "", true);
    const content = fixture.content[locale];
    assert.equal(data.dressCode.enabled, true);
    assert.equal(data.dressCode.style, fixture.dressCode.style[locale]);
    assert.equal(data.dressCode.text, fixture.dressCode.text[locale]);
    assert.equal(data.dressCode.note, fixture.dressCode.note[locale]);
    assert.deepEqual(data.dressCode.colors.map((color) => color.name), fixture.dressCode.colors.map((color) => color.name[locale]));
    assert.equal(data.program.length, 6);
    assert.deepEqual(data.program.map((item) => item.time), ["17:30", "18:00", "18:30", "20:00", "21:30", "22:30"]);
    assert.deepEqual(data.program.map((item) => item.title), Object.values(content.programTitles));
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.ok(data.wishes.length > 0);
    assert.equal(data.toyona.enabled, true);
    assert.equal(data.toyona.cardNumber, fixture.gift.cardNumber);
    assert.equal(data.toyona.cardHolder, fixture.gift.cardHolder);
    assert.equal(data.toyona.note, "");
    assert.equal("bank" in data.toyona, false);
    assert.deepEqual(data.contacts.map((item) => item.value), [fixture.contacts.phoneNumber, "@" + fixture.contacts.telegramUsername.replace(/^@/, "")]);
    assert.equal(data.gallery.length, 6);
    assert.ok(data.gallery.every((item) => item.src === "" && item.alt === "" && item.caption === ""));
  }

  const blank = makeLegacyData(createInvitation("sahifa"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.message, "");
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.dressCode.enabled, false);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.toyona.note, "");
  assert.equal("bank" in blank.toyona, false);
  assert.equal(blank.contacts.length, 0);
  assert.equal(JSON.stringify(createInvitation("sahifa")).includes("Javohir"), false);
});

test("Sahifa Lahzalar renders empty photos as decorative icons and wraps gallery controls", () => {
  const gallery = html.match(/<section[^>]*id="gallery"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(gallery.includes('data-list="gallery"'));
  assert.ok(gallery.includes('data-photo'));
  assert.doesNotMatch(gallery, /To‘y surati|Wedding photo|Фото свадьбы/i);
  const core = readFileSync(new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url), "utf8");
  assert.match(core, /placeholder\.setAttribute\('aria-hidden','true'\)/);
  assert.match(core, /placeholder\.textContent='✦'/);
  assert.match(core, /index=\(number\+state\.items\.length\)%state\.items\.length/);
  assert.match(core, /behavior:\s*reducedMotion\s*\?\s*'instant'\s*:\s*'smooth'/);
});

test("Sahifa hides unsupported empty To‘yona fields while keeping the gift section", () => {
  assert.ok(html.includes('href="platform-adapter.css"'));
  const adapter = read("platform-adapter.css");
  assert.match(adapter, /\.gift-spread > \[data-slot="toyona\.note"\]:empty/);
  assert.match(adapter, /\.gift__details \[data-slot="toyona\.bank"\]:empty/);
  assert.ok(html.includes('id="toyona" data-section="toyona"'));
  assert.ok(html.includes('data-slot="toyona.cardNumber"'));
  assert.ok(html.includes('data-slot="toyona.cardHolder"'));
});

