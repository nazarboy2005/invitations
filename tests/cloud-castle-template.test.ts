import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { templateById } from "@taklifnoma/contracts";

const source = new URL("../apps/web/public/templates/cloud-castle/index.html", import.meta.url);
const bridge = new URL("../apps/web/public/templates/cloud-castle/bridge.js", import.meta.url);
const preview = new URL("../apps/web/public/templates/cloud-castle/preview-opening.png", import.meta.url);
const provenance = new URL("../apps/web/public/templates/cloud-castle/source/provenance.json", import.meta.url);

test("Cloud Castle is published for weddings independently of category", () => {
  const template = templateById("cloud-castle");
  assert.equal(template?.published, true);
  assert.deepEqual(template?.categoryIds, ["wedding"]);
  assert.deepEqual(template?.supportedEventTypes, ["wedding"]);
  assert.equal(template?.previewImage, "/templates/cloud-castle/preview-opening.png");
});

test("Cloud Castle catalog artwork is a clean portrait capture with recorded provenance", async () => {
  const image = await readFile(preview);
  const details = JSON.parse(await readFile(provenance, "utf8"));
  assert.equal(details.catalogArtwork.sha256, createHash("sha256").update(image).digest("hex"));
  assert.equal(details.catalogArtwork.file, "../preview-opening.png");
  assert.equal(details.catalogArtwork.dimensions, "720x1280");
  assert.equal(details.catalogArtwork.aspectRatio, "9:16");
  assert.deepEqual(details.catalogArtwork.uiChromeRemoved, ["language selector", "music control", "browser scrollbar"]);
  assert.match(details.catalogArtwork.provenanceLimit, /no original component\/runtime handlers/);
});

test("Cloud Castle package contains only sanitized markup and no captured website runtime", async () => {
  const html = await readFile(source, "utf8");
  for (const capturedValue of ["Muhammad", "Xadicha", "Abdurahmonovlar", "Azizbek", "Madina", "chorlove.uz", "orchid-amplop", "Patrick Watson"]) {
    assert.equal(html.includes(capturedValue), false, `unexpected captured value: ${capturedValue}`);
  }
  assert.equal(/<script[^>]+src="\/_next\//.test(html), false);
  assert.equal(/<script[^>]+src="https?:/.test(html), false);
  assert.equal(/<iframe/i.test(html), false);
  assert.equal(/(?:src|href)="https?:/i.test(html), false);
  assert.match(html, /data-chorlove-template="cloud-castle"/);
  assert.match(html, /data-chorlove-story/);
  assert.match(html, /data-chorlove-i18n="openInvitation"/);
  assert.match(html, /data-chorlove-gallery-item/);
  assert.match(html, /data-chorlove-rsvp/);
});

test("Cloud Castle bridge maps the shared data and existing RSVP/wish services", async () => {
  const js = await readFile(bridge, "utf8");
  for (const field of ["groom", "bride", "eventType", "program", "gallery", "story", "toyona", "contacts"]) {
    assert.match(js, new RegExp(`data\\.${field}`));
  }
  assert.match(js, /\/wishes/);
  assert.match(js, /\/rsvp/);
  assert.match(js, /usableGallery/);
  assert.match(js, /musicToggleLabel/);
  assert.match(js, /languageLabel/);
  assert.match(js, /prefers-reduced-motion/);
});
