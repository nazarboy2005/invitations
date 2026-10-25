import { readFileSync } from "./helpers/source-files";
﻿import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { TEMPLATES } from "@taklifnoma/contracts";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = resolve(process.cwd());
const htmlPath = resolve(root, "apps/web/public/templates/glass-pink/index.html");
const html = readFileSync(htmlPath, "utf8");
const bridge = readFileSync(resolve(root, "apps/web/public/templates/glass-pink/bridge.js"), "utf8");
const adapter = readFileSync(resolve(root, "apps/web/public/templates/glass-pink/source-adapter.js"), "utf8");
const adapterCss = readFileSync(resolve(root, "apps/web/public/templates/glass-pink/adapter.css"), "utf8");
const previewPath = resolve(root, "apps/web/public/templates/glass-pink/catalog-cover-opening.png");
const provenancePath = resolve(root, "apps/web/public/templates/glass-pink/source/provenance.json");
const sourceSnapshotPath = resolve(root, "apps/web/public/templates/glass-pink/source/preserved-preview-frame.html");
const archivedSourcePath = resolve(root, "Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/glass-pink/preview-frame.html");

test("Glass Pink is published with its additive release migration", () => {
  const entry = TEMPLATES.find((template) => template.id === "glass-pink");
  assert.ok(entry);
  assert.equal(entry.published, true);
  assert.equal(entry.previewImage, "/templates/glass-pink/catalog-cover-opening.png");
  assert.deepEqual(entry.categoryIds, ["wedding"]);
  assert.deepEqual(entry.supportedEventTypes, ["wedding"]);
  const publication = readFileSync(resolve(root, "packages/database/migrations/0091_publish_glass_pink.sql"), "utf8");
  assert.match(publication, /SET published = true[\s\S]*WHERE id = 'glass-pink'/);
});

test("Glass Pink catalog cover is a settled, clean source opening capture", () => {
  const preview = readFileSync(previewPath);
  const provenance = JSON.parse(readFileSync(provenancePath, "utf8"));
  assert.equal(provenance.catalogCover.file, "../catalog-cover-opening.png");
  assert.match(provenance.catalogCover.source, /^Portrait browser screenshot of the archived Chorlove Glass Pink server-rendered source opening/);
  assert.equal(provenance.catalogCover.viewport, "432x768");
  assert.equal(provenance.catalogCover.fixture, "Archived source snapshot sample invitation");
  assert.equal(provenance.catalogCover.fixtureSha256, null);
  assert.ok(provenance.catalogCover.crop);
  assert.deepEqual(provenance.catalogCover.uiChromeExcluded, ["browser UI", "scrollbar"]);
  assert.match(provenance.catalogCover.openingReveal, /archive compiled module/);
  assert.equal(provenance.catalogCover.captureBrowserVersion, "Chromium local source capture");
  assert.equal(provenance.catalogCover.catalogEligible, true);
  assert.equal(provenance.catalogCover.captureChecks.length, 3);
  assert.match(provenance.catalogCover.visualQa, /Source opening composition retained/);
  assert.match(provenance.catalogCover.runtimeLimitation, /compiled page bundle/);
  assert.equal(provenance.catalogCover.sha256, createHash("sha256").update(preview).digest("hex"));
  assert.equal(preview.readUInt32BE(16), 432);
  assert.equal(preview.readUInt32BE(20), 768);
  assert.equal(preview.toString("ascii", 12, 16), "IHDR");
});

test("Glass Pink source fonts resolve from its isolated asset package", () => {
  const sourceFonts = resolve(root, "Invitations - this folder will be removed from production/Chorlove/Web invitations/fonts");
  const assetFonts = resolve(root, "apps/web/public/templates/glass-pink/assets");
  const css = readFileSync(resolve(root, "apps/web/public/templates/glass-pink/adapter.css"), "utf8");
  const names = [
    "Qellia.otf",
    "CormorantGaramond-Regular.ttf",
    "TheNautigal-Regular.ttf",
    "GreatVibes-Regular.ttf",
    "Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf",
    "Jost-VariableFont_wght.ttf",
    "Marcellus-Regular.ttf",
  ];
  for (const name of names) {
    const source = readFileSync(resolve(sourceFonts, name));
    const packaged = readFileSync(resolve(assetFonts, name));
    assert.deepEqual(packaged, source, `${name} must match the original source font`);
    assert.ok(css.includes(`./assets/${name}`), `${name} must be loaded from the isolated template package`);
  }
  assert.equal((html.match(/>Taklifnoma<\/h1>/g) || []).length, 1);
  assert.equal((html.match(/Taklifnomani ochish/g) || []).length, 1);
});

test("Glass Pink preserves its canonical source snapshot byte-for-byte", () => {
  const archived = readFileSync(archivedSourcePath);
  const preserved = readFileSync(sourceSnapshotPath);
  const provenance = JSON.parse(readFileSync(provenancePath, "utf8"));
  assert.deepEqual(preserved, archived);
  assert.equal(provenance.preservedRawSourceSnapshot.file, "preserved-preview-frame.html");
  assert.equal(provenance.preservedRawSourceSnapshot.byteIdenticalToArchive, true);
  assert.equal(provenance.preservedRawSourceSnapshot.sha256, createHash("sha256").update(preserved).digest("hex"));
  assert.equal(provenance.sourceSha256, createHash("sha256").update(archived).digest("hex"));
});

test("Glass Pink uses only its own artwork and keeps sample gallery content ephemeral", () => {
  const archiveRoot = resolve(root, "Invitations - this folder will be removed from production");
  const providers = readdirSync(archiveRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const canonicalProviders = providers.filter((provider) => {
    const manifestPath = resolve(archiveRoot, provider, "capture-manifest.json");
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      return manifest.pages?.some((page: { title?: string; file?: string }) => page.title === "Glass Pink" || page.file?.includes("glass-pink"));
    } catch {
      return false;
    }
  });
  assert.deepEqual(canonicalProviders, ["Chorlove"]);

  const provenance = JSON.parse(readFileSync(provenancePath, "utf8"));
  const fixture = JSON.parse(readFileSync(resolve(root, "apps/web/src/modules/catalog/preview-sample.json"), "utf8"));
  assert.equal(fixture.gallery.length, 6);
  assert.ok(fixture.gallery.every((item: { url: string; alt: string; caption: string }) => !item.url && !item.alt && !item.caption));
  const previewInvitation = createTemplatePreviewSample("glass-pink");
  assert.equal(previewInvitation.templateId, "glass-pink");
  assert.ok(previewInvitation.gallery.every((item) => !item.url && !item.alt && !item.caption));
  assert.deepEqual(provenance.gallerySourceAudit.eligibleGlassPinkGalleryPhotos, []);
  assert.equal(provenance.gallerySourceAudit.excludedCrossTemplateGalleryPhotos.length, 6);
  const renderer = readFileSync(resolve(root, "apps/web/src/templates/anor/renderer.tsx"), "utf8");
  assert.match(renderer, /gallery:\s*invitation\.gallery\.map/);
  assert.match(renderer, /src:\s*item\.url/);
  assert.doesNotMatch(renderer, /orchid-amplop|gallery-[1-6]\.webp/);
  assert.doesNotMatch(html, /orchid-amplop|gallery-[1-6]\.webp/);
  assert.match(bridge, /const usableGallery = gallery\.filter\(\(item\) => item\?\.src\)/);
  assert.match(bridge, /hide\(storySection, !chapters\.length && !showGallery\)/);
  assert.doesNotMatch(adapter, /data-glass-gallery-dot|data-glass-gallery-nav/);
});

test("Glass Pink ships its captured page without the Chorlove site runtime", () => {
  assert.match(html, /data-chorlove-template="glass-pink"/);
  assert.match(html, /data-chorlove-open/);
  assert.match(html, /data-chorlove-rsvp-section/);
  assert.match(html, /data-chorlove-wishes/);
  assert.doesNotMatch(html, /_next\/static\/chunks\/[a-z0-9._~-]+\.js/);
  assert.doesNotMatch(html, /(?:href|src)=["\']https?:\/\//i);
  assert.doesNotMatch(html, /Muhammad|Xadicha|Abdurahmonov|Azizbek|Navro'z To'yxonasi/);
});

test("Glass Pink runtime binds all four locales and reduced motion", () => {
  assert.match(bridge, /const templateId = "glass-pink"/);
  assert.match(bridge, /rsvp-section/);
  assert.match(adapter, /"uz-Cyrl"/);
  assert.match(adapter, /\ben:/);
  assert.match(adapter, /\bru:/);
  assert.match(adapter, /data-gp-event-summary/);
  assert.match(html, /source-adapter\.js/);
});

test("Glass Pink RSVP keeps source yes/no controls and submits a fixed party size", () => {
  const source = readFileSync(sourceSnapshotPath, "utf8");
  assert.doesNotMatch(source, /name="partySize"|cc-party-size|Mehmonlar soni/);
  assert.match(source, /role="radiogroup"/);
  assert.match(source, /<button[^>]*role="radio"[^>]*>[\s\S]*?Kelaman/);
  assert.match(source, /<button[^>]*role="radio"[^>]*>[\s\S]*?Kela olmayman/);
  assert.doesNotMatch(bridge, /maxPartySize|select\.name = "partySize"|party\.className = "cc-party-size"/);
  assert.match(bridge, /partySize: selected\.dataset\.chorloveRsvp === "yes" \? 1 : 0/);
});

test("Glass Pink wish cards retain the captured layout, timestamp, and wand interaction", () => {
  const source = readFileSync(sourceSnapshotPath, "utf8");
  assert.match(source, /max-h-\[460px\] space-y-3 overflow-y-auto pr-1/);
  assert.match(source, /rounded-2xl border border-white\/40 bg-white\/30 p-4 md:p-5 backdrop-blur-md text-left shadow-sm transition-all hover:scale-\[1\.01\]/);
  assert.match(source, /flex items-start justify-between/);
  assert.match(source, /font-semibold text-\[15px\] md:text-\[17px\]/);
  assert.match(source, /text-xs text-\[rgb\(147,56,69\)\]\/70/);
  assert.match(source, /mt-2 text-sm md:text-base leading-relaxed text-\[rgb\(147,56,69\)\]/);
  assert.match(source, /title="AI yordamida tilak yaratish"/);
  assert.match(bridge, /list\.className = "mt-8 w-full max-w-\[432px\] md:max-w-\[600px\] max-h-\[460px\] space-y-3 overflow-y-auto pr-1"/);
  assert.match(bridge, /wish\.submittedAt \|\| wish\.createdAt/);
  assert.match(bridge, /header\.append\(name, date\)/);
  assert.match(bridge, /card\.append\(header, message\)/);
  assert.match(bridge, /duration: 400, delay: index \* 50, amount: 0\.2, toOpacity: 1, toTransform: "translateY\(0px\)"/);
  assert.match(bridge, /magicButton\.onclick = \(\) =>/);
  assert.match(bridge, /const magicButton = form\?\.querySelector\('button\[type="button"\]'\)/);
  assert.doesNotMatch(bridge, /magicButton\.hidden = true/);
  assert.doesNotMatch(bridge, /DEFAULT_PREVIEW_WISHES/);
});

test("Glass Pink retains its source gift-box section without adding dress code", () => {
  const source = readFileSync(sourceSnapshotPath, "utf8");
  assert.match(source, /aria-label="Open gift box"/);
  assert.match(source, /glass_garden_pink\.webp/);
  assert.match(source, /hover:scale-\[1\.03\]/);
  assert.match(source, /saraya_gold\.webp/);
  assert.match(source, /dragon_phoenix\.webp/);
  assert.doesNotMatch(source, /dress.?code|attire|kiyim.?uslubi/i);
  assert.doesNotMatch(html, /data-chorlove-dress|data-gp-dress/);
  assert.match(bridge, /hide\(section, !data\.toyona\?\.enabled\)/);
});

test("Glass Pink opener keeps the original timed exit instead of hiding on click", () => {
  const sourceModule = readFileSync(resolve(root, "Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0wvjbn--75n3p.js"), "utf8");
  const provenance = JSON.parse(readFileSync(provenancePath, "utf8"));
  const genericOpenHandler = bridge.slice(bridge.indexOf('root.querySelectorAll("[data-chorlove-open]")'));

  assert.equal(provenance.sourceMotion.sha256, createHash("sha256").update(sourceModule).digest("hex"));
  assert.equal(provenance.sourceMotion.opening.ambientPetals, 12);
  assert.match(sourceModule, /duration:\.6,delay:\.45\*!!r/);
  assert.match(sourceModule, /y:-35,scale:1\.08,opacity:0/);
  assert.match(sourceModule, /scale:\[1,1\.12,1\].{0,80}duration:2,repeat:1\/0/);
  assert.match(sourceModule, /x:\[-100,260\].{0,80}duration:3,repeat:1\/0/);
  assert.match(bridge, /duration: 600,[\s\S]{0,80}delay: 450,[\s\S]{0,80}easing: "ease-in-out"/);
  assert.match(bridge, /translateY\(-35px\) scale\(1\.08\)/);
  assert.match(bridge, /img\[src\*="flower4-decoration"\], img\[src\*="flower5-bottom"\]/);
  assert.match(bridge, /duration: 2000, iterations: Infinity, easing: "ease-in-out"/);
  assert.match(bridge, /duration: 3000, iterations: Infinity, easing: "ease-in-out"/);
  assert.match(bridge, /delay,easing="ease-out"/);
  assert.doesNotMatch(bridge, /easing="easeOut"/);
  assert.match(bridge, /window\.setTimeout\(\(\) => \{ envelope\.hidden=true; \}, 1050\)/);
  assert.match(genericOpenHandler, /if \(templateId === "glass-pink"\) return;/);
});

test("Glass Pink restores source carousel and floating To'yona ornament motion", () => {
  const sourceModule = readFileSync(resolve(root, "Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0wvjbn--75n3p.js"), "utf8");
  for (const source of [
    'aria-label":r("Previous")',
    'aria-label":r("Next")',
    'style:{perspective:"1000px"}',
    'm=55*r',
    'transform:`translateX(${m}%) translateZ(${x}px) rotateY(${p}deg) scale(${u})`',
    'src:"/images/glass-pink/saraya_gold.webp",animate:{y:[0,-6,0],rotate:[-22,-18,-22]}',
    'src:"/images/glass-pink/porcelain_blue.webp",animate:{y:[0,-6,0],rotate:[-10,-6,-10]}',
  ]) assert.ok(sourceModule.includes(source), `captured source must retain ${source}`);
  assert.match(bridge, /function galleryPosition\(index, activeIndex, total\)/);
  assert.match(bridge, /translateX\(\$\{x\}%\) translateZ\(\$\{-140 \* distance\}px\) rotateY\(\$\{35 \* offset\}deg\)/);
  assert.match(bridge, /function setGalleryIndex\(index, focusActive\)/);
  assert.match(bridge, /previous\.dataset\.ccGalleryPrev/);
  assert.match(bridge, /function updateGalleryLightbox\(dialog, opening = false\)/);
  assert.match(bridge, /"saraya_gold\.webp", -6, -22, -18, 3\.2, 0/);
  assert.match(bridge, /"porcelain_blue\.webp", -6, -10, -6, 3\.5, 700/);
  assert.doesNotMatch(adapter, /function display\(index\)/);
});

test("Glass Pink section reveals retain the source transforms, delays, durations, and viewport thresholds", () => {
  const sourceModule = readFileSync(resolve(root, "Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0wvjbn--75n3p.js"), "utf8");
  assert.match(sourceModule, /initial:\{opacity:0,y:20\},whileInView:\{opacity:1,y:0\},viewport:\{amount:\.3\}/);
  assert.match(sourceModule, /initial:\{opacity:0,scale:\.8\},whileInView:\{opacity:\.9,scale:1\},viewport:\{amount:\.3\},transition:\{duration:\.6,delay:\.15\}/);
  assert.match(sourceModule, /initial:\{opacity:0,x:-20\},whileInView:\{opacity:1,x:0\},viewport:\{amount:\.5\},transition:\{duration:\.5,delay:\.08\*r\}/);
  assert.match(sourceModule, /initial:\{scale:0\},whileInView:\{scale:1\},viewport:\{amount:\.5\},transition:\{duration:\.4,delay:\.08\*r\}/);
  assert.match(sourceModule, /initial:\{opacity:0,y:15\},whileInView:\{opacity:1,y:0\},viewport:\{amount:\.2\},transition:\{duration:\.4,delay:\.05\*a\}/);
  assert.match(sourceModule, /viewport:\{amount:\.2\},transition:\{duration:\.5,delay:\.1\*a\}/);
  assert.match(sourceModule, /transition:\{duration:\.7,delay:\.18\}/);
  assert.match(sourceModule, /transition:\{duration:\.7,delay:\.28\}/);
  assert.match(sourceModule, /transition:\{duration:\.7,delay:\.44\}/);
  assert.match(sourceModule, /transition:\{duration:\.7,delay:\.22\}/);
  assert.match(sourceModule, /transition:\{duration:\.7,delay:\.3\}/);
  assert.match(sourceModule, /transition:\{duration:\.7,delay:\.12\}/);
  assert.match(bridge, /const introTimings = \[\s*\[600, 0\], \[600, 100\], \[700, 180\]/);
  assert.match(bridge, /\[600, 0\], \[600, 100\], \[700, 180\], \[700, 280\], \[600, 360\], \[700, 440\]/);
  assert.match(bridge, /\[600, 0\], \[600, 100\], \[600, 160\], \[700, 220\], \[700, 300\]/);
  assert.match(bridge, /duration: 500, delay: index \* 80, amount: 0\.5/);
  assert.match(bridge, /duration: 400, delay: index \* 80, amount: 0\.5/);
  assert.match(bridge, /duration: 500, delay: index \* 100, amount: 0\.3/);
  assert.match(bridge, /duration: 400, delay: index \* 50, amount: 0\.2/);
  assert.match(bridge, /duration: 500, delay: index \* 100, amount: 0\.2/);
  assert.match(bridge, /rounded-3xl border border-white\/40 bg-white\/30 p-4 md:p-5 backdrop-blur-md/);
  assert.match(bridge, /text-xs md:text-sm text-\[rgb\(147,56,69\)\]\/75 italic/);
  assert.match(bridge, /rounded-2xl border border-white\/40 bg-white\/30 p-4 md:p-5 backdrop-blur-md/);
  assert.doesNotMatch(adapterCss, /760ms cubic-bezier|cc-source-reveal/);
});

test("Glass Pink has no missing packaged image requests", () => {
  const imagePaths = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"|url\(["']?([^"')]+)["']?\)/g)]
    .map((match) => match[1] ?? match[2])
    .filter((src) => src.startsWith("/templates/glass-pink/"));
  assert.ok(imagePaths.length > 0);
  for (const src of imagePaths) {
    assert.ok(
      readFileSync(resolve(root, "apps/web/public", src.slice(1))),
      `${src} must exist`,
    );
  }
});
