import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";

const base = "apps/web/public/templates/onlinetaklifnoma-kapadokiya-tongi";

test("Kapadokiya source assets match their source URLs and checksums", async () => {
  const manifest = JSON.parse(await readFile(`${base}/source/assets-provenance.json`, "utf8"));
  assert.equal(manifest.sourcePageUrl, "https://onlinetaklifnoma.app/templates/kapadokiya-tongi/full");
  assert.equal(manifest.assets.length, 29);
  for (const asset of manifest.assets) {
    const file = `${base}/source/${asset.local}`;
    assert.ok(existsSync(file), asset.local);
    assert.equal(createHash("sha256").update(await readFile(file)).digest("hex"), asset.sha256, asset.local);
  }
  assert.ok(manifest.assets.some((asset: { family?: string }) => asset.family === "Cinzel Decorative"));
  assert.ok(manifest.assets.some((asset: { family?: string }) => asset.family === "EB Garamond"));
  assert.ok(manifest.assets.some((asset: { family?: string }) => asset.family === "Amiri"));
});

test("Kapadokiya adapter uses source art and real invitation fields", async () => {
  const html = await readFile(`${base}/index.html`, "utf8");
  const bridge = await readFile(`${base}/bridge.js`, "utf8");
  const adapter = await readFile("apps/web/src/templates/onlinetaklifnoma/kapadokiya-tongi/renderer.tsx", "utf8");
  const contracts = await readFile("packages/contracts/src/index.ts", "utf8");
  for (const field of ["groom", "bride", "dateTime", "venue", "program", "gallery", "toyona", "rsvp", "wishes", "music"])
    assert.match(bridge, new RegExp(field));
  assert.match(html, /assets\/e924b6a0555070ae\.webp/);
  assert.match(html, /assets\/6ab2a48da7e608b2\.webp/);
  assert.match(html, /assets\/97296127a2ca46ee\.mp4/);
  assert.match(adapter, /CATALOG_PREVIEW_MUSIC/);
  assert.match(contracts, /id: "kapadokiya-tongi"[\s\S]*?published: false/);
  assert.doesNotMatch(bridge, /formspree|webhook|gtag\(/i);
});

test("Kapadokiya gift card hides without actual creator data and supports copying", async () => {
  const bridge = await readFile(`${base}/bridge.js`, "utf8");
  assert.match(bridge, /gift:data\.toyona\?\.enabled && data\.toyona\.cardNumber\?\.trim\(\) && data\.toyona\.cardHolder\?\.trim\(\)/);
  assert.match(bridge, /navigator\.clipboard\?\.writeText[\s\S]*navigator\.clipboard\.writeText\(number\)/);
  assert.match(bridge, /set\('copyFeedback',t\('copied'\)\)/);
});
