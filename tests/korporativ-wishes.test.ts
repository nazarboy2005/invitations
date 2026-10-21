import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { createInvitation } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = process.cwd();
const templateRoot = path.join(root, "apps/web/public/templates/korporativ");
const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => { module.exports = {}; };
const moduleRuntime = require("node:module") as { _resolveFilename: (...args: any[]) => string };
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = path.resolve(root, "apps/web/src");
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/") ? path.resolve(webSourceRoot, request.slice(2)) : request;
  return resolveFilename.call(this, resolved, ...args);
};

test("Korporativ keeps wishes source visible and binds only preview fixture wishes", async () => {
  const html = readFileSync(path.join(templateRoot, "index.html"), "utf8");
  const adapterCss = readFileSync(
    path.join(templateRoot, "contract-adapter.css"),
    "utf8",
  );
  const templateCss = readFileSync(path.join(templateRoot, "template.css"), "utf8");

  assert.match(
    html,
    /<section class="section section--wishes" id="wishes" data-section="wishes">[\s\S]*?<ul class="wishes" data-list="wishes">[\s\S]*?<form class="wish-form" data-wishes-form>/,
  );
  assert.doesNotMatch(adapterCss, /(?:section--wishes|data-wishes-form|data-list="wishes")[^{]*\{[^}]*display\s*:\s*none/i);
  assert.match(templateCss, /\.section--wishes\s+\.wishes\s*\{/);
  assert.match(templateCss, /\.wishes__item\s*\{/);

  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("korporativ");
  const preview = makeLegacyData(sample, "uz-Latn", "", true);
  assert.equal(preview.wishesEnabled, true);
  assert.equal(preview.wishes.length, 3);
  assert.ok(preview.wishes.every(({ name, text }) => name && text));

  const authored = createInvitation("korporativ");
  authored.wishes.enabled = false;
  const publicData = makeLegacyData(authored, "uz-Latn", "", false);
  assert.equal(publicData.wishesEnabled, false);
  assert.deepEqual(publicData.wishes, []);
});
