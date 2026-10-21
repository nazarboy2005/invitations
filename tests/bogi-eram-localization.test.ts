import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL(
  "../apps/web/public/templates/bogi-eram/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const sharedTranslations = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url),
  "utf8",
);
const templateTranslations = readFileSync(
  new URL("i18n.js", templateRoot),
  "utf8",
);
const platformBridge = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/platform-bridge.js", import.meta.url),
  "utf8",
);

test("Bog‘i Eram translates its static copy and share metadata", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(sharedTranslations, { window });
  runInNewContext(templateTranslations, { window });
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
  const missing = [...textNodes, ...attributes, ...metadata].filter(
    (text) => !translations[text],
  );

  assert.deepEqual(missing, []);
  assert.equal(
    translations["Bog‘ darvozasi ochiladi — Bog‘i Eram sizni chorlaydi"][0],
    "Ворота сада открываются — Bog‘i Eram приглашает вас",
  );
});

test("Bog‘i Eram packages every referenced motion sprite and share image", () => {
  for (const asset of [
    "art/doves.webp",
    "art/bird-sprite.webp",
    "preview.webp",
  ]) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
});

test("Bog‘i Eram moves its language picker to the corner after the gate opens", () => {
  assert.match(platformBridge, /platform-lang-below-greeting:not\(\.is-locked\) \.mh-lang/);
  assert.match(platformBridge, /top: calc\(env\(safe-area-inset-top, 0px\) \+ 6px\) !important/);
});
