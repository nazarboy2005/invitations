import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { templateById } from "../packages/contracts/src/index";

const root = process.cwd();
const reference = path.join(
  root,
  "apps/web/public/templates/velvet-royale/source/reference",
);

test("Velvet Royale publishes the exact E-invitation source ID after release", () => {
  const template = templateById("royal-burgundy-edition");
  assert.ok(template);
  assert.equal(template.name, "Velvet Royale");
  assert.equal(template.published, true);
  assert.equal(template.previewEventType, "wedding");
  assert.deepEqual(template.categoryIds, ["wedding"]);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
  assert.equal(template.priceMinor, 100_000);
  assert.equal(
    template.previewImage,
    "/templates/velvet-royale/source/reference/intro-v4-20261014-blank-poster-c521108180.webp",
  );
});

test("Velvet Royale retains its captured source module and page assets", () => {
  const provenance = JSON.parse(readFileSync(path.join(reference, "../provenance.json"), "utf8"));
  for (const file of provenance.files) assert.equal(createHash("sha256").update(readFileSync(path.join(reference, file.name))).digest("hex"), file.sha256, file.name);
  const capturedCss = readFileSync(
    path.join(reference, "VelvetRoyale.Bur_z5Os.css"),
    "utf8",
  );
  const sourceHtml = readFileSync(path.join(root, "apps/web/public/templates/velvet-royale/template.html"), "utf8");
  assert.match(sourceHtml, /data-v-965f1a66/);
  for (const section of ["section-intro", "section-hero", "section-couple", "section-story", "section-photo-story", "section-datetime", "section-countdown", "section-venue", "section-table", "section-card", "section-contact", "section-rsvp", "section-family", "section-closing"]) assert.match(sourceHtml, new RegExp(section));
  assert.doesNotMatch(sourceHtml, /Akmal|Madina|Navruz tantanalar saroyi|Karimovlar|0000 0000 0000 0000|assets\.e-invitation\.uz/);
  assert.match(capturedCss, /\[data-v-[a-f0-9]+\]/);
  assert.ok(existsSync(path.join(reference, "Cn3YHNzc.js")));

  for (const file of [
    "VelvetRoyale.Bur_z5Os.css",
    "v3-20260927-frame.webp",
    "v3-20260927-divider.webp",
    "v4-20260927-couple-stage.webp",
    "v3-20260927-rings.webp",
    "v3-20260927-doves.webp",
    "v3-20260927-cake.webp",
    "v3-20260927-wreath.webp",
    "v3-20260927-table.webp",
    "v3-20260927-calendar-corner.webp",
    "intro-v4-20261014-blank-poster-c521108180.webp",
    "intro-v4-20261014-blank-envelope-cf28b7812a.mp4",
    "hero-upscale-v1-20260927-poster-361e716aba.webp",
    "hero-upscale-v1-20260927-c4fec8e94c.mp4",
    "wax-blank-v1-20261014.webp",
    "couple-gallery-v20261021-01.webp",
    "couple-gallery-v20261021-02.webp",
    "couple-gallery-v20261021-03.webp",
    "couple-gallery-v20261021-04.webp",
    "couple-gallery-v20261021-05.webp",
    "couple-gallery-v20261021-06.webp",
  ]) {
    assert.ok(existsSync(path.join(reference, file)), `${file} is packaged`);
  }

  const fontFiles = readdirSync(path.join(reference, "fonts")).filter((file) =>
    file.endsWith(".woff2"),
  );
  assert.equal(fontFiles.length, 18);
  const localFonts = readFileSync(path.join(reference, "fonts.css"), "utf8");
  assert.match(localFonts, /font-family:\s*'Cormorant Garamond'/);
  assert.match(localFonts, /font-family:\s*'Great Vibes'/);
  assert.match(localFonts, /font-family:\s*'Outfit'/);
  assert.doesNotMatch(localFonts, /https:\/\/fonts\.gstatic\.com/);
});

test("Velvet Royale is seeded only as an unpublished wedding template", () => {
  const migration = readFileSync(
    path.join(
      root,
      "packages/database/migrations/0082_add_royal_burgundy_edition.sql",
    ),
    "utf8",
  );
  assert.match(
    migration,
    /VALUES \('royal-burgundy-edition', 'Velvet Royale', 15000000, 'UZS', false\)/,
  );
  assert.match(migration, /'royal-burgundy-edition', 'wedding'/);
  assert.match(migration, /published = false/);
  assert.match(migration, /ON CONFLICT/);
});

test("Velvet Royale has a separate explicit publication migration", () => {
  const migration = readFileSync(
    path.join(
      root,
      "packages/database/migrations/0084_publish_royal_burgundy_edition.sql",
    ),
    "utf8",
  );
  assert.match(
    migration,
    /VALUES \('royal-burgundy-edition', 'Velvet Royale', 15000000, 'UZS', true\)/,
  );
  assert.match(migration, /published = true/);
  assert.match(migration, /'royal-burgundy-edition', 'wedding'/);
  const correction = readFileSync(path.join(root, "packages/database/migrations/0168_publish_complete_velvet_royale.sql"), "utf8");
  assert.match(correction, /SET published = true/);
  assert.match(correction, /WHERE id = 'royal-burgundy-edition'/);
  assert.doesNotMatch(correction, /price_minor\s*=/);
});

test("Velvet Royale renderer binds contract fields and application RSVP APIs", () => {
  const renderer = readFileSync(
    path.join(root, "apps/web/public/templates/velvet-royale/renderer.js"),
    "utf8",
  );
  const adapter = readFileSync(
    path.join(root, "apps/web/src/templates/velvet-royale/renderer.tsx"),
    "utf8",
  );
  const sourceHtml = readFileSync(
    path.join(root, "apps/web/public/templates/velvet-royale/index.html"),
    "utf8",
  );
  assert.match(adapter, /makeLegacyData\(invitation, frameLocale, guestName/);
  assert.match(adapter, /catalog-emotional-piano|CATALOG_PREVIEW_MUSIC/);
  assert.match(adapter, /api\/public\/invitations/);
  assert.match(renderer, /\/rsvp/);
  assert.match(renderer, /\/wishes/);
  assert.match(renderer, /data\.program/);
  assert.match(renderer, /data\.venue/);
  assert.match(renderer, /data\.gallery/);
  assert.match(renderer, /data\.toyona/);
  assert.match(renderer, /data\.contacts/);
  assert.match(renderer, /prefers-reduced-motion/);
  assert.match(renderer, /qaReducedMotion/);
  assert.match(renderer, /if \(opened\) return/);
  assert.doesNotMatch(renderer, /assets\.e-invitation\.uz|e-invitation\.uz\/musics|\/webhook|tracking/);
  assert.match(sourceHtml, /VelvetRoyale\.Bur_z5Os\.css/);
  assert.match(sourceHtml, /fonts\.css/);
});

test("Velvet Royale uses its own renderer across preview and public routes", () => {
  const rendererPath =
    "apps/web/src/templates/velvet-royale/renderer";
  const renderer = readFileSync(
    path.join(root, `${rendererPath}.tsx`),
    "utf8",
  );
  for (const route of [
    "apps/web/src/modules/studio/studio.tsx",
    "apps/web/src/modules/catalog/full-template-preview.tsx",
    "apps/web/src/app/i/[slug]/page.tsx",
  ]) {
    assert.match(readFileSync(path.join(root, route), "utf8"), /VelvetRoyaleInvitation/);
  }
  assert.match(readFileSync(path.join(root, "apps/web/src/server/invitation-cover.ts"), "utf8"), /\/preview\?template=/);
  assert.match(renderer, /royal-burgundy-edition:update/);
  assert.match(renderer, /qaReducedMotion=1/);
  assert.match(renderer, /qaMobile/);
  assert.doesNotMatch(renderer, /InvitateInvitation|Chorlove/);
  const css = readFileSync(path.join(reference, "VelvetRoyale.Bur_z5Os.css"), "utf8");
  assert.match(css, /\.section-intro/);
  assert.match(css, /\.section-hero/);
  assert.match(css, /prefers-reduced-motion/);
});
