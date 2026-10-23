import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../apps/web/public/templates/jasmine-white/", import.meta.url);
const archive = new URL(
  "../Invitations - this folder will be removed from production/Chorlove/Web invitations/",
  import.meta.url,
);

test("Jasmine White preserves its captured page, stylesheets, and design artwork", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("source-assets.provenance.json", root), "utf8"),
  );
  const previewManifest = JSON.parse(
    await readFile(new URL("preview.provenance.json", root), "utf8"),
  );
  const preview = await readFile(new URL(previewManifest.artwork.file, root));
  assert.equal(preview.length, previewManifest.artwork.bytes);
  assert.equal(
    createHash("sha256").update(preview).digest("hex"),
    previewManifest.artwork.sha256,
  );
  assert.equal(previewManifest.artwork.dimensions, "432x768");
  assert.equal(
    previewManifest.catalogImage,
    "/templates/jasmine-white/preview.png",
  );
  const source = await readFile(new URL("source/preview-frame.html", root));
  const original = await readFile(
    new URL("templates/jasmine-white/preview-frame.html", archive),
  );
  assert.deepEqual(source, original);
  assert.equal(source.length, manifest.source.bytes);
  assert.equal(
    createHash("sha256").update(source).digest("hex"),
    manifest.source.sha256,
  );

  for (const record of [...manifest.capturedStylesheets, ...manifest.copiedDesignAssets]) {
    const bytes = await readFile(new URL(record.file, root));
    assert.deepEqual(
      bytes,
      await readFile(new URL(record.archiveFile, archive)),
      record.file,
    );
    assert.equal(bytes.length, record.bytes, record.file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      record.sha256,
      record.file,
    );
  }

  assert.equal(manifest.capturedStylesheets.length, 2);
  assert.equal(manifest.copiedDesignAssets.length, 14);
  assert.equal(manifest.recoveredSourceAssets.length, 3);
  assert.equal(manifest.runtimeFontAssets.length, 34);
  for (const record of manifest.runtimeFontAssets) {
    const bytes = await readFile(new URL(record.file, root));
    assert.equal(bytes.length, record.bytes, record.file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      record.sha256,
      record.file,
    );
  }
  const fontCss = await readFile(new URL("styles/fonts.css", root), "utf8");
  const fontUrls = [...fontCss.matchAll(/url\(([^)]+)\)/g)].map((match) =>
    match[1].replace(/^['"]|['"]$/g, ""),
  );
  assert.ok(fontUrls.length > 0);
  for (const url of fontUrls) {
    assert.match(url, /^\/templates\/jasmine-white\/assets\/fonts\//);
    await readFile(new URL(url.replace("/templates/jasmine-white/", ""), root));
  }

  const runtimeHtml = await readFile(new URL("index.html", root), "utf8");
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const sourceMotion = await readFile(
    new URL(manifest.sourceMotion.file, root),
    "utf8",
  );
  assert.equal(Buffer.byteLength(sourceMotion, "utf8"), manifest.sourceMotion.bytes);
  assert.equal(
    createHash("sha256").update(sourceMotion).digest("hex"),
    manifest.sourceMotion.sha256.toLowerCase(),
  );
  assert.match(sourceMotion, /scale:\[1,2,0\]/);
  assert.match(
    bridge,
    /glyph\?\.animate\(\[\{ scale: 1 \}, \{ scale: 2, offset: 0\.5 \}, \{ scale: 0 \}\]/,
  );
  assert.match(runtimeHtml, /source\/styles\/0\.u3j0~_2ygfx\.css/);
  assert.match(runtimeHtml, /source\/styles\/00sc_9lpb3zcn\.css/);
  assert.match(runtimeHtml, /src="\/templates\/jasmine-white\/bridge\.js"/);
  assert.doesNotMatch(runtimeHtml, /<script[^>]+src="(?:https?:)?\/\/_next\//i);
  assert.match(bridge, /d\.eventType \|\| c\.event/);
  assert.match(bridge, /partySize: answer \? 0 : Number\(party\.value \|\| 1\)/);
  assert.match(bridge, /d\.music\?\.url/);
  assert.match(bridge, /src="\/templates\/jasmine-white\/assets\/glass_garden_green\.webp"/);
  assert.match(bridge, /links\.slice\(values\.length\)\.forEach\(\(link\) => hide\(link, true\)\)/);
  assert.match(bridge, /Таклифнома/);
  assert.doesNotMatch(bridge, /Ð|Ñ„|â€”/);

  for (const record of manifest.recoveredSourceAssets) {
    const bytes = await readFile(new URL(record.file, root));
    assert.equal(bytes.length, record.bytes, record.file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      record.sha256,
      record.file,
    );
    assert.equal(record.statusCode, 200, record.file);
    assert.equal(record.mimeType, "image/webp", record.file);
    assert.match(record.sourceUrl, /^https:\/\/chorlove\.uz\/images\/green-garden\//);
  }
  assert.deepEqual(
    await readFile(new URL("assets/dish.webp", root)),
    await readFile(new URL("../green-garden/assets/dish.webp", root)),
  );
  assert.equal(manifest.excludedRelatedTemplateAssets.length, 7);
});
