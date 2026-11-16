import test from "node:test";
import assert from "node:assert/strict";
import {
  CURRENT_LOCATION_REGION,
  formatServiceDistance,
  serviceDistance,
} from "../apps/web/src/modules/services/service-distance";
import {
  serviceDirectory,
  serviceDirectoryUrl,
  type ServiceListing,
} from "../apps/web/src/modules/services/services-utils";
import {
  serviceListings,
  serviceCategories,
} from "../apps/web/src/modules/services/services-data";

test("straight-line distance handles known distances, zero, date line and missing coordinates", () => {
  const origin = { latitude: 0, longitude: 0 };
  assert.equal(serviceDistance(origin, origin), 0);
  assert.ok(
    Math.abs(
      serviceDistance(origin, { latitude: 0, longitude: 1 })! - 111195.08,
    ) < 0.1,
  );
  assert.ok(
    Math.abs(
      serviceDistance(
        { latitude: 0, longitude: 179 },
        { latitude: 0, longitude: -179 },
      )! - 222390.16,
    ) < 0.1,
  );
  assert.ok(
    Number.isFinite(serviceDistance(origin, { latitude: 0, longitude: 180 })),
  );
  assert.equal(serviceDistance(null, origin), null);
  for (const destination of [
    { latitude: null, longitude: 0 },
    { latitude: 91, longitude: 0 },
    { latitude: 0, longitude: NaN },
    { latitude: 0, longitude: 181 },
  ]) {
    assert.equal(serviceDistance(origin, destination), null);
  }
});

test("distance labels use meters below a kilometer and up to two kilometer decimals", () => {
  assert.equal(formatServiceDistance(0), "0 m");
  assert.equal(formatServiceDistance(245.3), "245 m");
  assert.equal(formatServiceDistance(999.4), "999 m");
  assert.equal(formatServiceDistance(999.9), "1 km");
  assert.equal(formatServiceDistance(1000), "1 km");
  assert.equal(formatServiceDistance(1243), "1.24 km");
  assert.equal(formatServiceDistance(123456.78), "123.46 km");
});

test("nearby searches all regions and sorts before pagination, ahead of featured placement", () => {
  const listings: ServiceListing[] = Array.from({ length: 26 }, (_, index) => ({
    ...serviceListings[0],
    slug: `distance-${26 - index}`,
    name: `Business ${26 - index}`,
    region: index % 2 ? "A" : "B",
    latitude: 0,
    longitude: (26 - index) / 100,
    featured: index === 0,
  }));
  listings.push({
    ...listings[0],
    slug: "unknown",
    latitude: null,
    longitude: null,
    featured: true,
  });
  const filters = {
    region: CURRENT_LOCATION_REGION,
    origin: { latitude: 0, longitude: 0 },
  };
  const first = serviceDirectory(filters, listings, serviceCategories);
  assert.equal(first.total, 27);
  const slugs = Array.from(
    { length: first.pages },
    (_, index) =>
      serviceDirectory(
        { ...filters, page: index + 1 },
        listings,
        serviceCategories,
      ).listings,
  )
    .flat()
    .map((item) => item.slug);
  assert.deepEqual(slugs, [
    ...Array.from({ length: 26 }, (_, i) => `distance-${i + 1}`),
    "unknown",
  ]);
  assert.deepEqual(
    serviceDirectory({ origin: filters.origin }, listings, serviceCategories)
      .listings,
    serviceDirectory({}, listings, serviceCategories).listings,
  );
  assert.ok(
    serviceDirectory(
      { region: "A", origin: filters.origin },
      listings,
      serviceCategories,
    ).listings.every((item) => item.region === "A"),
  );
  assert.equal(
    serviceDirectory(
      { ...filters, category: listings[0].categoryIds[0], q: "Business 26" },
      listings,
      serviceCategories,
    ).total,
    2,
  );
  assert.equal(
    serviceDirectory(
      { ...filters, q: "missing business" },
      listings,
      serviceCategories,
    ).total,
    0,
  );
  assert.deepEqual(
    serviceDirectory(
      { region: CURRENT_LOCATION_REGION },
      listings,
      serviceCategories,
    ).listings,
    serviceDirectory({}, listings, serviceCategories).listings,
  );
  assert.equal(
    serviceDirectoryUrl({ ...filters, page: 2 }),
    "/services?region=nearby&page=2",
  );
});
