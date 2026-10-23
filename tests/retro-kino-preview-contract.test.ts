import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createInvitation, type Locale } from "@taklifnoma/contracts";
import { createTemplatePreviewSample, getTemplatePreviewWishes } from "../apps/web/src/modules/catalog/preview-sample";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => { module.exports = {}; };
const moduleRuntime = require("node:module") as { _resolveFilename: (...args: any[]) => string };
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/") ? path.resolve(webSourceRoot, request.slice(2)) : request;
  return resolveFilename.call(this, resolved, ...args);
};

const root = new URL("../apps/web/public/templates/retro-kino/", import.meta.url);
const source = readFileSync(new URL("index.html", root), "utf8");

test("Retro Kino sample maps clothing, program, wishes, To‘yona, contacts, and gallery in every locale", () => {
  const { makeLegacyData } = require("../apps/web/src/templates/anor/renderer") as typeof import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("retro-kino");
  assert.equal(sample.eventType, "wedding");
  assert.equal(sample.program.length, 6);
  assert.equal(sample.gallery.length, 6);

  const labels: Record<Locale, string> = {
    "uz-Latn": "Nikoh to‘yi",
    "uz-Cyrl": "Никоҳ тўйи",
    en: "Wedding celebration",
    ru: "Свадебное торжество",
  };
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
    const content = sample.content[locale];
    assert.equal(content.eventLabel, labels[locale]);
    assert.equal(content.people.length, 2);
    assert.ok(content.message && content.hosts && content.venueName && content.address);
    assert.ok(sample.program.every((item) => content.programTitles[item.id]));
    assert.ok(sample.dressCode.style[locale] && sample.dressCode.text[locale] && sample.dressCode.note[locale]);
    assert.ok(sample.dressCode.colors.every((color) => color.name[locale]));

    const mapped = makeLegacyData(sample, locale, "", true);
    assert.equal(mapped.groom, content.people[0]);
    assert.equal(mapped.bride, content.people[1]);
    assert.equal(mapped.program.length, 6);
    assert.ok(mapped.program.every((item) => item.time && item.title));
    assert.equal(mapped.dressCode.colors.length, 5);
    assert.equal(mapped.dressCode.style, sample.dressCode.style[locale]);
    assert.equal(mapped.dressCode.text, sample.dressCode.text[locale]);
    assert.equal(mapped.dressCode.note, sample.dressCode.note[locale]);
    assert.deepEqual(mapped.wishes, getTemplatePreviewWishes(locale));
    assert.deepEqual(mapped.contacts.map((item) => item.type), ["phone", "telegram"]);
    assert.equal(mapped.toyona.enabled, true);
    assert.equal(mapped.toyona.cardNumber, sample.gift.cardNumber);
    assert.equal(mapped.toyona.cardHolder, sample.gift.cardHolder);
    assert.equal(mapped.gallery.length, 6);
    assert.ok(mapped.gallery.every((item) => item.src === "" && item.alt === ""));
  }
});

test("Retro Kino blank invitations do not inherit preview sample content", () => {
  const { makeLegacyData } = require("../apps/web/src/templates/anor/renderer") as typeof import("../apps/web/src/templates/anor/renderer");
  const blank = makeLegacyData(createInvitation("retro-kino"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.dateTime, "");
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.equal(blank.wishes.length, 0);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.contacts.length, 0);
});

test("Retro Kino hides empty galleries and collapses unsupported empty fields", () => {
  const adapter = readFileSync(new URL("contract-adapter.css", root), "utf8");
  assert.match(source, /href="contract-adapter\.css"/);
  assert.match(adapter, /\.venue__photo\.has-missing-photo\s*\{\s*display:\s*none/);
  for (const slot of ["toyona.note", "toyona.bank", "toyona.cardHolder"])
    assert.ok(adapter.includes(`[data-slot="${slot}"]:empty`), `${slot} empty state is collapsed`);
  const core = readFileSync(new URL("../shared/nikoh/core.js", root), "utf8");
  const sharedStyles = readFileSync(new URL("../shared/nikoh/base.css", root), "utf8");
  assert.match(core, /placeholder\.textContent='✦'/);
  assert.match(core, /hideIf\('gallery',!\(Array\.isArray\(data\.gallery\)&&data\.gallery\.some\(item=>plain\(item\)&&typeof item\.src==='string'&&item\.src\.trim\(\)\)\)\)/);
  assert.match(sharedStyles, /\.photo-placeholder\{/);
  assert.match(source, /data-slot="toyona\.note"/);
  assert.match(source, /data-slot="toyona\.bank"/);
});

test("Retro Kino catalog artwork is a portrait capture of the packaged opening", () => {
  const preview = readFileSync(new URL("preview.webp", root));
  const html = readFileSync(new URL("index.html", root), "utf8");
  const templateCss = readFileSync(new URL("template.css", root), "utf8");
  const templateJs = readFileSync(new URL("template.js", root), "utf8");
  const provenance = JSON.parse(readFileSync(new URL("preview.provenance.json", root), "utf8")) as {
    artifact: string; sha256: string; format: string; width: number; height: number;
    source: string; sourceCapture: string; fixture: string; fixtureSha256: string;
    rendererSha256: string; capturedSelector: string; excluded: string[];
  };
  const dimensions = readFileSync(new URL("preview.webp", root)).subarray(0, 30);
  assert.equal(dimensions.toString("ascii", 0, 4), "RIFF");
  assert.equal(dimensions.toString("ascii", 8, 12), "WEBP");
  assert.notEqual(createHash("sha256").update(preview).digest("hex"), createHash("sha256").update(readFileSync(new URL("art/poster.webp", root))).digest("hex"));
  assert.equal(provenance.artifact, "preview.webp");
  assert.equal(provenance.sha256, createHash("sha256").update(preview).digest("hex"));
  assert.equal(provenance.format, "image/webp");
  assert.ok(provenance.width > 0 && provenance.height > provenance.width);
  assert.equal(provenance.source, "index.html #intro via packaged preview renderer");
  assert.match(provenance.sourceCapture, /Marxaba\/Nikoh\/templates\/retro-kino$/);
  assert.equal(provenance.capturedSelector, "#intro");
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.match(provenance.fixtureSha256, /^[a-f0-9]{64}$/);
  assert.match(provenance.rendererSha256, /^[a-f0-9]{64}$/);
  assert.ok(provenance.excluded.includes("preview language controls"));
  assert.match(html, /<section class="intro" id="intro"/);
  assert.match(html, /data-slot="groom"/);
  assert.match(html, /data-slot="bride"/);
  assert.match(html, /data-slot="date\.long"/);
  assert.match(html, /id="open-invitation"/);
  assert.match(templateCss, /\.intro\{/);
  assert.match(templateJs, /introTitle\(\)/);
  assert.ok(existsSync(new URL("art/poster.webp", root)));
});
