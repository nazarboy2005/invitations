import { readFileSync } from "./helpers/source-files";
import { TEMPLATES } from "../packages/contracts/src/index";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const template = path.join(root, "apps/web/public/templates/invitate-palov");
const read = (relative: string) => readFileSync(path.join(template, relative), "utf8");

test("Palov package preserves the source opening and loads only local source assets", () => {
  const html = read("index.html");
  assert.match(html, /class="arch"/);
  assert.match(html, /id="girihArch"/);
  assert.match(html, /id="girihTicket"/);
  assert.match(html, /id="girihRsvp"/);
  assert.match(html, /palov-adapter\.js/);
  assert.match(html, /palov-fonts\.css/);
  assert.doesNotMatch(html, /stats\.tolipov|fonts\.googleapis|Karimovlar oilasi|15 Sentabr|998000000000/);
  assert.doesNotMatch(html, /\[Ism\]|Sizni farzandimiz/);
  assert.match(html, /\.map-btn\[hidden\][\s\S]*display:\s*none\s*!important/);
  for (const relative of [
    "assets/css/palov-fonts.css",
    "assets/js/palov-adapter.js",
    "assets/images/palov.png",
  ]) assert.ok(existsSync(path.join(template, relative)), `${relative} exists`);
});

test("Palov does not add a To'yana or gift-card section absent from its Invitate source", () => {
  const source = readFileSync(
    path.join(
      root,
      "Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Invitate/Web invitations/invitate.uz/palov.html",
    ),
    "utf8",
  );
  const packageHtml = read("index.html");
  const adapter = read("assets/js/palov-adapter.js");
  const giftUi = /to[’']?yona|sovg[’']?a|gift\s*card|bank\s*card|card\s*number|karta\s*(?:raqami|number)/i;

  assert.doesNotMatch(source, giftUi, "authoritative source contains no gift-card UI");
  assert.doesNotMatch(packageHtml, giftUi, "adapted page contains no source-unsupported gift UI");
  assert.doesNotMatch(adapter, giftUi, "adapter adds no gift-card field or control");
});

test("Palov adapter maps all approved locales and uses live invitation APIs", () => {
  const adapter = read("assets/js/palov-adapter.js");
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"]) assert.ok(adapter.includes(`"${locale}"`));
  assert.match(adapter, /payload\.hosts/);
  assert.match(adapter, /payload\.venue\?\.name/);
  assert.match(adapter, /data\.dateTime/);
  assert.match(adapter, /payload\.gallery/);
  assert.match(adapter, /payload\.music/);
  assert.match(adapter, /syncRsvpState\(\)/);
  assert.match(adapter, /document\.addEventListener\("input"/);
  assert.match(adapter, /\$\{data\.apiBase\}\/rsvp/);
  assert.match(read("index.html"), /prefers-reduced-motion: reduce/); // retained from the source page
  assert.doesNotMatch(adapter, /state\.sent = true|simulate|mock/i);
});

test("Palov local font stylesheet has no remote font requests", () => {
  const css = read("assets/css/palov-fonts.css");
  assert.doesNotMatch(css, /https?:\/\//);
  const capturedFontCss = readFileSync(path.join(root, "Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Invitate/Web invitations/fonts.googleapis.com/css2__8254095ff41b2a53"), "utf8");
  const normalizedCapturedCss = capturedFontCss.replace(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g, (_match, url: string) => {
    const filename = path.basename(new URL(url).pathname);
    assert.ok(existsSync(path.join(template, "assets/fonts", filename)), `${filename} is packaged`);
    return `url(../fonts/${filename})`;
  });
  assert.equal(css, normalizedCapturedCss, "the captured font CSS is preserved with only font URLs rewritten locally");
  const files = [...css.matchAll(/url\(\"?\.\.\/fonts\/([^\)\"']+)/g)].map((match) => match[1]);
  assert.ok(files.length > 0);
  for (const file of files) assert.ok(existsSync(path.join(template, "assets/fonts", file)), `${file} exists`);
});

test("Invitate Palov registration publishes only for morning osh compatibility", () => {
  const template = TEMPLATES.find((item) => item.id === "invitate-palov");
  assert.ok(template);
  assert.deepEqual(template.categoryIds, ["osh"]);
  assert.deepEqual(template.supportedEventTypes, ["osh"]);
  assert.equal(template.published, false, "runtime catalog publication comes from the database");
  assert.equal(template.previewImage, "/templates/invitate-palov/preview.png");
  assert.ok(existsSync(path.join(root, "apps/web/public/templates/invitate-palov/preview.png")));
  assert.match(read("source-provenance.json"), /"dimensions": "480x860"/);
  assert.match(readFileSync(path.join(root, "packages/database/migrations/0122_register_invitate_palov.sql"), "utf8"), /VALUES \('invitate-palov', 'osh'\)/);
  assert.match(readFileSync(path.join(root, "packages/database/migrations/0132_publish_invitate_palov.sql"), "utf8"), /SET published = true/);
});

test("Palov is wired through the shared catalog preview and public invitation renderer", () => {
  const invitateEntry = readFileSync(path.join(root, "apps/web/src/templates/invitate/registry.ts"), "utf8");
  const catalogPreview = readFileSync(path.join(root, "apps/web/src/modules/catalog/full-template-preview.tsx"), "utf8");
  const publicPage = readFileSync(path.join(root, "apps/web/src/app/i/[slug]/page.tsx"), "utf8");
  assert.match(invitateEntry, /"invitate-palov"/);
  assert.match(catalogPreview, /isInvitateTemplate\(template\.id\)[\s\S]*?InvitateInvitation/);
  assert.match(publicPage, /isInvitateTemplate\(invitation\.templateId\)[\s\S]*?InvitateInvitation/);
});
