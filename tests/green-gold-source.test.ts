import { readFile } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { templateById } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = new URL("../apps/web/public/templates/green-gold/", import.meta.url);
const archive = new URL(
  "../Invitations - this folder will be removed from production/Chorlove/Web invitations/",
  import.meta.url,
);
const archiveHasFile = (relativeFile: string) =>
  existsSync(fileURLToPath(new URL(relativeFile, archive)));

test("Green Gold preserves the captured snapshot byte-for-byte", async () => {
  const preserved = await readFile(new URL("source/preview-frame.html", root));
  const manifest = JSON.parse(
    await readFile(new URL("source-assets.provenance.json", root), "utf8"),
  );
  if (archiveHasFile("templates/green-gold/preview-frame.html")) {
    assert.deepEqual(
      preserved,
      await readFile(new URL("templates/green-gold/preview-frame.html", archive)),
    );
  }
  assert.equal(
    createHash("sha256").update(preserved).digest("hex"),
    manifest.source.sha256,
  );
  assert.equal(preserved.length, manifest.source.bytes);
});

test("Green Gold stages exact design assets and keeps source gallery photos preview-only", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("source-assets.provenance.json", root), "utf8"),
  );
  const staged = await readdir(new URL("assets/", root));
  assert.equal(staged.length, manifest.copiedDesignAssets.length + 1);
  for (const asset of manifest.copiedDesignAssets) {
    const bytes = await readFile(new URL(asset.file, root));
    assert.equal(bytes.length, asset.bytes, asset.file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      asset.sha256,
      asset.file,
    );
    const relativeArchiveFile = asset.archiveFile.replace(
      /^Chorlove\/Web invitations\//,
      "",
    );
    if (archiveHasFile(relativeArchiveFile)) {
      const original = await readFile(new URL(relativeArchiveFile, archive));
      assert.deepEqual(bytes, original, asset.file);
    }
  }
  assert.deepEqual(manifest.missingSourceAssets, []);
  const recovered = manifest.sourceAssetsFromLive.find((asset: { file: string }) =>
    asset.file === "assets/vertical-line.png",
  );
  assert.ok(recovered);
  const recoveredBytes = await readFile(new URL(recovered.file, root));
  assert.equal(recoveredBytes.length, recovered.bytes);
  assert.equal(createHash("sha256").update(recoveredBytes).digest("hex"), recovered.sha256);
  assert.equal(recovered.sourceUrl, "https://chorlove.uz/images/green-gold/vertical-line.png");
  assert.match(recovered.transformation, /exact original PNG response/);
  for (const observed of manifest.sourceAssetsFromLive) {
    const bytes = await readFile(new URL(observed.file, root));
    assert.equal(bytes.length, observed.bytes, observed.file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      observed.sha256,
      observed.file,
    );
    assert.match(observed.sourceUrl, /^https:\/\/chorlove\.uz\//);
  }
  assert.equal(
    staged.some((name) => /^gallery-[1-6]\.webp$/.test(name)),
    false,
  );
  assert.equal(manifest.excludedSnapshotAssets.length, 6);
  const gallery = manifest.previewOnlySourceGallery;
  assert.equal(gallery.sourceModule.moduleId, "437202");
  assert.deepEqual(gallery.archiveFiles.map((file: string) => file.split("/").at(-1)), [
    "gallery-2.webp", "gallery-1.webp", "gallery-3.webp",
    "gallery-6.webp", "gallery-4.webp", "gallery-5.webp",
  ]);
  const orchidAssets = new URL("../chorlove/orchid-amplop/assets/", root);
  for (const [index, imageNumber] of [2, 1, 3, 6, 4, 5].entries()) {
    const servedFile = `gallery-${imageNumber}.webp`;
    const bytes = await readFile(new URL(servedFile, orchidAssets));
    const originalGalleryFile = `images/templates/orchid-amplop/${servedFile}`;
    if (archiveHasFile(originalGalleryFile)) {
      const original = await readFile(
        new URL(originalGalleryFile, archive),
      );
      assert.deepEqual(bytes, original, servedFile);
    }
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      gallery.sha256[index],
      servedFile,
    );
    assert.equal(
      gallery.servedFiles[index],
      `/templates/chorlove/orchid-amplop/assets/${servedFile}`,
    );
  }
});

test("Green Gold keeps the captured stylesheet dependencies for source fidelity review", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("source-assets.provenance.json", root), "utf8"),
  );
  assert.equal(manifest.capturedStylesheets.length, 2);
  for (const sheet of manifest.capturedStylesheets) {
    const bytes = await readFile(new URL(sheet.file, root));
    assert.equal(bytes.length, sheet.bytes, sheet.file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      sheet.sha256,
      sheet.file,
    );
    const relativeArchiveFile = sheet.archiveFile.replace(
      /^Chorlove\/Web invitations\//,
      "",
    );
    if (archiveHasFile(relativeArchiveFile)) {
      assert.deepEqual(
        bytes,
        await readFile(new URL(relativeArchiveFile, archive)),
        sheet.file,
      );
    }
  }
});

test("shared Chorlove stylesheet dependencies resolve to exact local assets", async () => {
  const shared = new URL("../chorlove/shared/", root);
  const manifest = JSON.parse(
    await readFile(new URL("shared-assets.provenance.json", shared), "utf8"),
  );
  const servedCss = await readFile(
    new URL(manifest.servedStylesheet.file, shared),
  );
  assert.equal(servedCss.length, manifest.servedStylesheet.bytes);
  assert.equal(
    createHash("sha256").update(servedCss).digest("hex"),
    manifest.servedStylesheet.sha256,
  );
  assert.doesNotMatch(servedCss.toString("utf8"), /url\(\/fonts\//);
  const sourceManifest = JSON.parse(
    await readFile(new URL("source-assets.provenance.json", root), "utf8"),
  );
  assert.equal(
    sourceManifest.capturedStylesheets.find((sheet: { file: string }) =>
      sheet.file.endsWith("00sc_9lpb3zcn.css"),
    ).sha256,
    manifest.sourceStylesheet.sha256BeforeRewrite,
  );
  for (const font of manifest.fonts) {
    const bytes = await readFile(
      new URL(`../chorlove/shared/${font.servedFile}`, root),
    );
    const originalFontFile = font.archiveFile.replace(
      /^Chorlove\/Web invitations\//,
      "",
    );
    if (archiveHasFile(originalFontFile)) {
      const original = await readFile(
        new URL(originalFontFile, archive),
      );
      assert.deepEqual(bytes, original, font.servedFile);
    }
    assert.equal(bytes.length, font.bytes, font.servedFile);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      font.sha256,
      font.servedFile,
    );
  }
  for (const asset of manifest.recoveredAssets) {
    const bytes = await readFile(new URL(`../chorlove/shared/${asset.file}`, root));
    assert.equal(bytes.length, asset.bytes, asset.file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      asset.sha256,
      asset.file,
    );
    assert.match(asset.sourceUrl, /^https:\/\/chorlove\.uz\/_next\/static\/media\//);
    assert.ok(asset.contentType.startsWith(asset.file.endsWith(".png") ? "image/png" : "font/woff2"));
  }
  const html = await readFile(new URL("index.html", root), "utf8");
  const linkedStylesheets = [...html.matchAll(/href="(\/templates\/[^\"]+\.css)"/g)]
    .map((match) => match[1]);
  const assetChecks = [
    ...[...html.matchAll(/(?:src|href)="(\/[^\"?#]+)"/g)].map((match) => [match[1], root] as const),
  ];
  for (const stylesheet of linkedStylesheets) {
    const stylesheetUrl = stylesheet.startsWith("/templates/green-gold/")
      ? new URL(stylesheet.slice("/templates/green-gold/".length), root)
      : new URL(`../${stylesheet.slice("/templates/".length)}`, root);
    const css = await readFile(stylesheetUrl, "utf8");
    for (const [, resource] of css.matchAll(/url\([\"']?([^\)\"']+)/g)) {
      if (/^(?:data:|https?:|#)/.test(resource)) continue;
      assetChecks.push([resource, stylesheetUrl]);
    }
  }
  for (const [resource, base] of assetChecks) {
    if (resource === "/") continue;
    const target = resource.startsWith("/")
      ? new URL(`../../${resource.slice(1)}`, root)
      : new URL(resource, base);
    await readFile(target);
  }
});

test("Green Gold runnable adapter isolates the source sections from site runtime and sample data", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const css = await readFile(new URL("adapter.css", root), "utf8");
  assert.equal((html.match(/<section\b/g) ?? []).length, 13);
  assert.match(html, /data-chorlove-template="green-gold"/);
  assert.match(html, /assets\/vertical-line\.png/);
  assert.match(html, /background-image:url\(\/templates\/green-gold\/assets\/bg\.webp\)/);
  assert.doesNotMatch(html, /url\(\/images\/green-gold\//);
  assert.doesNotMatch(html, /0m97bbjp\.vgzu\.js|__next_f|chorlove\.uz|@chorlove|Xadicha|Abdurahmonovlar|Toshkent viloyati|Azizbek/);
  assert.doesNotMatch(html, /src="https?:\/\//);
  assert.match(bridge, /d\.groom/);
  assert.match(bridge, /d\.bride/);
  assert.match(bridge, /d\.dateTime/);
  assert.match(bridge, /d\.venue/);
  assert.match(bridge, /d\.contacts/);
  assert.match(bridge, /d\.gallery/);
  assert.match(bridge, /d\.wishes/);
  assert.match(bridge, /\/api\/public\/invitations/);
  assert.match(bridge, /reducedMotion/);
  assert.match(bridge, /Number\.isFinite\(Date\.parse\(d\.dateTime/);
  assert.match(bridge, /c\.giftCta/);
  assert.match(bridge, /showGiftCardDetails/);
  assert.match(bridge, /data\.cardHolder/);
  assert.match(bridge, /data\.cardNumber/);
  assert.match(bridge, /navigator\.clipboard\.writeText/);
  assert.match(bridge, /renderCopyButton\(false\)/);
  assert.match(bridge, /1800/);
  assert.match(bridge, /c\.playMusic/);
  assert.match(bridge, /ggGuestInitialized/);
  assert.doesNotMatch(bridge, /createElement\("select"\)|partySize:.*\.value/);
  assert.match(bridge, /partySize: choice === buttons\[1\] \? 0 : 1/);
  assert.match(bridge, /guestRequired/);
  assert.match(bridge, /wishRequired/);
  assert.match(bridge, /chooseResponse/);
  assert.match(bridge, /input.disabled = false/);
  assert.match(bridge, /area.disabled = false/);
  assert.match(bridge, /role", alert \? "alert" : "status"/);
  assert.match(bridge, /ArrowRight/);
  assert.match(bridge, /aria-label", alt/);
  assert.match(bridge, /const sourcePreviewGallery = \[2, 1, 3, 6, 4, 5\]/);
  assert.match(bridge, /const hasCreatorImages = gallery\.some\(\(item\) => item\?\.src\)/);
  assert.match(bridge, /preview && !hasCreatorImages/);
  assert.match(bridge, /hide\(section, !preview && !hasCreatorImages\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-width:28px;min-height:28px/);
  assert.match(bridge, /"uz-Cyrl":"\\u040e\\u0437"/);
  assert.doesNotMatch(bridge, /p\.locale==="ru"\?"Send gift"/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /scroll-snap-type:y mandatory/);
  assert.match(css, /form \[data-gg-status\]:empty\{display:none\}/);
});

test("Green Gold restores source opening, scroll, ornament, sparkle, wishes, and gallery motion", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const motion = await readFile(new URL("source-motion.js", root), "utf8");
  const css = await readFile(new URL("adapter.css", root), "utf8");
  const original = await readFile(new URL("source/preview-frame.html", root), "utf8");
  const manifest = JSON.parse(
    await readFile(new URL("source-assets.provenance.json", root), "utf8"),
  );
  assert.match(manifest.sourceMotion.sha256, /^[a-f0-9]{64}$/);
  assert.equal(manifest.sourceGiftInteraction.moduleId, "557752");
  assert.equal(manifest.sourceGiftInteraction.routeModuleId, "995238");
  assert.equal(manifest.sourceGiftInteraction.sha256, manifest.sourceMotion.sha256);
  assert.equal((original.match(/opacity:0/g) ?? []).length, 58);
  assert.equal(manifest.sourceMotion.observedSourceMotion.rotatingOrnaments, 18);
  assert.equal(manifest.sourceMotion.observedSourceMotion.revealTransitions, 11);
  assert.match(html, /templates\/green-gold\/source-motion\.js/);
  assert.match(motion, /root\.querySelectorAll\("section"\)/);
  assert.doesNotMatch(motion, /:scope > section/);
  assert.ok(motion.indexOf('const observed = [...revealTargets]') > motion.indexOf('reveal(rsvp?.querySelector(".text-center")'));
  assert.match(motion, /duration: 1500, delay: 1000/);
  assert.match(motion, /translateY\(-20px\)/);
  assert.match(motion, /translateY\(20px\)/);
  assert.match(motion, /duration: 2000, iterations: Infinity/);
  assert.match(motion, /scale\(\.96\)/);
  assert.match(motion, /delay: index \* \(desktop \? 50 : 40\)/);
  assert.match(motion, /duration: Math\.max\(2\.2 \* list\.children\.length, 16\) \* 1000/);
  assert.match(motion, /sections\[2\]\?\.querySelector\("div\.relative\.z-20"\)/);
  assert.doesNotMatch(motion, /reveal\(rsvp\?\.querySelector\("\.mt-6"\)/);
  assert.match(motion, /frames: \[\{ rotate: "0deg" \}, \{ rotate:/);
  assert.match(motion, /function setReducedMotion\(value\)/);
  assert.match(motion, /fill: "none"/);
  assert.match(motion, /IntersectionObserver/);
  assert.match(motion, /prefers-reduced-motion/);
  assert.match(bridge, /GreenGoldSourceMotion\.install/);
  assert.match(bridge, /gg:wishes-updated/);
  assert.match(bridge, /animateGallery/);
  assert.match(bridge, /closeGallery/);
  assert.match(bridge, /\.space-y-3\.py-1/);
  assert.match(bridge, /values\.length >= 4 \? \[\.\.\.values, \.\.\.values\]/);
  assert.match(bridge, /transition duration-500 hover:scale-105/);
  assert.doesNotMatch(css, /gg-sparkle|@keyframes/);
  assert.match(css, /background:rgba\(0,0,0,\.88\)/);
});

test("Green Gold localized control copy decodes in all four locales", async () => {
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const match = bridge.match(/const copy = (\{[\s\S]*?\n  \});/);
  assert.ok(match);
  const copy = runInNewContext(`(${match[1]})`);
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"]) {
    for (const field of [
      "responseLabel",
      "guestRequired",
      "wishRequired",
      "chooseResponse",
      "photo",
      "close",
    ])
      assert.equal(typeof copy[locale][field], "string", `${locale}.${field}`);
  }
  assert.equal(copy["uz-Cyrl"].responseLabel, "\u0416\u0430\u0432\u043e\u0431\u0438\u043d\u0433\u0438\u0437");
  assert.equal(copy.ru.responseLabel, "\u0412\u0430\u0448 \u043e\u0442\u0432\u0435\u0442");
  assert.equal(copy["uz-Cyrl"].guestRequired, "\u0418\u0441\u043c\u0438\u043d\u0433\u0438\u0437\u043d\u0438 \u043a\u0438\u0440\u0438\u0442\u0438\u043d\u0433.");
  assert.equal(copy.ru.photo, "\u0424\u043e\u0442\u043e");
});


test("Green Gold is internally registered but remains unpublished", async () => {
  const definition = templateById("green-gold");
  assert.ok(definition);
  assert.equal(definition.published, false);
  assert.equal(
    definition.previewImage,
    "/templates/green-gold/catalog-cover-opening.png",
  );
  assert.equal(definition.previewEventType, "wedding");
  assert.deepEqual(definition.categoryIds, ["wedding"]);
  const fixture = createTemplatePreviewSample("green-gold");
  assert.equal(fixture.templateId, "green-gold");
  assert.equal(fixture.eventType, "wedding");
  assert.deepEqual(Object.keys(fixture.content).sort(), ["en", "ru", "uz-Cyrl", "uz-Latn"]);
  assert.equal(fixture.gallery.length, 6);
  const contracts = await readFile(
    new URL("../../../../../packages/contracts/src/index.ts", root),
    "utf8",
  );
  const migration = await readFile(
    new URL("../../../../../packages/database/migrations/0100_register_green_gold.sql", root),
    "utf8",
  );
  assert.match(contracts, /id: "green-gold"[\s\S]*?published: false/);
  assert.match(contracts, /id: "green-gold"[\s\S]*?previewEventType: "wedding"/);
  assert.match(migration, /VALUES \('green-gold', 'Green Gold', 15000000, 'UZS', false\)/);
  assert.match(migration, /VALUES \('green-gold', 'wedding'\)/);
  assert.doesNotMatch(migration, /published\s*=\s*true/i);
});



test("Green Gold uses the shared Emotional Piano in the full preview path", async () => {
  const preview = await readFile(
    new URL("../../../../../apps/web/src/modules/catalog/full-template-preview.tsx", root),
    "utf8",
  );
  const renderer = await readFile(
    new URL("../../../../../apps/web/src/templates/chorlove/renderer.tsx", root),
    "utf8",
  );
  assert.match(preview, /isChorloveTemplate\(template\.id\)[\s\S]*?<ChorloveInvitation[\s\S]*?catalogMusic=\{catalogPreview\}/);
  assert.match(renderer, /catalogMusic\s*\?\s*CATALOG_PREVIEW_MUSIC\.url/);
  assert.match(renderer, /silentPlayback: preview && silentPlayback/);
  assert.match(
    renderer,
    /: templateId === "green-gold"\s*\?\s*\{\s*story: false,\s*dressCode: false,\s*extraPeople: false,\s*\}/,
  );
});
