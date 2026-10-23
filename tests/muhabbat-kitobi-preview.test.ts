import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { createInvitation } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
  hasAuthoredInvitationContent,
} from "../apps/web/src/modules/catalog/preview-sample";

const root = new URL("../apps/web/public/templates/muhabbat-kitobi/", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");
const core = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url),
  "utf8",
);
const templateScript = readFileSync(new URL("template.js", root), "utf8");
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/muhabbat-kitobi/",
  import.meta.url,
);

test("Muhabbat Kitobi catalog art captures the clean initial book opening", () => {
  const preview = readFileSync(new URL("preview.webp", root));
  const provenance = JSON.parse(
    readFileSync(new URL("preview.provenance.json", root), "utf8"),
  ) as {
    artifact: string;
    sha256: string;
    format: string;
    width: number;
    height: number;
    sourceMetadataPreview: string;
    renderedFrom: string;
    state: string;
    visibleOpeningElements: string[];
    captureSettings: {
      reducedMotion: boolean;
      crop: string;
      resize: string;
      applicationLanguageControl: string;
      browserChrome: string;
    };
    sampleContent: string;
  };
  const webpWidth = preview.readUInt16LE(26) & 0x3fff;
  const webpHeight = preview.readUInt16LE(28) & 0x3fff;
  const digest = createHash("sha256").update(preview).digest("hex");

  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.equal(provenance.artifact, "preview.webp");
  assert.equal(provenance.sha256, digest);
  assert.equal(provenance.format, "image/webp");
  assert.deepEqual([provenance.width, provenance.height], [webpWidth, webpHeight]);
  assert.ok(webpHeight > webpWidth, "catalog art must retain a portrait crop");
  assert.match(provenance.renderedFrom, /packaged Muhabbat Kitobi renderer/i);
  assert.match(provenance.state, /initial locked intro/i);
  assert.ok(provenance.visibleOpeningElements.includes("closed green book cover"));
  assert.ok(provenance.visibleOpeningElements.includes("ribbon greeting"));
  assert.ok(provenance.visibleOpeningElements.includes("Kitobni ochish action"));
  assert.equal(provenance.captureSettings.crop, "none");
  assert.equal(provenance.captureSettings.resize, "none");
  assert.equal(provenance.captureSettings.reducedMotion, true);
  assert.match(provenance.captureSettings.applicationLanguageControl, /excluded/i);
  assert.equal(provenance.captureSettings.browserChrome, "excluded");
  assert.match(provenance.sampleContent, /ephemeral/i);
  assert.match(provenance.sourceMetadataPreview, /preview-source\.svg/);
  assert.equal(existsSync(new URL("preview-source.svg", root)), false);
  assert.equal(existsSync(new URL("preview-source.svg", captureRoot)), false);
  assert.ok(html.includes('id="intro" class') || html.includes('class="intro" id="intro"'));
  assert.ok(html.includes('id="open-invitation"'));
});

test("Muhabbat Kitobi preview uses the complete four-locale shared sample", () => {
  const sample = createTemplatePreviewSample("muhabbat-kitobi");
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
    assert.ok(sample.dressCode.style[locale]);
    assert.ok(sample.dressCode.text[locale]);
    assert.ok(sample.dressCode.note[locale]);
    assert.ok(sample.dressCode.colors.every((color) => color.name[locale]));
    assert.ok(sample.program.every((item) => content.programTitles[item.id]));
    assert.equal(getTemplatePreviewWishes(locale).length, 3);
  }
});

test("Muhabbat Kitobi retains the book opening and all required sections", () => {
  for (const marker of [
    'id="intro"',
    'id="book"',
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

test("empty Lahzalar is icon-only and the shared gallery controls wrap smoothly", () => {
  const gallery = core.slice(core.indexOf("function setupGallery()"), core.indexOf("function setupSections()"));
  assert.match(core, /if\(!source\)image\.setAttribute\('aria-hidden','true'\)/);
  assert.match(core, /placeholder\.textContent='✦'/);
  assert.match(gallery, /index=\(number\+state\.items\.length\) % state\.items\.length/);
  assert.match(gallery, /behavior: reducedMotion\?'instant':'smooth'/);
  assert.doesNotMatch(templateScript, /\[data-gallery-(?:prev|next)\].*scrollBy/);
});

test("Muhabbat Kitobi sample data stays out of blank saved drafts and empty gift slots", () => {
  const blank = createInvitation("muhabbat-kitobi");
  const sample = createTemplatePreviewSample("muhabbat-kitobi");
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
