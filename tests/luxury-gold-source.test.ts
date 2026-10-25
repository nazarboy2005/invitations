import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";

const root = resolve("apps/web/public/templates/luxury-gold");
const html = readFileSync(join(root, "index.html"), "utf8");
const bridge = readFileSync(join(root, "bridge.js"), "utf8");
const manifest = JSON.parse(readFileSync(join(root, "source-assets.provenance.json"), "utf8"));
const previewSample = JSON.parse(readFileSync(resolve("apps/web/src/modules/catalog/preview-sample.json"), "utf8"));

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
  assert.equal(manifest.excludedCapturedGalleryEvidence.assets.length, 6);
  assert.deepEqual(
    manifest.excludedCapturedGalleryEvidence.assets.map((asset: { path: string }) => asset.path),
    manifest.excludedCapturedGallery,
  );
  for (const asset of manifest.excludedCapturedGalleryEvidence.assets) {
    assert.equal(asset.sourceUrl, `https://chorlove.uz${asset.path}`);
    assert.ok(!manifest.assets.some((packaged: { file: string }) => packaged.file.endsWith(asset.path.split("/").at(-1)!)));
    if (sourceRoot) {
      const capturedAsset = readFileSync(join(sourceRoot, asset.archivePath));
      assert.equal(capturedAsset.length, asset.bytes);
      assert.equal(createHash("sha256").update(capturedAsset).digest("hex"), asset.sha256);
    }
  }
  const previewGallery = previewSample.templateSamples["luxury-gold"].gallery;
  assert.deepEqual(
    previewGallery.map((item: { url: string }) => item.url),
    [2, 1, 3, 6, 4, 5].map((index) => `/templates/chorlove/orchid-amplop/assets/gallery-${index}.webp`),
  );
  for (const asset of manifest.excludedCapturedGalleryEvidence.assets) {
    const packagedPreviewPath = resolve("apps/web/public", `.${previewGallery.find((item: { url: string }) => item.url.endsWith(asset.path.split("/").at(-1)!)).url}`);
    const packagedPreview = readFileSync(packagedPreviewPath);
    assert.equal(packagedPreview.length, asset.bytes);
    assert.equal(createHash("sha256").update(packagedPreview).digest("hex"), asset.sha256);
  }
  assert.match(bridge, /hide\(s, !items\.some\(\(i\) => i\.src\)\)/, "empty creator galleries must stay hidden");
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
  const sourceText = sourceModule?.toString("utf8") || "";
  if (sourceModule) {
    for (const sourceSetting of [
      'slideshow:{autoplay:!1,delay:1500}',
      'thumbnails:{position:"bottom",width:84,height:56,border:1,borderRadius:8,padding:0,gap:8}',
      'animation:{swipe:250}',
      'closeOnBackdropClick:!0',
    ]) assert.ok(sourceText.includes(sourceSetting), `source gallery setting missing: ${sourceSetting}`);
    for (const sourceMotion of [
      'm={once:!0,amount:.35}',
      'duration:.9,ease:"easeOut"',
      'duration:1,ease:"easeOut"',
      'staggerChildren:.13,delayChildren:.12',
      'staggerChildren:.13,delayChildren:3.25',
      'duration:.8,ease:"easeOut"',
      'duration:2.8,repeat:1/0,repeatType:"reverse"',
      'duration:4,repeat:1/0,ease:"easeInOut"',
      'duration:3.5,repeat:1/0,ease:"easeInOut"',
      'duration:8,repeat:1/0,ease:"linear"',
      'duration:3.6,repeat:1/0,repeatDelay:2.4,ease:"easeInOut"',
      'transition:{type:"spring",stiffness:220,damping:15}',
      'duration:.7,delay:.12*a',
      'delay:.09*a,duration:.55',
      'duration:.6}',
      'duration:10,ease:"easeOut"',
    ]) assert.ok(sourceText.includes(sourceMotion), `source motion setting missing: ${sourceMotion}`);
  }
  assert.match(bridge, /threshold: \[0\.35\]/);
  assert.match(bridge, /duration = isScaleVariant \? 1000 : 900/);
  assert.match(bridge, /duration = 800;\s*delay = \(galleryIndex % 3\) \* 100/);
  assert.match(bridge, /duration = 700;\s*delay = index \* 120/);
  assert.match(bridge, /duration = 550;\s*delay = index \* 90/);
  assert.match(bridge, /duration = 600;\s*delay = 0/);
  assert.match(bridge, /duration: 10000/);
  assert.match(bridge, /duration: 2800,[\s\S]*?direction: "alternate"/);
  assert.match(bridge, /duration: 3500, iterations: Infinity, easing: "ease-in-out"/);
  assert.match(bridge, /duration: 4000, iterations: Infinity, easing: "ease-in-out"/);
  assert.match(bridge, /function sourceSpringScaleFrames\(from, to, stiffness, damping, steps = 24\)/);
  assert.match(bridge, /sourceSpringScaleFrames\(0, 1, 220, 15\)/);
  assert.match(bridge, /duration: 400,\s*easing: "linear"/);
  assert.match(bridge, /duration: 6000,[\s\S]*?easing: "linear"/);
  assert.match(bridge, /offset: 0\.6/);
  assert.match(bridge, /offset: 1/);
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
  assert.match(bridge, /corners\.forEach\(\(corner\)\s*=>\s*revealElement\(corner,\s*\{\s*duration:\s*800,\s*opacity:\s*0\.85,\s*easing:\s*"ease-out"\s*\}\)/);
  assert.ok(bridge.includes("all(\"[style*='opacity']\", section)"));
  assert.ok(bridge.includes('getComputedStyle(node).opacity === "0"'));
  assert.ok(bridge.includes("card.dataset.lgGalleryIndex = String(index)"));
  assert.ok(bridge.includes("delay = (galleryIndex % 3) * 100"));
  assert.ok(bridge.includes("galleryObserver = new IntersectionObserver"));
  assert.ok(bridge.includes("all(\"button.cursor-zoom-in\").forEach((card) => galleryObserver.observe(card))"));
  assert.ok(bridge.includes("galleryObserver.unobserve(entry.target)"));
  assert.ok(bridge.includes("duration: 750"));
  assert.ok(bridge.includes("delay: 2450"));
  assert.ok(bridge.includes("threshold: [0.35]"));
  assert.ok(bridge.includes("duration: 10000"));
  assert.ok(bridge.includes("duration: 2800"));
  assert.ok(bridge.includes("duration: 6000"));
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
