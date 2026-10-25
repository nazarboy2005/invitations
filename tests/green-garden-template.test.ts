import { readFile } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample.ts";

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
  const contracts = await readFile(new URL("../packages/contracts/src/index.ts", import.meta.url), "utf8");
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
  assert.match(contracts, /id: "green-garden",\s+name: "Green Garden",\s+description:[^\n]+\s+previewImage: "\/templates\/green-garden\/catalog-cover-opening\.png"/);
});

test("Green Garden gallery photos stay ephemeral and authored photos replace placeholders", async () => {
  const invitation = createTemplatePreviewSample("green-garden");
  assert.equal(invitation.gallery.length, 6);
  assert.equal(invitation.gallery.some((item) => item.url), false);

  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const html = await readFile(new URL("index.html", root), "utf8");
  assert.match(bridge, /showEmpty=payload\.preview&&Boolean\(item\)/);
  assert.match(bridge, /if\(item\?\.src\).*?img\.src=item\.src/s);
  assert.match(bridge, /hide\(gallerySection,!payload\.preview&&!gallery\.some\(item=>item\?\.src\)\)/);
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
  assert.match(bridge, /\},\{threshold:\.5\}\)/);
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
  assert.equal(manifest.sourceReferencedMissingAsset.packageResolution.referenceCount, 5);
  assert.equal(manifest.sourceReferencedMissingAsset.packageResolution.resolvedPublicPathExists, false);
  assert.equal(manifest.sourceReferencedMissingAsset.packageResolution.templateAssetExists, false);
  assert.equal(
    manifest.sourceArchiveAudit.remoteOnlyAssets.find((asset: { file: string }) => asset.file === "assets/dish.webp")?.sha256,
    "f230b71e33f045610bf268e5c6aee5f65caedd2823d0dd0597fa67e7a491a4e3",
  );
});

test("Green Garden packaged assets match the recorded source hashes", async () => {
  const manifest = JSON.parse(await readFile(new URL("source-assets.provenance.json", root), "utf8"));
  const sourceAssets = manifest.assets.filter((asset: { file: string }) => asset.file.startsWith("assets/"));
  assert.equal(sourceAssets.length, manifest.sourceArchiveAudit.matchedFiles + 6);
  for (const asset of sourceAssets) {
    const packaged = await readFile(new URL(asset.file, root));
    assert.equal(packaged.length, asset.bytes, `${asset.file} byte length differs from source provenance`);
    assert.equal(createHash("sha256").update(packaged).digest("hex"), asset.sha256, `${asset.file} differs from recorded source hash`);
  }
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
  for (const unsupported of ["dressCode", "dress-code", "attire", "dress code"]) {
    assert.equal(source.toLowerCase().includes(unsupported.toLowerCase()), false, `reference unexpectedly contains ${unsupported}`);
    assert.equal(html.toLowerCase().includes(unsupported.toLowerCase()), false, `package unexpectedly contains ${unsupported}`);
    assert.equal(bridge.toLowerCase().includes(unsupported.toLowerCase()), false, `adapter unexpectedly contains ${unsupported}`);
  }
});
