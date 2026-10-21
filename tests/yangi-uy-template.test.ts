import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = process.cwd();
const source = path.join(
  root,
  "Invitations - this folder will be removed from production/Marxaba/Boshqa tadbirlar/templates/yangi-uy",
);
const sourceVendor = path.join(
  root,
  "Invitations - this folder will be removed from production/Marxaba/Boshqa tadbirlar/shared/vendor",
);
const pkg = path.join(root, "apps/web/public/templates/yangi-uy");
const renderer = path.join(root, "apps/web/src/templates/yangi-uy");
const read = (base: string, name: string) =>
  readFileSync(path.join(base, name), "utf8");
const body = (html: string) =>
  html
    .match(/<body[\s\S]*?<\/body>/)?.[0]
    .trim()
    .replace(/\r\n/g, "\n") ?? "";

test("Yangi Uy has an isolated typed adapter with preview-only label adaptation", () => {
  const wrapper = read(renderer, "renderer.tsx");
  assert.match(wrapper, /templateId="yangi-uy"/);
  assert.match(wrapper, /props\.preview\s*\?/);
  assert.match(wrapper, /defaultEventLabel/);
  assert.match(wrapper, /previewEventLabels/);
  assert.match(read(renderer, "index.ts"), /YangiUyInvitation/);
  assert.doesNotMatch(wrapper, /sample-overrides|INVITATION_OVERRIDES/);
});

test("Yangi Uy retains the captured body, CSS, translations, metadata, and art", () => {
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
  assert.match(read(pkg, "template.js"), /reduced\(\)/);
  assert.match(read(pkg, "template.css"), /prefers-reduced-motion/);
  assert.match(read(pkg, "template.js"), /switchToFallback/);
  assert.match(read(pkg, "template.js"), /window\.gsap/);
  assert.deepEqual(
    readFileSync(path.join(pkg, "art/house-iso.webp")),
    readFileSync(path.join(source, "art/house-iso.webp")),
  );
});

test("Yangi Uy excludes captured sample data and resolves only local production dependencies", () => {
  const html = read(pkg, "index.html");
  assert.match(html, /platform-bridge\.js/);
  assert.match(html, /fonts\.css/);
  assert.doesNotMatch(
    html,
    /sample-invitation|sample-overrides|fonts\.googleapis|fonts\.gstatic|preconnect/,
  );
  assert.match(html, /og:image" content="preview\.webp/);
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
  const refs = [
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
  for (const ref of refs)
    assert.ok(
      existsSync(path.resolve(pkg, ref)),
      `missing local reference ${ref}`,
    );
  assert.ok(existsSync(path.join(pkg, "vendor/three/three.bundle.min.js")));
  assert.ok(existsSync(path.join(pkg, "preview.webp")));
});

test("Yangi Uy bundles the captured font families, weights, and Cyrillic glyphs", () => {
  const css = read(pkg, "fonts.css");
  for (const family of ["Spectral", "Inter"])
    assert.match(css, new RegExp(`font-family:\\s*'${family}'`));
  for (const weight of ["400", "500", "600", "700"])
    assert.match(css, new RegExp(`font-weight:${weight};`));
  for (const subset of ["latin", "latin-ext", "cyrillic", "cyrillic-ext"])
    assert.ok(css.includes(`-${subset}.woff2`), `missing ${subset} subset`);
  assert.doesNotMatch(css, /https?:\/\//);
  const faces = css.match(/@font-face/g) ?? [];
  assert.ok(faces.length >= 20, "all requested local font faces are present");
});

test("Yangi Uy catalog art stays blocked on a source-backed opening capture", () => {
  const image = readFileSync(path.join(pkg, "preview.webp"));
  const provenance = JSON.parse(read(pkg, "preview.provenance.json")) as {
    width: number;
    height: number;
    fixture: string;
    fixtureLocale: string;
    fixtureNames: string[];
    sourceOpening: string;
    sha256: string;
    releaseStatus: string;
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
  assert.match(
    provenance.sourceOpening,
    /captured Yangi Uy housewarming opening/,
  );
  assert.equal(
    provenance.releaseStatus,
    "stale-needs-render-after-household-fixture-integration",
    "catalog artwork must be regenerated after the localized household fixture changes",
  );
  assert.equal(
    provenance.sha256,
    createHash("sha256").update(image).digest("hex"),
  );
  assert.equal(
    existsSync(path.join(source, "preview.webp")),
    false,
    "captured metadata names a preview.webp that the source capture does not contain",
  );
  assert.deepEqual(
    readdirSync(path.join(source, "art")),
    ["house-iso.webp"],
    "the only captured art is an isolated house illustration, not a complete first-page render",
  );
  assert.deepEqual(provenance.fixtureNames, ["Javohir", "Madina"]);
  assert.deepEqual(
    createTemplatePreviewSample("yangi-uy").content[fixture.defaultLocale]
      .people,
    ["Rahmonovlar xonadoni"],
  );
});

test("Yangi Uy sample opening data is localized and household-specific in every supported locale", () => {
  const sample = createTemplatePreviewSample("yangi-uy");
  const expected = {
    "uz-Latn": {
      person: "Rahmonovlar xonadoni",
      event: "Yangi uy to‘yi",
      title: "Yangi xonadonimiz",
    },
    "uz-Cyrl": {
      person: "Раҳмоновлар хонадони",
      event: "Янги уй тўйи",
      title: "Янги хонадонимиз",
    },
    en: {
      person: "The Rahmonov family home",
      event: "Housewarming celebration",
      title: "Our new home",
    },
    ru: {
      person: "Дом семьи Рахмоновых",
      event: "Новоселье",
      title: "Наш новый дом",
    },
  } as const;

  for (const [locale, opening] of Object.entries(expected)) {
    const content = sample.content[locale as keyof typeof sample.content];
    assert.deepEqual(content.people, [opening.person], `${locale} household`);
    assert.equal(content.eventLabel, opening.event, `${locale} event label`);
    assert.equal(content.title, opening.title, `${locale} page title`);
    assert.doesNotMatch(content.people.join(" "), /Javohir|Madina|Жавохир|Мадина/);
  }
});

test("Yangi Uy metadata and unsupported source fields are recorded precisely", () => {
  const metadata = read(pkg, "meta.js");
  assert.match(metadata, /category: "yangi-uy"/);
  assert.match(metadata, /eventTypes: \["yangi-uy", "osh"\]/);
  const notes = read(pkg, "SOURCE_ADAPTATIONS.md");
  for (const gap of [
    "venue.photo",
    "first localized `content.people` value",
    "0048_add_yangi_uy_template.sql",
  ])
    assert.ok(
      notes.includes(gap),
      `missing documented integration gap: ${gap}`,
    );
});

test("Yangi Uy source gallery retains controls, wrapped navigation, and empty media fallback", () => {
  const html = read(pkg, "index.html");
  const core = read(
    path.join(root, "apps/web/public/templates/shared/nikoh"),
    "core.js",
  );
  const sourceGallery = read(source, "index.html").match(
    /<section class="section room room--garden"[\s\S]*?<\/section>/,
  )?.[0];
  const packageGallery = html.match(
    /<section class="section room room--garden"[\s\S]*?<\/section>/,
  )?.[0];
  assert.ok(sourceGallery && packageGallery);
  assert.equal(
    packageGallery.replace(/\r\n/g, "\n"),
    sourceGallery.replace(/\r\n/g, "\n"),
    "captured source gallery is unchanged",
  );
  assert.match(packageGallery, /data-gallery-prev/);
  assert.match(packageGallery, /data-gallery-next/);
  assert.match(packageGallery, /data-gallery-dots/);
  assert.match(
    core,
    /index=\(number\+state\.items\.length\) % state\.items\.length/,
  );
  assert.match(core, /behavior: reducedMotion\?'instant':'smooth'/);
  assert.match(core, /showPhotoFallback\(img\)/);
  const sample = createTemplatePreviewSample("yangi-uy");
  assert.equal(sample.gallery.length, 6);
  assert.ok(
    sample.gallery.every(({ url, alt, caption }) => !url && !alt && !caption),
  );
});
