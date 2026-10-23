import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import { templateById } from "@taklifnoma/contracts";

const root = new URL("../apps/web/public/templates/modern-floral/", import.meta.url);
const htmlUrl = new URL("index.html", root);
const cssUrl = new URL("adapter.css", root);
const motionUrl = new URL("source-motion.js", root);
const bridgeUrl = new URL("bridge.js", root);
const provenanceUrl = new URL("source-assets.provenance.json", root);
const coverUrl = new URL("catalog-opening.jpg", root);
const sourceChunkUrl = new URL("../Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0umiwyco9-jdx.js", import.meta.url);
const sourceCaptureUrl = new URL("../Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/modern-floral/preview-frame.html", import.meta.url);
const packagedCaptureUrl = new URL("../apps/web/public/templates/modern-floral/source/preview-frame.html", import.meta.url);
const sourceStylesDir = new URL("../Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/", import.meta.url);
const packagedStylesDir = new URL("../apps/web/public/templates/chorlove/shared/_next/static/chunks/", import.meta.url);
const sourceMediaDir = new URL("../Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/media/", import.meta.url);
const packagedMediaDir = new URL("../apps/web/public/templates/chorlove/shared/_next/static/media/", import.meta.url);

test("Modern Floral motion port is tied to the captured route module", async () => {
  const provenance = JSON.parse(await readFile(provenanceUrl, "utf8"));
  const sourceChunk = await readFile(sourceChunkUrl);
  const motion = await readFile(motionUrl, "utf8");
  const source = sourceChunk.toString("utf8");
  assert.equal(provenance.sourceMotionModule.sha256, createHash("sha256").update(sourceChunk).digest("hex"));
  assert.match(source, /transition:\{delay:1\.45,duration:1,ease:\[\.83,0,\.17,1\]\}/);
  assert.match(source, /animate:\{opacity:\[0,1,1,0\],scale:\[\.84,1,1,1\.05\],y:\[24,0,0,-18\]\},transition:\{duration:2\.1,ease:"easeOut"\}/);
  assert.match(source, /transition:\{delay:2\.25,duration:\.75,ease:"easeInOut"\}/);
  assert.match(source, /Array\.from\(\{length:34\}\).*left:37\*t%100,delay:t%16\*\.8,duration:12\+t%9\*1\.8,rotate:53\*t%360,size:18\+t%5\*5,drift:8\+t%5\*5/);
  assert.match(source, /initial:\{opacity:0,y:15\},whileInView:\{opacity:1,y:0\},viewport:\{amount:\.2\},transition:\{duration:\.6\}/);
  assert.match(source, /staggerChildren:\.14,delayChildren:\.12/);
  assert.match(source, /staggerChildren:\.14,delayChildren:2\.75/);
  assert.match(source, /animate:\{y:\[0,-8,0\],rotate:\[0,a\?-2:2,0\]\},transition:\{duration:6\+s,repeat:1\/0,ease:"easeInOut"\}/);
  assert.match(source, /transition:\{duration:Math\.max\(2\.2\*E\.length,16\),ease:"linear",repeat:1\/0\}/);
  assert.match(motion, /delay: 1450, duration: 1000, easing: "cubic-bezier\(\.83,0,\.17,1\)"/);
  assert.match(motion, /delay: 2250, duration: 750/);
  assert.match(motion, /setTimeout\(\(\) => \{ if \(opening\.isConnected\) opening\.hidden = true; \}, 3000\)/);
  assert.match(motion, /\(37 \* index\) % 100/);
  assert.match(motion, /\(index % 16\) \* 800/);
  assert.match(motion, /\(12 \+ \(index % 9\) \* 1\.8\) \* 1000/);
  assert.match(motion, /\(53 \* index\) % 360/);
  assert.match(motion, /offset: 1 \/ 3/);
  assert.match(motion, /offset: 2 \/ 3/);
  assert.match(motion, /duration: \(6 \+ delay\) \* 1000, iterations: Infinity, easing: "ease-in-out"/);
  assert.doesNotMatch(motion, /duration: \(6 \+ delay\) \* 1000, delay:/);
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
  assert.equal([...html.matchAll(/style="width:\d+px;height:\d+px;top:-10%;left:/g)].length, 34);
  assert.doesNotMatch(bridge, /hide\(root\.firstElementChild\)/);
});

test("Modern Floral catalog artwork has the source image hash and portrait dimensions", async () => {
  const cover = await readFile(coverUrl);
  const provenance = JSON.parse(await readFile(provenanceUrl, "utf8"));
  assert.equal(templateById("modern-floral")?.previewImage, "/templates/modern-floral/catalog-opening.jpg");
  assert.equal(provenance.catalogArtwork.sha256, createHash("sha256").update(cover).digest("hex"));
  assert.deepEqual(provenance.catalogArtwork.dimensions, [810, 1754]);
  assert.equal(provenance.catalogArtwork.file, "catalog-opening.jpg");
});

test("Modern Floral preserved capture and Chorlove CSS retain source markup and styles", async () => {
  const sourceCaptureBytes = await readFile(sourceCaptureUrl);
  const original = sourceCaptureBytes.toString("utf8").replace(/\r\n?/g, "\n");
  const preserved = (await readFile(packagedCaptureUrl, "utf8")).replace(/\r\n?/g, "\n");
  assert.equal(preserved, original);
  const provenance = JSON.parse(await readFile(provenanceUrl, "utf8"));
  assert.equal(provenance.sourceSnapshot.bytes, sourceCaptureBytes.length);
  assert.equal(provenance.sourceSnapshot.sha256, createHash("sha256").update(sourceCaptureBytes).digest("hex"));

  for (const file of ["0.u3j0~_2ygfx.css", "00sc_9lpb3zcn.css"]) {
    const sourceBytes = await readFile(new URL(file, sourceStylesDir));
    const packageBytes = await readFile(new URL(file, packagedStylesDir));
    const record = provenance.sourceStylesheets.find((item: { name: string }) => item.name === file);
    assert.ok(record, `missing ${file} provenance`);
    assert.equal(record.sourceSha256, createHash("sha256").update(sourceBytes).digest("hex"));
    assert.equal(record.packagedSha256, createHash("sha256").update(packageBytes).digest("hex"));
    const sourceCss = sourceBytes.toString("utf8")
      .replace(/\r\n?/g, "\n")
      .replace(/url\([^)]*\)/g, "url(__asset__)");
    const packageCss = packageBytes.toString("utf8")
      .replace(/\r\n?/g, "\n")
      .replace(/url\([^)]*\)/g, "url(__asset__)");
    assert.equal(packageCss, sourceCss, `${file} declarations differ from source`);
  }

  const sourceEntries = await readdir(sourceMediaDir, { withFileTypes: true });
  const packagedEntries = await readdir(packagedMediaDir, { withFileTypes: true });
  const packagedNames = new Set(packagedEntries.filter((entry) => entry.isFile()).map((entry) => entry.name));
  for (const entry of sourceEntries.filter((item) => item.isFile())) {
    assert.ok(packagedNames.has(entry.name), `missing source media asset ${entry.name}`);
    const sourceBytes = await readFile(new URL(entry.name, sourceMediaDir));
    const packagedBytes = await readFile(new URL(entry.name, packagedMediaDir));
    assert.deepEqual(packagedBytes, sourceBytes, `source media asset differs: ${entry.name}`);
  }

  for (const file of ["0.u3j0~_2ygfx.css", "00sc_9lpb3zcn.css"]) {
    const css = await readFile(new URL(file, packagedStylesDir), "utf8");
    const urls = [...css.matchAll(/url\(([^)]*)\)/g)].map((match) => match[1].replace(/["']/g, ""));
    for (const url of urls) {
      if (url.startsWith("data:") || url === "#default#VML") continue;
      const asset = url.startsWith("/")
        ? new URL(`../apps/web/public${url}`, import.meta.url)
        : new URL(url, packagedStylesDir);
      await readFile(asset);
    }
  }
});
