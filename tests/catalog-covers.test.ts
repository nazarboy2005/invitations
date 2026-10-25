import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { TEMPLATES } from "@taklifnoma/contracts";
import { CATALOG_COVERS } from "../apps/web/src/modules/catalog/catalog-covers";
import { templatePoster } from "../apps/web/src/modules/catalog/template-poster";

test("curated covers exist, have matching provenance, and fit portrait card bounds", () => {
  const manifest = JSON.parse(
    readFileSync(
      new URL("../docs/catalog-cover-captures.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(manifest.covers.length, Object.keys(CATALOG_COVERS).length);
  for (const entry of manifest.covers) {
    assert.ok(TEMPLATES.some((template) => template.id === entry.id));
    const bytes = readFileSync(
      new URL(`../apps/web/public${CATALOG_COVERS[entry.id]}`, import.meta.url),
    );
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    assert.equal(bytes.toString("ascii", 12, 16), "VP8 ");
    assert.equal(bytes.readUInt16LE(26) & 0x3fff, 480);
    assert.equal(bytes.readUInt16LE(28) & 0x3fff, 800);
    assert.ok(bytes.length < 120_000);
    assert.equal(bytes.length, entry.bytes);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      entry.sha256,
    );
  }
});

test("curation applies consistently while preserving original artwork fallback", () => {
  const ganch = TEMPLATES.find((template) => template.id === "ganch")!;
  const anor = TEMPLATES.find((template) => template.id === "anor")!;
  assert.equal(templatePoster(ganch), "/images/catalog/ganch-cover.webp");
  assert.equal(templatePoster(anor), "/templates/anor/preview.webp");
  assert.equal(
    ganch.previewImage,
    "/templates/ganch/preview-browser-capture.jpg",
  );
});
