import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createInvitation } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
  hasAuthoredInvitationContent,
} from "../apps/web/src/modules/catalog/preview-sample";

const root = new URL("../apps/web/public/templates/oltin-uzuk/", import.meta.url);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/oltin-uzuk/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", root), "utf8");
const core = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url),
  "utf8",
);

test("Oltin Uzuk's ephemeral preview covers the shared sample in all four locales", () => {
  const sample = createTemplatePreviewSample("oltin-uzuk");
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"] as const;

  assert.deepEqual(sample.enabledLocales, locales);
  assert.equal(sample.program.length, 6);
  assert.equal(sample.gallery.length, 6);
  assert.ok(sample.gallery.every((photo) => !photo.url && !photo.alt && !photo.caption));
  assert.equal(sample.dressCode.colors.length, 5);
  assert.equal(sample.gift.enabled, true);
  assert.equal(sample.gift.cardNumber, "8600 1234 5678 9012");
  assert.equal(sample.gift.cardHolder, "AZIZ AZIZOV");
  assert.equal(sample.contacts.phoneNumber, "+998 90 123 45 67");
  assert.equal(sample.contacts.telegramUsername, "@demo");

  for (const locale of locales) {
    const content = sample.content[locale];
    assert.equal(content.people[0], locale === "uz-Cyrl" || locale === "ru" ? "Жавохир" : "Javohir");
    assert.ok(content.programHeading);
    assert.ok(content.eventLabel);
    assert.ok(sample.dressCode.style[locale]);
    assert.ok(sample.dressCode.text[locale]);
    assert.ok(sample.dressCode.note[locale]);
    assert.ok(sample.dressCode.colors.every((color) => color.name[locale]));
    assert.ok(sample.program.every((item) => content.programTitles[item.id]));
    assert.equal(getTemplatePreviewWishes(locale).length, 3);
  }
});

test("Oltin Uzuk retains its captured opening and invitation sections", () => {
  const captured = readFileSync(new URL("index.html", captureRoot), "utf8");
  for (const marker of [
    'class="intro__copy"',
    'class="hero__stage"',
    'data-section="program"',
    'data-section="dresscode"',
    'data-section="gallery"',
    'data-section="wishes"',
    'data-section="toyona"',
    'data-section="contacts"',
  ]) {
    assert.ok(html.includes(marker), `${marker} is missing from the packaged template`);
    assert.ok(captured.includes(marker), `${marker} is missing from the captured source`);
  }
  assert.match(html, /data-list="program"/);
  assert.match(html, /data-list="dresscode"/);
  assert.match(html, /data-list="wishes"/);
  assert.match(html, /data-list="contacts"/);
  assert.match(html, /href="contract-adapter\.css"/);
});

test("empty Lahzalar photos stay icon-only and shared controls wrap smoothly", () => {
  const source = readFileSync(new URL("template.js", root), "utf8");
  const gallery = core.slice(core.indexOf("function setupGallery()"), core.indexOf("function setupSections()"));
  assert.match(core, /if\(!source\)image\.setAttribute\('aria-hidden','true'\)/);
  assert.match(core, /placeholder\.textContent='✦'/);
  assert.match(gallery, /index=\(number\+state\.items\.length\) % state\.items\.length/);
  assert.match(gallery, /behavior: reducedMotion\?'instant':'smooth'/);
  assert.doesNotMatch(source, /\[data-gallery-(?:prev|next)\].*scrollBy/);
  assert.match(source, /\.gallery__item.*is-center/);
});

test("Oltin Uzuk samples remain ephemeral and unsupported To'yona rows collapse", () => {
  const blank = createInvitation("oltin-uzuk");
  const sample = createTemplatePreviewSample("oltin-uzuk");
  const adapter = readFileSync(new URL("contract-adapter.css", root), "utf8");

  assert.equal(hasAuthoredInvitationContent(blank), false);
  assert.deepEqual(blank.content["uz-Latn"].people, []);
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.equal(blank.gift.cardNumber, "");
  assert.doesNotMatch(JSON.stringify(blank), /Javohir|Madina|8600 1234|Dilnoza opa/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.note"\]:empty/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.bank"\]:empty/);
  assert.notDeepEqual(blank.content, sample.content);
});
