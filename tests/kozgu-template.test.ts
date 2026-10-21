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

test("Ko‘zgu catalog artwork is a portrait image of the source opening state", () => {
  const preview = readFileSync(new URL("preview.webp", appRoot));
  assert.ok(preview.length > 20_000, "rendered opening artwork should be a real image, not an icon placeholder");
  assert.match(read(appRoot, "meta.js"), /preview:\s*"preview\.webp"/);
  assert.equal(createHash("sha256").update(preview).digest("hex"), "8a7d72e4b610c6e54fb8411e71c12303e1fed9632fe2bf5317950d6b826d109f");
  assert.equal(preview.toString("ascii", 12, 16), "VP8 ");
  assert.equal(preview.readUInt16LE(26) & 0x3fff, 480);
  assert.equal(preview.readUInt16LE(28) & 0x3fff, 900);
  assert.match(read(captureRoot, "meta.js"), /preview:\s*"preview\.webp"/);
  assert.equal(existsSync(new URL("preview.webp", captureRoot)), false, "the reference metadata names an absent source preview asset");
  assert.match(read(appRoot, "SOURCE_ADAPTATIONS.md"), /no retained source\s+preview file or browser-capture record/i);
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
    assert.equal(data.groom, content.people[0]);
    assert.equal(data.bride, content.people[1]);
    assert.equal(data.greeting, content.personalGreeting.replaceAll("{name}", "Hurmatli mehmon"));
    assert.equal(data.eventType, content.eventLabel);
    assert.equal(data.date.day, 12);
    assert.equal(data.date.monthNumber, 6);
    assert.equal(data.program.length, 6);
    assert.equal(data.gallery.length, 6);
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.contacts.length, 2);
    assert.equal(data.dressCode.colors.length, 5);
  }
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
  assert.deepEqual(data.wishes, []);
  assert.equal(data.toyona.enabled, false);
  assert.equal(data.contacts.length, 0);
});
