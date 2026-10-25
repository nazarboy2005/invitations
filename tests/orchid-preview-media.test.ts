import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { createInvitation } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  getTemplatePreviewVenuePhoto,
} from "../apps/web/src/modules/catalog/preview-sample";

const assets = [2, 1, 3, 6, 4, 5].map(
  (index) => `/templates/chorlove/orchid-amplop/assets/gallery-${index}.webp`,
);

test("Orchid source photos and story copy exist only in its preview sample", () => {
  const sample = createTemplatePreviewSample("orchid-amplop");
  const creator = createInvitation("orchid-amplop");

  assert.deepEqual(sample.gallery.map((photo) => photo.url), assets);
  assert.equal(
    getTemplatePreviewVenuePhoto("orchid-amplop"),
    "/templates/chorlove/orchid-amplop/assets/gallery-5.webp",
  );
  assert.equal(sample.story.length, 2);
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"] as const) {
    assert.ok(sample.story.every((chapter) => chapter.text[locale]));
  }

  assert.ok(creator.gallery.every((photo) => !photo.url));
  assert.equal(creator.story.length, 0);
});

test("Orchid source-photo fallbacks require the explicit preview-sample envelope", () => {
  const bridge = readFileSync(
    join(process.cwd(), "apps/web/public/templates/chorlove/orchid-amplop/bridge.js"),
    "utf8",
  );

  assert.match(bridge, /const previewSample = envelope\.preview && envelope\.sampleGallery/);
  assert.match(bridge, /setImages\(data, previewSample\)/);
  assert.match(bridge, /renderStory\(data, previewSample\)/);
  assert.match(bridge, /previewSample && venuePhoto/);
  assert.match(bridge, /show\('\[data-section="gallery"\]', images\.length > 0\)/);
  assert.match(bridge, /return \(data\.gallery \|\| \[\]\)\.filter/);
});
