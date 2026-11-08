import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { templateById } from "../packages/contracts/src/index";

const root = resolve(process.cwd());
const template = templateById("olive-manor-edition");
const source = resolve(root, "apps/web/public/templates/olive-manor-edition/source/reference");

test("Olive Manor is published for weddings with its complete opening artwork", () => {
  assert.ok(template);
  assert.equal(template.name, "Olive Manor");
  assert.equal(template.published, true);
  assert.equal(template.previewImage, "/templates/olive-manor-edition/catalog.webp");
  assert.deepEqual(template.categoryIds, ["wedding"]);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
});

test("Olive Manor source identity and distinctive assets are captured locally", () => {
  const capture = readFileSync(resolve(source, "olive-manor-edition.html"), "utf8");
  const component = readFileSync(resolve(source, "OliveManorEdition.module.js"), "utf8");
  const css = readFileSync(resolve(source, "OliveManorEdition.css"), "utf8");
  assert.match(capture, /<title>Olive Manor/);
  assert.match(capture, /\/demo\/olive-manor-edition\//);
  assert.match(component, /EditionsOliveManorEdition/);
  assert.match(css, /section-hero/);
  for (const asset of ["intro-start-v2.jpg", "intro-v3.mp4", "hero-bg.webp", "calendar-flowers.webp", "envelope.webp"]) {
    assert.ok(readFileSync(resolve(source, "assets", asset)), `${asset} must be present in the source package`);
  }
  const fonts = readFileSync(resolve(root, "apps/web/public/templates/olive-manor-edition/source/current/fonts.css"), "utf8");
  for (const match of fonts.matchAll(/url\(([^)]+)\)/g)) {
    const path = new URL(match[1].replace(/^\//, "https://local.invalid/")).pathname;
    assert.ok(readFileSync(resolve(root, "apps/web/public", path.slice(1))), `${path} must be packaged locally`);
  }
});

test("Olive Manor registration migration never publishes the template", () => {
  const migration = readFileSync(resolve(root, "packages/database/migrations/0090_register_olive_manor.sql"), "utf8");
  assert.match(migration, /VALUES \('olive-manor-edition', 'Olive Manor', 15000000, 'UZS', false\)/);
  assert.match(migration, /'olive-manor-edition', 'wedding'/);
  assert.doesNotMatch(migration, /published\s*=\s*true/i);
});

test("Olive Manor app renderer uses the shared invitation APIs and no source demo details", () => {
  const renderer = readFileSync(resolve(root, "apps/web/public/templates/e-invitation-shared/runtime.js"), "utf8");
  const adapter = readFileSync(resolve(root, "apps/web/src/templates/e-invitation/renderer.tsx"), "utf8");
  assert.match(renderer, /\/rsvp/);
  assert.match(renderer, /\/wishes/);
  assert.match(renderer, /BEGIN:VCALENDAR/);
  assert.doesNotMatch(renderer, /ÐŸÐ½/);
  assert.match(adapter, /catalogPreviewMusic/);
  assert.match(adapter, /data\.music\.url/);
  assert.match(adapter, /templateId}:update/);
  assert.doesNotMatch(renderer, /Akmal|Madina|2030|Navruz|0000 0000/);
});
