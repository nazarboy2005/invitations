import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
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

const appRoot = new URL("../apps/web/public/templates/muhr/", import.meta.url);
const captureRoot = new URL("../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/muhr/", import.meta.url);
const sharedRoot = new URL("../apps/web/public/templates/shared/nikoh/", import.meta.url);
const read = (base: URL, file: string) => readFileSync(new URL(file, base), "utf8");
const normalize = (source: string) => source.replace(/\r\n/g, "\n");
const html = read(appRoot, "index.html");
const body = (source: string) => source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";

test("Muhr preserves the captured layout, styles, wax-seal rendering, motion, and art", () => {
  assert.equal(normalize(body(html)), normalize(body(read(captureRoot, "index.html"))));
  assert.equal(read(appRoot, "template.css"), read(captureRoot, "template.css"));
  for (const file of ["template.js", "seal.js", "meta.js", "i18n.js"]) assert.equal(normalize(read(appRoot, file)), normalize(read(captureRoot, file)));
  for (const asset of ["arch.webp", "doves.webp", "envelope.webp", "flap-inside.webp", "scene-far.webp", "scene-front.webp", "scene-mid.webp", "scene-sky.webp"]) {
    assert.deepEqual(readFileSync(new URL(`art/${asset}`, appRoot)), readFileSync(new URL(`art/${asset}`, captureRoot)));
  }
  assert.match(read(appRoot, "seal.js"), /window\.MuhrSeal = \{ render: render \}/);
  assert.match(read(appRoot, "template.js"), /function open\(\)/);
  assert.match(read(appRoot, "template.js"), /prefers-reduced-motion:\s*reduce/);
  assert.match(read(appRoot, "template.css"), /prefers-reduced-motion:\s*reduce/);
  assert.match(html, /id="open-invitation"/);
});

test("Muhr catalog artwork is the exact portrait envelope shown in the opening", () => {
  const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
  assert.equal(digest(readFileSync(new URL("preview.webp", appRoot))), digest(readFileSync(new URL("art/envelope.webp", appRoot))));
  assert.match(read(appRoot, "meta.js"), /preview:\s*"preview\.webp"/);
  assert.match(html, /href="art\/envelope\.webp"/);
});

test("Muhr fonts and assets are local and no captured sample invitation is bundled", () => {
  const fonts = read(appRoot, "fonts.css");
  assert.match(fonts, /font-family:"Cormorant Garamond";font-style:normal;font-weight:400/);
  for (const weight of [400, 500, 600]) assert.match(fonts, new RegExp(`font-weight:${weight}`));
  assert.match(fonts, /font-family:"Marck Script"/);
  for (const [, fontPath] of fonts.matchAll(/url\(["']?([^"')]+)["']?\)/g)) assert.ok(existsSync(new URL(fontPath, appRoot)), `Missing local font ${fontPath}`);
  const paths = [
    ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (match) => match[1]),
    ...Array.from(read(appRoot, "template.js").matchAll(/(?:script\.src|\.src)\s*=\s*['"]([^'"]+)['"]/g), (match) => match[1]),
  ].filter((value) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(value));
  for (const assetPath of paths) {
    if (assetPath.startsWith("../shared/nikoh/")) assert.ok(existsSync(new URL(assetPath, appRoot)), `Missing shared asset ${assetPath}`);
    else if (assetPath.includes("/")) assert.ok(existsSync(new URL(assetPath, appRoot)), `Missing local asset ${assetPath}`);
  }
  assert.doesNotMatch(html, /fonts\.googleapis\.com|sample-invitation\.js|sample-overrides\.js/);
  assert.ok(!existsSync(new URL("sample-invitation.js", appRoot)));
  assert.match(html, /href="platform-adapter\.css"/);
  assert.match(read(appRoot, "platform-adapter.css"), /\.gift__bank:empty\s*\{\s*display:\s*none;\s*\}/);
});

test("Muhr localizes all fixed copy and maps the shared fixture across four locales", async () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(read(sharedRoot, "i18n.js"), { window });
  runInNewContext(read(appRoot, "i18n.js"), { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);
  const ignored = new Set(["&", "♫", "◆", "✓", "✕", "?", "‹", "›", "00", "−", "+", "↗"]);
  const text = Array.from(body(html).matchAll(/>([^<>]+)</g), (match) => match[1].replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()).filter((value) => value.length > 1 && !ignored.has(value));
  const attributes = Array.from(html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g), (match) => match[1].replace(/\s+/g, " ").trim());
  assert.deepEqual([...text, ...attributes].filter((value) => !translations[value]), []);
  for (const key of ["Ochish uchun muhrni bosing", "Aziz mehmonimiz", "Baxtli kun", "Uchrashuv kuni", "Birgalikdagi oqshom", "To‘yona ma’lumotlarini ko‘rish"]) assert.ok(translations[key], `Missing translation ${key}`);

  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("muhr");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  for (const locale of locales) {
    const data = makeLegacyData(sample, locale, "Aziz mehmon", true);
    const content = sample.content[locale];
    assert.equal(data.groom, content.people[0]);
    assert.equal(data.bride, content.people[1]);
    assert.equal(data.greeting, content.personalGreeting.replaceAll("{name}", "Aziz mehmon"));
    assert.equal(data.date.day, 12);
    assert.equal(data.date.monthNumber, 6);
    assert.equal(data.program.length, 6);
    assert.ok(data.program.every((item: { title: string }) => item.title.trim()));
    assert.equal(data.gallery.length, 6);
    assert.equal(data.dressCode.colors.length, 5);
    assert.ok(data.dressCode.style.trim());
    assert.ok(data.dressCode.text.trim());
    assert.ok(data.dressCode.note.trim());
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.equal(data.wishes.length, 3);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.contacts.length, 2);
  }
});

test("Muhr documents the source-only venue and unsupported gift fields", () => {
  const docs = read(appRoot, "SOURCE_ADAPTATIONS.md");
  assert.match(docs, /`venue\.photo`/);
  assert.match(docs, /`toyona\.note`/);
  assert.match(docs, /Keep Muhr unpublished/);
  const contract = readFileSync(new URL("../packages/contracts/src/index.ts", import.meta.url), "utf8");
  const venueSchema = contract.match(/venue:\s*z\.object\(\{([\s\S]*?)\}\)/)?.[1] ?? "";
  assert.doesNotMatch(venueSchema, /photo/);
  const giftSchema = contract.match(/gift:\s*z\.object\(\{([\s\S]*?)\}\)/)?.[1] ?? "";
  assert.doesNotMatch(giftSchema, /note|bank/i);
});

test("Muhr wrapper pins the captured source to the shared typed invitation renderer", () => {
  const renderer = readFileSync(new URL("../apps/web/src/templates/muhr/renderer.tsx", import.meta.url), "utf8");
  const index = readFileSync(new URL("../apps/web/src/templates/muhr/index.ts", import.meta.url), "utf8");
  assert.match(renderer, /Invitation, Locale/);
  assert.match(renderer, /<MarxabaInvitation \{\.\.\.props\} templateId="muhr" \/>/);
  assert.match(index, /MuhrInvitation/);
  assert.match(readFileSync(new URL("../apps/web/src/templates/marxaba/renderer.tsx", import.meta.url), "utf8"), /\/templates\/\$\{encodeURIComponent\(templateId\)\}\/index\.html/);
  for (const section of ["hero", "invitation-text", "date", "program", "venue", "dresscode", "gallery", "rsvp", "wishes", "toyona", "contacts", "footer"]) assert.match(html, new RegExp(`data-section="${section}"`));
});

test("Muhr uses creator values and keeps empty-draft content empty", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const blank = createInvitation("muhr");
  const data = makeLegacyData(blank, "uz-Latn", "", false);
  assert.equal(data.groom, "");
  assert.equal(data.bride, "");
  assert.equal(data.message, "");
  assert.equal(data.venue.name, "");
  assert.equal(data.gallery.length, 0);
  assert.deepEqual(data.wishes, []);
  assert.equal(data.toyona.enabled, false);
  assert.equal(data.contacts.length, 0);
});
