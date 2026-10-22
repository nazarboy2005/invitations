import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { createInvitation } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
} from "../apps/web/src/modules/catalog/preview-sample";

const root = new URL("../apps/web/public/templates/hilol/", import.meta.url);
const reference = path.join(
  process.cwd(),
  "Invitations - this folder will be removed from production",
  "Marxaba",
  "Osh va iftorlik",
  "templates",
  "hilol",
);
const read = (name: string) => readFileSync(new URL(name, root), "utf8");
const html = read("index.html");
const metadata = read("meta.js");
const styles = read("template.css");
const script = read("template.js");
const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => {
  module.exports = {};
};
const moduleRuntime = require("node:module") as {
  _resolveFilename: (...args: any[]) => string;
};
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(
  new URL("../apps/web/src/", import.meta.url),
);
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/")
    ? path.resolve(webSourceRoot, request.slice(2))
    : request;
  return resolveFilename.call(this, resolved, ...args);
};

const captured = (name: string) =>
  readFileSync(path.join(reference, name), "utf8");

test("Hilol preserves the captured body, CSS, metadata, interactions, and translation strings", () => {
  assert.equal(
    html.slice(html.indexOf("<body>")),
    captured("index.html").slice(captured("index.html").indexOf("<body>")),
  );
  assert.equal(styles, captured("template.css"));
  assert.equal(metadata, captured("meta.js"));
  const originalI18n = captured("i18n.js");
  const packagedI18n = read("i18n.js");
  const sampleDataKeys = new Set([
    "Sokin ranglar",
    "Kamtarona va qulay libos",
    "Kamtarona libos",
    "Oltin rangli girih naqshlari",
    "Shom paytidagi sokin shahar silueti",
    "Qum",
    "Oq",
    "Zaytun",
    "Ko‘kimtir",
    "Ramazon iftorligi",
    "Iftorlik",
    "Hurmat bilan",
    "Iftor",
    "Shom namozi",
    "Suhbat va duo",
    "Sizni iftor dasturxonimizga taklif etamiz.",
    "Yusupovlar oilasi",
    "Yusupovlar xonadoni",
    "Ezgu duolaringiz biz uchun eng katta tuhfa.",
    "Yengil, ozoda va o‘zingizga qulay kiyim tanlang. Bu samimiy oqshomda sokin ranglar va kamtarona uslub ayni muddao.",
    "Bosh kiyim va ibodat uchun qulay kiyim xohishga ko‘ra.",
    "Xonadon",
    "Ushbu muborak oqshomga xush kelibsiz.",
    "Ramazon oyining fayzli oqshomida iftor dasturxonimizga taklif etamiz. Bir piyola suv, bir dona xurmo va samimiy suhbat atrofida siz bilan diydor ko‘rishishdan mamnun bo‘lamiz.",
    "Sizni kutamiz.",
  ]);
  for (const line of originalI18n.trimEnd().split("\n").slice(1, -1)) {
    const key = line.match(/^\s*"([^"]+)":/)?.[1];
    if (key && !sampleDataKeys.has(key))
      assert.ok(
        packagedI18n.includes(line),
        `captured translation remains: ${line}`,
      );
  }
  const packagedKeys = new Set(
    packagedI18n
      .split("\n")
      .map((line) => line.match(/^\s*"([^"]+)":/)?.[1])
      .filter(Boolean),
  );
  for (const key of sampleDataKeys)
    assert.ok(
      !packagedKeys.has(key),
      `sample data translation removed: ${key}`,
    );
  assert.match(
    packagedI18n,
    /"Hilol · Taklifnoma": \["Хилол · Приглашение", "Hilol · Invitation"\]/,
  );
  assert.match(
    packagedI18n,
    /"Hilol · Marxaba taklifnomasi": \["Хилол · приглашение Marxaba", "Hilol · a Marxaba invitation"\]/,
  );
  const expectedScript = captured("template.js")
    .replace(
      "../../shared/vendor/three/three.bundle.min.js",
      "../shared/nikoh/vendor/three/three.bundle.min.js",
    )
    .replace(
      "timeZone: 'Asia/Tashkent'",
      "timeZone: window.Marhamat?.data?.timezone || 'Asia/Tashkent'",
    )
    .replace(
      "    const tl = gsap.timeline({ onComplete: finishOpen });",
      "    const openingStarScale = { value: star?.scale?.x ?? .02 };\n    const tl = gsap.timeline({ onComplete: finishOpen });",
    )
    .replace(
      ".to(star?.scale || {}, { x: .84, y: .84, z: .84, duration: duration, ease: 'power3.inOut' }, 0)",
      ".to(openingStarScale, { value: .84, duration: duration, ease: 'power3.inOut', onUpdate: () => star?.scale?.setScalar(openingStarScale.value) }, 0)",
    )
    .replace(
      "if (window.gsap && !reduced()) gsap.to(star.scale, { x: .68, y: .68, z: .68, duration: 1.9, delay: .12, ease: 'expo.out' });",
      "if (window.gsap && !reduced()) { const starScale = { value: star.scale.x }; gsap.to(starScale, { value: .68, duration: 1.9, delay: .12, ease: 'expo.out', onUpdate: () => star?.scale?.setScalar(starScale.value) }); }",
    );
  assert.equal(script, expectedScript);
  assert.doesNotMatch(script, /\.to\(star\?\.scale|gsap\.to\(star\.scale/);
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
});

test("all packaged references resolve locally without Marxaba sample/runtime code", () => {
  for (const dependency of [
    "../shared/nikoh/base.css",
    "../shared/nikoh/platform-bridge.js",
    "../shared/nikoh/core.js",
    "../shared/nikoh/vendor/gsap.min.js",
    "../shared/nikoh/vendor/ScrollTrigger.min.js",
    "../shared/nikoh/vendor/three/three.bundle.min.js",
    "fonts.css",
    "fonts/amiri-latin-400.woff2",
    "fonts/amiri-latinext-400.woff2",
    "fonts/amiri-latin-700.woff2",
    "fonts/amiri-latinext-700.woff2",
    "fonts/manrope-cyr-ext.woff2",
    "fonts/manrope-cyr.woff2",
    "fonts/manrope-latin-ext.woff2",
    "fonts/manrope-latin.woff2",
    "art/city-silhouette.svg",
    "art/girih-tile.svg",
    "art/still-life.svg",
    "preview.webp",
    "contract-adapter.css",
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
  assert.match(html, /href="contract-adapter\.css"/);
});

test("the metadata-named artwork is an authentic portrait WebP browser capture", () => {
  const preview = readFileSync(new URL("preview.webp", root));
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  const chunk = preview.toString("ascii", 12, 16);
  const dimensions =
    chunk === "VP8X"
      ? [1 + preview.readUIntLE(24, 3), 1 + preview.readUIntLE(27, 3)]
      : [preview.readUInt16LE(26) & 0x3fff, preview.readUInt16LE(28) & 0x3fff];
  assert.deepEqual(dimensions, [450, 800]);
  assert.match(metadata, /slug:\s*"hilol"/);
  assert.match(metadata, /preview:\s*"preview\.webp"/);
  assert.match(metadata, /category:\s*"iftorlik"/);
  assert.match(metadata, /eventTypes:\s*\["iftorlik",\s*"osh"\]/);
});

test("the adapter remains narrow and documents source-only integration gaps", () => {
  const renderer = read("../../../src/templates/hilol/renderer.tsx");
  const notes = read("../../../src/templates/hilol/README.md");
  const adapter = read("contract-adapter.css");
  assert.match(renderer, /MarxabaInvitation/);
  assert.match(renderer, /templateId="hilol"/);
  assert.match(html, /href="contract-adapter\.css"/);
  assert.match(adapter, /#toyona\s*>\s*\.gift__note:empty/);
  assert.match(adapter, /\[data-slot="toyona\.bank"\]:empty/);
  assert.match(adapter, /display:\s*none/);
  for (const gap of ["iftorlik", "toyona.bank", "toyona.note"])
    assert.ok(notes.includes(gap), `${gap} is documented`);
  assert.match(
    notes,
    /typed catalog and additive migration preserve that category and compatibility/i,
  );
  assert.match(notes, /published at 150,000 UZS/i);
  const publication = readFileSync(
    new URL("../packages/database/migrations/0072_publish_hilol.sql", import.meta.url),
    "utf8",
  );
  assert.match(publication, /published\s*=\s*true/i);
  assert.match(publication, /'hilol', 'iftorlik'/);
  assert.match(publication, /'hilol', 'osh'/);
});

test("Hilol keeps its captured decorative artwork byte-identical", () => {
  for (const asset of [
    "art/city-silhouette.svg",
    "art/girih-tile.svg",
    "art/still-life.svg",
  ]) {
    assert.deepEqual(
      readFileSync(new URL(asset, root)),
      readFileSync(path.join(reference, asset)),
      `${asset} matches the original capture`,
    );
  }
});

test("Hilol's catalog fixture localizes its complete iftar content in all four locales", () => {
  const sample = createTemplatePreviewSample("hilol");
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"] as const;
  assert.equal(sample.eventType, "iftorlik");
  assert.deepEqual(sample.enabledLocales, locales);
  assert.equal(sample.program.length, 6);
  assert.equal(sample.startsAt, "2027-02-12T18:00");
  assert.deepEqual(
    sample.program.map(({ time }) => time),
    ["17:30", "18:00", "18:15", "19:00", "20:00", "21:00"],
  );

  for (const locale of locales) {
    const content = sample.content[locale];
    assert.ok(content.people[0], `${locale} has the celebrant name`);
    assert.ok(content.eventLabel, `${locale} has an event label`);
    assert.ok(content.hosts, `${locale} has localized hosts`);
    assert.ok(content.greeting, `${locale} has a localized greeting`);
    assert.ok(content.message, `${locale} has a localized invitation message`);
    assert.ok(content.venueName, `${locale} has a localized venue`);
    assert.ok(content.address, `${locale} has a localized address`);
    assert.ok(
      content.programHeading,
      `${locale} has a localized program heading`,
    );
    for (const item of sample.program) {
      assert.ok(
        content.programTitles[item.id],
        `${locale} has a program title for ${item.id}`,
      );
    }
    assert.ok(
      sample.dressCode.style[locale],
      `${locale} has localized dress style`,
    );
    assert.ok(
      sample.dressCode.text[locale],
      `${locale} has localized dress guidance`,
    );
    assert.ok(
      sample.dressCode.note[locale],
      `${locale} has a localized dress note`,
    );
    assert.ok(sample.dressCode.colors.every((color) => color.name[locale]));
  }
  assert.equal(sample.gallery.length, 6);
  assert.ok(sample.gallery.every((item) => !item.url && !item.caption));
  assert.equal(sample.gift.enabled, true);
  assert.equal(sample.contacts.phoneNumber, "+998 90 123 45 67");
  assert.equal(sample.contacts.telegramUsername, "@demo");
});

test("Hilol adapter maps the shared fixture and keeps its content out of blank drafts", () => {
  const { makeLegacyData } =
    require("../apps/web/src/templates/anor/renderer") as typeof import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("hilol");
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"] as const;

  for (const locale of locales) {
    const content = sample.content[locale];
    const mapped = makeLegacyData(sample, locale, "", true);
    assert.equal(mapped.groom, content.people[0]);
    assert.equal(mapped.bride, "");
    assert.equal(mapped.hosts, content.hosts);
    assert.equal(mapped.greeting, content.greeting);
    assert.equal(mapped.message, content.message);
    assert.equal(mapped.eventType, content.eventLabel);
    assert.equal(mapped.venue.name, content.venueName);
    assert.equal(
      mapped.venue.address,
      [content.address, content.landmark].filter(Boolean).join(" · "),
    );
    assert.equal(mapped.programHeading, content.programHeading);
    assert.deepEqual(
      mapped.program.map(({ time, title }) => [time, title]),
      sample.program.map(({ id, time }) => [time, content.programTitles[id]]),
    );
    assert.deepEqual(mapped.wishes, getTemplatePreviewWishes(locale));
    assert.equal(mapped.wishes.length, 3);
    assert.equal(mapped.dressCode.enabled, true);
    assert.equal(mapped.dressCode.colors.length, 5);
    assert.equal(mapped.toyona.enabled, true);
    assert.equal(mapped.toyona.cardNumber, sample.gift.cardNumber);
    assert.equal(mapped.toyona.cardHolder, sample.gift.cardHolder);
    assert.equal(mapped.toyona.note, "");
    assert.deepEqual(
      mapped.contacts.map(({ type }) => type),
      ["phone", "telegram"],
    );
    assert.equal(mapped.gallery.length, 6);
    assert.ok(mapped.gallery.every(({ src }) => !src));
  }

  const blank = makeLegacyData(createInvitation("hilol"), "uz-Latn", "", false);
  assert.deepEqual(blank.groom, "");
  assert.deepEqual(blank.hosts, "");
  assert.deepEqual(blank.message, "");
  assert.deepEqual(blank.program, []);
  assert.deepEqual(blank.gallery, []);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.dressCode.enabled, false);
  assert.deepEqual(blank.contacts, []);
});
