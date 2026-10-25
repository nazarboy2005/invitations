import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { createInvitation, type Locale } from "@taklifnoma/contracts";
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

const appRoot = new URL("../apps/web/public/templates/kozgu/", import.meta.url);
const captureRoot = new URL("../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/kozgu/", import.meta.url);
const sharedRoot = new URL("../apps/web/public/templates/shared/nikoh/", import.meta.url);
const read = (base: URL, file: string) => readFileSync(new URL(file, base), "utf8");
const normalize = (source: string) => source.replace(/\r\n/g, "\n");
const html = read(appRoot, "index.html");
const body = (source: string) => source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";

test("Ko‘zgu keeps its full captured HTML composition, art helpers, motion scripts, styles and media", () => {
  assert.equal(normalize(body(html)), normalize(body(read(captureRoot, "index.html"))));
  assert.equal(read(appRoot, "template.css"), read(captureRoot, "template.css"));
  for (const file of ["template.js", "mirror.js", "art/src/common.js", "meta.js", "i18n.js"]) assert.equal(normalize(read(appRoot, file)), normalize(read(captureRoot, file)));
  for (const asset of ["console.webp", "curtain.webp", "fore.webp", "frame.webp", "petal-sprites.webp", "room.webp", "wall.webp"]) assert.deepEqual(readFileSync(new URL(`art/${asset}`, appRoot)), readFileSync(new URL(`art/${asset}`, captureRoot)));
  assert.match(read(appRoot, "mirror.js"), /function wipe\(/);
  assert.match(read(appRoot, "mirror.js"), /function snapshot\(/);
  assert.match(read(appRoot, "template.js"), /function scrollStory\(/);
  assert.match(read(appRoot, "template.css"), /prefers-reduced-motion:\s*reduce/);
  assert.match(html, /id="open-invitation"/);
});

test("Ko‘zgu catalog artwork is the exact preview asset declared by source metadata", () => {
  const preview = readFileSync(new URL("preview.webp", appRoot));
  assert.ok(preview.length > 20_000, "rendered opening artwork should be a real image, not an icon placeholder");
  assert.match(read(appRoot, "meta.js"), /preview:\s*"preview\.webp"/);
  const digest = createHash("sha256").update(preview).digest("hex");
  assert.equal(digest, "4e2296926d0cade11ed63a2630a5581c09579c4d439a5ce55a81440d5a14f3cf");
  assert.equal(preview.toString("ascii", 12, 16), "VP8 ");
  assert.equal(preview.readUInt16LE(26) & 0x3fff, 720);
  assert.equal(preview.readUInt16LE(28) & 0x3fff, 1280);
  assert.match(read(captureRoot, "meta.js"), /preview:\s*"preview\.webp"/);
  assert.equal(existsSync(new URL("preview.webp", captureRoot)), false, "the reference metadata names an absent source preview asset");
  const provenance = JSON.parse(read(appRoot, "preview.provenance.json")) as {
    sourceUrl: string;
    sha256: string;
    width: number;
    height: number;
    captureFilePresent: boolean;
    catalogArtworkMatchesMetadataAsset: boolean;
  };
  assert.equal(provenance.sourceUrl, "https://www.marxaba.uz/templates/kozgu/preview.webp");
  assert.equal(provenance.sha256, digest);
  assert.equal(provenance.width, 720);
  assert.equal(provenance.height, 1280);
  assert.equal(provenance.captureFilePresent, false);
  assert.equal(provenance.catalogArtworkMatchesMetadataAsset, true);
  assert.match(read(appRoot, "SOURCE_ADAPTATIONS.md"), /exact metadata-declared image/);
  assert.match(body(html), /class="intro__stage"/);
  assert.match(body(html), /class="mirror__frame" src="art\/frame\.webp"/);
  assert.notEqual(createHash("sha256").update(preview).digest("hex"), createHash("sha256").update(readFileSync(new URL("art/frame.webp", appRoot))).digest("hex"));
});

test("Ko‘zgu has complete local font variants and all referenced assets resolve offline", () => {
  const fonts = read(appRoot, "fonts.css");
  for (const family of ["Cormorant Garamond", "Great Vibes"]) assert.ok(fonts.includes(`font-family:"${family}"`));
  for (const weight of [400, 500, 600]) assert.match(fonts, new RegExp(`font-weight:${weight}`));
  assert.match(fonts, /font-style:italic;font-weight:400/);
  assert.match(fonts, /font-style:italic;font-weight:500/);
  for (const [, fontPath] of fonts.matchAll(/url\(["']?([^"')]+)["']?\)/g)) assert.ok(existsSync(new URL(fontPath, appRoot)), `Missing local font ${fontPath}`);
  const references = [
    ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (match) => match[1]),
    ...Array.from(read(appRoot, "template.js").matchAll(/\.src\s*=\s*['"]([^'"]+)['"]/g), (match) => match[1]),
    ...Array.from(read(appRoot, "template.css").matchAll(/url\(["']?([^"')]+)["']?\)/g), (match) => match[1]),
  ].filter((value) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(value));
  for (const assetPath of references) {
    if (assetPath.startsWith("../shared/nikoh/")) assert.ok(existsSync(new URL(assetPath, appRoot)), `Missing shared asset ${assetPath}`);
    else if (assetPath.includes("/")) assert.ok(existsSync(new URL(assetPath, appRoot)), `Missing template asset ${assetPath}`);
  }
  assert.doesNotMatch(html, /fonts\.googleapis\.com|sample-invitation\.js|sample-overrides\.js/);
});

test("Ko‘zgu localizes fixed text and maps the shared invitation fixture for all locales", async () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(read(sharedRoot, "i18n.js"), { window });
  runInNewContext(read(appRoot, "i18n.js"), { window });
  runInNewContext(read(appRoot, "platform-i18n.js"), { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);
  assert.ok(translations["Marxaba · Ko‘zgu"], "document title has localized metadata");
  assert.ok(translations["Ko‘zgu — Marxaba raqamli taklifnomasi"], "description has localized metadata");
  const ignored = new Set(["&", "♫", "◆", "◷", "✓", "✕", "?", "‹", "›", "00", "−", "+", "↗"]);
  const visible = Array.from(body(html).matchAll(/>([^<>]+)</g), (match) => match[1].replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()).filter((value) => value.length > 1 && !ignored.has(value));
  const attributes = Array.from(body(html).matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g), (match) => match[1].replace(/\s+/g, " ").trim());
  assert.deepEqual([...visible, ...attributes].filter((value) => !translations[value]), []);
  for (const key of ["Bug‘ni barmog‘ingiz bilan arting", "Yoki ko‘zguga bir bosing", "Ko‘zguni artib taklifnomani ochish", "Aziz mehmonimiz", "To‘yona ma’lumotlarini ko‘rish"]) assert.ok(translations[key], `Missing translation ${key}`);

  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("kozgu");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  for (const locale of locales) {
    const data = makeLegacyData(sample, locale, "Hurmatli mehmon", true);
    const content = sample.content[locale];
    assert.equal(data.groom, content.people[0], `${locale}: first name`);
    assert.equal(data.bride, content.people[1], `${locale}: second name`);
    assert.equal(data.greeting, content.personalGreeting.replaceAll("{name}", "Hurmatli mehmon"), `${locale}: personalized greeting`);
    assert.equal(data.message, content.message, `${locale}: invitation message`);
    assert.equal(data.hosts, content.hosts, `${locale}: hosts`);
    assert.equal(data.eventType, content.eventLabel, `${locale}: event label`);
    assert.equal(data.date.day, 12, `${locale}: day`);
    assert.equal(data.date.monthNumber, 6, `${locale}: month`);
    assert.equal(data.date.year, 2027, `${locale}: year`);
    assert.equal(data.date.time, "17:00", `${locale}: time`);
    assert.equal(data.venue.name, content.venueName, `${locale}: venue name`);
    assert.equal(data.venue.address, [content.address, content.landmark].filter(Boolean).join(" · "), `${locale}: address and landmark`);
    assert.equal(data.program.length, 6, `${locale}: program length`);
    assert.deepEqual(data.program.map(({ id, time, title }) => [id, time, title]), sample.program.map(({ id, time }) => [id, time, content.programTitles[id] ?? ""]), `${locale}: stable ordered program`);
    assert.equal(data.dressCode.enabled, true, `${locale}: dress code enabled`);
    assert.equal(data.dressCode.style, sample.dressCode.style[locale], `${locale}: dress style`);
    assert.equal(data.dressCode.text, sample.dressCode.text[locale], `${locale}: dress guidance`);
    assert.equal(data.dressCode.note, sample.dressCode.note[locale], `${locale}: dress note`);
    assert.equal(data.gallery.length, 6, `${locale}: empty gallery cards`);
    assert.ok(data.gallery.every(({ src, alt, caption }) => !src && !alt && !caption), `${locale}: icon-only gallery cards`);
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.equal(data.toyona.enabled, true, `${locale}: gift enabled`);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012", `${locale}: gift card`);
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV", `${locale}: gift card holder`);
    assert.equal(data.toyona.note, "", `${locale}: unsupported gift note stays empty`);
    assert.deepEqual(data.contacts.map(({ value }) => value), ["+998 90 123 45 67", "@demo"], `${locale}: phone and Telegram`);
    assert.equal(data.dressCode.colors.length, 5, `${locale}: dress palette`);
    assert.ok(data.dressCode.colors.every((color) => color.name && color.hex), `${locale}: localized palette values`);
  }
});

test("Ko‘zgu hides unsupported gift fields and empty venue photos while retaining coordinate maps", () => {
  const adapter = read(appRoot, "contract-adapter.css");
  assert.match(html, /href="contract-adapter\.css"/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.note"\]:empty/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.bank"\]:empty/);
  assert.match(adapter, /#venue \.venue__photo\.has-missing-photo:not\(\.has-venue-map\)/);
  assert.equal(read(appRoot, "template.css"), read(captureRoot, "template.css"));
  assert.match(html, /data-photo="venue\.photo"/);
  assert.match(read(appRoot, "SOURCE_ADAPTATIONS.md"), /no matching editor\/contract\s+field/);
  assert.match(read(appRoot, "SOURCE_ADAPTATIONS.md"), /shows a map when venue coordinates exist/);
  assert.match(read(appRoot, "SOURCE_ADAPTATIONS.md"), /hides the empty photo frame/);
});

test("Ko‘zgu wrapper uses the shared typed renderer and preserves the source's complete supported sections", () => {
  const renderer = readFileSync(new URL("../apps/web/src/templates/kozgu/renderer.tsx", import.meta.url), "utf8");
  const index = readFileSync(new URL("../apps/web/src/templates/kozgu/index.ts", import.meta.url), "utf8");
  assert.match(renderer, /Invitation, Locale/);
  assert.match(renderer, /<MarxabaInvitation \{\.\.\.props\} templateId="kozgu" \/>/);
  assert.match(index, /KozguInvitation/);
  assert.match(readFileSync(new URL("../apps/web/src/templates/marxaba/renderer.tsx", import.meta.url), "utf8"), /\/templates\/\$\{encodeURIComponent\(templateId\)\}\/index\.html/);
  for (const section of ["hero", "invitation-text", "date", "program", "venue", "dresscode", "gallery", "rsvp", "wishes", "toyona", "contacts", "footer"]) assert.match(html, new RegExp(`data-section="${section}"`));
});

test("Ko‘zgu uses creator values and leaves a blank invitation without preview content", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const blank = createInvitation("kozgu");
  const data = makeLegacyData(blank, "uz-Latn", "", false);
  assert.equal(data.groom, "");
  assert.equal(data.bride, "");
  assert.equal(data.message, "");
  assert.equal(data.venue.name, "");
  assert.equal(data.gallery.length, 0);
  assert.equal(data.program.length, 0);
  assert.equal(data.date.long, "");
  assert.equal(data.dressCode.enabled, false);
  assert.equal(data.dressCode.colors.length, 0);
  assert.deepEqual(data.wishes, []);
  assert.equal(data.toyona.enabled, false);
  assert.equal(data.contacts.length, 0);
});

test("Ko‘zgu is registered as published with matching event support", () => {
  const registry = readFileSync(new URL("../packages/contracts/src/index.ts", import.meta.url), "utf8");
  const registration = registry.match(/id: "kozgu",[\s\S]*?published: (true|false),/);
  assert.equal(registration?.[1], "true");
  const migration = readFileSync(new URL("../packages/database/migrations/0050_publish_kozgu.sql", import.meta.url), "utf8");
  assert.match(migration, /VALUES \('kozgu', 'Ko‘zgu', 15000000, 'UZS', true\)/);
  assert.match(migration, /'kozgu', 'qiz-bazmi'/);
  assert.match(migration, /'kozgu', 'fotiha'/);
  assert.match(migration, /VALUES \('kozgu', 'wedding'\)/);
});
