import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

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

test("Shirin Bayram retains its complete captured body, style, copy, and motion", () => {
  const expected = body(read(source, "index.html"));
  assert.equal(body(read(pkg, "index.html")), expected);
  for (const name of ["template.css", "meta.js", "i18n.js"])
    assert.deepEqual(
      readFileSync(path.join(pkg, name)),
      readFileSync(path.join(source, name)),
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
  assert.match(html, /fonts\.css/);
  assert.doesNotMatch(
    html,
    /sample-invitation|sample-overrides|fonts\.googleapis|fonts\.gstatic/,
  );
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
  const notes = read(pkg, "SOURCE_ADAPTATIONS.md");
  assert.match(notes, /age slots/);
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
