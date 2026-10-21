import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const appRoot = new URL("../apps/web/public/templates/anor/source/", import.meta.url);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/anor/",
  import.meta.url,
);
const normalize = (value: string) => value.replace(/\r\n/g, "\n");

function gallerySection(html: string) {
  return html.match(/<section class="section gallery"[\s\S]*?<\/section>/)?.[0] ?? "";
}

test("Anor keeps the complete captured Lahzalar markup and gallery behavior", () => {
  const appHtml = readFileSync(new URL("index.html", appRoot), "utf8");
  const sourceHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  assert.equal(
    normalize(gallerySection(appHtml)),
    normalize(gallerySection(sourceHtml)),
    "the complete Lahzalar section must come from the captured template",
  );
  assert.equal(
    normalize(readFileSync(new URL("template.css", appRoot), "utf8")),
    normalize(readFileSync(new URL("template.css", captureRoot), "utf8")),
  );
  assert.equal(
    normalize(readFileSync(new URL("template.js", appRoot), "utf8")),
    normalize(readFileSync(new URL("template.js", captureRoot), "utf8")),
  );

  const bridge = readFileSync(new URL("bridge.js", appRoot), "utf8");
  assert.match(bridge, /gallery:\s*config\.preview\s*\|\|\s*data\.gallery\?\.length/);
  assert.match(bridge, /placeholder\.textContent = "✦"/);
  assert.match(bridge, /slides\[\(current \+ direction \+ slides\.length\) % slides\.length\]/);
  assert.match(bridge, /behavior: app\.reducedMotion \? "auto" : "smooth"/);
  assert.match(bridge, /image\.setAttribute\("aria-hidden", "true"\)/);
});
