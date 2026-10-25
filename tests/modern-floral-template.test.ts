import { readFile } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { readdir } from "node:fs/promises";
import { test } from "node:test";
import { templateById } from "@taklifnoma/contracts";

const root = new URL("../apps/web/public/templates/modern-floral/", import.meta.url);
const sourceRoot = process.env.MODERN_FLORAL_SOURCE_ROOT
  ? pathToFileURL(`${resolve(process.env.MODERN_FLORAL_SOURCE_ROOT)}${sep}`)
  : new URL("../Invitations - this folder will be removed from production/Chorlove/Web invitations/", import.meta.url);
const htmlUrl = new URL("index.html", root);
const cssUrl = new URL("adapter.css", root);
const motionUrl = new URL("source-motion.js", root);
const bridgeUrl = new URL("bridge.js", root);
const provenanceUrl = new URL("source-assets.provenance.json", root);
const coverUrl = new URL("catalog-opening.jpg", root);
const sourceChunkUrl = new URL("_next/static/chunks/0umiwyco9-jdx.js", sourceRoot);
const sourceGalleryChunkUrl = new URL("_next/static/chunks/09cpm7sbnsw7i.js", sourceRoot);
const sourceWishesChunkUrl = new URL("_next/static/chunks/0q0gfl1vec0ef.js", sourceRoot);
const sourceCaptureUrl = new URL("templates/modern-floral/preview-frame.html", sourceRoot);
const packagedCaptureUrl = new URL("../apps/web/public/templates/modern-floral/source/preview-frame.html", import.meta.url);
const sourceStylesDir = new URL("_next/static/chunks/", sourceRoot);
const packagedStylesDir = new URL("../apps/web/public/templates/chorlove/shared/_next/static/chunks/", import.meta.url);
const sourceMediaDir = new URL("_next/static/media/", sourceRoot);
const packagedMediaDir = new URL("../apps/web/public/templates/chorlove/shared/_next/static/media/", import.meta.url);

async function readIfPresent(path: URL) {
  try {
    return await readFile(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

test("Modern Floral motion port is tied to the captured route module", async () => {
  const provenance = JSON.parse(await readFile(provenanceUrl, "utf8"));
  const sourceChunk = await readIfPresent(sourceChunkUrl);
  const sourceGalleryChunk = await readIfPresent(sourceGalleryChunkUrl);
  const sourceWishesChunk = await readIfPresent(sourceWishesChunkUrl);
  const motion = await readFile(motionUrl, "utf8");
  assert.match(provenance.sourceMotionModule.sha256, /^[a-f\d]{64}$/);
  assert.equal(provenance.sourceGalleryModule.bytes, 76269);
  assert.match(provenance.sourceGalleryModule.sha256, /^[a-f\d]{64}$/);
  assert.equal(provenance.sourceWishesModule.bytes, 74121);
  assert.match(provenance.sourceWishesModule.sha256, /^[a-f\d]{64}$/);
  if (sourceGalleryChunk) {
    const gallery = sourceGalleryChunk.toString("utf8");
    assert.equal(provenance.sourceGalleryModule.bytes, sourceGalleryChunk.length);
    assert.equal(provenance.sourceGalleryModule.sha256, createHash("sha256").update(sourceGalleryChunk).digest("hex"));
    assert.match(gallery, /initial:\{opacity:0\},animate:\{opacity:1\},exit:\{opacity:0\},className:"fixed inset-0 z-\[3000\] flex items-center justify-center bg-black\/88 p-4 backdrop-blur-md"/);
    assert.match(gallery, /initial:\{scale:\.96,opacity:0\},animate:\{scale:1,opacity:1\},exit:\{scale:\.96,opacity:0\}/);
    assert.doesNotMatch(gallery, /data-prev|data-next|ArrowLeft|ArrowRight/);
  }
  if (sourceWishesChunk) {
    const wishes = sourceWishesChunk.toString("utf8");
    assert.equal(provenance.sourceWishesModule.bytes, sourceWishesChunk.length);
    assert.equal(provenance.sourceWishesModule.sha256, createHash("sha256").update(sourceWishesChunk).digest("hex"));
    assert.match(wishes, /animate:E\.length>3\?\{y:\["0%","-50%"\]\}:\{y:"0%"\},transition:\{duration:Math\.max\(2\.2\*E\.length,16\),ease:"linear",repeat:1\/0\}/);
    assert.match(wishes, /className:"space-y-3 py-1",children:E\.map/);
  }
  if (sourceChunk) {
    const source = sourceChunk.toString("utf8");
    assert.equal(provenance.sourceMotionModule.sha256, createHash("sha256").update(sourceChunk).digest("hex"));
    assert.match(source, /transition:\{delay:1\.45,duration:1,ease:\[\.83,0,\.17,1\]\}/);
    assert.match(source, /animate:\{opacity:\[0,1,1,0\],scale:\[\.84,1,1,1\.05\],y:\[24,0,0,-18\]\},transition:\{duration:2\.1,ease:"easeOut"\}/);
    assert.match(source, /transition:\{delay:2\.25,duration:\.75,ease:"easeInOut"\}/);
    assert.match(source, /Array\.from\(\{length:34\}\).*left:37\*t%100,delay:t%16\*\.8,duration:12\+t%9\*1\.8,rotate:53\*t%360,size:18\+t%5\*5,drift:8\+t%5\*5/);
    assert.match(source, /initial:\{opacity:0,y:15\},whileInView:\{opacity:1,y:0\},viewport:\{amount:\.2\},transition:\{duration:\.6\}/);
    assert.match(source, /initial:\{y:5,opacity:0\},animate:\{y:0,opacity:1\}/);
    assert.match(source, /initial:\{opacity:0\},whileInView:\{opacity:\.03\},transition:\{duration:2\}/);
    assert.match(source, /initial:\{opacity:0,scale:\.95\},whileInView:\{opacity:1,scale:1\},transition:\{duration:1\.2\}/);
    assert.match(source, /staggerChildren:\.14,delayChildren:\.12/);
    assert.match(source, /staggerChildren:\.14,delayChildren:2\.75/);
    assert.match(source, /animate:\{y:\[0,-8,0\],rotate:\[0,a\?-2:2,0\]\},transition:\{duration:6\+s,repeat:1\/0,ease:"easeInOut"\}/);
    assert.match(source, /initial:\{opacity:0,y:e\?24:-24\},whileInView:\{opacity:1,y:0\},viewport:C,transition:\{duration:\.9,ease:"easeOut"\}/);
    assert.match(source, /animate:\{rotate:360\},transition:\{duration:20,repeat:1\/0,ease:"linear"\}/);
    assert.match(source, /animate:\{scale:\[1,1\.1,1\]\},transition:\{repeat:1\/0,duration:3\}/);
    assert.match(source, /transition:\{duration:Math\.max\(2\.2\*E\.length,16\),ease:"linear",repeat:1\/0\}/);
    assert.match(source, /whileHover:\{scale:1\.1\},whileTap:\{scale:\.9\},onClick:p,"aria-label":"Toggle music",className:`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center \$\{l\}`/);
    assert.match(source, /buttonClassName:l="bg-white\/90 border border-\[#E5E0D8\] text-\[#A69689\] backdrop-blur-md",activeIconClassName:c="animate-pulse text-\[#FFB6C1\]"/);
    assert.match(source, /whileHover:\{scale:1\.02\},whileTap:\{scale:\.98\},className:"flex items-center justify-center gap-3 bg-white border border-\[#E5E0D8\] text-\[#849685\] px-8 py-4 rounded-2xl/);
  }
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
  assert.match(motion, /translateY\(-24px\).*duration: 900, amount: 0\.35, once: true/s);
  assert.match(motion, /function springFrames\(/);
  assert.match(motion, /function interpolateTransform\(/);
  assert.match(motion, /staggered\.indexOf\(node\);\s*if \(staggerIndex >= 0\) \{\s*config\.delay = 120 \+ staggerIndex \* 140/s);
  assert.match(motion, /section:nth-of-type\(2\) \.relative\.h-16 > \.z-10/);
  assert.match(motion, /duration: 20000, iterations: Infinity, easing: "linear"/);
  assert.match(motion, /duration: 3000, iterations: Infinity/);
  assert.match(motion, /wishes\.animate\(\[\{ transform: "translateY\(0%\)" \}, \{ transform: "translateY\(-50%\)" \}\], \{\s*duration: Math\.max\(2200 \* wishCount, 16000\), iterations: Infinity, easing: "linear",/);
  assert.match(motion, /prefers-reduced-motion/);
  assert.match(motion, /node\.matches\("section:nth-of-type\(2\) > div\.absolute\.inset-0"\)\) return \{ duration: 2000, amount: 0, once: false \}/);
  assert.match(motion, /sectionIndex === 1 && node\.matches\("\.relative\.h-16"\)\) return \{ spring: true, delay: 500, amount: 0, once: false \}/);
  assert.match(motion, /sectionIndex === 3 && node\.matches\("\.absolute\.w-9\.h-9"\)\) return \{ spring: true, stiffness: 200, delay: 400, amount: 0, once: false \}/);
  assert.match(motion, /transform\.includes\("scale\(0\.9\)"\).*amount: 0, once: false/);
  assert.match(motion, /transform\.includes\("scale\(0\.95\)"\)\) return \{ duration: 1200, amount: 0, once: false \}/);
  assert.match(motion, /transform\.includes\("translateY\(5px\)"\)\) return \{ spring: true, mount: true \}/);
  assert.match(motion, /if \(config\.mount\) animateReveal\(node, config\);\s*else observer\.observe\(node\)/);
  assert.match(motion, /const spring = springFrames\(\{ transform: `scale\(\$\{start\}\)` \}, \{ transform: `scale\(\$\{target\}\)` \}\)/);
  assert.match(motion, /bindStates\(music, 1\.1, 0\.9\)/);
  assert.match(motion, /bindStates\(link, 1\.02, 0\.98\)/);
  assert.doesNotMatch(motion, /amount: 0\.5/);
  assert.doesNotMatch(motion, /duration: 150, fill: "forwards"/);
  assert.match(motion, /image\?\.animate\(\[\{ opacity: 0 \}, \{ opacity: 1 \}\], \{ duration: 300, easing: "ease-out", fill: "both" \}\)/);
  assert.match(motion, /springFrames\(\{ transform: "scale\(\.96\)" \}, \{ transform: "scale\(1\)" \}\)/);
  assert.match(motion, /const fade = layer\.animate\(\[\{ opacity: 1 \}, \{ opacity: 0 \}\], \{ duration: 300, easing: "ease-out", fill: "forwards" \}\)/);
});

test("Modern Floral page loads its source motion runner and preserves source reveal states", async () => {
  const html = await readFile(htmlUrl, "utf8");
  const css = await readFile(cssUrl, "utf8");
  const bridge = await readFile(bridgeUrl, "utf8");
  assert.match(css, /right:2rem;bottom:2rem;z-index:110;display:flex;width:3\.5rem;height:3\.5rem/);
  assert.match(css, /background:rgba\(255,255,255,\.9\);color:#A69689/);
  assert.match(bridge, /m\.setAttribute\("aria-label","Toggle music"\)/);
  assert.match(bridge, /audio\.muted=true/);
  assert.match(bridge, /m\.dataset\.playing=String\(!audio\.muted&&!audio\.paused\)/);
  assert.match(bridge, /m\.onclick=\(\)=>\{audio\.muted=!audio\.muted/);
  assert.match(html, /src="\/templates\/modern-floral\/source-motion\.js"/);
  assert.match(html, /data-chorlove-template="modern-floral"/);
  assert.doesNotMatch(css, /section \[style\*="opacity:0"\][^{]*\{[^}]*opacity:1!important/s);
  assert.match(html, /style="opacity:0;transform:translateY\(24px\) scale\(0\.84\)"/);
  assert.equal([...html.matchAll(/style="width:\d+px;height:\d+px;top:-10%;left:/g)].length, 34);
  assert.doesNotMatch(bridge, /hide\(root\.firstElementChild\)/);
  assert.match(bridge, /nameNodes=all\("h2",sec\[1\]\);put\(nameNodes\[0\],z\.groom/);
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
  const sourceCaptureBytes = await readIfPresent(sourceCaptureUrl);
  const original = sourceCaptureBytes?.toString("utf8").replace(/\r\n?/g, "\n");
  const preserved = (await readFile(packagedCaptureUrl, "utf8")).replace(/\r\n?/g, "\n");
  if (original) assert.equal(preserved, original);
  const packagePage = await readFile(htmlUrl, "utf8");
  const sourceBodyClasses = (original || preserved).match(/<body class="([^"]+)"/)?.[1]?.split(/\s+/) ?? [];
  const packageBodyClasses = packagePage.match(/<body class="([^"]+)"/)?.[1]?.split(/\s+/) ?? [];
  for (const fontClass of sourceBodyClasses.filter((className) => className.endsWith("__variable"))) {
    assert.ok(packageBodyClasses.includes(fontClass), `missing source font variable ${fontClass}`);
  }
  const provenance = JSON.parse(await readFile(provenanceUrl, "utf8"));
  assert.ok(provenance.sourceSnapshot.bytes > 0);
  assert.match(provenance.sourceSnapshot.sha256, /^[a-f\d]{64}$/);
  if (sourceCaptureBytes) {
    assert.equal(provenance.sourceSnapshot.bytes, sourceCaptureBytes.length);
    assert.equal(provenance.sourceSnapshot.sha256, createHash("sha256").update(sourceCaptureBytes).digest("hex"));
  }

  for (const file of ["0.u3j0~_2ygfx.css", "00sc_9lpb3zcn.css"]) {
    const sourceBytes = await readIfPresent(new URL(file, sourceStylesDir));
    const packageBytes = await readFile(new URL(file, packagedStylesDir));
    const record = provenance.sourceStylesheets.find((item: { name: string }) => item.name === file);
    assert.ok(record, `missing ${file} provenance`);
    assert.equal(record.packagedSha256, createHash("sha256").update(packageBytes).digest("hex"));
    assert.match(record.sourceSha256, /^[a-f\d]{64}$/);
    if (sourceBytes) {
      assert.equal(record.sourceSha256, createHash("sha256").update(sourceBytes).digest("hex"));
      const sourceCss = sourceBytes.toString("utf8")
        .replace(/\r\n?/g, "\n")
        .replace(/url\([^)]*\)/g, "url(__asset__)");
      const packageCss = packageBytes.toString("utf8")
        .replace(/\r\n?/g, "\n")
        .replace(/url\([^)]*\)/g, "url(__asset__)");
      assert.equal(packageCss, sourceCss, `${file} declarations differ from source`);
    }
  }

  let sourceEntries;
  try {
    sourceEntries = await readdir(sourceMediaDir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const packagedEntries = await readdir(packagedMediaDir, { withFileTypes: true });
  const packagedNames = new Set(packagedEntries.filter((entry) => entry.isFile()).map((entry) => entry.name));
  for (const entry of (sourceEntries || []).filter((item) => item.isFile())) {
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

test("Modern Floral RSVP has fixed party size and exposes only source-backed optionals", async () => {
  const bridge = await readFile(bridgeUrl, "utf8");
  const source = (await readFile(packagedCaptureUrl, "utf8")).replace(/\r\n?/g, "\n");
  assert.equal([...source.matchAll(/<section\b/g)].length, 13);
  assert.doesNotMatch(source, /dress[ -]?code|kiyim kodi|libos kodi/i);
  assert.match(bridge, /form\.querySelector\('\[name="partySize"\]'\)\?\.remove\(\)/);
  assert.match(bridge, /partySize:yes\?1:0/);
  assert.doesNotMatch(bridge, /createElement\(['"]select['"]\).*partySize/s);
  assert.match(bridge, /hide\(sec\[6\],!z\.hosts\)/);
  assert.match(bridge, /hide\(s,!values\.some\(a=>\["phone","telegram"\]/);
  assert.match(bridge, /if\(!g\.enabled\)\{hide\(s\);return;\}/);
  assert.match(bridge, /hide\(section,!preview&&!publicItems\.length\)/);
  assert.ok(bridge.includes("const grids=all('.grid, .md\\\\:grid',section)"));
  const galleryHandler = bridge.slice(bridge.indexOf("function openGallery"), bridge.indexOf("async function renderWishes"));
  assert.match(galleryHandler, /fixed inset-0 z-\[3000\] flex items-center justify-center bg-black\/88 p-4 backdrop-blur-md/);
  assert.match(galleryHandler, /max-h-\[88dvh\] max-w-\[94vw\] rounded-2xl object-contain shadow-2xl/);
  assert.match(galleryHandler, /document\.body\.append\(lightbox\)/);
  assert.match(galleryHandler, /if\(event\.target===lightbox\)close\(\)/);
  assert.doesNotMatch(galleryHandler, /data-prev|data-next|ArrowLeft|ArrowRight|event\.key==='Escape'/);
  assert.match(bridge, /if\(x\.preview\)values=d\(\)\.wishes\|\|\[\];else if\(d\(\)\.wishesEnabled\)/);
  assert.match(bridge, /stack\.dataset\.mfSourceWishCount=String\(values\.length\)/);
  assert.doesNotMatch(bridge, /\bdata\s*\(\s*\)/);
  assert.match(bridge, /hide\(s,!x\.preview&&!d\(\)\.wishesEnabled\)/);
  assert.match(bridge, /hide\(s,!d\(\)\.rsvp\?\.enabled&&!x\.preview\)/);
});
