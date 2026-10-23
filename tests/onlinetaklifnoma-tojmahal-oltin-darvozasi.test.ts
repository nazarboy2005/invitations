import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";

const base = "apps/web/public/templates/onlinetaklifnoma-tojmahal-oltin-darvozasi";

test("Tojmahal source art and font subsets match recorded checksums", async () => {
  const manifest = JSON.parse(await readFile(`${base}/source/assets-provenance.json`, "utf8"));
  assert.equal(manifest.sourcePageUrl, "https://onlinetaklifnoma.app/templates/tojmahal-oltin-darvozasi/full");
  assert.equal(manifest.assets.length, 10);
  for (const asset of manifest.assets) {
    const file = `${base}/source/${asset.local}`;
    assert.ok(existsSync(file), asset.local);
    assert.equal(createHash("sha256").update(await readFile(file)).digest("hex"), asset.sha256, asset.local);
  }
});

test("Tojmahal app adapter retains source artwork and dynamic invitation links", async () => {
  const html = await readFile(`${base}/index.html`, "utf8");
  const bridge = await readFile(`${base}/bridge.js`, "utf8");
  const adapter = await readFile("apps/web/src/templates/onlinetaklifnoma/tojmahal-oltin-darvozasi/renderer.tsx", "utf8");
  const contracts = await readFile("packages/contracts/src/index.ts", "utf8");
  for (const field of ["groom", "bride", "dateTime", "venue", "program", "gallery", "toyona", "rsvp", "wishes", "music"])
    assert.match(bridge, new RegExp(field));
  assert.match(html, /247f19e46f38efab\.webp/);
  assert.match(html, /4249201962cd0fe9\.webp/);
  assert.match(html, /b5f8df5b9f0a1a26\.mp4/);
  assert.match(adapter, /CATALOG_PREVIEW_MUSIC/);
  assert.match(contracts, /id: "tojmahal-oltin-darvozasi"[\s\S]*?published: false/);
  assert.doesNotMatch(bridge, /formspree|webhook|gtag\(/i);
});

test("Tojmahal gift only displays actual enabled creator card data", async () => {
  const bridge = await readFile(`${base}/bridge.js`, "utf8");
  assert.match(bridge, /gift:data\.toyona\?\.enabled && data\.toyona\.cardNumber\?\.trim\(\) && data\.toyona\.cardHolder\?\.trim\(\)/);
  assert.match(bridge, /navigator\.clipboard\?\.writeText[\s\S]*navigator\.clipboard\.writeText\(number\)/);
  assert.match(bridge, /set\('copyFeedback',t\('copied'\)\)/);
});
