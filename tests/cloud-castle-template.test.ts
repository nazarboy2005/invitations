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
const sourceCapture = new URL("../Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/cloud-castle/preview-frame.html", import.meta.url);
const sourceGift = new URL("../Invitations - this folder will be removed from production/Chorlove/Web invitations/images/cloud-castle/gift/gift.webp", import.meta.url);
const packagedGift = new URL("../apps/web/public/templates/cloud-castle/assets/gift/gift.webp", import.meta.url);
const optionalSourceText = async (url: URL) => readFile(url, "utf8").catch((error: NodeJS.ErrnoException) => error.code === "ENOENT" ? null : Promise.reject(error));

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
  const compiledModule = await readFile(pageModule).catch((error: NodeJS.ErrnoException) => error.code === "ENOENT" ? null : Promise.reject(error));
  if (compiledModule) {
    assert.equal(details.pageModule.bytes, compiledModule.length);
    assert.equal(details.pageModule.sha256, createHash("sha256").update(compiledModule).digest("hex"));
  }
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

test("Cloud Castle guestbook retains the source scroll pane, wish control and card metadata", async () => {
  const [original, packaged, js] = await Promise.all([optionalSourceText(sourceCapture), readFile(source, "utf8"), readFile(bridge, "utf8")]);
  if (original) {
    assert.match(original, /mt-8 w-full max-h-\[500px\] space-y-3 overflow-y-auto pr-2 mx-auto max-w-full md:max-w-\[600px\]/);
    assert.match(original, /rounded-xl border p-4 text-sm shadow-sm transition-all hover:border-\[#123467\]\/40/);
    assert.match(original, /title="Generate wish with AI"/);
  }
  assert.match(packaged, /max-h-\[500px\] space-y-3 overflow-y-auto pr-2 mx-auto max-w-full md:max-w-\[600px\]" data-chorlove-wish-list=""/);
  assert.match(js, /wish\.submittedAt \|\| wish\.createdAt \|\| wish\.date/);
  assert.match(js, /text-xs opacity-65/);
  assert.match(js, /mt-2 text-sm leading-relaxed text-\[#123467\]/);
  assert.doesNotMatch(js, /magicButton\.hidden/);
});

test("Cloud Castle RSVP omits party count and sends fixed party size", async () => {
  const [original, js] = await Promise.all([optionalSourceText(sourceCapture), readFile(bridge, "utf8")]);
  if (original) assert.doesNotMatch(original, /partySize|Kiyinish uslubi/i);
  assert.doesNotMatch(js, /className = "cc-party-size"|select\.name = "partySize"/);
  assert.match(js, /partySize: selected\.dataset\.chorloveRsvp === "yes" \? 1 : 0/);
  assert.match(js, /data-platform-extra="dress"/);
});

test("Cloud Castle gift modal matches source interaction, card styling and image", async () => {
  const [original, packaged, js, compiled, packageArt, provenanceText] = await Promise.all([
    optionalSourceText(sourceCapture), readFile(source, "utf8"), readFile(bridge, "utf8"), optionalSourceText(pageModule), readFile(packagedGift), readFile(provenance, "utf8"),
  ]);
  const details = JSON.parse(provenanceText);
  assert.equal(createHash("sha256").update(packageArt).digest("hex"), details.sourceBehavior.giftDisclosure.imageSha256);
  if (compiled && original) {
    const sourceGiftBytes = await readFile(sourceGift);
    assert.equal(createHash("sha256").update(packageArt).digest("hex"), createHash("sha256").update(sourceGiftBytes).digest("hex"));
    assert.match(original, /aria-label="Open gift box"/);
    assert.match(compiled, /bg-black\/75 backdrop-blur-sm p-4 select-none/);
    assert.match(compiled, /initial:\{opacity:0,scale:\.92,y:20\},animate:\{opacity:1,scale:1,y:0\},exit:\{opacity:0,scale:\.92,y:20\},transition:\{duration:\.25\}/);
    assert.match(compiled, /Copy Card Number/);
    assert.match(compiled, /\/images\/cloud-castle\/gift\/gift\.webp/);
  }
  assert.match(packaged, /data-chorlove-gift/);
  assert.match(js, /Bank Card/);
  assert.match(js, /Copy Card Number/);
  assert.match(js, /data-cc-gift-dialog/);
  assert.match(js, /scale\(\.92\) translateY\(20px\)/);
  assert.match(js, /navigator\.clipboard\?\.writeText/);
  assert.match(js, /aria-modal/);
  assert.match(js, /className = "fixed inset-0 z-\[130\] flex items-center justify-center bg-black\/75 backdrop-blur-sm p-4 select-none"/);
  assert.match(js, /overlay\.style\.width = "100vw"/);
  assert.match(js, /dialog\.tabIndex = -1/);
  assert.match(js, /dialog\.focus\(\)/);
  assert.doesNotMatch(js, /close\.focus\(\)/);
});

test("Cloud Castle opening and hero motion follow the captured page module", async () => {
  const js = await readFile(bridge, "utf8");
  const source = await optionalSourceText(pageModule);
  if (source) {
  assert.match(source, /duration:\.6,delay:\.45\*!!i/);
  assert.match(source, /duration:2,repeat:1\/0,ease:"easeInOut"/);
  assert.match(source, /duration:3,repeat:1\/0,ease:"easeInOut"/);
  assert.match(source, /duration:\.85,ease:"easeOut"/);
  assert.match(source, /x:\{duration:e\.duration\/2,repeat:1\/0,repeatType:"reverse",ease:"easeInOut"\}/);
  assert.match(source, /y:\[0,-6,0\],rotate:\[-22,-18,-22\].*duration:3\.2/);
  assert.match(source, /y:\[0,-7,0\],rotate:\[20,24,20\].*duration:3\.6/);
  assert.match(js, /Array\.from|index < 32/);
  assert.match(js, /duration: 2000, iterations: Infinity/);
  assert.match(js, /duration: 3000, iterations: Infinity/);
  assert.match(js, /inner\.animate\(\[\{ translate: "0 0" \}, \{ translate: `\$\{sway\}px 0` \}, \{ translate: "0 0" \}\], \{ duration: duration \* 500, direction: "alternate", iterations: Infinity, easing: "ease-in-out" \}\)/);
  assert.match(js, /inner\.animate\(\[\{ rotate: "0deg" \}, \{ rotate: "360deg" \}\], \{ duration: duration \* 1000, iterations: Infinity, easing: "linear" \}\)/);
  assert.match(js, /outer\.style\.opacity = String\(item\.opacity\)/);
  assert.doesNotMatch(js, /inner\.animate\(\[\{ opacity \}, \{ opacity: 0\.8 \* opacity \}, \{ opacity \}\]/);
  assert.match(js, /outer\.animate\(\[\{ opacity \}, \{ opacity: 1, offset: 0\.5 \}, \{ opacity: 0 \}\], \{ duration: 850, easing: "ease-out", fill: "forwards" \}\)/);
  assert.match(js, /\[style\*="opacity:0"\]:not\(\.cc-source-petal\), \[style\*="opacity: 0"\]:not\(\.cc-source-petal\)/);
  assert.match(js, /duration: 800, easing: "cubic-bezier\(\.22,1,\.36,1\)"/);
  assert.match(js, /clouds\.forEach\(\(cloud\) => \{ cloud\.style\.transform = "none"; \}\)/);
  assert.match(js, /if \(castle\) castle\.style\.transform = "none"/);
  assert.match(js, /duration: 600, delay: 450/);
  assert.match(js, /-90 \+ 330 \* progress/);
  assert.match(js, /145 - 405 \* progress/);
  assert.match(js, /-320 \+ 510 \* progress/);
  assert.match(js, /"qasr_green\.webp": \[6, -22, -18, 3\.2, 0\]/);
  assert.match(js, /"spring_garden_red\.webp": \[5, -14, -10, 3\.3, 0\.1\]/);
  assert.match(source, /duration:\.45,delay:\.09\*i,ease:\[\.22,1,\.36,1\]/);
  assert.match(source, /duration:\.55,delay:\.12\+\.1\*a,ease:"easeOut"/);
  assert.match(source, /duration:1,delay:e,ease:\[\.22,1,\.36,1\]/);
  }
  assert.match(js, /function sourceRevealProfile\(element\)/);
  assert.match(js, /threshold: \[0\.2, 0\.3, 0\.35, 0\.5\]/);
  assert.match(js, /function animateSourceReveal\(element, inView, initialOpacity, initialTransform, targetOpacity, duration, delay, easing\)/);
  assert.match(js, /: \{ opacity: initialOpacity, transform: initialTransform \}/);
  assert.match(js, /element\.dataset\.ccRevealVisible = String\(inView\)/);
  assert.match(js, /duration: 0\.45, threshold: 0\.2/);
  assert.match(js, /duration: 0\.55, threshold: 0\.3/);
  assert.match(js, /duration: 1, threshold: 0\.5/);
  assert.match(js, /\[0\.06, 0\.14, 0\.22, 0\.3, 0\.38\]/);
  assert.match(js, /0\.09 \* Math\.max\(0, programIndex - 1\)/);
  assert.match(js, /index === 1 \? 0\.08 : 0\.14/);
  assert.match(js, /data-cc-contact-group/);
  assert.match(js, /data-chorlove-i18n="contactsTitle"/);
  assert.match(js, /hoa-ngang\.webp.*py-2/);
  assert.doesNotMatch(js, /threshold: \[0\.2, 0\.3, 0\.5\]/);
  assert.doesNotMatch(js, /Math\.min\(sequence\+\+ \* 30, 360\)/);
  assert.doesNotMatch(js, /\{ threshold: 0\.16 \}/);
  assert.match(js, /prefers-reduced-motion/);
});
