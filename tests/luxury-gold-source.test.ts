import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";

const root = resolve("apps/web/public/templates/luxury-gold");
const html = readFileSync(join(root, "index.html"), "utf8");
const bridge = readFileSync(join(root, "bridge.js"), "utf8");
const manifest = JSON.parse(readFileSync(join(root, "source-assets.provenance.json"), "utf8"));

test("Luxury Gold preserves captured layout, source styles and original assets with provenance", () => {
  const source = readFileSync(join(root, "source/preview-frame.html"), "utf8");
  const capturedSource = readFileSync(resolve("Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/luxury-gold/preview-frame.html"));
  assert.equal(capturedSource.length, manifest.sourceSnapshot.bytes);
  assert.equal(createHash("sha256").update(capturedSource).digest("hex"), manifest.sourceSnapshot.sha256);
  assert.equal(source.replace(/\r\n/g, "\n"), capturedSource.toString("utf8").replace(/\r\n/g, "\n"));
  assert.equal((html.match(/<section\b/g) || []).length, 14);
  for (const asset of manifest.assets) {
    const bytes = readFileSync(join(root, asset.file));
    assert.equal(bytes.length, asset.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256);
  }
  assert.equal(manifest.assets.length, 4);
  assert.equal(manifest.excludedCapturedGallery.length, 6);
  assert.equal(manifest.sourcePageModule.sha256, "0693fc8a88c7a71faa8ff3205ffd3e436b6dfcf410602bbb2f2a72517fe65ecc");
});

test("Luxury Gold restores the source opening, section motion, loops and reduced-motion behavior", () => {
  assert.ok(bridge.includes("duration: 750"));
  assert.ok(bridge.includes("delay: 2450"));
  assert.ok(bridge.includes("threshold: [0.35]"));
  assert.ok(bridge.includes("duration: 10000"));
  assert.ok(bridge.includes("duration: 2800"));
  assert.ok(bridge.includes("duration: 3600"));
  assert.ok(bridge.includes("function paintSparkleCanvas"));
  assert.ok(bridge.includes("function makeSparkle"));
  assert.ok(bridge.includes("prefers-reduced-motion"));
  assert.ok(manifest.sourceMotion.adaptation.includes("Web Animations API"));
});

test("Luxury Gold excludes unrelated gallery/sample data and connects the shared contract", () => {
  assert.ok(html.includes('data-chorlove-template="luxury-gold" hidden'));
  assert.ok(!html.includes("_next/image") && !/_next\/static\/chunks\/[\w~.-]+\.js/.test(html));
  for (const excluded of ["orchid-amplop", "gallery-1.webp", "gallery-2.webp", "gallery-3.webp", "gallery-4.webp", "gallery-5.webp", "gallery-6.webp", "ChorLove.uz", "Patrick Watson"]) assert.ok(!html.includes(excluded));
  for (const field of ["groom", "bride", "dateTime", "venue", "toyona", "gallery", "dressCode", "wishes", "contacts", "rsvp", "enabledLocales", "reducedMotion", "music"]) {
    assert.ok(bridge.includes(field), `missing ${field}`);
  }
  assert.ok(bridge.includes("api/public/invitations"));
  const contract = readFileSync("packages/contracts/src/index.ts", "utf8");
  const migration = readFileSync("packages/database/migrations/0117_register_luxury_gold.sql", "utf8");
  assert.ok(contract.includes('id: "luxury-gold"'));
  assert.ok(migration.includes("VALUES ('luxury-gold', 'Luxury Gold', 15000000, 'UZS', false)"));
});
