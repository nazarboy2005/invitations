import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = new URL("../apps/web/public/templates/konfetti/", import.meta.url);
const captured = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/konfetti/",
  import.meta.url,
);
const read = (name: string) => readFileSync(new URL(name, root), "utf8");
const readCaptured = (name: string) =>
  readFileSync(new URL(name, captured), "utf8");
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

test("Konfetti preserves captured markup, styles, translations, metadata and artwork", () => {
  const normalize = (value: string) => value.replace(/\r\n/g, "\n");
  const body = (value: string) =>
    normalize(value).match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  assert.equal(body(read("index.html")), body(readCaptured("index.html")));
  for (const name of ["template.css", "i18n.js", "meta.js"])
    assert.deepEqual(
      readFileSync(new URL(name, root)),
      readFileSync(new URL(name, captured)),
      `${name} remains byte-identical to its capture`,
    );
  for (const name of [
    "art/venue.webp",
    "art/gallery-1.webp",
    "art/gallery-2.webp",
    "art/gallery-3.webp",
    "art/gallery-4.webp",
  ])
    assert.deepEqual(
      readFileSync(new URL(name, root)),
      readFileSync(new URL(name, captured)),
      `${name} remains byte-identical to its capture`,
    );

  let adapted = normalize(readCaptured("template.js"));
  const replaceOnce = (before: string, after: string) => {
    assert.equal(adapted.split(before).length - 1, 1, "documented source edit is unique");
    adapted = adapted.replace(before, () => after);
  };
  replaceOnce(
    "    gsap.set(ageDigits, { yPercent: 40, scale: .3, rotate: i => i % 2 ? 16 : -16, opacity: 0 });",
    "    if (ageDigits.length) gsap.set(ageDigits, { yPercent: 40, scale: .3, rotate: i => i % 2 ? 16 : -16, opacity: 0 });",
  );
  replaceOnce(
    "    gsap.set(nameChars, { yPercent: 110, opacity: 0, rotate: 8 });",
    "    if (nameChars.length) gsap.set(nameChars, { yPercent: 110, opacity: 0, rotate: 8 });",
  );
  replaceOnce(
    "    tl.to(ageDigits, { yPercent: 0, scale: 1, rotate: 0, opacity: 1, duration: 1.1, stagger: .1, ease: 'elastic.out(1, .55)' }, 0)\n      .to('.badge', { scale: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)' }, .25)\n      .to(nameChars, { yPercent: 0, opacity: 1, rotate: 0, duration: .7, stagger: .028, ease: 'back.out(1.8)' }, .35)",
    "    if (ageDigits.length) tl.to(ageDigits, { yPercent: 0, scale: 1, rotate: 0, opacity: 1, duration: 1.1, stagger: .1, ease: 'elastic.out(1, .55)' }, 0);\n    tl.to('.badge', { scale: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)' }, .25);\n    if (nameChars.length) tl.to(nameChars, { yPercent: 0, opacity: 1, rotate: 0, duration: .7, stagger: .028, ease: 'back.out(1.8)' }, .35);\n    tl",
  );
  replaceOnce(
    "if (window.gsap && !reduce() && e.target.closest('.hero__age')) gsap.fromTo(ageDigits,",
    "if (window.gsap && !reduce() && ageDigits.length && e.target.closest('.hero__age')) gsap.fromTo(ageDigits,",
  );
  replaceOnce(
    "    gsap.from('.gallery__item', { x: 160, rotate: 10, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.gallery', start: 'top 80%', once: true } });",
    "    const galleryItems = $$('.gallery__item');\n    if (galleryItems.length) gsap.from(galleryItems, { x: 160, rotate: 10, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.gallery', start: 'top 80%', once: true } });",
  );
  assert.equal(normalize(script), adapted);
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
  const provenance = JSON.parse(read("preview.provenance.json")) as {
    width: number;
    height: number;
    fixture: string;
    fixtureLocale: string;
    fixtureEventType: string;
    fixtureNames: string[];
    sha256: string;
  };
  assert.equal(preview.toString("ascii", 12, 16), "VP8X");
  assert.deepEqual(
    [preview.readUIntLE(24, 3) + 1, preview.readUIntLE(27, 3) + 1],
    [450, 800],
  );
  assert.deepEqual([provenance.width, provenance.height], [450, 800]);
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.equal(provenance.fixtureLocale, "uz-Latn");
  assert.equal(provenance.fixtureEventType, "birthday");
  assert.deepEqual(provenance.fixtureNames, ["Javohir"]);
  assert.equal(provenance.sha256, createHash("sha256").update(preview).digest("hex"));
  assert.equal(createTemplatePreviewSample("konfetti").eventType, "birthday");
  assert.match(metadata, /slug:\s*"konfetti"/);
  assert.match(metadata, /preview:\s*"preview\.webp"/);
  assert.match(metadata, /category:\s*"tugilgan-kun"/);
  assert.match(metadata, /eventTypes:\s*\["tugilgan-kun",\s*"yubiley"\]/);
  assert.match(read("fonts.css"), /font-family:Manrope/);
  assert.match(read("fonts.css"), /font-family:Unbounded/);
  assert.match(read("fonts.css"), /U\+0400-045F/);
  assert.doesNotMatch(read("fonts.css"), /https?:\/\//);
});

test("Konfetti birthday and jubilee samples cover all locales and invitation sections", () => {
  const fixture = JSON.parse(
    readFileSync(new URL("../../../src/modules/catalog/preview-sample.json", root), "utf8"),
  ) as {
    eventSamples: Record<string, {
      eventLabel: Record<string, string>;
      hosts: Record<string, string>;
      message: Record<string, string>;
      venueName: Record<string, string>;
      address: Record<string, string>;
      programHeading: Record<string, string>;
      programTitles: Record<string, string[]>;
      dressCode: { style: Record<string, string>; text: Record<string, string>; note: Record<string, string>; colors?: Array<{ name: Record<string, string> }> };
    }>;
  };
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  for (const eventType of ["birthday", "yubiley"]) {
    const sample = fixture.eventSamples[eventType];
    assert.ok(sample, `${eventType} fixture is present`);
    for (const locale of locales) {
      for (const field of ["eventLabel", "hosts", "message", "venueName", "address", "programHeading"] as const)
        assert.ok(sample[field][locale], `${eventType}.${field}.${locale} is localized`);
      assert.equal(sample.programTitles[locale].length, 6);
      assert.ok(sample.dressCode.style[locale]);
      assert.ok(sample.dressCode.text[locale]);
      assert.ok(sample.dressCode.note[locale]);
    }
    if (sample.dressCode.colors)
      assert.ok(sample.dressCode.colors.every((color) => locales.every((locale) => color.name[locale])));
  }
  const preview = createTemplatePreviewSample("konfetti");
  assert.equal(preview.eventType, "birthday");
  assert.equal(preview.content["uz-Latn"].eventLabel, "Tug‘ilgan kun");
  assert.equal(preview.program.length, 6);
  assert.equal(preview.gallery.length, 6);
  for (const locale of preview.enabledLocales) {
    const content = preview.content[locale];
    assert.ok(content.people[0] && content.hosts && content.message && content.venueName && content.programHeading);
    assert.ok(preview.program.every((entry) => content.programTitles[entry.id]));
    assert.ok(preview.dressCode.style[locale] && preview.dressCode.text[locale] && preview.dressCode.note[locale]);
    assert.ok(preview.dressCode.colors.every((color) => color.name[locale]));
  }
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
