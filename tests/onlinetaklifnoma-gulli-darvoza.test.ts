import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../apps/web/public/templates/onlinetaklifnoma-gulli-darvoza/", import.meta.url);

test("Gulli Darvoza source assets are locally packaged with verified origins", async () => {
  const entries = JSON.parse(await readFile(new URL("source/assets-provenance.json", root), "utf8")) as Array<{ file: string; url: string; sha256: string; bytes: number }>;
  assert.equal(entries.length, 16);
  for (const entry of entries) {
    const assetRoot = entry.file.endsWith(".woff2") ? "source/fonts/" : "source/assets/";
    const bytes = await readFile(new URL(assetRoot + entry.file, root));
    assert.equal(bytes.length, entry.bytes, `${entry.file} byte count`);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256, `${entry.file} checksum`);
    assert.match(entry.url, /^https:\/\/(?:media\.)?onlinetaklifnoma\.app/);
  }
});

test("Gulli Darvoza production renderer uses real invitation data and app APIs", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  assert.match(html, /source\/assets\/gate\.webp/);
  assert.match(html, /source\/assets\/intro\.mp4/);
  assert.match(html, /data-section="gift"/);
  for (const field of ["groom", "bride", "message", "dateTime", "venue", "program", "gallery", "contacts", "toyona", "rsvp", "wishesEnabled"]) {
    assert.ok(bridge.includes(`data.${field}`), `missing ${field} binding`);
  }
  assert.match(bridge, /kind==='rsvp'\?'rsvp':'wishes'/);
  assert.match(bridge, /navigator\.clipboard/);
  assert.match(bridge, /prefers-reduced-motion/);
  assert.match(bridge, /data\.preview/);
  assert.doesNotMatch(html + bridge, /Akmal|Madina|Karimovlar|Navro.{0,5}z saroyi|2026/);
  assert.doesNotMatch(html + bridge, /cloudflareinsights|googletagmanager|\/_next\/static|fetch\(['"]https?:/i);
});

test("Gulli Darvoza is registered unpublished for weddings", async () => {
  const contract = await readFile(new URL("../packages/contracts/src/index.ts", import.meta.url), "utf8");
  const migration = await readFile(new URL("../packages/database/migrations/0096_register_gulli_darvoza.sql", import.meta.url), "utf8");
  assert.match(contract, /id: "gulli-darvoza"[\s\S]*?supportedEventTypes: \["wedding"\][\s\S]*?published: false/);
  assert.match(migration, /VALUES \('gulli-darvoza', 'Gulli darvoza', 15000000, 'UZS', false\)/);
  assert.match(migration, /'gulli-darvoza', 'wedding'/);
  assert.doesNotMatch(migration, /published\s*=\s*true/i);
});
