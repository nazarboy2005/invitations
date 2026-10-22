import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const root = new URL("../apps/web/public/templates/green-garden/", import.meta.url);

test("Green Garden keeps its original capture byte-for-byte", async () => {
  const source = await readFile(new URL("source/preview-frame.html", root));
  const manifest = JSON.parse(await readFile(new URL("source-assets.provenance.json", root), "utf8"));
  assert.equal(createHash("sha256").update(source).digest("hex"), manifest.preservedCapture.sha256);
  assert.equal(source.length, manifest.preservedCapture.bytes);
});

test("Green Garden preview capture matches its canonical fixture provenance", async () => {
  const image = await readFile(new URL("preview-browser-capture.jpg", root));
  const provenance = JSON.parse(await readFile(new URL("preview.provenance.json", root), "utf8"));
  const fixture = await readFile(new URL("../apps/web/src/modules/catalog/preview-sample.json", import.meta.url));
  assert.equal(createHash("sha256").update(image).digest("hex"), provenance.sha256);
  assert.equal(createHash("sha256").update(fixture).digest("hex"), provenance.fixtureSha256);
  assert.equal(provenance.width, 390);
  assert.equal(provenance.height, 720);
  assert.equal(provenance.captureMethod.includes("ChatGPT in-app browser"), true);
});

test("Green Garden app page excludes reference sample content and runtime", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  for (const sample of ["Muhammad", "Xadicha", "Abdurahmonovlar", "Azizbek", "orchid-amplop", "unsplash.com", "chorlove.uz", "leaf1-bloom.webp", "welcome.webp", "cake.webp"]) {
    assert.equal(html.toLowerCase().includes(sample.toLowerCase()), false, `unexpected source content: ${sample}`);
  }
  assert.match(html, /data-chorlove-template="green-garden"/);
  assert.match(html, /data-gg-rsvp-form/);
  assert.match(html, /data-gg-wish-form/);
  assert.match(html, /data-gg-program-item/);
  assert.match(html, /bridge\.js/);
  assert.doesNotMatch(html, /<script[^>]+src="\/_next\//);
});

test("Green Garden bridge uses the shared contract and supported services", async () => {
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  for (const field of ["groom", "bride", "eventType", "program", "gallery", "venue", "contacts", "rsvp", "wishesEnabled", "toyona", "dateTime"]) {
    assert.match(bridge, new RegExp(`d\\.${field}`));
  }
  assert.match(bridge, /data\.music/);
  assert.match(bridge, /"wishes"/);
  assert.match(bridge, /"rsvp"/);
  assert.match(bridge, /prefers-reduced-motion/);
  assert.match(bridge, /:language/);
  assert.match(bridge, /venueTitle/);
  assert.match(bridge, /responseLabel/);
  assert.match(bridge, /party\.setAttribute\("aria-label",c\.party\)/);
  assert.match(bridge, /data-gg-countdown/);
  assert.match(bridge, /data-gg-lightbox/);
  assert.match(bridge, /calendar\.google\.com/);
  assert.match(bridge, /api\/public\/invitations/);
  assert.doesNotMatch(bridge, /AI yordamida/);
});

test("Green Garden local asset references resolve within its package", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const refs = [...html.matchAll(/(?:src|url\()=["']?(\/templates\/green-garden\/[^"')\s]+)/g)].map((match) => match[1]);
  const files = await readdir(new URL(".", root), { recursive: true });
  const publicPrefix = "/templates/green-garden/";
  for (const ref of refs) {
    const relative = ref.slice(publicPrefix.length).replaceAll("/", path.sep);
    assert.ok(files.includes(relative) || relative.startsWith(`assets${path.sep}`), `missing package reference ${ref}`);
  }
});
