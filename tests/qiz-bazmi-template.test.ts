import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { createInvitation, templateById, type Locale } from "@taklifnoma/contracts";
import { createTemplatePreviewSample, getTemplatePreviewWishes } from "../apps/web/src/modules/catalog/preview-sample";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => { module.exports = {}; };
const moduleRuntime = require("node:module") as { _resolveFilename: (...args: any[]) => string };
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/") ? path.resolve(webSourceRoot, request.slice(2)) : request;
  return resolveFilename.call(this, resolved, ...args);
};

const root = new URL("../apps/web/public/templates/qiz-bazmi/", import.meta.url);
const capture = new URL("../Invitations - this folder will be removed from production/Marxaba/Qiz uzatish/templates/qiz-bazmi/", import.meta.url);
const shared = new URL("../apps/web/public/templates/shared/nikoh/", import.meta.url);
const captureManifest = JSON.parse(readFileSync(new URL("../Invitations - this folder will be removed from production/Marxaba/capture-manifest.json", import.meta.url), "utf8")) as { resources: Record<string, { file: string }> };
const source = readFileSync(new URL("index.html", root), "utf8");
const metadata = readFileSync(new URL("meta.js", root), "utf8");
const styles = readFileSync(new URL("template.css", root), "utf8");
const script = readFileSync(new URL("template.js", root), "utf8");
const translations = readFileSync(new URL("i18n.js", root), "utf8");
const body = (html: string) => html.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
const normalize = (text: string) => text.replace(/\r\n/g, "\n");

test("Qiz Bazmi packages its full captured template structure and distinctive artwork", () => {
  for (const section of ["intro", "hero", "invitation-text", "date", "program", "venue", "dresscode", "gallery", "rsvp", "wishes", "toyona", "contacts", "footer"])
    assert.match(source, new RegExp(`(?:data-section|id)="${section}"`), `${section} section is retained`);
  for (const asset of ["art/palm-henna.webp", "art/tilla-qosh.svg", "art/henna-bowl.svg", "art/atlas-pattern.svg", "art/venue.svg"])
    assert.ok(existsSync(new URL(asset, root)), `${asset} is packaged`);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(translations, /Девичий вечер/);
  assert.match(source, /fonts\.css/);
  const preview = readFileSync(new URL("preview.webp", root));
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.match(metadata, /preview:\s*"preview\.webp"/);
  assert.doesNotMatch(source, /fonts\.googleapis\.com|sample-invitation\.js|sample-overrides\.js/);
  assert.equal(existsSync(new URL("sample-overrides.js", root)), false, "reference sample overrides are excluded");
});

test("Qiz Bazmi uses the shared platform data and API adapter", () => {
  assert.match(source, /\.\.\/shared\/nikoh\/platform-bridge\.js/);
  assert.match(source, /\.\.\/shared\/nikoh\/core\.js/);
  assert.match(source, /data-list="program"/);
  assert.match(source, /data-list="gallery"/);
  assert.match(source, /data-rsvp/);
  assert.match(source, /data-wishes-form/);
  assert.match(metadata, /eventTypes:\s*\["qiz-uzatish",\s*"fotiha",\s*"tugilgan-kun"\]/);
  assert.match(readFileSync(new URL("../../../src/templates/qiz-bazmi/renderer.tsx", root), "utf8"), /templateId="qiz-bazmi"/);
});

test("Qiz Bazmi keeps empty preview memories icon-only and collapses unsupported empty gift note", () => {
  const adapter = readFileSync(new URL("contract-adapter.css", root), "utf8");
  assert.match(source, /href="contract-adapter\.css"/);
  assert.match(adapter, /\[data-slot="toyona\.note"\]:empty\s*\{\s*display:\s*none/);
  assert.match(source, /<img[^>]*data-photo[^>]*alt="Qiz bazmi surati"/);
  const sharedCore = readFileSync(new URL("../shared/nikoh/core.js", root), "utf8");
  assert.match(sharedCore, /image\.alt=source\?alt:'';if\(!source\)image\.setAttribute\('aria-hidden','true'\)/);
  assert.match(sharedCore, /placeholder\.textContent='✦'/);
  assert.match(sharedCore, /hideIf\('gallery',!\(Array\.isArray\(data\.gallery\)&&data\.gallery\.length\)&&!data\.preview\)/);
});

test("Qiz Bazmi keeps captured body, scripts, styles, metadata, and source artwork intact", () => {
  const capturedHtml = readFileSync(new URL("index.html", capture), "utf8");
  assert.equal(normalize(body(source)), normalize(body(capturedHtml)));
  for (const file of ["template.css", "template.js", "i18n.js", "meta.js"])
    assert.deepEqual(readFileSync(new URL(file, root)), readFileSync(new URL(file, capture)), `${file} remains source-identical`);
  for (const file of ["atlas-pattern.svg", "henna-bowl.svg", "palm-henna.webp", "tilla-qosh.svg", "venue.svg"]) {
    assert.deepEqual(readFileSync(new URL(`art/${file}`, root)), readFileSync(new URL(`art/${file}`, capture)), `source art ${file} remains unchanged`);
    assert.equal(captureManifest.resources[`https://www.marxaba.uz/templates/qiz-bazmi/art/${file}`]?.file, `Qiz uzatish/templates/qiz-bazmi/art/${file}`);
  }
  assert.ok(!existsSync(new URL("sample-overrides.js", root)));
});

test("Qiz Bazmi catalog, category, event compatibility, and additive DB seed stay aligned and unpublished", () => {
  const definition = templateById("qiz-bazmi");
  assert.ok(definition);
  assert.equal(definition.published, false);
  assert.equal(definition.previewEventType, "qiz-uzatish");
  assert.deepEqual(definition.categoryIds, ["qiz-bazmi"]);
  assert.deepEqual(definition.supportedEventTypes, ["qiz-uzatish", "fotiha", "birthday"]);
  assert.equal(definition.priceMinor, 15_000_000);
  assert.equal(definition.previewImage, "/templates/qiz-bazmi/preview.webp");
  const migration = readFileSync(new URL("../packages/database/migrations/0038_add_lola_qiz_bazmi_shahzoda_chavandoz.sql", import.meta.url), "utf8");
  assert.match(migration, /\('qiz-bazmi', 'Qiz Bazmi', 15000000, 'UZS', false\)/);
  assert.match(migration, /\('qiz-bazmi', 'qiz-bazmi'\)/);
  for (const eventType of ["qiz-uzatish", "fotiha", "birthday"])
    assert.ok(migration.includes(`('qiz-bazmi', '${eventType}')`), `migration supports ${eventType}`);
});

test("Qiz Bazmi maps the canonical qiz-uzatish sample into all four locales", () => {
  const sample = createTemplatePreviewSample("qiz-bazmi");
  assert.equal(sample.eventType, "qiz-uzatish");
  const names: Record<Locale, string> = { "uz-Latn": "Madina", "uz-Cyrl": "Мадина", en: "Madina", ru: "Мадина" };
  const hosts: Record<Locale, string> = { "uz-Latn": "Madina oilasi", "uz-Cyrl": "Мадина оиласи", en: "Madina's family", ru: "Семья Мадины" };
  const programHeadings: Record<Locale, string> = { "uz-Latn": "Qiz uzatish dasturi", "uz-Cyrl": "Қиз узатиш дастури", en: "Bride send-off program", ru: "Программа проводов невесты" };
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
    const content = sample.content[locale];
    assert.deepEqual(content.people, [names[locale]]);
    assert.equal(content.hosts, hosts[locale]);
    assert.equal(content.programHeading, programHeadings[locale]);
    assert.ok(content.greeting && content.message);
    assert.ok(sample.program.every((item) => content.programTitles[item.id]));
    assert.ok(sample.dressCode.style[locale] && sample.dressCode.text[locale] && sample.dressCode.note[locale]);
    assert.ok(sample.dressCode.colors.every((color) => color.name[locale]));
    assert.equal(getTemplatePreviewWishes(locale).length, 3);
  }
  assert.equal(sample.program.length, 6);
  assert.equal(sample.gallery.length, 6);

  const blank = createInvitation("qiz-bazmi");
  assert.deepEqual(blank.content["uz-Latn"].people, []);
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.equal(blank.gift.cardNumber, "");
  assert.deepEqual(blank.contacts, { phoneNumber: "", telegramUsername: "" });
});

test("Qiz Bazmi renderer adapter maps every locale and leaves blank drafts empty", () => {
  const { makeLegacyData } = require("../apps/web/src/templates/anor/renderer") as typeof import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("qiz-bazmi");
  const eventTypes: Record<Locale, string> = {
    "uz-Latn": "Qiz uzatish",
    "uz-Cyrl": "Қиз узатиш",
    en: "Bride send-off",
    ru: "Проводы невесты",
  };
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
    const mapped = makeLegacyData(sample, locale, "", true);
    assert.equal(mapped.groom, sample.content[locale].people[0]);
    assert.equal(mapped.bride, "");
    assert.equal(mapped.eventType, eventTypes[locale]);
    assert.equal(mapped.hosts, sample.content[locale].hosts);
    assert.equal(mapped.programHeading, sample.content[locale].programHeading);
    assert.equal(mapped.program.length, 6);
    assert.ok(mapped.program.every((item) => item.title));
    assert.equal(mapped.gallery.length, 6);
    assert.deepEqual(mapped.wishes, getTemplatePreviewWishes(locale));
    assert.equal(mapped.dressCode.colors.length, 5);
    assert.equal(mapped.contacts.length, 2);
    assert.equal(mapped.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(mapped.toyona.cardHolder, "AZIZ AZIZOV");
    assert.equal(mapped.toyona.note, "");
    assert.deepEqual(mapped.contacts.map((contact) => contact.type), ["phone", "telegram"]);
  }
  const blank = makeLegacyData(createInvitation("qiz-bazmi"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.contacts.length, 0);
});

test("Qiz Bazmi fixed copy and page metadata have complete Russian and English translations", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(readFileSync(new URL("i18n.js", shared), "utf8"), { window });
  runInNewContext(translations, { window });
  const dictionary = window.MARHAMAT_I18N;
  assert.ok(dictionary);
  const text = Array.from(body(source).matchAll(/>([^<>]+)</g), (match) => match[1].replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()).filter((value) => value.length > 1 && !/^\d+$/.test(value));
  const attributes = Array.from(body(source).matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g), (match) => match[1].trim());
  const title = source.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() ?? "";
  const metadata = [title, ...Array.from(source.matchAll(/<meta (?:name="description"|property="og:title"|property="og:description") content="([^"]+)"/g), (match) => match[1].trim())];
  assert.deepEqual([...text, ...attributes, ...metadata].filter((value) => !dictionary[value]), []);
});

test("Qiz Bazmi preview artwork has checksum-backed fixture and viewport provenance", () => {
  const preview = readFileSync(new URL("preview.webp", root));
  const provenance = JSON.parse(readFileSync(new URL("preview.provenance.json", root), "utf8")) as {
    artifactSha256: string; format: string; width: number; height: number; sourceCapture: string;
    sourceOpening: string; referenceRoute: string; fixture: string;
    locale: string; viewport: { width: number; height: number; deviceScaleFactor: number }; verificationNote: string;
  };
  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.equal(preview.toString("ascii", 12, 16), "VP8X");
  assert.deepEqual([1 + preview.readUIntLE(24, 3), 1 + preview.readUIntLE(27, 3)], [450, 800]);
  assert.equal(provenance.artifactSha256, createHash("sha256").update(preview).digest("hex"));
  assert.equal(provenance.format, "image/webp");
  assert.deepEqual([provenance.width, provenance.height], [450, 800]);
  assert.equal(provenance.sourceCapture, "Invitations - this folder will be removed from production/Marxaba/Qiz uzatish/templates/qiz-bazmi");
  assert.match(provenance.sourceOpening, /captured invitation intro/);
  assert.equal(provenance.referenceRoute, "http://127.0.0.1:3002/templates/qiz-bazmi/index.html?lang=uz");
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.equal(provenance.locale, "uz-Latn");
  assert.deepEqual(provenance.viewport, { width: 450, height: 800, deviceScaleFactor: 1 });
  assert.match(provenance.verificationNote, /not independently re-rendered/);
});


test("all source dependencies and font subsets resolve locally", () => {
  for (const [, relative] of source.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:https?:|#|data:)/.test(relative)) continue;
    assert.ok(existsSync(new URL(relative, root)), `local dependency ${relative} exists`);
  }
  const fontCss = readFileSync(new URL("fonts.css", root), "utf8");
  assert.doesNotMatch(fontCss, /https?:\/\//);
  for (const [, relative] of fontCss.matchAll(/url\((?:"|')?([^)'"\s]+)(?:"|')?\)/g))
    assert.ok(existsSync(new URL(relative, root)), `local font ${relative} exists`);
  assert.match(fontCss, /font-family: 'Manrope'/);
  assert.match(fontCss, /font-family: 'Playfair Display'/);
});
test("the captured source fields without a shared contract are documented rather than filled with sample data", () => {
  const notes = readFileSync(new URL("README.md", root), "utf8");
  assert.match(notes, /venue\.photo/);
  assert.match(notes, /toyona\.bank/);
  assert.match(notes, /toyona\.note/);
  assert.match(notes, /celebrant/);
});

