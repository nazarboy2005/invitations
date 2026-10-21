import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { runInNewContext } from "node:vm";
import test from "node:test";
import {
  defaultLocalizedInvitationContent,
  templateById,
} from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = process.cwd();
const source = path.join(
  root,
  "Invitations - this folder will be removed from production/Marxaba/Boshqa tadbirlar/templates/korporativ",
);
const pkg = path.join(root, "apps/web/public/templates/korporativ");
const renderer = path.join(root, "apps/web/src/templates/korporativ");
const read = (base: string, file: string) =>
  readFileSync(path.join(base, file), "utf8");
const normalize = (value: string) =>
  value.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
const body = (html: string) =>
  normalize(html).match(/<body[\s\S]*?<\/body>/)?.[0].trim() ?? "";

test("Korporativ is registered unpublished with exact source event compatibility", () => {
  const wrapper = read(renderer, "renderer.tsx");
  assert.match(wrapper, /templateId="korporativ"/);
  assert.match(read(renderer, "index.ts"), /KorporativInvitation/);
  const notes = read(renderer, "README.md");
  assert.match(notes, /program\[\]\.speaker/);
  assert.match(notes, /extras\.parking/);
  assert.match(notes, /venue\.photo/);
  assert.match(notes, /registered but remains unpublished/);
  const definition = templateById("korporativ");
  assert.ok(definition);
  assert.equal(definition.published, false);
  assert.equal(definition.previewEventType, "korporativ");
  assert.deepEqual(definition.supportedEventTypes, [
    "korporativ",
    "bitiruv",
    "yubiley",
  ]);
  assert.deepEqual(definition.categoryIds, ["other"]);
});

test("central sample and default contract content cover corporate locales", () => {
  const sample = createTemplatePreviewSample("korporativ");
  assert.equal(sample.eventType, "korporativ");
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
    const localized = sample.content[locale];
    assert.equal(localized.people.length, 1);
    assert.ok(localized.people[0]);
    assert.ok(localized.hosts);
    assert.ok(localized.eventLabel);
    assert.ok(localized.message);
    assert.ok(localized.programHeading);
    assert.equal(Object.keys(localized.programTitles).length, 6);
    assert.ok(sample.dressCode.style[locale]);
    assert.ok(sample.dressCode.text[locale]);
    const defaultContent = defaultLocalizedInvitationContent("korporativ", locale);
    assert.ok(defaultContent.eventLabel);
    assert.ok(defaultContent.programHeading);
    assert.ok(defaultContent.message);
  }
  assert.equal(sample.dressCode.colors.length, 4);
  assert.doesNotMatch(
    sample.dressCode.note["uz-Latn"],
    /kelin|oq rang/i,
    "corporate sample should not inherit bridal dress guidance",
  );
});

test("captured body, source files, metadata, and SVG artworks are preserved", () => {
  assert.equal(body(read(pkg, "index.html")), body(read(source, "index.html")));
  for (const file of ["template.css", "i18n.js", "meta.js"])
    assert.deepEqual(
      readFileSync(path.join(pkg, file)),
      readFileSync(path.join(source, file)),
      `${file} matches capture`,
    );
  assert.equal(
    read(pkg, "template.js"),
    read(source, "template.js").replace(
      'script.src = "../../shared/vendor/three/three.bundle.min.js";',
      'script.src = "../shared/nikoh/vendor/three/three.bundle.min.js";',
    ),
    "only the local Three.js dependency path is adapted",
  );
  for (const file of ["event-01.svg", "event-02.svg", "event-03.svg", "venue.svg"])
    assert.deepEqual(
      readFileSync(path.join(pkg, "art", file)),
      readFileSync(path.join(source, "art", file)),
      `art/${file} matches capture`,
    );

  const metadata: { window: { TEMPLATE_META?: Record<string, unknown> } } = {
    window: {},
  };
  runInNewContext(read(pkg, "meta.js"), metadata);
  assert.equal(metadata.window.TEMPLATE_META?.slug, "korporativ");
  assert.deepEqual(
    Array.from(metadata.window.TEMPLATE_META?.eventTypes as string[]),
    ["korporativ", "bitiruv", "yubiley"],
  );
  assert.equal(metadata.window.TEMPLATE_META?.preview, "preview.webp");
  const preview = readFileSync(path.join(pkg, "preview.webp"));
  assert.ok(preview.subarray(0, 4).equals(Buffer.from("RIFF")));
  assert.ok(preview.subarray(8, 12).equals(Buffer.from("WEBP")));
  assert.match(read(pkg, "index.html"), /property="og:image" content="preview\.webp"/);
});

test("package depends only on local runtime, styles, and assets", () => {
  const html = read(pkg, "index.html");
  assert.match(html, /platform-bridge\.js/);
  assert.match(html, /fonts\.css/);
  assert.match(html, /href="contract-adapter\.css"/);
  assert.doesNotMatch(
    html,
    /sample-invitation|sample-overrides|fonts\.googleapis|fonts\.gstatic|preconnect/,
  );
  for (const file of [
    "../shared/nikoh/base.css",
    "../shared/nikoh/vendor/gsap.min.js",
    "../shared/nikoh/vendor/ScrollTrigger.min.js",
    "../shared/nikoh/vendor/lz-string.min.js",
    "../shared/nikoh/invite-codec.js",
    "../shared/nikoh/i18n.js",
    "../shared/nikoh/platform-bridge.js",
    "../shared/nikoh/core.js",
  ])
    assert.ok(existsSync(path.resolve(pkg, file)), `${file} exists`);

  const references = [
    ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (match) => match[1]),
    ...Array.from(
      read(pkg, "fonts.css").matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g),
      (match) => match[1],
    ),
    ...Array.from(
      read(pkg, "template.css").matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g),
      (match) => match[1],
    ),
  ].filter((ref) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(ref));
  for (const reference of references)
    assert.ok(
      existsSync(path.resolve(pkg, reference)),
      `missing local asset ${reference}`,
    );
  assert.match(read(pkg, "contract-adapter.css"), /\.venue__photo/);
  assert.match(read(pkg, "contract-adapter.css"), /\.venue__parking/);
  assert.match(read(pkg, "contract-adapter.css"), /speaker/);
  const adaptation = read(pkg, "SOURCE_ADAPTATIONS.md");
  for (const unsupported of ["program[].speaker", "extras.parking", "venue.photo"])
    assert.ok(adaptation.includes(unsupported), `documented ${unsupported}`);
});

test("captured scripts retain motion behavior and local font coverage", () => {
  const script = read(pkg, "template.js");
  assert.match(script, /reducedMotion/);
  assert.match(script, /ScrollTrigger/);
  assert.match(read(pkg, "template.css"), /prefers-reduced-motion:reduce/);
  const fontCss = read(pkg, "fonts.css");
  assert.match(fontCss, /font-family:Inter/);
  assert.match(fontCss, /font-family:'Space Grotesk';font-style:normal;font-weight:500/);
  assert.match(fontCss, /font-family:'Space Grotesk';font-style:normal;font-weight:600/);
  for (const subset of ["latin", "latin-ext", "cyrillic", "cyrillic-ext"])
    assert.ok(fontCss.includes(`-${subset}.woff2`), `missing ${subset} Inter subset`);
  assert.doesNotMatch(fontCss, /https?:\/\//);
});
