import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";

const root = resolve("apps/web/public/templates/wedivo-pulau-sehati");
const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const digest = (bytes: Buffer | string) =>
  createHash("sha256").update(bytes).digest("hex");
const provenance = JSON.parse(read("source/provenance.json"));

test("built-in copy initializes in all locales and defaults to natural Uzbek", () => {
  const context = {
    window: {} as {
      PulauCopy?: {
        entries: Record<string, Record<string, string>>;
        translate(value: string, locale: string): string;
      };
    },
  };
  runInNewContext(read("ui-copy.js"), context);
  const copy = context.window.PulauCopy!;
  for (const [key, row] of Object.entries(copy.entries)) {
    for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"])
      assert.ok(row[locale]?.trim(), `${key}: ${locale}`);
  }
  assert.equal(
    copy.translate("Mulai Petualangan", "uz-Latn"),
    "Sayohatni boshlash",
  );
  assert.equal(copy.translate("Lokasi berikutnya", "uz-Latn"), "Keyingi joy");
  assert.equal(copy.translate("Tutup peta", "uz-Latn"), "Xaritani yopish");
  assert.match(read("index.html"), /lang="uz-Latn"/);
  assert.match(read("index.html"), /Ko‘ngillar oroli/);
});

test("Pulau Sehati keeps the capture untouched and every exact design dependency local", () => {
  const original = readFileSync(provenance.capture);
  assert.equal(digest(original), provenance.captureSha256);
  assert.equal(provenance.captureType, "embedded-source");
  assert.equal(provenance.catalogEligible, true);
  assert.equal(provenance.publicationReady, false);
  assert.equal(
    digest(readFileSync(resolve(root, "preview.png"))),
    provenance.previewSha256,
  );
  assert.equal(
    provenance.assets.filter(
      (a: { role: string }) => a.role === "template-texture",
    ).length,
    7,
  );
  assert.equal(
    provenance.assets.filter((a: { role: string }) => a.role === "font").length,
    18,
  );
  for (const asset of provenance.assets) {
    assert.equal(
      digest(readFileSync(resolve(root, asset.file))),
      asset.sha256,
      asset.file,
    );
  }
  assert.doesNotMatch(
    read("source/template.css") + read("assets/fonts.css"),
    /https?:\/\//,
  );
});

test("source CSS retains complete theme variables after localizing dependencies", () => {
  const original = readFileSync(provenance.capture, "utf8").replaceAll(
    "\r\n",
    "\n",
  );
  const capturedCss = [...original.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
    .map((match) => match[1])
    .join("\n");
  let packagedCss = read("source/template.css").replaceAll("\r\n", "\n");
  for (const asset of provenance.assets.filter(
    (item: { role: string }) => item.role === "template-texture",
  ))
    packagedCss = packagedCss.replaceAll("../" + asset.file, asset.sourceUrl);
  assert.equal(
    packagedCss.slice(packagedCss.indexOf(":root")).trimEnd(),
    capturedCss.slice(capturedCss.indexOf(":root")).trimEnd(),
  );
  assert.doesNotMatch(
    packagedCss.slice(0, packagedCss.indexOf(":root")),
    /family=|display=swap|wght@/,
  );
});

test("the original embedded texture, shader programs and procedural geometry are reused", () => {
  const original = readFileSync(provenance.capture, "utf8")
    .match(/<script id="main-script">([\s\S]*?)<\/script>/)![1]
    .replaceAll("\r\n", "\n");
  const packaged = read("source/template.js").replaceAll("\r\n", "\n");
  const between = (source: string, start: string, end: string) =>
    source.slice(source.indexOf(start), source.indexOf(end));
  for (const [start, end] of [
    ["  var DETAIL_TEX", "  /* ================= CORE"],
    ["  var VS_MAIN", "  function initRenderer"],
    ["  function hash2", "  /* ---------- location table"],
    ["  /* ---------- palette & materials", "  var G = {"],
  ]) {
    const expected = between(original, start, end);
    assert.ok(expected.length > 500, start);
    // No color, material, geometry, shader or texture replacement is allowed.
    assert.equal(between(packaged, start, end), expected, start);
  }
});

test("the app document has no captured invitation data, media, provider runtime or API key", () => {
  const document = read("index.html");
  assert.doesNotMatch(
    document,
    /Bagas|Aulia|Satria|Kemala|Sarah|Dimas|AIza|uploads\/|sample-rundown|wedivo-preview-stub|wedivo-parameters/,
  );
  assert.doesNotMatch(
    read("source/template.js"),
    /https:\/\/wedivo\.id|202[67]-\d\d-\d\d/,
  );
  assert.ok(
    document.indexOf('id="wedivo-rundown-data"') <
      document.indexOf('src="adapter.js"'),
  );
});

test("real typed adapter preserves authored values, stable item IDs, timezone and fixture isolation", () => {
  const result = spawnSync(
    process.execPath,
    [
      "-e",
      `
    process.env.TSX_TSCONFIG_PATH=require('path').resolve('apps/web/tsconfig.json');
    require('tsx/cjs');require.extensions['.css']=m=>m.exports={};
    const assert=require('node:assert/strict');
    const {makePulauSehatiPayload}=require('./apps/web/src/templates/wedivo-pulau-sehati/adapter.ts');
    const {createInvitation,addLanguage}=require('./packages/contracts/src/index.ts');
    const {createTemplatePreviewSample}=require('./apps/web/src/modules/catalog/preview-sample.ts');
    let blank=createInvitation();
    let payload=makePulauSehatiPayload(blank,'uz-Latn','',{invitationId:'private-test',preview:false}).payload;
    assert.equal(payload.data.groom,'');assert.equal(payload.data.bride,'');assert.equal(payload.date,'');assert.deepEqual(payload.data.gallery,[]);assert.deepEqual(payload.data.program,[]);
    for(const locale of ['uz-Latn','uz-Cyrl','en','ru']) {
      const invitation=createTemplatePreviewSample('anor');
      invitation.startsAt='2027-06-12T17:00';invitation.timezone='Asia/Tashkent';
      invitation.content[locale].people=['Authored A','Authored B'];
      invitation.content[locale].personalGreeting='Welcome, {name}';
      invitation.content[locale].programDescriptions={'sample-arrival':'Authored description'};
      const snapshot=JSON.stringify(invitation);
      const mapped=makePulauSehatiPayload(invitation,locale,'Personal guest',{invitationId:'public-test',guestToken:'opaque-test-token',preview:false,sampleWishes:true}).payload;
      assert.equal(mapped.data.groom,'Authored A');assert.equal(mapped.data.bride,'Authored B');
      assert.equal(mapped.data.greeting,'Welcome, Personal guest');assert.equal(mapped.time,'17:00');assert.equal(mapped.date,'2027-06-12');assert.equal(mapped.timezoneOffset,5);
      assert.deepEqual(mapped.data.program.map(x=>x.id),invitation.program.map(x=>x.id));
      assert.equal(mapped.data.program[0].description,'Authored description');
      assert.equal(mapped.data.wishes.length,0,'public data cannot include preview wishes');
      assert.equal(JSON.stringify(invitation),snapshot,'adapter must not mutate or persist fixtures');
    }
  `,
    ],
    { cwd: resolve("."), encoding: "utf8", timeout: 60_000 },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
