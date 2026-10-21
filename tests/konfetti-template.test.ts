import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../apps/web/public/templates/konfetti/", import.meta.url);
const read = (name: string) => readFileSync(new URL(name, root), "utf8");
const html = read("index.html");
const metadata = read("meta.js");
const styles = read("template.css");
const script = read("template.js");

test("Konfetti preserves the captured invitation sections and interactions", () => {
  for (const section of [
    "intro",
    "hero",
    "invitation-text",
    "date",
    "program",
    "venue",
    "dresscode",
    "gallery",
    "rsvp",
    "wishes",
    "toyona",
    "contacts",
    "footer",
  ])
    assert.match(
      html,
      new RegExp(`(?:data-section|id)="${section}"`),
      `${section} remains in the source`,
    );
  for (const interaction of [
    'id="open-invitation"',
    "data-calendar",
    "data-countdown",
    "data-ics",
    'data-list="program"',
    'data-list="gallery"',
    "data-gallery-prev",
    "data-gallery-next",
    "data-rsvp",
    "data-wishes-form",
    "data-copy=",
    "data-map=",
    "data-music-toggle",
  ])
    assert.ok(
      html.includes(interaction),
      `${interaction} remains in the source`,
    );
  assert.match(script, /prefers-reduced-motion/);
  assert.match(script, /shader/);
  assert.match(script, /if \(ageDigits\.length\) gsap\.set/);
  assert.match(script, /if \(nameChars\.length\) gsap\.set/);
  assert.match(script, /if \(galleryItems\.length\) gsap\.from/);
  assert.match(styles, /prefers-reduced-motion/);
});

test("Konfetti resolves all packaged source dependencies locally and excludes captured sample runtime", () => {
  for (const dependency of [
    "../shared/nikoh/base.css",
    "../shared/nikoh/platform-bridge.js",
    "../shared/nikoh/core.js",
    "../shared/nikoh/vendor/gsap.min.js",
    "../shared/nikoh/vendor/ScrollTrigger.min.js",
    "fonts.css",
    "fonts/manrope-latin.woff2",
    "fonts/manrope-cyrillic.woff2",
    "fonts/unbounded-latin.woff2",
    "fonts/unbounded-cyrillic.woff2",
    "art/venue.webp",
    "art/gallery-1.webp",
    "art/gallery-2.webp",
    "art/gallery-3.webp",
    "art/gallery-4.webp",
  ])
    assert.ok(existsSync(new URL(dependency, root)), `${dependency} exists`);
  assert.doesNotMatch(
    html,
    /sample-invitation|sample-overrides|fonts\.googleapis\.com|fonts\.gstatic\.com/,
  );
  assert.equal(existsSync(new URL("sample-overrides.js", root)), false);
  assert.equal(existsSync(new URL("sample-invitation.js", root)), false);
  for (const [, relative] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:https?:|#|data:)/.test(relative)) continue;
    assert.ok(
      existsSync(new URL(relative, root)),
      `local dependency ${relative} resolves`,
    );
  }
  for (const [, relative] of read("fonts.css").matchAll(
    /url\(["']?([^)'"\s]+)["']?\)/g,
  ))
    assert.ok(
      existsSync(new URL(relative, root)),
      `local font ${relative} resolves`,
    );
});

test("Konfetti packages its metadata-named authentic portrait WebP preview", () => {
  const preview = readFileSync(new URL("preview.webp", root));
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.match(metadata, /slug:\s*"konfetti"/);
  assert.match(metadata, /preview:\s*"preview\.webp"/);
  assert.match(metadata, /category:\s*"tugilgan-kun"/);
  assert.match(metadata, /eventTypes:\s*\["tugilgan-kun",\s*"yubiley"\]/);
  assert.match(read("fonts.css"), /font-family:Manrope/);
  assert.match(read("fonts.css"), /font-family:Unbounded/);
  assert.match(read("fonts.css"), /U\+0400-045F/);
  assert.doesNotMatch(read("fonts.css"), /https?:\/\//);
});

test("the adapter uses shared invitation data and documents source-only fields", () => {
  const renderer = readFileSync(
    new URL("../../../src/templates/konfetti/renderer.tsx", root),
    "utf8",
  );
  const notes = read("README.md");
  assert.match(renderer, /MarxabaInvitation/);
  assert.match(renderer, /templateId="konfetti"/);
  for (const gap of ["extras.age", "venue.photo", "toyona.bank", "toyona.note"])
    assert.ok(notes.includes(gap), `${gap} is documented`);
  assert.match(notes, /preview-sample\.json/);
  assert.match(notes, /birthday.*yubiley/s);
});
