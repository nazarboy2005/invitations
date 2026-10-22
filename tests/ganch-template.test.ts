import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
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

const appRoot = new URL("../apps/web/public/templates/ganch/", import.meta.url);
const captureRoot = new URL("../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/ganch/", import.meta.url);
const sharedRoot = new URL("../apps/web/public/templates/shared/nikoh/", import.meta.url);
const read = (base: URL, file: string) => readFileSync(new URL(file, base), "utf8");
const normalize = (source: string) => source.replace(/\r\n/g, "\n");
const html = read(appRoot, "index.html");
const body = (source: string) => source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";

test("Ganch preserves the captured source composition, motion code, styles, metadata and artwork", () => {
  assert.equal(normalize(body(html)), normalize(body(read(captureRoot, "index.html"))));
  assert.match(html, /href="contract-adapter\.css"/);
  const adapter = read(appRoot, "contract-adapter.css");
  assert.match(adapter, /\.venue__photo\.has-missing-photo:not\(\.has-venue-map\)/);
  assert.match(adapter, /\.section--toyona > \[data-slot="toyona\.note"\]:empty/);
  assert.match(adapter, /\.gift__details \[data-slot="toyona\.bank"\]/);
  assert.ok(read(appRoot, "SOURCE_ADAPTATIONS.md").includes("contract-adapter.css"));
  for (const file of ["template.css", "template.js", "scene-motion.js", "meta.js", "i18n.js"]) assert.equal(normalize(read(appRoot, file).replace("preview-browser-capture.jpg", "preview.webp")), normalize(read(captureRoot, file)));
  for (const asset of ["brass-roundel-v2.webp", "court-scene-painted.webp", "ganch-doors-v2.webp"]) assert.deepEqual(readFileSync(new URL(`art/${asset}`, appRoot)), readFileSync(new URL(`art/${asset}`, captureRoot)));
  assert.match(read(appRoot, "template.js"), /prefers-reduced-motion: reduce/);
  assert.match(read(appRoot, "scene-motion.js"), /function/);
  assert.match(body(html), /class="intro__stage"/);
  assert.match(body(html), /id="open-invitation"/);
});

test("Ganch catalog art is a verified canonical browser capture", () => {
  const preview = readFileSync(new URL("preview-browser-capture.jpg", appRoot));
  const provenance = JSON.parse(read(appRoot, "preview.provenance.json"));
  const fixture = readFileSync(new URL("../apps/web/src/modules/catalog/preview-sample.json", import.meta.url));
  assert.equal(preview.subarray(0, 2).toString("hex"), "ffd8");
  assert.equal(provenance.status, "verified");
  assert.equal(provenance.route, "/preview?template=ganch&qaSilent=1");
  assert.equal(provenance.sha256, createHash("sha256").update(preview).digest("hex"));
  assert.equal(provenance.fixtureSha256, createHash("sha256").update(fixture).digest("hex"));
  assert.match(read(appRoot, "meta.js"), /preview-browser-capture\.jpg/);
});

test("Ganch fonts and all HTML, CSS and script assets are local and resolve offline", () => {
  const fonts = read(appRoot, "fonts.css");
  for (const family of ["EB Garamond", "Great Vibes"]) assert.ok(fonts.includes(`font-family:"${family}"`));
  assert.match(fonts, /font-style:italic;font-weight:400/);
  for (const [, fontPath] of fonts.matchAll(/url\(["']?([^"')]+)["']?\)/g)) assert.ok(existsSync(new URL(fontPath, appRoot)), `Missing local font ${fontPath}`);
  const references = [
    ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (match) => match[1]),
    ...Array.from(read(appRoot, "template.js").matchAll(/\.src\s*=\s*["']([^"']+)["']/g), (match) => match[1]),
    ...Array.from(read(appRoot, "template.css").matchAll(/url\(["']?([^"')]+)["']?\)/g), (match) => match[1]),
  ].filter((value) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(value));
  for (const assetPath of references) {
    if (assetPath.startsWith("../shared/nikoh/")) assert.ok(existsSync(new URL(assetPath, appRoot)), `Missing shared dependency ${assetPath}`);
    else if (assetPath.includes("/")) assert.ok(existsSync(new URL(assetPath, appRoot)), `Missing template asset ${assetPath}`);
  }
  assert.doesNotMatch(html, /fonts\.googleapis\.com|sample-invitation\.js|sample-overrides\.js/);
});

test("Ganch translates its fixed copy and accessible labels in English and Russian", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(read(sharedRoot, "i18n.js"), { window });
  runInNewContext(read(appRoot, "i18n.js"), { window });
  runInNewContext(read(appRoot, "platform-i18n.js"), { window });
  const translations = window.MARHAMAT_I18N!;
  const ignored = new Set(["&", "♫", "◆", "◷", "✓", "✕", "?", "‹", "›", "00", "−", "+"]);
  const visible = Array.from(body(html).matchAll(/>([^<>]+)</g), (match) => match[1].replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()).filter((value) => value.length > 1 && !ignored.has(value) && !value.includes("data-"));
  const attributes = Array.from(body(html).matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g), (match) => match[1].replace(/\s+/g, " ").trim());
  assert.deepEqual([...visible, ...attributes].filter((value) => !translations[value]), []);
  for (const [source, russian, english] of [["Dress-kod", "Дресс-код", "Dress code"], ["Baxtli kungacha", "До счастливого дня", "Until our happy day"]]) {
    assert.deepEqual(Array.from(translations[source] ?? []), [russian, english]);
  }
});

test("Ganch renderer delegates to the shared typed adapter and keeps source sections", () => {
  const renderer = readFileSync(new URL("../apps/web/src/templates/ganch/renderer.tsx", import.meta.url), "utf8");
  const index = readFileSync(new URL("../apps/web/src/templates/ganch/index.ts", import.meta.url), "utf8");
  assert.match(renderer, /Invitation, Locale/);
  assert.match(renderer, /<MarxabaInvitation \{\.\.\.props\} templateId="ganch" \/>/);
  assert.match(index, /GanchInvitation/);
  for (const section of ["hero", "invitation-text", "date", "program", "venue", "dresscode", "gallery", "rsvp", "wishes", "toyona", "contacts", "footer"]) assert.match(body(html), new RegExp(`data-section="${section}"`));
});

test("Ganch maps the centralized sample in all locales and empty creator drafts stay empty", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("ganch");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  for (const locale of locales) {
    const data = makeLegacyData(sample, locale, "Hurmatli mehmon", true);
    const content = sample.content[locale];
    assert.equal(data.groom, content.people[0]);
    assert.equal(data.bride, content.people[1]);
    assert.equal(data.greeting, content.personalGreeting.replaceAll("{name}", "Hurmatli mehmon"));
    assert.equal(data.eventType, content.eventLabel);
    assert.equal(data.date.day, 12);
    assert.equal(data.date.monthNumber, 6);
    assert.equal(data.program.length, 6);
    assert.deepEqual(data.program.map((entry) => entry.time), ["17:30", "18:00", "18:30", "20:00", "21:30", "22:30"]);
    assert.ok(data.program.every((entry) => entry.title));
    assert.equal(data.gallery.length, 6);
    assert.ok(data.gallery.every((entry) => entry.src === "" && entry.alt === ""));
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.ok(data.wishes.length === 3 && data.wishes.every((wish) => wish.name && wish.text));
    assert.equal(data.toyona.enabled, true);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV");
    assert.equal(data.toyona.note, "");
    assert.equal("bank" in data.toyona, false);
    assert.equal(data.contacts.length, 2);
    assert.deepEqual(data.contacts.map((contact) => contact.value), ["+998 90 123 45 67", "@demo"]);
    assert.equal(data.dressCode.enabled, true);
    assert.equal(data.dressCode.text, sample.dressCode.text[locale]);
    assert.equal(data.dressCode.colors.length, 5);
  }
  const blank = makeLegacyData(createInvitation("ganch"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.message, "");
  assert.equal(blank.venue.name, "");
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.toyona.note, "");
  assert.equal(blank.contacts.length, 0);
  assert.equal(blank.dressCode.enabled, false);
});


