import { readFile } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { test } from "node:test";

const root = new URL("../apps/web/public/templates/onlinetaklifnoma-oltin-darvoza-ortidagi-baxt/", import.meta.url);

test("Oltin Darvoza exact source art and fonts are packaged with their origins", async () => {
  for (const manifest of ["source/assets-provenance.json", "source/font-provenance.json"]) {
    const entries = JSON.parse(await readFile(new URL(manifest, root), "utf8")) as Array<{ file: string; url: string; sha256: string; bytes: number }>;
    assert.ok(entries.length >= 11, manifest);
    for (const entry of entries) {
      const bytes = await readFile(new URL(entry.file.startsWith("source/") ? entry.file : `source/${manifest.includes("font") ? "fonts" : "assets"}/${entry.file}`, root));
      assert.equal(bytes.length, entry.bytes, `${entry.file} byte count`);
      assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256, `${entry.file} checksum`);
      assert.match(entry.url, /^https:\/\/(?:media\.onlinetaklifnoma\.app|fonts\.(?:googleapis|gstatic)\.com)/);
    }
  }
});

test("Oltin Darvoza renders creator data, APIs, original motion assets, and optional gift", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  assert.match(html, /source\/assets\/fde9099c6e3d3f36\.mp4/);
  assert.match(html, /source\/assets\/dd2fe7c942f5a910\.webp/);
  assert.match(html, /data-section="gift"/);
  for (const field of ["groom", "bride", "message", "dateTime", "venue", "program", "gallery", "contacts", "toyona", "rsvp", "wishesEnabled"])
    assert.ok(bridge.includes(`data.${field}`), `missing ${field} binding`);
  assert.match(bridge, /gift:data\.toyona\?\.enabled/);
  assert.match(bridge, /navigator\.clipboard/);
  assert.match(bridge, /prefers-reduced-motion/);
  assert.match(bridge, /apiBase\+'\/wishes'/);
  assert.doesNotMatch(html + bridge, /Akmal|Madina|Karimovlar|Navro.{0,5}z saroyi|2026|cloudflareinsights|googletagmanager|fetch\(['"]https?:/i);
});

test("Oltin Darvoza is registered unpublished for weddings", async () => {
  const contract = await readFile(new URL("../packages/contracts/src/index.ts", import.meta.url), "utf8");
  const migration = await readFile(new URL("../packages/database/migrations/0097_register_oltin_darvoza_ortidagi_baxt.sql", import.meta.url), "utf8");
  assert.match(contract, /id: "oltin-darvoza-ortidagi-baxt"[\s\S]*?supportedEventTypes: \["wedding"\][\s\S]*?published: false/);
  assert.match(migration, /'oltin-darvoza-ortidagi-baxt',[\s\S]*false/);
  assert.match(migration, /'oltin-darvoza-ortidagi-baxt', 'wedding'/);
  assert.doesNotMatch(migration, /published\s*=\s*true/i);
});
