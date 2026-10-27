# Homepage paper showcase

Four sample template covers (Anor, Cloud Castle, Kuzgi Chinor and Bogi Eram) follow the existing three-step section and precede
FAQ. They are not presented as customer work. Item destinations are supplied by
`app/page.tsx`, so future published-invitation links can replace preview URLs.

## Interaction

- Mouse/pen: hover to unfold, leave to fold, click to visit the preview.
- Touch: first tap opens the paper, second visits the preview. Only one is open;
  tapping another closes the previous paper. Native pointer focus is deliberately
  ignored so it cannot turn the first tap into navigation.
- Phones arrange four smaller papers in a 2x2 grid (140px maximum
  item width, 120px sheet width); laptops show a single row of four.
- Keyboard: focus opens, Enter follows the link, blur closes. Modifier clicks
  preserve native link behavior. With JavaScript disabled the normal link works.
- There is no text beneath the papers, new sound or scroll animation.

## Rendering and source

The local `paper-reveal-engine.js` preserves the geometry decoder, folding
keyframes, procedural crease generator, paper shaders, shadow passes and shared
renderer from **CrumpledPaperReveal by Matthias Ölschlegel**:

https://framer.com/m/CrumpledPaperReveal-8D5gW8.js@0VQbXvSZ3yFdg4ftHQFG

Resolved source:
https://framerusercontent.com/modules/KGCdRVoz6YBrYGFTzraT/0VQbXvSZ3yFdg4ftHQFG/CrumpledPaperReveal.js

The Framer wrapper, property controls, metadata and Motion dependency are removed.
The source's `(.3, 0, .2, 1)` easing is evaluated with native requestAnimationFrame.
Embedded geometry was decoded from base64 into local `crumple.bin` (100,973 bytes,
still deflate-compressed). The original static crease overlay is a local JPEG.
No Framer/CDN requests occur at runtime. Cover images are optimized 512×910 WebP
derivatives of the existing template covers; their portrait proportions remain.
Bogi Eram uses the curated `images/catalog/bogi-eram-cover.webp` (fully revealed
names) rather than its historical opening artwork; its paper derivative is
`images/home/paper/bogi-eram-cover.webp`.

Catalog names/descriptions and the same dark bottom gradient as catalog cards
are composited into each texture once after the local display/body fonts load.
They fold and unfold with the mesh. Matching DOM captions remain for accessible
descriptions and the no-WebGL fallback. No per-frame text layout is needed.

The four sheets share one WebGL2 context and cached geometry/crease maps. Each
sheet has a 2D presentation canvas, matching the original shared-engine approach.
Engine/data initialize within 450px of the section; images use native lazy loading.
DPR is capped at 1.25 on phones and 1.5 elsewhere. Texture uploads are limited to
1024px. Crease preparation gets a shared 3ms work budget per animation frame (a
single generator operation can exceed that target). Frames stop once settled,
outside the viewport or in hidden tabs; rapid changes tween from the current pose.

Reduced motion skips initializing WebGL and shows ordinary covers. Unsupported
WebGL2, decoder failure and lost contexts also leave usable cover links. This is
a richer multi-pass effect than the drop shader, with a nonzero CPU/GPU cost;
there is no claim of zero performance impact or universal mobile frame rates.

## Botanical background assets

Built-in Image Generation produced two background-only plates, optimized into
`apps/web/public/images/home/paper/gallery-desktop.webp` (19,544 bytes) and
`gallery-mobile.webp` (15,652 bytes). A lazy `<picture>` selects the matching
asset, so phones do not fetch the desktop plate. Full generation prompts are
in `docs/paper-background-prompts.md`. The backgrounds contain no baked-in text,
covers or paper shadows. Mesh shadows and lighting use upper-right key light,
projecting to lower-left; the static fallback follows the same direction.

## Verification

`tests/paper-showcase.test.ts` covers mouse opening/navigation, single-open state,
touch pointer-focus/first-tap/second-tap sequencing, switching papers, keyboard
interaction, modifier clicks, cancelled gestures, easing and geometry integrity.
Existing occasion, cylinder, process and sound checks are also run. Browser QA
checks actual rendering, keyboard switching, preview navigation and phone layout.
