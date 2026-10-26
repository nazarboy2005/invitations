import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { createInvitation, templateById } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = new URL("../apps/web/public/templates/green-white/", import.meta.url);

function packagedSourceFile(archiveFile: string) {
  const file = archiveFile.replace(/^Chorlove\/Web invitations\//, "");
  if (file === "templates/green-white/preview-frame.html") return new URL("source/preview-frame.html", root);
  if (file.startsWith("images/green-white/")) return new URL(`assets/${file.split("/").at(-1)}`, root);
  if (file.startsWith("_next/static/chunks/")) return new URL(`source/styles/${file.split("/").at(-1)}`, root);
  throw new Error(`No packaged source mapping for ${archiveFile}`);
}

test("Green White preserves its captured page and original design assets", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("source-assets.provenance.json", root), "utf8"),
  );
  const source = await readFile(new URL("source/preview-frame.html", root));
  const normalizedSource = Buffer.from(source.toString("utf8").replace(/\r\n/g, "\n"));
  assert.equal(createHash("sha256").update(normalizedSource).digest("hex"), manifest.source.sha256);
  assert.equal(normalizedSource.length, manifest.source.bytes);

  for (const asset of manifest.copiedDesignAssets) {
    const bytes = await readFile(new URL(asset.file, root));
    assert.equal(bytes.length, asset.bytes, asset.file);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256, asset.file);
  }
  for (const style of manifest.capturedStylesheets) {
    const bytes = await readFile(new URL(style.file, root));
    const normalized = Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"));
    assert.equal(normalized.length, style.bytes, style.file);
    assert.equal(createHash("sha256").update(normalized).digest("hex"), style.sha256, style.file);
  }
  assert.equal(manifest.copiedDesignAssets.length, 9);
  assert.deepEqual(manifest.missingSourceAssets, []);
  assert.deepEqual(manifest.archiveMissingAssets, ["images/green-white/arka2.webp"]);
  const recovered = manifest.sourceAssetsFromLive.find((asset: { file: string }) => asset.file === "assets/arka2.webp");
  assert.ok(recovered);
  const recoveredBytes = await readFile(new URL(recovered.file, root));
  assert.equal(recoveredBytes.length, recovered.bytes);
  assert.equal(createHash("sha256").update(recoveredBytes).digest("hex"), recovered.sha256);
  assert.equal(recovered.mimeType, "image/webp");
  assert.match(recovered.sourceUrl, /chorlove\.uz\/images\/green-white\/arka2\.webp$/);
  for (const font of manifest.capturedFonts) {
    const bytes = await readFile(new URL(font.file.slice(1), new URL("../../", root)));
    assert.equal(bytes.length, font.bytes, font.file);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), font.sha256, font.file);
  }
  const motion = await readFile(new URL("source/12pjntsqxzj70.js", root));
  assert.equal(motion.length, manifest.motionSource.pageModuleBytes);
  assert.equal(createHash("sha256").update(motion).digest("hex"), manifest.motionSource.sha256);
});

test("Green White source gallery photos are preview-only and byte-identical to the capture", async () => {
  const sourceTemplate = new URL(
    "../Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/green-white/preview-frame.html",
    import.meta.url,
  );
  const sourceHtml = await readFile(sourceTemplate, "utf8");
  const galleryStart = sourceHtml.indexOf("Galereya");
  const galleryEnd = sourceHtml.indexOf("</section>", galleryStart);
  assert.ok(galleryStart >= 0 && galleryEnd > galleryStart);
  const capturedGallery = sourceHtml.slice(galleryStart, galleryEnd);
  const capturedFiles = [...capturedGallery.matchAll(/\/images\/templates\/orchid-amplop\/(gallery-[1-6]\.webp)/g)].map((match) => match[1]);
  assert.deepEqual(capturedFiles, ["gallery-2.webp", "gallery-1.webp", "gallery-3.webp", "gallery-6.webp", "gallery-4.webp", "gallery-5.webp"]);

  const preview = createTemplatePreviewSample("green-white");
  assert.deepEqual(preview.gallery.map((photo) => photo.url), capturedFiles.map((file) => `/templates/chorlove/orchid-amplop/assets/${file}`));
  const sourceAssets = new URL("../Invitations - this folder will be removed from production/Chorlove/Web invitations/images/templates/orchid-amplop/", import.meta.url);
  const packageAssets = new URL("../apps/web/public/templates/chorlove/orchid-amplop/assets/", import.meta.url);
  for (const file of [...new Set(capturedFiles)]) {
    const sourceBytes = await readFile(new URL(file, sourceAssets));
    const packageBytes = await readFile(new URL(file, packageAssets));
    assert.deepEqual(packageBytes, sourceBytes, file);
  }
  assert.deepEqual(createInvitation("green-white").gallery, []);
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  assert.match(bridge, /const photos = gallery\.filter\(\(photo\) => photo\?\.src\)/);
  assert.match(bridge, /hide\(node, !photos\.length\)/);
});

test("Green White runtime is isolated and maps the captured sections to the shared contract", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const names = (html.match(/<section\b/g) || []).length;
  assert.equal(names, 14);
  assert.match(html, /data-chorlove-template="green-white"/);
  assert.match(html, /src="\/templates\/green-white\/bridge\.js"/);
  assert.doesNotMatch(html, /<script[^>]+_next\/static|googletagmanager|telegram\.org\/js|Patrick Watson/i);
  assert.doesNotMatch(html, /orchid-amplop|gallery-[1-6]\.webp|chorlove\.uz|Muhammad|Xadicha|5614/);
  assert.equal((html.match(/src="\/templates\/green-white\/assets\//g) || []).length, 58);
  assert.match(html, /src="\/templates\/green-white\/assets\/arka2\.webp"/);
  assert.match(html, /source\/styles\/0ly1y_qxlqlf\.\.css/);
  assert.match(html, /source\/styles\/054~-i6~6lmrd\.css/);
  assert.match(bridge, /dressCode/);
  assert.match(bridge, /navigator\.clipboard\.writeText/);
  assert.match(bridge, /\/api\/public\/invitations\/.*\/\$\{kind\}/);
  assert.match(bridge, /encodeURIComponent\(payload\.invitationId/);
  assert.match(bridge, /prefers-reduced-motion/);
  assert.doesNotMatch(bridge, /createElement\("select"\).*partySize|\[name="partySize"\]/);
  assert.match(bridge, /partySize: choice \? 0 : 1/);
  assert.match(bridge, /button\.querySelector\(":scope > span:last-child"\), i \? c\.no : c\.yes\)/);
  assert.doesNotMatch(bridge, /tx\(button\.querySelector\("span"\), i \? c\.no : c\.yes\)/);
  assert.match(bridge, /\$\{id\}:language/);
  assert.match(bridge, /const photos = gallery\.filter\(\(photo\) => photo\?\.src\)/);
  assert.match(bridge, /hide\(node, !photos\.length\)/);
  assert.match(bridge, /dialog\.className = "yarl__portal gw-source-lightbox"/);
  assert.match(bridge, /function showLightbox[\s\S]*?let image = document\.createElement\("img"\)/);
  assert.match(bridge, /index = \(nextIndex \+ items\.length\) % items\.length/);
  assert.match(bridge, /button\.className = "yarl__thumbnails_thumbnail"/);
  assert.match(bridge, /sidePadding = Math\.max\(0, \(thumbnailContainer\.clientWidth - activeThumbnail\.offsetWidth\) \/ 2\)/);
  assert.match(bridge, /new DOMMatrixReadOnly\(transform\)\.m41/);
  assert.match(bridge, /thumb\.left \+ thumb\.width \/ 2 - \(viewport\.left \+ viewport\.width \/ 2\)/);
  assert.match(bridge, /thumbnailTrack\.style\.transform = `translateX\(\$\{currentX - centerDelta\}px\)`/);
  assert.match(bridge, /requestAnimationFrame\(\(\) => \{[\s\S]*show\(start\)/);
  assert.match(bridge, /: 250/);
  assert.match(bridge, /event\.key === "ArrowLeft"/);
  assert.match(bridge, /event\.key === "ArrowRight"/);
  assert.match(bridge, /event\.key === "Home"/);
  assert.match(bridge, /const slideshow = makeButton\("Play"/);
  assert.match(bridge, /slideshow\.onclick = \(\) => setSlideshowPlaying\(!slideshowPlaying\)/);
  assert.match(bridge, /slideshowTimer = window\.setTimeout\([\s\S]*?1500/);
  assert.match(bridge, /slide\.addEventListener\("pointermove"/);
  assert.match(bridge, /slide\.style\.setProperty\("--yarl__carousel_padding_px", "16"\)/);
  assert.match(bridge, /const spacing = width \* 0\.3/);
  assert.doesNotMatch(bridge, /requestFullscreen|fullscreen\.onclick|document\.fullscreenElement/);
  assert.match(bridge, /dialog\.addEventListener\("click".*closeLightbox\(\)/);
  assert.match(bridge, /dialog\.addEventListener\("cancel".*closeLightbox\(\)/);
  assert.match(bridge, /button\.onclick = \(\) => parent\.postMessage\(\{ type: `\$\{id\}:language`, locale \}, location\.origin\)/);
  assert.match(bridge, /\$\{id\}:update/);
  const publicRoot = new URL("../apps/web/public/", import.meta.url);
  const dependencies = [...html.matchAll(/(?:src|href)="(\/templates\/[^"#]+)"/g)].map((match) => match[1]);
  for (const dependency of dependencies) {
    await readFile(new URL(dependency.slice(1), publicRoot));
  }
});

test("Green White RSVP localizes the source label span without replacing its radio indicator", async () => {
  const source = await readFile(new URL("source/preview-frame.html", root), "utf8");
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  assert.match(source, /<span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-green-700\/35"><\/span><span class="text-sm font-medium text-green-900">Kelaman<\/span>/);
  assert.match(source, /<span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-green-700\/35"><\/span><span class="text-sm font-medium text-green-900">Kela olmayman<\/span>/);
  assert.match(bridge, /tx\(button\.querySelector\(":scope > span:last-child"\), i \? c\.no : c\.yes\)/);
  assert.match(bridge, /partySize: choice \? 0 : 1/);
});

test("Green White motion follows the archived source page module", async () => {
  const manifest = JSON.parse(await readFile(new URL("source-assets.provenance.json", root), "utf8"));
  const motion = manifest.motionSource;
  const gallerySource = manifest.gallerySource;
  assert.ok(motion);
  assert.deepEqual(gallerySource.pluginModuleIds, {
    zoom: 126187,
    counter: 403118,
    slideshow: 282955,
    thumbnails: 99388,
  });
  assert.equal(gallerySource.fullscreenPluginIncluded, false);
  assert.deepEqual(gallerySource.slideshow, { autoplay: false, delayMs: 1500 });
  const sourceModule = await readFile(new URL(motion.preservedFile, root));
  const galleryChunk = await readFile(new URL(gallerySource.preservedFile, root));
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const styles = await readFile(new URL("adapter.css", root), "utf8");
  assert.match(bridge, /carousel\.className = "yarl__carousel yarl__carousel_with_slides"/);
  assert.match(bridge, /carousel\.append\(slide\)/);
  assert.match(bridge, /container\.append\(counter, toolbar, previous, carousel, next\)/);
  assert.equal(sourceModule.length, 36961);
  assert.equal(createHash("sha256").update(sourceModule).digest("hex"), motion.sha256);
  assert.equal(galleryChunk.length, gallerySource.bytes);
  assert.equal(createHash("sha256").update(galleryChunk).digest("hex"), gallerySource.sha256);
  assert.deepEqual(gallerySource.carouselDefaults, { paddingPx: 16, spacingPercent: 30, touchAction: "none" });
  assert.deepEqual(gallerySource.thumbnailLayout, {
    containerPaddingPx: 16,
    thumbnailWidthPx: 84,
    thumbnailHeightPx: 56,
    thumbnailBorderPx: 1,
    thumbnailPaddingPx: 0,
    thumbnailGapPx: 8,
    measuredAtViewport: { width: 1280, height: 720 },
    railHeightPx: 89.6,
    slideViewportHeightPx: 630.4,
  });
  assert.deepEqual(gallerySource.swipe, {
    startDistancePx: 30,
    advanceDistanceRatio: 0.3,
    quickFlickDistancePx: 5,
    quickFlickMaxDurationMs: 250,
    animationMs: 250,
    tracksPointerMovement: true,
  });
  assert.match(galleryChunk.toString("utf8"), /padding:"16px",spacing:"30%"/);
  assert.match(galleryChunk.toString("utf8"), /touchAction:"none"/);
  assert.match(galleryChunk.toString("utf8"), /Math\.abs\(a\)>Math\.abs\(o\)&&Math\.abs\(a\)>30/);
  assert.match(galleryChunk.toString("utf8"), /Math\.abs\(t\)>\.3\*a/);
  assert.match(galleryChunk.toString("utf8"), /Math\.abs\(t\)>5&&e<o/);
  assert.match(styles, /\.gw-source-lightbox \.yarl__thumbnails \{[\s\S]*?height: 100%;/);
  assert.match(styles, /\.gw-source-lightbox \.yarl__thumbnails_container \{[\s\S]*?padding: 16px;/);
  assert.doesNotMatch(styles, /\.gw-source-lightbox \.yarl__thumbnails \{[^}]*position: absolute/);
  assert.match(bridge, /thumbnailWrapper\.append\(container\)/);
  assert.match(bridge, /thumbnailBar\.append\(thumbnailWrapper, thumbnailContainer\)/);
  assert.match(bridge, /thumbnailContainer\.clientWidth - activeThumbnail\.offsetWidth/);
  assert.match(sourceModule.toString("utf8"), /whileInView:[^}]+opacity:1/);
  assert.match(sourceModule.toString("utf8"), /duration:11,repeat:1\/0/);
  assert.match(sourceModule.toString("utf8"), /duration:13,repeat:1\/0/);
  assert.match(sourceModule.toString("utf8"), /Array\.from\(\{length:42\}/);
  assert.match(sourceModule.toString("utf8"), /delay:2\.15,duration:\.8/);
  assert.match(bridge, /delay: 1450/);
  assert.match(bridge, /delay: 1650/);
  assert.match(bridge, /duration: 2000/);
  assert.match(bridge, /delay: 2150/);
  assert.match(bridge, /useSlideTransition = Boolean\(direction\) && !motionReduced && items\.length > 1/);
  assert.match(bridge, /const duration = gesture \? getSourceSwipeDuration\(gesture\.offset, gesture\.elapsed, width\) : 250/);
  assert.match(bridge, /const easing = gesture \? "ease-out" : "ease-in-out"/);
  assert.match(bridge, /duration: 125, easing: "ease-out"/);
  assert.match(bridge, /i > index \? -1 : 1/);
  assert.match(bridge, /fadeDuration = motionReduced \? 0 : 250/);
  assert.match(bridge, /dialog\.classList\.remove\("yarl__portal_open"\)/);
  assert.match(bridge, /dialog\.classList\.add\("yarl__portal_open"\)/);
  const durationStart = bridge.indexOf("  function getSourceSwipeDuration(");
  const durationEnd = bridge.indexOf("\n  function showLightbox", durationStart);
  assert.ok(durationStart >= 0 && durationEnd > durationStart);
  const durationFunction = bridge.slice(durationStart, durationEnd);
  const durations = runInNewContext(`${durationFunction}; [getSourceSwipeDuration(400, 50, 1000), getSourceSwipeDuration(40, 50, 1000)]`);
  assert.equal(durations[0], 125);
  assert.equal(durations[1], 240);
  assert.match(bridge, /thumbnailBar\.className = "yarl__thumbnails yarl__thumbnails_bottom"/);
  assert.doesNotMatch(bridge, /direction \* 28px/);
  assert.match(bridge, /11000 : 13000/);
  assert.match(bridge, /duration = 3600 \+ \(index % 7\) \* 550/);
  assert.match(bridge, /threshold: 0\.35/);
  assert.match(bridge, /duration: 950, easing: "cubic-bezier\(\.22,1,\.36,1\)"/);
  assert.match(bridge, /duration: 800, delay: 250, easing: "ease-out"/);
  assert.match(bridge, /duration: 600, easing: "ease-out"/);
  assert.match(bridge, /observeDynamicSourceReveal\(item, \{ duration: 600, easing: "ease-out" \}\)/);
  assert.match(bridge, /new Date\(Date\.UTC\(year, month - 1, 1\)\)\.getUTCDay\(\)/);
  assert.doesNotMatch(bridge, /Date\.UTC\(year, month - 1, 1\)\.getUTCDay\(\)/);
  assert.match(styles, /\.gw-source-opening[\s\S]*background: #2d321b/);
  assert.match(styles, /\.gw-opening-copy > h2 \{[\s\S]*font-size: 36px/);
  assert.doesNotMatch(styles, /font-size: clamp\(28px, 9vw, 36px\)/);
  assert.match(styles, /\.gw-source-lightbox \.yarl__thumbnails \{[\s\S]*flex-direction: column;[\s\S]*height: 100%/);
  assert.match(styles, /\.gw-source-lightbox \.yarl__thumbnails_wrapper \{[\s\S]*position: relative;[\s\S]*flex: 1;/);
  assert.match(styles, /\.gw-source-lightbox \.yarl__thumbnails_container \{[\s\S]*padding: 16px/);
  assert.match(sourceModule.toString("utf8"), /plugins:\[M\.default,D\.default,A\.default,R\.default\]/);
  assert.match(sourceModule.toString("utf8"), /slideshow:\{autoplay:!1,delay:1500\}/);
  assert.doesNotMatch(sourceModule.toString("utf8"), /plugins:\[[^\]]*fullscreen/i);
  assert.match(sourceModule.toString("utf8"), /width:84,height:56,border:1,borderRadius:8,padding:0,gap:8/);
  assert.match(sourceModule.toString("utf8"), /swipe:250/);
  assert.match(sourceModule.toString("utf8"), /finite:!1/);
  assert.match(sourceModule.toString("utf8"), /closeOnBackdropClick:!0/);
  assert.match(sourceModule.toString("utf8"), /How many people will come\?/);
  assert.match(bridge, /prefers-reduced-motion/);
  assert.doesNotMatch(bridge, /intro\?\.remove\(\)/);
});

test("Green White slideshow starts manually, advances at the source delay, pauses, and respects reduced motion", async () => {
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const setupStart = bridge.indexOf("    let slideshowPlaying = false, slideshowTimer = null;");
  const setupEnd = bridge.indexOf("    const show = (nextIndex, direction = 0, gesture = null) => {", setupStart);
  assert.ok(setupStart >= 0 && setupEnd > setupStart);
  const slideshowSetup = bridge.slice(setupStart, setupEnd);
  const makeRuntime = (reducedMotion: boolean) => runInNewContext(`(() => {
    let nextTimerId = 1;
    const timers = new Map();
    const shown = [];
    let closing = false, transitioning = false, index = 2, motionReduced = ${reducedMotion};
    const slideshow = {};
    const window = {
      setTimeout(callback, delay) {
        const id = nextTimerId++;
        timers.set(id, { callback, delay, cancelled: false });
        return id;
      },
      clearTimeout(id) {
        const timer = timers.get(id);
        if (timer) timer.cancelled = true;
      },
    };
    let icon = false;
    const setSlideshowIcon = (playing) => { icon = playing; };
    const show = (nextIndex, direction) => shown.push({ nextIndex, direction });
    ${slideshowSetup}
    return { timers, shown, slideshow, get icon() { return icon; }, get slideshowPlaying() { return slideshowPlaying; }, setSlideshowPlaying };
  })()`);

  const normal = makeRuntime(false) as any;
  assert.equal(normal.slideshow.disabled, false);
  assert.equal(normal.slideshowPlaying, false);
  assert.equal(normal.icon, false);
  normal.setSlideshowPlaying(true);
  assert.equal(normal.slideshowPlaying, true);
  assert.equal(normal.icon, true);
  const firstTimer = normal.timers.get(1);
  assert.equal(firstTimer.delay, 1500);
  firstTimer.callback();
  assert.equal(normal.shown.length, 1);
  assert.equal(normal.shown[0].nextIndex, 3);
  assert.equal(normal.shown[0].direction, -1);

  normal.setSlideshowPlaying(true);
  const pauseTimer = normal.timers.get(2);
  normal.setSlideshowPlaying(false);
  assert.equal(pauseTimer.cancelled, true);
  assert.equal(normal.slideshowPlaying, false);
  assert.equal(normal.icon, false);

  const reduced = makeRuntime(true) as any;
  assert.equal(reduced.slideshow.disabled, true);
  reduced.setSlideshowPlaying(true);
  assert.equal(reduced.slideshowPlaying, false);
  assert.equal(reduced.timers.size, 0);
});

test("Green White gallery swipe, wraparound, and thumbnails execute their source-matched adapter behavior", async () => {
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const swipeStart = bridge.indexOf("    const resetSwipe = () => {");
  const swipeEnd = bridge.indexOf('    container.addEventListener("wheel"', swipeStart);
  const thumbnailStart = bridge.indexOf("    const thumbnails = items.map((item, i) => {");
  const thumbnailEnd = bridge.indexOf("    thumbnailWrapper.append(container);", thumbnailStart);
  assert.ok(swipeStart >= 0 && swipeEnd > swipeStart);
  assert.ok(thumbnailStart >= 0 && thumbnailEnd > thumbnailStart);

  const swipeHandlers = bridge.slice(swipeStart, swipeEnd);
  const makeSwipeRuntime = () => runInNewContext(`(() => {
    const listeners = new Map(), calls = [], children = [];
    let pointerX = null, pointerY = null, pointerId = null, swipeStartedAt = 0;
    let swipeOffset = 0, swipeStep = 0, swipePreview = null, transitioning = false;
    let zoomed = false, motionReduced = false, index = 2, now = 0;
    const performance = { now: () => now };
    const Promise = { all: () => ({ then(callback) { callback(); return { catch() {} }; } }) };
    const createImage = () => ({
      src: "photo-2.webp", alt: "", style: { translate: "0px 0px" }, removed: false,
      cloneNode: () => createImage(),
      animate(frames, options) { calls.push({ animationFrames: frames, duration: options.duration }); return { finished: {}, cancel() {} }; },
      remove() { this.removed = true; },
    });
    const image = createImage();
    const items = Array.from({ length: 6 }, (_, i) => ({ src: "photo-" + i + ".webp", alt: "Photo " + i }));
    const slide = { clientWidth: 1000, addEventListener: (name, handler) => listeners.set(name, handler), setPointerCapture() {}, append: (child) => children.push(child) };
    const document = { documentElement: { clientWidth: 1000 } };
    const slideMetrics = () => ({ width: slide.clientWidth, distance: slide.clientWidth * 1.3 });
    const show = (nextIndex, direction, gesture) => calls.push({ nextIndex, direction, gesture });
    ${swipeHandlers}
    const event = (clientX, clientY = 0) => ({ clientX, clientY, pointerId: 1, isPrimary: true, pointerType: "touch", button: 0, target: { closest: () => ({}) }, preventDefault() {} });
    return { listeners, calls, children, image, event, setNow: (value) => { now = value; } };
  })()`);
  const leftSwipe = makeSwipeRuntime() as any;
  leftSwipe.listeners.get("pointerdown")(leftSwipe.event(100));
  leftSwipe.setNow(50);
  leftSwipe.listeners.get("pointermove")(leftSwipe.event(60, 4));
  assert.equal(leftSwipe.image.style.translate, "-40px 0px");
  assert.equal(leftSwipe.children[0].src, "photo-3.webp");
  assert.equal(leftSwipe.children[0].style.translate, "1260px 0px");
  leftSwipe.setNow(100);
  leftSwipe.listeners.get("pointerup")(leftSwipe.event(60, 4));
  assert.equal(leftSwipe.calls[0].nextIndex, 3);
  assert.equal(leftSwipe.calls[0].direction, -1);
  assert.equal(leftSwipe.calls[0].gesture.offset, -40);
  assert.equal(leftSwipe.calls[0].gesture.elapsed, 50);

  const rightSwipe = makeSwipeRuntime() as any;
  rightSwipe.listeners.get("pointerdown")(rightSwipe.event(100));
  rightSwipe.setNow(20);
  rightSwipe.listeners.get("pointermove")(rightSwipe.event(140));
  rightSwipe.setNow(80);
  rightSwipe.listeners.get("pointerup")(rightSwipe.event(140));
  assert.equal(rightSwipe.calls[0].nextIndex, 1);
  assert.equal(rightSwipe.calls[0].direction, 1);

  const slowShortDrag = makeSwipeRuntime() as any;
  slowShortDrag.listeners.get("pointerdown")(slowShortDrag.event(100));
  slowShortDrag.setNow(50);
  slowShortDrag.listeners.get("pointermove")(slowShortDrag.event(140));
  slowShortDrag.setNow(400);
  slowShortDrag.listeners.get("pointerup")(slowShortDrag.event(140));
  assert.equal(slowShortDrag.calls.some((call: any) => "nextIndex" in call), false);
  assert.equal(slowShortDrag.image.style.translate, "0px 0px");
  assert.equal(slowShortDrag.children[0].removed, true);

  const canceledDrag = makeSwipeRuntime() as any;
  canceledDrag.listeners.get("pointerdown")(canceledDrag.event(100));
  canceledDrag.listeners.get("pointermove")(canceledDrag.event(40));
  canceledDrag.listeners.get("pointercancel")();
  assert.equal(canceledDrag.calls.some((call: any) => "nextIndex" in call), false);
  assert.equal(canceledDrag.image.style.translate, "0px 0px");
  assert.equal(canceledDrag.children[0].removed, true);

  const subthreshold = makeSwipeRuntime() as any;
  subthreshold.listeners.get("pointerdown")(subthreshold.event(100));
  subthreshold.listeners.get("pointermove")(subthreshold.event(70));
  subthreshold.listeners.get("pointerup")(subthreshold.event(70));
  assert.equal(subthreshold.children.length, 0);
  assert.equal(subthreshold.calls.some((call: any) => "nextIndex" in call), false);

  const wrapExpression = bridge.match(/index = \(nextIndex \+ items\.length\) % items\.length;/);
  assert.ok(wrapExpression);
  const normalizeIndex = new Function("nextIndex", "items", `let index; ${wrapExpression[0]}; return index;`);
  assert.equal(normalizeIndex(-1, Array(6)), 5);
  assert.equal(normalizeIndex(6, Array(6)), 0);

  const thumbnailSetup = bridge.slice(thumbnailStart, thumbnailEnd);
  const thumbnails = runInNewContext(`(() => {
    const created = [], calls = [], items = Array.from({ length: 6 }, (_, i) => ({ src: "photo-" + i + ".webp" }));
    const c = { photo: "Photo" }, index = 2, thumbnailTrack = { append: () => {} };
    const document = { createElement: () => { const button = { style: {}, attrs: {}, setAttribute(name, value) { this.attrs[name] = value; } }; created.push(button); return button; } };
    const show = (...args) => calls.push(args);
    ${thumbnailSetup}
    return { thumbnails, calls };
  })()`);
  assert.equal(thumbnails.thumbnails.length, 6);
  assert.equal(thumbnails.thumbnails[3].attrs["aria-label"], "Photo 4");
  assert.match(thumbnails.thumbnails[3].style.backgroundImage, /photo-3\.webp/);
  thumbnails.thumbnails[0].onclick();
  thumbnails.thumbnails[2].onclick();
  thumbnails.thumbnails[5].onclick();
  assert.equal(thumbnails.calls.length, 3);
  assert.equal(thumbnails.calls[0][0], 0);
  assert.equal(thumbnails.calls[0][1], 1);
  assert.equal(thumbnails.calls[1][1], 0);
  assert.equal(thumbnails.calls[2][0], 5);
  assert.equal(thumbnails.calls[2][1], -1);
});

test("Green White catalog cover is a source-rendered portrait with recorded provenance", async () => {
  const manifest = JSON.parse(await readFile(new URL("source-assets.provenance.json", root), "utf8"));
  const cover = manifest.catalogArtwork;
  assert.ok(cover);
  assert.equal(cover.file, "preview-opening.png");
  assert.equal(cover.registryPreviewImage, "/templates/green-white/preview-opening.png");
  const bytes = await readFile(new URL(cover.file, root));
  assert.equal(bytes.length, cover.bytes);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), cover.sha256);
  assert.deepEqual(bytes.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  assert.equal(bytes.readUInt32BE(16), 430);
  assert.equal(bytes.readUInt32BE(20), 573);
  assert.equal(cover.format, "PNG");
  assert.equal(cover.sourceFiles.length, 6);
  assert.ok(cover.fixtureOnlyChanges.some((change: string) => change.includes("fully opened first invitation page")));
  assert.ok(cover.fixtureOnlyChanges.some((change: string) => change.includes("replaced archived sample couple names")));
  for (const source of cover.sourceFiles) {
    const packaged = packagedSourceFile(source.archiveFile);
    const original = await readFile(packaged);
    const bytes = /\.(?:html|css|js)$/.test(source.archiveFile)
      ? Buffer.from(original.toString("utf8").replace(/\r\n/g, "\n"))
      : original;
    assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256, source.archiveFile);
  }
});

test("Green White built-in controls are localized in all four supported locales", async () => {
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const match = bridge.match(/const copy = (\{[\s\S]*?\n  \});/);
  assert.ok(match);
  const copy = runInNewContext(`(${match[1]})`);
  const fields = [
    "welcome", "title", "couple", "invite", "date", "countdown", "countdownCaption",
    "venue", "map", "gift", "giftHeading", "cardHolder", "copy", "copied", "copyError",
    "gallery", "dressCode", "dressIntro", "wishes", "wishIntro", "wish", "rsvp", "rsvpPrompt",
    "yes", "no", "send", "guest", "guestFull", "saved", "submitted", "error", "preview",
    "guestRequired", "wishRequired", "chooseResponse", "responseLabel", "days",
    "hours", "minutes", "seconds", "photo", "close", "next", "previous", "hosts", "contact",
    "language", "playMusic", "pauseMusic", "musicUnavailable", "footer",
  ];
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"]) {
    for (const field of fields) assert.equal(typeof copy[locale][field], "string", `${locale}.${field}`);
  }
  assert.equal(copy["uz-Cyrl"].rsvp, "\u041a\u0435\u043b\u0430\u0441\u0438\u0437\u043c\u0438?");
  assert.equal(copy.ru.rsvp, "\u0412\u044b \u043f\u0440\u0438\u0434\u0451\u0442\u0435?");
});

test("Green White RSVP honors the fixed party-size platform rule over the source stepper", async () => {
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const source = await readFile(new URL("source/preview-frame.html", root), "utf8");
  const sourceModule = await readFile(new URL("source/12pjntsqxzj70.js", root), "utf8");
  assert.match(sourceModule, /How many people will come\?/);
  assert.match(sourceModule, /setCount\(s\.count\+1\)/);
  assert.doesNotMatch(bridge, /createElement\("select"\).*partySize|\[name="partySize"\]/);
  assert.match(bridge, /partySize: choice \? 0 : 1/);
  assert.match(source, /Dress-kod/);
  assert.match(source, /Qanday kiyinish kerak/);
});

test("Green White is published for wedding events", async () => {
  const item = templateById("green-white");
  assert.ok(item);
  assert.equal(item.published, true);
  assert.equal(item.priceMinor, 15000000);
  assert.deepEqual(item.categoryIds, ["wedding"]);
  assert.deepEqual(item.supportedEventTypes, ["wedding"]);
  const migration = await readFile(
    new URL("../packages/database/migrations/0113_register_green_white.sql", import.meta.url),
    "utf8",
  );
  assert.match(migration, /VALUES \('green-white', 'Green White', 15000000, 'UZS', false\)/);
  assert.match(migration, /VALUES \('green-white', 'wedding'\)/);
});
