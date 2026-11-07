import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  CATALOG_PREVIEW_MUSIC,
  catalogPreviewMusic,
  pickPreviewMusic,
} from "../apps/web/src/modules/catalog/catalog-music";
import { CLASSICAL_MUSIC } from "../apps/web/src/modules/studio/classical-music";
import {
  publicAsset,
  publicAssetPrefix,
} from "../apps/web/src/lib/public-asset";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

test("template adapters carry the chosen preview track", () => {
  const preview = read(
    "apps/web/src/modules/catalog/full-template-preview.tsx",
  );
  const anorRenderer = read("apps/web/src/templates/anor/renderer.tsx");
  const marxabaRenderer = read("apps/web/src/templates/marxaba/renderer.tsx");

  assert.equal(
    CATALOG_PREVIEW_MUSIC.url,
    publicAsset("/music/catalog/emotional-piano.mp3"),
  );
  assert.ok(
    existsSync(
      path.join(
        root,
        "apps/web/public",
        CATALOG_PREVIEW_MUSIC.url.slice(publicAssetPrefix.length),
      ),
    ),
    "the default preview track must be packaged locally",
  );
  const renderers = [...preview.matchAll(/<([A-Z]\w*Invitation)\b[^>]*\/>/g)];
  assert.ok(
    renderers.length >= 3,
    "the preview must contain the registered renderer families",
  );
  for (const [branch, name] of renderers)
    assert.match(
      branch,
      /catalogMusic=\{catalogPreview\}/,
      `${name} receives the shared catalog track`,
    );
  assert.match(
    anorRenderer,
    /music:\s*\{\s*enabled:\s*true,\s*url:\s*catalogPreviewMusic\(invitation\)\.url/,
  );
  assert.match(
    marxabaRenderer,
    /catalogMusic\s*\?\s*catalogPreviewMusic\(invitation\)\.url/,
  );
  assert.match(
    read("apps/web/src/templates/invitate/renderer.tsx"),
    /preview && catalogMusic[\s\S]*catalogPreviewMusic\(invitation\)\.url/,
  );
});

test("all bundled tracks can be selected, consecutive previews avoid repeating, and uploads are supported", () => {
  const tracks = [CATALOG_PREVIEW_MUSIC, ...CLASSICAL_MUSIC];
  for (let i = 0; i < tracks.length; i++) {
    const music = pickPreviewMusic(tracks, "", () => (i + 0.5) / tracks.length);
    assert.equal(music.url, tracks[i].url);
    assert.equal(
      catalogPreviewMusic({ music }).url,
      publicAsset(tracks[i].url),
    );
  }
  assert.notEqual(
    pickPreviewMusic(tracks, tracks[0].url, () => 0).url,
    tracks[0].url,
  );
  const uploaded = {
    url: "https://media.example/library.mp3",
    filename: "Library recording",
    assetId: "asset-library",
  };
  assert.deepEqual(pickPreviewMusic([uploaded]), {
    ...uploaded,
    enabled: true,
  });
  assert.equal(pickPreviewMusic([]).enabled, true);
});
