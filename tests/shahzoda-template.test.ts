import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const source = path.join(
  root,
  "Invitations - this folder will be removed from production/Marxaba/Sunnat to'yi/templates/shahzoda",
);
const pkg = path.join(root, "apps/web/public/templates/shahzoda");
const renderer = path.join(root, "apps/web/src/templates/shahzoda");
const read = (base: string, name: string) => readFileSync(path.join(base, name), "utf8");
const body = (html: string) =>
  html.match(/<body[\s\S]*?<\/body>/)?.[0].trim().replace(/\r\n/g, "\n") ?? "";

test("Shahzoda has a typed renderer for its captured Sunnat design", () => {
  const wrapper = read(renderer, "renderer.tsx");
  assert.match(wrapper, /templateId="shahzoda"/);
  assert.match(wrapper, /eventType: "sunnat-toyi"/);
  assert.match(wrapper, /eventLabel: ""/);
  assert.match(read(renderer, "index.ts"), /ShahzodaInvitation/);
});

test("Shahzoda preserves captured source files and artwork with only documented body bindings", () => {
  const sourceHtml = read(source, "index.html");
  const expectedBody = body(sourceHtml)
    .replaceAll('data-slot="extras.celebrant"', 'data-slot="groom"')
    .replace(
      "22 · 11 · 2026",
      '<span data-slot="date.day"></span> · <span data-slot="date.monthNumber"></span> · <span data-slot="date.year"></span>',
    );
  assert.equal(body(read(pkg, "index.html")), expectedBody);
  for (const name of ["template.css", "template.js", "meta.js"])
    assert.deepEqual(readFileSync(path.join(pkg, name)), readFileSync(path.join(source, name)));
  const sourceArt = readdirSync(path.join(source, "art")).sort();
  assert.deepEqual(readdirSync(path.join(pkg, "art")).sort(), sourceArt);
  for (const name of sourceArt)
    assert.deepEqual(readFileSync(path.join(pkg, "art", name)), readFileSync(path.join(source, "art", name)));
  assert.match(read(pkg, "template.js"), /prefers-reduced-motion/);
});

test("Shahzoda packages no captured sample loader or remote fonts", () => {
  const html = read(pkg, "index.html");
  assert.doesNotMatch(html, /sample-invitation|sample-overrides|fonts\.googleapis|fonts\.gstatic/);
  assert.doesNotMatch(html, /Abdulloh|Karimovlar|22 · 11 · 2026/);
  assert.match(html, /data-slot="groom"/);
  assert.match(html, /data-slot="date\.day"/);
  assert.match(html, /data-slot="date\.monthNumber"/);
  assert.match(html, /data-slot="date\.year"/);
  assert.match(html, /data-list="program"/);
  assert.match(html, /data-list="gallery"/);
  assert.match(html, /data-rsvp/);
  assert.match(html, /data-list="wishes"/);
  assert.match(html, /data-section="toyona"/);
  assert.match(html, /data-list="contacts"/);
  assert.match(html, /data-dresscode/);
  assert.match(read(pkg, "locale-copy.js"), /Шахзода · Приглашение/);
  assert.match(read(pkg, "SOURCE_ADAPTATIONS.md"), /Kuyov ismi/);
});

test("Shahzoda's font faces and all template resource links resolve locally", () => {
  const html = read(pkg, "index.html");
  const fonts = read(pkg, "fonts.css");
  assert.match(fonts, /font-family:'Montserrat'/);
  assert.match(fonts, /font-family:'Yeseva One'/);
  assert.match(fonts, /font-weight:400 700/);
  assert.equal([...fonts.matchAll(/@font-face/g)].length, 10);
  const references = [
    ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (match) => match[1]),
    ...Array.from(fonts.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g), (match) => match[1]),
    ...Array.from(read(pkg, "template.css").matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g), (match) => match[1]),
  ].filter((ref) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(ref));
  for (const reference of references) {
    const cleanPath = reference.split(/[?#]/, 1)[0];
    assert.ok(readFileSync(path.resolve(pkg, cleanPath)).byteLength > 0, `missing local asset ${reference}`);
  }
});

test("Shahzoda preview is an authentic portrait opening capture of the canonical fixture", () => {
  const image = readFileSync(path.join(pkg, "preview.webp"));
  const provenance = JSON.parse(read(pkg, "preview.provenance.json")) as {
    format: string;
    width: number;
    height: number;
    sourcePage: string;
    sourceOpening: string;
    fixture: string;
    fixtureLocale: string;
    fixtureNames: string[];
    captureViewport: { width: number; height: number; deviceScaleFactor: number };
    sha256: string;
  };
  const fixture = JSON.parse(read(path.join(root, "apps/web/src/modules/catalog"), "preview-sample.json"));

  assert.equal(image.toString("ascii", 0, 4), "RIFF");
  assert.equal(image.toString("ascii", 8, 12), "WEBP");
  assert.equal(image.toString("ascii", 12, 16), "VP8 ");
  assert.deepEqual([image.readUInt16LE(26) & 0x3fff, image.readUInt16LE(28) & 0x3fff], [720, 1280]);
  assert.equal(provenance.format, "image/webp");
  assert.deepEqual([provenance.width, provenance.height], [720, 1280]);
  assert.deepEqual(provenance.captureViewport, { width: 720, height: 1280, deviceScaleFactor: 1 });
  assert.equal(provenance.sourcePage, "/templates/shahzoda/index.html?lang=uz");
  assert.equal(provenance.sourceOpening, "intro curtain and plaque");
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.equal(provenance.fixtureLocale, fixture.defaultLocale);
  assert.deepEqual(provenance.fixtureNames, fixture.content[fixture.defaultLocale].people);
  assert.equal(provenance.sha256, createHash("sha256").update(image).digest("hex"));
});
