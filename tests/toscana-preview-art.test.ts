import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const packageRoot = new URL("../apps/web/public/templates/toscana/", import.meta.url);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/toscana/",
  import.meta.url,
);
const normalize = (value: string) =>
  value.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

test("Toscana catalog art is the complete portrait poster used by its captured opening", () => {
  const sourceHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  const opening = sourceHtml.match(/<section class="intro"[\s\S]*?<\/section>/)?.[0];
  assert.ok(opening, "captured opening section is required");
  assert.match(
    opening,
    /<img class="intro__poster" src="art\/aisle\.webp" width="900" height="1350"/,
  );

  const sourceMeta = readFileSync(new URL("meta.js", captureRoot), "utf8");
  const packagedMeta = readFileSync(new URL("meta.js", packageRoot), "utf8");
  assert.match(sourceMeta, /preview:\s*"preview\.webp"/);
  assert.equal(
    normalize(packagedMeta),
    normalize(sourceMeta),
    "keep the captured preview filename contract",
  );

  const openingPoster = readFileSync(new URL("art/aisle.webp", captureRoot));
  assert.deepEqual(readFileSync(new URL("art/aisle.webp", packageRoot)), openingPoster);
  assert.deepEqual(
    readFileSync(new URL("preview.webp", packageRoot)),
    openingPoster,
    "catalog art must be an exact copy of the source opening poster, without a crop or composite",
  );

  const provenance = readFileSync(new URL("SOURCE_ART_PROVENANCE.md", packageRoot), "utf8");
  assert.match(provenance, /full-viewport `\.intro__poster`/);
  assert.match(provenance, /byte-for-byte copy/);
});
