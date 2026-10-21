import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createInvitation } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
  hasAuthoredInvitationContent,
} from "../apps/web/src/modules/catalog/preview-sample";

const root = new URL("../apps/web/public/templates/oynavand/", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");
const core = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url),
  "utf8",
);
const sourceScript = readFileSync(new URL("template.js", root), "utf8");

test("Oynavand catalog cover is a complete source opening with the shared preview fixture", () => {
  const preview = readFileSync(new URL("preview.webp", root));
  const provenance = JSON.parse(
    readFileSync(new URL("preview.provenance.json", root), "utf8"),
  ) as {
    artifactSha256: string;
    previewRoute: string;
    fixture: string;
    viewport: { width: number; height: number; deviceScaleFactor: number };
  };

  assert.equal(provenance.previewRoute, "/preview?template=oynavand&qaSilent=1");
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.deepEqual(provenance.viewport, { width: 640, height: 1280, deviceScaleFactor: 1 });
  assert.equal(createHash("sha256").update(preview).digest("hex"), provenance.artifactSha256);
});

test("Oynavand preview maps the complete four-locale shared example", () => {
  const sample = createTemplatePreviewSample("oynavand");
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"] as const;

  assert.deepEqual(sample.enabledLocales, locales);
  assert.equal(sample.program.length, 6);
  assert.equal(sample.gallery.length, 6);
  assert.ok(sample.gallery.every((photo) => !photo.url && !photo.alt && !photo.caption));
  assert.equal(sample.dressCode.colors.length, 5);
  assert.equal(sample.gift.enabled, true);
  assert.equal(sample.gift.cardNumber, "8600 1234 5678 9012");
  assert.equal(sample.contacts.phoneNumber, "+998 90 123 45 67");
  assert.equal(sample.contacts.telegramUsername, "@demo");

  for (const locale of locales) {
    const content = sample.content[locale];
    assert.ok(content.people.length > 0);
    assert.ok(content.eventLabel);
    assert.ok(content.programHeading);
    assert.ok(sample.program.every((item) => content.programTitles[item.id]));
    assert.ok(sample.dressCode.style[locale]);
    assert.ok(sample.dressCode.text[locale]);
    assert.ok(sample.dressCode.note[locale]);
    assert.ok(sample.dressCode.colors.every((color) => color.name[locale]));
    assert.equal(getTemplatePreviewWishes(locale).length, 3);
  }
});

test("Oynavand retains the captured opening and required invitation sections", () => {
  for (const marker of [
    'id="intro"',
    'id="open-invitation"',
    'data-section="program"',
    'data-section="dresscode"',
    'data-section="gallery"',
    'data-section="wishes"',
    'data-section="toyona"',
    'data-section="contacts"',
  ]) assert.ok(html.includes(marker), `${marker} is missing`);
  for (const list of ["program", "dresscode", "gallery", "wishes", "contacts"])
    assert.ok(html.includes(`data-list="${list}"`), `${list} list is missing`);
  assert.match(html, /href="contract-adapter\.css"/);
});

test("Oynavand empty Lahzalar stays icon-only and gallery navigation wraps smoothly", () => {
  const gallery = core.slice(core.indexOf("function setupGallery()"), core.indexOf("function setupSections()"));
  assert.match(core, /if\(!source\)image\.setAttribute\('aria-hidden','true'\)/);
  assert.match(core, /placeholder\.textContent='✦'/);
  assert.match(gallery, /index=\(number\+state\.items\.length\) % state\.items\.length/);
  assert.match(gallery, /behavior: reducedMotion\?'instant':'smooth'/);
  assert.match(sourceScript, /is-kaleidoscope/);
  assert.doesNotMatch(sourceScript, /\[data-gallery-(?:prev|next)\].*scrollBy/);
});

test("Oynavand's preview samples never enter blank invitations and empty gift slots hide", () => {
  const blank = createInvitation("oynavand");
  const sample = createTemplatePreviewSample("oynavand");
  const adapter = readFileSync(new URL("contract-adapter.css", root), "utf8");

  assert.equal(hasAuthoredInvitationContent(blank), false);
  assert.deepEqual(blank.content["uz-Latn"].people, []);
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.equal(blank.gift.cardNumber, "");
  assert.doesNotMatch(JSON.stringify(blank), /Javohir|Madina|8600 1234|Dilnoza opa/);
  assert.notDeepEqual(blank.content, sample.content);
  assert.match(adapter, /#toyona \[data-slot="toyona\.note"\]:empty/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.bank"\]:empty/);
});
