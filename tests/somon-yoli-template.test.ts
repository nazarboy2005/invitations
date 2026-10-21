import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const root = new URL("../apps/web/public/templates/somon-yoli/", import.meta.url);
const capture = new URL("../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/somon-yoli/", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");
const translationSource = readFileSync(new URL("i18n.js", root), "utf8");

function translations() {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(translationSource, { window });
  assert.ok(window.MARHAMAT_I18N);
  return window.MARHAMAT_I18N;
}

test("Somon Yo‘li localizes fixed visible copy and metadata", () => {
  const dictionary = translations();
  const body = html.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  const visible = [...body.matchAll(/>([^<>]+)</g)].map(match => match[1].replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()).filter(value => value.length > 1 && !["&", "✦", "↗", "↓", "♫", "‹", "›", "✧", "00"].includes(value) && !/^\d{1,3}°.*\d{1,3}°/.test(value));
  const attributes = [...body.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g)].map(match => match[1].replace(/\s+/g, " ").trim()).filter(value => value.length > 1);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
  const missing = [...new Set([...visible, ...attributes, title, description])].filter(value => !dictionary[value]);
  assert.deepEqual(missing, []);
  assert.ok(dictionary["Somon Yo‘li · Taklifnoma"]);
  assert.ok(dictionary["Somon Yo‘li · taklifnoma"]);
});

test("Somon Yo‘li preserves captured layout, source styles, and artwork", () => {
  const normalize = (value: string) => value.replace(/\r\n/g, "\n");
  const sourceHtml = readFileSync(new URL("index.html", capture), "utf8");
  const body = (value: string) => value.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  for (const marker of ['id="intro"', 'class="intro__poster"', 'id="hero"', 'id="program"', 'id="dresscode"', 'id="gallery"', 'id="rsvp"', 'id="wishes"', 'data-list="wishes"', 'data-section="toyona"', 'data-section="contacts"']) {
    assert.ok(body(html).includes(marker), `packaged template lost ${marker}`);
    assert.ok(body(sourceHtml).includes(marker), `source capture is missing ${marker}`);
  }
  assert.equal(normalize(readFileSync(new URL("template.css", root), "utf8")), normalize(readFileSync(new URL("template.css", capture), "utf8")));
  for (const asset of ["art/astrolabe.webp", "art/poster-galaxy.webp"]) {
    assert.deepEqual(readFileSync(new URL(asset, root)), readFileSync(new URL(asset, capture)), `${asset} must preserve the captured artwork`);
  }
  assert.deepEqual(readFileSync(new URL("preview.webp", root)), readFileSync(new URL("art/poster-galaxy.webp", capture)), "catalog art must show the full source opening poster");
  for (const asset of ["fonts/exo2-300.ttf", "fonts/exo2-400.ttf", "fonts/exo2-500.ttf", "fonts/forum-400.ttf"]) assert.ok(existsSync(new URL(asset, root)), `${asset} missing`);
  assert.doesNotMatch(html, /fonts\.googleapis\.com|sample-invitation/);
  assert.match(html, /shared\/nikoh\/platform-bridge\.js/);
  assert.match(html, /shared\/nikoh\/core\.js/);
  assert.match(html, /id="dresscode"[\s\S]*?data-slot="dressCode\.style"[\s\S]*?data-slot="dressCode\.text"[\s\S]*?data-slot="dressCode\.note"/);
});

test("Somon Yo‘li receives locale-specific program data through the shared renderer", () => {
  const renderer = readFileSync(new URL("../apps/web/src/templates/marxaba/renderer.tsx", import.meta.url), "utf8");
  const runtime = readFileSync(new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url), "utf8");
  assert.match(renderer, /program:\s*localized\.program/);
  assert.match(runtime, /data\.i18n\?\.\[lang\]\?\.program/);
});

test("Somon Yo‘li binds scene names to invitation content and loads packaged Three.js", () => {
  const script = readFileSync(new URL("template.js", root), "utf8");
  assert.ok(script.includes("data.i18n?.[window.Marhamat?.lang]?.groom || data.groom || ''"));
  assert.ok(script.includes("data.i18n?.[window.Marhamat?.lang]?.bride || data.bride || ''"));
  assert.doesNotMatch(script, /Javohir|Madina/);
  assert.ok(script.includes("../shared/nikoh/vendor/three/three.bundle.min.js"));
  assert.match(script, /reduced\(\)/);
});
