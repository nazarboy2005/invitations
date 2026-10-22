import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { TEMPLATES } from "@taklifnoma/contracts";

const root = resolve(process.cwd());
const htmlPath = resolve(root, "apps/web/public/templates/glass-pink/index.html");
const html = readFileSync(htmlPath, "utf8");
const bridge = readFileSync(resolve(root, "apps/web/public/templates/glass-pink/bridge.js"), "utf8");
const adapter = readFileSync(resolve(root, "apps/web/public/templates/glass-pink/source-adapter.js"), "utf8");
const previewPath = resolve(root, "apps/web/public/templates/glass-pink/preview-browser-capture.jpg");
const provenancePath = resolve(root, "apps/web/public/templates/glass-pink/source/provenance.json");

test("Glass Pink is published with its additive release migration", () => {
  const entry = TEMPLATES.find((template) => template.id === "glass-pink");
  assert.ok(entry);
  assert.equal(entry.published, true);
  assert.equal(entry.previewImage, "/templates/glass-pink/preview-browser-capture.jpg");
  assert.deepEqual(entry.categoryIds, ["wedding"]);
  assert.deepEqual(entry.supportedEventTypes, ["wedding"]);
  const publication = readFileSync(resolve(root, "packages/database/migrations/0091_publish_glass_pink.sql"), "utf8");
  assert.match(publication, /SET published = true[\s\S]*WHERE id = 'glass-pink'/);
});

test("Glass Pink preview artwork matches its in-app browser capture provenance", () => {
  const preview = readFileSync(previewPath);
  const provenance = JSON.parse(readFileSync(provenancePath, "utf8"));
  assert.equal(provenance.previewBrowserCapture.file, "../preview-browser-capture.jpg");
  assert.equal(
    provenance.previewBrowserCapture.source,
    "ChatGPT in-app browser rendering of the app preview with the canonical wedding preview fixture",
  );
  assert.equal(provenance.previewBrowserCapture.sha256, createHash("sha256").update(preview).digest("hex"));
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
