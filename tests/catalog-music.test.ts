import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { CATALOG_PREVIEW_MUSIC } from "../apps/web/src/modules/catalog/catalog-music";

const root = process.cwd();
const read = (file: string) =>
  readFileSync(path.join(root, file), "utf8");

test("every full-template preview uses the shared Emotional Piano default", () => {
  const preview = read("apps/web/src/modules/catalog/full-template-preview.tsx");
  const anorRenderer = read("apps/web/src/templates/anor/renderer.tsx");
  const marxabaRenderer = read("apps/web/src/templates/marxaba/renderer.tsx");

  assert.equal(CATALOG_PREVIEW_MUSIC.url, "/music/catalog/emotional-piano.wav");
  assert.ok(
    existsSync(path.join(root, "apps/web/public", CATALOG_PREVIEW_MUSIC.url)),
    "the default preview track must be packaged locally",
  );
  assert.equal(
    [...preview.matchAll(/catalogMusic=\{catalogPreview\}/g)].length,
    2,
    "both renderer branches must enable the shared catalog track",
  );
  assert.match(anorRenderer, /music:\s*\{\s*enabled:\s*true,\s*url:\s*CATALOG_PREVIEW_MUSIC\.url/);
  assert.match(marxabaRenderer, /catalogMusic\s*\?\s*CATALOG_PREVIEW_MUSIC\.url/);
});
