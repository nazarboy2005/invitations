import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL("../apps/web/public/templates/sahifa/", import.meta.url);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/sahifa/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const translationsSource = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url),
  "utf8",
);

test("Sahifa translates all static invitation copy and page metadata", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(translationsSource, { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const textNodes = Array.from(html.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter(
    (text) =>
      text.length > 1 &&
      !["&", "SAHIFA", "14—11", "||| |||| | ||| || |||", "01 — 12", "RSVP", "J&M"].includes(text) &&
      !/^№?\s*[\d /·—-]+$/.test(text),
  );
  const attributes = Array.from(
    html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  const metadata = Array.from(
    html.matchAll(/<meta\s+[^>]*?(?:name="description"|property="og:(?:title|description)")[^>]*?content="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  assert.deepEqual(
    [...textNodes, ...attributes, ...metadata].filter((text) => !translations[text]),
    [],
  );
  assert.ok(translations["Sahifa · Taklifnoma"]);
  assert.ok(translations["Raqamli taklifnoma"]);
  assert.ok(translations["YURAKDAN · SAHIFA"]);
});

test("Sahifa retains the captured page, scripts, styles, and local fonts", () => {
  const normalize = (value: string) => value.replace(/\r\n/g, "\n");
  const originalHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  const body = (source: string) => source.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim() ?? "";
  const packagedBody = body(html);
  assert.ok(packagedBody.includes('class="intro__content"'));
  assert.ok(packagedBody.includes('id="wishes" data-section="wishes"'));
  assert.ok(packagedBody.includes('data-list="wishes"'));
  assert.ok(packagedBody.includes('data-slot="venue.name"'));
  assert.ok(packagedBody.includes('data-slot="date.day"'));
  assert.ok(packagedBody.includes('class="spread letter"'));
  assert.ok(packagedBody.includes('class="spread date-spread"'));
  assert.ok(!packagedBody.includes("Javohir"));
  assert.ok(!packagedBody.includes("Madina"));
  assert.ok(originalHtml.includes('class="intro__content"'));

  for (const file of ["template.css", "template.js", "motion.css", "meta.js"]) {
    assert.equal(
      normalize(readFileSync(new URL(file, templateRoot), "utf8")),
      normalize(readFileSync(new URL(file, captureRoot), "utf8")),
      `${file} should match the captured source`,
    );
  }
  const sourceMotion = normalize(readFileSync(new URL("motion.js", captureRoot), "utf8"));
  const packagedMotion = normalize(readFileSync(new URL("motion.js", templateRoot), "utf8"));
  const expectedMotion = sourceMotion
    .replace(
      "if (typeof targets === 'string' && !el) return null;",
      "if ((typeof targets === 'string' && !el) || (Array.isArray(targets) && !targets.length)) return null;",
    )
    .replace(
      "gsap.fromTo = guard(gsap.fromTo.bind(gsap)); gsap.to = guard(gsap.to.bind(gsap));",
      "gsap.fromTo = guard(gsap.fromTo.bind(gsap)); gsap.to = guard(gsap.to.bind(gsap)); gsap.set = guard(gsap.set.bind(gsap));",
    );
  assert.equal(packagedMotion, expectedMotion, "motion.js should retain source with only empty-target guards added");
  const fontCss = readFileSync(new URL("fonts.css", templateRoot), "utf8");
  for (const [, asset] of fontCss.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
  assert.ok(existsSync(new URL("preview.webp", templateRoot)));
  assert.match(readFileSync(new URL("template.js", templateRoot), "utf8"), /reducedMotion/);
  const motion = readFileSync(new URL("motion.js", templateRoot), "utf8");
  assert.match(motion, /Array\.isArray\(targets\) && !targets\.length/);
  assert.match(motion, /gsap\.set = guard\(gsap\.set\.bind\(gsap\)\)/);
});
