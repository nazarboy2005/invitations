import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL(
  "../apps/web/public/templates/kuzgi-chinor/",
  import.meta.url,
);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/kuzgi-chinor/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const translationsSource = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url),
  "utf8",
);

test("Kuzgi Chinor translates its static invitation copy and metadata", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(translationsSource, { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const textNodes = Array.from(html.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/\s+/g, " ").trim(),
  ).filter((text) => text.length > 1 && text !== "&amp;" && text !== "00");
  const attributes = Array.from(
    html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  const metadata = Array.from(
    html.matchAll(/<meta\s+[^>]*?(?:name="description"|property="og:(?:title|description)")[^>]*?content="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );

  assert.deepEqual(
    [...textNodes, ...attributes, ...metadata].filter(
      (text) => !translations[text],
    ),
    [],
  );
  assert.ok(translations["Kuzgi Chinor · Taklifnoma"]);
  assert.ok(translations["Raqamli taklifnoma"]);
});

test("Kuzgi Chinor preserves captured source and bundles the referenced assets locally", () => {
  const normalize = (value: string) => value.replace(/\r\n/g, "\n");
  const originalHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  const originalCss = readFileSync(new URL("template.css", captureRoot), "utf8");
  const originalJs = readFileSync(new URL("template.js", captureRoot), "utf8");
  const packagedJs = readFileSync(new URL("template.js", templateRoot), "utf8");
  const packagedCss = readFileSync(new URL("template.css", templateRoot), "utf8");
  const originalBody = originalHtml.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim();
  const packagedBody = html.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim();

  assert.equal(
    normalize(packagedBody ?? ""),
    normalize(originalBody ?? ""),
    "the captured invitation body should remain intact",
  );
  assert.equal(
    normalize(packagedJs),
    normalize(originalJs),
    "the captured animation and interaction script should remain intact",
  );
  assert.match(packagedJs, /window\.Marhamat\s*&&\s*Marhamat\.reducedMotion/);
  assert.match(packagedJs, /\|\|reduced\)return/);
  assert.equal(
    normalize(packagedCss),
    normalize(originalCss.replace(/^@import url\([^\r\n]+\);\r?\n/, "")),
    "only the external font import should be replaced by local font files",
  );

  for (const asset of [
    "preview.webp",
    "fonts.css",
    "art/avenue-far.webp",
    "art/avenue-mid.svg",
    "art/branches-top.svg",
    "art/kraft-paper.svg",
    "art/leaf.svg",
  ]) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
});
