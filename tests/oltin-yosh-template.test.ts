import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";
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

const root = new URL(
  "../apps/web/public/templates/oltin-yosh/",
  import.meta.url,
);
const reference = path.join(
  process.cwd(),
  "Invitations - this folder will be removed from production",
  "Marxaba",
  "Tug'ilgan kun va Yubiley",
  "templates",
  "oltin-yosh",
);
const read = (name: string) => readFileSync(new URL(name, root), "utf8");
const html = read("index.html");
const metadata = read("meta.js");
const styles = read("template.css");
const script = read("template.js");

test("Oltin Yosh retains its captured sections, controls, and responsive motion", () => {
  const capturedHtml = readFileSync(path.join(reference, "index.html"), "utf8");
  assert.equal(
    html.slice(html.indexOf("<body>")),
    capturedHtml.slice(capturedHtml.indexOf("<body>")),
  );
  assert.equal(
    styles,
    readFileSync(path.join(reference, "template.css"), "utf8"),
  );
  const packagedI18n = read("i18n.js");
  const capturedI18n = readFileSync(path.join(reference, "i18n.js"), "utf8");
  for (const line of capturedI18n.trimEnd().split("\n").slice(1, -1))
    assert.ok(
      packagedI18n.includes(line),
      `captured translation is retained: ${line}`,
    );
  assert.match(
    packagedI18n,
    /"Oltin Yosh · Marxaba": \["Золотой возраст · Marxaba", "Golden Years · Marxaba"\]/,
  );
  assert.match(
    packagedI18n,
    /"Oltin Yosh — shaxsiy bayram taklifnomasi": \["Золотой возраст — персональное приглашение на праздник", "Golden Years — a personal celebration invitation"\]/,
  );
  assert.match(
    packagedI18n,
    /"Yorqin yosh\. Oltin oqshom\.": \["Яркий возраст\. Золотой вечер\.", "Golden years\. A golden evening\."\]/,
  );
  assert.equal(metadata, readFileSync(path.join(reference, "meta.js"), "utf8"));
  for (const section of [
    "intro",
    "hero",
    "invitation-text",
    "date",
    "program",
    "venue",
    "dresscode",
    "gallery",
    "rsvp",
    "wishes",
    "toyona",
    "contacts",
    "footer",
  ])
    assert.match(
      html,
      new RegExp(`(?:data-section|id)="${section}"`),
      `${section} remains in the source`,
    );
  for (const control of [
    'id="open-invitation"',
    "data-calendar",
    "data-countdown",
    "data-ics",
    'data-list="program"',
    'data-list="gallery"',
    "data-gallery-prev",
    "data-gallery-next",
    "data-rsvp",
    "data-wishes-form",
    "data-copy=",
    "data-map=",
    "data-music-toggle",
  ])
    assert.ok(html.includes(control), `${control} remains in the source`);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(script, /three\.bundle\.min\.js/);
  assert.match(script, /if\(!age\)return;/);
  assert.doesNotMatch(script, /extras\?\.age\|\|'30'/);
  assert.match(script, /function fitLongNames\(\)/);
  assert.match(script, /value\.length>20/);
  assert.match(script, /MutationObserver\(fitLongNames\)/);
});

test("all packaged references resolve locally and reference sample runtimes remain excluded", () => {
  for (const dependency of [
    "../shared/nikoh/base.css",
    "../shared/nikoh/platform-bridge.js",
    "../shared/nikoh/core.js",
    "../shared/nikoh/vendor/gsap.min.js",
    "../shared/nikoh/vendor/ScrollTrigger.min.js",
    "../shared/nikoh/vendor/three/three.bundle.min.js",
    "fonts.css",
    "fonts/inter-cyrillic-ext.woff2",
    "fonts/inter-cyrillic.woff2",
    "fonts/inter-latin-ext.woff2",
    "fonts/inter-latin.woff2",
    "fonts/syne-latin-ext.woff2",
    "fonts/syne-latin.woff2",
    "art/room-backdrop.webp",
    "art/foil-30.webp",
    "art/digits/foil-digit-0.webp",
    "art/digits/foil-digit-3.webp",
    "preview.webp",
    "gallery-accessibility.js",
  ])
    assert.ok(existsSync(new URL(dependency, root)), `${dependency} exists`);
  assert.doesNotMatch(
    html,
    /sample-invitation|sample-overrides|fonts\.googleapis\.com|fonts\.gstatic\.com/,
  );
  assert.equal(existsSync(new URL("sample-overrides.js", root)), false);
  assert.equal(existsSync(new URL("sample-invitation.js", root)), false);
  for (const [, relative] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:https?:|#|data:)/.test(relative)) continue;
    assert.ok(
      existsSync(new URL(relative, root)),
      `local dependency ${relative} resolves`,
    );
  }
  for (const [, relative] of read("fonts.css").matchAll(
    /url\(["']?([^)'"\s]+)["']?\)/g,
  ))
    assert.ok(
      existsSync(new URL(relative, root)),
      `local font ${relative} resolves`,
    );
  assert.doesNotMatch(read("fonts.css"), /https?:\/\//);
});

test("the metadata-named preview is an authentic portrait WebP capture", () => {
  const preview = readFileSync(new URL("preview.webp", root));
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  const webpChunk = preview.toString("ascii", 12, 16);
  assert.ok(["VP8 ", "VP8X"].includes(webpChunk));
  const width = webpChunk === "VP8X"
    ? 1 + preview.readUIntLE(24, 3)
    : preview.readUInt16LE(26) & 0x3fff;
  const height = webpChunk === "VP8X"
    ? 1 + preview.readUIntLE(27, 3)
    : preview.readUInt16LE(28) & 0x3fff;
  assert.equal(width, 450);
  assert.equal(height, 800);
  assert.equal(
    createHash("sha256").update(preview).digest("hex"),
    "63b3f6c0571a7f00e69634ba976df8ae4dd1947217e4fcef2c3384611ddecf4f",
  );
  const provenance = JSON.parse(read("preview.provenance.json"));
  assert.equal(provenance.output.sha256, "63b3f6c0571a7f00e69634ba976df8ae4dd1947217e4fcef2c3384611ddecf4f");
  assert.equal(provenance.output.width, 450);
  assert.equal(provenance.output.height, 800);
  assert.equal(provenance.fixture.sha256, "54017a292d4a5235593d93a5e2f8bca1fe3bab89433182fac912c5d948878871");
  assert.equal(provenance.capture.browserChromeExcluded, true);
  assert.equal(provenance.capture.localeSelectorExcluded, true);
  assert.match(metadata, /slug:\s*"oltin-yosh"/);
  assert.match(metadata, /preview:\s*"preview\.webp"/);
  assert.match(metadata, /category:\s*"tugilgan-kun"/);
  assert.match(metadata, /eventTypes:\s*\["tugilgan-kun",\s*"yubiley"\]/);
});

test("fixed invitation copy and accessible labels are localized for Russian and English", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  const shared = readFileSync(
    new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url),
    "utf8",
  );
  runInNewContext(shared, { window });
  runInNewContext(read("i18n.js"), { window });
  const translations = window.MARHAMAT_I18N!;
  const body = html.slice(html.indexOf("<body>"));
  const ignored = new Set(["00", "&", "↗", "30"]);
  const visible = Array.from(body.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter((value) => value.length > 1 && !ignored.has(value));
  const attributes = Array.from(
    body.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  assert.deepEqual([...visible, ...attributes].filter((value) => !translations[value]), []);
  assert.deepEqual(Array.from(translations["Tug‘ilgan kun taqvimi"]), ["Календарь дня рождения", "Birthday calendar"]);
});

test("the four-locale preview uses only the centralized fixture and blank invitations stay blank", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("oltin-yosh");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  for (const locale of locales) {
    const data = makeLegacyData(sample, locale, "Hurmatli mehmon", true);
    const content = sample.content[locale];
    assert.equal(data.groom, content.people[0], `${locale}: celebrant`);
    assert.equal(data.bride, "", `${locale}: no second celebrant`);
    assert.equal(data.eventType, content.eventLabel, `${locale}: event label`);
    assert.equal(data.greeting, content.personalGreeting.replaceAll("{name}", "Hurmatli mehmon"), `${locale}: personalized greeting`);
    assert.equal(data.message, content.message, `${locale}: invitation message`);
    assert.equal(data.hosts, content.hosts, `${locale}: hosts`);
    assert.equal(data.date.day, 12, `${locale}: date`);
    assert.equal(data.date.monthNumber, 6, `${locale}: month`);
    assert.equal(data.date.year, 2027, `${locale}: year`);
    assert.equal(data.date.time, "17:00", `${locale}: time`);
    assert.equal(data.venue.name, content.venueName, `${locale}: venue name`);
    assert.equal(data.venue.address, [content.address, content.landmark].filter(Boolean).join(" · "), `${locale}: address`);
    assert.deepEqual(data.program.map(({ id, time, title }) => [id, time, title]), sample.program.map(({ id, time }) => [id, time, content.programTitles[id] ?? ""]), `${locale}: ordered program`);
    assert.equal(data.dressCode.enabled, true, `${locale}: clothing enabled`);
    assert.equal(data.dressCode.style, sample.dressCode.style[locale], `${locale}: clothing style`);
    assert.equal(data.dressCode.text, sample.dressCode.text[locale], `${locale}: clothing guidance`);
    assert.equal(data.dressCode.note, sample.dressCode.note[locale], `${locale}: clothing note`);
    assert.equal(data.dressCode.colors.length, 5, `${locale}: palette`);
    assert.ok(data.dressCode.colors.every((color) => color.name && color.hex), `${locale}: localized palette`);
    assert.equal(data.gallery.length, 6, `${locale}: empty gallery cards`);
    assert.ok(data.gallery.every(({ src, alt, caption }) => !src && !alt && !caption), `${locale}: icon-only gallery cards`);
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.equal(data.toyona.enabled, true, `${locale}: To‘yona enabled`);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012", `${locale}: card number`);
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV", `${locale}: card holder`);
    assert.equal(data.toyona.note, "", `${locale}: unsupported gift note remains empty`);
    assert.deepEqual(data.contacts.map(({ value }) => value), ["+998 90 123 45 67", "@demo"], `${locale}: phone and Telegram`);
  }
  const blank = makeLegacyData(createInvitation("oltin-yosh"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.greeting, "");
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.dressCode.enabled, false);
  assert.equal(blank.dressCode.colors.length, 0);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.toyona.cardNumber, "");
  assert.equal(blank.contacts.length, 0);
});

test("unsupported optional source-only slots are hidden by the scoped contract adapter", () => {
  const adapter = read("contract-adapter.css");
  assert.match(html, /href="contract-adapter\.css"/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.note"\]:empty/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.bank"\]:empty/);
  assert.match(adapter, /\[data-slot="extras\.age"\]:empty/);
  assert.match(adapter, /\.intro__copy\.platform-name-fit--long/);
  assert.match(adapter, /\.intro__name\.platform-name-fit--long/);
  assert.match(adapter, /\.hero__name\.platform-name-fit--long/);
  assert.match(styles, /\.intro__age\{display:none\}/);
  assert.match(read("../../../src/templates/oltin-yosh/README.md"), /contract-adapter\.css/);
});

test("empty Lahzalar cards keep icon-only visuals but receive localized accessible names", () => {
  assert.match(html, /<script src="gallery-accessibility\.js" defer><\/script>/);
  const scriptText = read("gallery-accessibility.js");
  const emptyItem = {
    attributes: {} as Record<string, string>,
    getAttribute(name: string) { return this.attributes[name] ?? null; },
    setAttribute(name: string, value: string) { this.attributes[name] = value; },
  };
  const authoredItem = {
    attributes: { "aria-label": "Javohir va Madina — birinchi surat" } as Record<string, string>,
    getAttribute(name: string) { return this.attributes[name as "aria-label"] ?? null; },
    setAttribute(name: string, value: string) { this.attributes[name as "aria-label"] = value; },
  };
  const gallery = { querySelectorAll: () => [emptyItem, authoredItem] };
  const window: any = {
    Marhamat: { lang: "uz-Latn", on() {} },
    addEventListener() {},
    MutationObserver: class { observe() {} },
  };
  const document: any = {
    documentElement: { dataset: { lang: "uz-Latn" } },
    querySelector: () => gallery,
  };
  runInNewContext(scriptText, { window, document });
  const adapter = window.OltinYoshGalleryAccessibility;
  const expected: Record<string, string> = {
    "uz-Latn": "Bayram surati 1",
    "uz-Cyrl": "Байрам сурати 1",
    en: "Celebration photo 1",
    ru: "Фото с праздника 1",
  };
  for (const [locale, accessibleName] of Object.entries(expected)) {
    window.Marhamat.lang = locale;
    adapter.decorate(gallery);
    assert.equal(emptyItem.attributes["aria-label"], accessibleName, locale);
    assert.equal(authoredItem.attributes["aria-label"], "Javohir va Madina — birinchi surat", "creator alt text is preserved");
  }
  assert.equal(adapter.label("unsupported", 1), "Bayram surati 2");
});

test("the narrow adapter maps the first celebrant and source-only fields are documented", () => {
  const renderer = read("../../../src/templates/oltin-yosh/renderer.tsx");
  const notes = read("../../../src/templates/oltin-yosh/README.md");
  assert.match(notes, /centralized birthday preview fixture/i);
  assert.match(notes, /450×800 \/ DPR 1/);
  assert.match(notes, /preview\.provenance\.json/);
  assert.match(renderer, /MarxabaInvitation/);
  assert.match(renderer, /templateId="oltin-yosh"/);
  assert.match(
    notes,
    /preview-sample\.json|centralized birthday preview fixture/,
  );
  for (const gap of ["extras.age", "venue.photo", "toyona.bank", "toyona.note"])
    assert.ok(notes.includes(gap), `${gap} is documented`);
  assert.match(notes, /birthday.*yubiley/s);
  assert.match(notes, /published at 150,000 UZS/i);
  const migration = readFileSync(
    new URL("../packages/database/migrations/0069_publish_oltin_yosh.sql", import.meta.url),
    "utf8",
  );
  assert.match(migration, /published\s*=\s*TRUE/i);
  assert.match(migration, /'oltin-yosh', 'birthday'/);
  assert.match(migration, /'oltin-yosh', 'yubiley'/);
});
