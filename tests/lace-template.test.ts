import { readFile } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { test } from "node:test";
import { templateById } from "@taklifnoma/contracts";

const root = new URL("../apps/web/public/templates/lace/", import.meta.url);
const archive = new URL("../Invitations - this folder will be removed from production/Chorlove/Web invitations/", import.meta.url);
const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

test("Lace preserves its source and packages every design asset with provenance", async () => {
  const manifest = JSON.parse(await readFile(new URL("source-assets.provenance.json", root), "utf8"));
  const source = await readFile(new URL("source/preview-frame.html", root));
  const original = await readFile(new URL("templates/lace/preview-frame.html", archive));
  assert.deepEqual(source, original);
  assert.equal(source.length, manifest.source.bytes);
  assert.equal(digest(source), manifest.source.sha256);

  for (const record of manifest.capturedStylesheets) {
    const bytes = await readFile(new URL(record.file, root));
    assert.equal(bytes.length, record.bytes, record.file);
    assert.equal(digest(bytes), record.sha256, record.file);
    if (!record.archiveFile.includes("#")) {
      assert.deepEqual(bytes, await readFile(new URL(record.archiveFile, archive)), record.file);
    } else {
      const sourceText = source.toString("utf8");
      const style = sourceText.match(/<style>([\s\S]*?)<\/style>/)?.[1];
      assert.ok(style);
      assert.equal(bytes.toString("utf8"), style, record.file);
    }
  }

  assert.equal(manifest.copiedDesignAssets.length, 29);
  assert.equal(manifest.recoveredSourceAssets.length, 7);
  for (const record of manifest.copiedDesignAssets) {
    const bytes = await readFile(new URL(record.file, root));
    assert.equal(digest(bytes), record.sha256, record.file);
    assert.equal(bytes.length, record.bytes, record.file);
    assert.deepEqual(bytes, await readFile(new URL(record.archiveFile, archive)), record.file);
  }
  for (const record of manifest.recoveredSourceAssets) {
    const bytes = await readFile(new URL(record.file, root));
    assert.equal(digest(bytes), record.sha256, record.file);
    assert.equal(bytes.length, record.bytes, record.file);
    assert.equal(record.statusCode, 200, record.file);
    assert.match(record.sourceUrl, /^https:\/\/chorlove\.uz\/images\/lace\//);
  }

  assert.equal(manifest.runtimeFontAssets.length, 7);
  for (const record of manifest.runtimeFontAssets) {
    const bytes = await readFile(new URL(record.file, root));
    assert.equal(digest(bytes), record.sha256, record.file);
    assert.equal(bytes.length, record.bytes, record.file);
  }
  assert.equal(manifest.remoteSourceStylesheet.statusCode, 200);
  const capturedGoogleCss = await readFile(new URL(manifest.remoteSourceStylesheet.file, root));
  assert.equal(digest(capturedGoogleCss), manifest.remoteSourceStylesheet.sha256);
});

test("Lace retains the opening animation and maps the complete shared invitation", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const style = await readFile(new URL("styles/lace-theme.css", root), "utf8");
  const fonts = await readFile(new URL("styles/fonts.css", root), "utf8");
  assert.equal((html.match(/<section\b/g) || []).length, 12);
  assert.match(html, /data-chorlove-template="lace"/);
  assert.match(html, /assets\/bellagio-2-opt\.mp4/);
  assert.match(html, /src="\/templates\/lace\/bridge\.js"/);
  assert.doesNotMatch(html, /Patrick%20Watson|<script[^>]+src="(?:https?:)?\/\/_next\//i);
  assert.doesNotMatch(style, /fonts\.googleapis\.com|url\(["']?https?:\/\//i);
  assert.doesNotMatch(fonts, /fonts\.gstatic\.com/);
  const localPaths = new Set([
    ...[...html.matchAll(/(?:src|href|poster)="([^"]+)"/g)].map((m) => m[1]),
    ...[...style.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)].map((m) => m[1]),
    ...[...fonts.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)].map((m) => m[1]),
  ].filter((path) => path.startsWith("/templates/lace/assets/")));
  assert.ok(localPaths.size >= 30);
  for (const path of localPaths) {
    await readFile(new URL(path.replace("/templates/lace/", ""), root));
  }
  assert.match(bridge, /d\.eventType/);
  assert.match(bridge, /dateTime/);
  assert.match(bridge, /d\.dressCode/);
  assert.match(bridge, /\/rsvp/);
  assert.match(bridge, /\/wishes/);
  assert.match(bridge, /d\.music\?\.url/);
  assert.match(bridge, /lace-reduced-motion/);
  assert.match(bridge, /postMessage\(\{type:`\$\{id\}:language`/);
  assert.match(bridge, /brand,true/);
  assert.equal(templateById("lace")?.published, false);
  assert.match(await readFile(new URL("../packages/database/migrations/0115_register_lace.sql", import.meta.url), "utf8"), /published\s*=\s*false/);
});
