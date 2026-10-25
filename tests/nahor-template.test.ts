import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createInvitation, templateById, type Locale } from "@taklifnoma/contracts";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => { module.exports = {}; };
const moduleRuntime = require("node:module") as { _resolveFilename: (...args: any[]) => string };
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/") ? path.resolve(webSourceRoot, request.slice(2)) : request;
  return resolveFilename.call(this, resolved, ...args);
};

const root = process.cwd();
const source = path.join(
  root,
  "Invitations - this folder will be removed from production/Marxaba/Osh va iftorlik/templates/nahor",
);
const pkg = path.join(root, "apps/web/public/templates/nahor");
const renderer = path.join(root, "apps/web/src/templates/nahor");
const read = (base: string, name: string) =>
  readFileSync(path.join(base, name), "utf8");
const body = (html: string) =>
  html.match(/<body[\s\S]*?<\/body>/)?.[0].trim().replace(/\r\n/g, "\n") ?? "";

test("Nahor has an isolated typed Osh renderer", () => {
  assert.match(read(renderer, "renderer.tsx"), /templateId="nahor"/);
  assert.match(read(renderer, "renderer.tsx"), /eventType: "osh"/);
  assert.match(read(renderer, "renderer.tsx"), /defaultEventLabel/);
  assert.match(read(renderer, "index.ts"), /NahorInvitation/);
});

test("Nahor is published, osh-compatible, and one-person in the creator", () => {
  const template = templateById("nahor");
  assert.ok(template);
  assert.deepEqual(template.supportedEventTypes, ["osh"]);
  assert.equal(template.published, true);
  const migration = readFileSync(path.join(root, "packages/database/migrations/0043_add_nahor_templates.sql"), "utf8");
  assert.match(migration, /\('nahor', 'Nahor', 15000000, 'UZS', false\)/);
  assert.match(migration, /\('nahor', 'osh'\)/);
  const publication = readFileSync(path.join(root, "packages/database/migrations/0070_publish_nahor.sql"), "utf8");
  assert.match(publication, /published\s*=\s*true/i);
  assert.match(publication, /'nahor', 'osh'/);
  const studio = readFileSync(path.join(root, "apps/web/src/modules/studio/studio.tsx"), "utf8");
  assert.match(studio, /invitation\.templateId === "nahor"/);
  assert.match(studio, /invitation\.templateId === "nahor"\s*\? "Mezbon yoki oila nomi"/);
  assert.match(studio, /invitation\.templateId === "nahor"\s*\? "Masalan, Rahmonovlar oilasi"/);
  assert.match(studio, /const personFields =[\s\S]*?singleCelebrant\s*\? \[""\]\s*:\s*\["", ""\]/);
});

test("Nahor maps the centralized osh fixture into every supported locale", () => {
  const { createTemplatePreviewSample } = require(
    "../apps/web/src/modules/catalog/preview-sample",
  ) as typeof import("../apps/web/src/modules/catalog/preview-sample");
  const sample = createTemplatePreviewSample("nahor");
  const labels = {
    "uz-Latn": "Nahorgi osh",
    "uz-Cyrl": "Наҳорги ош",
    en: "Morning osh",
    ru: "Утренний ош",
  } as const;

  assert.equal(sample.eventType, "osh");
  assert.deepEqual(sample.enabledLocales, ["uz-Latn", "uz-Cyrl", "en", "ru"]);
  assert.equal(sample.startsAt, "2027-06-12T07:00");
  assert.deepEqual(sample.program.map(({ time }) => time), [
    "06:30", "07:00", "08:00", "08:30", "10:00", "11:00",
  ]);
  const sourceHtml = read(pkg, "index.html");
  const sharedRenderer = read(
    path.join(root, "apps/web/src/templates/marxaba"),
    "renderer.tsx",
  );
  assert.match(sourceHtml, /data-slot="extras\.celebrant"/);
  assert.match(sharedRenderer, /extras:\s*\{\s*celebrant:\s*sourceData\.groom\s*\|\|\s*sourceData\.bride/);
  assert.match(sourceHtml, /data-photo="venue\.photo"/);
  assert.match(sourceHtml, /data-slot="toyona\.bank"/);
  assert.match(sourceHtml, /data-slot="toyona\.note"/);
  assert.match(
    read(pkg, "platform-adapter.css"),
    /\.toyona__note:empty[\s\S]*?\[data-slot="toyona\.bank"\]:empty[\s\S]*?display:\s*none/,
  );
  assert.match(read(pkg, "SOURCE_ADAPTATIONS.md"), /bank-name or gift-note field/);

  for (const locale of sample.enabledLocales) {
    const localized = sample.content[locale];
    assert.equal(localized.people.length, 1, `${locale} has one localized celebrant`);
    assert.equal(localized.eventLabel, labels[locale]);
    assert.ok(localized.hosts && localized.message && localized.venueName);
    assert.ok(localized.address && localized.programHeading);
    assert.ok(localized.programTitles[sample.program[0].id]);
    assert.ok(sample.dressCode.style[locale] && sample.dressCode.text[locale]);
    assert.ok(sample.dressCode.note[locale]);
    assert.ok(sample.dressCode.colors.every(({ name }) => name[locale]));
  }
});

test("Nahor maps every visible sample field and keeps blank invitations empty", async () => {
  const { createTemplatePreviewSample, getTemplatePreviewWishes } = await import("../apps/web/src/modules/catalog/preview-sample");
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("nahor");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];

  for (const locale of locales) {
    const content = sample.content[locale];
    const data = makeLegacyData(sample, locale, "", true);
    assert.equal(data.groom, content.people[0], `${locale}: source celebrant`);
    assert.equal(data.bride, "", `${locale}: one source celebrant`);
    assert.equal(data.eventType, content.eventLabel, `${locale}: osh event label`);
    assert.equal(data.greeting, content.greeting, `${locale}: greeting`);
    assert.equal(data.message, content.message, `${locale}: invitation message`);
    assert.equal(data.hosts, content.hosts, `${locale}: hosts`);
    assert.equal(data.date.day, 12, `${locale}: date`);
    assert.equal(data.date.time, "07:00", `${locale}: time`);
    assert.equal(data.date.year, 2027, `${locale}: year`);
    assert.equal(data.venue.name, content.venueName, `${locale}: venue`);
    assert.equal(data.venue.address, [content.address, content.landmark].filter(Boolean).join(" · "), `${locale}: venue address`);
    assert.equal(data.programHeading, content.programHeading, `${locale}: program heading`);
    assert.deepEqual(data.program.map(({ id, time, title }) => [id, time, title]), sample.program.map(({ id, time }) => [id, time, content.programTitles[id]]), `${locale}: ordered program`);
    assert.equal(data.dressCode.enabled, true, `${locale}: clothing enabled`);
    assert.equal(data.dressCode.style, sample.dressCode.style[locale]);
    assert.equal(data.dressCode.text, sample.dressCode.text[locale]);
    assert.equal(data.dressCode.note, sample.dressCode.note[locale]);
    assert.equal(data.dressCode.colors.length, 5);
    assert.ok(data.dressCode.colors.every(({ name, hex }) => name && hex), `${locale}: palette`);
    assert.equal(data.gallery.length, 6, `${locale}: empty gallery cards`);
    assert.ok(data.gallery.every(({ src, alt, caption }) => !src && !alt && !caption), `${locale}: icon-only gallery`);
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.equal(data.wishes.length, 3);
    assert.equal(data.toyona.enabled, true);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV");
    assert.equal(data.toyona.note, "");
    assert.deepEqual(data.contacts.map(({ value }) => value), ["+998 90 123 45 67", "@demo"]);
  }

  const blank = makeLegacyData(createInvitation("nahor"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.message, "");
  assert.equal(blank.date.long, "");
  assert.equal(blank.program.length, 0);
  assert.equal(blank.dressCode.enabled, false);
  assert.equal(blank.dressCode.colors.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.toyona.cardNumber, "");
  assert.deepEqual(blank.contacts, []);
});

test("Nahor retains the captured page, styles, copy, and opening animation", () => {
  assert.equal(body(read(pkg, "index.html")), body(read(source, "index.html")));
  for (const name of ["template.css", "template.js", "i18n.js", "meta.js"])
    assert.deepEqual(readFileSync(path.join(pkg, name)), readFileSync(path.join(source, name)));
  assert.match(read(pkg, "template.js"), /lift the lid/);
  assert.match(read(pkg, "template.js"), /app\.reducedMotion/);
  assert.match(read(pkg, "template.js"), /ScrollTrigger/);
  for (const file of readdirSync(path.join(source, "art")))
    assert.deepEqual(
      readFileSync(path.join(pkg, "art", file)),
      readFileSync(path.join(source, "art", file)),
      `${file} matches captured art`,
    );
});

test("Nahor uses the app runtime and captured animation engines without sample code", () => {
  const html = read(pkg, "index.html");
  assert.match(html, /platform-bridge\.js/);
  assert.match(html, /fonts\.css/);
  assert.match(html, /platform-adapter\.css/);
  assert.doesNotMatch(
    html,
    /sample-invitation|sample-overrides|fonts\.googleapis|fonts\.gstatic|preconnect/,
  );
  const shared = path.join(
    source,
    "../../shared/vendor",
  );
  for (const file of ["gsap.min.js", "ScrollTrigger.min.js", "lz-string.min.js"])
    assert.deepEqual(
      readFileSync(path.join(pkg, "vendor", file)),
      readFileSync(path.join(shared, file)),
      `${file} matches the source dependency`,
    );
  const references = [
    ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (m) => m[1]),
    ...Array.from(read(pkg, "fonts.css").matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g), (m) => m[1]),
    ...Array.from(read(pkg, "template.css").matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g), (m) => m[1]),
  ].filter((ref) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(ref));
  for (const reference of references)
    assert.ok(existsSync(path.resolve(pkg, reference)), `missing local asset ${reference}`);
  const htmlMeta = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  assert.ok(htmlMeta && existsSync(path.resolve(pkg, htmlMeta)), "Open Graph image resolves locally");
});

test("Nahor bundles exact Latin/Cyrillic font faces for each captured family", () => {
  const css = read(pkg, "fonts.css");
  for (const family of ["Lora", "Great Vibes"])
    assert.match(css, new RegExp(`font-family:\\s*'${family}'`));
  for (const subset of ["latin", "latin-ext", "cyrillic", "cyrillic-ext"])
    assert.ok(css.includes(`-${subset}.woff2`), `missing ${subset} subset`);
  assert.doesNotMatch(css, /https?:\/\//);
});

test("Nahor opening artwork is a checksummed portrait capture of the central fixture", () => {
  const image = readFileSync(path.join(pkg, "preview.webp"));
  const capture = readFileSync(path.join(pkg, "preview-capture.png"));
  const provenance = JSON.parse(read(pkg, "preview.provenance.json")) as {
    width: number;
    height: number;
    fixture: string;
    fixtureLocale: string;
    fixtureNames: string[];
    sourceOpening: string;
    captureMethod: string;
    route: string;
    viewport: { width: number; height: number; deviceScaleFactor: number };
    excludedPlatformControl: string;
    fixtureSha256: string;
    capture: {
      artifact: string;
      format: string;
      width: number;
      height: number;
      sha256: string;
    };
    sourceCapture: {
      html: string;
      htmlSha256: string;
      openingArtwork: string;
      openingArtworkSha256: string;
      stylesheet: string;
      stylesheetSha256: string;
    };
    sha256: string;
  };
  const fixture = JSON.parse(
    read(path.join(root, "apps/web/src/modules/catalog"), "preview-sample.json"),
  );
  assert.equal(image.toString("ascii", 0, 4), "RIFF");
  assert.equal(image.toString("ascii", 8, 12), "WEBP");
  assert.deepEqual(
    [image.readUInt16LE(26) & 0x3fff, image.readUInt16LE(28) & 0x3fff],
    [480, 720],
  );
  assert.deepEqual([provenance.width, provenance.height], [480, 720]);
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.equal(provenance.fixtureLocale, fixture.defaultLocale);
  assert.deepEqual(provenance.fixtureNames, fixture.content[fixture.defaultLocale].people);
  assert.equal(
    provenance.sourceOpening,
    "closed Nahor qozon invitation with localized greeting, lid interaction, and dawn artwork",
  );
  assert.equal(provenance.route, "/preview?template=nahor&qaSilent=1&qaReducedMotion=1");
  assert.deepEqual(provenance.viewport, { width: 480, height: 720, deviceScaleFactor: 1 });
  assert.equal(provenance.excludedPlatformControl, ".mh-lang");
  assert.match(provenance.captureMethod, /bundled Playwright/);
  assert.match(provenance.captureMethod, /Capture-only styling hides the injected \.mh-lang/);
  assert.match(provenance.captureMethod, /outer page's <nextjs-portal> host is removed before screenshot/);
  assert.equal(provenance.fixtureSha256, createHash("sha256").update(readFileSync(path.join(root, "tests/fixtures/catalog-preview-2026-10-23.json"))).digest("hex"));
  assert.equal(capture.toString("ascii", 1, 4), "PNG");
  assert.deepEqual([capture.readUInt32BE(16), capture.readUInt32BE(20)], [480, 720]);
  assert.deepEqual(provenance.capture, {
    artifact: "preview-capture.png",
    format: "PNG",
    width: 480,
    height: 720,
    sha256: createHash("sha256").update(capture).digest("hex"),
  });
  assert.equal(provenance.sourceCapture.htmlSha256, createHash("sha256").update(readFileSync(path.join(root, provenance.sourceCapture.html))).digest("hex"));
  assert.equal(provenance.sourceCapture.openingArtworkSha256, createHash("sha256").update(readFileSync(path.join(root, provenance.sourceCapture.openingArtwork))).digest("hex"));
  assert.equal(provenance.sourceCapture.stylesheetSha256, createHash("sha256").update(readFileSync(path.join(root, provenance.sourceCapture.stylesheet))).digest("hex"));
  assert.deepEqual(readFileSync(path.join(source, "template.css")), readFileSync(path.join(pkg, "template.css")));
  assert.deepEqual(readFileSync(path.join(source, "art", "dawn-0.webp")), readFileSync(path.join(pkg, "art", "dawn-0.webp")));
  assert.equal(provenance.sha256, createHash("sha256").update(image).digest("hex"));
});
