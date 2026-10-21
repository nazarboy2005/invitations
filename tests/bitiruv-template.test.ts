import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";
import {
  defaultEventLabel,
  defaultInvitationMessage,
  defaultLocalizedInvitationContent,
  templateById,
} from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = process.cwd();
const source = path.join(
  root,
  "Invitations - this folder will be removed from production/Marxaba/Boshqa tadbirlar/templates/bitiruv",
);
const sourceVendor = path.join(
  root,
  "Invitations - this folder will be removed from production/Marxaba/Boshqa tadbirlar/shared/vendor",
);
const pkg = path.join(root, "apps/web/public/templates/bitiruv");
const renderer = path.join(root, "apps/web/src/templates/bitiruv");
const read = (base: string, name: string) =>
  readFileSync(path.join(base, name), "utf8");
const body = (html: string) =>
  html
    .match(/<body[\s\S]*?<\/body>/)?.[0]
    .trim()
    .replace(/\r\n/g, "\n") ?? "";

test("Bitiruv is integrated as an unpublished template with the exact supported events", () => {
  assert.match(read(renderer, "renderer.tsx"), /templateId="bitiruv"/);
  assert.match(read(renderer, "index.ts"), /BitiruvInvitation/);
  assert.doesNotMatch(
    read(renderer, "renderer.tsx"),
    /preview-sample|INVITATION_OVERRIDES/,
  );
  const definition = templateById("bitiruv");
  assert.ok(definition);
  assert.equal(definition.published, false);
  assert.equal(definition.previewEventType, "bitiruv");
  assert.deepEqual(definition.supportedEventTypes, [
    "bitiruv",
    "birthday",
    "korporativ",
  ]);
  assert.deepEqual(definition.categoryIds, ["other"]);
});

test("event labels, default copy, and sample content cover every locale", () => {
  const fixture = JSON.parse(
    read(
      path.join(root, "apps/web/src/modules/catalog"),
      "preview-sample.json",
    ),
  );
  for (const eventType of ["bitiruv", "korporativ"] as const) {
    const labelSet = new Set<string>();
    for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
      const localized = defaultLocalizedInvitationContent(eventType, locale);
      assert.equal(localized.eventLabel, defaultEventLabel(eventType, locale));
      assert.ok(localized.programHeading);
      assert.ok(defaultInvitationMessage(eventType, locale));
      assert.equal(fixture.eventSamples[eventType].personName[locale].length > 0, true);
      assert.equal(fixture.eventSamples[eventType].programTitles[locale].length, 6);
      labelSet.add(defaultEventLabel(eventType, locale));
      const sample = createTemplatePreviewSample("bitiruv", {
        defaultLocale: locale,
        enabledLocales: [locale],
      });
      assert.equal(sample.eventType, "bitiruv");
      assert.deepEqual(sample.content[locale].people, [
        fixture.eventSamples.bitiruv.personName[locale],
      ]);
    }
    assert.equal(labelSet.size, 4);
  }
  assert.equal(createTemplatePreviewSample("bitiruv").eventType, "bitiruv");
});

test("Bitiruv maps only one person's initial and hides unsupported venue photography", () => {
  const adapter = read(
    path.join(root, "apps/web/src/templates/marxaba"),
    "renderer.tsx",
  );
  assert.match(adapter, /templateId === "bitiruv"[\s\S]*?monogram: \(sourceData\.groom \|\| sourceData\.bride\)\.trim\(\)\.charAt\(0\)/);
  assert.match(adapter, /templateId === "bitiruv"[\s\S]*?monogram: \(localized\.groom \|\| localized\.bride\)[\s\S]*?\.charAt\(0\)/);
  const html = read(pkg, "index.html");
  assert.match(html, /href="contract-adapter\.css"/);
  assert.match(read(pkg, "contract-adapter.css"), /#venue \.venue__photo\s*\{\s*display:\s*none/);
  assert.match(html, /data-photo="venue\.photo"/);
  assert.ok(!/venuePhoto|venue\.photo\s*:/i.test(adapter));
  const editor = read(
    path.join(root, "apps/web/src/modules/studio"),
    "studio.tsx",
  );
  assert.match(editor, /templateDefinition\.previewEventType\s*\?\?/);
  assert.match(editor, /invitation\.eventType === "bitiruv"/);
  assert.match(editor, /invitation\.eventType === "korporativ"/);
  assert.match(editor, /invitation\.templateId === "bitiruv"/);
  assert.match(editor, /singleCelebrantLabel/);
  assert.match(editor, /!singleCelebrant && \(/);
});

test("Bitiruv retains the captured structure, styling, translations, metadata, and artwork", () => {
  assert.equal(body(read(pkg, "index.html")), body(read(source, "index.html")));
  for (const name of ["template.css", "i18n.js", "meta.js"])
    assert.deepEqual(
      readFileSync(path.join(pkg, name)),
      readFileSync(path.join(source, name)),
      `${name} matches the capture`,
    );
  const sourceScript = read(source, "template.js").replace(
    "../../shared/vendor/three/three.bundle.min.js",
    "vendor/three/three.bundle.min.js",
  );
  assert.equal(read(pkg, "template.js"), sourceScript);
  assert.match(read(pkg, "template.js"), /prefers-reduced-motion/);
  assert.match(read(pkg, "template.js"), /ScrollTrigger/);
  assert.deepEqual(
    readFileSync(path.join(pkg, "art/graduation-scene.webp")),
    readFileSync(path.join(source, "art/graduation-scene.webp")),
  );
  for (const section of [
    "intro", "hero", "invitation-text", "date", "program", "venue",
    "dresscode", "gallery", "rsvp", "wishes", "toyona", "contacts", "footer",
  ])
    assert.match(
      read(pkg, "index.html"),
      new RegExp(`(?:data-section|id)="${section}"`),
      `${section} remains in the captured source`,
    );
});

test("all fixed copy and accessible labels have Russian and English translations", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(
    readFileSync(path.join(root, "apps/web/public/templates/shared/nikoh/i18n.js"), "utf8"),
    { window },
  );
  runInNewContext(read(pkg, "i18n.js"), { window });
  const translations = window.MARHAMAT_I18N!;
  const sourceBody = read(pkg, "index.html").match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  const ignored = new Set(["00", "&", "✦", "◈", "↗", "×", "?", "−", "+"]);
  const visible = Array.from(sourceBody.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter((value) => value.length > 1 && !ignored.has(value));
  const attributes = Array.from(
    sourceBody.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  assert.deepEqual(
    [...visible, ...attributes].filter((value) => !translations[value]),
    [],
  );
});

test("Bitiruv uses local source animation dependencies and no captured sample payload", () => {
  const html = read(pkg, "index.html");
  assert.match(html, /platform-bridge\.js/);
  assert.match(html, /fonts\.css/);
  assert.doesNotMatch(
    html,
    /sample-invitation|sample-overrides|fonts\.googleapis|fonts\.gstatic|preconnect/,
  );
  for (const name of [
    "gsap.min.js",
    "ScrollTrigger.min.js",
    "lz-string.min.js",
  ])
    assert.deepEqual(
      readFileSync(path.join(pkg, "vendor", name)),
      readFileSync(path.join(sourceVendor, name)),
      `${name} matches the captured shared dependency`,
    );
  assert.deepEqual(
    readFileSync(path.join(pkg, "vendor/three/three.bundle.min.js")),
    readFileSync(path.join(sourceVendor, "three/three.bundle.min.js")),
  );
  const references = [
    ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (m) => m[1]),
    ...Array.from(
      read(pkg, "fonts.css").matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g),
      (m) => m[1],
    ),
    ...Array.from(
      read(pkg, "template.css").matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g),
      (m) => m[1],
    ),
  ].filter((ref) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(ref));
  for (const ref of references)
    assert.ok(
      existsSync(path.resolve(pkg, ref)),
      `missing local reference ${ref}`,
    );
  assert.ok(existsSync(path.join(pkg, "vendor/three/three.bundle.min.js")));
  assert.ok(existsSync(path.join(pkg, "preview.webp")));
});

test("Bitiruv bundles each exact requested font family and supported glyph subsets", () => {
  const css = read(pkg, "fonts.css");
  for (const family of ["Bebas Neue", "Manrope"])
    assert.match(css, new RegExp(`font-family:\\s*'${family}'`));
  for (const subset of [
    "latin",
    "latin-ext",
    "cyrillic",
    "cyrillic-ext",
    "greek",
    "vietnamese",
  ])
    assert.ok(
      css.includes(`-${subset}.woff2`),
      `missing ${subset} font subset`,
    );
  for (const font of readdirSync(path.join(pkg, "fonts")))
    assert.ok(existsSync(path.join(pkg, "fonts", font)));
  assert.doesNotMatch(css, /https?:\/\//);
});

test("Bitiruv opening art is a fixture-derived, checksummed portrait capture", () => {
  const image = readFileSync(path.join(pkg, "preview.webp"));
  const provenance = JSON.parse(read(pkg, "preview.provenance.json")) as {
    width: number;
    height: number;
    fixture: string;
    fixtureLocale: string;
    fixtureNames: string[];
    sourceOpening: string;
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
  assert.deepEqual(
    [image.readUInt16LE(26) & 0x3fff, image.readUInt16LE(28) & 0x3fff],
    [480, 720],
  );
  assert.equal(provenance.width, 480);
  assert.equal(provenance.height, 720);
  assert.equal(
    provenance.fixture,
    "apps/web/src/modules/catalog/preview-sample.json",
  );
  assert.equal(provenance.fixtureLocale, fixture.defaultLocale);
  assert.deepEqual(
    provenance.fixtureNames,
    fixture.content[fixture.defaultLocale].people,
  );
  assert.match(provenance.sourceOpening, /captured Bitiruv diploma opening/);
  assert.equal(
    provenance.sha256,
    createHash("sha256").update(image).digest("hex"),
  );
});

test("Bitiruv metadata preserves its source declarations and records resolved adaptations", () => {
  const metadata = read(pkg, "meta.js");
  assert.match(metadata, /category: "bitiruv"/);
  assert.match(
    metadata,
    /eventTypes: \["bitiruv", "tugilgan-kun", "korporativ"\]/,
  );
  const notes = read(pkg, "SOURCE_ADAPTATIONS.md");
  for (const detail of [
    "korporativ",
    "venue.photo",
    "first character",
    "existing `other` category",
  ])
    assert.ok(
      notes.includes(detail),
      `missing documented contract adaptation: ${detail}`,
    );
});
