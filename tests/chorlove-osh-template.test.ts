import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { TEMPLATES } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = process.cwd();
const packageRoot = path.join(root, "apps/web/public/templates/chorlove/osh");
const readPackage = (file: string) =>
  readFileSync(path.join(packageRoot, file), "utf8");
const chorloveRenderer = readFileSync(
  path.join(root, "apps/web/src/templates/chorlove/renderer.tsx"),
  "utf8",
);
test("Chorlove Osh package retains source sections and omits guest headcount", () => {
  const html = readPackage("index.html");
  const bridge = readPackage("bridge.js");
  const css = readPackage("osh.css");

  assert.doesNotMatch(html, /osh-count|osh-stepper|How many people/);
  assert.match(html, /<pattern id="osh-suzani"/);
  assert.doesNotMatch(bridge, /osh-count|osh-stepper|How many people|Fewer people|More people/);
  assert.doesNotMatch(css, /\.osh-count|\.osh-stepper/);
  assert.match(bridge, /partySize:\s*answer === "yes" \? 1 : 0/);

  for (const section of ["osh-hero", "osh-intro", "osh-when", "osh-photo", "osh-venue", "osh-rsvp", "osh-footer"]) {
    assert.match(html, new RegExp(`class=["']${section}["']`), `${section} remains in the source composition`);
  }
  assert.doesNotMatch(html, /data-section=["']toyona|osh-toyona|gift-card/i);
  assert.match(bridge, /instagram = contacts\.find\(\(c\) => c\.type === "instagram"\)/);
});

test("Chorlove Osh does not inject To'yana UI absent from its captured source", () => {
  const html = readPackage("index.html");
  const bridge = readPackage("bridge.js");

  // The captured Osh component has no gift/bank-card section. Keep both the
  // isolated package and shared renderer free of a platform-injected variant.
  assert.doesNotMatch(html, /to['’]?y?ona|sovg['’]?a|gift\s*card|bank\s*card|card\s*number/i);
  assert.doesNotMatch(bridge, /to['’]?y?ona|sovg['’]?a|giftCard|gift-card|bankCard/i);
  assert.match(chorloveRenderer, /templateId !== "osh" && templateId !== "palov"/);
});

test("Chorlove Osh is a distinct published Osh template", () => {
  const osh = TEMPLATES.find((template) => template.id === "osh");
  assert.ok(osh);
  assert.deepEqual(osh.categoryIds, ["osh"]);
  assert.deepEqual(osh.supportedEventTypes, ["osh"]);
  assert.equal(osh.previewImage, "/templates/chorlove/osh/preview.jpg");
  assert.equal(osh.published, true);
  assert.notEqual(osh.id, "palov");
  assert.notEqual(osh.id, "invitate-palov");
});

test("Chorlove Osh uses its namespaced source renderer without platform extras", () => {
  assert.match(chorloveRenderer, /templateId !== "osh"/);
  assert.match(chorloveRenderer, /templateId === "osh"/);
  assert.match(chorloveRenderer, /`\/templates\/chorlove\/\$\{templateId\}\/index\.html\?\$\{query\}`/);
});

test("Osh preview keeps its source-owned Palov art without sample gallery or story photos", () => {
  const sample = createTemplatePreviewSample("osh");
  const html = readPackage("index.html");
  const bridge = readPackage("bridge.js");

  assert.ok(sample.gallery.every((photo) => !photo.url.trim()));
  assert.equal(sample.story.length, 0);
  assert.match(html, /class=["']osh-photo["']/);
  assert.match(bridge, /image\.src = "\/templates\/chorlove\/osh\/palov\.png"/);
});
