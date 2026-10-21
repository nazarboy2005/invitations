import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const packageRoot = new URL(
  "../apps/web/public/templates/ganch/",
  import.meta.url,
);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/ganch/",
  import.meta.url,
);

function vp8Dimensions(bytes: Buffer) {
  assert.equal(
    bytes.toString("ascii", 12, 16),
    "VP8 ",
    "expected a lossy VP8 WebP image",
  );
  assert.deepEqual(
    [...bytes.subarray(23, 26)],
    [0x9d, 0x01, 0x2a],
    "expected a VP8 keyframe",
  );
  return {
    width: bytes.readUInt16LE(26) & 0x3fff,
    height: bytes.readUInt16LE(28) & 0x3fff,
  };
}

test("Ganch catalog art represents its captured closed-door opening", () => {
  const sourceHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  const opening = sourceHtml.match(
    /<section class="intro"[\s\S]*?<\/section>/,
  )?.[0];
  assert.ok(opening, "captured intro/opening section is required");
  assert.match(opening, /class="door door--left"/);
  assert.match(opening, /class="door door--right"/);
  assert.match(opening, /src="art\/brass-roundel-v2\.webp"/);
  assert.match(opening, /class="intro__greeting"/);
  assert.match(opening, /class="intro__date"/);

  const sourceCss = readFileSync(new URL("template.css", captureRoot), "utf8");
  assert.match(
    sourceCss,
    /\.door__face[^\n]*url\("art\/ganch-doors-v2\.webp"\)/,
  );
  assert.match(
    sourceCss,
    /\.door--right \.door__face[^\n]*background-position: 100% 50%/,
  );

  const sourceMeta = readFileSync(new URL("meta.js", captureRoot), "utf8");
  assert.equal(
    existsSync(new URL("preview.webp", captureRoot)),
    false,
    "the capture only names a preview asset; it does not contain it",
  );
  assert.match(sourceMeta, /preview:\s*"preview\.webp"/);
  assert.equal(
    readFileSync(new URL("meta.js", packageRoot), "utf8"),
    sourceMeta,
    "the package must preserve the captured preview filename",
  );

  for (const art of [
    "ganch-doors-v2.webp",
    "brass-roundel-v2.webp",
    "court-scene-painted.webp",
  ]) {
    assert.deepEqual(
      readFileSync(new URL(`art/${art}`, packageRoot)),
      readFileSync(new URL(`art/${art}`, captureRoot)),
      `${art} should remain an exact copy of its captured source`,
    );
  }

  const preview = readFileSync(new URL("preview.webp", packageRoot));
  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.deepEqual(vp8Dimensions(preview), { width: 480, height: 900 });
  assert.notDeepEqual(
    preview,
    readFileSync(new URL("art/ganch-doors-v2.webp", packageRoot)),
    "catalog art includes the intro content, not just a raw door-art asset",
  );
  assert.equal(
    createHash("sha256").update(preview).digest("hex"),
    "7cbd5e63ce5be687937f4adcbe1d4a6f0e13e9888665acd1fa8ffa2ea7f1f548",
    "the stale packaged artwork should remain exactly identified until canonical fixture art is rendered",
  );

  const provenance = readFileSync(
    new URL("SOURCE_ART_PROVENANCE.md", packageRoot),
    "utf8",
  );
  assert.match(provenance, /initial, closed-door opening/);
  assert.match(provenance, /not a crop of the later courtyard/);
  assert.match(provenance, /old A&M monogram and date/);
  assert.match(provenance, /shows 18:00 while the canonical shared fixture has 17:00/);
  assert.match(provenance, /art is a release blocker/);
  assert.match(provenance, /7cbd5e63ce5be687937f4adcbe1d4a6f0e13e9888665acd1fa8ffa2ea7f1f548/);
});
