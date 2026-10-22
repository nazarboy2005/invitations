import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
import {
  createInvitation,
  defaultLocalizedInvitationContent,
  templateById,
} from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";
import { CATALOG_PREVIEW_MUSIC } from "../apps/web/src/modules/catalog/catalog-music";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => { module.exports = {}; };
const moduleRuntime = require("node:module") as { _resolveFilename: (...args: any[]) => string };
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/") ? path.resolve(webSourceRoot, request.slice(2)) : request;
  return resolveFilename.call(this, resolved, ...args);
};

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
  const sharedRenderer = read("apps/web/src/templates/marxaba", "renderer.tsx");
  assert.match(sharedRenderer, /extras:\s*\{\s*celebrant:\s*sourceData\.groom\s*\|\|\s*sourceData\.bride\s*\}/);
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

test("Korporativ catalog preview uses the shared Emotional Piano default", () => {
  const fullPreview = read(
    "apps/web/src/modules/catalog",
    "full-template-preview.tsx",
  );
  const sharedRenderer = read("apps/web/src/templates/marxaba", "renderer.tsx");
  assert.match(fullPreview, /catalogMusic={catalogPreview}/);
  assert.match(sharedRenderer, /catalogMusic\s*\?\s*CATALOG_PREVIEW_MUSIC\.url/);
  assert.equal(CATALOG_PREVIEW_MUSIC.url, "/music/catalog/emotional-piano.wav");
  assert.ok(
    existsSync(path.join(root, "apps/web/public", CATALOG_PREVIEW_MUSIC.url)),
    "the shared default audio asset is packaged",
  );
});

test("captured body, source files, metadata, and SVG artworks are preserved", () => {
  assert.equal(body(read(pkg, "index.html")), body(read(source, "index.html")));
  for (const file of ["template.css", "i18n.js", "meta.js"])
    assert.equal(
      normalize(read(pkg, file)),
      normalize(read(source, file)),
      `${file} matches capture`,
    );
  assert.equal(
    normalize(read(pkg, "template.js")),
    normalize(read(source, "template.js")).replace(
      'script.src = "../../shared/vendor/three/three.bundle.min.js";',
      'script.src = "../shared/nikoh/vendor/three/three.bundle.min.js";',
    ),
    "only the local Three.js dependency path is adapted",
  );
  for (const file of ["event-01.svg", "event-02.svg", "event-03.svg", "venue.svg"])
    assert.equal(
      normalize(read(pkg, `art/${file}`)),
      normalize(read(source, `art/${file}`)),
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
  assert.deepEqual(
    [preview.readUInt16LE(26) & 0x3fff, preview.readUInt16LE(28) & 0x3fff],
    [720, 1280],
  );
  const provenance = JSON.parse(read(pkg, "preview.provenance.json")) as {
    remoteDeclaredAsset: {
      url: string;
      sha256: string;
      fixtureEventLabel: string;
      matchesCanonicalFixture: boolean;
    };
  };
  assert.equal(provenance.remoteDeclaredAsset.url, "https://www.marxaba.uz/templates/korporativ/preview.webp");
  assert.equal(
    createHash("sha256").update(preview).digest("hex"),
    provenance.remoteDeclaredAsset.sha256,
  );
  assert.equal(provenance.remoteDeclaredAsset.matchesCanonicalFixture, true);
  assert.equal(provenance.remoteDeclaredAsset.fixtureEventLabel, "Yil yakuni kechasi");
  const adaptation = read(pkg, "SOURCE_ADAPTATIONS.md");
  assert.match(adaptation, /preview\.provenance\.json/);
  assert.match(adaptation, /14 November 2026, 18:30/);
  assert.match(read(pkg, "index.html"), /property="og:image" content="preview\.webp"/);
});

test("Korporativ packages the official metadata-declared catalog image", () => {
  const sourceMeta = read(source, "meta.js");
  const sourceHtml = read(source, "index.html");
  assert.match(sourceMeta, /preview:\s*"preview\.webp"/);
  assert.match(sourceHtml, /property="og:image" content="og\.jpg"/);
  for (const missing of ["preview.webp", "og.jpg"])
    assert.equal(existsSync(path.join(source, missing)), false, `${missing} is absent from the capture`);

  const manifest = JSON.parse(
    readFileSync(
      path.join(
        root,
        "Invitations - this folder will be removed from production/Marxaba/capture-manifest.json",
      ),
      "utf8",
    ),
  ) as { resources: Record<string, unknown> };
  const capturedImages = Object.keys(manifest.resources).filter(
    (url) => url.includes("/templates/korporativ/") && /\.(?:webp|png|jpe?g)$/i.test(url),
  );
  assert.deepEqual(capturedImages, [], "capture manifest contains no raster opener");

  const provenance = read(pkg, "SOURCE_ART_PROVENANCE.md");
  assert.match(provenance, /official metadata URL/);
  assert.match(provenance, /authentic catalog artwork/);
  assert.match(provenance, /separate release gates/);
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
  assert.match(read(pkg, "contract-adapter.css"), /\[data-slot="toyona\.bank"\]/);
  assert.match(
    read(pkg, "contract-adapter.css"),
    /\.gallery__item\.has-missing-photo\s*>\s*span:not\(\.photo-placeholder\)\s*\{\s*display:\s*none/s,
    "empty gallery cards hide the repeated source label but keep the shared icon placeholder",
  );
  const adaptation = read(pkg, "SOURCE_ADAPTATIONS.md");
  for (const unsupported of ["program[].speaker", "extras.parking", "venue.photo"])
    assert.ok(adaptation.includes(unsupported), `documented ${unsupported}`);
  assert.match(adaptation, /To‘yona note\/bank slots/);
});

test("Korporativ adapts a single honoree and every preview-only sample field across locales", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("korporativ");
  assert.equal(sample.startsAt, "2026-11-14T18:30");
  assert.equal(sample.content["uz-Latn"].eventLabel, "Yil yakuni kechasi");
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
    const localized = sample.content[locale];
    const data = makeLegacyData(sample, locale, "Hurmatli mehmon", true);
    assert.equal(localized.people.length, 1);
    assert.equal(localized.people[0], "Marxaba Tech");
    assert.equal(data.groom, localized.people[0]);
    assert.equal(data.bride, "");
    assert.equal(data.hosts, localized.hosts);
    assert.equal(data.eventType, localized.eventLabel);
    assert.equal(data.message, localized.message);
    assert.equal(data.date.long.length > 0, true);
    assert.equal(data.venue.name, localized.venueName);
    assert.equal(data.venue.address, [localized.address, localized.landmark].filter(Boolean).join(" · "));
    assert.equal("photo" in data.venue, false);
    assert.equal(data.program.length, 6);
    assert.ok(data.program.every((item) => item.title));
    assert.ok(data.program.every((item) => !("speaker" in item)));
    assert.equal(data.dressCode.enabled, true);
    assert.equal(data.dressCode.text, sample.dressCode.text[locale]);
    assert.equal(data.dressCode.colors.length, 4);
    assert.equal(data.gallery.length, 6);
    assert.ok(data.gallery.every((item) => item.src === "" && item.alt === ""));
    assert.equal(data.wishes.length, 3);
    assert.ok(data.wishes.every((wish) => wish.name && wish.text));
    assert.equal(data.toyona.enabled, true);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV");
    assert.equal(data.toyona.note, "");
    assert.equal("bank" in data.toyona, false);
    assert.deepEqual(data.contacts.map((contact) => contact.value), ["+998 90 123 45 67", "@demo"]);
  }

  const blank = makeLegacyData(createInvitation("korporativ"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.message, "");
  assert.equal(blank.venue.name, "");
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.contacts.length, 0);
  assert.equal(blank.dressCode.enabled, false);
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

test("captured fixed copy and accessibility labels have Russian and English translations", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(
    readFileSync(
      path.join(root, "apps/web/public/templates/shared/nikoh/i18n.js"),
      "utf8",
    ),
    { window },
  );
  runInNewContext(read(pkg, "i18n.js"), { window });
  const translations = window.MARHAMAT_I18N!;
  const bodyText = read(pkg, "index.html").match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  const ignored = new Set([
    "00",
    "&",
    "◆",
    "↗",
    "×",
    "?",
    "−",
    "+",
    "＋",
    "№ 001 ·",
    "№ 001—26",
    "№ 001",
  ]);
  const visible = Array.from(bodyText.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter((value) => value.length > 1 && !ignored.has(value));
  const accessible = Array.from(
    bodyText.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  const untranslated = [...visible, ...accessible].filter(
    (value) => !translations[value],
  );
  assert.deepEqual(untranslated, []);
  assert.match(read("apps/web/public/templates/shared/nikoh", "core.js"), /transliterateUzbek/);
});
