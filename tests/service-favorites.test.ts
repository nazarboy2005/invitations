import test from "node:test";
import assert from "node:assert/strict";
import { parseFavorites } from "../apps/web/src/modules/favorites/service-favorites-data";
import {
  serviceListings,
  serviceCategories,
} from "../apps/web/src/modules/services/services-data";
import {
  serviceDirectory,
  serviceDirectoryUrl,
} from "../apps/web/src/modules/services/services-utils";

test("guest service saves reject corrupt entries and deduplicate independently of template saves", () => {
  const saved = {
    serviceSlug: "encore-media",
    savedAt: "2026-11-01T10:00:00Z",
  };
  assert.deepEqual(
    parseFavorites(
      JSON.stringify([
        saved,
        saved,
        null,
        {},
        { ...saved, serviceSlug: "../bad" },
        { ...saved, savedAt: "bad" },
        { templateId: "anor", savedAt: saved.savedAt },
      ]),
    ),
    [{ ...saved, savedAt: "2026-11-01T10:00:00.000Z" }],
  );
  assert.deepEqual(parseFavorites("broken"), []);
});
test("saved services paginate the saved subset and preserve favorites in filter links", () => {
  const subset = serviceListings.slice(0, 15);
  const first = serviceDirectory({}, subset, serviceCategories);
  const second = serviceDirectory({ page: 2 }, subset, serviceCategories);
  assert.equal(first.total, 15);
  assert.equal(first.pages, 2);
  assert.equal(first.listings.length, 12);
  assert.equal(second.listings.length, 3);
  assert.equal(
    new Set([...first.listings, ...second.listings].map((item) => item.slug))
      .size,
    15,
  );
  const category = subset[0].categoryIds[0];
  const filtered = serviceDirectory({ category }, subset, serviceCategories);
  assert.ok(
    filtered.listings.every((item) => item.categoryIds.includes(category)),
  );
  assert.match(
    serviceDirectoryUrl({
      category,
      favorites: true,
      page: 2,
      q: "video",
      region: "Toshkent",
    }),
    /favorites=1/,
  );
  assert.equal(
    serviceDirectoryUrl({ category: "invitation", favorites: true }),
    "/templates",
  );
});
