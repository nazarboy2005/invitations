import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const runtime = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url),
  "utf8",
);

test("template previews provide icon-only Lahzalar entries without photo substitutes", () => {
  const sample = createTemplatePreviewSample("oq-kabutar");
  assert.equal(sample.gallery.length, 6);
  assert.ok(sample.gallery.every(({ url, alt, caption }) => !url && !alt && !caption));
  assert.deepEqual(createTemplatePreviewSample("anor").gallery, sample.gallery);
});

test("late preview data binds the captured gallery placeholders and carousel", () => {
  assert.match(runtime, /renderLists\(\);bindPhotos\(\);setupGallery\(\)/);
  assert.match(runtime, /placeholder\.textContent='✦'/);
  assert.match(runtime, /const alt=valueText\(item\.alt\)\|\|L\.galleryAlt/);
  assert.match(runtime, /image\.alt=source\?alt:''/);
  assert.match(runtime, /index=\(number\+state\.items\.length\) % state\.items\.length/);
  assert.match(runtime, /behavior: reducedMotion\?'instant':'smooth'/);
  assert.match(runtime, /left>=max-1\?current\.length-1/);
  assert.equal((runtime.match(/galleryAlt:\(g,b,i\)=>g&&b\?/g) ?? []).length, 3);
  assert.match(runtime, /g\|\|b\|\|"Surat"/);
  assert.match(runtime, /g\|\|b\|\|"Photo"/);
});
