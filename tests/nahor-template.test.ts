import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const source = path.join(
  root,
  "Invitations - this folder will be removed from production/Marxaba/Osh va iftorlik/templates/nahor",
);
const pkg = path.join(root, "apps/web/public/templates/nahor");
const renderer = path.join(root, "apps/web/src/templates/nahor");
const read = (base: string, name: string) =>
  readFileSync(path.join(base, name), "utf8");
const body = (html: string) =>
  html.match(/<body[\s\S]*?<\/body>/)?.[0].trim().replace(/\r\n/g, "\n") ?? "";

test("Nahor has an isolated typed Osh renderer", () => {
  assert.match(read(renderer, "renderer.tsx"), /templateId="nahor"/);
  assert.match(read(renderer, "renderer.tsx"), /eventType: "osh"/);
  assert.match(read(renderer, "renderer.tsx"), /defaultEventLabel/);
  assert.match(read(renderer, "index.ts"), /NahorInvitation/);
});

test("Nahor retains the captured page, styles, copy, and opening animation", () => {
  assert.equal(body(read(pkg, "index.html")), body(read(source, "index.html")));
  for (const name of ["template.css", "template.js", "i18n.js", "meta.js"])
    assert.deepEqual(readFileSync(path.join(pkg, name)), readFileSync(path.join(source, name)));
  assert.match(read(pkg, "template.js"), /lift the lid/);
  assert.match(read(pkg, "template.js"), /app\.reducedMotion/);
  assert.match(read(pkg, "template.js"), /ScrollTrigger/);
  for (const file of readdirSync(path.join(source, "art")))
    assert.deepEqual(
      readFileSync(path.join(pkg, "art", file)),
      readFileSync(path.join(source, "art", file)),
      `${file} matches captured art`,
    );
});

test("Nahor uses the app runtime and captured animation engines without sample code", () => {
  const html = read(pkg, "index.html");
  assert.match(html, /platform-bridge\.js/);
  assert.match(html, /fonts\.css/);
  assert.doesNotMatch(
    html,
    /sample-invitation|sample-overrides|fonts\.googleapis|fonts\.gstatic|preconnect/,
  );
  const shared = path.join(
    source,
    "../../shared/vendor",
  );
  for (const file of ["gsap.min.js", "ScrollTrigger.min.js", "lz-string.min.js"])
    assert.deepEqual(
      readFileSync(path.join(pkg, "vendor", file)),
      readFileSync(path.join(shared, file)),
      `${file} matches the source dependency`,
    );
  const references = [
    ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (m) => m[1]),
    ...Array.from(read(pkg, "fonts.css").matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g), (m) => m[1]),
    ...Array.from(read(pkg, "template.css").matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g), (m) => m[1]),
  ].filter((ref) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(ref));
  for (const reference of references)
    assert.ok(existsSync(path.resolve(pkg, reference)), `missing local asset ${reference}`);
  const htmlMeta = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  assert.ok(htmlMeta && existsSync(path.resolve(pkg, htmlMeta)), "Open Graph image resolves locally");
});

test("Nahor bundles exact Latin/Cyrillic font faces for each captured family", () => {
  const css = read(pkg, "fonts.css");
  for (const family of ["Lora", "Great Vibes"])
    assert.match(css, new RegExp(`font-family:\\s*'${family}'`));
  for (const subset of ["latin", "latin-ext", "cyrillic", "cyrillic-ext"])
    assert.ok(css.includes(`-${subset}.woff2`), `missing ${subset} subset`);
  assert.doesNotMatch(css, /https?:\/\//);
});

test("Nahor opening artwork is a checksummed portrait capture of the central fixture", () => {
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
    read(path.join(root, "apps/web/src/modules/catalog"), "preview-sample.json"),
  );
  assert.equal(image.toString("ascii", 0, 4), "RIFF");
  assert.equal(image.toString("ascii", 8, 12), "WEBP");
  assert.deepEqual(
    [image.readUInt16LE(26) & 0x3fff, image.readUInt16LE(28) & 0x3fff],
    [480, 720],
  );
  assert.deepEqual([provenance.width, provenance.height], [480, 720]);
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.equal(provenance.fixtureLocale, fixture.defaultLocale);
  assert.deepEqual(provenance.fixtureNames, fixture.content[fixture.defaultLocale].people);
  assert.equal(
    provenance.sourceOpening,
    "closed Nahor qozon invitation with localized greeting, lid interaction, and dawn artwork",
  );
  assert.equal(provenance.sha256, createHash("sha256").update(image).digest("hex"));
});
