import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createInvitation, type Locale } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
} from "../apps/web/src/modules/catalog/preview-sample";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => { module.exports = {}; };
const moduleRuntime = require("node:module") as { _resolveFilename: (...args: any[]) => string };
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/") ? path.resolve(webSourceRoot, request.slice(2)) : request;
  return resolveFilename.call(this, resolved, ...args);
};

const templateRoot = new URL("../apps/web/public/templates/samarqand-kechasi/", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, templateRoot), "utf8");
const html = read("index.html");

test("Samarqand Kechasi maps shared sample clothing, six localized program entries, wishes, To‘yona and contacts in all locales", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const fixture = createTemplatePreviewSample("samarqand-kechasi");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  for (const locale of locales) {
    const data = makeLegacyData(fixture, locale, "", true);
    const content = fixture.content[locale];
    assert.equal(data.dressCode.enabled, true);
    assert.equal(data.dressCode.style, fixture.dressCode.style[locale]);
    assert.equal(data.dressCode.text, fixture.dressCode.text[locale]);
    assert.equal(data.dressCode.note, fixture.dressCode.note[locale]);
    assert.deepEqual(data.dressCode.colors.map((color) => color.name), fixture.dressCode.colors.map((color) => color.name[locale]));
    assert.equal(data.program.length, 6);
    assert.deepEqual(data.program.map((item) => item.time), ["17:30", "18:00", "18:30", "20:00", "21:30", "22:30"]);
    assert.deepEqual(data.program.map((item) => item.title), Object.values(content.programTitles));
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.ok(data.wishes.length > 0);
    assert.equal(data.toyona.enabled, true);
    assert.equal(data.toyona.cardNumber, fixture.gift.cardNumber);
    assert.equal(data.toyona.cardHolder, fixture.gift.cardHolder);
    assert.equal(data.toyona.note, "");
    assert.equal("bank" in data.toyona, false);
    assert.deepEqual(data.contacts.map((item) => item.value), [fixture.contacts.phoneNumber, "@" + fixture.contacts.telegramUsername.replace(/^@/, "")]);
    assert.equal(data.gallery.length, 6);
    assert.ok(data.gallery.every((item) => item.src === "" && item.alt === "" && item.caption === ""));
  }

  const blank = makeLegacyData(createInvitation("samarqand-kechasi"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.message, "");
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.dressCode.enabled, false);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.toyona.note, "");
  assert.equal("bank" in blank.toyona, false);
  assert.equal(blank.contacts.length, 0);
  assert.equal(JSON.stringify(createInvitation("samarqand-kechasi")).includes("Javohir"), false);
});

test("Samarqand Kechasi keeps its intro and required invitation sections with an icon-only, wrapping empty Lahzalar", () => {
  assert.ok(html.includes('id="open-invitation"'));
  for (const section of ["program", "dresscode", "gallery", "rsvp", "wishes", "toyona", "contacts"]) {
    assert.ok(html.includes(`data-section="${section}"`), `${section} section missing`);
  }
  const gallery = html.match(/<section[^>]*id="gallery"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(gallery.includes('data-list="gallery"'));
  assert.ok(gallery.includes("data-photo"));
  assert.doesNotMatch(gallery, /To‘y surati|Wedding photo|Фото свадьбы/i);
  const core = readFileSync(new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url), "utf8");
  assert.match(core, /placeholder\.setAttribute\('aria-hidden','true'\)/);
  assert.match(core, /placeholder\.textContent='✦'/);
  assert.match(core, /index=\(number\+state\.items\.length\)%state\.items\.length/);
  assert.match(core, /behavior:\s*reducedMotion\s*\?\s*'instant'\s*:\s*'smooth'/);
  assert.match(core, /prefers-reduced-motion: reduce/);
  assert.match(read("template.css"), /\.page\{width:min\(100%,480px\)/);
  assert.match(read("template.css"), /@media\s*\(max-height:/);
  assert.match(read("template.css"), /prefers-reduced-motion:reduce/);
});

test("Samarqand Kechasi hides unsupported empty To‘yona note and bank hooks", () => {
  assert.ok(html.includes('href="platform-adapter.css"'));
  const adapter = read("platform-adapter.css");
  assert.match(adapter, /\.toyona-section \[data-slot="toyona\.note"\]:empty/);
  assert.match(adapter, /\.plaque \[data-slot="toyona\.bank"\]:empty/);
  assert.ok(html.includes('data-slot="toyona.cardNumber"'));
  assert.ok(html.includes('data-slot="toyona.cardHolder"'));
});

test("Samarqand Kechasi footer no longer depends on the uncaptured door-leaf asset", () => {
  const css = read("template.css");
  assert.doesNotMatch(css, /art\/door-leaf\.webp/);
  assert.match(css, /\.footer__portal\{[^}]*background:radial-gradient/);
  assert.equal(existsSync(new URL("../apps/web/public/templates/samarqand-kechasi/art/door-leaf.webp", import.meta.url)), false);
});

test("Samarqand Kechasi catalog art is a clean, fixture-backed portrait capture of its locked intro", () => {
  const packageRoot = new URL("../apps/web/public/templates/samarqand-kechasi/", import.meta.url);
  const readBytes = (file: string) => readFileSync(new URL(file, packageRoot));
  const sha256 = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
  const provenance = JSON.parse(readBytes("preview.provenance.json").toString("utf8"));
  const capture = readBytes("preview-capture.png");
  const preview = readBytes("preview.webp");
  const fixture = readFileSync(new URL("../apps/web/src/modules/catalog/preview-sample.json", import.meta.url));

  assert.equal(capture.toString("ascii", 12, 16), "IHDR");
  assert.equal(capture.readUInt32BE(16), 560);
  assert.equal(capture.readUInt32BE(20), 1280);
  assert.equal(provenance.fixture.startsAt, "2026-11-14T18:30");
  assert.equal(provenance.fixture.sha256, sha256(fixture));
  assert.equal(provenance.artwork["preview-capture.png"], sha256(capture));
  assert.equal(provenance.artwork["preview.webp"], sha256(preview));
  assert.deepEqual(provenance.capture.excluded, ["outer page background", "Next.js dev badge", "app language switcher", "browser/app chrome"]);
  assert.match(read("index.html"), /id="intro"[\s\S]*?class="intro__scene"[\s\S]*?registan-reveal\.webp[\s\S]*?lantern-hd\.webp/);
  assert.match(read("index.html"), /id="open-invitation"/);
});
