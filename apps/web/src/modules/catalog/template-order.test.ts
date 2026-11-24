import assert from "node:assert/strict";
import test from "node:test";
import { EVENT_TYPES, TEMPLATES } from "@taklifnoma/contracts";
import { orderCatalogTemplates, orderEventTemplates } from "./template-order";

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

test("studio choices put premium designs first and preserve curation within each price", () => {
  const input = TEMPLATES.map((template) => ({
    ...template,
    published: true,
  })).reverse();
  const originalIds = input.map((template) => template.id);
  const result = orderEventTemplates(input, "wedding");
  assert.deepEqual(
    result.slice(0, 13).map((template) => template.id),
    [
      "ganch",
      "baxmal-saroy",
      "osmon",
      "anor",
      "bulutlar-qasri",
      "bogi-eram",
      "yashil-makon",
      "kuzgi-chinor",
      "muhr",
      "orik-guli",
      "samarqand-kechasi",
      "baxt-kaliti",
      "kozgu",
    ],
  );
  assert.ok(
    result.every(
      (template, index) =>
        index === 0 || result[index - 1].priceMinor >= template.priceMinor,
    ),
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

test("latest pins lead regardless of price while unpinned ordering stays unchanged", () => {
  const input = TEMPLATES.map((template) => ({ ...template, published: true }));
  const oldPin = input.find((template) => template.id === "anor")!;
  const newPin = input.find((template) => template.id === "kozgu")!;
  const baseline = orderCatalogTemplates(input, "all");
  const pinned = input.map((template) => ({
    ...template,
    pinnedOrder:
      template.id === oldPin.id
        ? "9007199254740992"
        : template.id === newPin.id
          ? "9007199254740993"
          : null,
    ...(template.id === oldPin.id ? { priceMinor: 999999999 } : {}),
    ...(template.id === newPin.id ? { priceMinor: 0 } : {}),
  }));
  for (const category of ["all", "wedding"]) {
    const result = orderCatalogTemplates(pinned, category);
    assert.deepEqual(
      result.slice(0, 2).map((t) => t.id),
      [newPin.id, oldPin.id],
    );
    assert.deepEqual(
      result.slice(2).map((t) => t.id),
      orderCatalogTemplates(input, category)
        .filter((t) => t.id !== oldPin.id && t.id !== newPin.id)
        .map((t) => t.id),
    );
  }
  assert.deepEqual(
    orderEventTemplates(pinned, "wedding")
      .slice(0, 2)
      .map((t) => t.id),
    [newPin.id, oldPin.id],
  );
  assert.deepEqual(
    orderCatalogTemplates(input, "all"),
    baseline,
    "input stays unchanged",
  );
  assert.ok(
    orderCatalogTemplates(pinned, "birthday").every((t) =>
      t.categoryIds.includes("birthday"),
    ),
  );
});

test("pins never bypass event compatibility or publication", () => {
  const input = TEMPLATES.map((template) => ({
    ...template,
    published: true,
    pinnedOrder: "1",
  }));
  input[0].published = false;
  for (const eventType of EVENT_TYPES) {
    const result = orderEventTemplates(input, eventType);
    assert.ok(
      result.every(
        (t) => t.published && t.supportedEventTypes.includes(eventType),
      ),
    );
    assert.ok(!result.some((t) => t.id === input[0].id));
  }
});
