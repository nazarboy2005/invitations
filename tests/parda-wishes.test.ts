import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createTemplatePreviewSample, getTemplatePreviewWishes } from "../apps/web/src/modules/catalog/preview-sample";
import type { Locale } from "@taklifnoma/contracts";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => { module.exports = {}; };
const moduleRuntime = require("node:module") as { _resolveFilename: (...args: any[]) => string };
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/") ? path.resolve(webSourceRoot, request.slice(2)) : request;
  return resolveFilename.call(this, resolved, ...args);
};

const pardaRoot = new URL("../apps/web/public/templates/parda/", import.meta.url);
const corePath = new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url);

test("Parda renders localized preview wishes through its captured list hooks", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("parda");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];

  for (const locale of locales) {
    const data = makeLegacyData(sample, locale, "", true);
    assert.equal(data.wishesEnabled, true, `${locale}: wishes section is enabled`);
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.equal(data.wishes.length, 3, `${locale}: all preview wishes reach the frame payload`);
  }

  const html = readFileSync(new URL("index.html", pardaRoot), "utf8");
  const wishesSection = html.match(/<section class="section wishes"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(wishesSection, /data-section="wishes"/);
  assert.match(wishesSection, /<ul data-list="wishes"><template>/);
  assert.match(wishesSection, /<p data-field="text"><\/p>/);
  assert.match(wishesSection, /<b data-field="name"><\/b>/);

  const core = readFileSync(corePath, "utf8");
  assert.match(core, /name==='wishes'\?wishes/);
  assert.match(core, /hideIf\('wishes',data\.wishesEnabled===false\)/);
});

test("Parda public wishes accept the API's message field", () => {
  const core = readFileSync(corePath, "utf8");
  assert.match(
    core,
    /result\.wishes\.map\(wish=>\(\{\.\.\.wish,text:wish\.text\|\|wish\.message\|\|''\}\)\)/,
    "approved API wishes use `message`; the runtime maps it to Parda's `text` hook",
  );
});
