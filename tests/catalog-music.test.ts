import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { CATALOG_PREVIEW_MUSIC } from "../apps/web/src/modules/catalog/catalog-music";
import { publicAsset, publicAssetPrefix } from "../apps/web/src/lib/public-asset";

const root = process.cwd();
const read = (file: string) =>
  readFileSync(path.join(root, file), "utf8");

test("every full-template preview uses the shared Emotional Piano default", () => {
  const preview = read("apps/web/src/modules/catalog/full-template-preview.tsx");
  const anorRenderer = read("apps/web/src/templates/anor/renderer.tsx");
  const marxabaRenderer = read("apps/web/src/templates/marxaba/renderer.tsx");

  assert.equal(CATALOG_PREVIEW_MUSIC.url, publicAsset("/music/catalog/emotional-piano.wav"));
  assert.ok(
    existsSync(path.join(root, "apps/web/public", CATALOG_PREVIEW_MUSIC.url.slice(publicAssetPrefix.length))),
    "the default preview track must be packaged locally",
  );
  const renderers = [...preview.matchAll(/<([A-Z]\w*Invitation)\b[^>]*\/>/g)];
  assert.ok(renderers.length >= 3, "the preview must contain the registered renderer families");
  for (const [branch, name] of renderers)
    assert.match(branch, /catalogMusic=\{catalogPreview\}/, `${name} receives the shared catalog track`);
  assert.match(anorRenderer, /music:\s*\{\s*enabled:\s*true,\s*url:\s*CATALOG_PREVIEW_MUSIC\.url/);
  assert.match(marxabaRenderer, /catalogMusic\s*\?\s*CATALOG_PREVIEW_MUSIC\.url/);
  assert.match(
    read("apps/web/src/templates/invitate/renderer.tsx"),
    /preview && catalogMusic[\s\S]*CATALOG_PREVIEW_MUSIC\.url/,
  );
});
