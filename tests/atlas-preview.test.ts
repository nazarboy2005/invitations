import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createInvitation } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
  hasAuthoredInvitationContent,
} from "../apps/web/src/modules/catalog/preview-sample";

const root = new URL("../apps/web/public/templates/atlas/", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");
const core = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url),
  "utf8",
);

test("Atlas preview maps the complete four-locale shared invitation sample", () => {
  const sample = createTemplatePreviewSample("atlas");
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

test("Atlas retains its captured opening and the required invitation sections", () => {
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

test("Atlas empty Lahzalar photos stay icon-only and navigation wraps smoothly", () => {
  const gallery = core.slice(core.indexOf("function setupGallery()"), core.indexOf("function setupSections()"));
  assert.match(core, /if\(!source\)image\.setAttribute\('aria-hidden','true'\)/);
  assert.match(core, /placeholder\.textContent='✦'/);
  assert.match(gallery, /index=\(number\+state\.items\.length\) % state\.items\.length/);
  assert.match(gallery, /behavior: reducedMotion\?'instant':'smooth'/);
});

test("Atlas preview samples stay out of blank drafts and empty To‘yona slots collapse", () => {
  const blank = createInvitation("atlas");
  const sample = createTemplatePreviewSample("atlas");
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

test("Atlas source photos are injected only into empty catalog and selection previews", () => {
  const renderer = readFileSync(new URL("../apps/web/src/templates/marxaba/renderer.tsx", import.meta.url), "utf8");
  assert.match(renderer, /atlas:\s*\[\s*\["silk-swatch-1\.webp"/);
  assert.match(
    renderer,
    /export function mapMarxabaPreviewGallery\([\s\S]*?if \(!preview \|\| !samplePreview \|\| hasCreatorPhotos \|\| !previewGallery\)\s+return sourceGallery;/,
  );
  assert.match(renderer, /const hasCreatorPhotos = invitationGallery\.some\(\(photo\) => photo\.url\.trim\(\)\)/);
  assert.match(renderer, /\/templates\/\$\{encodeURIComponent\(templateId\)\}\/art\/\$\{file\}/);
  assert.match(renderer, /const gallery = mapMarxabaPreviewGallery\([\s\S]*?sampleWishes,[\s\S]*?\n\s*\);/);
  assert.match(renderer, /\n\s*gallery,/);
});
