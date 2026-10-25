import assert from "node:assert/strict";
import test from "node:test";
import { TEMPLATES } from "@taklifnoma/contracts";
import { selectFeaturedTemplates } from "../apps/web/src/modules/catalog/featured-templates";

test("homepage features eight published designs across different occasions", () => {
  const templates = TEMPLATES.map((template) => ({
    ...template,
    published: true,
  }));
  const selected = selectFeaturedTemplates(templates);
  assert.equal(selected.length, 8);
  assert.equal(new Set(selected.map((template) => template.id)).size, 8);
  assert.equal(selected[0].id, "anor");
  assert.ok(
    new Set(selected.flatMap((template) => template.categoryIds)).size >= 4,
  );
});

test("unpublished featured designs stay hidden and other published designs fill the selection", () => {
  const templates = TEMPLATES.map((template) => ({
    ...template,
    published: template.id !== "anor",
  }));
  const selected = selectFeaturedTemplates(templates);
  assert.equal(selected.length, 8);
  assert.ok(
    selected.every((template) => template.published && template.id !== "anor"),
  );
});

test("a small or empty catalog is shown honestly without duplicates or invented entries", () => {
  assert.deepEqual(selectFeaturedTemplates([]), []);
  const one = { ...TEMPLATES[0], published: true };
  assert.deepEqual(selectFeaturedTemplates([one, one]), [one]);
});
