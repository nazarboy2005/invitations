import test from "node:test";
import assert from "node:assert/strict";
import {
  emptyService,
  serviceEditorSchema,
  serviceImportSchema,
} from "../apps/web/src/modules/services/service-editor-contract";
import { serviceDirectory } from "../apps/web/src/modules/services/services-utils";
import {
  serviceListings,
  serviceCategories,
} from "../apps/web/src/modules/services/services-data";

test("all existing services remain editable without losing their content", () => {
  for (const listing of serviceListings) {
    const parsed = serviceEditorSchema.parse(listing);
    assert.deepEqual(parsed.images, listing.images);
    assert.deepEqual(parsed.price, listing.price);
    assert.equal(parsed.description, listing.description.trim());
    assert.equal(parsed.phones.length, listing.phones.length);
  }
});
test("service edits reject invalid prices, categories, contact schemes, locations and remote galleries", () => {
  const base = { ...emptyService(), slug: "qa-hall", name: "QA Hall" };
  assert.ok(serviceEditorSchema.safeParse(base).success);
  for (const bad of [
    { categoryIds: ["unknown"] },
    { categoryIds: [] },
    { email: "no-email" },
    { latitude: 41 },
    { latitude: 91, longitude: 69 },
    { links: [{ label: "Bad", url: "javascript:alert(1)" }] },
    { phones: [{ label: "Phone", value: "12" }] },
    { price: { ...base.price, kind: "range", min: 500, max: 400 } },
    {
      images: [
        {
          src: "https://maps.example/image.jpg",
          width: 500,
          height: 400,
          alt: "",
        },
      ],
    },
  ])
    assert.equal(
      serviceEditorSchema.safeParse({ ...base, ...bad }).success,
      false,
    );
});
test("Maps imports accept business links or names and reject arbitrary fetch targets", () => {
  const base = { city: "Tashkent", categoryId: "restaurant" };
  for (const urls of [
    ["https://yandex.uz/maps/-/CXSBfFON"],
    ["https://yandex.uz/maps/org/versal/178096015422/"],
    ["https://maps.app.goo.gl/example"],
    ["https://www.google.com/maps/place/example"],
  ])
    assert.ok(serviceImportSchema.safeParse({ ...base, urls }).success);
  assert.ok(
    serviceImportSchema.safeParse({ ...base, query: "Grand Elite" }).success,
  );
  for (const url of [
    "http://127.0.0.1/maps",
    "https://evil.example/maps",
    "https://yandex.uz.evil.example/maps",
    "https://user:pass@yandex.uz/maps/",
    "https://yandex.uz:444/maps/",
  ])
    assert.equal(
      serviceImportSchema.safeParse({ ...base, urls: [url] }).success,
      false,
    );
  assert.equal(serviceImportSchema.safeParse(base).success, false);
});
test("featured partners sort before regular listings, by priority, without disturbing regular append order", () => {
  const seed = serviceListings.find((s) =>
    s.categoryIds.includes("restaurant"),
  )!;
  const listings = [
    { ...seed, slug: "old" },
    { ...seed, slug: "partner-two", featured: true, featuredOrder: 2 },
    { ...seed, slug: "partner-one", featured: true, featuredOrder: 1 },
    { ...seed, slug: "new" },
  ];
  assert.deepEqual(
    serviceDirectory(
      { category: "restaurant" },
      listings,
      serviceCategories,
    ).listings.map((s) => s.slug),
    ["partner-one", "partner-two", "old", "new"],
  );
});
