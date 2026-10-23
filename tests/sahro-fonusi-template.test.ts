import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { createInvitation, defaultEventLabel, type Locale } from "@taklifnoma/contracts";
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
  assert.match(read(appRoot, "SOURCE_ADAPTATIONS.md"), /preview-capture\.png` preserves the raw screenshot/);
  assert.match(read(appRoot, "template.js"), /function buildThree\(\)/);
  assert.match(read(appRoot, "template.js"), /function beginOpen\(\)/);
  assert.match(read(appRoot, "template.js"), /prefers-reduced-motion:\s*reduce/);
  assert.match(read(appRoot, "template.css"), /prefers-reduced-motion:\s*reduce/);
});

test("Sahro Fonusi catalog artwork is a fixture-rendered portrait opening", () => {
  const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
  const preview = readFileSync(new URL("preview.webp", appRoot));
  const openingArt = readFileSync(new URL("art/desert-panorama.webp", appRoot));
  const fixture = readFileSync(new URL("../apps/web/src/modules/catalog/preview-sample.json", import.meta.url));
  const sourceHtml = read(captureRoot, "index.html");
  const intro = sourceHtml.match(/<section class="intro" id="intro"[\s\S]*?<\/section>/)?.[0];
  assert.ok(intro, "captured source has an opening section");
  for (const selector of [
    "intro__poster",
    "scene-canvas",
    "lantern-fallback",
    "brass-fanous",
    "intro__greeting",
    "intro__names",
    "intro__date",
    "open-invitation",
    "intro__frame--top",
    "intro__frame--bottom",
  ]) assert.ok(intro.includes(selector), `source opening includes ${selector}`);
  const provenance = JSON.parse(read(appRoot, "preview.provenance.json")) as {
    artifact: string;
    artifactSha256: string;
    sourceCapture: string;
    sourceHashes: Record<string, string>;
    fixture: string;
    fixtureSha256: string;
    route: string;
    captureMethod: string;
    captureExcludes: string[];
    browserPageErrors: string[];
    rawCapture: string;
    sourceLayout: {
      sourceArtResolution: string;
      posterBackgroundSize: string;
      posterTransform: string;
      posterBoundsAtCapture: string;
    };
    width: number;
    height: number;
    format: string;
    status: string;
  };
  const capture = readFileSync(new URL(provenance.rawCapture, appRoot));
  const imageDimensions = {
    width: capture.readUInt32BE(16),
    height: capture.readUInt32BE(20),
  };
  assert.notEqual(digest(preview), digest(openingArt), "catalog cover is a renderer capture, not the raw panorama");
  assert.match(read(appRoot, "meta.js"), /preview:\s*"preview\.webp"/);
  assert.match(read(appRoot, "template.css"), /url\('art\/desert-panorama\.webp'\)/);
  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.match(preview.toString("ascii", 12, 16), /^VP8/);
  assert.deepEqual(imageDimensions, { width: 720, height: 1280 });
  assert.equal(provenance.artifact, "preview.webp");
  assert.equal(provenance.artifactSha256, digest(preview));
  assert.equal(provenance.sourceCapture, "Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/sahro-fonusi");
  assert.deepEqual(provenance.sourceHashes, {
    "index.html": digest(readFileSync(new URL("index.html", captureRoot))),
    "template.css": digest(readFileSync(new URL("template.css", captureRoot))),
    "template.js": digest(readFileSync(new URL("template.js", captureRoot))),
    "art/desert-panorama.webp": digest(openingArt),
  });
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.equal(provenance.fixtureSha256, digest(fixture));
  assert.equal(provenance.route, "/preview?template=sahro-fonusi&qaSilent=1");
  assert.match(provenance.captureMethod, /Browser reduced-motion emulation/);
  assert.match(provenance.captureMethod, /translate\(-50%,-50%\).*conflicts with Sahro Fonusi/);
  assert.deepEqual(provenance.sourceLayout, {
    sourceArtResolution: "2560×1440",
    posterBackgroundSize: "auto 100%",
    posterTransform: "scale(1.035)",
    posterBoundsAtCapture: "x -12.6, y -22.4, width 745.2, height 1324.8; intentional 1.035× overscan on 720×1280 viewport",
  });
  assert.deepEqual(provenance.captureExcludes, [
    ".mh-lang injected language control",
    "nextjs-portal development badge host",
  ]);
  assert.deepEqual(provenance.browserPageErrors, []);
  assert.deepEqual([provenance.width, provenance.height], [720, 1280]);
  assert.equal(provenance.format, "image/webp");
  assert.equal(provenance.status, "captured-source-opening");
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
    const content = sample.content[locale];
    assert.equal(mapped.groom, content.people[0], `${locale}: first name`);
    assert.equal(mapped.bride, content.people[1], `${locale}: second name`);
    assert.equal(mapped.greeting, content.greeting, `${locale}: greeting`);
    assert.equal(mapped.message, content.message, `${locale}: invitation message`);
    assert.equal(mapped.hosts, content.hosts, `${locale}: hosts`);
    assert.equal(mapped.eventType, content.eventLabel || defaultEventLabel(sample.eventType, locale), `${locale}: event label`);
    assert.equal(mapped.date.day, 12, `${locale}: date`);
    assert.equal(mapped.date.time, "17:00", `${locale}: event time`);
    assert.equal(mapped.venue.name, content.venueName, `${locale}: venue`);
    assert.equal(mapped.venue.address, [content.address, content.landmark].filter(Boolean).join(" · "), `${locale}: address`);
    assert.equal(mapped.program.length, 6, `${locale}: program length`);
    assert.deepEqual(mapped.program.map(({ id, time, title }) => [id, time, title]), sample.program.map(({ id, time }, index) => [id, time, content.programTitles[id] ?? content.programTitles[String(index)] ?? ""]), `${locale}: stable ordered program fixture`);
    assert.equal(mapped.dressCode.enabled, true, `${locale}: dress code enabled`);
    assert.equal(mapped.dressCode.style, sample.dressCode.style[locale], `${locale}: dress style`);
    assert.equal(mapped.dressCode.text, sample.dressCode.text[locale], `${locale}: dress guidance`);
    assert.equal(mapped.dressCode.note, sample.dressCode.note[locale], `${locale}: dress note`);
    assert.equal(mapped.dressCode.colors.length, 5, `${locale}: palette`);
    assert.ok(mapped.dressCode.colors.every((color) => color.name && color.hex));
    assert.equal(mapped.gallery.length, 6, `${locale}: empty preview gallery cards`);
    assert.ok(mapped.gallery.every(({ src, alt }) => !src && !alt), `${locale}: cards stay icon-only`);
    assert.deepEqual(mapped.wishes, getTemplatePreviewWishes(locale));
    assert.equal(mapped.toyona.enabled, true, `${locale}: gift section`);
    assert.equal(mapped.toyona.cardNumber, "8600 1234 5678 9012", `${locale}: card number`);
    assert.equal(mapped.toyona.cardHolder, "AZIZ AZIZOV", `${locale}: card holder`);
    assert.equal(mapped.toyona.note, "", `${locale}: unsupported gift note remains empty`);
    assert.deepEqual(mapped.contacts.map(({ value }) => value), ["+998 90 123 45 67", "@demo"], `${locale}: phone and Telegram`);
  }
});

test("Sahro Fonusi hides empty unsupported gift fields without changing captured styling", () => {
  const adapter = read(appRoot, "contract-adapter.css");
  assert.match(html, /href="contract-adapter\.css"/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.note"\]:empty/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.bank"\]:empty/);
  assert.equal(read(appRoot, "template.css"), read(captureRoot, "template.css"));
  assert.match(html, /data-photo="venue\.photo"/);
  assert.match(read(appRoot, "SOURCE_ADAPTATIONS.md"), /venue\.photo/);
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
  assert.equal(mapped.date.long, "");
  assert.equal(mapped.program.length, 0);
  assert.equal(mapped.gallery.length, 0);
  assert.equal(mapped.dressCode.enabled, false);
  assert.equal(mapped.dressCode.colors.length, 0);
  assert.deepEqual(mapped.wishes, []);
  assert.equal(mapped.toyona.enabled, false);
  assert.equal(mapped.toyona.cardNumber, "");
  assert.equal(mapped.contacts.length, 0);
});
