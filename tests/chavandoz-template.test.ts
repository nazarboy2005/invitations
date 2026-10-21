import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { createTemplatePreviewSample, getTemplatePreviewWishes } from "../apps/web/src/modules/catalog/preview-sample";
import { defaultEventLabel, type Locale } from "@taklifnoma/contracts";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => {
  module.exports = {};
};
const moduleRuntime = require("node:module") as {
  _resolveFilename: (...args: any[]) => string;
};
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = path.resolve(process.cwd(), "apps/web/src");
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/")
    ? path.resolve(webSourceRoot, request.slice(2))
    : request;
  return resolveFilename.call(this, resolved, ...args);
};

const root = new URL("../apps/web/public/templates/chavandoz/", import.meta.url);
const reference = path.join(
  process.cwd(),
  "Invitations - this folder will be removed from production",
  "Marxaba",
  "Sunnat to'yi",
  "templates",
  "chavandoz",
);
const read = (name: string) => readFileSync(new URL(name, root), "utf8");
const captured = (name: string) => readFileSync(path.join(reference, name), "utf8");
const html = read("index.html");
const metadata = read("meta.js");
const styles = read("template.css");
const script = read("template.js");
const translations = read("i18n.js");

test("Chavandoz keeps the captured body, styles, metadata, translations, and artwork", () => {
  const sourceBody = captured("index.html").match(/<body>[\s\S]*?<\/body>/)?.[0];
  const packagedBody = html.match(/<body>[\s\S]*?<\/body>/)?.[0];
  assert.ok(sourceBody);
  assert.equal(packagedBody, sourceBody, "the reference body is preserved exactly");
  for (const file of ["template.css", "meta.js", "i18n.js"])
    assert.equal(read(file), captured(file), `${file} remains byte-for-byte source copy`);
  for (const asset of [
    "art/carousel-poster.webp",
    "art/portrait-canopy.webp",
    "art/portrait-horses.webp",
    "art/portrait-stage.webp",
    "art/horse-gallop.svg",
  ]) {
    assert.deepEqual(
      readFileSync(new URL(asset, root)),
      readFileSync(path.join(reference, asset)),
      `${asset} matches the captured source`,
    );
  }
});

test("Chavandoz retains its captured invitation structure, art, and interactions", () => {
  for (const section of ["intro", "hero", "invitation-text", "date", "program", "venue", "dresscode", "gallery", "rsvp", "wishes", "toyona", "contacts", "footer"])
    assert.match(html, new RegExp(`(?:data-section|id)="${section}"`), `${section} remains in the source`);
  for (const asset of ["art/carousel-poster.webp", "art/portrait-canopy.webp", "art/portrait-horses.webp", "art/portrait-stage.webp", "art/horse-gallop.svg"])
    assert.ok(existsSync(new URL(asset, root)), `${asset} is packaged`);
  for (const interaction of ['id="open-invitation"', "data-ics", 'data-list="program"', 'data-list="gallery"', "data-gallery-prev", "data-gallery-next", "data-rsvp", "data-wishes-form", "data-copy=", "data-map="])
    assert.ok(html.includes(interaction), `${interaction} is present`);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(script, /carousel/);
  assert.match(script, /Marhamat\?\.open/);
  assert.match(script, /const tweenIfPresent=\(selector,vars\)=>\{const targets=\$\$\(selector\);if\(targets.length\)gsap\.to\(targets,vars\);\}/);
  assert.match(script, /if\(!targets\.length\)return;gsap\.fromTo\(targets/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(translations, /Открыть приглашение/);
  assert.match(translations, /Open invitation/);
});

test("the source package uses the local platform runtime and excludes captured sample invitations", () => {
  for (const dependency of [
    "../shared/nikoh/base.css",
    "../shared/nikoh/platform-bridge.js",
    "../shared/nikoh/core.js",
    "../shared/nikoh/vendor/gsap.min.js",
    "../shared/nikoh/vendor/ScrollTrigger.min.js",
    "../shared/nikoh/vendor/three/three.bundle.min.js",
  ])
    assert.ok(existsSync(new URL(dependency, root)), `${dependency} exists locally`);
  assert.doesNotMatch(html, /sample-invitation|sample-overrides|fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.equal(existsSync(new URL("sample-overrides.js", root)), false);
  assert.equal(existsSync(new URL("sample-invitation.js", root)), false);
  assert.match(script, /\.\.\/shared\/nikoh\/vendor\/three\/three\.bundle\.min\.js/);
  for (const [, relative] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:https?:|#|data:)/.test(relative)) continue;
    assert.ok(existsSync(new URL(relative, root)), `local dependency ${relative} resolves`);
  }
});

test("Chavandoz packages its metadata preview as an actual portrait WebP render", () => {
  const image = readFileSync(new URL("preview.webp", root));
  assert.equal(image.toString("ascii", 8, 12), "WEBP");
  assert.match(metadata, /slug:\s*"chavandoz"/);
  assert.match(metadata, /preview:\s*"preview\.webp"/);
  assert.match(metadata, /eventTypes:\s*\["sunnat",\s*"tugilgan-kun"\]/);
  assert.match(metadata, /category:\s*"sunnat"/);
  assert.match(read("fonts.css"), /font-family: 'Cormorant SC'/);
  assert.match(read("fonts.css"), /font-family: 'Nunito Sans'/);
  assert.match(read("fonts.css"), /\/\* cyrillic-ext \*\//);
  assert.doesNotMatch(read("fonts.css"), /https?:\/\//);
  for (const [, relative] of read("fonts.css").matchAll(/url\((?:"|')?([^)'"\s]+)(?:"|')?\)/g))
    assert.ok(existsSync(new URL(relative, root)), `font ${relative} resolves locally`);
});

test("the adapter maps contract data and documents source-only fields without inventing creator data", () => {
  const renderer = readFileSync(new URL("../../../src/templates/chavandoz/renderer.tsx", root), "utf8");
  const notes = read("README.md");
  assert.match(renderer, /makeLegacyData/);
  assert.match(renderer, /extras: \{ celebrant: data\.groom \|\| data\.bride \}/);
  assert.match(renderer, /enabledLocales\.map/);
  assert.match(renderer, /\/templates\/chavandoz\/index\.html/);
  for (const gap of ["extras.celebrant", "venue.photo", "toyona.bank", "toyona.note"])
    assert.ok(notes.includes(gap), `${gap} gap is documented`);
  assert.match(notes, /preview-sample\.json/);
  assert.match(notes, /not present anywhere in the local Marxaba capture tree/);
  assert.match(html, /href="contract-adapter\.css"/);
  assert.match(read("contract-adapter.css"), /#toyona \[data-slot="toyona\.note"\]:empty/);
  assert.match(read("contract-adapter.css"), /#toyona \[data-slot="toyona\.bank"\]:empty/);
});

test("Chavandoz maps its sunnat celebration fixture through all four locales", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("chavandoz");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  assert.equal(sample.eventType, "sunnat-toyi");
  assert.deepEqual(sample.enabledLocales, locales);
  assert.equal(sample.program.length, 6);
  assert.deepEqual(sample.program.map(({ time }) => time), [
    "17:30", "18:00", "18:30", "20:00", "21:30", "22:30",
  ]);

  for (const locale of locales) {
    const content = sample.content[locale];
    const data = makeLegacyData(sample, locale, "", true);
    assert.equal(data.groom, content.people[0], `${locale}: celebrant`);
    assert.equal(data.bride, "", `${locale}: single celebrant has no second name`);
    assert.equal(
      data.eventType,
      content.eventLabel || defaultEventLabel(sample.eventType, locale),
      `${locale}: localized event label`,
    );
    assert.equal(data.hosts, content.hosts, `${locale}: hosts`);
    assert.equal(data.greeting, content.greeting, `${locale}: greeting`);
    assert.equal(data.message, content.message, `${locale}: invitation text`);
    assert.equal(data.date.day, 12, `${locale}: date`);
    assert.equal(data.date.time, "17:00", `${locale}: time`);
    assert.equal(data.date.year, 2027, `${locale}: year`);
    assert.equal(data.venue.name, content.venueName, `${locale}: venue`);
    assert.equal(
      data.venue.address,
      [content.address, content.landmark].filter(Boolean).join(" · "),
      `${locale}: address and landmark`,
    );
    assert.deepEqual(
      data.program.map(({ id, title }) => [id, title]),
      sample.program.map((item) => [item.id, content.programTitles[item.id]]),
      `${locale}: stable ordered program entries`,
    );
    assert.equal(data.dressCode.style, sample.dressCode.style[locale]);
    assert.equal(data.dressCode.text, sample.dressCode.text[locale]);
    assert.equal(data.dressCode.note, sample.dressCode.note[locale]);
    assert.deepEqual(
      data.dressCode.colors.map(({ name, hex }) => [name, hex]),
      sample.dressCode.colors.map(({ name, hex }) => [name[locale], hex]),
    );
    assert.equal(data.gallery.length, 6, `${locale}: empty preview gallery cards`);
    assert.ok(data.gallery.every(({ src, alt }) => src === "" && alt === ""));
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.equal(data.wishes.length, 3, `${locale}: sample wishes`);
    assert.equal(data.toyona.enabled, true, `${locale}: gift details`);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV");
    assert.deepEqual(data.contacts.map(({ value }) => value), [
      "+998 90 123 45 67",
      "@demo",
    ]);
  }
});

test("Chavandoz keeps the wishes section connected to the contract and preview fixture", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const template = html.match(/<section[^>]*data-section="wishes"[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(template, "the captured wishes section is present");
  assert.match(template, /<ul[^>]*data-list="wishes"[^>]*>/);
  assert.match(template, /<template>[\s\S]*?data-field="text"[\s\S]*?data-field="name"[\s\S]*?<\/template>/);
  assert.match(template, /<form[^>]*data-wishes-form/);
  assert.match(template, /<p[^>]*data-wishes-feedback/);

  const sourceStyles = read("template.css");
  assert.match(sourceStyles, /\.wishes\{[^}]*display:grid/);
  assert.match(sourceStyles, /\.wishes li\{[^}]*padding:/);
  assert.doesNotMatch(read("contract-adapter.css"), /#wishes|\.wishes/);

  const sample = createTemplatePreviewSample("chavandoz");
  const previewData = makeLegacyData(sample, "uz-Latn", "", true);
  assert.equal(previewData.wishesEnabled, true);
  assert.deepEqual(previewData.wishes, getTemplatePreviewWishes("uz-Latn"));

  const publicData = makeLegacyData(sample, "uz-Latn", "", false);
  assert.equal(publicData.wishesEnabled, true, "authored wishes stay enabled independently of preview examples");
  assert.deepEqual(publicData.wishes, [], "sample guest wishes never enter public invitation data");

  sample.wishes.enabled = false;
  const disabledData = makeLegacyData(sample, "uz-Latn", "", true);
  assert.equal(disabledData.wishesEnabled, false, "the creator toggle controls section visibility");
  assert.deepEqual(disabledData.wishes, getTemplatePreviewWishes("uz-Latn"));
});

test("blank Chavandoz invitations do not receive catalog sample content", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const blank = structuredClone(createTemplatePreviewSample("chavandoz"));
  for (const locale of blank.enabledLocales) {
    const content = blank.content[locale];
    content.people = [];
    content.hosts = "";
    content.greeting = "";
    content.message = "";
    content.programTitles = {};
    content.venueName = "";
    content.address = "";
    content.landmark = "";
    content.personalGreeting = "";
  }
  blank.startsAt = "";
  blank.program = [];
  blank.venue = { name: "", address: "", latitude: null, longitude: null, mapUrl: "" };
  blank.gallery = [];
  blank.dressCode.enabled = false;
  blank.dressCode.colors = [];
  blank.gift.enabled = false;
  blank.gift.cardNumber = "";
  blank.gift.cardHolder = "";
  blank.contacts.phoneNumber = "";
  blank.contacts.telegramUsername = "";
  blank.wishes.enabled = false;

  const data = makeLegacyData(blank, "uz-Latn", "", false);
  assert.equal(data.groom, "");
  assert.equal(data.hosts, "");
  assert.equal(data.greeting, "");
  assert.equal(data.message, "");
  assert.equal(data.date.long, "");
  assert.equal(data.program.length, 0);
  assert.deepEqual(data.gallery, []);
  assert.equal(data.dressCode.enabled, false);
  assert.deepEqual(data.contacts, []);
  assert.deepEqual(data.wishes, []);
  assert.equal(data.toyona.enabled, false);
  assert.equal(data.toyona.cardNumber, "");
});
