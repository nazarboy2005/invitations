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

test("Suzani packages local fonts and the real portrait artwork", () => {
  const fonts = readFileSync(new URL("fonts.css", templateRoot), "utf8");
  assert.match(fonts, /font-family: 'Cormorant Garamond'/);
  assert.match(fonts, /font-family: 'Manrope'/);
  assert.match(fonts, /font-weight: 500/);
  for (const [, asset] of fonts.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }

  const panel = readFileSync(new URL("art/panel.webp", templateRoot));
  const preview = readFileSync(new URL("preview.webp", templateRoot));
  const provenance = JSON.parse(
    readFileSync(new URL("preview.provenance.json", templateRoot), "utf8"),
  ) as { asset: string; sourceAsset: string; sha256: string; width: number; height: number };
  assert.equal(
    createHash("sha256").update(preview).digest("hex"),
    createHash("sha256").update(panel).digest("hex"),
    "Catalog artwork must use the original full-page portrait panel asset",
  );
  assert.equal(provenance.asset, "preview.webp");
  assert.equal(provenance.sourceAsset, "art/panel.webp");
  assert.equal(provenance.sha256, createHash("sha256").update(preview).digest("hex"));
  assert.equal(provenance.width, 640);
  assert.equal(provenance.height, 1138);
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
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
