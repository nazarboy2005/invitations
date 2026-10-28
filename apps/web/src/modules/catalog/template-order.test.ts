import assert from "node:assert/strict";
import test from "node:test";
import { EVENT_TYPES, TEMPLATES } from "@taklifnoma/contracts";
import { orderEventTemplates } from "./template-order";

test("studio choices contain exactly the published designs compatible with each event", () => {
  for (const eventType of EVENT_TYPES) {
    const input = TEMPLATES.map((template, index) => ({
      ...template,
      published: index % 3 !== 0,
    }));
    const expected = input.filter(
      (template) =>
        template.published && template.supportedEventTypes.includes(eventType),
    );
    const result = orderEventTemplates(input, eventType);
    assert.deepEqual(
      new Set(result.map((template) => template.id)),
      new Set(expected.map((template) => template.id)),
      eventType,
    );
    assert.equal(result.length, expected.length, "no duplicate choices");
  }
});

test("studio Nikoh choices retain the full curated ranking before other compatible categories", () => {
  const input = TEMPLATES.map((template) => ({
    ...template,
    published: true,
  })).reverse();
  const originalIds = input.map((template) => template.id);
  const result = orderEventTemplates(input, "wedding");
  assert.deepEqual(
    result.slice(0, 11).map((template) => template.id),
    [
      "anor",
      "cloud-castle",
      "bogi-eram",
      "ganch",
      "green-garden",
      "kuzgi-chinor",
      "muhr",
      "orik-guli",
      "samarqand-kechasi",
      "evelina",
      "kozgu",
    ],
  );
  assert.deepEqual(
    input.map((template) => template.id),
    originalIds,
  );
  assert.deepEqual(
    orderEventTemplates(input, "wedding"),
    result,
    "order is stable",
  );
});
