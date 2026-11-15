import test from "node:test";
import assert from "node:assert/strict";
import { sourceRecord } from "../src/core.mjs";
import {
  combineSources,
  matchBusinesses,
  nameSimilarity,
  priceRanges,
} from "../src/merge.mjs";
const business = (provider, values = {}) => ({
  ...sourceRecord(
    provider,
    `https://${provider === "google" ? "www.google.com" : "yandex.uz"}/maps/`,
  ),
  name: "Example Hall",
  location: { lat: 41.3, lng: 69.2 },
  ...values,
});
test("matching accepts corroborated identity and rejects shared-name or shared-phone branches far apart", () => {
  const first = business("yandex", { phones: ["+998712422164"] });
  assert.equal(
    matchBusinesses(first, business("google", { phones: first.phones })).status,
    "matched",
  );
  assert.equal(
    matchBusinesses(
      first,
      business("google", {
        phones: first.phones,
        location: { lat: 41.4, lng: 69.4 },
      }),
    ).status,
    "rejected",
  );
  assert.equal(
    matchBusinesses(first, business("google", { location: null, phones: [] }))
      .status,
    "needs_review",
  );
  assert.equal(
    matchBusinesses(
      first,
      business("google", { name: "Different Company", phones: [] }),
    ).status,
    "rejected",
  );
});
test("matching tolerates transliteration, spacing and small spelling changes without name-only confirmation", () => {
  assert.equal(nameSimilarity("Версаль", "Versal Banquet Hall"), 1);
  assert.ok(nameSimilarity("Grand Elite", "Grantelite") >= 0.85);
  assert.ok(
    nameSimilarity("Yakka Saroy", "Yakka Saroy (Банкетный зал Яккасарай)") >=
      0.5,
  );
  assert.equal(
    matchBusinesses(
      business("yandex", { name: "Grand Elite" }),
      business("google", { name: "Grantelite" }),
    ).status,
    "matched",
  );
});
test("merge fills gaps, keeps conflicting alternatives and tracks manual overrides", () => {
  const a = business("yandex", {
    phones: ["+998111111111"],
    address: "Address A",
    links: [{ url: "https://instagram.com/hall", type: "instagram" }],
  });
  const b = business("google", {
    name: "Alternate Hall",
    address: "Address B",
    phones: ["+998222222222"],
    descriptions: [
      {
        text: "A useful description",
        kind: "source_description",
        source: "google",
      },
    ],
  });
  const m = combineSources([a, b], { overrides: { name: "Reviewed name" } });
  assert.equal(m.name, "Reviewed name");
  assert.equal(m.description, "A useful description");
  assert.equal(m.phones.length, 2);
  assert.ok(m.conflicts.some((x) => x.field === "address"));
  assert.ok(m.conflicts.some((x) => x.field === "phones"));
  assert.equal(m.provenance.name[0].source, "manual");
  assert.ok(m.missing.includes("products"));
  assert.ok(m.reviewRequired);
});
test("review excerpts never become the business description", () => {
  const m = combineSources([
    business("yandex", {
      descriptions: [{ text: "Review content", kind: "review_excerpt" }],
    }),
  ]);
  assert.equal(m.description, "");
});
test("price groups keep currencies, units and categories separate and flag conflicting product prices", () => {
  const p = (name, amount, currency, unit, category) => ({
    name,
    amount,
    currency,
    unit,
    category,
    source: "yandex",
  });
  const products = [
    p("Guest", 250000, "UZS", "person", "Packages"),
    p("VIP guest", 500000, "UZS", "person", "Packages"),
    p("Cake", 200000, "UZS", null, "Cakes"),
    p("Guest USD", 20, "USD", "person", "Packages"),
  ];
  const groups = priceRanges(products);
  assert.equal(groups.length, 3);
  assert.deepEqual([groups[0].min, groups[0].max], [250000, 500000]);
  assert.ok(
    groups.every((x) => x.needsReview && x.coverage === "observed_items_only"),
  );
  const merged = combineSources([
    business("yandex", { products: [products[0]] }),
    business("google", {
      products: [{ ...products[0], amount: 300000, source: "google" }],
    }),
  ]);
  assert.ok(merged.conflicts.some((x) => x.field === "product_price"));
});

test("a 1-so'm placeholder remains visible as source evidence but cannot create a price range", () => {
  const record = business("yandex", {
    products: [
      { name: "Киши бошига", amount: 1, currency: "UZS", unit: "person" },
      {
        name: "Guest package",
        amount: 390000,
        currency: "UZS",
        unit: "person",
      },
      { name: "Small USD item", amount: 1, currency: "USD", unit: "item" },
    ],
  });
  const merged = combineSources([record]);
  assert.equal(record.products[0].excludedFromPriceRange, undefined);
  assert.ok(merged.products[0].excludedFromPriceRange);
  assert.deepEqual(merged.products[0].qualityFlags, [
    "possible_placeholder_price",
  ]);
  assert.equal(
    merged.priceRanges.find((x) => x.currency === "UZS").min,
    390000,
  );
  assert.equal(merged.priceRanges.find((x) => x.currency === "USD").min, 1);
});
