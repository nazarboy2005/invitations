import test from "node:test";
import assert from "node:assert/strict";
import { toFotihaDraft, importEvidence } from "../src/fotiha-adapter.mjs";

test("admin adapter keeps missing content empty and never treats menu prices or source inclusion as a partnership", () => {
  const result = {
    completedAt: "2026-11-15T10:00:00Z",
    merged: {
      name: "Hall",
      address: "Address",
      phones: ["+998901234567"],
      products: [{ name: "Soup", amount: 50000, currency: "UZS" }],
      priceRanges: [{ min: 50000, max: 100000 }],
    },
  };
  const images = [
    {
      src: "/api/services/media/example",
      width: 640,
      height: 480,
      alt: "Hall",
    },
  ];
  const draft = toFotihaDraft(
    result,
    { categoryId: "restaurant", region: "Toshkent shahri" },
    "hall",
    images,
    "To‘yxonalar",
  );
  assert.equal(draft.description, "");
  assert.equal(draft.email, null);
  assert.equal(draft.latitude, null);
  assert.equal(draft.longitude, null);
  assert.equal(draft.featured, false);
  assert.equal(draft.price.kind, "negotiable");
  assert.equal(draft.price.min, null);
  assert.equal(draft.price.max, null);
  assert.deepEqual(draft.images, images);
});
test("admin evidence preserves accepted and rejected match evidence, alternate fields and observed products privately", () => {
  const result = {
    status: "partial",
    completedAt: "2026-11-15T10:00:00Z",
    sources: [
      {
        provider: "yandex",
        url: "https://yandex.uz/maps/org/1/",
        images: ["remote candidate"],
      },
    ],
    matches: [{ accepted: false, status: "uncertain" }],
    candidates: [],
    merged: {
      conflicts: [{ field: "phones" }],
      missing: ["description"],
      provenance: { phones: ["source"] },
      products: [{ amount: 390000 }],
      priceRanges: [{ min: 390000, max: 450000 }],
    },
    media: {
      images: [
        {
          file: "images/local.webp",
          source: "yandex",
          url: "https://image.example/a",
        },
      ],
      selection: { policy: "single", source: "yandex" },
      errors: [],
    },
    errors: [],
  };
  const evidence = importEvidence(result, [
    { slug: "existing", name: "Existing hall" },
  ]);
  assert.deepEqual(evidence.products, result.merged.products);
  assert.deepEqual(evidence.matches, result.matches);
  assert.deepEqual(evidence.provenance, result.merged.provenance);
  assert.deepEqual(evidence.duplicates, [
    { slug: "existing", name: "Existing hall" },
  ]);
  assert.equal(evidence.sources[0].images, undefined);
  assert.equal(evidence.imageProvenance[0].file, undefined);
  assert.equal(evidence.imageProvenance[0].source, "yandex");
});
