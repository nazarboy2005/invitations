import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

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
  assert.equal(staged.length, manifest.copiedDesignAssets.length);
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
  assert.ok(
    manifest.missingSourceAssets.some((entry: string) =>
      entry.includes("vertical-line.png"),
    ),
  );
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
