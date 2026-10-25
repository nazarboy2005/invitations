import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
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

const root = new URL("../apps/web/public/templates/monogram/", import.meta.url);

test("Monogram maps the shared four-locale sample into all supported contract sections", () => {
  const { makeLegacyData } = require("../apps/web/src/templates/anor/renderer") as typeof import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("monogram");
  assert.equal(sample.eventType, "wedding");
  assert.equal(sample.program.length, 6);
  assert.equal(sample.gallery.length, 6);

  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const satisfies readonly Locale[]) {
    const content = sample.content[locale];
    const mapped = makeLegacyData(sample, locale, "", true);
    assert.deepEqual([mapped.groom, mapped.bride], content.people);
    assert.equal(mapped.greeting, content.greeting);
    assert.equal(mapped.message, content.message);
    assert.equal(mapped.hosts, content.hosts);
    assert.equal(mapped.venue.name, content.venueName);
    assert.equal(mapped.program.length, 6);
    assert.ok(mapped.program.every((item) => item.time && item.title));
    assert.equal(mapped.dressCode.enabled, true);
    assert.equal(mapped.dressCode.style, sample.dressCode.style[locale]);
    assert.equal(mapped.dressCode.text, sample.dressCode.text[locale]);
    assert.equal(mapped.dressCode.note, sample.dressCode.note[locale]);
    assert.equal(mapped.dressCode.colors.length, 5);
    assert.ok(mapped.dressCode.colors.every((color) => color.name));
    assert.deepEqual(mapped.wishes, getTemplatePreviewWishes(locale));
    assert.deepEqual(mapped.contacts.map(({ type }) => type), ["phone", "telegram"]);
    assert.equal(mapped.toyona.enabled, true);
    assert.equal(mapped.toyona.cardNumber, sample.gift.cardNumber);
    assert.equal(mapped.toyona.cardHolder, sample.gift.cardHolder);
    assert.equal(mapped.toyona.note, "");
    assert.equal(mapped.gallery.length, 6);
    assert.ok(mapped.gallery.every((item) => !item.src && !item.alt && !item.caption));
  }
});

test("Monogram blank drafts receive no fixture names, date, program, gallery, wishes, gifts, or contacts", () => {
  const { makeLegacyData } = require("../apps/web/src/templates/anor/renderer") as typeof import("../apps/web/src/templates/anor/renderer");
  const blank = makeLegacyData(createInvitation("monogram"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.dateTime, "");
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.equal(blank.wishes.length, 0);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.toyona.cardNumber, "");
  assert.equal(blank.contacts.length, 0);
  assert.equal(blank.dressCode.enabled, false);
});

test("Monogram preview provenance records its checksum-backed source opening", () => {
  const preview = readFileSync(new URL("preview.webp", root));
  const fixture = Buffer.from(
    readFileSync(new URL("./fixtures/catalog-preview-2026-10-23.json", import.meta.url), "utf8").replace(/\r\n/g, "\n"),
  );
  const provenance = JSON.parse(readFileSync(new URL("preview.provenance.json", root), "utf8")) as {
    artifact: string; sha256: string; format: string; width: number; height: number;
    sourceCapture: string; renderedFrom: string; route: string; fixture: string; fixtureSha256: string;
    locale: string; viewport: { width: number; height: number; deviceScaleFactor: number };
  };
  const digest = (value: Buffer) => createHash("sha256").update(value).digest("hex");
  assert.equal(provenance.artifact, "preview.webp");
  assert.equal(provenance.sha256, digest(preview));
  assert.equal(provenance.format, "image/webp");
  assert.deepEqual([provenance.width, provenance.height], [720, 1200]);
  assert.match(provenance.sourceCapture, /Marxaba\/Nikoh\/templates\/monogram$/);
  assert.match(provenance.renderedFrom, /captured opening screen/);
  assert.equal(provenance.route, "/preview?template=monogram&qaSilent=1");
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.equal(provenance.fixtureSha256, digest(fixture));
  assert.equal(provenance.locale, "uz-Latn");
  assert.deepEqual(provenance.viewport, { width: 720, height: 1200, deviceScaleFactor: 1 });
  assert.ok(existsSync(new URL("preview.webp", root)));
});
