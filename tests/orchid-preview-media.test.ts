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

test("Orchid RSVP keeps the source layout and reveal motion without a guest-count prompt", () => {
  const root = process.cwd();
  const html = readFileSync(
    join(root, "apps/web/public/templates/chorlove/orchid-amplop/index.html"),
    "utf8",
  );
  const bridge = readFileSync(
    join(root, "apps/web/public/templates/chorlove/orchid-amplop/bridge.js"),
    "utf8",
  );
  const platformCss = readFileSync(
    join(root, "apps/web/public/templates/chorlove/orchid-amplop/source/platform.css"),
    "utf8",
  );
  const sourceRsvpChunk = readFileSync(
    join(
      root,
      "Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0aexcrombk~7o.js",
    ),
    "utf8",
  );

  assert.match(
    sourceRsvpChunk,
    /initial:\{opacity:0,y:15\},whileInView:\{opacity:1,y:0\},viewport:\{amount:\.2\},transition:\{duration:\.6\}/,
  );
  assert.match(
    sourceRsvpChunk,
    /"orchid-amplop":\{sectionClassName:"orchid-section",headingClassName:"text-\[25px\] font-bold leading-\[1\.2\]"/,
  );
  assert.equal((html.match(/data-copy="rsvpTitle"/g) || []).length, 1);
  assert.equal((html.match(/data-copy="rsvpIntro"/g) || []).length, 1);
  assert.equal((html.match(/data-orchid-rsvp(?:\s|>)/g) || []).length, 1);
  assert.doesNotMatch(html, /How many people will come\?/i);
  assert.match(bridge, /threshold: 0\.2/);
  assert.match(bridge, /partySize: body\.get\("status"\) === "yes" \? 1 : 0/);
  assert.match(platformCss, /\.orchid-rsvp-reveal\{opacity:0;transform:translateY\(15px\);transition:opacity \.6s/);
  assert.match(platformCss, /@media\(prefers-reduced-motion:reduce\)\{[^}]*\.orchid-rsvp-reveal/);
});
