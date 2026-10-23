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
const normalize = (value: string) =>
  value.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
const body = (html: string) =>
  normalize(html.match(/<body[\s\S]*?<\/body>/)?.[0].trim() ?? "");

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
  for (const name of ["template.css", "i18n.js"])
    assert.equal(
      normalize(
        read(pkg, name).replace("preview-browser-capture.jpg", "preview.webp"),
      ),
      normalize(read(source, name)),
      `${name} matches the capture`,
    );
  const sourceScript = normalize(read(source, "template.js")).replace(
    "../../shared/vendor/three/three.bundle.min.js",
    "vendor/three/three.bundle.min.js",
  );
  assert.equal(normalize(read(pkg, "template.js")), sourceScript);
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
  assert.match(html, /og:image" content="catalog-cover-opening\.png/);
  for (const name of [
    "gsap.min.js",
    "ScrollTrigger.min.js",
    "lz-string.min.js",
  ])
    assert.equal(
      normalize(read(path.join(pkg, "vendor"), name)),
      normalize(read(sourceVendor, name)),
      `${name} matches the captured shared dependency`,
    );
  assert.equal(
    normalize(read(path.join(pkg, "vendor/three"), "three.bundle.min.js")),
    normalize(read(path.join(sourceVendor, "three"), "three.bundle.min.js")),
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

test("Yangi Uy catalog art verifies the full portrait opening and source provenance", () => {
  const priorImage = readFileSync(
    path.join(pkg, "preview-browser-capture.jpg"),
  );
  const provenance = JSON.parse(read(pkg, "preview.provenance.json"));
  const fixtureBytes = readFileSync(
    path.join(root, "apps/web/src/modules/catalog/preview-sample.json"),
  );
  assert.equal(provenance.status, "verified");
  assert.equal(provenance.route, "/preview?template=yangi-uy&qaSilent=1");
  assert.equal(
    provenance.sourceTemplate,
    "Invitations - this folder will be removed from production/Marxaba/Boshqa tadbirlar/templates/yangi-uy",
  );
  assert.equal(provenance.width, 478);
  assert.equal(provenance.height, 668);
  assert.equal(
    provenance.fixtureSha256,
    createHash("sha256").update(fixtureBytes).digest("hex"),
  );
  assert.equal(
    provenance.sha256,
    createHash("sha256")
      .update(readFileSync(path.join(pkg, "catalog-cover-opening.png")))
      .digest("hex"),
  );
  assert.equal(
    provenance.captureMethod,
    "Packaged source renderer, iframe viewport capture",
  );
  assert.equal(
    provenance.scope,
    "complete canonical .intro opening; browser/app UI excluded",
  );
  assert.equal(
    priorImage.subarray(0, 2).toString("hex"),
    "ffd8",
    "the previous capture is preserved",
  );
  assert.ok(existsSync(path.join(pkg, provenance.file)));
  assert.deepEqual(
    createTemplatePreviewSample("yangi-uy").content["uz-Latn"].people,
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
    assert.doesNotMatch(
      content.people.join(" "),
      /Javohir|Madina|Жавохир|Мадина/,
    );
  }
});

test("Yangi Uy metadata and unsupported source fields are recorded precisely", () => {
  const metadata = read(pkg, "meta.js").replace(
    "catalog-cover-opening.png",
    "preview.webp",
  );
  assert.match(metadata, /category: "yangi-uy"/);
  assert.match(metadata, /eventTypes: \["yangi-uy", "osh"\]/);
  const notes = read(pkg, "SOURCE_ADAPTATIONS.md");
  for (const gap of [
    "venue.photo",
    "first localized `content.people` value",
    "0048_add_yangi_uy_template.sql",
    "Boshqa tadbirlar/templates/yangi-uy",
    "complete packaged `.intro`",
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
