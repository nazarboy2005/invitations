import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { TEMPLATES } from "../packages/contracts/src/index";

const base = "apps/web/public/templates/palace-rose";
const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
const sha256 = (value: Buffer | string) =>
  createHash("sha256").update(value).digest("hex");

test("Palace Rose is published and supports wedding events only", () => {
  const entry = TEMPLATES.find((template) => template.id === "palace-rose");
  assert.ok(entry);
  assert.equal(entry.published, true);
  assert.deepEqual(entry.categoryIds, ["wedding"]);
  assert.deepEqual(entry.supportedEventTypes, ["wedding"]);
  assert.equal(entry.priceMinor, 15_000_000);
  assert.equal(entry.previewImage, "/templates/palace-rose/preview.webp");
  assert.ok(existsSync(join(base, "preview.webp")));
  assert.match(read("packages/database/migrations/0119_register_palace_rose.sql"), /published\)\s*\nVALUES \('palace-rose',[^\n]+false\)/);
});

test("Palace Rose preview media matches its archived photos and stays preview-only", () => {
  const sample = JSON.parse(read("apps/web/src/modules/catalog/preview-sample.json"));
  const gallery = sample.templateSamples["palace-rose"].gallery;
  const files = [
    "gallery-2.webp",
    "gallery-1.webp",
    "gallery-3.webp",
    "gallery-6.webp",
    "gallery-4.webp",
    "gallery-5.webp",
  ];
  assert.deepEqual(gallery.map((item: { url: string }) => item.url), files.map(
    (file) => `/templates/chorlove/orchid-amplop/assets/${file}`,
  ));
  assert.equal(
    sample.templateSamples["palace-rose"].venuePhoto,
    "/images/preview/venue.jpg",
  );
  const archiveRoot = "Invitations - this folder will be removed from production/Chorlove/Web invitations";
  for (const file of files) {
    const sourcePath = `${archiveRoot}/images/templates/orchid-amplop/${file}`;
    const packagePath = `apps/web/public/templates/chorlove/orchid-amplop/assets/${file}`;
    assert.equal(sha256(readFileSync(sourcePath)), sha256(readFileSync(packagePath)), file);
  }
  const renderer = read("apps/web/src/templates/chorlove/renderer.tsx");
  assert.match(renderer, /templateId === "palace-rose"[\s\S]*?preview && sampleWishes[\s\S]*?mapped\.venueImage = publicAsset\(venuePhoto\)/);
  const bridge = read(`${base}/bridge.js`);
  assert.match(bridge, /const photoUrl = typeof data\(\)\.venueImage === "string" \? data\(\)\.venueImage\.trim\(\) : ""/);
  assert.match(bridge, /photoFrame\.replaceChildren\(\);\s*hide\(photoFrame,true\)/);
  assert.match(bridge, /q\("\.flex\.touch-pan-y", section\) \|\| q\("\.grid", section\)/);
  assert.match(bridge, /const counter = all\("div", section\)\.find\(\(n\) =>[^\n]+!n\.querySelector\("div"\)/);
  assert.match(bridge, /paint\(\); hide\(section, !items\.length\)/);
});

test("isolated page packages the captured Palace Rose DOM and only its source art", () => {
  const provenance = JSON.parse(read(`${base}/source/provenance.json`));
  assert.equal(provenance.capture.path, "Web invitations/templates/palace-rose/preview-frame.html");
  assert.equal(
    provenance.capture.sha256,
    "a0adfef8355a20c0b3a2e4eddb9b5b04ea46525ae993dd6a3ced8ab157fd513f",
  );

  const html = read(`${base}/index.html`);
  const design = read(`${base}/source/design.html`);
  const bridge = read(`${base}/bridge.js`);
  assert.equal((design.match(/<section\b/g) || []).length, 10);
  assert.match(html, /id="palace-rose-root"/);
  assert.match(html, /src="\/templates\/palace-rose\/bridge\.js"/);
  assert.doesNotMatch(html, /<script[^>]+_next|googletagmanager|telegram\.org|images\.unsplash\.com/i);
  assert.doesNotMatch(html, /images\/templates\/(?:orchid-amplop)|chorlove\.uz|chorlove_uz|Muhammad|Xadicha|Abdurahmonov|10\/1[5-8]\/2026/i);
  assert.doesNotMatch(html, /(?:Nikoh marosimi|Bazm va furkset|Mehmonlarni kutib olish)/i);
  assert.doesNotMatch(design, /(?:To'yingiz muborak|Muhammad|Xadicha|Abdurahmonovlar oilasi|Sebastian|Isabelle)/i);

  const assetUrls = [...html.matchAll(/\/templates\/palace-rose\/assets\/([\w.-]+)/g)].map((match) => match[1]);
  assert.ok(assetUrls.length > 0);
  for (const file of new Set(assetUrls)) assert.ok(existsSync(join(base, "assets", file)), file);
  const packagedAssets = readdirSync(join(base, "assets")).sort();
  const sourceRecovery = provenance.sourceAssetRecovery;
  assert.equal(sourceRecovery.assets.length, 8);
  assert.equal(sourceRecovery.sourceHost, "https://chorlove.uz");
  for (const asset of sourceRecovery.assets) {
    assert.equal(asset.status, 200, asset.name);
    assert.equal(asset.contentType, "image/webp", asset.name);
    assert.equal(asset.url, `https://chorlove.uz/images/palace-rose/${asset.name}`);
    assert.ok(packagedAssets.includes(asset.name), asset.name);
    const copy = readFileSync(join(base, "assets", asset.name));
    assert.equal(copy.length, asset.bytes, asset.name);
    assert.equal(sha256(copy), asset.sha256, asset.name);
  }
  assert.equal(packagedAssets.length, 31);
  for (const asset of provenance.assets) {
    const copy = readFileSync(join(base, "assets", asset.path));
    assert.equal(copy.length, asset.bytes, asset.path);
    assert.equal(sha256(copy), asset.sha256, asset.path);
  }
  assert.equal(provenance.archiveAudit.fonts.length, 6);
  assert.ok(provenance.archiveAudit.fonts.every((font: { matchesPackaged: boolean }) => font.matchesPackaged));
  assert.equal(provenance.archiveAudit.giftArtwork.filter((asset: { exactCopyFound: boolean }) => asset.exactCopyFound).length, 4);
  const glassPink = provenance.archiveAudit.giftArtwork.find((asset: { name: string }) => asset.name === "glass_garden_pink.webp");
  assert.ok(glassPink);
  assert.equal(glassPink.exactCopyFound, false);
  assert.ok(glassPink.sameNameArchiveFiles.some((file: { matchesExpected: boolean }) => !file.matchesExpected));
  assert.equal(provenance.archiveAudit.manifestArtworkSummary.archiveCount, 17);
  assert.equal(provenance.archiveAudit.manifestArtworkSummary.matchingCount, 17);
  assert.equal(provenance.archiveGap.exactHashFoundElsewhere.length, 4);
  assert.equal(provenance.archiveGap.exactHashAbsentFromArchive.length, 4);
  assert.equal(provenance.catalogPreview.contractPreviewImage, "/templates/palace-rose/preview.webp");
  assert.ok(provenance.checks.nonRsvpReleaseBlockers.length > 0);
});

test("Palace Rose bridge binds creator fields, service actions, locales, and reduced motion", () => {
  const bridge = read(`${base}/bridge.js`);
  for (const field of ["groom", "bride", "hosts", "message", "dateTime", "program", "venue", "gallery", "toyona", "contacts", "rsvp", "wishesEnabled"]) {
    assert.ok(bridge.includes(`data().${field}`), field);
  }
  assert.match(bridge, /\/api\/public\/invitations\/.*\/rsvp/);
  assert.match(bridge, /\/api\/public\/invitations\/.*\/wishes/);
  assert.match(bridge, /partySize:yes\?1:0/);
  assert.doesNotMatch(bridge, /Number of guests|Количество гостей|Mehmonlar soni|createElement\("select"\)/);
  assert.match(bridge, /:language/);
  assert.match(bridge, /prefers-reduced-motion/);
  assert.match(bridge, /Clipboard|clipboard/);
  for (const asset of ["hoa_kho_orange.webp", "royal_red.webp", "dragon_phoenix.webp", "dragon_phoenix_v2.webp", "mahal_gold.webp", "glass_garden_pink.webp", "chateau_green.webp", "double_dragon_green.webp"]) {
    assert.ok(bridge.includes(asset), asset);
  }
  assert.match(bridge, /data-pr-gift-dialog/);
  assert.match(bridge, /if \(i === 0\) showImage\(items, target\)/);
  assert.match(bridge, /else if \(items\.length > 1\) \{ galleryPosition=target; paint\(\); \}/);
  assert.match(bridge, /img\.src = item\.src \|\| item\.url/);
  const capturedSource = read("Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0dg.9_70mpb0j.js");
  assert.match(capturedSource, /onClick:\(\)=>\{i\?c\(a\):F\?\.scrollTo\(a\)\}/);
  assert.match(bridge, /aria-modal/);
  assert.match(bridge, /toyona\.note/);
  assert.match(bridge, /prefers-reduced-motion/);
  assert.match(bridge, /img\.src=`\/templates\/\$\{id\}\/assets\/\$\{filename\}`/);
});

test("Palace Rose limits shared extras to its native To'yona modal", () => {
  const renderer = read("apps/web/src/templates/chorlove/renderer.tsx");
  assert.match(renderer, /templateId === "orchid-amplop"/);
  const palacePolicy = renderer.match(/templateId === "palace-rose"\s*\?\s*\{([^}]+)\}/)?.[1];
  assert.ok(palacePolicy);
  assert.match(palacePolicy, /story:\s*false/);
  assert.match(palacePolicy, /dressCode:\s*false/);
  assert.match(palacePolicy, /extraPeople:\s*false/);
  assert.match(palacePolicy, /receiptHostSelector:\s*"\[data-pr-gift-receipt-host\]"/);
  assert.match(renderer, /templateId === "orchid-amplop"[\s\S]*?receiptHostSelector:\s*"\[data-orchid-receipt-host\]"/);

  const bridge = read(`${base}/bridge.js`);
  const sharedExtras = read("apps/web/public/templates/shared/editor-sections.js");
  assert.match(sharedExtras, /sectionPolicy\?\.story !== false/);
  assert.match(sharedExtras, /sectionPolicy\?\.dressCode !== false/);
  assert.match(sharedExtras, /sectionPolicy\?\.extraPeople !== false/);
  assert.match(sharedExtras, /current\?\.sectionPolicy\?\.receiptHostSelector/);
  assert.match(bridge, /giftReceiptHost\.dataset\.prGiftReceiptHost/);
  assert.match(bridge, /content\.append\(giftReceiptHost\)/);
  assert.match(bridge, /giftReceiptHost\.hidden=true;\s*document\.body\.append\(giftReceiptHost\)/);
  assert.match(read(`${base}/adapter.css`), /\[data-pr-gift-dialog-panel\].*\[data-platform-extra="receipt"\]/);
});

test("Palace Rose packages its captured styles and source motion timings locally", () => {
  const html = read(`${base}/index.html`);
  const design = read(`${base}/source/design.html`);
  const bridge = read(`${base}/bridge.js`);
  const adapterCss = read(`${base}/adapter.css`);
  assert.match(adapterCss, /html,body\{height:100%\}/);
  assert.match(adapterCss, /#palace-rose-root\{[^}]*height:100%;max-width:none[^}]*overflow-y:auto/);
  assert.match(adapterCss, /\[data-pr-gift-dialog-panel\] \.pr-gift-receipt-host:empty\{display:none\}/);
  assert.match(adapterCss, /\[data-pr-gift-dialog-panel\]\{max-height:calc\(100vh - 1rem\);display:flex;flex-direction:column\}/);
  assert.match(adapterCss, /\[data-pr-gift-dialog-panel\]>.p-6\{min-height:0;overflow-y:auto;overscroll-behavior:contain\}/);
  const stylesheets = [
    "0.u3j0~_2ygfx.css",
    "00sc_9lpb3zcn.css",
    "0ly1y_qxlqlf..css",
    "054~-i6~6lmrd.css",
  ];
  for (const file of stylesheets) {
    assert.ok(existsSync(join(base, "source", "css", file)), file);
    assert.ok(html.includes(`/templates/palace-rose/source/css/${file}`), file);
  }
  assert.doesNotMatch(html, /templates\/chorlove\/shared\/.*\.css/);

  const fontCss = read(`${base}/source/css/0.u3j0~_2ygfx.css`);
  for (const family of ["qellia", "cormorantGaramond", "theNautigal", "greatVibes", "fraunces", "jost", "marcellus"]) {
    assert.ok(fontCss.includes(`font-family:${family}`), family);
  }
  for (const cssFile of stylesheets) {
    const css = read(`${base}/source/css/${cssFile}`);
    for (const [, asset] of css.matchAll(/\/templates\/palace-rose\/source\/media\/([^\")]+)/g)) {
      if (/\.(?:woff2?|ttf|otf)$/i.test(asset)) {
        assert.ok(existsSync(join(base, "source", "media", asset)), `${cssFile}: ${asset}`);
      }
    }
  }

  assert.match(bridge, /installOpeningPetals/);
  assert.match(bridge, /1\.2\*duration/);
  assert.match(bridge, /lerp\(1,\.76,heroProgress\)/);
  assert.match(bridge, /lerp\(1,1\.38,heroProgress\)/);
  assert.match(bridge, /lerp\(1,1\.28,heroProgress\)/);
  assert.match(bridge, /lerp\(-85,105,detailProgress\)/);
  assert.match(bridge, /lerp\(-20,40,programProgress\)/);
  assert.match(bridge, /const thresholds=\[\.2,\.25,\.3,\.5\]/);
  assert.match(bridge, /threshold=\.5/);
  assert.match(bridge, /pr-petal-exit/);
  assert.match(bridge, /event\.key==="Escape"\)closeDialog/);
  assert.match(bridge, /event\.target===overlay\)closeDialog/);
  assert.match(bridge, /event\.stopPropagation\(\)/);
  assert.match(bridge, /navigator\.clipboard\.writeText\(toyona\.cardNumber\)/);
  assert.match(bridge, /toyona\.note\?\.trim\(\)/);
  assert.match(bridge, /set\(p\[3\], data\(\)\.dateTime \? text\(\)\.time/);
  assert.match(bridge, /set\(p\[4\], data\(\)\.dateTime \? eventDate/);
  assert.match(bridge, /\[data\(\)\.date\?\.weekday\?\.toLocaleUpperCase\(dateFormatterLocale\(\)\),\[data\(\)\.date\?\.day,data\(\)\.date\?\.month,data\(\)\.date\?\.year\]\.filter\(Boolean\)\.join\(" "\),data\(\)\.date\?\.time\]\.filter\(Boolean\)\.join\(" • "\)/);
  assert.match(bridge, /set\(p\[6\], data\(\)\.hosts \? hostLabel/);
  assert.match(bridge, /const items = source/);
  assert.match(bridge, /paint\(\); hide\(section, !items\.length\)/);
  assert.equal((design.match(/transform:scale\(0\)/g) || []).length, 5);
  assert.match(bridge, /style\*="opacity: 0;"/);
  assert.match(bridge, /style\*="opacity:0;"/);
  assert.match(bridge, /style\*="scale\(0\);"/);
  assert.match(bridge, /\[\.6,\.1\],\[\.7,\.18\],\[\.5,\.26\],\[\.7,\.32\]/);
  assert.match(bridge, /\[\.7,\.18\],\[\.7,\.28\],\[\.6,\.36\],\[\.7,\.44\]/);
  assert.match(bridge, /pr-scale-reveal/);
  assert.match(adapterCss, /pr-scale-reveal:not\(\.pr-visible\)\{opacity:1!important\}/);
  assert.match(bridge, /else if\(!once\)node\.classList\.remove\("pr-visible"\)/);
  assert.match(bridge, /node\.dataset\.prRevealOnce="true"/);
  assert.match(bridge, /openingBodyScrollLocked/);
  assert.match(bridge, /heroFence=byAsset\(hero,"fence\.webp"\)\[0\]/);
  assert.match(bridge, /heroFence\.style\.scale=String\(lerp\(1,1\.38,heroProgress\)\)/);
  assert.match(bridge, /footerMotionWrap=footerCastle\?\.parentElement/);
  assert.match(bridge, /footerMotionWrap\.getBoundingClientRect\(\)/);
  assert.match(bridge, /scrollTop\+scrollHost\.clientHeight>=scrollHost\.scrollHeight-30/);
  assert.match(adapterCss, /pr-petal-exit\{animation:pr-petal-exit \.85s ease-out both/);
  assert.match(adapterCss, /pr-bells-sway 4\.2s/);
  assert.match(adapterCss, /pr-envelope-flower-a 5\.5s/);
  assert.match(adapterCss, /pr-petal-spin/);
});
