import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { createInvitation } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
} from "../apps/web/src/modules/catalog/preview-sample";

const templateRoot = new URL("../apps/web/public/templates/qogoz-turna/", import.meta.url);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/qogoz-turna/",
  import.meta.url,
);
const read = (base: URL, file: string) => readFileSync(new URL(file, base), "utf8");
const html = read(templateRoot, "index.html");

test("Qog‘oz Turna keeps its captured design and motion source", () => {
  const normalize = (source: string) => source.replace(/\r\n/g, "\n");
  const capturedHtml = read(captureRoot, "index.html");
  const body = (source: string) => source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  const packagedScript = normalize(read(templateRoot, "template.js"));
  const capturedScript = normalize(read(captureRoot, "template.js"));

  for (const marker of [
    'class="folding-sheet"',
    'class="book-scene"',
    'class="scene-art scene-art--registan"',
    'id="dresscode"',
    'data-slot="dressCode.style"',
    'data-slot="dressCode.text"',
    'data-slot="dressCode.note"',
    'id="wishes"',
    'data-list="wishes"',
    'data-rsvp-choice="yes"',
    'data-gallery-prev',
  ]) {
    assert.ok(body(html).includes(marker), `${marker} is missing from the packaged template`);
    assert.ok(body(capturedHtml).includes(marker), `${marker} is absent from the capture`);
  }

  for (const file of ["template.css", "meta.js"]) {
    assert.equal(normalize(read(templateRoot, file)), normalize(read(captureRoot, file)), `${file} changed`);
  }
  assert.equal(
    packagedScript,
    capturedScript.replace(
      "../../shared/vendor/three/three.bundle.min.js",
      "../shared/nikoh/vendor/three/three.bundle.min.js",
    ),
    "only the shared Three.js path should differ in the packaged interaction source",
  );
  assert.equal(body(html), body(capturedHtml), "the captured invitation body should stay unchanged");
  assert.match(packagedScript, /prefers-reduced-motion/);
  assert.match(read(templateRoot, "template.css"), /prefers-reduced-motion:reduce/);
  assert.match(html, /href="contract-adapter\.css"/);
  const adapterCss = read(templateRoot, "contract-adapter.css");
  assert.match(adapterCss, /#toyona \[data-slot="toyona\.bank"\]:empty/);
  assert.match(adapterCss, /#toyona \[data-slot="toyona\.note"\]:empty/);
});

test("Qog‘oz Turna uses local fonts and only the app invitation runtime", () => {
  assert.doesNotMatch(html, /https:\/\/fonts\.googleapis\.com|sample-invitation\.js|sample-overrides\.js/);
  assert.match(html, /shared\/nikoh\/platform-bridge\.js/);
  assert.match(html, /shared\/nikoh\/core\.js/);
  assert.match(html, /fonts\.css/);

  const fontCss = read(templateRoot, "fonts.css");
  assert.match(fontCss, /font-family:Caveat/);
  assert.match(fontCss, /font-family:Lora/);
  for (const [, asset] of fontCss.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
  for (const file of ["base.css", "core.js", "platform-bridge.js", "vendor/gsap.min.js", "vendor/ScrollTrigger.min.js", "vendor/three/three.bundle.min.js"]) {
    assert.ok(existsSync(new URL(`../shared/nikoh/${file}`, templateRoot)), `${file} is missing`);
  }
  const preview = readFileSync(new URL("preview.webp", templateRoot));
  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.ok(preview.length > 10000, "the full portrait opening artwork should be packaged");
});

test("Qog‘oz Turna catalog cover matches the original metadata-declared source artwork", () => {
  const preview = readFileSync(new URL("preview.webp", templateRoot));
  const provenance = JSON.parse(read(templateRoot, "preview.provenance.json")) as {
    format: string;
    width: number;
    height: number;
    bytes: number;
    sourceUrl: string;
    sourceMetaSha256: string;
    sourcePreviewSha256: string;
    sha256: string;
  };
  const sourceMeta = readFileSync(new URL("meta.js", captureRoot));
  const sourceMetaSha256 = createHash("sha256").update(sourceMeta).digest("hex");
  const sourcePreviewSha256 = "0d8ca8a0310a4acd577af13a7637e244e3f9e75226e07112d9ba83c7722aa35d";

  assert.equal(provenance.format, "image/webp");
  assert.equal(provenance.width, 720);
  assert.equal(provenance.height, 1280);
  assert.equal(provenance.bytes, 20308);
  assert.equal(provenance.sourceUrl, "https://www.marxaba.uz/templates/qogoz-turna/preview.webp");
  assert.equal(provenance.sourceMetaSha256, sourceMetaSha256);
  assert.equal(sourceMetaSha256, "af463ed195ab443810c64ad664a9f81b547c426073f9942eeae8635a4fa757cc");
  assert.equal(provenance.sourcePreviewSha256, sourcePreviewSha256);
  assert.match(sourceMeta.toString("utf8"), /preview:\s*[\"']preview\.webp[\"']/);
  assert.equal(createHash("sha256").update(preview).digest("hex"), sourcePreviewSha256);
  assert.equal(createHash("sha256").update(preview).digest("hex"), provenance.sha256);
});

test("Qog‘oz Turna has fixed copy for every published language", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(read(templateRoot, "i18n.js"), { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const textNodes = Array.from(html.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter((text) => text.length > 1 && !["&"].includes(text) && !/^№?\s*[\d /·—-]+$/.test(text));
  const attributes = Array.from(
    html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  const metadata = Array.from(
    html.matchAll(/<meta\s+[^>]*?(?:name="description"|property="og:(?:title|description)")[^>]*?content="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  assert.deepEqual(
    [...textNodes, ...attributes, ...metadata].filter((text) => !translations[text]),
    [],
  );
  assert.ok(translations["Qog‘oz Turna · Taklifnoma"]);
  assert.ok(translations["Qog‘oz Turna — qat-qat ochiladigan nafis taklifnoma"]);
});

test("Qog‘oz Turna preview maps six localized program entries and required sections", () => {
  const sample = createTemplatePreviewSample("qogoz-turna");
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"] as const;

  assert.deepEqual(sample.enabledLocales, [...locales]);
  assert.equal(sample.program.length, 6);
  assert.equal(sample.dressCode.colors.length, 5);
  assert.equal(sample.gallery.length, 6);
  assert.ok(sample.gallery.every((item) => !item.url && !item.alt && !item.caption));
  assert.equal(sample.gift.cardNumber, "8600 1234 5678 9012");
  assert.equal(sample.gift.cardHolder, "AZIZ AZIZOV");
  assert.equal(sample.contacts.phoneNumber, "+998 90 123 45 67");
  assert.equal(sample.contacts.telegramUsername, "@demo");

  for (const locale of locales) {
    const content = sample.content[locale];
    assert.equal(Object.keys(content.programTitles).length, 6, locale);
    assert.ok(content.programTitles["sample-arrival"]);
    assert.ok(content.programTitles["sample-farewell"]);
    const wishes = getTemplatePreviewWishes(locale);
    assert.equal(wishes.length, 3);
    assert.ok(wishes.every((wish) => wish.name && wish.text));
  }

  for (const hook of [
    'id="intro"',
    'id="open-invitation"',
    'data-list="program"',
    'data-list="dresscode"',
    'data-list="gallery"',
    'data-list="wishes"',
    'data-list="contacts"',
    'data-section="toyona"',
    'data-slot="toyona.cardNumber"',
    'data-slot="toyona.cardHolder"',
  ]) {
    assert.ok(html.includes(hook), `${hook} should be present in the renderer`);
  }
});

test("Qog‘oz Turna blank invitations exclude catalog-only sample content", () => {
  const blank = createInvitation("qogoz-turna");
  const sample = createTemplatePreviewSample("qogoz-turna");

  assert.equal(blank.gift.cardNumber, "");
  assert.equal(blank.gift.cardHolder, "");
  assert.deepEqual(blank.contacts, { phoneNumber: "", telegramUsername: "", instagramUrl: "" });
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.equal("sampleWishes" in sample, false);
  const serializedSample = JSON.stringify(sample);
  for (const wish of getTemplatePreviewWishes("uz-Latn")) {
    assert.equal(serializedSample.includes(wish.name), false);
    assert.equal(serializedSample.includes(wish.text), false);
  }
});
