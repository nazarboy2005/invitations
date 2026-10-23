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

const templateRoot = new URL("../apps/web/public/templates/anor/source/", import.meta.url);
const bridgePath = new URL("bridge.js", templateRoot);
const route = readFileSync(
  new URL("../apps/web/src/app/api/public/invitations/[id]/wishes/route.ts", import.meta.url),
  "utf8",
);

test("Anor React adapter adds sample wishes only in preview and recomputes when preview state changes", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const invitation = createTemplatePreviewSample("anor");

  for (const locale of invitation.enabledLocales as Locale[]) {
    const preview = makeLegacyData(invitation, locale, "", true);
    assert.equal(preview.wishesEnabled, true, `${locale}: sample wishes section is enabled`);
    assert.deepEqual(preview.wishes, getTemplatePreviewWishes(locale));

    const creatorOrPublic = makeLegacyData(invitation, locale, "", false);
    assert.deepEqual(creatorOrPublic.wishes, [], `${locale}: fixture wishes stay out of real invitation data`);
  }

  const renderer = readFileSync(new URL("../apps/web/src/templates/anor/renderer.tsx", import.meta.url), "utf8");
  assert.match(renderer, /makeLegacyData\(invitation, frameLocale, guestName, sampleWishes\)/);
  assert.match(renderer, /\[invitation, frameLocale, guestName, preview, sampleWishes\]/);
  assert.match(renderer, /preview && sampleWishes && !hasCreatorPhotos/);
  assert.match(renderer, /\/templates\/anor\/source\/art\/\$\{file\}/);
});

test("Anor wishes section and list hooks match its public API bridge", () => {
  const html = readFileSync(new URL("index.html", templateRoot), "utf8");
  const wishesSection = html.match(/<section[^>]*data-section="wishes"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(wishesSection, "captured wishes section is addressable by the bridge");
  assert.match(wishesSection, /data-list="wishes"/);
  assert.match(wishesSection, /data-field="text"/);
  assert.match(wishesSection, /data-field="name"/);
  assert.match(wishesSection, /data-wishes-form/);

  const bridge = readFileSync(bridgePath, "utf8");
  assert.match(bridge, /\$\(`\[data-section="\$\{name\}"\]`\)/);
  assert.match(bridge, /wishes:\s*data\.wishesEnabled/);
  assert.match(bridge, /\$\$\(`\[data-list="\$\{name\}"\]`\)/);
  assert.match(bridge, /renderList\("wishes",\s*data\.wishes\s*\|\|\s*\[\]\)/);
  assert.match(bridge, /wish\.message\s*\}\)\);\s*renderList\("wishes",\s*data\.wishes\)/);
});

test("Anor public wishes show only approved rows and submit pending rows", () => {
  assert.match(route, /if\s*\(!invitation\.wishes\.enabled\)/);
  assert.match(route, /status='approved'\s+AND\s+deleted_at\s+IS\s+NULL/);
  assert.match(route, /SELECT id,name,message,created_at AS "submittedAt"/);
  assert.match(route, /'pending'\) RETURNING id/);

  const bridge = readFileSync(bridgePath, "utf8");
  assert.match(bridge, /\/api\/public\/invitations\/\$\{encodeURIComponent\(config\.invitationId\)\}\/wishes/);
  assert.match(bridge, /message:\s*String\(form\.get\("text"\)\s*\|\|\s*""\)\.trim\(\)/);
});
