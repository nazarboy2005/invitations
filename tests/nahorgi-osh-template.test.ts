import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { createInvitation, templateById } from "@taklifnoma/contracts";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";
import { createInvitation, templateById, type Locale } from "@taklifnoma/contracts";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = process.cwd();
const source = path.join(
  root,
  "Invitations - this folder will be removed from production/Marxaba/Osh va iftorlik/templates/nahorgi-osh",
);
const pkg = path.join(root, "apps/web/public/templates/nahorgi-osh");
const renderer = path.join(root, "apps/web/src/templates/nahorgi-osh");
const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => { module.exports = {}; };
const moduleRuntime = require("node:module") as { _resolveFilename: (...args: any[]) => string };
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/") ? path.resolve(webSourceRoot, request.slice(2)) : request;
  return resolveFilename.call(this, resolved, ...args);
};
const read = (base: string, file: string) =>
  readFileSync(path.join(base, file), "utf8");
const normalize = (value: string) =>
  value.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
const body = (html: string) =>
  normalize(html)
    .match(/<body[\s\S]*?<\/body>/)?.[0]
    .trim() ?? "";

test("Nahorgi Osh exposes a typed adapter to the shared Marxaba renderer", () => {
  const wrapper = read(renderer, "renderer.tsx");
  assert.match(wrapper, /templateId="nahorgi-osh"/);
  assert.match(wrapper, /eventType: "osh"/);
  assert.match(wrapper, /defaultEventLabel/);
  assert.match(read(renderer, "index.ts"), /NahorgiOshInvitation/);
  assert.match(read(renderer, "README.md"), /venue\.photo/);
  assert.match(read(renderer, "README.md"), /sunnat-toyi/);
});

test("Nahorgi Osh fixture schedule and invitation copy map in all four locales", () => {
  const { makeLegacyData } = require("../apps/web/src/templates/anor/renderer") as typeof import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("nahorgi-osh");
  const labels: Record<Locale, string> = {
    "uz-Latn": "Nahorgi osh",
    "uz-Cyrl": "Наҳорги ош",
    en: "Morning osh",
    ru: "Утренний ош",
  };
  const times = ["06:30", "07:00", "08:00", "08:30", "10:00", "11:00"];

  assert.equal(sample.eventType, "osh");
  assert.equal(sample.startsAt, "2027-06-12T07:00");
  assert.deepEqual(sample.program.map((item) => item.time), times);
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
    const localized = sample.content[locale];
    const mapped = makeLegacyData(sample, locale, "", true);
    assert.equal(localized.people.length, 1);
    assert.equal(localized.eventLabel, labels[locale]);
    assert.ok(localized.hosts && localized.message && localized.venueName && localized.address);
    assert.equal(mapped.eventType, labels[locale]);
    assert.equal(mapped.groom, localized.people[0]);
    assert.equal(mapped.bride, "");
    assert.equal(mapped.hosts, localized.hosts);
    assert.equal(mapped.message, localized.message);
    assert.equal(mapped.venue.name, localized.venueName);
    assert.equal(mapped.venue.address, [localized.address, localized.landmark].filter(Boolean).join(" · "));
    assert.equal(mapped.programHeading, localized.programHeading);
    assert.deepEqual(mapped.program.map((item) => item.time), times);
    assert.ok(mapped.program.every((item) => item.title));
    assert.ok(mapped.gallery.length === 6 && mapped.gallery.every((item) => !item.src));
    assert.ok(mapped.dressCode.style && mapped.dressCode.text && mapped.dressCode.note);
  }

  const blank = makeLegacyData(createInvitation("nahorgi-osh"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.hosts, "");
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.contacts.length, 0);
});

test("Nahorgi Osh compatibility remains separate from category and unpublished", () => {
  const template = templateById("nahorgi-osh");
  assert.ok(template);
  assert.deepEqual(template.categoryIds, ["osh"]);
  assert.deepEqual(template.supportedEventTypes, ["osh", "sunnat-toyi", "wedding"]);
  assert.equal(template.previewEventType, "osh");
  assert.equal(template.published, false);
  const migration = readFileSync(path.join(root, "packages/database/migrations/0043_add_nahor_templates.sql"), "utf8");
  assert.match(migration, /\('nahorgi-osh', 'osh'\)/);
  assert.match(migration, /\('nahorgi-osh', 'sunnat-toyi'\)/);
  assert.match(migration, /\('nahorgi-osh', 'wedding'\)/);
  assert.match(migration, /\('nahorgi-osh', 'Nahorgi Osh', 15000000, 'UZS', false\)/);
});

test("Nahorgi Osh documents and isolates source-only opening and venue fields", () => {
  const notes = read(renderer, "README.md");
  const html = read(pkg, "index.html");
  const blank = createInvitation("nahorgi-osh");
  assert.match(html, /data-slot="extras\.celebrant"/);
  assert.match(html, /data-photo="venue\.photo"/);
  assert.match(notes, /extras\.celebrant[\s\S]*first available person name/);
  assert.match(notes, /venue\.photo.*not part of the approved invitation contract/);
  assert.equal("photo" in blank.venue, false);
  assert.match(read(renderer, "renderer.tsx"), /templateId="nahorgi-osh"/);
});

test("captured body, visual source, localized copy, metadata, and artwork are preserved", () => {
  assert.equal(body(read(pkg, "index.html")), body(read(source, "index.html")));
  for (const file of ["template.css", "template.js", "i18n.js", "meta.js"])
    assert.deepEqual(
      readFileSync(path.join(pkg, file)),
      readFileSync(path.join(source, file)),
      `${file} matches capture`,
    );
  assert.deepEqual(
    readFileSync(path.join(pkg, "art/nahorgi-dawn.webp")),
    readFileSync(path.join(source, "art/nahorgi-dawn.webp")),
  );
  const metaContext: {
    window: {
      TEMPLATE_META?: {
        slug?: string;
        eventTypes?: string[];
        preview?: string;
      };
    };
  } = {
    window: {},
  };
  runInNewContext(read(pkg, "meta.js"), metaContext);
  assert.deepEqual(
    Array.from(metaContext.window.TEMPLATE_META?.eventTypes ?? []),
    ["osh", "sunnat", "nikoh"],
  );
  assert.equal(metaContext.window.TEMPLATE_META?.slug, "nahorgi-osh");
  assert.equal(metaContext.window.TEMPLATE_META?.preview, "preview.webp");
});

test("all fixed page copy and accessibility labels have English and Russian entries", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(read(path.join(pkg, "../shared/nikoh"), "i18n.js"), { window });
  runInNewContext(read(pkg, "i18n.js"), { window });
  runInNewContext(read(pkg, "platform-i18n.js"), { window });
  const dictionary = window.MARHAMAT_I18N;
  assert.ok(dictionary);
  const html = read(pkg, "index.html");
  const pageBody = body(html);
  const text = Array.from(pageBody.matchAll(/>([^<>]+)</g), (match) => match[1].replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()).filter((value) => value.length > 1 && !/^\d+$/.test(value));
  const attributes = Array.from(pageBody.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g), (match) => match[1].trim());
  const metadata = [html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() ?? "", ...Array.from(html.matchAll(/<meta (?:name="description"|property="og:title"|property="og:description") content="([^"]+)"/g), (match) => match[1].trim())];
  assert.deepEqual([...text, ...attributes, ...metadata].filter((value) => !dictionary[value]), []);
});

test("package uses only local platform runtime, animations, fonts, and artwork", () => {
  const html = read(pkg, "index.html");
  assert.match(html, /platform-bridge\.js/);
  assert.match(html, /fonts\.css/);
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
    ...Array.from(
      html.matchAll(/(?:src|href)="([^"]+)"/g),
      (match) => match[1],
    ),
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
  assert.match(html, /property="og:image" content="art\/nahorgi-dawn\.webp"/);
});

test("captured motion supports reduced-motion preferences and does not load demo content", () => {
  const script = read(pkg, "template.js");
  assert.match(script, /prefers-reduced-motion/);
  assert.match(read(pkg, "template.css"), /prefers-reduced-motion:reduce/);
  assert.match(script, /ScrollTrigger/);
  assert.doesNotMatch(
    read(pkg, "index.html"),
    /sample-invitation|sample-overrides/,
  );
});

test("local fonts provide every captured family and script subset", () => {
  const css = read(pkg, "fonts.css");
  assert.match(css, /font-family:Manrope/);
  assert.match(css, /font-family:'Lora';font-style:normal;font-weight:600/);
  for (const subset of ["latin", "latin-ext", "cyrillic", "cyrillic-ext"])
    assert.ok(
      css.includes(`-${subset}.woff2`),
      `missing ${subset} font subset`,
    );
  assert.doesNotMatch(css, /https?:\/\//);
});

test("catalog artwork is a fixture-rendered portrait of the authentic opening", () => {
  const previewPath = path.join(pkg, "preview.webp");
  const preview = readFileSync(previewPath);
  const provenance = JSON.parse(
    read(pkg, "preview.provenance.json"),
  ) as {
    artifact: string;
    sha256: string;
    dimensions: { width: number; height: number; format: string };
    render: {
      route: string;
      fixture: string;
      fixtureSha256: string;
      sourceOpeningCrop: {
        selector: string;
        width: number;
        height: number;
        left: number;
        top: number;
      };
      sourceCapture: {
        html: string;
        htmlSha256: string;
        openingArtwork: string;
        openingArtworkSha256: string;
      };
    };
  };
  const sha256 = (value: Buffer) =>
    createHash("sha256").update(value).digest("hex");

  assert.equal(provenance.artifact, "preview.webp");
  assert.equal(provenance.sha256, sha256(preview));
  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.equal(preview.toString("ascii", 12, 16), "VP8 ");
  assert.equal(preview.readUInt16LE(26) & 0x3fff, 720);
  assert.equal(preview.readUInt16LE(28) & 0x3fff, 1280);
  assert.deepEqual(provenance.dimensions, {
    width: 720,
    height: 1280,
    format: "WEBP",
  });
  assert.equal(
    provenance.render.route,
    "/preview?template=nahorgi-osh&qaSilent=1",
  );
  assert.equal(
    provenance.render.fixture,
    "apps/web/src/modules/catalog/preview-sample.json",
  );
  assert.match(provenance.render.fixtureSha256, /^[a-f\d]{64}$/);
  assert.deepEqual(provenance.render.sourceOpeningCrop, {
    selector: ".intro",
    width: 480,
    height: 1244,
    left: 120,
    top: 18,
  });
  assert.equal(
    provenance.render.sourceCapture.htmlSha256,
    sha256(readFileSync(path.join(root, provenance.render.sourceCapture.html))),
  );
  const sourceHtml = readFileSync(
    path.join(root, provenance.render.sourceCapture.html),
    "utf8",
  );
  assert.match(sourceHtml, /<section class="intro" id="intro"/);
  assert.match(sourceHtml, /art\/nahorgi-dawn\.webp/);
  assert.match(sourceHtml, /data-slot="hosts"/);
  assert.match(sourceHtml, /data-slot="date\.long"/);
  assert.match(read(pkg, "template.css"), /prefers-reduced-motion:reduce/);
  assert.match(read(pkg, "template.js"), /window\.Marhamat\.reducedMotion/);
  assert.equal(
    provenance.render.sourceCapture.openingArtworkSha256,
    sha256(
      readFileSync(
        path.join(root, provenance.render.sourceCapture.openingArtwork),
      ),
    ),
  );
});
