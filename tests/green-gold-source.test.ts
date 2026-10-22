import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { templateById } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = new URL("../apps/web/public/templates/green-gold/", import.meta.url);
const archive = new URL(
  "../../Invitations - this folder will be removed from production/Chorlove/Web invitations/",
  import.meta.url,
);

test("Green Gold preserves the captured snapshot byte-for-byte", async () => {
  const preserved = await readFile(new URL("source/preview-frame.html", root));
  const original = await readFile(
    new URL("templates/green-gold/preview-frame.html", archive),
  );
  const manifest = JSON.parse(
    await readFile(new URL("source-assets.provenance.json", root), "utf8"),
  );
  assert.deepEqual(preserved, original);
  assert.equal(
    createHash("sha256").update(preserved).digest("hex"),
    manifest.source.sha256,
  );
  assert.equal(preserved.length, manifest.source.bytes);
});

test("Green Gold stages exact design assets and excludes sample gallery images", async () => {
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
    const original = await readFile(new URL(relativeArchiveFile, archive));
    assert.deepEqual(bytes, original, asset.file);
  }
  assert.deepEqual(manifest.missingSourceAssets, []);
  const recovered = manifest.sourceAssetsFromLive.find((asset: { file: string }) =>
    asset.file === "assets/vertical-line.webp",
  );
  assert.ok(recovered);
  const recoveredBytes = await readFile(new URL(recovered.file, root));
  assert.equal(recoveredBytes.length, recovered.bytes);
  assert.equal(createHash("sha256").update(recoveredBytes).digest("hex"), recovered.sha256);
  assert.match(recovered.sourceUrl, /_next\/image/);
  assert.equal(recovered.transformation.includes("original PNG was absent from archive"), true);
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
    assert.deepEqual(
      bytes,
      await readFile(new URL(relativeArchiveFile, archive)),
      sheet.file,
    );
  }
});

test("Green Gold runnable adapter isolates the source sections from site runtime and sample data", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const css = await readFile(new URL("adapter.css", root), "utf8");
  assert.equal((html.match(/<section\b/g) ?? []).length, 13);
  assert.match(html, /data-chorlove-template="green-gold"/);
  assert.match(html, /assets\/vertical-line\.webp/);
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
  assert.match(bridge, /c\.partySize/);
  assert.match(bridge, /c\.playMusic/);
  assert.match(bridge, /ggGuestInitialized/);
  assert.match(bridge, /party\.replaceChildren/);
  assert.match(bridge, /guestRequired/);
  assert.match(bridge, /wishRequired/);
  assert.match(bridge, /chooseResponse/);
  assert.match(bridge, /input.disabled = false/);
  assert.match(bridge, /area.disabled = false/);
  assert.match(bridge, /role", alert \? "alert" : "status"/);
  assert.match(bridge, /ArrowRight/);
  assert.match(bridge, /aria-label", alt/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-width:28px;min-height:28px/);
  assert.match(bridge, /"uz-Cyrl":"\\u040e\\u0437"/);
  assert.doesNotMatch(bridge, /p\.locale==="ru"\?"Send gift"/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /scroll-snap-type:y mandatory/);
});


test("Green Gold is internally registered but remains unpublished", async () => {
  const definition = templateById("green-gold");
  assert.ok(definition);
  assert.equal(definition.published, false);
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
});
