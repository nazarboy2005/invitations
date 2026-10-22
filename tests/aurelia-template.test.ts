import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { templateById } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = process.cwd();
const pub = path.join(root, "apps/web/public/templates/aurelia");
const capture = path.join(root, "Invitations - this folder will be removed from production/Invitate/Web invitations/invitate.uz");
const read = (base: string, file: string) => readFileSync(path.join(base, file), "utf8");

test("Aurelia is a published wedding catalog template", () => {
  const template = templateById("aurelia");
  assert.ok(template);
  assert.equal(template.published, true);
  assert.equal(template.previewEventType, "wedding");
  assert.deepEqual(template.categoryIds, ["wedding"]);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
  assert.equal(template.priceMinor, 15_000_000);
  assert.equal(template.previewImage, "/templates/aurelia/preview.png");
});

test("Aurelia catalog artwork is a real portrait capture of the source opening", () => {
  const image = readFileSync(path.join(pub, "preview.png"));
  const provenance = JSON.parse(read(pub, "preview.provenance.json"));
  assert.equal(image.subarray(1, 4).toString(), "PNG");
  assert.equal(image.readUInt32BE(16), 480);
  assert.equal(image.readUInt32BE(20), 900);
  const digest = createHash("sha256").update(image).digest("hex");
  assert.equal(provenance.previewSha256, digest);
  assert.equal(provenance.screenshotSha256, digest);
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
});

test("Aurelia preserves captured art, motion, fonts, and local dependencies", () => {
  const html = read(pub, "index.html");
  const css = read(pub, "assets/css/aurelia.css");
  const script = read(pub, "assets/js/aurelia.js");
  for (const file of ["assets/previews/template/aurelia/hands.mp4", "assets/previews/template/aurelia/top.svg", "assets/previews/template/aurelia/center.svg", "assets/fonts/TrajanPro-Regular.ttf", "assets/fonts/TrajanPro-Bold.otf", "assets/images/yakk.png", "assets/images/0310/1.png"]) {
    assert.ok(existsSync(path.join(pub, file)), `${file} packaged`);
  }
  assert.match(html, /class="hero-video"/);
  assert.match(css, /TrajanPro-Regular/);
  assert.match(script, /countdown/);
  assert.match(read(pub, "assets/js/aurelia-adapter.js"), /prefers-reduced-motion/);
  assert.match(read(capture, "assets/js/aurelia.js"), /rsvpForm/);
});

test("Aurelia maps authored fields to APIs and excludes captured demo content", () => {
  const html = read(pub, "index.html");
  const adapter = read(pub, "assets/js/aurelia-adapter.js");
  for (const field of ["groom", "bride", "greeting", "message", "venueName", "programHeading", "galleryPhoto", "rsvpForm", "toyonaSection"]) {
    assert.ok(html.includes(`data-field="${field}"`) || html.includes(`id="${field}"`), `${field} exists`);
  }
  for (const locale of ['"uz-Latn": {', '"uz-Cyrl": {', "en: {", "ru: {"]) assert.ok(adapter.includes(locale));
  assert.match(adapter, /\/rsvp/);
  assert.match(adapter, /\/wishes/);
  assert.match(adapter, /guestToken/);
  assert.match(adapter, /prefers-reduced-motion/);
  for (const key of ["days", "hours", "minutes", "seconds"]) assert.ok(html.includes(`data-copy="${key}"`));
  assert.match(adapter, /days: "Кун"/);
  assert.match(adapter, /minutes: "Дақиқа"/);
  assert.match(adapter, /days: "Days"/);
  assert.match(adapter, /days: "Дней"/);
  assert.match(adapter, /aurelia:language/);
  assert.doesNotMatch(html + adapter, /(?:Shahzod|Nilufar|send\.php|google-analytics)/i);
  assert.match(adapter, /venuePhoto\.src = venueImage\?\.src \|\| "\.\/assets\/images\/yakk\.png"/);
  assert.match(adapter, /galleryPhoto\.src = featureImage\?\.src \|\| "\.\/assets\/images\/0310\/1\.png"/);
  assert.match(adapter, /giftSection\.hidden=\!\(gift\.enabled&&gift\.cardNumber\)/);
  assert.match(adapter, /navigator\.clipboard\.writeText\(number\)/);
  for (const text of ["Картани нусхалаш", "Copy card number", "Скопировать номер карты"]) assert.ok(adapter.includes(text));
});

test("Aurelia preview sample stays ephemeral and uses the shared renderer", () => {
  const sample = createTemplatePreviewSample("aurelia");
  assert.equal(sample.eventType, "wedding");
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
    assert.ok(sample.content[locale].people.length >= 2);
    assert.ok(sample.content[locale].message);
    assert.ok(sample.content[locale].greeting);
  }
  assert.ok(sample.gallery.every((item) => item.url === ""));
  const sharedRenderer = read("apps/web/src/templates/invitate", "renderer.tsx");
  assert.match(sharedRenderer, /templates\/\$\{templateId\}\/index\.html/);
  assert.match(sharedRenderer, /key=\{templateId\}/);
});

test("Aurelia migration registers the wedding category and event compatibility", () => {
  const migration = read("packages/database/migrations", "0080_add_aurelia_template.sql");
  assert.match(migration, /VALUES \('aurelia', 'Aurelia', 15000000, 'UZS', false\)/);
  assert.match(migration, /'aurelia', 'wedding'/);
  assert.match(migration, /ON CONFLICT/);
});

test("Aurelia publication migration enables catalog selection", () => {
  const migration = read("packages/database/migrations", "0081_publish_aurelia.sql");
  assert.match(migration, /VALUES \('aurelia', 'Aurelia', 15000000, 'UZS', true\)/);
  assert.match(migration, /published = true/);
});
