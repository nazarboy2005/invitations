import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { templateById } from "../packages/contracts/src/index";

const root = resolve(process.cwd());
const template = templateById("islomiy");
const source = resolve(root, "apps/web/public/templates/islomiy/source/reference");
const runtime = resolve(root, "apps/web/public/templates/islomiy");

test("Islamic Edition is published as a complete E-invitation wedding template", () => {
  assert.ok(template);
  assert.equal(template.name, "Islomiy");
  assert.equal(template.published, true);
  assert.equal(template.previewImage, "/templates/islomiy/catalog.webp");
  assert.deepEqual(template.categoryIds, ["wedding"]);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
});

test("the exact source page, compiled Vue chunk, CSS, artwork, and fonts are packaged", () => {
  const capture = readFileSync(resolve(source, "islamic-edition.html"), "utf8");
  const module = readFileSync(resolve(source, "IslamicEdition.module.js"), "utf8");
  const css = readFileSync(resolve(source, "IslamicEdition.css"), "utf8");
  assert.match(capture, /<title>Islamic/);
  assert.match(capture, /\/demo\/islamic-edition\//);
  assert.match(module, /__name:"SectionIntro"/);
  assert.match(module, /nighty-bg\.webp/);
  assert.match(module, /gift\.webp/);
  assert.match(css, /section-countdown/);
  for (const asset of ["bg.webm", "video.mp4", "video-start.jpg", "video-end.jpg", "bouquet.webp", "closing-moon.webp", "quran.webp"]) {
    assert.ok(readFileSync(resolve(source, "assets", asset)), `${asset} must be present`);
  }
  assert.throws(() => readFileSync(resolve(source, "assets", "gift.webp")), { code: "ENOENT" });
  assert.match(readFileSync(resolve(root, "apps/web/public/templates/islomiy/SOURCE_CAPTURE.md"), "utf8"), /gift\.webp.*404/);
  const fontsCss = readFileSync(resolve(source, "google-fonts.css"), "utf8");
  const fonts = [...fontsCss.matchAll(/url\("\/templates\/islamic-edition\/source\/reference\/fonts\/([^"?]+)"\)/g)];
  assert.ok(fonts.length >= 13, "all referenced font variants are included locally");
  for (const font of fonts) assert.ok(readFileSync(resolve(source, "fonts", font[1])), `${font[1]} must be present`);
});

test("the registration migration keeps Islamic Edition unpublished", () => {
  const migration = readFileSync(resolve(root, "packages/database/migrations/0091_register_islamic_edition.sql"), "utf8");
  assert.match(migration, /VALUES \('islamic-edition', 'Islamic Edition', 15000000, 'UZS', false\)/);
  assert.match(migration, /'islamic-edition', 'wedding'/);
  assert.doesNotMatch(migration, /published\s*=\s*true/i);
});

test("the app renderer uses invitation APIs, real data, and no source site tracking", () => {
  const renderer = readFileSync(resolve(root, "apps/web/public/templates/e-invitation-shared/runtime.js"), "utf8");
  const adapter = readFileSync(resolve(root, "apps/web/src/templates/e-invitation/renderer.tsx"), "utf8");
  assert.match(renderer, /\/rsvp/);
  assert.match(renderer, /\/wishes/);
  assert.doesNotMatch(renderer, /gift\.webp/);
  assert.match(readFileSync(resolve(runtime, "template.html"), "utf8"), /bouquet\.webp/);
  assert.match(adapter, /catalogPreviewMusic/);
  assert.match(adapter, /data\.music\.url/);
  assert.match(adapter, /templateId}:update/);
  assert.doesNotMatch(renderer, /demo@example|0000 0000|2030|cloudflareinsights|webhook/i);
});
