import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { templateById } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = process.cwd();
const pub = path.join(root, "apps/web/public/templates/evelina");
const source = path.join(root, "Invitations - this folder will be removed from production/Invitate/Web invitations/invitate.uz");
const read = (base: string, file: string) => readFileSync(path.join(base, file), "utf8");

test("Evelina is a published wedding-only catalog template", () => {
  const template = templateById("evelina");
  assert.ok(template);
  assert.equal(template.name, "Evelina");
  assert.equal(template.published, true);
  assert.equal(template.previewEventType, "wedding");
  assert.deepEqual(template.categoryIds, ["wedding"]);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
  assert.equal(template.priceMinor, 15_000_000);
});

test("the adapted frame retains source artwork, videos, and local font files", () => {
  const html = read(pub, "index.html");
  const css = read(pub, "assets/css/evelina.css");
  for (const file of [
    "assets/previews/template/evelina/hero.png",
    "assets/previews/template/evelina/hero.mp4",
    "assets/previews/template/evelina/lock-cover.mp4",
    "assets/previews/template/evelina/crystals.webp",
    "assets/previews/template/evelina/inner-video.gif",
    "assets/previews/template/evelina/location.png",
    "assets/fonts/BIKHAM.TTF",
    "assets/fonts/standart.otf",
  ]) assert.ok(existsSync(path.join(pub, file)), `${file} is packaged`);
  assert.match(html, /id="coverScreen"/);
  assert.match(html, /id="introVideo"/);
  assert.match(html, /id="heroSection"/);
  assert.match(css, /BIKHAM\.TTF/);
  assert.match(css, /standart\.otf/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(read(source, "assets/css/evelina.css"), /\.cover-names/);
  assert.match(read(source, "assets/js/evelina.js"), /revealHero/);
});

test("frame is localized and uses contract-backed fields and APIs", () => {
  const html = read(pub, "index.html");
  const script = read(pub, "assets/js/evelina.js");
  const adapter = read("apps/web/src/templates/invitate", "renderer.tsx");
  for (const selector of ["data-field=\"names\"", "data-field=\"date\"", "data-field=\"venueName\"", "data-field=\"address\"", "data-field=\"dressHeading\"", "id=\"programItems\"", "id=\"rsvpForm\""]) {
    assert.ok(html.includes(selector), `${selector} is bound in source markup`);
  }
  for (const locale of ['uz: {', '"uz-Cyrl": {', 'en: {', 'ru: {']) assert.ok(script.includes(locale));
  assert.match(script, /\/rsvp/);
  assert.match(script, /\/wishes/);
  assert.match(script, /guestToken/);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(html, /id="toyonaSection"/);
  assert.match(script, /giftSection.hidden=\!\(gift.enabled&&gift.cardNumber\)/);
  assert.match(script, /navigator.clipboard.writeText\(number\)/);
  for (const text of ["Картани нусхалаш", "Copy card number", "Скопировать номер карты"]) assert.ok(script.includes(text));
  assert.match(adapter, /makeLegacyData/);
  assert.match(adapter, /\$\{templateId\}:update/);
  assert.match(adapter, /catalogMusic/);
  assert.doesNotMatch(html + script, /Davron|Sabina|12\.12\.2026|Yakkasaroy|send\.php|stats\.tolipov|Ordinary\.mp3|afina\/000/);
});

test("Cyrillic lookalike glyphs keep Evelina calligraphy while accessible text stays correct", () => {
  const script = read("apps/web/public/templates/evelina/assets/js", "evelina.js");
  assert.match(script, /"Ҳ":"Х","ҳ":"х","Қ":"К","қ":"к"/);
  assert.match(script, /node\.setAttribute\("aria-label",text\)/);
  assert.match(script, /visual\.setAttribute\("aria-hidden","true"\)/);
});

test("all supported sample locales flow through the shared preview fixture", () => {
  const sample = createTemplatePreviewSample("evelina");
  assert.equal(sample.eventType, "wedding");
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
    assert.ok(sample.content[locale].people.length >= 2);
    assert.ok(sample.content[locale].message);
    assert.ok(sample.content[locale].greeting);
    assert.ok(sample.content[locale].programHeading);
    assert.equal(sample.program.length, 6);
  }
  assert.ok(sample.gallery.every((item) => item.url === ""));
  assert.match(read("apps/web/src/modules/catalog", "full-template-preview.tsx"), /InvitateInvitation/);
  assert.match(read("apps/web/src/app/i/[slug]", "page.tsx"), /InvitateInvitation/);
});

test("additive Evelina migration registers the approved category and event type", () => {
  const migration = read("packages/database/migrations", "0077_add_evelina_template.sql");
  assert.match(migration, /VALUES \('evelina', 'Evelina', 15000000, 'UZS', false\)/);
  assert.match(migration, /'evelina', 'wedding'/);
  assert.match(migration, /ON CONFLICT/);
});

test("additive Evelina publication migration enables catalog selection", () => {
  const migration = read("packages/database/migrations", "0078_publish_evelina.sql");
  assert.match(migration, /VALUES \('evelina', 'Evelina', 15000000, 'UZS', true\)/);
  assert.match(migration, /published = true/);
});
