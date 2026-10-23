import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { templateById } from "../packages/contracts/src/index";

const root = process.cwd();
const packageRoot = path.join(root, "apps/web/public/templates/velvet");

test("Invitate Velvet is registered as unpublished wedding-only design", () => {
  const template = templateById("velvet");
  assert.ok(template);
  assert.equal(template.name, "Velvet");
  assert.equal(template.published, false);
  assert.equal(template.previewEventType, "wedding");
  assert.deepEqual(template.categoryIds, ["wedding"]);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
  assert.equal(template.priceMinor, 15_000_000);
  assert.equal(template.previewImage, "/templates/velvet/preview.webp");
});

test("Velvet package has source opening art and isolated local renderer assets", () => {
  const html = readFileSync(path.join(packageRoot, "index.html"), "utf8");
  const bridge = readFileSync(path.join(packageRoot, "bridge.js"), "utf8");
  const sourceJs = readFileSync(
    path.join(packageRoot, "assets/js/velvet.js"),
    "utf8",
  );
  const cover = statSync(path.join(packageRoot, "preview.webp"));
  const provenance = JSON.parse(
    readFileSync(path.join(packageRoot, "preview.provenance.json"), "utf8"),
  );

  assert.ok(existsSync(path.join(packageRoot, "assets/previews/template/velvet/velvet.mp4")));
  assert.ok(existsSync(path.join(packageRoot, "assets/previews/template/velvet/pink.mp4")));
  assert.ok(existsSync(path.join(packageRoot, "assets/images/velvet/chris.mp3")));
  assert.ok(existsSync(path.join(packageRoot, "assets/fonts/great-vibes.css")));
  assert.match(html, /data-velvet="person-0"/);
  assert.match(html, /data-velvet="venue-name"/);
  assert.match(bridge, /\/rsvp`/);
  assert.match(bridge, /uz-Cyrl/);
  assert.match(sourceJs, /window\.prompt\(promptText\)/);
  assert.match(bridge, /calendarPrompt:/);
  assert.doesNotMatch(`${html}\n${bridge}\n${sourceJs}`, /n8n\.tim-0fficial|stats\.tolipov|img\.icons8|fonts\.googleapis|cdnjs\.cloudflare/);
  assert.ok(cover.size > 10_000);
  assert.deepEqual(provenance.viewport, { width: 450, height: 800 });
  assert.equal(provenance.artwork, "/templates/velvet/preview.webp");
});

test("Velvet registration migration cannot publish the template", () => {
  const migration = readFileSync(
    path.join(root, "packages/database/migrations/0120_register_velvet_template.sql"),
    "utf8",
  );
  assert.match(migration, /VALUES \('velvet', 'Velvet', 15000000, 'UZS', false\)/);
  assert.match(migration, /VALUES \('velvet', 'wedding'\)/);
  assert.doesNotMatch(migration, /published\s*=\s*true/i);
});
