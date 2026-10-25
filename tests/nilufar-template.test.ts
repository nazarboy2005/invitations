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
require.extensions[".css"] = (module) => {
  module.exports = {};
};
const moduleRuntime = require("node:module") as {
  _resolveFilename: (...args: any[]) => string;
};
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/")
    ? path.resolve(webSourceRoot, request.slice(2))
    : request;
  return resolveFilename.call(this, resolved, ...args);
};

const appRoot = new URL("../apps/web/public/templates/nilufar/", import.meta.url);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/nilufar/",
  import.meta.url,
);
const read = (base: URL, path: string) => readFileSync(new URL(path, base), "utf8");
const normalize = (source: string) => source.replace(/\r\n/g, "\n");
const html = read(appRoot, "index.html");
const body = (source: string) => source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";

test("Nilufar preserves the captured composition, art, styles, and interactive motion", () => {
  const capturedBody = body(read(captureRoot, "index.html")).replace(
    '<span>Fotiha to‘yi</span>',
    '<span data-slot="eventType">Fotiha to‘yi</span>',
  );
  assert.equal(normalize(body(html)), normalize(capturedBody));
  assert.match(body(html), /<span data-slot="eventType">Fotiha to‘yi<\/span>/);
  assert.equal(read(appRoot, "template.css"), read(captureRoot, "template.css"));
  assert.equal(
    normalize(read(appRoot, "template.js")),
    normalize(
      read(captureRoot, "template.js").replace(
        "../../shared/vendor/three/three.bundle.min.js",
        "../shared/nikoh/vendor/three/three.bundle.min.js",
      ),
    ),
    "the source script changes only its shared Three.js asset path",
  );
  for (const file of ["meta.js", "i18n.js"]) {
    assert.equal(normalize(read(appRoot, file)), normalize(read(captureRoot, file)));
  }
  for (const asset of ["poster-pond.webp", "pond-bottom.webp", "lilypad-1.webp", "lilypad-2.webp", "lilypad-3.webp"]) {
    assert.deepEqual(readFileSync(new URL(`art/${asset}`, appRoot)), readFileSync(new URL(`art/${asset}`, captureRoot)));
  }
  assert.match(html, /id="open-invitation"/);
  assert.match(read(appRoot, "template.js"), /function createWaterScene\(\)/);
  assert.match(read(appRoot, "template.js"), /prefers-reduced-motion:\s*reduce/);
  assert.match(read(appRoot, "template.css"), /prefers-reduced-motion:\s*reduce/);
});

test("Nilufar uses the exact portrait opening artwork for its catalog image", () => {
  const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
  const preview = readFileSync(new URL("preview.webp", appRoot));
  const poster = readFileSync(new URL("art/poster-pond.webp", appRoot));
  const sourcePoster = readFileSync(new URL("art/poster-pond.webp", captureRoot));
  const provenance = JSON.parse(read(appRoot, "preview.provenance.json")) as {
    asset: string;
    sourceAsset: string;
    sha256: string;
    width: number;
    height: number;
  };
  assert.equal(digest(preview), digest(poster));
  assert.equal(digest(preview), digest(sourcePoster));
  assert.equal(provenance.asset, "preview.webp");
  assert.equal(provenance.sourceAsset, "art/poster-pond.webp");
  assert.equal(provenance.sha256, digest(preview));
  assert.equal(preview.toString("ascii", 12, 16), "VP8 ");
  const frameHeader = preview.indexOf(Buffer.from([0x9d, 0x01, 0x2a]), 20);
  assert.notEqual(frameHeader, -1, "missing WebP VP8 frame header");
  assert.equal(preview.readUInt16LE(frameHeader + 3) & 0x3fff, provenance.width);
  assert.equal(preview.readUInt16LE(frameHeader + 5) & 0x3fff, provenance.height);
  assert.equal(provenance.width, 1080);
  assert.equal(provenance.height, 1920);
  assert.equal(read(appRoot, "meta.js"), read(captureRoot, "meta.js"));
  assert.match(read(appRoot, "meta.js"), /preview: "preview\.webp"/);
  assert.match(html, /class="pond-poster" src="art\/poster-pond\.webp" width="1080" height="1920"/);
});

test("Nilufar has local fonts and shared runtime references, with no captured sample invitation", () => {
  const fonts = read(appRoot, "fonts.css");
  assert.match(fonts, /font-family:Alice/);
  assert.match(fonts, /font-family:Raleway/);
  assert.match(fonts, /font-weight:300/);
  assert.match(fonts, /font-weight:400/);
  assert.match(fonts, /font-weight:500/);
  for (const [, path] of fonts.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    assert.ok(existsSync(new URL(path, appRoot)), `Missing local font: ${path}`);
  }

  const references = [
    ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (match) => match[1]),
    ...Array.from(read(appRoot, "template.js").matchAll(/script\.src='([^']+)'/g), (match) => match[1]),
  ].filter((path) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(path));
  for (const path of references) {
    if (path.startsWith("../shared/nikoh/")) {
      assert.ok(existsSync(new URL(path, appRoot)), `Missing shared dependency: ${path}`);
    } else if (path.includes("/")) {
      assert.ok(existsSync(new URL(path, appRoot)), `Missing template dependency: ${path}`);
    }
  }

  assert.doesNotMatch(html, /fonts\.googleapis\.com|sample-invitation\.js|sample-overrides\.js/);
  assert.ok(!existsSync(new URL("sample-overrides.js", appRoot)));
  assert.ok(!existsSync(new URL("sample-invitation.js", appRoot)));
});

test("Nilufar hides unsupported empty To'yona bank and note rows", () => {
  const appHead = html.match(/<head>[\s\S]*?<\/head>/)?.[0] ?? "";
  const adapter = read(appRoot, "platform-adapter.css");
  assert.match(appHead, /href="platform-adapter\.css"/);
  assert.match(adapter, /\.section--toyona \[data-slot="toyona\.note"\]:empty/);
  assert.match(adapter, /\.section--toyona \[data-slot="toyona\.bank"\]:empty/);
});

test("Nilufar localizes its visible fixed copy in Russian and English", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(read(new URL("../apps/web/public/templates/shared/nikoh/", import.meta.url), "i18n.js"), { window });
  runInNewContext(read(appRoot, "i18n.js"), { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);
  const ignored = new Set(["&", "♫", "✿", "✧", "↗", "↓", "○", "N · 25 / X", "00"]);
  const textNodes = Array.from(html.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter((text) => text.length > 1 && !ignored.has(text));
  const attributes = Array.from(
    html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  assert.deepEqual([...textNodes, ...attributes].filter((text) => !translations[text]), []);
  for (const key of ["Nilufar · Taklifnoma", "Taklifnomani ochish", "Lahzalar", "Tashrifingizni tasdiqlang", "To‘yona", "Bog‘lanish uchun"]) {
    assert.ok(translations[key], `Missing fixed-copy translation: ${key}`);
  }
});

test("Nilufar maps the shared four-locale invitation fixture to every visible dynamic section", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  assert.match(
    read(new URL("../apps/web/src/templates/marxaba/", import.meta.url), "registry.ts"),
    /"nilufar"/,
    "the existing typed Marxaba dispatcher must recognize Nilufar",
  );
  assert.match(
    read(new URL("../apps/web/src/templates/marxaba/", import.meta.url), "renderer.tsx"),
    /`\/templates\/\$\{encodeURIComponent\(templateId\)\}\/index\.html/,
    "the shared renderer must address the Nilufar package using the typed template ID",
  );
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  const sample = createTemplatePreviewSample("nilufar");
  const slots = [
    "greeting", "groom", "bride", "date.long", "date.time", "eventType", "message",
    "hostsLabel", "hosts", "venue.name", "venue.address", "dressCode.style",
    "dressCode.text", "dressCode.note", "toyona.note", "toyona.cardNumber", "toyona.cardHolder",
  ];
  const lists = ["program", "dresscode", "gallery", "wishes", "contacts"];
  for (const slot of slots) assert.ok(html.includes(`data-slot="${slot}"`), `Missing source slot ${slot}`);
  for (const list of lists) assert.ok(html.includes(`data-list="${list}"`), `Missing source list ${list}`);

  for (const locale of locales) {
    const data = makeLegacyData(sample, locale, "", true);
    const content = sample.content[locale];
    assert.equal(data.groom, content.people[0]);
    assert.equal(data.bride, content.people[1]);
    assert.equal(data.message, content.message);
    assert.equal(data.eventType, content.eventLabel);
    assert.equal(data.venue.name, content.venueName);
    assert.equal(data.venue.address, `${content.address} · ${content.landmark}`);
    assert.equal(data.program.length, 6);
    assert.deepEqual(data.program.map((item) => item.title), Object.values(content.programTitles));
    assert.equal(data.gallery.length, 6);
    assert.ok(data.gallery.every((item) => item.src === "" && item.alt === ""));
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV");
    assert.equal(data.toyona.note, "");
    assert.equal("bank" in data.toyona, false);
    assert.equal(data.contacts[0]?.value, "+998 90 123 45 67");
    assert.equal(data.contacts[1]?.value, "@demo");
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.equal(data.dressCode.colors.length, 5);
  }
});

test("Nilufar uses creator content and does not populate preview examples in a blank invitation", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const blank = createInvitation("nilufar");
  const data = makeLegacyData(blank, "uz-Latn", "", false);
  assert.equal(data.groom, "");
  assert.equal(data.bride, "");
  assert.equal(data.message, "");
  assert.equal(data.venue.name, "");
  assert.equal(data.gallery.length, 0);
  assert.deepEqual(data.wishes, []);
  assert.equal(data.toyona.enabled, false);
  assert.equal(data.toyona.note, "");
  assert.equal("bank" in data.toyona, false);
  assert.equal(data.contacts.length, 0);
});
