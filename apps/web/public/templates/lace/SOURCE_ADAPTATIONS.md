# Lace source adaptations

The runnable package keeps the archived Chorlove Lace page capture and captured styles/assets isolated under `source/` and `assets/`. The source capture remains untouched. Its source-module chunk is `_next/static/chunks/0j~ix342hy.sg.js` in the archived Chorlove export (SHA-256 `f8f02fc84097ac74933c62abdbf3f3ef676621bdc450f0686ac106fea836ed69`). Asset and capture hashes are recorded in `source-assets.provenance.json`.

## Preserved motion

- The cover retains the captured Bellagio poster and opening video. The poster fades after video time passes 0.05 seconds; the hero background video begins when the opening has less than 1.8 seconds remaining; hero names fade in 0.8 seconds after the hero begins; the cover fades with a 2-second ease-in-out transition once less than 1 second remains, then is removed.
- Source section wrappers reveal once at 15% visibility with a `0px 0px -60px 0px` viewport margin. Their source motion is opacity 0 / y 40px to opacity 1 / y 0 over 0.9 seconds with cubic-bezier `(.22, 1, .36, 1)` and a zero-second delay (the source helper default).
- Source program rows reveal once at 40% visibility over 0.6 seconds, with the source runtime's default `ease-out` easing and a 0.05-second stagger.
- Captured inline SVG animations and source artwork remain in the captured page. The package bridge maps the same source motion to the isolated static page without bringing in Chorlove's app or Framer runtime.

## Platform adapter

The bridge fills the captured page from the shared invitation contract and connects RSVP, wishes, gallery, music, calendar, and locale controls to the host preview/public renderer. It does not copy Chorlove's app runtime, analytics, or sample invitation data. The host-provided reduced-motion setting opens without waiting for the cover video, shows the hero immediately, pauses video and SVG animation, and disables transitions.

The catalog cover uses the exact captured opening poster at `/templates/lace/assets/bellagio-2-poster.jpg` (1080 x 1920; SHA-256 `9918bd098acc3620586090b3e6f1eb44dc8876de487849f23c0e272154f5ffff`).



## Source gallery and preview images

The original route (`_next/static/chunks/0j~ix342hy.sg.js`, SHA-256 `f8f02fc84097ac74933c62abdbf3f3ef676621bdc450f0686ac106fea836ed69`) feeds the six gallery images in this order: `gallery-2.webp`, `gallery-1.webp`, `gallery-3.webp`, `gallery-6.webp`, `gallery-4.webp`, `gallery-5.webp`. The source URLs resolve below `/images/templates/orchid-amplop/`; the packaged URLs resolve below `/templates/lace/assets/`. Each packaged gallery file is byte-identical to the Chorlove archive files recorded at `images/templates/orchid-amplop/gallery-{1..6}.webp` (per-file SHA-256 checks are in the focused Lace regression test). The same bytes are present in the checked Chorlove source trees; no matching image bytes were found in the other provider trees. Both source and package use local same-origin image URLs, so these images do not require cross-origin access.

The six exact URLs are stored in `apps/web/src/modules/catalog/preview-sample.json` under `templateSamples.lace`. `createTemplatePreviewSample("lace")` provides them to the catalog and blank template-selection preview; the renderer maps the invitation gallery without reconstructing Lace-specific media. Creator content uses its own gallery, and persisted/public invitation rendering does not receive the preview fixture. The source-backed behavior is checked in `tests/chorlove-lace-motion.test.ts` and `apps/web/src/modules/catalog/preview-sample.test.ts`. The captured source gallery section and the adapted gallery section are both hidden when their image list is empty. The catalog cover remains the original portrait opening poster recorded above.

## Gallery lightbox source behavior

The route config sets YARL slideshow off initially with a 1500 ms interval when started, 250 ms swipe motion, a five-slide non-finite carousel, 84 x 56 thumbnails with 1 px border, 8 px radius and gap, no inner thumbnail padding, and backdrop close. The archived YARL chunks are `_next/static/chunks/0jsw~n6ojplnf.js` (SHA-256 `fa0c331b8fad639b1375e517b27b7e1eff0e424807a711b4bae9fc9145f661f8`) and `_next/static/chunks/0axwbwbrzg9nc.js` (SHA-256 `e3a11d3a41fa9ade4ada7476287ce5ec01d81d0716a4dbbc1ae1d44b2e24da8c`). The isolated `gallery-lightbox.js` adapter implements the source zoom multiplier (2), anchored zoom and pan, keyboard pan/navigation, touch swipe/pinch, source thumbnail labels/active state and track motion, focus initialization/return, inert background siblings, and pointer-up backdrop behavior. It uses the captured YARL styles already loaded by `index.html`; it does not bundle the Chorlove application runtime or vendor React bundle. API wiring and invitation data remain in `bridge.js`.
