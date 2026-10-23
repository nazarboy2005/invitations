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

const templateRoot = new URL("../apps/web/public/templates/suzani/", import.meta.url);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/suzani/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const body = (source: string) => source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
const normalize = (source: string) => source.replace(/\r\n/g, "\n");

test("Suzani exposes a typed renderer entry that fixes the source template ID", () => {
  const renderer = readFileSync(
    new URL("../apps/web/src/templates/suzani/renderer.tsx", import.meta.url),
    "utf8",
  );
  const entry = readFileSync(
    new URL("../apps/web/src/templates/suzani/index.ts", import.meta.url),
    "utf8",
  );
  assert.match(renderer, /ComponentProps<typeof MarxabaInvitation>/);
  assert.match(renderer, /Omit<[\s\S]*"templateId"/);
  assert.match(renderer, /<MarxabaInvitation \{\.\.\.props\} templateId="suzani" \/>/);
  assert.match(entry, /export \{ SuzaniInvitation \} from "\.\/renderer"/);
  assert.doesNotMatch(renderer, /templateId:\s*string/);
});

test("Suzani keeps its original markup, art, styles, and opening animation", () => {
  const original = readFileSync(new URL("index.html", captureRoot), "utf8");
  const sourceBody = body(original);
  const appBody = sourceBody.replace(
    '<canvas class="satin-hatch" aria-hidden="true"></canvas><div class="hero__cloth"',
    '<canvas class="satin-hatch" aria-hidden="true"></canvas><div class="hero__art" aria-hidden="true"></div><div class="hero__cloth"',
  );
  assert.equal(normalize(body(html)), normalize(appBody));
  assert.match(html, /href="contract-adapter\.css"/);
  const adapter = readFileSync(new URL("contract-adapter.css", templateRoot), "utf8");
  assert.match(adapter, /\.hero\s*>\s*\.hero__art\s*\{[^}]*position:\s*absolute;[^}]*z-index:\s*-1;/);
  assert.match(adapter, /\.venue__photo\.has-missing-photo:not\(\.has-venue-map\)/);
  assert.match(adapter, /\.gift__note:empty/);
  assert.match(adapter, /\.gift__details \[data-slot="toyona\.bank"\]/);
  assert.match(adapter, /\.venue__photo\.has-venue-map > span/);
  assert.equal(
    normalize(readFileSync(new URL("template.css", templateRoot), "utf8")),
    normalize(readFileSync(new URL("template.css", captureRoot), "utf8").replace(".hero:before{content:\"\";", ".hero__art{")),
    "template.css changes only the pseudo-element into its equivalent real layer for GSAP",
  );
  assert.equal(
    normalize(readFileSync(new URL("template.js", templateRoot), "utf8")),
    normalize(readFileSync(new URL("template.js", captureRoot), "utf8").replace("gsap.fromTo('.hero:before'", "gsap.fromTo('.hero__art'")),
    "template.js animates the equivalent real hero-art layer instead of an unsupported pseudo-element",
  );
  assert.equal(
    normalize(readFileSync(new URL("meta.js", templateRoot), "utf8")),
    normalize(readFileSync(new URL("meta.js", captureRoot), "utf8")),
    "meta.js should stay identical to the captured source",
  );

  const source = readFileSync(new URL("template.js", templateRoot), "utf8");
  assert.match(source, /prefers-reduced-motion:\s*reduce/);
  const styles = readFileSync(new URL("template.css", templateRoot), "utf8");
  assert.match(styles, /@media\(min-width:700px\)/);
  assert.match(styles, /@media\(max-width:380px\)/);
  assert.match(styles, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(source, /function openFilm\(\)/);
  assert.match(source, /ScrollTrigger/);
  assert.ok(body(html).includes('class="hero__art" aria-hidden="true"'));
  assert.ok(html.includes('id="open-invitation"'));
  assert.ok(!html.includes("fonts.googleapis.com"));
  assert.ok(!html.includes("sample-invitation.js"));
  const adaptations = readFileSync(
    new URL("../apps/web/public/templates/suzani/SOURCE_ADAPTATIONS.md", import.meta.url),
    "utf8",
  );
  for (const sourceFile of ["index.html", "template.css", "template.js"]) {
    assert.ok(adaptations.includes(sourceFile), `Document the Suzani ${sourceFile} adaptation`);
  }
  assert.match(adaptations, /pseudo-element/i);
  assert.match(adaptations, /fonts\.css/);
  assert.match(adaptations, /preview\.webp/);
  for (const asset of ["art/hoop.webp", "art/linen.webp", "art/panel.webp"]) {
    assert.deepEqual(
      readFileSync(new URL(asset, templateRoot)),
      readFileSync(new URL(asset, captureRoot)),
      `${asset} must be an exact copy of the captured artwork`,
    );
  }
  const templateBody = body(html);
  for (const binding of [
    'data-slot="groom"',
    'data-slot="bride"',
    'data-slot="eventType"',
    'data-slot="date.day"',
    'data-slot="date.month"',
    'data-slot="date.year"',
    'data-slot="date.weekday"',
    'data-slot="date.time"',
    'data-slot="venue.name"',
    'data-slot="venue.address"',
    'data-slot="dressCode.style"',
    'data-slot="dressCode.text"',
    'data-slot="dressCode.note"',
    'data-list="program"',
    'data-list="gallery"',
    'data-list="wishes"',
    'data-list="contacts"',
    'data-slot="toyona.cardNumber"',
    'data-slot="toyona.cardHolder"',
    'data-rsvp-choice="yes"',
    'data-rsvp-choice="no"',
    'data-rsvp-choice="maybe"',
  ]) assert.ok(templateBody.includes(binding), `Missing contract binding ${binding}`);
});

test("Suzani packages local fonts and a provenance-checked portrait opening cover", () => {
  const fonts = readFileSync(new URL("fonts.css", templateRoot), "utf8");
  assert.match(fonts, /font-family: 'Cormorant Garamond'/);
  assert.match(fonts, /font-family: 'Manrope'/);
  assert.match(fonts, /font-weight: 500/);
  for (const [, asset] of fonts.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }

  const capture = readFileSync(new URL("preview-capture.png", templateRoot));
  const preview = readFileSync(new URL("preview.webp", templateRoot));
  const meta = readFileSync(new URL("meta.js", templateRoot), "utf8");
  const capturedPreview = new URL("preview.webp", captureRoot);
  const fixture = readFileSync(new URL("../apps/web/src/modules/catalog/preview-sample.json", import.meta.url));
  const captureManifest = readFileSync(new URL("../Invitations - this folder will be removed from production/Marxaba/capture-manifest.json", import.meta.url));
  const provenance = JSON.parse(
    readFileSync(new URL("preview.provenance.json", templateRoot), "utf8"),
  );
  assert.match(meta, /preview:\s*"preview\.webp"/);
  assert.equal(existsSync(capturedPreview), false, "the captured metadata's preview.webp is absent");
  assert.deepEqual([capture.readUInt32BE(16), capture.readUInt32BE(20)], [450, 800]);
  assert.equal(capture.toString("ascii", 1, 4), "PNG");
  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.equal(preview.toString("ascii", 12, 15), "VP8");
  assert.deepEqual([preview.readUInt16LE(26) & 0x3fff, preview.readUInt16LE(28) & 0x3fff], [450, 800]);
  assert.notEqual(
    createHash("sha256").update(preview).digest("hex"),
    createHash("sha256").update(readFileSync(new URL("art/panel.webp", templateRoot))).digest("hex"),
    "Catalog artwork must be the renderer's opening capture, not the later panel artwork",
  );
  assert.equal(provenance.templateId, "suzani");
  assert.equal(provenance.catalogAsset, "preview.webp");
  assert.equal(provenance.source.declaredPreviewPresentInCapture, false);
  assert.equal(provenance.source.providerManifestSearch.manifestsSearched, 13);
  assert.equal(provenance.source.providerManifestSearch.exactSuzaniTemplateSourceCount, 1);
  assert.equal(provenance.source.providerManifestSearch.manifests.find((item: { provider: string }) => item.provider === "Marxaba").exactSuzaniTemplate, true);
  assert.match(captureManifest.toString("utf8"), /Nikoh\/templates\/suzani\/index\.html/);
  assert.equal(provenance.fixture.path, "apps/web/src/modules/catalog/preview-sample.json");
  assert.equal(provenance.fixture.sha256, createHash("sha256").update(fixture).digest("hex"));
  assert.equal(provenance.render.pageSelector, "#intro");
  assert.deepEqual(provenance.render.viewport, { width: 450, height: 800, deviceScaleFactor: 1 });
  assert.deepEqual(provenance.render.crop, { x: 0, y: 0, width: 450, height: 800, scope: "full portrait opening viewport; no interior crop" });
  assert.deepEqual(provenance.render.excluded, [
    ".mh-lang injected language control",
    "nextjs-portal development badge",
    "browser and app chrome",
    "scrollbars",
  ]);
  assert.equal(provenance.artifacts.capture.path, "preview-capture.png");
  assert.equal(provenance.artifacts.capture.width, 450);
  assert.equal(provenance.artifacts.capture.height, 800);
  assert.equal(provenance.artifacts.capture.sha256, createHash("sha256").update(capture).digest("hex"));
  assert.equal(provenance.artifacts.catalog.path, "preview.webp");
  assert.equal(provenance.artifacts.catalog.width, 450);
  assert.equal(provenance.artifacts.catalog.height, 800);
  assert.equal(provenance.artifacts.catalog.sha256, createHash("sha256").update(preview).digest("hex"));
  assert.ok(body(html).includes('id="toyona" data-section="toyona"'));
  assert.ok(body(html).includes('data-slot="toyona.cardNumber"'));
  assert.ok(body(html).includes('data-slot="toyona.cardHolder"'));
  assert.ok(body(html).includes('data-copy="toyona.cardNumber"'));
});

test("Suzani localizes template metadata and gift section copy", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(
    readFileSync(new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url), "utf8"),
    { window },
  );
  runInNewContext(readFileSync(new URL("i18n.js", templateRoot), "utf8"), { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const required = [
    "Suzani · Marxaba",
    "Suzani — Marxaba taklifnomasi",
    "09 · Ezgu niyatlar",
    "To‘yona",
    "To‘yona ma’lumotlarini ko‘rish",
    "Nusxa olish",
  ];
  for (const key of required) assert.ok(translations[key], `Missing translation: ${key}`);
  for (const [key, localized] of Object.entries(translations)) {
    assert.ok(localized.every((value) => typeof value === "string" && value.trim()),
      `Suzani translation must be present in Russian and English: ${key}`);
  }

  const textNodes = Array.from(html.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter(
    (text) =>
      text.length > 1 &&
      !["&", "✿", "✳", "×", "♫", "BUXORO · NURATA · 2026"].includes(text) &&
      !/^№?\s*[\d /·—-]+$/.test(text),
  );
  const attributes = Array.from(
    html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  assert.deepEqual(
    [...textNodes, ...attributes].filter((text) => !translations[text]),
    [],
  );
});

test("Suzani receives the shared localized preview fixture without leaking it into blank invitations", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("suzani");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  for (const locale of locales) {
    const content = sample.content[locale];
    const data = makeLegacyData(sample, locale, "QA Guest", true);
    assert.equal(data.groom, content.people[0]);
    assert.equal(data.bride, content.people[1]);
    assert.equal(data.greeting, content.personalGreeting.replaceAll("{name}", "QA Guest"));
    assert.equal(data.message, content.message);
    assert.equal(data.eventType, content.eventLabel);
    assert.equal(data.hosts, content.hosts);
    assert.ok(data.hostsLabel);
    assert.equal(data.programHeading, content.programHeading);
    assert.ok(data.date.long);
    assert.ok(data.date.weekday);
    assert.equal(data.date.time, "17:00");
    assert.equal(data.venue.name, content.venueName);
    assert.equal(data.venue.address, `${content.address} · ${content.landmark}`);
    assert.equal(data.program.length, 6);
    assert.deepEqual(data.program.map((item) => item.id), Object.keys(content.programTitles));
    assert.deepEqual(data.program.map((item) => item.title), Object.values(content.programTitles));
    assert.equal(data.gallery.length, 6);
    assert.ok(data.gallery.every((item) => item.src === "" && item.alt === ""));
    assert.equal(data.dressCode.enabled, true);
    assert.equal(data.dressCode.style, sample.dressCode.style[locale]);
    assert.equal(data.dressCode.text, sample.dressCode.text[locale]);
    assert.equal(data.dressCode.note, sample.dressCode.note[locale]);
    assert.equal(data.dressCode.colors.length, 5);
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.equal(data.rsvp.enabled, true);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV");
    assert.equal(data.toyona.note, "");
    assert.equal("bank" in data.toyona, false);
    assert.equal("photo" in data.venue, false);
    assert.deepEqual(data.contacts.map((item) => item.value), ["+998 90 123 45 67", "@demo"]);
  }

  const blank = makeLegacyData(createInvitation("suzani"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.message, "");
  assert.equal(blank.venue.name, "");
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.toyona.note, "");
  assert.equal("bank" in blank.toyona, false);
  assert.equal("photo" in blank.venue, false);
  assert.equal(blank.contacts.length, 0);
});
