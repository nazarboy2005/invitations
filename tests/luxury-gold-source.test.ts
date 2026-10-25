import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";

const root = resolve("apps/web/public/templates/luxury-gold");
const html = readFileSync(join(root, "index.html"), "utf8");
const bridge = readFileSync(join(root, "bridge.js"), "utf8");
const manifest = JSON.parse(readFileSync(join(root, "source-assets.provenance.json"), "utf8"));

test("Luxury Gold preserves captured layout, source styles and original assets with provenance", () => {
  const source = readFileSync(join(root, "source/preview-frame.html"));
  const sourceRootCandidate = process.env.CHORLOVE_SOURCE_ROOT || resolve("Invitations - this folder will be removed from production/Chorlove/Web invitations");
  const sourceRoot = existsSync(join(sourceRootCandidate, "templates/luxury-gold/preview-frame.html"))
    ? sourceRootCandidate
    : null;
  const capturedSource = sourceRoot
    ? readFileSync(join(sourceRoot, "templates/luxury-gold/preview-frame.html"))
    : source;
  const normalizeLines = (bytes: Buffer) => Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"));
  if (sourceRoot) {
    assert.equal(capturedSource.length, manifest.sourceSnapshot.bytes);
    assert.equal(createHash("sha256").update(capturedSource).digest("hex"), manifest.sourceSnapshot.sha256);
  } else {
    assert.equal(manifest.sourcePackageSnapshot.normalizedSha256, manifest.sourceSnapshot.sha256);
  }
  assert.deepEqual(normalizeLines(source), normalizeLines(capturedSource));
  assert.equal(createHash("sha256").update(normalizeLines(source)).digest("hex"), manifest.sourcePackageSnapshot.normalizedSha256);
  assert.equal(manifest.sourcePackageSnapshot.lineEndingNormalizedMatch, true);
  assert.equal((html.match(/<section\b/g) || []).length, 14);
  assert.ok(html.includes("inter_fe8b9d92-module__LINzvG__variable"), "source Inter variable class missing from the template root");
  assert.ok(html.includes("playfair_display_fa003182-module__E_H7JW__variable"), "source Playfair Display variable class missing from the template root");
  for (const asset of manifest.assets) {
    const bytes = readFileSync(join(root, asset.file));
    if (asset.sourcePath) {
      assert.equal(createHash("sha256").update(normalizeLines(bytes)).digest("hex"), asset.normalizedSha256);
      assert.equal(asset.lineEndingNormalizedMatch, true);
      if (sourceRoot) {
        const captured = readFileSync(join(sourceRoot, "_next/static/chunks", asset.file.split("/").at(-1)));
        assert.deepEqual(normalizeLines(bytes), normalizeLines(captured));
      }
    } else {
      assert.equal(bytes.length, asset.bytes);
      assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256);
    }
  }
  assert.equal(manifest.assets.length, 4);
  assert.equal(manifest.excludedCapturedGallery.length, 6);
  const sourceModule = sourceRoot
    ? readFileSync(join(sourceRoot, "_next/static/chunks/0io3rqik.2n_m.js"))
    : null;
  if (sourceModule) {
    assert.equal(sourceModule.length, manifest.sourcePageModule.bytes);
    assert.equal(createHash("sha256").update(sourceModule).digest("hex"), manifest.sourcePageModule.sha256);
  }
  assert.equal(manifest.sourcePageModule.sha256, "0693fc8a88c7a71faa8ff3205ffd3e436b6dfcf410602bbb2f2a72517fe65ecc");
  if (sourceRoot) {
    const galleryRuntime = readFileSync(join(sourceRoot, "_next/static/chunks/0jsw~n6ojplnf.js"));
    assert.equal(galleryRuntime.length, manifest.sourceGallery.browserReview.sourceRuntimeChunkBytes);
    assert.equal(createHash("sha256").update(galleryRuntime).digest("hex"), manifest.sourceGallery.browserReview.sourceRuntimeChunkSha256);
  }
  if (sourceModule) {
    const sourceText = sourceModule.toString("utf8");
    for (const sourceSetting of [
      'slideshow:{autoplay:!1,delay:1500}',
      'thumbnails:{position:"bottom",width:84,height:56,border:1,borderRadius:8,padding:0,gap:8}',
      'animation:{swipe:250}',
      'closeOnBackdropClick:!0',
    ]) assert.ok(sourceText.includes(sourceSetting), `source gallery setting missing: ${sourceSetting}`);
  }
  assert.equal(manifest.sourceGallery.settings.slideshowDelayMs, 1500);
  assert.match(bridge, /setInterval\(\(\) => step\(1\), 1500\)/);
  assert.match(bridge, /show = \(direction = 0\)/);
  assert.match(bridge, /\{ duration: 250, easing: "ease-out" \}/);
  assert.match(bridge, /setAttribute\("aria-current", String\(itemIndex === index\)\)/);
  assert.match(bridge, /scrollIntoView\(\{ block: "nearest", inline: "center" \}\)/);
  for (const label of ["Zoom in", "Zoom out", "Play", "Pause", "Previous", "Next"]) {
    assert.ok(bridge.includes(`"${label}"`), `gallery control missing: ${label}`);
  }
  for (const sourceIconPath of [
    "M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z",
    "M7 9h5v1H7z",
    "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
    "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
  ]) assert.ok(bridge.includes(sourceIconPath), `source lightbox icon path missing: ${sourceIconPath}`);
  const adapterStyles = readFileSync(join(root, "adapter.css"), "utf8");
  assert.match(adapterStyles, /flex:0 0 84px;width:84px;height:56px/);
  assert.match(adapterStyles, /border-radius:8px/);
  assert.match(adapterStyles, /\.lg-gallery-overlay button\{position:absolute;z-index:2/);
  assert.match(adapterStyles, /padding:0 calc\(50% - 42px\)/);
  const packagedFontCss = readFileSync("apps/web/public/templates/chorlove/shared/_next/static/chunks/0.u3j0~_2ygfx.css");
  assert.equal(createHash("sha256").update(normalizeLines(packagedFontCss)).digest("hex"), manifest.sourceFonts.stylesheet.sourceSha256);
  if (sourceRoot) {
    const sourceFontCss = readFileSync(join(sourceRoot, "_next/static/chunks/0.u3j0~_2ygfx.css"));
    assert.deepEqual(normalizeLines(packagedFontCss), normalizeLines(sourceFontCss));
  }
  for (const font of manifest.sourceFonts.assets) {
    const packagedFont = readFileSync(join("apps/web/public/templates/chorlove/shared/_next/static/media", font.file));
    assert.equal(packagedFont.length, font.bytes);
    assert.equal(createHash("sha256").update(packagedFont).digest("hex"), font.sha256);
    if (sourceRoot) {
      const sourceFont = readFileSync(join(sourceRoot, "_next/static/media", font.file));
      assert.deepEqual(packagedFont, sourceFont);
    }
  }
  const catalogCover = readFileSync(join(root, manifest.catalogCover.artifact.path));
  assert.equal(catalogCover.length, manifest.catalogCover.artifact.bytes);
  assert.equal(createHash("sha256").update(catalogCover).digest("hex"), manifest.catalogCover.artifact.sha256);
  assert.equal(catalogCover.toString("ascii", 1, 4), "PNG");
  assert.equal(catalogCover.readUInt32BE(16), manifest.catalogCover.artifact.width);
  assert.equal(catalogCover.readUInt32BE(20), manifest.catalogCover.artifact.height);
  assert.equal(manifest.catalogCover.capture.sourceHtmlSha256, manifest.sourceSnapshot.sha256);
  assert.equal(manifest.catalogCover.capture.sourcePageModuleSha256, manifest.sourcePageModule.sha256);
  assert.deepEqual(manifest.catalogCover.capture.viewport, { width: 480, height: 720, deviceScaleFactor: 1 });
});

test("Luxury Gold restores the source opening, section motion, loops and reduced-motion behavior", () => {
  assert.ok(bridge.includes("duration: 750"));
  assert.ok(bridge.includes("delay: 2450"));
  assert.ok(bridge.includes("threshold: [0.35]"));
  assert.ok(bridge.includes("duration: 10000"));
  assert.ok(bridge.includes("duration: 2800"));
  assert.ok(bridge.includes("duration: 3600"));
  assert.ok(bridge.includes("function paintSparkleCanvas"));
  assert.ok(bridge.includes("function makeSparkle"));
  assert.ok(bridge.includes("prefers-reduced-motion"));
  assert.ok(manifest.sourceMotion.adaptation.includes("Web Animations API"));
});

test("Luxury Gold excludes unrelated gallery/sample data and connects the shared contract", () => {
  assert.ok(html.includes('data-chorlove-template="luxury-gold" hidden'));
  assert.ok(!html.includes("_next/image") && !/_next\/static\/chunks\/[\w~.-]+\.js/.test(html));
  for (const excluded of ["orchid-amplop", "gallery-1.webp", "gallery-2.webp", "gallery-3.webp", "gallery-4.webp", "gallery-5.webp", "gallery-6.webp", "ChorLove.uz", "Patrick Watson"]) assert.ok(!html.includes(excluded));
  for (const field of ["groom", "bride", "dateTime", "venue", "toyona", "gallery", "dressCode", "wishes", "contacts", "rsvp", "enabledLocales", "reducedMotion", "music"]) {
    assert.ok(bridge.includes(field), `missing ${field}`);
  }
  assert.ok(bridge.includes("api/public/invitations"));
  const contract = readFileSync("packages/contracts/src/index.ts", "utf8");
  const migration = readFileSync("packages/database/migrations/0117_register_luxury_gold.sql", "utf8");
  assert.ok(contract.includes('id: "luxury-gold"'));
  assert.ok(migration.includes("VALUES ('luxury-gold', 'Luxury Gold', 15000000, 'UZS', false)"));
});
