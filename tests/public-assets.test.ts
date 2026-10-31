import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import {
  preparePublicAssets,
  versionPublicReferences,
} from "../apps/web/scripts/prepare-public-assets.mjs";
import { isCacheablePublicAsset } from "../apps/web/src/lib/public-asset-policy.mjs";
import {
  isTemplateDocument,
  publicAsset,
  publicAssetPrefix,
} from "../apps/web/src/lib/public-asset";
import { coverRequestKind } from "../apps/web/src/server/cover-policy";

test("asset snapshots invalidate dependencies when bytes change and preserve original sources", () => {
  const root = mkdtempSync(join(tmpdir(), "visol-public-assets-"));
  const write = (path: string, contents: string) => {
    const file = join(root, "public", path);
    mkdirSync(resolve(file, ".."), { recursive: true });
    writeFileSync(file, contents);
  };
  try {
    const html =
      '<script src="/templates/demo/bridge.js"></script><img src="art.webp"><link href="font.css">';
    write("templates/demo/index.html", html);
    write(
      "templates/demo/bridge.js",
      'const url="/images/home/hero.webp"; fetch("/api/media/private-id");',
    );
    write("templates/demo/font.css", '@font-face{src:url("font.woff2")}');
    write("templates/demo/font.woff2", "font-v1");
    write("templates/demo/art.webp", "image-v1");
    write("images/home/hero.webp", "hero-v1");
    write("templates/demo/source/reference.html", "private captured page");
    write("templates/demo/README.md", "source evidence");
    write(
      "templates/invitate-wedding/assets/captured/5b73decb38ff5c8c.js",
      "private tracker",
    );
    const first = preparePublicAssets(root);
    const prefix = `/_assets/${first.version}`;
    const output = join(root, "public", prefix, "templates/demo/index.html");
    assert.match(
      readFileSync(output, "utf8"),
      new RegExp(`${prefix}/templates/demo/bridge.js`),
    );
    assert.match(readFileSync(output, "utf8"), /src="art.webp"/);
    assert.equal(
      readFileSync(join(root, "public/templates/demo/index.html"), "utf8"),
      html,
    );
    assert.equal(
      existsSync(join(root, "public", prefix, "templates/demo/art.webp")),
      false,
      "large binary files use rewrites instead of copies",
    );
    assert.equal(
      first.files.some((file: string) =>
        /reference.html|README|5b73decb38ff5c8c/.test(file),
      ),
      false,
    );
    assert.equal(
      preparePublicAssets(root).version,
      first.version,
      "unchanged assets retain their cache URLs",
    );
    write("templates/demo/font.woff2", "font-v2");
    const second = preparePublicAssets(root);
    assert.notEqual(
      second.version,
      first.version,
      "a dependency change versions the complete graph",
    );
    assert.equal(
      existsSync(output),
      false,
      "old generated trees do not accumulate in deployments",
    );
    assert.match(
      readFileSync(
        join(
          root,
          "public",
          `/_assets/${second.version}/templates/demo/bridge.js`,
        ),
        "utf8",
      ),
      /fetch\("\/api\/media\/private-id"\)/,
    );
  } finally {
    assert.ok(
      resolve(root).startsWith(resolve(tmpdir()) + "\\") ||
        resolve(root).startsWith(resolve(tmpdir()) + "/"),
    );
    rmSync(root, { recursive: true, force: true });
  }
});

test("versioning leaves external URLs, APIs, uploaded media, and page links alone", () => {
  for (const address of [
    "/api/media/private-id",
    "/api/invitation-covers",
    "/studio",
    "/templates",
    "https://example.com/images/a.webp",
    "blob:example",
  ]) {
    assert.equal(publicAsset(address), address);
    assert.equal(isCacheablePublicAsset(address), false);
  }
  assert.equal(
    publicAsset("/images/home/a.webp?size=2#crop"),
    publicAssetPrefix + "/images/home/a.webp?size=2#crop",
  );
  assert.equal(
    publicAsset(publicAsset("/templates/demo/index.html")),
    publicAsset("/templates/demo/index.html"),
  );
  assert.equal(
    isCacheablePublicAsset("/templates/demo/source/reference.html"),
    false,
  );
  const transformed = versionPublicReferences(
    '<img src="https://example.com/images/a.webp"><img src="/images/a.webp">',
    publicAssetPrefix,
  );
  assert.match(transformed, /https:\/\/example.com\/images\/a.webp/);
  assert.ok(transformed.includes(`src="${publicAssetPrefix}/images/a.webp"`));
});

test("development uses original files across refreshes instead of revision-dependent URLs", () => {
  const previous = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = "development";
    for (const address of [
      "/images/home/invitation-scene.webp",
      "/templates/anor/source/index.html?locale=uz-Latn",
      "/audio/site/water-drop.mp3",
      "/api/media/private-id",
    ]) {
      assert.equal(publicAsset(address), address);
    }
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});

test("versioned frames retain preview styling and cover capture without broadening media access", () => {
  const origin = "https://visol.example";
  assert.equal(
    isTemplateDocument(
      origin + publicAsset("/templates/anor/source/index.html"),
      origin,
    ),
    true,
  );
  assert.equal(
    isTemplateDocument(origin + "/templates/anor/source/index.html", origin),
    true,
  );
  assert.equal(
    isTemplateDocument(
      "https://other.example" + publicAsset("/templates/anor/index.html"),
      origin,
    ),
    false,
  );
  assert.equal(
    isTemplateDocument(origin + "/api/media/private-id", origin),
    false,
  );
  assert.equal(
    coverRequestKind(
      origin + publicAsset("/templates/anor/source/index.html"),
      origin,
    ),
    "asset",
  );
  assert.equal(
    coverRequestKind(
      origin + publicAssetPrefix + "/api/media/private-id",
      origin,
    ),
    "deny",
  );
  assert.equal(
    coverRequestKind(origin + "/api/media/private-id", origin),
    "media",
  );
});
