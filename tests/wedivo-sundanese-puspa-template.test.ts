import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const pkg = new URL("../apps/web/public/templates/wedivo-sundanese-puspa/", import.meta.url);
const capture = new URL("../Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Wedivo/Web invitations/templates/5PsJ7Q60mxwx5sKxkGSY/index.html", import.meta.url);

test("packages the captured embedded design with local fonts and art, without invitation demo records", async () => {
  const [html, bridge, bootstrap, fontCss, original] = await Promise.all([
    readFile(new URL("source/index.html", pkg), "utf8"),
    readFile(new URL("source/bridge.js", pkg), "utf8"),
    readFile(new URL("source/bootstrap.js", pkg), "utf8"),
    readFile(new URL("source/fonts.css", pkg), "utf8"),
    readFile(capture, "utf8"),
  ]);
  assert.match(original, /id="wedivo-parameters"/);
  assert.match(html, /source\/bootstrap\.js/);
  assert.match(html, /source\/fonts\.css/);
  assert.match(html, /var galleryUrls = window\.__WEDIVO_GALLERY__/);
  assert.doesNotMatch(html, /wedivo-parameters|wedivo-preview-stub|AIzaSy|ChIJA9|templateBridePhoto|templateGroomPhoto|prewedding\//);
  assert.doesNotMatch(html, /Aulia|Bagas|Sarah|Cihampelas|Mr\. & Mrs\. (?:Wijaya|Pratama)|2027-06-12/);
  assert.doesNotMatch(fontCss, /https?:\/\//);
  for (const family of ["Ballet", "Gilda Display", "Italiana", "Lora", "Noto Sans Sundanese"]) assert.match(fontCss, new RegExp(`font-family:'${family}'`));
  for (const name of ["1792019131_0e4e8aaa.jpg", "1792019131_fc60ef73.jpg", "1792019168_5e59eb97.jpg", "1792019169_9a85ba34.jpg", "1792019208_e2bcacee.jpg", "1792019219_100edecb.jpg", "1792019261_0e3f44fa.jpg"]) {
    const asset = await readFile(new URL(`assets/${name}`, pkg));
    assert.ok(asset.byteLength > 1000, `${name} should be a fetched local image`);
  }
  assert.match(bridge, /prefers-reduced-motion/);
  assert.match(bootstrap, /data-e2-date/);
});

test("binds source sections and submits only through platform RSVP, wishes, and receipt services", async () => {
  const [bridge, renderer, adapter, extras] = await Promise.all([
    readFile(new URL("source/bridge.js", pkg), "utf8"),
    readFile(new URL("../../../src/templates/wedivo-sundanese-puspa/renderer.tsx", pkg), "utf8"),
    readFile(new URL("../../../src/templates/wedivo-sundanese-puspa/adapter.ts", pkg), "utf8"),
    readFile(new URL("../shared/editor-sections.js", pkg), "utf8"),
  ]);
  assert.match(bridge, /rsvp-pax/);
  assert.match(bridge, /partySize:map\[status\]==="yes"\?1:0/);
  assert.match(bridge, /\/rsvp`/);
  assert.match(bridge, /\/wishes`/);
  assert.match(bridge, /\/wishes`/);
  assert.match(bridge, /show\("sec-video",false\)/);
  assert.match(bridge, /show\("sec-dresscode",!!d\.dressCode\?\.enabled\)/);
  assert.match(bridge, /show\("sec-gallery",gallery\.length>0\)/);
  assert.match(bridge, /\$\("#gift-form"\)\?\.remove\(\)/);
  assert.match(renderer, /receiptHostSelector:"#gifts-div-9"/);
  assert.match(extras, /\/receipts/);
  assert.match(adapter, /sampleWishes/);
  assert.match(adapter, /options\.preview&&options\.sampleWishes/);
});
