import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";

const base = "apps/web/public/templates/onlinetaklifnoma-jannat-bogi";

test("Jannat source art and fonts match recorded source URLs and hashes", async () => {
  const manifest = JSON.parse(await readFile(`${base}/source/assets-provenance.json`, "utf8"));
  assert.equal(manifest.sourcePageUrl, "https://onlinetaklifnoma.app/templates/jannat-bogi/full");
  assert.equal(manifest.assets.length, 27);
  for (const asset of manifest.assets) {
    const file = `${base}/source/${asset.local}`;
    assert.ok(existsSync(file), asset.local);
    assert.equal(createHash("sha256").update(await readFile(file)).digest("hex"), asset.sha256, asset.local);
  }
});

test("Jannat app adapter retains its garden art and maps creator invitation data", async () => {
  const html = await readFile(`${base}/index.html`, "utf8");
  const bridge = await readFile(`${base}/bridge.js`, "utf8");
  const adapter = await readFile("apps/web/src/templates/onlinetaklifnoma/jannat-bogi/renderer.tsx", "utf8");
  const contracts = await readFile("packages/contracts/src/index.ts", "utf8");
  for (const field of ["groom", "bride", "dateTime", "venue", "program", "gallery", "toyona", "rsvp", "wishes", "music"])
    assert.match(bridge, new RegExp(field));
  assert.match(html, /e32742ca7893c3a2\.webp/);
  assert.match(html, /8791c73ad8c6e6e6\.webp/);
  assert.match(html, /bfe5519451ae0076\.mp4/);
  assert.match(adapter, /CATALOG_PREVIEW_MUSIC/);
  assert.match(contracts, /id: "jannat-bogi"[\s\S]*?published: false/);
  assert.doesNotMatch(bridge, /formspree|webhook|gtag\(/i);
});

test("Jannat gift is hidden without enabled creator details and copies only the real number", async () => {
  const bridge = await readFile(`${base}/bridge.js`, "utf8");
  assert.match(bridge, /gift:data\.toyona\?\.enabled && data\.toyona\.cardNumber\?\.trim\(\) && data\.toyona\.cardHolder\?\.trim\(\)/);
  assert.match(bridge, /navigator\.clipboard\?\.writeText[\s\S]*navigator\.clipboard\.writeText\(number\)/);
  assert.match(bridge, /set\('copyFeedback',t\('copied'\)\)/);
});
