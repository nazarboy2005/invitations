import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
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
  assert.equal(preview.toString("ascii", 12, 16), "VP8X");
  const width = 1 + preview.readUIntLE(24, 3);
  const height = 1 + preview.readUIntLE(27, 3);
  assert.equal(width, 450);
  assert.equal(height, 800);
  assert.equal(
    createHash("sha256").update(preview).digest("hex"),
    "313d4fc7544c2ca59636794df948dcef6268362a819cf0cea596cbbdfd6de84d",
  );
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
    assert.equal(data.groom, content.people[0]);
    assert.equal(data.eventType, content.eventLabel);
    assert.equal(data.greeting, content.personalGreeting.replaceAll("{name}", "Hurmatli mehmon"));
    assert.equal(data.date.day, 12);
    assert.equal(data.program.length, 6);
    assert.equal(data.gallery.length, 6);
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
  }
  const blank = makeLegacyData(createInvitation("oltin-yosh"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.greeting, "");
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
});

test("the narrow adapter maps the first celebrant and source-only fields are documented", () => {
  const renderer = read("../../../src/templates/oltin-yosh/renderer.tsx");
  const notes = read("../../../src/templates/oltin-yosh/README.md");
  assert.match(notes, /centralized birthday preview fixture/i);
  assert.match(notes, /450×800 \/ DPR 1/);
  assert.match(notes, /313d4fc7544c2ca59636794df948dcef6268362a819cf0cea596cbbdfd6de84d/);
  assert.match(renderer, /MarxabaInvitation/);
  assert.match(renderer, /templateId="oltin-yosh"/);
  assert.match(
    notes,
    /preview-sample\.json|centralized birthday preview fixture/,
  );
  for (const gap of ["extras.age", "venue.photo", "toyona.bank", "toyona.note"])
    assert.ok(notes.includes(gap), `${gap} is documented`);
  assert.match(notes, /birthday.*yubiley/s);
  assert.match(notes, /parent catalog\/database integration/i);
});
