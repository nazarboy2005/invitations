import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { TEMPLATES } from "@taklifnoma/contracts";

const root = process.cwd();
const templateRoot = path.join(root, "apps/web/public/templates/taklifnomachi-1");
const html = readFileSync(path.join(templateRoot, "index.html"), "utf8");
const captured = readFileSync(path.join(templateRoot, "source/index.html"), "utf8");
const adapter = readFileSync(path.join(templateRoot, "adapter.js"), "utf8");

test("Taklifnomachi demo 1 is registered as an unpublished Marxaba source adapter", () => {
  const template = TEMPLATES.find((item) => item.id === "taklifnomachi-1");
  assert.ok(template);
  assert.equal(template.published, false);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
  assert.equal(template.previewImage, "/templates/taklifnomachi-1/preview.png");
  const registry = readFileSync(path.join(root, "apps/web/src/templates/marxaba/index.ts"), "utf8");
  assert.match(registry, /"taklifnomachi-1"/);
  assert.ok(existsSync(path.join(templateRoot, "preview.png")));
});

test("captured template resources are local and source demo data and tracking are removed", () => {
  assert.ok(existsSync(path.join(templateRoot, "source/templates/1/media/fountain.mp4")));
  assert.match(captured, /Jasurbek/);
  assert.ok(existsSync(path.join(templateRoot, "source/templates/1/media/NHJ3SCoEUFmX.mp3")));
  assert.ok(existsSync(path.join(templateRoot, "source/templates/1/fonts/great-vibes-RWmMoKWR9v4ksMfaWd_JN9XFiaQ.woff2")));
  assert.doesNotMatch(html, /Jasurbek|Dilnoza|12\.09\.2026|Magnat Plaza|Amir Temur 108|demo-1|cloudflareinsights|\/api\/rsvp|\/api\/wishes\//i);
  assert.equal(/https?:\/\/(?:fonts\.googleapis\.com|[^/]+\.tildacdn\.com|webgency\.tilda\.ws)/i.test(html), false);
  assert.match(html, /adapter\.js/);
  assert.match(adapter, /marxaba:update/);
  assert.match(html, /\/api\/public\/invitations/);
  assert.match(adapter, /data-taklifnomachi-gift/);
  assert.match(adapter, /!data.catalogPreview/);
  assert.match(adapter, /renderCountdown/);
});

test("additive registration migration keeps the template unpublished", () => {
  const migration = readFileSync(path.join(root, "packages/database/migrations/0096_register_taklifnomachi_1.sql"), "utf8");
  assert.match(migration, /taklifnomachi-1/);
  assert.match(migration, /false/i);
  assert.match(migration, /template_supported_event_types/);
  assert.match(migration, /ON CONFLICT DO NOTHING/);
});
