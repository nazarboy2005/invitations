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

const appRoot = new URL("../apps/web/public/templates/sahro-fonusi/", import.meta.url);
const captureRoot = new URL("../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/sahro-fonusi/", import.meta.url);
const sharedRoot = new URL("../apps/web/public/templates/shared/nikoh/", import.meta.url);
const read = (base: URL, file: string) => readFileSync(new URL(file, base), "utf8");
const normalize = (source: string) => source.replace(/\r\n/g, "\n");
const html = read(appRoot, "index.html");
const body = (source: string) => source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";

test("Sahro Fonusi keeps its captured source composition, styling, behavior, and art", () => {
  const sourceHtml = read(captureRoot, "index.html");
  assert.equal(normalize(body(html)), normalize(body(sourceHtml)), "captured body markup remains unchanged");
  assert.equal(read(appRoot, "template.css"), read(captureRoot, "template.css"));
  const capturedScript = read(captureRoot, "template.js").replace("../../shared/vendor/three/three.bundle.min.js", "../shared/nikoh/vendor/three/three.bundle.min.js");
  assert.equal(normalize(read(appRoot, "template.js")), normalize(capturedScript));
  for (const file of ["i18n.js", "meta.js"]) assert.equal(normalize(read(appRoot, file)), normalize(read(captureRoot, file)));
  assert.deepEqual(readFileSync(new URL("art/desert-panorama.webp", appRoot)), readFileSync(new URL("art/desert-panorama.webp", captureRoot)));
  assert.match(read(appRoot, "SOURCE_ADAPTATIONS.md"), /removes its sample-invitation script/);
  assert.match(read(appRoot, "SOURCE_ADAPTATIONS.md"), /does not claim a fresh browser capture/);
  assert.match(read(appRoot, "template.js"), /function buildThree\(\)/);
  assert.match(read(appRoot, "template.js"), /function beginOpen\(\)/);
  assert.match(read(appRoot, "template.js"), /prefers-reduced-motion:\s*reduce/);
  assert.match(read(appRoot, "template.css"), /prefers-reduced-motion:\s*reduce/);
});

test("Sahro Fonusi catalog artwork is an actual portrait crop of its opening panorama", () => {
  const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
  const preview = readFileSync(new URL("preview.webp", appRoot));
  const openingArt = readFileSync(new URL("art/desert-panorama.webp", appRoot));
  const provenance = JSON.parse(read(appRoot, "preview.provenance.json")) as {
    artifact: string;
    artifactSha256: string;
    sourceCapture: string;
    sourceArtwork: string;
    sourceArtworkSha256: string;
    width: number;
    height: number;
    format: string;
    status: string;
  };
  assert.notEqual(digest(preview), digest(openingArt), "portrait crop has its own catalog asset");
  assert.match(read(appRoot, "meta.js"), /preview:\s*"preview\.webp"/);
  assert.match(read(appRoot, "template.css"), /url\('art\/desert-panorama\.webp'\)/);
  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.equal(preview.toString("ascii", 12, 16), "VP8 ");
  assert.deepEqual([preview.readUInt16LE(26) & 0x3fff, preview.readUInt16LE(28) & 0x3fff], [540, 960]);
  assert.equal(provenance.artifact, "preview.webp");
  assert.equal(provenance.artifactSha256, digest(preview));
  assert.equal(provenance.sourceCapture, "Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/sahro-fonusi");
  assert.equal(provenance.sourceArtwork, "art/desert-panorama.webp");
  assert.equal(provenance.sourceArtworkSha256, digest(openingArt));
  assert.deepEqual([provenance.width, provenance.height], [540, 960]);
  assert.equal(provenance.format, "image/webp");
  assert.equal(provenance.status, "derived-from-source-opening-artwork");
});

test("Sahro Fonusi has local fonts and resolves every local asset without captured sample data", () => {
  const fonts = read(appRoot, "fonts.css");
  for (const family of ["Amiri", "Manrope"]) assert.match(fonts, new RegExp(`font-family:${family}`));
  for (const weight of [400, 500, 600, 700]) assert.match(fonts, new RegExp(`font-weight:${weight}`));
  for (const [, fontPath] of fonts.matchAll(/url\(["']?([^"')]+)["']?\)/g)) assert.ok(existsSync(new URL(fontPath, appRoot)), `Missing local font: ${fontPath}`);
  const paths = [
    ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (match) => match[1]),
    ...Array.from(read(appRoot, "template.js").matchAll(/script\.src\s*=\s*['"]([^'"]+)['"]/g), (match) => match[1]),
  ].filter((value) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(value));
  for (const assetPath of paths) {
    if (assetPath.startsWith("../shared/nikoh/")) assert.ok(existsSync(new URL(assetPath, appRoot)), `Missing shared asset ${assetPath}`);
    else if (assetPath.includes("/")) assert.ok(existsSync(new URL(assetPath, appRoot)), `Missing local asset ${assetPath}`);
  }
  assert.doesNotMatch(html, /fonts\.googleapis\.com|sample-invitation\.js|sample-overrides\.js/);
  assert.doesNotMatch(read(appRoot, "template.js"), /https?:\/\//);
});

test("Sahro Fonusi localizes fixed interface copy and supports all approved locales", async () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(read(sharedRoot, "i18n.js"), { window });
  runInNewContext(read(appRoot, "i18n.js"), { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);
  const ignored = new Set(["&", "♫", "✧", "↗", "⌄", "‹", "›", "◷", "✦", "00", "−", "+"]);
  const visible = Array.from(html.matchAll(/>([^<>]+)</g), (match) => match[1].replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()).filter((text) => text.length > 1 && !ignored.has(text));
  const attributes = Array.from(html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g), (match) => match[1].replace(/\s+/g, " ").trim());
  const metadata = [
    html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() ?? "",
    ...Array.from(html.matchAll(/<meta (?:name="description"|property="og:title"|property="og:description") content="([^"]+)"/g), (match) => match[1].trim()),
  ];
  assert.deepEqual([...visible, ...attributes, ...metadata].filter((text) => !translations[text]), []);
  assert.deepEqual(Array.from(translations[metadata[0]] ?? []), ["Сахро Фонуси · Приглашение", "Sahro Fonusi · Invitation"]);
  assert.deepEqual(Array.from(translations[metadata[1]] ?? []), ["Сахро Фонуси · приглашение Marxaba", "Sahro Fonusi · Marxaba invitation"]);
  for (const label of ["Taklifnomani ochish", "Lahzalar", "To‘yona", "Bog‘lanish uchun", "Dress-kod", "Tilaklar"]) assert.ok(translations[label], `Missing translation ${label}`);
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("sahro-fonusi");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  for (const locale of locales) {
    const mapped = makeLegacyData(sample, locale, "", true);
    assert.equal(mapped.groom, sample.content[locale].people[0]);
    assert.equal(mapped.bride, sample.content[locale].people[1]);
    assert.equal(mapped.program.length, 6);
    assert.equal(mapped.gallery.length, 6);
    assert.deepEqual(mapped.wishes, getTemplatePreviewWishes(locale));
    assert.equal(mapped.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(mapped.contacts.length, 2);
  }
});

test("Sahro Fonusi renderer pins this template to the shared typed invitation contract", async () => {
  const renderer = readFileSync(new URL("../apps/web/src/templates/sahro-fonusi/renderer.tsx", import.meta.url), "utf8");
  const index = readFileSync(new URL("../apps/web/src/templates/sahro-fonusi/index.ts", import.meta.url), "utf8");
  assert.match(renderer, /Invitation, Locale/);
  assert.match(renderer, /<MarxabaInvitation \{\.\.\.props\} templateId="sahro-fonusi" \/>/);
  assert.match(index, /SahroFonusiInvitation/);
  assert.match(readFileSync(new URL("../apps/web/src/templates/marxaba/renderer.tsx", import.meta.url), "utf8"), /\/templates\/\$\{encodeURIComponent\(templateId\)\}\/index\.html/);
});

test("Sahro Fonusi consumes creator content; blank invitations do not persist preview examples", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const blank = createInvitation("sahro-fonusi");
  const mapped = makeLegacyData(blank, "uz-Latn", "", false);
  assert.equal(mapped.groom, "");
  assert.equal(mapped.bride, "");
  assert.equal(mapped.message, "");
  assert.equal(mapped.venue.name, "");
  assert.equal(mapped.gallery.length, 0);
  assert.deepEqual(mapped.wishes, []);
  assert.equal(mapped.toyona.enabled, false);
  assert.equal(mapped.contacts.length, 0);
});
