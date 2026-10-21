import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
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

test("Qandil catalog cover matches its source opening provenance", () => {
  const templateRoot = new URL("../apps/web/public/templates/qandil/", import.meta.url);
  const preview = readFileSync(new URL("preview.webp", templateRoot));
  const provenance = JSON.parse(readFileSync(new URL("preview.provenance.json", templateRoot), "utf8")) as {
    artifactSha256: string;
    renderedFrom: string;
    referenceCapture: string;
    viewport: { width: number; height: number; deviceScaleFactor: number };
  };

  assert.equal(provenance.renderedFrom, "Original Qandil source index.html, initial #intro opening state rendered at 478x955 and resized to 300x600");
  assert.equal(provenance.referenceCapture, "Original source template rendered directly from index.html; no user-provided screenshot used");
  assert.deepEqual(provenance.viewport, { width: 478, height: 955, deviceScaleFactor: 1 });
  assert.equal(createHash("sha256").update(preview).digest("hex"), provenance.artifactSha256);
});

test("Qandil renderer maps the shared fixture's complete sections in all supported locales", () => {
  const { makeLegacyData } = require("../apps/web/src/templates/anor/renderer") as typeof import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("qandil");
  assert.equal(sample.eventType, "wedding");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];

  for (const locale of locales) {
    const content = sample.content[locale];
    const mapped = makeLegacyData(sample, locale, "", true);
    assert.deepEqual([mapped.groom, mapped.bride], content.people);
    assert.equal(mapped.greeting, content.greeting);
    assert.equal(mapped.message, content.message);
    assert.equal(mapped.hosts, content.hosts);
    assert.equal(mapped.venue.name, content.venueName);
    assert.ok(mapped.programHeading);
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

test("Qandil blank drafts keep sample names, repeatable sections, wishes, and payment/contact data out", () => {
  const { makeLegacyData } = require("../apps/web/src/templates/anor/renderer") as typeof import("../apps/web/src/templates/anor/renderer");
  const mapped = makeLegacyData(createInvitation("qandil"), "uz-Latn", "", false);
  assert.equal(mapped.groom, "");
  assert.equal(mapped.bride, "");
  assert.equal(mapped.dateTime, "");
  assert.equal(mapped.program.length, 0);
  assert.equal(mapped.gallery.length, 0);
  assert.equal(mapped.wishes.length, 0);
  assert.equal(mapped.toyona.enabled, false);
  assert.equal(mapped.toyona.cardNumber, "");
  assert.equal(mapped.contacts.length, 0);
  assert.equal(mapped.dressCode.enabled, false);
});
