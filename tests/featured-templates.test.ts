import assert from "node:assert/strict";
import test from "node:test";
import { TEMPLATES } from "@taklifnoma/contracts";
import { selectFeaturedTemplates } from "../apps/web/src/modules/catalog/featured-templates";

const requested = [
  "anor",
  "bogi-eram",
  "cloud-castle",
  "ganch",
  "kuzgi-chinor",
  "nahor",
  "yangi-uy",
  "shirin-bayram",
];

test("homepage features exactly the owner's eight designs in the requested order", () => {
  const templates = TEMPLATES.map((template) => ({
    ...template,
    published: true,
  }));
  const selected = selectFeaturedTemplates(templates);
  assert.equal(selected.length, 8);
  assert.equal(new Set(selected.map((template) => template.id)).size, 8);
  assert.deepEqual(
    selected.map((template) => template.id),
    requested,
  );
});

test("unpublished featured designs stay hidden without unwanted substitutions", () => {
  const templates = TEMPLATES.map((template) => ({
    ...template,
    published: template.id !== "anor",
  }));
  const selected = selectFeaturedTemplates(templates);
  assert.deepEqual(
    selected.map((template) => template.id),
    requested.slice(1),
  );
  assert.ok(
    selected.every((template) => template.published && template.id !== "anor"),
  );
});

test("a small or empty catalog is shown honestly without duplicates or invented entries", () => {
  assert.deepEqual(selectFeaturedTemplates([]), []);
  const one = {
    ...TEMPLATES.find((template) => template.id === "anor")!,
    published: true,
  };
  assert.deepEqual(selectFeaturedTemplates([one, one]), [one]);
});
