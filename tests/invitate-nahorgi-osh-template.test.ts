import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { TEMPLATES } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = process.cwd();
const pkg = path.join(root, "apps/web/public/templates/invitate-nahorgi-osh");
const read = (relative: string) => readFileSync(path.join(pkg, relative), "utf8");
const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => { module.exports = {}; };
const moduleRuntime = require("node:module") as { _resolveFilename: (...args: any[]) => string };
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/") ? path.resolve(webSourceRoot, request.slice(2)) : request;
  return resolveFilename.call(this, resolved, ...args);
};
const { makeNahorgiOshData } = require("../apps/web/src/templates/invitate/nahorgi-osh-adapter") as typeof import("../apps/web/src/templates/invitate/nahorgi-osh-adapter");

test("Invitate Nahorgi Osh package is distinct from Peshtoq and local-only", () => {
  const html = read("index.html");
  assert.match(html, /data-field="people"/);
  assert.match(html, /nahorgi-osh-adapter\.js/);
  assert.match(html, /nahorgi-osh-fonts\.css/);
  assert.match(html, /assets\/images\/palov\.png/);
  assert.doesNotMatch(html, /stats\.tolipov|fonts\.googleapis|Kamoliddin|Madinaxon|Abror Iskandarovlar|Bahor to'yxona|998944485398/);
  for (const relative of [
    "assets/css/nahorgi-osh.css",
    "assets/css/nahorgi-osh-fonts.css",
    "assets/js/nahorgi-osh-adapter.js",
    "assets/images/palov.png",
    "preview.png",
  ]) assert.ok(existsSync(path.join(pkg, relative)), `${relative} exists`);
  const provenance = JSON.parse(read("source-provenance.json"));
  assert.equal(provenance.page, "https://invitate.uz/nahorgi-osh.html");
  assert.equal(provenance.manifestFile, "Web invitations/invitate.uz/nahorgi-osh.html");
});

test("Nahorgi Osh renderer maps the shared fixture and four locales", () => {
  const fixture = createTemplatePreviewSample("invitate-nahorgi-osh");
  assert.equal(fixture.eventType, "osh");
  assert.equal(fixture.startsAt, "2027-06-12T07:00");
  const adapter = readFileSync(path.join(root, "apps/web/src/templates/invitate/nahorgi-osh-adapter.ts"), "utf8");
  const renderer = readFileSync(path.join(root, "apps/web/src/templates/invitate/renderer.tsx"), "utf8");
  const registry = readFileSync(path.join(root, "apps/web/src/templates/invitate/index.ts"), "utf8");
  const runtime = read("assets/js/nahorgi-osh-adapter.js");
  assert.match(renderer, /makeNahorgiOshData/);
  assert.match(registry, /invitate-nahorgi-osh/);
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"]) {
    assert.ok(runtime.includes(locale));
    assert.ok(adapter.includes(locale));
    const mapped = makeNahorgiOshData(fixture, locale, "Aziz mehmon", "guest-token", fixture.id, true, true);
    assert.equal(mapped.locale, locale === "uz-Latn" ? "uz" : locale);
    assert.equal(mapped.guestName, "Aziz mehmon");
    assert.deepEqual(mapped.people, fixture.content[locale].people);
    assert.equal(mapped.message, fixture.content[locale].message);
    assert.equal(mapped.venue.name, fixture.content[locale].venueName);
    assert.equal(mapped.date.time, "07:00");
    assert.equal(mapped.apiBase, `/api/public/invitations/${encodeURIComponent(fixture.id)}`);
  }
  for (const field of ["people", "greeting", "message", "hosts", "date", "venue", "contacts", "rsvp"])
    assert.match(adapter, new RegExp(`${field}`));
  assert.match(runtime, /\$\{data\.apiBase\}\/rsvp/);
  assert.match(read("assets/css/nahorgi-osh.css"), /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(runtime, /simulate|mock|rsvpSent\.style\.display\s*=\s*["']block["'][\s\S]*?preview/);
});

test("Nahorgi Osh font paths are local and complete", () => {
  const css = read("assets/css/nahorgi-osh-fonts.css");
  assert.doesNotMatch(css, /https?:\/\//);
  const files = [...css.matchAll(/url\(\.\.\/fonts\/([^\)]+)\)/g)].map((match) => match[1]);
  assert.ok(files.length > 0);
  for (const file of files) assert.ok(existsSync(path.join(pkg, "assets/fonts", file)), `${file} exists`);
});

test("Invitate Nahorgi Osh is published with osh support and portrait artwork", () => {
  const template = TEMPLATES.find((item) => item.id === "invitate-nahorgi-osh");
  assert.ok(template);
  assert.deepEqual(template.categoryIds, ["osh"]);
  assert.deepEqual(template.supportedEventTypes, ["osh"]);
  assert.equal(template.previewEventType, "osh");
  assert.equal(template.published, true);
  assert.equal(template.previewImage, "/templates/invitate-nahorgi-osh/preview.png");
  assert.notEqual(template.id, "nahorgi-osh");
  const provenance = JSON.parse(read("source-provenance.json"));
  assert.equal(provenance.catalogArtwork.status, "complete");
  const cover = readFileSync(path.join(pkg, "preview.png"));
  assert.deepEqual([cover.readUInt32BE(16), cover.readUInt32BE(20)], [780, 1688]);
  assert.equal(createHash("sha256").update(cover).digest("hex"), provenance.catalogArtwork.sha256);
  const migration = readFileSync(path.join(root, "packages/database/migrations/0131_register_invitate_nahorgi_osh_template.sql"), "utf8");
  assert.match(migration, /VALUES \('invitate-nahorgi-osh', 'osh'\)/);
  assert.match(migration, /'Invitate Nahorgi Osh', 15000000, 'UZS', false/);
  const publication = readFileSync(path.join(root, "packages/database/migrations/0134_publish_invitate_nahorgi_osh_template.sql"), "utf8");
  assert.match(publication, /SET published = true/);
});
