# Modern Floral source integration

The packaged page keeps the captured Modern Floral HTML structure and its shared Chorlove styles. `source-motion.js` ports the choreography from the original route chunk recorded in `source-assets.provenance.json`; `bridge.js` remains responsible for invitation data and platform actions.

## Source behavior retained

- Opening greeting reveal, curtain collapse, and overlay fade at the original 1.45 s / 2.25 s / 3.0 s timing.
- Thirty-four drifting petals with the source's deterministic positions, delays, duration, rotation, and sway.
- Viewport-based section reveals, including source stagger, blur, scale, and translation treatments.
- Floating floral ornaments, heart and scroll loops, calendar heart pulse, and wishes marquee.
- Lightbox transitions and hover/press feedback for music and map controls.
- Reduced-motion mode makes the content visible without starting decorative motion.

The captured first-page catalog artwork is packaged as `catalog-opening.jpg`; its original URL, dimensions, and SHA-256 are recorded in `source-assets.provenance.json`. The six unrelated Orchid Amplop gallery images referenced in the captured sample are not included as Modern Floral assets. Creator gallery content continues to come from the invitation data adapter.

The source route chunk is not loaded as an application runtime. Its template-level animation behavior is implemented in the isolated motion runner; invitation data, RSVP, wishes, language, and platform services remain in the bridge.

The preserved `source/preview-frame.html` matches the original Chorlove capture after line-ending normalization. The two shared Chorlove CSS chunks match the captured chunks after normalizing only CSS `url(...)` targets and line endings; those URL changes point into the package's shared local media directory. Every URL in the packaged CSS resolves to a local file, and all twelve media files present in the original capture have byte-identical packaged copies. No template layout/style declarations were changed in those shared CSS chunks.

## Verification status

The source-module, HTML, CSS, font-variable, asset, catalog-art, and motion-port assertions pass in `tests/modern-floral-template.test.ts`. The local captured source route and packaged preview were rendered in the same browser at 390×844. The opening artwork/layout and the couple-name page layout, typography, and reveal were visually compared; the package uses the captured Playfair font variables and displays data-driven couple names in the original `h2` fields. The source's `/_next/image` optimizer was locally mapped to the byte-identical captured `flower.png` because the archive is static; without that mapping the source server returns a placeholder-sized image. The preview scrolls through its full-screen snapped pages. The original public website was not involved in this comparison, and every animation frame/interaction across every section has not been visually compared; motion timings and choreography are covered by direct source-chunk assertions and the focused test. Keep Modern Floral unpublished until the remaining section-by-section visual checks pass.
