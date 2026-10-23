import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { templateById } from "@taklifnoma/contracts";

const source = new URL("../apps/web/public/templates/cloud-castle/index.html", import.meta.url);
const bridge = new URL("../apps/web/public/templates/cloud-castle/bridge.js", import.meta.url);
const preview = new URL("../apps/web/public/templates/cloud-castle/preview-opening.png", import.meta.url);
const provenance = new URL("../apps/web/public/templates/cloud-castle/source/provenance.json", import.meta.url);
const pageModule = new URL("../Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/14t58uni224ve.js", import.meta.url);

test("Cloud Castle is published for weddings independently of category", () => {
  const template = templateById("cloud-castle");
  assert.equal(template?.published, true);
  assert.deepEqual(template?.categoryIds, ["wedding"]);
  assert.deepEqual(template?.supportedEventTypes, ["wedding"]);
  assert.equal(template?.previewImage, "/templates/cloud-castle/preview-opening.png");
});

test("Cloud Castle catalog artwork is a clean portrait capture with recorded provenance", async () => {
  const image = await readFile(preview);
  const details = JSON.parse(await readFile(provenance, "utf8"));
  assert.equal(details.catalogArtwork.sha256, createHash("sha256").update(image).digest("hex"));
  assert.equal(details.catalogArtwork.file, "../preview-opening.png");
  assert.equal(details.catalogArtwork.dimensions, "720x1280");
  assert.equal(details.catalogArtwork.aspectRatio, "9:16");
  assert.deepEqual(details.catalogArtwork.uiChromeRemoved, ["language selector", "music control", "browser scrollbar"]);
  assert.match(details.catalogArtwork.provenanceLimit, /compiled page component/);
  const compiledModule = await readFile(pageModule);
  assert.equal(details.pageModule.bytes, compiledModule.length);
  assert.equal(details.pageModule.sha256, createHash("sha256").update(compiledModule).digest("hex"));
  assert.equal(details.pageModule.moduleId, 909129);
  assert.equal(details.pageModule.packagedAsSiteRuntime, false);
});

test("Cloud Castle package contains only sanitized markup and no captured website runtime", async () => {
  const html = await readFile(source, "utf8");
  for (const capturedValue of ["Muhammad", "Xadicha", "Abdurahmonovlar", "Azizbek", "Madina", "chorlove.uz", "orchid-amplop", "Patrick Watson"]) {
    assert.equal(html.includes(capturedValue), false, `unexpected captured value: ${capturedValue}`);
  }
  assert.equal(/<script[^>]+src="\/_next\//.test(html), false);
  assert.equal(/<script[^>]+src="https?:/.test(html), false);
  assert.equal(/<iframe/i.test(html), false);
  assert.equal(/(?:src|href)="https?:/i.test(html), false);
  assert.match(html, /data-chorlove-template="cloud-castle"/);
  assert.match(html, /data-chorlove-story/);
  assert.match(html, /data-chorlove-i18n="openInvitation"/);
  assert.match(html, /data-chorlove-gallery-item/);
  assert.match(html, /data-chorlove-rsvp/);
});

test("Cloud Castle bridge maps the shared data and existing RSVP/wish services", async () => {
  const js = await readFile(bridge, "utf8");
  for (const field of ["groom", "bride", "eventType", "program", "gallery", "story", "toyona", "contacts"]) {
    assert.match(js, new RegExp(`data\\.${field}`));
  }
  assert.match(js, /\/wishes/);
  assert.match(js, /\/rsvp/);
  assert.match(js, /usableGallery/);
  assert.match(js, /musicToggleLabel/);
  assert.match(js, /languageLabel/);
  assert.match(js, /prefers-reduced-motion/);
});

test("Cloud Castle opening and hero motion follow the captured page module", async () => {
  const js = await readFile(bridge, "utf8");
  const source = await readFile(pageModule, "utf8");
  assert.match(source, /duration:\.6,delay:\.45\*!!i/);
  assert.match(source, /duration:2,repeat:1\/0,ease:"easeInOut"/);
  assert.match(source, /duration:3,repeat:1\/0,ease:"easeInOut"/);
  assert.match(source, /duration:\.85,ease:"easeOut"/);
  assert.match(source, /y:\[0,-6,0\],rotate:\[-22,-18,-22\].*duration:3\.2/);
  assert.match(source, /y:\[0,-7,0\],rotate:\[20,24,20\].*duration:3\.6/);
  assert.match(js, /Array\.from|index < 32/);
  assert.match(js, /duration: 2000, iterations: Infinity/);
  assert.match(js, /duration: 3000, iterations: Infinity/);
  assert.match(js, /duration: duration \* 1000, delay: delay \* 1000, iterations: Infinity, easing: "ease-in-out"/);
  assert.doesNotMatch(js, /duration: duration \* 500, delay: delay \* 1000, iterations: Infinity/);
  assert.match(js, /duration: 800, easing: "cubic-bezier\(\.22,1,\.36,1\)"/);
  assert.match(js, /duration: 600, delay: 450/);
  assert.match(js, /-90 \+ 330 \* progress/);
  assert.match(js, /145 - 405 \* progress/);
  assert.match(js, /-320 \+ 510 \* progress/);
  assert.match(js, /"qasr_green\.webp": \[6, -22, -18, 3\.2, 0\]/);
  assert.match(js, /"spring_garden_red\.webp": \[5, -14, -10, 3\.3, 0\.1\]/);
  assert.match(source, /duration:\.45,delay:\.09\*i,ease:\[\.22,1,\.36,1\]/);
  assert.match(source, /duration:\.55,delay:\.12\+\.1\*a,ease:"easeOut"/);
  assert.match(source, /duration:1,delay:e,ease:\[\.22,1,\.36,1\]/);
  assert.match(js, /function sourceRevealProfile\(element\)/);
  assert.match(js, /duration: 0\.45, threshold: 0\.2/);
  assert.match(js, /duration: 0\.55, threshold: 0\.3/);
  assert.match(js, /duration: 1, threshold: 0\.5/);
  assert.match(js, /\[0\.06, 0\.14, 0\.22, 0\.3, 0\.38\]/);
  assert.match(js, /0\.09 \* Math\.max\(0, programIndex - 1\)/);
  assert.match(js, /index === 1 \? 0\.08 : 0\.14/);
  assert.match(js, /data-cc-contact-group/);
  assert.match(js, /data-chorlove-i18n="contactsTitle"/);
  assert.match(js, /hoa-ngang\.webp.*py-2/);
  assert.match(js, /threshold: \[0\.2, 0\.3, 0\.5\]/);
  assert.doesNotMatch(js, /Math\.min\(sequence\+\+ \* 30, 360\)/);
  assert.doesNotMatch(js, /\{ threshold: 0\.16 \}/);
  assert.match(js, /prefers-reduced-motion/);
});
