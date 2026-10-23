import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";

const base = "apps/web/public/templates/onlinetaklifnoma-buxoro-ravoq";

test("Buxoro source files match recorded URLs and checksums", async () => {
  const manifest = JSON.parse(await readFile(`${base}/source/assets-provenance.json`, "utf8"));
  assert.equal(manifest.sourcePageUrl, "https://onlinetaklifnoma.app/templates/buxoro-ravoq/full");
  assert.equal(manifest.assets.length, 20);
  for (const asset of manifest.assets) {
    const file = `${base}/source/${asset.local}`;
    assert.ok(existsSync(file), asset.local);
    assert.equal(createHash("sha256").update(await readFile(file)).digest("hex"), asset.sha256, asset.local);
  }
});

test("Buxoro adapter retains source artwork and connects invitation APIs", async () => {
  const html = await readFile(`${base}/index.html`, "utf8");
  const bridge = await readFile(`${base}/bridge.js`, "utf8");
  const adapter = await readFile("apps/web/src/templates/onlinetaklifnoma/buxoro-ravoq/renderer.tsx", "utf8");
  const contracts = await readFile("packages/contracts/src/index.ts", "utf8");
  for (const field of ["groom", "bride", "dateTime", "venue", "program", "gallery", "toyona", "rsvp", "wishes", "music"])
    assert.match(bridge, new RegExp(field));
  assert.match(html, /portal\.a4bda8eccc9cfdff\.webp/);
  assert.match(html, /couple\.e5dc4431698d979a\.webp/);
  assert.match(html, /intro\.61293985d7707931\.mp4/);
  assert.match(adapter, /CATALOG_PREVIEW_MUSIC/);
  assert.match(contracts, /id: "buxoro-ravoq"[\s\S]*?published: false/);
  assert.doesNotMatch(bridge, /formspree|webhook|gtag\(/i);
});

test("Buxoro gift card requires real data and copies the creator number", async () => {
  const bridge = await readFile(`${base}/bridge.js`, "utf8");
  assert.match(bridge, /gift:data\.toyona\?\.enabled && data\.toyona\.cardNumber\?\.trim\(\) && data\.toyona\.cardHolder\?\.trim\(\)/);
  assert.match(bridge, /navigator\.clipboard\?\.writeText[\s\S]*navigator\.clipboard\.writeText\(number\)/);
  assert.match(bridge, /set\('copyFeedback',t\('copied'\)\)/);
});
