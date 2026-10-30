import { readFile } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample.ts";
import { templateById } from "../packages/contracts/src/index";

const root = new URL("../apps/web/public/templates/green-garden/", import.meta.url);

test("Green Garden keeps its original capture byte-for-byte", async () => {
  const source = await readFile(new URL("source/preview-frame.html", root));
  const manifest = JSON.parse(await readFile(new URL("source-assets.provenance.json", root), "utf8"));
  assert.equal(createHash("sha256").update(source).digest("hex"), manifest.preservedCapture.sha256);
  assert.equal(source.length, manifest.preservedCapture.bytes);
});

test("Green Garden preview capture matches its canonical fixture provenance", async () => {
  const image = await readFile(new URL("catalog-cover-opening.png", root));
  const provenance = JSON.parse(await readFile(new URL("preview.provenance.json", root), "utf8"));
  const sourceManifest = JSON.parse(await readFile(new URL("source-assets.provenance.json", root), "utf8"));
  assert.equal(createHash("sha256").update(image).digest("hex"), provenance.sha256);
  assert.equal(provenance.file, "catalog-cover-opening.png");
  assert.equal(provenance.fixture, "source snapshot sample invitation");
  assert.equal(provenance.fixtureSha256, null);
  assert.equal(provenance.sourceCaptureSha256, sourceManifest.preservedCapture.sha256);
  assert.equal(provenance.width, 432);
  assert.equal(provenance.height, 768);
  assert.deepEqual(provenance.crop, {
    x: 0,
    y: 0,
    width: 432,
    height: 768,
    operation: "none; full source opening viewport preserved",
  });
  assert.match(provenance.captureMethod, /archived Chorlove Green Garden server-rendered source opening/);
  assert.equal(templateById("green-garden")?.previewImage, "/templates/green-garden/catalog-cover-opening.png");
});

test("Green Garden gallery photos stay ephemeral and authored photos replace placeholders", async () => {
  const invitation = createTemplatePreviewSample("green-garden");
  assert.equal(invitation.gallery.length, 6);

  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const html = await readFile(new URL("index.html", root), "utf8");
  assert.match(bridge, /showEmpty=payload\.preview&&Boolean\(item\)/);
  assert.match(bridge, /if\(item\?\.src\).*?img\.src=item\.src/s);
  assert.match(bridge, /hide\(gallerySection,!gallery\.some\(item=>item\?\.src\)\)/);
  assert.doesNotMatch(bridge, /hide\(gallerySection,!payload\.preview/);
  assert.doesNotMatch(html, /orchid-amplop\/gallery-[1-6]\.webp/);
  assert.doesNotMatch(bridge, /orchid-amplop\/gallery-[1-6]\.webp/);
});

test("Green Garden app page excludes reference sample content and runtime", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  for (const sample of ["Muhammad", "Xadicha", "Abdurahmonovlar", "Azizbek", "orchid-amplop", "unsplash.com", "chorlove.uz"]) {
    assert.equal(html.toLowerCase().includes(sample.toLowerCase()), false, `unexpected source content: ${sample}`);
  }
  assert.match(html, /data-chorlove-template="green-garden"/);
  assert.match(html, /data-gg-rsvp-form/);
  assert.match(html, /data-gg-wish-form/);
  assert.match(html, /data-gg-program-item/);
  assert.match(html, /assets\/welcome\.webp/);
  assert.match(html, /assets\/cake\.webp/);
  assert.equal((html.match(/src="\/images\/green-garden\/leaf1-bloom\.webp"/g) || []).length, 5);
  assert.match(html, /top-\[calc\(-2%\+330px\)\].*src="\/images\/green-garden\/leaf1-bloom\.webp"/);
  assert.match(html, /top-\[1180px\].*src="\/images\/green-garden\/leaf1-bloom\.webp"/);
  assert.match(html, /top-\[3420px\].*src="\/images\/green-garden\/leaf1-bloom\.webp"/);
  assert.match(html, /data-gg-field="groom"/);
  assert.match(html, /data-gg-field="bride"/);
  assert.match(html, /bridge\.js/);
  assert.doesNotMatch(html, /<script[^>]+src="\/_next\//);
});

test("Green Garden bridge uses the shared contract and supported services", async () => {
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  for (const field of ["groom", "bride", "eventType", "program", "gallery", "venue", "contacts", "rsvp", "wishesEnabled", "toyona", "dateTime"]) {
    assert.match(bridge, new RegExp(`d\\.${field}`));
  }
  assert.match(bridge, /data\.music/);
  assert.match(bridge, /"wishes"/);
  assert.match(bridge, /"rsvp"/);
  assert.match(bridge, /prefers-reduced-motion/);
  assert.match(bridge, /:language/);
  assert.match(bridge, /venueTitle/);
  assert.match(bridge, /responseLabel/);
  assert.doesNotMatch(bridge, /name=["']partySize["']|party\.setAttribute\("aria-label",c\.party\)|party\?\.value/);
  assert.match(bridge, /partySize:choice==="no"\?0:1/);
  assert.match(bridge, /gg-source-wish-card rounded-xl border p-4 text-sm text-left shadow-sm transition-all/);
  assert.match(bridge, /wish\.submittedAt\?new Date\(wish\.submittedAt\)\.toLocaleDateString/);
  assert.match(bridge, /gg-source-gift-modal/);
  assert.match(bridge, /dialog\.showModal\(\)/);
  assert.match(bridge, /navigator\.clipboard\.writeText/);
  assert.match(bridge, /svgIcon\(\[\["rect",\{width:"20",height:"14",x:"2",y:"5",rx:"2"\}\]/);
  assert.match(bridge, /if\(d\.toyona\?\.cardHolder\)/);
  assert.match(bridge, /data-gg-countdown/);
  assert.match(bridge, /data-gg-lightbox/);
  assert.match(bridge, /d\.toyona\?\.cardNumber/);
  assert.match(bridge, /d\.toyona\?\.cardHolder/);
  assert.match(bridge, /calendar\.google\.com/);
  assert.match(bridge, /api\/public\/invitations/);
  assert.doesNotMatch(bridge, /AI yordamida/);
});

test("Green Garden local asset references resolve within its package", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const refs = [...html.matchAll(/(?:src|url\()=["']?(\/templates\/green-garden\/[^"')\s]+)/g)].map((match) => match[1]);
  const files = await readdir(new URL(".", root), { recursive: true });
  const publicPrefix = "/templates/green-garden/";
  for (const ref of refs) {
    const relative = ref.slice(publicPrefix.length).replaceAll("/", path.sep);
    assert.ok(files.includes(relative) || relative.startsWith(`assets${path.sep}`), `missing package reference ${ref}`);
  }
});

test("Green Garden restores available source motion and schedule assets", async () => {
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const html = await readFile(new URL("index.html", root), "utf8");
  const css = await readFile(new URL("adapter.css", root), "utf8");
  const manifest = JSON.parse(await readFile(new URL("source-assets.provenance.json", root), "utf8"));
  assert.ok(css.includes('[data-gg-root] img:not([class~="max-w-none"]){max-width:100%}'));
  assert.match(bridge, /easing="ease-out"/);
  assert.match(bridge, /reveal\(names\[0\].*?\.7,\.4\)/);
  assert.match(bridge, /reveal\(names\[1\].*?\.7,\.55\)/);
  assert.match(bridge, /reveal\(names\[2\].*?\.7,\.7\)/);
  assert.match(bridge, /duration:duration\*1000,delay:delay\*1000,iterations:Infinity,easing:"ease-in-out"/);
  for (const ornamentMotion of [
    '["jasmine_white",-6,-22,3.2,0]',
    '["spring_garden_green",-7,20,3.6,.3]',
    '["boho_floral_pink",-5,-18,2.9,.6]',
    '["brocade_flower_red",-6,14,3.4,.2]',
    '["baroque_gold",-5,8,3.1,.4]',
    '["minimalism_brown",-6,-10,3.5,.7]',
    '["spring_garden_blue",-5,-14,3.3,.1]',
  ]) assert.ok(bridge.includes(ornamentMotion), `source To'yona motion differs: ${ornamentMotion}`);
  assert.match(css, /backdrop-filter:blur\(12px\)/);
  assert.match(css, /border-radius:24px;background:#fbfdf8;backdrop-filter:blur\(24px\)/);
  assert.match(css, /border-radius:16px;background:rgba\(255,255,255,\.8\);box-shadow/);
  assert.match(bridge, /observeMotion\(time,.*?\.5,delay,\.5\)/s);
  assert.match(bridge, /\.6,index\*\.15,\.3\)/);
  assert.match(bridge, /\.4,index\*\.05,\.2\)/);
  assert.match(bridge, /gg-reduced-motion/);
  assert.match(bridge, /const baseTranslations = \[\.\.\.leaves\]\.slice\(0, 3\)/);
  assert.match(bridge, /const adjustedY = offset === 0 \? y : `calc\(\$\{y\} \$\{offset < 0 \? "-" : "\+"\} \$\{Math\.abs\(offset\)\}px\)`/);
  assert.match(bridge, /\[leaves\[0\],leaves\[1\],card,card\?\.children\?\.\[0\]/);
  assert.match(html, /data-gg-program-icon[^>]+assets\/welcome\.webp/);
  assert.match(html, /data-gg-program-icon[^>]+assets\/cake\.webp/);
  assert.deepEqual(
    manifest.assets
      .filter((asset: { file: string }) => ["assets/welcome.webp", "assets/cake.webp", "assets/dish.webp"].includes(asset.file))
      .map((asset: { file: string }) => asset.file)
      .sort(),
    ["assets/cake.webp", "assets/dish.webp", "assets/welcome.webp"],
  );
  for (const file of ["assets/welcome.webp", "assets/cake.webp", "assets/dish.webp"]) {
    const source = manifest.sourceArchiveAudit.remoteOnlyAssets.find((asset: { file: string }) => asset.file === file);
    const packaged = manifest.assets.find((asset: { file: string }) => asset.file === file);
    assert.deepEqual({ bytes: source?.bytes, sha256: source?.sha256 }, { bytes: packaged?.bytes, sha256: packaged?.sha256 });
  }
  assert.equal(manifest.sourceReferencedMissingAsset.file, "/images/green-garden/leaf1-bloom.webp");
  assert.equal(manifest.sourceReferencedMissingAsset.liveHttpStatus, 404);
  assert.deepEqual(manifest.sourceReferencedMissingAsset.canonicalSourceResponse, {
    url: "https://chorlove.uz/images/green-garden/leaf1-bloom.webp",
    method: "GET",
    status: 404,
    checkedAt: "2026-10-26",
    redirected: false,
    redirectCount: 0,
    contentType: "text/html; charset=utf-8",
    responseBytes: 39311,
  });
  assert.match(manifest.sourceReferencedMissingAsset.result, /All five captured source references still point to it/);
  assert.equal(manifest.sourceReferencedMissingAsset.packageResolution.unrelatedSameNameAsset.sha256, "435c4b9a37ad765fb6b40b0333ba49518155e9839254d910a20fa5830a49db57");
  assert.match(manifest.sourceReferencedMissingAsset.archiveResult, /184 unique transparent botanical raster candidates/);
  assert.deepEqual(manifest.sourceReferencedMissingAsset.alternateNameAudit.sourceRoots, [
    "D:/Projects/Invitations",
    "D:/Projects/Taklifnoma/Invitations - this folder will be removed from production",
  ]);
  assert.equal(manifest.sourceReferencedMissingAsset.alternateNameAudit.uniqueRasterCandidatesVisuallyReviewed, 184);
  assert.equal(manifest.sourceReferencedMissingAsset.alternateNameAudit.exactNameMatches, 1);
  assert.equal(manifest.sourceReferencedMissingAsset.alternateNameAudit.sourceIdenticalOrConfidentEquivalentFound, false);
  assert.match(manifest.sourceReferencedMissingAsset.alternateNameAudit.conclusion, /not a reliable replacement/);
  assert.deepEqual(manifest.sourceHydrationRecheck, {
    checkedAt: "2026-10-26",
    url: "http://localhost:3003/templates/green-garden/preview-frame.html",
    httpStatus: 200,
    captureSha256: "d7ba584a7aa9cee59f786191e8c4be0cf57796edbe285fcc35ba890a4be204a8",
    waitAfterDomContentLoadedMs: 2500,
    pageErrors: ["Minified React error #418"],
    serverRenderedInvitationTextStillPresent: true,
    conclusion: "Archived SSR markup is available, but client hydration fails. Do not claim live hydrated source interaction or screenshot parity.",
  });
  assert.equal(manifest.sourceReferencedMissingAsset.packageResolution.referenceCount, 5);
  assert.equal(manifest.sourceReferencedMissingAsset.packageResolution.resolvedPublicPathExists, false);
  assert.equal(manifest.sourceReferencedMissingAsset.packageResolution.templateAssetExists, false);
  assert.equal(
    manifest.sourceArchiveAudit.remoteOnlyAssets.find((asset: { file: string }) => asset.file === "assets/dish.webp")?.sha256,
    "f230b71e33f045610bf268e5c6aee5f65caedd2823d0dd0597fa67e7a491a4e3",
  );
  assert.equal(manifest.previewOnlySourceMedia.gallery.length, 6);
  assert.equal(manifest.previewOnlySourceMedia.venuePhoto.sourceUrl, "https://images.unsplash.com/photo-1712314947761-a8d718bd8c32?w=1400&h=1000&fit=crop&auto=format&q=80");
  assert.equal(manifest.previewOnlySourceMedia.venuePhoto.sha256, "ef71550b3110fe9d17b3c49c7deccb7ff93a34c9fe0e79d6079fe34e140b1a55");
  for (const media of manifest.previewOnlySourceMedia.gallery) {
    assert.deepEqual(
      { bytes: (await readFile(new URL(media.packageFile.replace("apps/web/public/templates/", "../"), root))).length,
        sha256: createHash("sha256").update(await readFile(new URL(media.packageFile.replace("apps/web/public/templates/", "../"), root))).digest("hex") },
      { bytes: media.bytes, sha256: media.sha256 },
      media.packageFile,
    );
  }
});

test("Green Garden packaged assets match the recorded source hashes", async () => {
  const manifest = JSON.parse(await readFile(new URL("source-assets.provenance.json", root), "utf8"));
  const sourceAssets = manifest.assets.filter((asset: { file: string }) => asset.file.startsWith("assets/"));
  assert.equal(sourceAssets.length, manifest.sourceArchiveAudit.matchedFiles + manifest.sourceFontAudit.files.length + manifest.sourceArchiveAudit.remoteOnlyAssets.length + 1);
  for (const asset of sourceAssets) {
    const packaged = await readFile(new URL(asset.file, root));
    assert.equal(packaged.length, asset.bytes, `${asset.file} byte length differs from source provenance`);
    assert.equal(createHash("sha256").update(packaged).digest("hex"), asset.sha256, `${asset.file} differs from recorded source hash`);
  }
});

test("Green Garden matches source gallery autoplay and repeatable viewport reveals", async () => {
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const html = await readFile(new URL("index.html", root), "utf8");
  assert.match(bridge, /window\.setInterval\(\(\)\s*=>\s*galleryAutoAdvance\(\),\s*3500\)/);
  assert.match(bridge, /galleryAutoEnabled=!galleryReduced/);
  assert.match(bridge, /gallery\.length>1&&!galleryReduced/);
  assert.match(bridge, /positionX=Math\.max\(-140,Math\.min\(140,60\*relative\)\)/);
  assert.match(bridge, /depth=-150\*Math\.abs\(relative\),rotation=45\*relative/);
  assert.match(bridge, /galleryAutoAdvance=\(\)=>rotate\(1\)/);
  assert.match(bridge, /lightbox\.addEventListener\("close",startGalleryTimer\)/);
  assert.match(bridge, /!entry\.isIntersecting&&visible/);
  assert.match(bridge, /resetReveal\(node,frames\)/);
  assert.match(bridge, /observeMotion\(time,/);
  assert.match(bridge, /observeMotion\(dot,/);
  assert.match(bridge, /observeMotion\(title,/);
  assert.doesNotMatch(bridge, /observer\.disconnect\(\)/);
  assert.match(html, /style="perspective:1000px"/);
  assert.equal((html.match(/data-gg-gallery-item=/g) || []).length, 6);
  assert.match(html, /duration-500 ease-out/);
});

test("Green Garden source runtime and fonts have recovered archive provenance", async () => {
  const manifest = JSON.parse(await readFile(new URL("source-assets.provenance.json", root), "utf8"));
  assert.deepEqual(manifest.sourceRuntimeModule, {
    file: "_next/static/chunks/0hs8-cen4~3dx.js",
    bytes: 69437,
    sha256: "2c9968ae8a5d482044e5595df02cb26da2181d1e307f6a3c444e137ae0789e76",
    verifiedAgainst: "Recovered Chorlove/Web invitations archive",
    reviewedBehavior: [
      "Green Garden opening and hero reveal/parallax",
      "Gallery 3.5-second autoplay, 500ms 3D carousel positioning, and lightbox pause/resume",
      "Repeatable viewport-triggered reveals and source thresholds",
      "To'yona floating ornaments and gift-details modal",
      "RSVP name/yes-no/submit fields",
      "guestbook card and date presentation",
    ],
  });
  assert.equal(manifest.sourceFontAudit.files.length, 3);
  for (const font of manifest.sourceFontAudit.files) {
    assert.ok(manifest.assets.some((asset: { file: string; bytes: number; sha256: string }) =>
      asset.file === font.file && asset.bytes === font.bytes && asset.sha256 === font.sha256));
  }
});

test("Green Garden does not add source-absent optional sections", async () => {
  const source = await readFile(new URL("source/preview-frame.html", root), "utf8");
  const html = await readFile(new URL("index.html", root), "utf8");
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  assert.equal((source.match(/\/images\/green-garden\/leaf1-bloom\.webp/g) || []).length, 5);
  assert.equal((html.match(/src="\/images\/green-garden\/leaf1-bloom\.webp"/g) || []).length, 5);
  for (const unsupported of ["dressCode", "dress-code", "attire", "dress code"]) {
    assert.equal(source.toLowerCase().includes(unsupported.toLowerCase()), false, `reference unexpectedly contains ${unsupported}`);
    assert.equal(html.toLowerCase().includes(unsupported.toLowerCase()), false, `package unexpectedly contains ${unsupported}`);
    assert.equal(bridge.toLowerCase().includes(unsupported.toLowerCase()), false, `adapter unexpectedly contains ${unsupported}`);
  }
});
