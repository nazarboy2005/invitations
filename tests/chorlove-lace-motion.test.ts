import { existsSync } from "node:fs";
import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import test from "node:test";

const sourceRoot = [
  process.env.CHORLOVE_LACE_SOURCE_ROOT,
  "Invitations - this folder will be removed from production/Chorlove/Web invitations",
  String.raw`D:\$RECYCLE.BIN\S-1-5-21-3366971363-407715079-3029606043-1001\$R4OL8GR\Chorlove\Web invitations`,
].find((candidate) => candidate && existsSync(`${candidate}/_next/static/chunks/0j~ix342hy.sg.js`));
if (!sourceRoot) throw new Error("Set CHORLOVE_LACE_SOURCE_ROOT to the recovered Chorlove/Web invitations archive.");
const packageRoot = "apps/web/public/templates/lace";
const provenance = JSON.parse(readFileSync(`${packageRoot}/source-assets.provenance.json`, "utf8")) as {
  copiedDesignAssets: Array<{ archiveFile: string; file: string; sha256: string }>;
  capturedStylesheets: Array<{ archiveFile: string; file: string; sha256: string }>;
  recoveredSourceAssets: Array<{ file: string; sha256: string }>;
  runtimeFontAssets: Array<{ file: string; sha256: string }>;
  remoteSourceStylesheet: { file: string; sha256: string };
};
const sha256 = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const moduleBytes = readFileSync(`${sourceRoot}/_next/static/chunks/0j~ix342hy.sg.js`);
const sourceModule = moduleBytes.toString("utf8");
const motionRuntime = readFileSync(`${sourceRoot}/_next/static/chunks/0ceoe4zwq362f.js`, "utf8");
const sourceCapture = readFileSync(`${sourceRoot}/templates/lace/preview-frame.html`);
const packedCapture = readFileSync(`${packageRoot}/source/preview-frame.html`);
const bridge = readFileSync(`${packageRoot}/bridge.js`, "utf8");
const lightbox = readFileSync(`${packageRoot}/gallery-lightbox.js`, "utf8");
const zoomVendor = readFileSync(`${sourceRoot}/_next/static/chunks/0jsw~n6ojplnf.js`, "utf8");
const thumbnailVendor = readFileSync(`${sourceRoot}/_next/static/chunks/0axwbwbrzg9nc.js`, "utf8");
const css = readFileSync(`${packageRoot}/adapter.css`, "utf8");
const chorloveRenderer = readFileSync("apps/web/src/templates/chorlove/renderer.tsx", "utf8");
const previewSample = JSON.parse(readFileSync("apps/web/src/modules/catalog/preview-sample.json", "utf8")) as { templateSamples: Record<string, { gallery?: Array<{ url: string }> }> };
const normalizeLines = (value: string) => value.replace(/\r\n/g, "\n");

test("Lace source capture and motion module remain tied to the archived originals", () => {
  assert.equal(sha256(moduleBytes), "f8f02fc84097ac74933c62abdbf3f3ef676621bdc450f0686ac106fea836ed69");
  assert.equal(sha256(sourceCapture), "5a73d67ed902928ebc6837d90dca7a97dfc2562985512279b47678022c0791db");
  assert.equal(packedCapture.toString("utf8").replace(/\r\n/g, "\n"), sourceCapture.toString("utf8").replace(/\r\n/g, "\n"));
});

test("Lace package mirrors source opening and reveal choreography", () => {
  assert.match(sourceModule, /amount:\.15,margin:"0px 0px -60px 0px"/);
  assert.match(sourceModule, /duration:\.9,ease:\[\.22,1,\.36,1\]/);
  assert.match(sourceModule, /amount:\.4/);
  assert.match(sourceModule, /duration:\.6,delay:\.05\*l/);
  assert.match(motionRuntime, /e\.ease\?\?\(e\.ease="easeOut"\)/);
  assert.match(motionRuntime, /easeOut:"ease-out"/);
  assert.match(sourceModule, /duration:2,ease:"easeInOut"/);
  assert.match(bridge, /video\.currentTime>0\.05/);
  assert.match(bridge, /remaining<1\.8/);
  assert.match(bridge, /remaining<1\)/);
  assert.match(bridge, /window\.setTimeout\(show,800\)/);
  assert.match(bridge, /threshold: 0\.4/);
  assert.match(bridge, /threshold: 0\.15, rootMargin: "0px 0px -60px 0px"/);
  assert.match(css, /opacity \.9s cubic-bezier\(\.22,1,\.36,1\)/);
  assert.match(css, /transition:opacity \.6s ease-out,transform \.6s ease-out/);
  assert.match(css, /\[data-lace-opening\]\{transition:opacity 2s ease-in-out/);
});

test("Lace gallery preserves the source lightbox controls and motion settings", () => {
  assert.match(sourceModule, /animation:\{swipe:250\}/);
  assert.match(sourceModule, /thumbnails:\{position:"bottom",width:84,height:56,border:1,borderRadius:8,padding:0,gap:8\}/);
  assert.match(sourceModule, /carousel:\{finite:!1\}/);
  assert.match(sourceModule, /controller:\{closeOnBackdropClick:!0\}/);
  assert.match(bridge, /window\.LaceGalleryLightbox\.open\(entries,index,card\)/);
  assert.match(lightbox, /zoomInMultiplier: 2/);
  assert.match(lightbox, /keyboardMoveDistance: 50/);
  assert.match(lightbox, /container\.tabIndex = -1/);
  assert.match(lightbox, /sibling\.setAttribute\("inert"/);
  assert.match(lightbox, /aria-current/);
  assert.match(lightbox, /translateX\(\$\{-delta \* step\}px\)/);
  assert.match(lightbox, /250 \* Math\.abs\(delta\)/);
  assert.match(lightbox, /target\.closest\("\.yarl__slide_wrapper"\)/);
  assert.match(lightbox, /setInterval\(slideshowTick, 1500\)/);
  assert.match(lightbox, /event\.key === "ArrowRight"/);
  assert.match(lightbox, /event\.key === "ArrowLeft"/);
  assert.match(zoomVendor, /zoomInMultiplier:2/);
  assert.match(zoomVendor, /keyboardMoveDistance:50/);
  assert.match(thumbnailVendor, /tabIndex:-1/);
  assert.match(thumbnailVendor, /count:r-v/);
  assert.match(bridge, /hide\(section,entries\.length===0\)/);
});

test("Lace gallery photo files match the exact source image bytes and active order", () => {
  const expected = [
    "8578f6d5f3c2ddc1759c5116dfb4b68cd47f86ea700bfa3777a75fb916734a0b",
    "bcfd6989e53e220164e8d39368a848eed1185c07af73f934c81181af2a690d45",
    "c747d5f2c007ec78d46196fcbf157da871fd4bebd9f0a07863087e9a5787e320",
    "c3d590110524cb7b0148c08aa1543d569f16f54b4672d802bebcf778776df558",
    "bb3c25700cc2aa81a40c46bb20c22cd13403d3e9bcf196c175a94fb7b49c8a2e",
    "35c81b38de8fb85f182b1c1c6149bf9926b2a55c10e845f617fc87605ec63e11",
  ];
  for (const [index, expectedHash] of expected.entries()) {
    const file = `images/templates/orchid-amplop/gallery-${index + 1}.webp`;
    const archived = readFileSync(`${sourceRoot}/${file}`);
    const packaged = readFileSync(`${packageRoot}/assets/gallery-${index + 1}.webp`);
    assert.equal(sha256(archived), expectedHash, `${file} source hash`);
    assert.equal(sha256(packaged), expectedHash, `${file} package hash`);
  }
  assert.deepEqual(previewSample.templateSamples.lace?.gallery?.map(({ url }) => url), [
    "/templates/lace/assets/gallery-2.webp",
    "/templates/lace/assets/gallery-1.webp",
    "/templates/lace/assets/gallery-3.webp",
    "/templates/lace/assets/gallery-6.webp",
    "/templates/lace/assets/gallery-4.webp",
    "/templates/lace/assets/gallery-5.webp",
  ]);
});

test("Lace initial selection preview uses the source sample gallery and creator photos replace it", () => {
  assert.deepEqual(previewSample.templateSamples.lace?.gallery?.map(({ url }) => url), [
    "/templates/lace/assets/gallery-2.webp",
    "/templates/lace/assets/gallery-1.webp",
    "/templates/lace/assets/gallery-3.webp",
    "/templates/lace/assets/gallery-6.webp",
    "/templates/lace/assets/gallery-4.webp",
    "/templates/lace/assets/gallery-5.webp",
  ]);
  assert.doesNotMatch(chorloveRenderer, /templateId === "lace"/);
  assert.match(chorloveRenderer, /makeLegacyData\(invitation, frameLocale, guestName, sampleWishes\)/);
  assert.match(bridge, /const entries=gallery\.filter\(\(item\)=>item\.src\)/);
  assert.doesNotMatch(bridge, /lace-empty-photo/);
});

test("Lace RSVP uses fixed attendance counts without asking guests for a headcount", () => {
  const rsvp = bridge.slice(bridge.indexOf("function renderRsvp"), bridge.indexOf("function renderGift"));
  assert.match(rsvp, /partySize:answer\?0:1/);
  assert.doesNotMatch(rsvp, /maxPartySize|name=["']partySize|party\?\.value/);
});

test("Lace keeps the captured sections and hides optional features when unconfigured", () => {
  assert.equal([...sourceCapture.toString("utf8").matchAll(/<section\b/g)].length, 12);
  assert.doesNotMatch(bridge, /createElement\(["']section/);
  assert.match(bridge, /hide\(section,!venue\.name&&!venue\.address&&!url\)/);
  assert.match(bridge, /hide\(section,program\.length===0\)/);
  assert.match(bridge, /hide\(section,!dress\.enabled\)/);
  assert.match(bridge, /hide\(section,entries\.length===0\)/);
  assert.match(bridge, /hide\(section,!p\.preview&&!p\.data\?\.wishesEnabled\)/);
  assert.match(bridge, /hide\(section,!gift\.enabled\)/);
  assert.match(bridge, /hide\(section,!values\.some\(Boolean\)\)/);
});

test("catalog cover is the original portrait opening poster", () => {
  const poster = readFileSync(`${packageRoot}/assets/bellagio-2-poster.jpg`);
  assert.equal(sha256(poster), "9918bd098acc3620586090b3e6f1eb44dc8876de487849f23c0e272154f5ffff");
  const contracts = readFileSync("packages/contracts/src/index.ts", "utf8");
  const laceRecord = contracts.match(/id: "lace",[\s\S]{0,700}?\n  },/);
  assert.ok(laceRecord, "Lace remains registered in the typed catalog");
  assert.match(laceRecord[0], /previewImage: "\/templates\/lace\/assets\/bellagio-2-poster\.jpg"/);
});

test("every archive-sourced design asset is byte-identical to its captured original", () => {
  for (const asset of provenance.copiedDesignAssets) {
    const original = readFileSync(`${sourceRoot}/${asset.archiveFile}`);
    const packaged = readFileSync(`${packageRoot}/${asset.file}`);
    assert.equal(sha256(original), asset.sha256, `${asset.archiveFile} source hash`);
    assert.deepEqual(packaged, original, `${asset.file} differs from the captured asset`);
  }
});

test("recovered source images and local fonts match their recorded source hashes", () => {
  for (const asset of [...provenance.recoveredSourceAssets, ...provenance.runtimeFontAssets]) {
    const packaged = readFileSync(`${packageRoot}/${asset.file}`);
    assert.equal(sha256(packaged), asset.sha256, `${asset.file} provenance hash`);
  }
  const fontStylesheet = readFileSync(`${packageRoot}/${provenance.remoteSourceStylesheet.file}`);
  assert.equal(sha256(fontStylesheet), provenance.remoteSourceStylesheet.sha256, "downloaded Google Fonts CSS provenance hash");
});

test("captured CSS files match archived bytes modulo Git line-ending conversion", () => {
  const captureHtml = sourceCapture.toString("utf8");
  const inlineStyles = [...captureHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  for (const stylesheet of provenance.capturedStylesheets) {
    const original = stylesheet.archiveFile.startsWith("_next/")
      ? readFileSync(`${sourceRoot}/${stylesheet.archiveFile}`).toString("utf8")
      : inlineStyles[0]?.[1];
    assert.ok(original, `could not locate archived stylesheet ${stylesheet.archiveFile}`);
    assert.equal(
      sha256(Buffer.from(normalizeLines(original))),
      stylesheet.sha256,
      `${stylesheet.archiveFile} source hash`,
    );
    const packaged = readFileSync(`${packageRoot}/${stylesheet.file}`, "utf8");
    assert.equal(
      normalizeLines(packaged),
      normalizeLines(original),
      `${stylesheet.file} differs from its captured source`,
    );
  }
});

