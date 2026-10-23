import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
} from "../apps/web/src/modules/catalog/preview-sample";
import {
  createInvitation,
  defaultEventLabel,
  templateById,
  type Locale,
} from "@taklifnoma/contracts";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => {
  module.exports = {};
};
const moduleRuntime = require("node:module") as {
  _resolveFilename: (...args: any[]) => string;
};
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = path.resolve(process.cwd(), "apps/web/src");
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/")
    ? path.resolve(webSourceRoot, request.slice(2))
    : request;
  return resolveFilename.call(this, resolved, ...args);
};

const root = process.cwd();
const source = path.join(
  root,
  "Invitations - this folder will be removed from production/Marxaba/Beshik to'yi/templates/beshik",
);
const pkg = path.join(root, "apps/web/public/templates/beshik");
const renderer = path.join(root, "apps/web/src/templates/beshik");
const read = (base: string, name: string) =>
  readFileSync(path.join(base, name), "utf8");
const body = (html: string) =>
  html
    .match(/<body[\s\S]*?<\/body>/)?.[0]
    .trim()
    .replace(/\r\n/g, "\n") ?? "";

test("Beshik has an isolated typed renderer wrapper", () => {
  assert.match(read(renderer, "renderer.tsx"), /templateId="beshik"/);
  assert.match(read(renderer, "index.ts"), /BeshikInvitation/);
});

test("Beshik retains its complete captured structure, styling, scripts, and art", () => {
  const expectedBody = body(read(source, "index.html"))
    .replaceAll('data-slot="extras.celebrant"', 'data-slot="groom"')
    .replace(
      '<h2 class="section__title">To‘y dasturi</h2>',
      '<h2 class="section__title" data-slot="programHeading">To‘y dasturi</h2>',
    );
  assert.equal(body(read(pkg, "index.html")), expectedBody);
  for (const name of ["template.css", "meta.js"])
    assert.deepEqual(
      readFileSync(path.join(pkg, name)),
      readFileSync(path.join(source, name)),
    );
  assert.match(read(pkg, "i18n.js"), /Календарь праздника/);
  assert.match(read(pkg, "index.html"), /aria-label="Bayram kuni taqvimi"/);
  const expectedScript = read(source, "template.js")
    .replaceAll('data-slot="extras.celebrant"', 'data-slot="groom"')
    .replace("data.extras && data.extras.celebrant", "data.groom")
    .replace("data.extras?.celebrant", "data.groom");
  assert.equal(
    read(pkg, "template.js").replace(/\r\n/g, "\n"),
    expectedScript.replace(/\r\n/g, "\n"),
  );
  const sourceArt = readdirSync(path.join(source, "art")).sort();
  assert.deepEqual(readdirSync(path.join(pkg, "art")).sort(), sourceArt);
  for (const name of sourceArt)
    assert.deepEqual(
      readFileSync(path.join(pkg, "art", name)),
      readFileSync(path.join(source, "art", name)),
    );
});

test("Beshik uses the local platform runtime and excludes reference fixture code", () => {
  const html = read(pkg, "index.html");
  assert.match(html, /\.\.\/shared\/nikoh\/platform-bridge\.js/);
  assert.match(html, /locale-copy\.js/);
  assert.match(html, /og:image" content="preview\.webp/);
  assert.doesNotMatch(
    html,
    /sample-invitation|sample-overrides|fonts\.googleapis|fonts\.gstatic/,
  );
  assert.doesNotMatch(html, /extras\.celebrant|INVITATION_OVERRIDES/);
  for (const interaction of [
    'id="open-invitation"',
    'data-list="program"',
    'data-list="gallery"',
    "data-gallery-prev",
    "data-gallery-next",
    "data-rsvp",
    "data-wishes-form",
    'data-section="dresscode"',
    'data-section="toyona"',
    'data-list="contacts"',
  ])
    assert.ok(html.includes(interaction), `${interaction} is retained`);
  assert.match(read(pkg, "template.js"), /prefers-reduced-motion/);
  assert.match(read(pkg, "template.css"), /prefers-reduced-motion/);
  assert.match(read(pkg, "SOURCE_ADAPTATIONS.md"), /beshik-toyi/);
});

test("Beshik compatibility and creator fields stay aligned after release", () => {
  const entry = templateById("beshik");
  assert.ok(entry);
  assert.deepEqual(entry.supportedEventTypes, ["beshik-toyi", "birthday"]);
  assert.equal(entry.published, true);
  const migration = readFileSync(
    path.join(
      root,
      "packages/database/migrations/0039_add_beshik_template.sql",
    ),
    "utf8",
  );
  assert.match(
    migration,
    /VALUES \('beshik', 'Beshik', 15000000, 'UZS', false\)/,
  );
  assert.match(
    migration,
    /\('beshik', 'beshik-toyi'\)[\s\S]*\('beshik', 'birthday'\)/,
  );
  const publication = readFileSync(
    path.join(root, "packages/database/migrations/0064_publish_beshik.sql"),
    "utf8",
  );
  assert.match(
    publication,
    /VALUES \('beshik', 'Beshik', 15000000, 'UZS', true\)/,
  );
  const editor = readFileSync(
    path.join(root, "apps/web/src/modules/studio/studio.tsx"),
    "utf8",
  );
  assert.match(editor, /invitation\.templateId === "beshik"/);
  assert.match(editor, /const singleCelebrantLabel[\s\S]*?: "Bola ismi"/);
});

test("Beshik has fully local exact font faces and all source links resolve", () => {
  const html = read(pkg, "index.html");
  const fonts = read(pkg, "fonts.css");
  assert.match(fonts, /font-family:Fredoka/);
  assert.match(fonts, /font-weight:500 600/);
  assert.match(fonts, /font-family:Nunito/);
  assert.match(fonts, /font-weight:400 700/);
  assert.match(fonts, /font-family:Nunito[^}]+nunito-cyrillic\.woff2/);
  assert.doesNotMatch(fonts, /https?:\/\//);
  const references = [
    ...Array.from(
      html.matchAll(/(?:src|href)="([^"]+)"/g),
      (match) => match[1],
    ),
    ...Array.from(
      fonts.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g),
      (match) => match[1],
    ),
    ...Array.from(
      read(pkg, "template.css").matchAll(/url\(["']?([^)'"\s]+)["']?\)/g),
      (match) => match[1],
    ),
  ].filter((ref) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(ref));
  for (const reference of references) {
    const cleanPath = reference.split(/[?#]/, 1)[0];
    assert.ok(
      existsSync(path.resolve(pkg, cleanPath)) ||
        existsSync(
          path.resolve(
            pkg,
            "../shared/nikoh",
            cleanPath.replace(/^\.\.\/shared\/nikoh\//, ""),
          ),
        ),
      `missing local asset ${reference}`,
    );
  }
  assert.ok(existsSync(path.join(pkg, "contract-adapter.css")));
  assert.match(html, /contract-adapter\.css/);
  assert.match(read(pkg, "SOURCE_ADAPTATIONS.md"), /contract-adapter\.css/);
});

test("Beshik preview is a checksummed portrait render of its opening state", () => {
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
    [720, 1280],
  );
  assert.deepEqual([provenance.width, provenance.height], [720, 1280]);
  assert.equal(
    provenance.fixture,
    "apps/web/src/modules/catalog/preview-sample.json",
  );
  assert.equal(provenance.fixtureLocale, fixture.defaultLocale);
  assert.deepEqual(
    provenance.fixtureNames,
    fixture.content[fixture.defaultLocale].people,
  );
  assert.equal(
    provenance.sourceOpening,
    "closed Beshik invitation with greeting, opener, and cradle artwork",
  );
  assert.equal(
    provenance.sha256,
    createHash("sha256").update(image).digest("hex"),
  );
});

test("Beshik maps the cradle-celebration fixture through every supported locale", async () => {
  const { makeLegacyData } =
    await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("beshik");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  assert.equal(sample.eventType, "beshik-toyi");
  assert.deepEqual(sample.enabledLocales, locales);
  assert.deepEqual(sample.content["uz-Latn"].people, ["Javohir"]);
  assert.deepEqual(sample.content["uz-Cyrl"].people, ["Жавохир"]);
  assert.equal(sample.program.length, 6);

  for (const locale of locales) {
    const content = sample.content[locale];
    const data = makeLegacyData(sample, locale, "", true);
    assert.equal(data.groom, content.people[0], `${locale}: baby name`);
    assert.equal(data.bride, "", `${locale}: one-person source data`);
    assert.equal(
      data.eventType,
      content.eventLabel || defaultEventLabel(sample.eventType, locale),
      `${locale}: event label`,
    );
    assert.equal(data.hosts, content.hosts, `${locale}: family name`);
    assert.equal(data.greeting, content.greeting, `${locale}: greeting`);
    assert.equal(data.message, content.message, `${locale}: invitation copy`);
    assert.equal(data.date.day, 12, `${locale}: date`);
    assert.equal(data.date.time, "17:00", `${locale}: time`);
    assert.equal(data.date.year, 2027, `${locale}: year`);
    assert.equal(data.venue.name, content.venueName, `${locale}: venue name`);
    assert.equal(
      data.venue.address,
      [content.address, content.landmark].filter(Boolean).join(" · "),
      `${locale}: venue address and landmark`,
    );
    assert.equal(
      data.programHeading,
      content.programHeading,
      `${locale}: program heading`,
    );
    assert.deepEqual(
      data.program.map(({ id, time, title }) => [id, time, title]),
      sample.program.map((item) => [
        item.id,
        item.time,
        content.programTitles[item.id],
      ]),
      `${locale}: stable ordered program entries`,
    );
    assert.equal(data.dressCode.enabled, true, `${locale}: clothing enabled`);
    assert.equal(data.dressCode.style, sample.dressCode.style[locale]);
    assert.equal(data.dressCode.text, sample.dressCode.text[locale]);
    assert.equal(data.dressCode.note, sample.dressCode.note[locale]);
    assert.deepEqual(
      data.dressCode.colors.map(({ id, name, hex }) => [id, name, hex]),
      sample.dressCode.colors.map(({ id, name, hex }) => [
        id,
        name[locale],
        hex,
      ]),
    );
    assert.equal(data.gallery.length, 6, `${locale}: preview gallery`);
    assert.ok(
      data.gallery.every(
        ({ src, alt, caption }) => src === "" && alt === "" && caption === "",
      ),
    );
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.equal(data.wishes.length, 3, `${locale}: preview wishes`);
    assert.equal(data.toyona.enabled, true, `${locale}: gift enabled`);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV");
    assert.equal(
      data.toyona.note,
      "",
      `${locale}: unsupported note remains empty`,
    );
    assert.deepEqual(
      data.contacts.map(({ value }) => value),
      ["+998 90 123 45 67", "@demo"],
    );
  }

  const blank = makeLegacyData(
    createInvitation("beshik"),
    "uz-Latn",
    "",
    false,
  );
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.greeting, "");
  assert.equal(blank.date.long, "");
  assert.equal(blank.program.length, 0);
  assert.equal(blank.dressCode.enabled, false);
  assert.equal(blank.dressCode.colors.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.toyona.cardNumber, "");
  assert.deepEqual(blank.contacts, []);
});

test("unsupported empty To‘yona bank and note slots are hidden by scoped CSS", () => {
  const adapter = read(pkg, "contract-adapter.css");
  assert.match(adapter, /#toyona \[data-slot="toyona\.bank"\]:empty/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.note"\]:empty/);
  assert.match(
    adapter,
    /\.hero__name\[data-slot="groom"\]\.platform-name-fit--single-wrap/,
  );
  assert.match(
    adapter,
    /\.act-three \[data-slot="groom"\]\.platform-name-fit--single-wrap/,
  );
  assert.match(adapter, /overflow-wrap:\s*anywhere !important/);
  assert.match(
    adapter,
    /\[data-section="gallery"\]:has\(\[data-list="gallery"\]:empty\)/,
  );
});

test("Marxaba source-owned gallery art is preview-only and creator uploads win", async () => {
  const { MarxabaInvitation } =
    await import("../apps/web/src/templates/marxaba/renderer");
  const renderer = read(
    path.join(root, "apps/web/src/templates/marxaba"),
    "renderer.tsx",
  );
  for (const [id, asset] of [
    ["beshik", "beshik.webp"],
    ["bitiruv", "graduation-scene.webp"],
    ["doira", "courtyard-night-v2.webp"],
  ]) {
    assert.ok(
      existsSync(
        path.join(root, `apps/web/public/templates/${id}/art/${asset}`),
      ),
    );
  }
  assert.match(
    renderer,
    /export function mapMarxabaPreviewGallery\([\s\S]*?if \(!preview \|\| !samplePreview \|\| hasCreatorPhotos \|\| !previewGallery\)\s+return sourceGallery;/,
  );
  assert.match(renderer, /sourceData\.gallery,\s*frameLocale,\s*preview,\s*sampleWishes/);
  assert.equal(typeof MarxabaInvitation, "function");
  assert.match(
    read(path.join(root, "apps/web/public/templates/shared/nikoh"), "core.js"),
    /hideIf\('gallery',[\s\S]*data\.gallery\.some\(item=>plain\(item\)&&typeof item\.src==='string'&&item\.src\.trim\(\)\)/,
  );
});
