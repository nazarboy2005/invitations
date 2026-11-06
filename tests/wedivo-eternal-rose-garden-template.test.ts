import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../apps/web/public/templates/wedivo-eternal-rose-garden/", import.meta.url);
const read = async (name: string) => (await readFile(new URL(name, root), "utf8")).replace(/\r\n/g, "\n");
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
const captureUrl = new URL("../Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Wedivo/Web invitations/templates/2Vn0nk5HHqwO4V5FJ6Xg/index.html", import.meta.url);

test("Eternal Rose provenance identifies the untouched embedded capture", async () => {
  const provenance = JSON.parse(await read("source/provenance.json"));
  const capture = await readFile(captureUrl);
  assert.equal(createHash("sha256").update(capture).digest("hex"), provenance.captureSha256);
  assert.equal(provenance.captureType, "embedded-source");
  assert.equal(provenance.catalogEligible, false);
});

test("the exact captured CSS is retained with local artwork URLs", async () => {
  const capture = (await readFile(captureUrl, "utf8")).replace(/\r\n/g, "\n");
  const original = [...capture.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)][1][1];
  const local = original.replace(/@import url\("https:\/\/fonts.googleapis.com\/[^\"]+"\);/, "").replace(/https:\/\/wedivo\.id\/uploads\/templates\/[^\s"')]+\/([^/"')]+\.jpg)/g, "../assets/$1");
  assert.equal(hash(await read("source/template.css")), hash(local));
});

test("source bloom, cutout, cover, environment and scroll algorithms remain exact", async () => {
  const capture = (await readFile(captureUrl, "utf8")).replace(/\r\n/g, "\n");
  const source = /<script id="garden-script">([\s\S]*?)<\/script>/.exec(capture)![1];
  const packaged = await read("source/template.js");
  function body(text: string, name: string) {
    const start = text.indexOf(`function ${name}(`);
    assert.notEqual(start, -1, name);
    return text.slice(start, text.indexOf("\n        }", start) + 10);
  }
  for (const name of ["keyCanvas", "applyCut", "processCut", "buildBloom", "openBloom", "applyEnv", "drawFrame", "openCover", "updateVine", "updateRundownActive"]) {
    assert.equal(hash(body(packaged, name)), hash(body(source, name)), name);
  }
});

test("all 15 original art binaries and 24 font files match their audit hashes", async () => {
  const provenance = JSON.parse(await read("source/provenance.json"));
  assert.equal(provenance.assets.filter((asset: { path: string }) => asset.path.endsWith(".jpg")).length, 15);
  assert.equal(provenance.assets.filter((asset: { path: string }) => asset.path.endsWith(".ttf")).length, 24);
  for (const asset of provenance.assets) {
    const bytes = await readFile(new URL(asset.path, root));
    assert.equal(bytes.length, asset.bytes, asset.path);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256, asset.path);
  }
  assert.doesNotMatch(await read("assets/fonts.css"), /https?:/);
  assert.match(await read("source/template.js"), /var UP = "assets\/"/);
});

test("production source excludes provider services and invitation-specific examples", async () => {
  const files = await Promise.all([read("index.html"), read("source/template.js"), read("source/template.css")]);
  for (const file of files) {
    assert.equal(/wedivo-parameters|wedivo-preview-stub|sample-rundown|AIza[\w-]+|F3Qioc7zruXqPzTEOAiexTXP76r2|Aulia|Bagas|Anindya|Raditya|aninkirana|raditwiratama|2026-11-19|2027-05-01/.test(file), false);
    assert.equal(/https:\/\/wedivo\.id|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(file), false);
  }
});

test("guest forms use platform moderation and fixed-count RSVP with source-absent UI omitted", async () => {
  const adapter = await read("adapter.js");
  const source = await read("source/template.js");
  assert.match(adapter, /partySize: status === "yes" \? 1 : 0/);
  assert.match(adapter, /if \(envelope.preview\)/);
  assert.match(adapter, /response\.ok/);
  assert.match(adapter, /t\(isRsvp \? "sent" : "moderation"\)/);
  assert.match(adapter, /event\.source === parent && event\.origin === location\.origin/);
  assert.match(adapter, /"sec-gift"/);
  assert.match(adapter, /\$\("rsvp-pax"\)\?\.remove\(\)/);
  assert.match(source, /var pax = 1;/);
  assert.match(source, /window\.roseData\.dateTime/);
  assert.match(source, /window\.roseMusicWanted !== false/);
});
