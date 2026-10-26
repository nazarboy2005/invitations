import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { templateById } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = process.cwd();
const packageRoot = path.join(root, "apps/web/public/templates/velora");
const readPackage = (relative: string) =>
  readFileSync(path.join(packageRoot, relative), "utf8");

test("Velora is a published wedding design in the shared typed catalog", () => {
  const template = templateById("velora");
  assert.ok(template);
  assert.equal(template.name, "Velora");
  assert.equal(template.published, true);
  assert.equal(template.previewEventType, "wedding");
  assert.deepEqual(template.categoryIds, ["wedding"]);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
  assert.equal(template.priceMinor, 15_000_000);
  assert.equal(template.previewImage, "/templates/velora/preview.png");
  assert.ok(existsSync(path.join(packageRoot, "preview.png")));
});

test("Velora packages its source page, local fonts and controls without sample/runtime data", () => {
  const html = readPackage("index.html");
  const adapter = readPackage("assets/js/velora-adapter.js");
  const motion = readPackage("assets/js/velora.js");
  const css = readPackage("assets/css/velora.css");
  const fontCss = readPackage("assets/vendor/ibm-plex-serif.css");
  const fontProvenance = JSON.parse(readPackage("assets/provenance.json")).fonts;

  for (const asset of [
    "source/velora.html",
    "source/assets/css/velora.css",
    "source/assets/js/velora.js",
    "source/assets/previews/template/velora/back.png",
    "source/assets/previews/template/velora/desktop.png",
    "source/assets/previews/template/velora/frame-01.svg",
    "assets/vendor/aos.css",
    "assets/vendor/aos.js",
    "assets/fonts/RWmMoKWR9v4ksMfaWd_JN9XFiaQ.woff2",
    "assets/images/music-off2.png",
  ]) assert.ok(existsSync(path.join(packageRoot, asset)), `${asset} exists`);

  assert.match(html, /assets\/js\/velora-adapter\.js/);
  assert.doesNotMatch(html, /stats\.tolipov|fonts\.googleapis|fonts\.gstatic|unpkg\.com|Ибрагим|Мафтуна|2027-09-03|0341\.aac/);
  assert.doesNotMatch(`${adapter}\n${motion}`, /stats\.tolipov|telegram\.org\/bot|bexruz0510\.php/);
  assert.match(adapter, /uz-Cyrl/);
  assert.match(adapter, /\b(en|ru):/);
  assert.match(adapter, /\$\{data\.apiBase\}\/rsvp/);
  assert.match(adapter, /input\[name="transfer"\]/);
  assert.match(adapter, /data\.venue\?\.mapUrl/);
  assert.match(adapter, /data\.program/);
  assert.match(adapter, /data\.gallery/);
  assert.match(adapter, /item\.alt/);
  assert.match(adapter, /item\.caption/);
  assert.match(adapter, /set\("#questions-intro",""\);visible\("#questions-intro",false\)/);
  assert.match(adapter, /set\("\.opros-grup-title",t\.answer\)/);
  assert.match(html, /id="dresscode-foto-woman"/);
  assert.doesNotMatch(html, /wow-card\.ru|1103-[1-5]\.jpg/);
  assert.match(html, /data-off-icon="\/templates\/velora\/assets\/images\/music-off2\.png"/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(motion, /prefers-reduced-motion/);
  assert.match(fontCss, /Great Vibes/);
  assert.match(fontCss, /IBM Plex Serif/);
  assert.equal((fontCss.match(/@font-face/g) ?? []).length, 76);
  assert.doesNotMatch(fontCss, /https?:\/\//);
  assert.equal(fontProvenance.localFontFiles, 76);
  assert.equal(fontProvenance.sourceSha256, createHash("sha256").update(readPackage("source/assets/fonts/ibm-plex-serif.css")).digest("hex"));
  for (const [, font] of fontCss.matchAll(/url\([^/]*\/templates\/velora\/assets\/fonts\/([^\)]+)\)/g))
    assert.ok(existsSync(path.join(packageRoot, "assets/fonts", font)), `${font} exists`);
});

test("Velora keeps gift/to'yona UI absent because it is absent from the captured source", () => {
  const archivedRoot = path.join(
    root,
    "Invitations - this folder will be removed from production",
    "Invitations - this folder will be removed from production",
    "Invitate",
    "Web invitations",
    "invitate.uz",
  );
  const archivedSource = readFileSync(path.join(archivedRoot, "velora.html"), "utf8");
  const packagedSource = readPackage("source/velora.html");
  const archivedMotion = readFileSync(path.join(archivedRoot, "assets/js/velora.js"), "utf8");
  const adapter = readPackage("assets/js/velora-adapter.js");
  const packaged = readPackage("index.html");

  // The source's `transfer` radio controls are RSVP answers, not gift-card details.
  assert.equal(packagedSource, archivedSource, "packaged source remains byte-identical to the archive");
  assert.equal(readPackage("source/assets/js/velora.js"), archivedMotion, "packaged source runtime remains byte-identical to the archive");
  assert.match(archivedSource, /name="transfer"/);
  assert.doesNotMatch(archivedSource, /gift|to'yona|sovg['’]?a|hadya|подар/i);
  assert.doesNotMatch(archivedMotion, /giftCardOwner|giftCardNumber|gift-card|to'yona/i);
  assert.doesNotMatch(packaged, /giftCardOwner|giftCardNumber|gift-card|to'yona/i);
  assert.doesNotMatch(adapter, /giftCardOwner|giftCardNumber|gift-card|to'yona/i);
});

test("Velora opening image is the authentic portrait renderer capture with recorded provenance", () => {
  const cover = readFileSync(path.join(packageRoot, "preview.png"));
  const provenance = JSON.parse(readPackage("preview.provenance.json"));
  assert.equal(cover.toString("ascii", 1, 4), "PNG");
  assert.equal(cover.readUInt32BE(16), 480);
  assert.equal(cover.readUInt32BE(20), 860);
  assert.equal(createHash("sha256").update(cover).digest("hex"), provenance.sha256);
  assert.equal(provenance.renderedArtifact, "preview.png");
  assert.equal(provenance.capture.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.match(provenance.source, /Invitate\/Web invitations\/invitate\.uz\/velora\.html/);
});

test("Velora preserves its captured HTML, CSS and JavaScript with recorded hashes", () => {
  const { sourceFiles } = JSON.parse(readPackage("assets/provenance.json"));
  for (const [relative, expectedHash] of Object.entries(sourceFiles) as [string, string][]) {
    const copiedBytes = readFileSync(path.join(packageRoot, relative));
    assert.equal(
      createHash("sha256").update(copiedBytes).digest("hex"),
      expectedHash,
      `${relative} matches its recorded source hash`,
    );
  }
  assert.deepEqual(Object.keys(sourceFiles).sort(), [
    "source/assets/css/velora.css",
    "source/assets/js/velora.js",
    "source/velora.html",
  ]);
});

test("Velora uses the shared ephemeral wedding preview across all approved locales", () => {
  const sample = createTemplatePreviewSample("velora");
  assert.equal(sample.eventType, "wedding");
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
    assert.ok(sample.content[locale].people.length >= 2);
    assert.ok(sample.content[locale].greeting);
    assert.ok(sample.content[locale].message);
  }
  const renderer = readFileSync(
    path.join(root, "apps/web/src/templates/invitate/renderer.tsx"),
    "utf8",
  );
  const registry = readFileSync(
    path.join(root, "apps/web/src/templates/invitate/registry.ts"),
    "utf8",
  );
  const publicPage = readFileSync(
    path.join(root, "apps/web/src/app/i/[slug]/page.tsx"),
    "utf8",
  );
  assert.match(renderer, /templateId === "velora"/);
  assert.match(renderer, /veloraMessage/);
  assert.match(renderer, /templates\/\$\{templateId\}\/index\.html/);
  assert.match(registry, /"velora"/);
  assert.match(publicPage, /isInvitateTemplate\(invitation\.templateId\)/);
  assert.match(publicPage, /<InvitateInvitation[\s\S]*?guestToken=\{query\.g\}/);
});

test("Velora RSVP adapter matches the public RSVP request contract", () => {
  const adapter = readPackage("assets/js/velora-adapter.js");
  const route = readFileSync(
    path.join(root, "apps/web/src/app/api/public/invitations/[id]/rsvp/route.ts"),
    "utf8",
  );
  assert.match(adapter, /\$\{data\.apiBase\}\/rsvp/);
  assert.match(adapter, /status:answer\.value/);
  assert.match(adapter, /partySize:1/);
  assert.match(adapter, /guestToken:data\.guestToken/);
  assert.match(route, /status: z\.enum\(\["yes", "no", "maybe"\]\)/);
  assert.match(route, /partySize: z\.number\(\)/);
  assert.match(route, /publicInvitation\(id\)/);
});

test("Velora refreshes keep guest music playback stable unless its URL changes", () => {
  const adapter = readPackage("assets/js/velora-adapter.js");
  assert.match(adapter, /audio\.getAttribute\("src"\)\|\|""\)!==music/);
  assert.match(adapter, /audio\.pause\(\);if\(music\)audio\.src=music;else audio\.removeAttribute\("src"\);audio\.load\(\)/);
  assert.match(adapter, /button\.dataset\.onIcon\)button\.src=button\.dataset\.onIcon/);
});

test("Velora registration and publication migrations preserve wedding-only support", () => {
  const migration = readFileSync(
    path.join(root, "packages/database/migrations/0124_register_velora_template.sql"),
    "utf8",
  );
  assert.match(migration, /VALUES \('velora', 'Velora', 15000000, 'UZS', false\)/);
  assert.match(migration, /VALUES \('velora', 'wedding'\)/);
  assert.match(migration, /template_supported_event_types[\s\S]*VALUES \('velora', 'wedding'\)/);
  assert.doesNotMatch(migration, /published\s*=\s*true/i);
  const publication = readFileSync(
    path.join(root, "packages/database/migrations/0145_publish_invitate_velora.sql"),
    "utf8",
  );
  assert.match(publication, /template_id = 'velora' AND category_id = 'wedding'/);
  assert.match(publication, /template_id = 'velora' AND event_type = 'wedding'/);
  assert.match(publication, /SET published = true/);
});
