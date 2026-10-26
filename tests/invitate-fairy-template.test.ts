import { readFileSync } from "./helpers/source-files";
import { existsSync } from "node:fs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import test from "node:test";
import { templateById } from "@taklifnoma/contracts";

test("Fairy is a published wedding-only Invitate source package", () => {
  const template = templateById("fairy");
  assert.ok(template);
  assert.deepEqual(template.categoryIds, ["wedding"]);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
  assert.equal(template.priceMinor, 15000000);
  assert.equal(template.published, true);
  assert.equal(template.previewImage, "/templates/fairy/preview.png");

  const index = readFileSync("apps/web/src/templates/invitate/registry.ts", "utf8");
  assert.match(index, /"fairy"/);
  const migration = readFileSync(
    "packages/database/migrations/0137_register_fairy_template.sql",
    "utf8",
  );
  assert.match(migration, /'fairy', 'Fairy', 15000000, 'UZS', false/);
  assert.match(migration, /template_category_assignments[\s\S]*'fairy', 'wedding'/);
  assert.match(migration, /template_supported_event_types[\s\S]*'fairy', 'wedding'/);
});

test("Fairy source adapter excludes captured invitation data and binds reduced motion", () => {
  const html = readFileSync("apps/web/public/templates/fairy/index.html", "utf8");
  const script = readFileSync(
    "apps/web/public/templates/fairy/assets/js/fairy-adapter.js",
    "utf8",
  );
  const sourceScript = readFileSync(
    "apps/web/public/templates/fairy/assets/js/fairy.js",
    "utf8",
  );
  const css = readFileSync("apps/web/public/templates/fairy/assets/css/fairy.css", "utf8");
  const capturedFonts = readFileSync(
    "apps/web/public/templates/fairy/assets/fonts/fairy-captured-subsets.css",
    "utf8",
  );
  assert.doesNotMatch(html, /Baxrom|Sayyora|10\.10\.2026|stats\.tolipov|fonts\.googleapis/);
  assert.doesNotMatch(html, /toyona|gift|cardholder|card number/i);
  assert.doesNotMatch(script, /toyona|gift|cardholder|card number|navigator\.clipboard\.writeText/i);
  assert.doesNotMatch(css, /toyona|gift|cardholder|card number/i);
  assert.doesNotMatch(script, /Отправлено — спасибо/);
  assert.doesNotMatch(sourceScript, /Отправлено — спасибо|anketaSubmit\.addEventListener/);
  assert.match(script, /data\.apiBase/);
  assert.match(script, /data\.date\?\.short/);
  assert.match(script, /function fitHeroNames/);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(capturedFonts, /unicode-range:/);
  assert.doesNotMatch(capturedFonts, /https?:\/\//);
  assert.equal((capturedFonts.match(/@font-face/g) ?? []).length, 16);
  assert.match(html, /fairy-adapter\.js/);
});

test("Fairy keeps gift/card UI out because it was added during adaptation", () => {
  const sourcePath =
    "Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Invitate/Web invitations/invitate.uz";
  assert.ok(existsSync(`${sourcePath}/fairy.html`), "authoritative Fairy source capture is present");
  const sourceHtml = readFileSync(`${sourcePath}/fairy.html`, "utf8");
  const sourceCss = readFileSync(`${sourcePath}/assets/css/fairy.css`, "utf8");
  const sourceScript = readFileSync(`${sourcePath}/assets/js/fairy.js`, "utf8");
  const html = readFileSync("apps/web/public/templates/fairy/index.html", "utf8");
  const css = readFileSync("apps/web/public/templates/fairy/assets/css/fairy.css", "utf8");
  const script = readFileSync(
    "apps/web/public/templates/fairy/assets/js/fairy-adapter.js",
    "utf8",
  );

  const sourceText = /toyona|to.yana|gift[- ](?:section|card)|cardholder|card[- ]number|карта эгаси|карта рақами|номер карты|владелец карты/i;
  assert.doesNotMatch(sourceHtml, sourceText);
  assert.doesNotMatch(sourceCss, /toyona|gift|cardholder|card[- ]number/i);
  assert.doesNotMatch(sourceScript, /toyona|gift|cardholder|card[- ]number|clipboard.*card/i);
  assert.doesNotMatch(html, /toyona|gift|cardholder|card number/i);
  assert.doesNotMatch(css, /toyona|gift|cardholder|card number/i);
  assert.doesNotMatch(script, /toyona|gift|cardholder|card number/i);
});

test("Fairy preview artwork provenance uses the canonical preview fixture", () => {
  const provenance = JSON.parse(
    readFileSync("apps/web/public/templates/fairy/preview.provenance.json", "utf8"),
  );
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.equal(provenance.originalCaptureModified, false);
  assert.deepEqual(provenance.captureViewport, { width: 480, height: 850, deviceScaleFactor: 1 });
  assert.equal(
    provenance.previewSha256.toLowerCase(),
    "fcc576b051845d0aecb8182e9480d0f8d657b0081f2b8e94ad940b6ef24cd7e3",
  );
  const packagedScript = readFileSync(
    "apps/web/public/templates/fairy/assets/js/fairy.js",
  );
  assert.equal(
    createHash("sha256").update(packagedScript).digest("hex").toUpperCase(),
    provenance.packageSha256.javascript,
  );
  const packagedAdapter = readFileSync(
    "apps/web/public/templates/fairy/assets/js/fairy-adapter.js",
  );
  assert.equal(
    createHash("sha256").update(packagedAdapter).digest("hex").toUpperCase(),
    provenance.packageSha256.adapter,
  );
});
