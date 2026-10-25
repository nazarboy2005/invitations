import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { TEMPLATES } from "../packages/contracts/src/index";

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
  assert.doesNotMatch(bridge, /osh-count|osh-stepper|How many people|Fewer people|More people/);
  assert.doesNotMatch(css, /\.osh-count|\.osh-stepper/);
  assert.match(bridge, /partySize:\s*answer === "yes" \? 1 : 0/);

  for (const section of ["osh-hero", "osh-intro", "osh-when", "osh-photo", "osh-venue", "osh-rsvp", "osh-footer"]) {
    assert.match(html, new RegExp(`class=["']${section}["']`), `${section} remains in the source composition`);
  }
  assert.doesNotMatch(html, /data-section=["']toyona|osh-toyona|gift-card/i);
  assert.match(bridge, /instagram = contacts\.find\(\(c\) => c\.type === "instagram"\)/);
});

test("Chorlove Osh remains a distinct unpublished Osh template", () => {
  const osh = TEMPLATES.find((template) => template.id === "osh");
  assert.ok(osh);
  assert.deepEqual(osh.categoryIds, ["osh"]);
  assert.deepEqual(osh.supportedEventTypes, ["osh"]);
  assert.equal(osh.published, false);
  assert.notEqual(osh.id, "palov");
  assert.notEqual(osh.id, "invitate-palov");
});

test("Chorlove Osh uses its namespaced source renderer without platform extras", () => {
  assert.match(chorloveRenderer, /templateId !== "osh"/);
  assert.match(chorloveRenderer, /templateId === "osh"/);
  assert.match(chorloveRenderer, /`\/templates\/chorlove\/\$\{templateId\}\/index\.html\?\$\{query\}`/);
});
