import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";
import { templateById } from "../packages/contracts/src/index";

test("Butterfly is a published wedding-only catalog template", () => {
  const template = templateById("butterfly");
  assert.ok(template);
  assert.equal(template.published, true);
  assert.equal(template.priceMinor, 15_000_000);
  assert.deepEqual(template.categoryIds, ["wedding"]);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
  assert.equal(template.previewImage, "/templates/butterfly/preview.png");

  const migration = readFileSync(
    "packages/database/migrations/0129_register_butterfly_template.sql",
    "utf8",
  );
  assert.match(migration, /'butterfly', 'Butterfly', 15000000, 'UZS', false/);
  assert.match(migration, /template_category_assignments[\s\S]*'butterfly', 'wedding'/);
  assert.match(migration, /template_supported_event_types[\s\S]*'butterfly', 'wedding'/);
  assert.doesNotMatch(migration, /published\s*=\s*true/i);
});

test("Butterfly adapter maps authored content and keeps preview-only gallery assets ephemeral", () => {
  const adapter = readFileSync(
    "apps/web/src/templates/invitate/butterfly-adapter.ts",
    "utf8",
  );
  assert.match(adapter, /getContent\(invitation, locale\)/);
  assert.match(adapter, /content\.personalGreeting\.replaceAll\("\{name\}"/);
  assert.match(adapter, /content\.personalGreeting\.replaceAll\("\{name\}", guestName\) \|\| content\.greeting/);
  assert.match(adapter, /eventInstant\(invitation\.startsAt, invitation\.timezone\)/);
  assert.match(adapter, /content\.venueName/);
  assert.match(adapter, /content\.landmark/);
  assert.match(adapter, /invitation\.gallery[\s\S]*\.map\(/);
  assert.match(adapter, /if \(options\.preview && !gallery\.length\)/);
  assert.match(adapter, /invitation\.music\.enabled \? invitation\.music\.url/);
  assert.match(adapter, /silentPlayback: options\.preview && options\.silentPlayback/);
  assert.doesNotMatch(adapter, /eyebrow|eventLabel.*greeting/i);
  assert.match(adapter, /"uz-Cyrl": "uz-Cyrl"[\s\S]*en: "en"[\s\S]*ru: "ru"/);
});

test("Butterfly opening artwork and source package are present and locally bound", () => {
  const html = readFileSync("apps/web/public/templates/butterfly/index.html", "utf8");
  const script = readFileSync(
    "apps/web/public/templates/butterfly/assets/js/butterfly.js",
    "utf8",
  );
  const css = readFileSync(
    "apps/web/public/templates/butterfly/assets/css/butterfly.css",
    "utf8",
  );
  const image = statSync("apps/web/public/templates/butterfly/preview.png");
  const provenance = JSON.parse(
    readFileSync("apps/web/public/templates/butterfly/preview.provenance.json", "utf8"),
  );
  assert.match(html, /assets\/css\/butterfly\.css/);
  assert.match(html, /assets\/js\/butterfly\.js/);
  assert.doesNotMatch(`${html}\n${script}`, /fonts\.googleapis|stats\.tolipov|cz-shortcut-listen/);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(script, /gallery\.addEventListener\("click"/);
  assert.match(script, /userStartedMusic && !invitationData\.preview\) return/);
  assert.match(script, /weddingAudio\.addEventListener\("ended"/);
  assert.ok(image.size > 10_000);
  assert.equal(provenance.sample, "apps/web/src/modules/catalog/preview-sample.json");
  assert.deepEqual(provenance.output, { width: 357, height: 719 });
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /manrope-cyrillic\.woff2/);
  assert.match(css, /marcellus-cyrillic\.woff2/);
  assert.match(html, /Bismillahir rohmanir rohim/);
});
