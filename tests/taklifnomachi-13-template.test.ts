import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { TEMPLATES } from "@taklifnoma/contracts";

const root = process.cwd();
const dir = path.join(root, "apps/web/public/templates/taklifnomachi-13");
const html = readFileSync(path.join(dir, "index.html"), "utf8");
const adapter = readFileSync(path.join(dir, "adapter.js"), "utf8");
const app = readFileSync(path.join(dir, "app.js"), "utf8");
const source = readFileSync(path.join(dir, "source/taklifnomachi.uz/demo/13/index.html"));

test("demo 13 is unpublished and registered as a Marxaba template", () => {
  const template = TEMPLATES.find(entry => entry.id === "taklifnomachi-13");
  assert.ok(template);
  assert.equal(template.published, false);
  assert.equal(template.previewImage, "/templates/taklifnomachi-13/source/taklifnomachi.uz/templates/13/assets/p2/intro-golden.png");
  assert.ok(readFileSync(path.join(root, "apps/web/src/templates/marxaba/registry.ts"), "utf8").includes('"taklifnomachi-13"'));
  const migration = readFileSync(path.join(root, "packages/database/migrations/0101_register_taklifnomachi_13.sql"), "utf8");
  assert.ok(migration.includes("taklifnomachi-13"));
  assert.ok(migration.includes("false"));
});

test("the capture is intact and production uses captured local resources", () => {
  assert.deepEqual(source, readFileSync(path.join(root, "Invitations - this folder will be removed from production/Taklifnomachi/Web invitations/taklifnomachi.uz/demo/13/index.html")));
  assert.equal(createHash("sha256").update(source).digest("hex"), "e6da74a63bca83632b3cf709d216874544ba9c8fcc68475fc1b68a9e61dbaa32");
  for (const file of [
    "source/taklifnomachi.uz/templates/13/assets/p2/0522.mp4",
    "source/taklifnomachi.uz/templates/13/assets/p2/intro-golden.png",
    "source/taklifnomachi.uz/templates/13/assets/p2/venue2.png",
    "source/taklifnomachi.uz/templates/13/audio/music.mp3",
    "source/taklifnomachi.uz/templates/13/css/page2.css",
    "source/taklifnomachi.uz/templates/13/js/page2.js",
    "source/fonts.gstatic.com/s/greatvibes/v21/RWmMoKWR9v4ksMfaWd_JN9XFiaQ.woff2",
    "source/fonts.gstatic.com/s/jost/v20/92zatBhPNqw73oTd4g.woff2",
  ]) assert.ok(existsSync(path.join(dir, file)), file);
  assert.ok(html.includes("source/taklifnomachi.uz/templates/13/assets/p2/0522.mp4"));
  assert.ok(html.includes("adapter.css"));
  assert.ok(html.includes("adapter.js"));
  for (const sample of ["Javohir", "Mubina", "26.09.2026", "Royal Palace", "demo-13", "cloudflare", "localStorage", "/api/rsvp", "fonts.googleapis.com"]) {
    assert.equal((html + adapter + app).includes(sample), false, sample);
  }
  assert.equal(readFileSync(path.join(dir, "fonts.css"), "utf8").includes("https://"), false);
});

test("the adapter maps app invitation data and public RSVP and wishes APIs", () => {
  for (const field of ["groom", "bride", "greeting", "message", "dateTime", "venue", "program", "gallery", "contacts", "music", "catalogPreview", "toyona"]) {
    assert.ok(adapter.includes("data." + field), field);
  }
  for (const path of ["apiBase", "/rsvp", "/wishes", "guestToken", "marxaba:update", "!data.catalogPreview"]) {
    assert.ok(adapter.includes(path), path);
  }
  assert.ok(app.includes("RSVP and wishes are submitted by the app adapter"));
});
