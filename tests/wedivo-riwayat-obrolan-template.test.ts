import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL(
  "../apps/web/public/templates/wedivo-riwayat-obrolan/",
  import.meta.url,
);
const file = (name: string) => readFile(new URL(name, base), "utf8");
const sha = (buffer: Uint8Array) =>
  createHash("sha256").update(buffer).digest("hex");

test("source identity and all exact captured dependencies are verifiable", async () => {
  const provenance = JSON.parse(await file("source-provenance.json"));
  const capture = await readFile(
    new URL(`../${provenance.sourcePath}`, import.meta.url),
  );
  assert.equal(sha(capture), provenance.sourceSHA256);
  assert.equal(provenance.sourceTemplateId, "cl18spIdFB8VbBu1Yiyb");
  assert.equal(provenance.captureType, "embedded-source");
  assert.equal(provenance.assets.length, 29);
  for (const asset of provenance.assets) {
    const bytes = await readFile(new URL(asset.file, base));
    assert.equal(bytes.length, asset.bytes, asset.file);
    assert.equal(sha(bytes), asset.sha256, asset.file);
  }
});

test("runtime starts from supplied data and carries no provider demo content or runtime", async () => {
  const [html, script, bridge, fonts] = await Promise.all([
    file("index.html"),
    file("source/template.js"),
    file("adapter.js"),
    file("assets/fonts.css"),
  ]);
  assert.doesNotMatch(
    html,
    /wedivo-parameters|wedivo-preview-stub|Bagas|Aulia|AIza|uploads\/music|prewedding\//,
  );
  assert.doesNotMatch(script, /2026-11-19|https:\/\/wedivo\.id\/uploads/);
  assert.doesNotMatch(fonts, /https?:\/\//);
  assert.match(
    bridge,
    /event\.source===parent && event\.origin===location\.origin/,
  );
  assert.match(bridge, /script\.src='source\/template\.js'/);
  assert.match(html, /awaiting-data/);
  assert.match(script, /win\.__RIWAYAT\.eventISO/);
});

test("provider success simulation is replaced with guarded platform requests", async () => {
  const [bridge, source, css] = await Promise.all([
    file("adapter.js"),
    file("source/template.js"),
    file("adapter.css"),
  ]);
  assert.match(bridge, /if\(current\.preview\)throw new Error/);
  assert.match(bridge, /response\.ok \|\| result\.ok!==true/);
  assert.match(bridge, /partySize:map\[status\]==='yes'\?1:0/);
  assert.match(bridge, /request\('rsvp'/);
  assert.match(bridge, /request\('wishes'/);
  assert.match(bridge, /Your wish was sent for approval/);
  assert.doesNotMatch(source, /watchForm|is-submitted|Tanda kasih terkirim/);
  assert.match(css, /#rsvp-pax-w \{ display: none !important/);
  assert.match(bridge, /\['kamus','kontak','draf','video','hadiah'\]/);
});

test("ordered chapters, program, gallery and authored text remain source-bound", async () => {
  const [bridge, source] = await Promise.all([
    file("adapter.js"),
    file("source/template.js"),
  ]);
  assert.match(bridge, /ch\.dataset\.itemId=item\.id/);
  assert.match(source, /i <= win\.__RIWAYAT\.data\.story\.length/);
  assert.match(source, /r\.dataset\.itemId = it\.id/);
  assert.match(
    source,
    /c\.dataset\.itemId = win\.__RIWAYAT\.data\.gallery\[idx\]\.id/,
  );
  assert.match(source, /gi && gi\.caption/);
  assert.match(bridge, /node\.textContent = value \|\| ''/);
  assert.match(bridge, /message\.textContent=wish\.message \|\| wish\.text/);
  assert.match(
    bridge,
    /window\.name=serialized;location\.reload\(\);return;/,
  );
});

test("source assets, motion and locale handling stay in the isolated renderer", async () => {
  const [css, source, bridge, typed] = await Promise.all([
    file("source/template.css"),
    file("source/template.js"),
    file("adapter.js"),
    readFile(
      new URL(
        "../apps/web/src/templates/wedivo-riwayat-obrolan/adapter.ts",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);
  assert.match(css, /#cv-launch/);
  assert.match(source, /function openCover/);
  assert.match(source, /function openViewer/);
  assert.match(source, /function stTick/);
  assert.match(source, /win\.__RIWAYAT\.reducedMotion/);
  assert.match(bridge, /prefers-reduced-motion: reduce/);
  assert.match(
    typed,
    /options\.preview\s*&&\s*options\.sampleWishes\s*&&\s*!invitation\.gallery/,
  );
  assert.match(typed, /eventInstant/);
  assert.match(typed, /formatDate\([\s\S]*locale,\s*"UTC"/);
});
