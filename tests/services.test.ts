import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  serviceCategories,
  serviceListings,
  serviceDirectory,
  serviceDirectoryUrl,
  servicePrice,
  serviceMapUrl,
  serviceExternalUrl,
  servicePhoneUrl,
  normalizeServiceSearch,
  roundServicePrice,
  SERVICES_PAGE_SIZE,
} from "../apps/web/src/modules/services/services-data";

test("directory pagination never repeats a business or exceeds twelve results", () => {
  const seen = new Set<string>();
  const first = serviceDirectory();
  for (let page = 1; page <= first.pages; page++) {
    const result = serviceDirectory({ page });
    assert.ok(result.listings.length <= SERVICES_PAGE_SIZE);
    if (page < first.pages) assert.equal(result.listings.length, 12);
    for (const listing of result.listings) {
      assert.ok(!seen.has(listing.slug), listing.slug);
      seen.add(listing.slug);
    }
  }
  assert.equal(seen.size, serviceListings.length);
  assert.equal(serviceDirectory({ page: -2 }).page, 1);
  assert.equal(serviceDirectory({ page: "NaN" }).page, 1);
  assert.equal(serviceDirectory({ page: 1.5 }).page, 1);
  assert.equal(serviceDirectory({ page: 99999 }).page, first.pages);
});

test("category pagination and search retain only matching businesses", () => {
  for (const category of serviceCategories) {
    const result = serviceDirectory({ category: category.id });
    assert.equal(
      result.total,
      serviceListings.filter((listing) =>
        listing.categoryIds.includes(category.id),
      ).length,
    );
    assert.ok(
      result.listings.every((listing) =>
        listing.categoryIds.includes(category.id),
      ),
    );
    if (result.total === 20) {
      assert.equal(result.listings.length, 12);
      assert.equal(
        serviceDirectory({ category: category.id, page: 2 }).listings.length,
        8,
      );
    }
  }
  const listing = serviceListings[0];
  assert.ok(listing);
  const result = serviceDirectory({ q: listing.name, region: listing.region });
  assert.ok(result.listings.some((item) => item.slug === listing.slug));
  assert.equal(serviceDirectory({ q: "not-a-real-business-zzzzzz" }).total, 0);
  assert.equal(
    normalizeServiceSearch("  TO‘Y   XIZMATLARI "),
    normalizeServiceSearch("to'y xizmatlari"),
  );
});

test("filter links preserve the search and region, and encode user input", () => {
  const url = new URL(
    serviceDirectoryUrl({
      category: "restaurant",
      q: "A & B",
      region: "Toshkent shahri",
      page: 2,
    }),
    "https://fotiha.uz",
  );
  assert.equal(url.pathname, "/services/restaurant");
  assert.equal(url.searchParams.get("q"), "A & B");
  assert.equal(url.searchParams.get("region"), "Toshkent shahri");
  assert.equal(url.searchParams.get("page"), "2");
  assert.equal(serviceDirectoryUrl({ page: 1 }), "/services");
  assert.equal(
    serviceDirectoryUrl({ category: "invitation", q: "old filter", page: 2 }),
    "/templates",
  );
});

test("imported profiles use local media and exclude source accounts and reputation", () => {
  assert.equal(serviceCategories.length, 15);
  const slugs = new Set<string>();
  for (const listing of serviceListings) {
    assert.match(listing.slug, /^[a-z0-9-]+$/);
    assert.ok(!slugs.has(listing.slug));
    slugs.add(listing.slug);
    assert.equal(typeof listing.name, "string");
    for (const key of ["description", "region", "district", "address"] as const)
      assert.equal(typeof listing[key], "string");
    assert.ok(!JSON.stringify(listing).includes("[object Object]"));
    assert.ok(
      listing.categoryIds.every((id) =>
        serviceCategories.some((category) => category.id === id),
      ),
    );
    assert.ok(!/chorlove/i.test(listing.description));
    for (const key of [
      "ownerId",
      "userId",
      "rating",
      "reviews",
      "verified",
      "sourceUrl",
    ])
      assert.ok(!(key in listing));
    for (const image of listing.images) {
      assert.match(
        image.src,
        /^\/images\/services\/[a-z0-9-]+\/[a-f0-9]+\.webp$/,
      );
      assert.ok(image.width > 0 && image.height > 0);
      assert.ok(existsSync(path.join("apps/web/public", image.src)), image.src);
    }
  }
});

test("price display converts dollars to saved-rate UZS and never relabels raw dollars", () => {
  const range = {
    kind: "range" as const,
    min: 800000,
    max: 1200000,
    currency: "UZS",
    sourceText: "",
  };
  assert.match(servicePrice(range), /so‘m$/);
  const dollarRange = servicePrice({
    ...range,
    min: 10,
    max: 25,
    currency: "USD",
  });
  assert.equal(dollarRange.replace(/\s/g, ""), "100000–300000so‘m");
  assert.equal(roundServicePrice(317848), 300000);
  assert.equal(roundServicePrice(168201), 200000);
  assert.equal(roundServicePrice(6968335), 7000000);
  assert.equal(roundServicePrice(12014), 10000);
  assert.equal(roundServicePrice(1800), 2000);
  assert.equal(roundServicePrice(500), 500);
  assert.equal(roundServicePrice(0), 0);
  assert.equal(
    servicePrice({ ...range, min: 310000, max: 340000 }).replace(/\s/g, ""),
    "300000so‘m",
  );
  assert.equal(
    servicePrice({ ...range, currency: "EUR" }),
    "Narxni aniqlashtiring",
  );
  for (const listing of serviceListings) {
    const display = servicePrice(listing.price);
    assert.ok(!/USD|\$/.test(display));
    if (listing.price.kind !== "negotiable" && listing.price.min !== null)
      assert.match(display, /so‘m/);
  }
  assert.match(servicePrice({ ...range, kind: "from" }), / dan$/);
  assert.equal(
    servicePrice({ ...range, kind: "negotiable" }),
    "Kelishuv asosida",
  );
});

test("contacts and maps cannot turn imported text into unsafe links", () => {
  assert.equal(serviceExternalUrl("javascript:alert(1)"), null);
  assert.equal(serviceExternalUrl("https://user:pass@example.com"), null);
  assert.equal(
    serviceExternalUrl("https://t.me/example"),
    "https://t.me/example",
  );
  assert.equal(serviceExternalUrl("http://example.com"), "http://example.com/");
  assert.equal(servicePhoneUrl("+998 (90) 123-45-67"), "tel:+998901234567");
  assert.equal(servicePhoneUrl("hello"), null);
  const url = new URL(
    serviceMapUrl({
      latitude: 41.3,
      longitude: 69.2,
      name: "Hall",
      address: "Toshkent",
    }),
  );
  assert.equal(url.hostname, "yandex.uz");
  assert.equal(url.searchParams.get("pt"), "69.2,41.3,pm2rdm");
  const fallback = new URL(
    serviceMapUrl({
      latitude: null,
      longitude: null,
      name: "Hall",
      address: "Toshkent",
    }),
  );
  assert.equal(fallback.searchParams.get("text"), "Hall, Toshkent");
});

test("public service components never call the source or a maps API", () => {
  for (const file of [
    "services-data.ts",
    "services-directory.tsx",
    "service-card.tsx",
    "service-detail.tsx",
    "service-gallery.tsx",
  ]) {
    const source = readFileSync(
      path.join("apps/web/src/modules/services", file),
      "utf8",
    );
    assert.ok(
      !/\bfetch\s*\(|chorlove\.uz|api-maps\.yandex|search-maps\.yandex/.test(
        source,
      ),
      file,
    );
  }
});
