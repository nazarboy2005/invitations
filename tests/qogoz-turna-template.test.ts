import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL("../apps/web/public/templates/qogoz-turna/", import.meta.url);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/qogoz-turna/",
  import.meta.url,
);
const read = (base: URL, file: string) => readFileSync(new URL(file, base), "utf8");
const html = read(templateRoot, "index.html");

test("Qog‘oz Turna keeps its captured design and motion source", () => {
  const normalize = (source: string) => source.replace(/\r\n/g, "\n");
  const capturedHtml = read(captureRoot, "index.html");
  const body = (source: string) => source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  const packagedScript = normalize(read(templateRoot, "template.js"));
  const capturedScript = normalize(read(captureRoot, "template.js"));

  for (const marker of [
    'class="folding-sheet"',
    'class="book-scene"',
    'class="scene-art scene-art--registan"',
    'id="dresscode"',
    'id="wishes"',
    'data-list="wishes"',
    'data-rsvp-choice="yes"',
    'data-gallery-prev',
  ]) {
    assert.ok(body(html).includes(marker), `${marker} is missing from the packaged template`);
    assert.ok(body(capturedHtml).includes(marker), `${marker} is absent from the capture`);
  }

  for (const file of ["template.css", "meta.js"]) {
    assert.equal(normalize(read(templateRoot, file)), normalize(read(captureRoot, file)), `${file} changed`);
  }
  assert.equal(
    packagedScript,
    capturedScript.replace(
      "../../shared/vendor/three/three.bundle.min.js",
      "../shared/nikoh/vendor/three/three.bundle.min.js",
    ),
    "only the shared Three.js path should differ in the packaged interaction source",
  );
  assert.equal(body(html), body(capturedHtml), "the captured invitation body should stay unchanged");
  assert.match(packagedScript, /prefers-reduced-motion/);
  assert.match(read(templateRoot, "template.css"), /prefers-reduced-motion:reduce/);
});

test("Qog‘oz Turna uses local fonts and only the app invitation runtime", () => {
  assert.doesNotMatch(html, /https:\/\/fonts\.googleapis\.com|sample-invitation\.js|sample-overrides\.js/);
  assert.match(html, /shared\/nikoh\/platform-bridge\.js/);
  assert.match(html, /shared\/nikoh\/core\.js/);
  assert.match(html, /fonts\.css/);

  const fontCss = read(templateRoot, "fonts.css");
  assert.match(fontCss, /font-family:Caveat/);
  assert.match(fontCss, /font-family:Lora/);
  for (const [, asset] of fontCss.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
  for (const file of ["base.css", "core.js", "platform-bridge.js", "vendor/gsap.min.js", "vendor/ScrollTrigger.min.js", "vendor/three/three.bundle.min.js"]) {
    assert.ok(existsSync(new URL(`../shared/nikoh/${file}`, templateRoot)), `${file} is missing`);
  }
  const preview = readFileSync(new URL("preview.webp", templateRoot));
  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.ok(preview.length > 10000, "the full portrait opening artwork should be packaged");
});

test("Qog‘oz Turna has fixed copy for every published language", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(read(templateRoot, "i18n.js"), { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const textNodes = Array.from(html.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter((text) => text.length > 1 && !["&"].includes(text) && !/^№?\s*[\d /·—-]+$/.test(text));
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
  assert.ok(translations["Qog‘oz Turna · Taklifnoma"]);
  assert.ok(translations["Qog‘oz Turna — qat-qat ochiladigan nafis taklifnoma"]);
});
