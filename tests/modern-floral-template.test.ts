import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../apps/web/public/templates/modern-floral/", import.meta.url);
const htmlUrl = new URL("index.html", root);
const cssUrl = new URL("adapter.css", root);
const motionUrl = new URL("source-motion.js", root);
const bridgeUrl = new URL("bridge.js", root);
const provenanceUrl = new URL("source-assets.provenance.json", root);
const coverUrl = new URL("catalog-opening.jpg", root);
const sourceChunkUrl = new URL("../Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0umiwyco9-jdx.js", import.meta.url);

test("Modern Floral motion port is tied to the captured route module", async () => {
  const provenance = JSON.parse(await readFile(provenanceUrl, "utf8"));
  const sourceChunk = await readFile(sourceChunkUrl);
  const motion = await readFile(motionUrl, "utf8");
  assert.equal(provenance.sourceMotionModule.sha256, createHash("sha256").update(sourceChunk).digest("hex"));
  assert.match(motion, /delay: 1450, duration: 1000, easing: "cubic-bezier\(\.83,0,\.17,1\)"/);
  assert.match(motion, /delay: 2250, duration: 750/);
  assert.match(motion, /setTimeout\(\(\) => \{ if \(opening\.isConnected\) opening\.hidden = true; \}, 3000\)/);
  assert.match(motion, /\(37 \* index\) % 100/);
  assert.match(motion, /\(index % 16\) \* 800/);
  assert.match(motion, /\(12 \+ \(index % 9\) \* 1\.8\) \* 1000/);
  assert.match(motion, /\(53 \* index\) % 360/);
  assert.match(motion, /duration: 10000, iterations: Infinity/);
  assert.match(motion, /duration: 2000, iterations: Infinity/);
  assert.match(motion, /prefers-reduced-motion/);
});

test("Modern Floral page loads its source motion runner and preserves source reveal states", async () => {
  const html = await readFile(htmlUrl, "utf8");
  const css = await readFile(cssUrl, "utf8");
  const bridge = await readFile(bridgeUrl, "utf8");
  assert.match(html, /src="\/templates\/modern-floral\/source-motion\.js"/);
  assert.match(html, /data-chorlove-template="modern-floral"/);
  assert.doesNotMatch(css, /section \[style\*="opacity:0"\][^{]*\{[^}]*opacity:1!important/s);
  assert.match(html, /style="opacity:0;transform:translateY\(24px\) scale\(0\.84\)"/);
  assert.doesNotMatch(bridge, /hide\(root\.firstElementChild\)/);
});

test("Modern Floral catalog artwork has the source image hash and portrait dimensions", async () => {
  const cover = await readFile(coverUrl);
  const provenance = JSON.parse(await readFile(provenanceUrl, "utf8"));
  assert.equal(provenance.catalogArtwork.sha256, createHash("sha256").update(cover).digest("hex"));
  assert.deepEqual(provenance.catalogArtwork.dimensions, [810, 1754]);
  assert.equal(provenance.catalogArtwork.file, "catalog-opening.jpg");
});
