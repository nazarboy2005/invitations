import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createInvitation, templateById } from "@taklifnoma/contracts";
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

test("Oltin Uzuk catalog cover captures the clean source opening with pinned provenance", () => {
  const provenance = JSON.parse(
    readFileSync(new URL("preview.provenance.json", root), "utf8"),
  ) as {
    artifact: { path: string; sha256: string };
    fixture: { path: string; sha256: string; names: string[] };
    renderer: {
      route: string;
      locale: string;
      browserSettings: string;
      fixtureAdapter: string;
      captureState: string;
      captureOverrides: string[];
      excludedUi: string[];
    };
    sourceCapture: { path: string; files: Record<string, string> };
    viewport: { width: number; height: number; deviceScaleFactor: number };
  };
  const digest = (bytes: Buffer) =>
    createHash("sha256").update(bytes).digest("hex");
  const cover = readFileSync(new URL(provenance.artifact.path, root));
  const fixture = readFileSync(
    new URL(`../../../../../${provenance.fixture.path}`, root),
  );

  assert.equal(
    templateById("oltin-uzuk")?.previewImage,
    "/templates/oltin-uzuk/catalog-cover-opening.png",
  );
  assert.equal(provenance.artifact.path, "catalog-cover-opening.png");
  assert.equal(digest(cover), provenance.artifact.sha256);
  assert.equal(cover.toString("ascii", 1, 4), "PNG");
  assert.equal(cover.readUInt32BE(16), 450);
  assert.equal(cover.readUInt32BE(20), 800);
  assert.deepEqual(provenance.viewport, {
    width: 450,
    height: 800,
    deviceScaleFactor: 1,
  });
  assert.deepEqual(provenance.fixture.names, ["Javohir", "Madina"]);
  assert.equal(digest(fixture), provenance.fixture.sha256);
  assert.match(provenance.renderer.route, /local loopback capture wrapper/i);
  assert.equal(provenance.renderer.locale, "uz-Latn");
  assert.match(provenance.renderer.browserSettings, /Chrome defaults/);
  assert.match(provenance.renderer.browserSettings, /no proxy.*settings changed/);
  assert.match(provenance.renderer.fixtureAdapter, /createTemplatePreviewSample.*makeLegacyData/);
  assert.match(provenance.sourceCapture.files["index.html"], /^[a-f0-9]{64}$/);
  assert.match(provenance.sourceCapture.files["template.css"], /^[a-f0-9]{64}$/);
  assert.match(provenance.sourceCapture.files["template.js"], /^[a-f0-9]{64}$/);
  assert.match(provenance.renderer.captureState, /hand\/ring fallback/);
  assert.match(provenance.sourceOpening, /\.intro__fallback-scene/);
  assert.match(provenance.sourceOpening, /\.hero is excluded/);
  assert.deepEqual(provenance.renderer.captureOverrides, [
    "Show the source .intro__fallback-scene CSS art and hide the competing .rx--intro photo rig for this static opening capture only.",
    "Hide the shared locale selector .mh-lang for this static capture only.",
  ]);
  assert.deepEqual(provenance.renderer.excludedUi, [
    "Locale selector .mh-lang (renderer iframe)",
  ]);
  assert.equal(
    provenance.sourceCapture.path,
    "Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/oltin-uzuk",
  );

  const captured = readFileSync(new URL("index.html", captureRoot));
  assert.match(captured.toString("utf8"), /class="intro__copy"/);
  assert.match(captured.toString("utf8"), /class="intro__fallback-scene"/);
  assert.match(readFileSync(new URL("template.css", captureRoot), "utf8"), /\.fallback__palm/);
  assert.match(readFileSync(new URL("template.css", captureRoot), "utf8"), /\.fallback__ring/);
  for (const [file, expectedHash] of Object.entries(provenance.sourceCapture.files)) {
    assert.equal(digest(readFileSync(new URL(file, captureRoot))), expectedHash, `${file} source hash`);
  }
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
