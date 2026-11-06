import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const base = new URL("apps/web/public/templates/wedivo-taman-rahasia/", root);
const hash = (data: Buffer) => createHash("sha256").update(data).digest("hex");

test("Taman Rahasia preserves the capture and verifies all exact localized dependencies", async () => {
  const audit = JSON.parse(await readFile(new URL("dependencies.json", base), "utf8"));
  assert.equal(hash(await readFile(new URL(audit.capture, root))), audit.captureSha256);
  assert.equal(audit.captureType, "embedded-source");
  assert.equal(audit.assets.filter((asset: {file: string}) => asset.file.includes("art-")).length, 8);
  for (const asset of audit.assets) assert.equal(hash(await readFile(new URL(asset.file, base))), asset.sha256);
  const fonts = await readFile(new URL("assets/fonts.css", base), "utf8");
  for (const family of ["Cinzel", "EB Garamond", "IM Fell English", "Pinyon Script"]) assert.ok(fonts.includes(`font-family: '${family}'`));
  assert.doesNotMatch(fonts, /https?:/);
  const css = await readFile(new URL("source/template.css", base), "utf8");
  assert.doesNotMatch(css, /https?:|@import|fonts\.google/);
  assert.match(css, /:root\s*\{\s*--moss-950/);
});

test("Taman Rahasia ships the full source garden with no provider runtime or example media", async () => {
  const html = await readFile(new URL("index.html", base), "utf8");
  const engine = await readFile(new URL("source/template.js", base), "utf8");
  for (const id of ["gate-stage", "gate-door-l", "gate-door-r", "packet-bride", "story-track", "flower-bed", "clock-hand", "gallery-grid", "secret-stone", "wish-tree"]) assert.ok(html.includes(`id="${id}"`));
  assert.doesNotMatch(html + engine, /wedivo-parameters|__WEDIVO_PREVIEW_STUB__|sample-rundown-|prewedding\/|templateBridePhoto|uploads\/music|AIza|Aulia|Bagas|Sekar|Bayu/);
  assert.doesNotMatch(html, /id="rsvp-pax"|name="pax"/);
  for (const motion of ["ORN.grow()", "function drawVine", "function openGate", "function showViewer", "function liftStone", "function setRundownActive"]) assert.ok(engine.includes(motion));
  assert.match(engine, /var storyCards = all\("\.story-card"\)/);
  assert.match(engine, /window.TAMAN.data.gallery/);
  assert.match(engine, /window.TAMAN.data.dateTime/);
});

test("Taman Rahasia uses real RSVP/wish APIs, moderation feedback and source-present optional sections", async () => {
  const bridge = await readFile(new URL("adapter.js", base), "utf8");
  assert.match(bridge, /partySize:status === 'yes' \? 1 : 0/);
  assert.match(bridge, /if \(!response.ok\) throw new Error\(\)/);
  assert.match(bridge, /if \(!current \|\| current.preview\)/);
  assert.match(bridge, /section\('gifts', false\)/);
  assert.match(bridge, /section\('live', false\)/);
  assert.match(bridge, /section\('flowers', false\)/);
  assert.doesNotMatch(bridge, /\b(?:alert|prompt|confirm)\s*\(/);
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"]) assert.ok(bridge.includes(locale));
  assert.match(bridge, /event.source === parent && event.origin === location.origin/);
  const css = await readFile(new URL("adapter.css", base), "utf8");
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("Sirli Bog‘ has a canonical portrait opening cover and Uzbek default copy", async () => {
  const proposal = JSON.parse(await readFile(new URL("apps/web/src/templates/wedivo-taman-rahasia/catalog-proposal.json", root), "utf8"));
  assert.equal(proposal.name, "Sirli Bog‘");
  assert.equal(proposal.published, false);
  assert.deepEqual(proposal.supportedEventTypes, ["wedding"]);
  const provenance = JSON.parse(await readFile(new URL("preview.provenance.json", base), "utf8"));
  const png = await readFile(new URL("preview.png", base));
  assert.equal(png.readUInt32BE(16), 450);
  assert.equal(png.readUInt32BE(20), 800);
  assert.equal(hash(png), provenance.rawPngSha256);
  assert.equal(hash(await readFile(new URL("preview.webp", base))), provenance.previewWebpSha256);
  assert.equal(hash(await readFile(new URL("adapter.js", base))), provenance.bridgeSha256);
  assert.equal(hash(await readFile(new URL("index.html", base))), provenance.sourceIndexSha256);
  const copy: Array<{id: string; text: string}> = JSON.parse(await readFile(new URL("apps/web/src/templates/wedivo-taman-rahasia/evidence/uz-default-text.json", root), "utf8"));
  assert.equal(copy.find((item) => item.id === "key-tag-text")?.text, "Oching");
  assert.equal(copy.find((item) => item.id === "rsvp-name-label")?.text, "Ismingiz");
  assert.ok(copy.some((item) => item.id === "path-count" && item.text === "bob topildi"));
  assert.doesNotMatch(copy.map((item) => item.text).join("\n"), /\b(Buka|ditemukan|Pukul|Mempelai|Kehadiran|Varietas)\b/);
});
