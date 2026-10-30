import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";
import { createInvitation, type Locale } from "@taklifnoma/contracts";

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
  "Invitations - this folder will be removed from production/Marxaba/Tug'ilgan kun va Yubiley/templates/shirin-bayram",
);
const pkg = path.join(root, "apps/web/public/templates/shirin-bayram");
const renderer = path.join(root, "apps/web/src/templates/shirin-bayram");
const read = (base: string, name: string) =>
  readFileSync(path.join(base, name), "utf8");
const body = (html: string) =>
  html
    .match(/<body[\s\S]*?<\/body>/)?.[0]
    .trim()
    .replace(/\r\n/g, "\n") ?? "";

test("Shirin Bayram has an isolated typed birthday renderer", () => {
  assert.match(read(renderer, "renderer.tsx"), /templateId="shirin-bayram"/);
  assert.match(read(renderer, "renderer.tsx"), /eventType: "birthday"/);
  assert.match(read(renderer, "renderer.tsx"), /defaultEventLabel/);
  assert.match(read(renderer, "index.ts"), /ShirinBayramInvitation/);
});

test("Shirin Bayram compatibility follows its birthday-only source metadata", () => {
  const metadata = read(pkg, "meta.js");
  const contracts = read(
    path.join(root, "packages/contracts/src"),
    "index.ts",
  );
  const migration = read(
    path.join(root, "packages/database/migrations"),
    "0040_add_shirin_bayram_template.sql",
  );
  const publication = read(
    path.join(root, "packages/database/migrations"),
    "0067_publish_shirin_bayram.sql",
  );
  const compatibilityFix = read(
    path.join(root, "packages/database/migrations"),
    "0068_shirin_bayram_birthday_only.sql",
  );
  assert.match(metadata, /category:"tugilgan-kun",eventTypes:\["tugilgan-kun"\]/);
  assert.match(contracts, /id: "shirin-bayram"[\s\S]*?supportedEventTypes: \["birthday"\]/);
  assert.match(migration, /VALUES \('shirin-bayram', 'birthday'\)/);
  assert.match(publication, /VALUES \('shirin-bayram', 'Shirin Bayram', 15000000, 'UZS', true\)/);
  assert.match(publication, /\('shirin-bayram', 'birthday'\)/);
  assert.match(compatibilityFix, /event_type <> 'birthday'/);
  assert.match(compatibilityFix, /VALUES \('shirin-bayram', 'birthday'\)/);
  assert.match(
    contracts.match(/id: "shirin-bayram"[\s\S]*?\n  },/)?.[0] ?? "",
    /published: true/,
  );
  assert.doesNotMatch(metadata, /yubiley/);
  assert.doesNotMatch(
    contracts.match(/id: "shirin-bayram"[\s\S]*?\n  },/)?.[0] ?? "",
    /yubiley/,
  );
});

test("Shirin Bayram birthday sample is localized in all four canonical locales", () => {
  const fixture = JSON.parse(
    read(
      path.join(root, "apps/web/src/modules/catalog"),
      "preview-sample.json",
    ),
  );
  const sample = fixture.eventSamples.birthday;
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"]) {
    assert.ok(sample.eventLabel[locale], `${locale} event label`);
    assert.ok(sample.hosts[locale], `${locale} hosts`);
    assert.ok(sample.message[locale], `${locale} message`);
    assert.ok(sample.venueName[locale], `${locale} venue`);
    assert.ok(sample.address[locale], `${locale} address`);
    assert.ok(sample.programHeading[locale], `${locale} program heading`);
    assert.equal(sample.programTitles[locale].length, 6, `${locale} program`);
    assert.ok(sample.dressCode.style[locale], `${locale} dress style`);
    assert.ok(sample.dressCode.text[locale], `${locale} dress text`);
    assert.ok(sample.dressCode.note[locale], `${locale} dress note`);
    for (const color of sample.dressCode.colors)
      assert.ok(color.name[locale], `${locale} color`);
  }
});

test("Shirin Bayram maps the shared birthday fixture and keeps blank drafts empty", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("shirin-bayram");
  assert.equal(sample.eventType, "birthday");

  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as Locale[]) {
    const content = sample.content[locale];
    const mapped = makeLegacyData(sample, locale, "", true);
    assert.equal(mapped.groom, content.people[0]);
    assert.equal(mapped.bride, "");
    assert.equal(mapped.eventType, content.eventLabel);
    assert.equal(mapped.hosts, content.hosts);
    assert.equal(mapped.message, content.message);
    assert.equal(mapped.venue.name, content.venueName);
    assert.equal(
      mapped.venue.address,
      [content.address, content.landmark].filter(Boolean).join(" · "),
    );
    assert.equal(mapped.programHeading, content.programHeading);
    assert.deepEqual(
      mapped.program.map(({ time, title }) => [time, title]),
      sample.program.map((item) => [item.time, content.programTitles[item.id]]),
    );
    assert.equal(mapped.program.length, 6);
    assert.equal(mapped.gallery.length, 6);
    assert.ok(mapped.gallery.every((item) => !item.src));
    assert.equal(mapped.wishes.length, 3);
    assert.equal(mapped.dressCode.style, sample.dressCode.style[locale]);
    assert.equal(mapped.dressCode.text, sample.dressCode.text[locale]);
    assert.equal(mapped.dressCode.note, sample.dressCode.note[locale]);
    assert.deepEqual(
      mapped.dressCode.colors.map(({ name, hex }) => [name, hex]),
      sample.dressCode.colors.map((color) => [color.name[locale], color.hex]),
    );
    assert.equal(mapped.toyona.cardNumber, sample.gift.cardNumber);
    assert.equal(mapped.toyona.cardHolder, sample.gift.cardHolder);
    assert.ok(mapped.contacts.some(({ type }) => type === "phone"));
    assert.ok(mapped.contacts.some(({ type }) => type === "telegram"));

    const blank = makeLegacyData(createInvitation("shirin-bayram"), locale, "");
    assert.equal(blank.groom, "");
    assert.equal(blank.bride, "");
    assert.equal(blank.message, "");
    assert.equal(blank.venue.name, "");
    assert.equal(blank.venue.address, "");
    assert.equal(blank.program.length, 0);
    assert.equal(blank.gallery.length, 0);
    assert.equal(blank.wishes.length, 0);
    assert.equal(blank.toyona.cardNumber, "");
    assert.equal(blank.toyona.cardHolder, "");
    assert.equal(blank.contacts.length, 0);
    assert.deepEqual(blank.dressCode.colors, []);
  }
  assert.match(
    read(path.join(root, "apps/web/src/templates/marxaba"), "renderer.tsx"),
    /extras:\s*\{\s*celebrant:\s*sourceData\.groom\s*\|\|\s*sourceData\.bride\s*,/,
  );
});

test("fixed visible and accessibility copy has Russian and English mappings", () => {
  const localDictionary = read(pkg, "i18n.js");
  const sharedDictionary = read(
    path.join(root, "apps/web/public/templates/shared/nikoh"),
    "i18n.js",
  );
  const html = read(pkg, "index.html");
  const labels = [...html.matchAll(/aria-label="([^"]+)"/g)].map((match) => match[1]);
  const keys = [
    ...[...localDictionary.matchAll(/"([^"\n]+)":\s*\["([^"\n]*)",\s*"([^"\n]*)"\]/g)],
    ...[...sharedDictionary.matchAll(/"([^"\n]+)":\s*\["([^"\n]*)",\s*"([^"\n]*)"\]/g)],
  ];
  for (const label of labels) {
    const translation = keys.find((match) => match[1] === label);
    assert.ok(translation, `missing translations for accessibility label: ${label}`);
    assert.ok(translation[2], `missing English translation for: ${label}`);
    assert.ok(translation[3], `missing Russian translation for: ${label}`);
  }
  for (const visible of ["Bayram kuni", "Bayram dasturi", "Qayerda uchrashamiz?", "Lahzalar", "Kelasizmi?", "Tilaklar", "Bog‘lanish uchun"]) {
    assert.ok(keys.some((match) => match[1] === visible), `missing fixed-copy translations for: ${visible}`);
  }
});

test("Shirin Bayram retains its complete captured body, style, copy, and motion", () => {
  const expected = body(read(source, "index.html"));
  assert.equal(body(read(pkg, "index.html")), expected);
  for (const name of ["template.css", "meta.js", "i18n.js"])
    assert.deepEqual(
      readFileSync(path.join(pkg, name), "utf8"),
      readFileSync(path.join(source, name), "utf8"),
    );
  const expectedScript = read(source, "template.js").replace(
    "../../shared/vendor/three/three.bundle.min.js",
    "vendor/three.bundle.min.js",
  );
  assert.equal(
    read(pkg, "template.js").replace(/\r\n/g, "\n"),
    expectedScript.replace(/\r\n/g, "\n"),
  );
  assert.match(read(pkg, "template.js"), /build3d/);
  assert.match(read(pkg, "template.js"), /prefers-reduced-motion/);
  assert.match(read(pkg, "template.css"), /prefers-reduced-motion/);
});

test("Shirin Bayram uses the platform runtime without source samples or remote fonts", () => {
  const html = read(pkg, "index.html");
  assert.match(html, /platform-bridge\.js/);
  assert.match(html, /locale-copy\.js/);
  assert.match(html, /contract-adapter\.css/);
  assert.match(html, /fonts\.css/);
  assert.doesNotMatch(
    html,
    /sample-invitation|sample-overrides|fonts\.googleapis|fonts\.gstatic/,
  );
  for (const interaction of [
    'id="open-invitation"',
    'data-section="hero"',
    'data-section="invitation-text"',
    'data-section="date"',
    'data-section="program"',
    'data-section="venue"',
    'data-section="dresscode"',
    'data-section="gallery"',
    'data-section="rsvp"',
    'data-section="wishes"',
    'data-section="toyona"',
    'data-section="contacts"',
    'data-section="footer"',
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
  const notes = read(pkg, "SOURCE_ADAPTATIONS.md");
  assert.match(notes, /age slots/);
  assert.match(notes, /contract-adapter\.css/);
  const contractAdapter = read(pkg, "contract-adapter.css");
  assert.match(contractAdapter, /\[data-slot="toyona\.bank"\]:empty/);
  assert.match(contractAdapter, /\[data-slot="toyona\.note"\]:empty/);
  assert.match(contractAdapter, /\.intro__name,[\s\S]*?\.hero__name/);
  assert.match(contractAdapter, /overflow-wrap:\s*normal/);
  assert.match(contractAdapter, /word-break:\s*normal/);
});

test("Shirin Bayram packages local Latin/Cyrillic fonts and all runtime assets", () => {
  const fonts = read(pkg, "fonts.css");
  assert.match(fonts, /font-family:\s*"Baloo 2"/);
  assert.match(fonts, /font-family:\s*"Nunito"/);
  assert.match(fonts, /font-weight:\s*400/);
  assert.match(fonts, /font-weight:\s*800/);
  assert.match(fonts, /nunito-cyrillic\.woff2/);
  assert.doesNotMatch(fonts, /https?:\/\//);
  assert.ok(existsSync(path.join(pkg, "vendor/three.bundle.min.js")));
  for (const name of [
    "gsap.min.js",
    "ScrollTrigger.min.js",
    "lz-string.min.js",
    "three.bundle.min.js",
  ]) {
    const sourceName =
      name === "three.bundle.min.js"
        ? "three/three.bundle.min.js"
        : name;
    assert.deepEqual(
      readFileSync(path.join(pkg, "vendor", name)),
      readFileSync(path.join(source, "../../shared/vendor", sourceName)),
      `${name} matches the captured source dependency`,
    );
  }
  const html = read(pkg, "index.html");
  const references = [
    ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (m) => m[1]),
    ...Array.from(fonts.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g), (m) => m[1]),
    ...Array.from(
      read(pkg, "template.css").matchAll(/url\(["']?([^)'"\s]+)["']?\)/g),
      (m) => m[1],
    ),
  ].filter((ref) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(ref));
  for (const reference of references) {
    assert.ok(
      existsSync(path.resolve(pkg, reference)),
      `missing local asset ${reference}`,
    );
    assert.ok(
      !reference.includes("sample-invitation"),
      `sample dependency ${reference}`,
    );
  }
});

test("Shirin Bayram preview is a checksummed portrait opening from the canonical fixture", () => {
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
    "closed Shirin Bayram invitation with greeting, birthday title, and cake artwork",
  );
  assert.equal(
    provenance.sha256,
    createHash("sha256").update(image).digest("hex"),
  );
});
