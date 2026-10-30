import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFileSync } from "./helpers/source-files";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL(
  "../apps/web/public/templates/muhabbat-kitobi/",
  import.meta.url,
);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/muhabbat-kitobi/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const coreSource = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url),
  "utf8",
);
const translationsSource = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url),
  "utf8",
);

test("Muhabbat Kitobi translates static copy and page metadata", () => {
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
      (text) =>
        !["— 01 —", "05", "♡ ♡ ♡"].includes(text) && !translations[text],
    ),
    [],
  );
  assert.ok(translations["Muhabbat Kitobi · Taklifnoma"]);
  assert.ok(translations["Raqamli taklifnoma"]);
  for (const label of ["HIKOYA", "ҲИКОЯ", "ГЛАВА", "CHAPTER"]) {
    assert.ok(coreSource.includes(label), `story chapter label ${label} is missing`);
  }
});

test("Muhabbat Kitobi keeps its captured layout, motion, and art assets", () => {
  const normalize = (value: string) => value.replace(/\r\n/g, "\n");
  const originalHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  const originalBody = originalHtml.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim();
  const packagedBody = html.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim();
  assert.equal(normalize(packagedBody ?? ""), normalize(originalBody ?? ""));

  for (const file of ["template.css", "motion.css", "motion.js"]) {
    assert.equal(
      normalize(readFileSync(new URL(file, templateRoot), "utf8")),
      normalize(readFileSync(new URL(file, captureRoot), "utf8")),
      `${file} should match the captured source`,
    );
  }
  assert.match(
    readFileSync(new URL("template.js", templateRoot), "utf8"),
    /data\?\.extras\?\.story\s*\|\|\s*\[\]/,
    "the source renderer should consume localized chapters through its native extras.story slot",
  );

  for (const asset of [
    "preview.webp",
    "fonts.css",
    "art/",
  ]) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
});
