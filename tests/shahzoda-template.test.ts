import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = process.cwd();
const source = path.join(
  root,
  "Invitations - this folder will be removed from production/Marxaba/Sunnat to'yi/templates/shahzoda",
);
const pkg = path.join(root, "apps/web/public/templates/shahzoda");
const renderer = path.join(root, "apps/web/src/templates/shahzoda");
const read = (base: string, name: string) =>
  readFileSync(path.join(base, name), "utf8");
const body = (html: string) =>
  html
    .match(/<body[\s\S]*?<\/body>/)?.[0]
    .trim()
    .replace(/\r\n/g, "\n") ?? "";

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
    assert.deepEqual(
      readFileSync(path.join(pkg, name)),
      readFileSync(path.join(source, name)),
    );
  const sourceArt = readdirSync(path.join(source, "art")).sort();
  assert.deepEqual(readdirSync(path.join(pkg, "art")).sort(), sourceArt);
  for (const name of sourceArt)
    assert.deepEqual(
      readFileSync(path.join(pkg, "art", name)),
      readFileSync(path.join(source, "art", name)),
    );
  assert.match(read(pkg, "template.js"), /prefers-reduced-motion/);
});

test("Shahzoda packages no captured sample loader or remote fonts", () => {
  const html = read(pkg, "index.html");
  assert.doesNotMatch(
    html,
    /sample-invitation|sample-overrides|fonts\.googleapis|fonts\.gstatic/,
  );
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
  assert.match(read(pkg, "SOURCE_ADAPTATIONS.md"), /labels the field “Bola ismi”/);
  assert.match(read(pkg, "index.html"), /href="contract-adapter\.css"/);
  assert.match(
    read(pkg, "contract-adapter.css"),
    /\.plaque h1 \[data-slot="groom"\]\.platform-name-fit--single-wrap\s*\{\s*display:\s*block !important;[\s\S]*white-space:\s*normal !important;[\s\S]*overflow-wrap:\s*anywhere !important/,
  );
  assert.match(
    read(pkg, "contract-adapter.css"),
    /\.hero__name\[data-slot="groom"\]\.platform-name-fit--single-wrap\s*\{[\s\S]*white-space:\s*normal !important;[\s\S]*overflow-wrap:\s*anywhere !important/,
  );
});

test("Shahzoda uses the shared single-honoree creator field for Sunnat", () => {
  const editor = read(
    path.join(root, "apps/web/src/modules/studio"),
    "studio.tsx",
  );
  assert.match(editor, /invitation\.eventType === "sunnat-toyi"/);
  assert.match(editor, /: "Bola ismi"/);
  assert.match(editor, /singleCelebrant && index === 0/);
});

test("Shahzoda localizes every visible and accessible source label", () => {
  const context = { window: { MARHAMAT_I18N: {} } };
  runInNewContext(
    readFileSync(
      path.join(root, "apps/web/public/templates/shared/nikoh/i18n.js"),
      "utf8",
    ),
    context,
  );
  const translations = context.window.MARHAMAT_I18N as Record<string, string[]>;
  const sourceBody = body(read(pkg, "index.html"));
  const textNodes = Array.from(sourceBody.matchAll(/>([^<>]+)</g), (match) =>
    match[1]
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim(),
  ).filter(
    (text) =>
      text.length > 1 &&
      !["&", "♛", "♞", "♧", "✦", "✧", "◷", "✦ ✧ ✦"].includes(text) &&
      !/^№?\s*[\d /·—-]+$/.test(text),
  );
  const attributes = Array.from(
    sourceBody.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  assert.deepEqual(
    [...textNodes, ...attributes].filter((text) => !translations[text]),
    [],
    "all visible source copy and accessible labels must translate to Russian and English",
  );

  const metadata = read(pkg, "locale-copy.js");
  for (const text of [
    "Шаҳзода · Таклифнома",
    "Shahzoda · Invitation",
    "Шахзода · Приглашение",
  ])
    assert.ok(
      metadata.includes(text),
      `missing localized document metadata: ${text}`,
    );
});

test("Shahzoda's font faces and all template resource links resolve locally", () => {
  const html = read(pkg, "index.html");
  const fonts = read(pkg, "fonts.css");
  assert.match(fonts, /font-family:'Montserrat'/);
  assert.match(fonts, /font-family:'Yeseva One'/);
  assert.match(fonts, /font-weight:400 700/);
  assert.equal([...fonts.matchAll(/@font-face/g)].length, 10);
  const references = [
    ...Array.from(
      html.matchAll(/(?:src|href)="([^"]+)"/g),
      (match) => match[1],
    ),
    ...Array.from(
      fonts.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g),
      (match) => match[1],
    ),
    ...Array.from(
      read(pkg, "template.css").matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g),
      (match) => match[1],
    ),
  ].filter((ref) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(ref));
  for (const reference of references) {
    const cleanPath = reference.split(/[?#]/, 1)[0];
    assert.ok(
      readFileSync(path.resolve(pkg, cleanPath)).byteLength > 0,
      `missing local asset ${reference}`,
    );
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
    captureViewport: {
      width: number;
      height: number;
      deviceScaleFactor: number;
    };
    sha256: string;
  };
  const fixture = JSON.parse(
    read(
      path.join(root, "apps/web/src/modules/catalog"),
      "preview-sample.json",
    ),
  );

  assert.equal(image.toString("ascii", 0, 4), "RIFF");
  assert.equal(image.toString("ascii", 8, 12), "WEBP");
  assert.equal(image.toString("ascii", 12, 16), "VP8 ");
  assert.deepEqual(
    [image.readUInt16LE(26) & 0x3fff, image.readUInt16LE(28) & 0x3fff],
    [720, 1280],
  );
  assert.equal(provenance.format, "image/webp");
  assert.deepEqual([provenance.width, provenance.height], [720, 1280]);
  assert.deepEqual(provenance.captureViewport, {
    width: 720,
    height: 1280,
    deviceScaleFactor: 1,
  });
  assert.equal(provenance.sourcePage, "/templates/shahzoda/index.html?lang=uz");
  assert.equal(provenance.sourceOpening, "intro curtain and plaque");
  assert.equal(
    provenance.fixture,
    "apps/web/src/modules/catalog/preview-sample.json",
  );
  assert.equal(provenance.fixtureLocale, fixture.defaultLocale);
  const sample = createTemplatePreviewSample("shahzoda");
  assert.deepEqual(
    provenance.fixtureNames,
    sample.content[fixture.defaultLocale].people,
  );
  assert.deepEqual(sample.enabledLocales, ["uz-Latn", "uz-Cyrl", "en", "ru"]);
  assert.equal(sample.eventType, "sunnat-toyi");
  assert.equal(sample.content[fixture.defaultLocale].people.length, 1);
  for (const locale of sample.enabledLocales) {
    const content = sample.content[locale];
    assert.ok(content.people[0], `missing Shahzoda honoree for ${locale}`);
    assert.ok(
      content.hosts &&
        content.greeting &&
        content.message &&
        content.venueName &&
        content.address,
    );
    assert.ok(sample.program.length >= 1);
    assert.ok(sample.program.every((item) => content.programTitles[item.id]));
    assert.ok(
      sample.dressCode.style[locale] &&
        sample.dressCode.text[locale] &&
        sample.dressCode.note[locale],
    );
    assert.ok(sample.dressCode.colors.every((color) => color.name[locale]));
  }
  assert.equal(
    provenance.sha256,
    createHash("sha256").update(image).digest("hex"),
  );
});
