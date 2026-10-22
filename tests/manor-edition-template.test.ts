import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { templateById } from "../packages/contracts/src/index";

const root = resolve(process.cwd());
const template = templateById("manor-edition");
const source = resolve(root, "apps/web/public/templates/manor-edition/source/reference");
const runtime = resolve(root, "apps/web/public/templates/manor-edition");

test("Manor is registered as an unpublished E-invitation wedding template", () => {
  assert.ok(template);
  assert.equal(template.name, "Manor");
  assert.equal(template.published, false);
  assert.equal(template.previewImage, "/templates/manor-edition/source/reference/assets/intro-poster.jpg");
  assert.deepEqual(template.categoryIds, ["wedding"]);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
});

test("Manor source identity, module, style, media, art, and fonts are packaged", () => {
  const capture = readFileSync(resolve(source, "manor-edition.html"), "utf8");
  const module = readFileSync(resolve(source, "ManorEdition.module.js"), "utf8");
  const css = readFileSync(resolve(source, "ManorEdition.css"), "utf8");
  assert.match(capture, /<title>Manor/);
  assert.match(capture, /\/demo\/manor-edition\//);
  assert.match(module, /module:"manor-edition"/);
  assert.match(module, /intro\.mp4/);
  assert.match(css, /section-hero__bg/);
  for (const name of ["cake.webp", "couple.webp", "divider.webp", "doves.gif", "frame.webp", "gallery-romance-v1-01.webp", "gallery-romance-v1-02.webp", "gallery-romance-v1-03.webp", "gallery-romance-v1-04.webp", "hero.jpg", "intro-poster.jpg", "intro.mp4", "rings.webp", "table.webp", "wreath.webp"]) {
    assert.ok(readFileSync(resolve(source, "assets", name)), `${name} must be present`);
  }
  const fontsCss = readFileSync(resolve(source, "google-fonts.css"), "utf8");
  const fonts = [...fontsCss.matchAll(/url\("\/templates\/manor-edition\/source\/reference\/fonts\/([^"?]+)"\)/g)];
  assert.equal(fonts.length, 12);
  for (const font of fonts) assert.ok(readFileSync(resolve(source, "fonts", font[1])), `${font[1]} must be present`);
});

test("Manor registration migration does not publish", () => {
  const migration = readFileSync(resolve(root, "packages/database/migrations/0092_register_manor_edition.sql"), "utf8");
  assert.match(migration, /VALUES \('manor-edition', 'Manor', 15000000, 'UZS', false\)/);
  assert.match(migration, /'manor-edition', 'wedding'/);
  assert.doesNotMatch(migration, /published\s*=\s*true/i);
});

test("Manor runtime binds app data and app APIs without source demo details", () => {
  const renderer = readFileSync(resolve(runtime, "renderer.js"), "utf8");
  const adapter = readFileSync(resolve(root, "apps/web/src/templates/manor-edition/renderer.tsx"), "utf8");
  assert.match(renderer, /\/rsvp/);
  assert.match(renderer, /\/wishes/);
  assert.match(adapter, /CATALOG_PREVIEW_MUSIC/);
  assert.match(adapter, /source\.music\.url/);
  assert.match(adapter, /manor-edition:update/);
  assert.doesNotMatch(renderer, /Akmal|Madina|Karimovlar|2026-08-22|18:00|0000 0000|webhook/i);
});
