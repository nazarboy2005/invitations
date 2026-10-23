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

The source-module, HTML, CSS, asset, and motion-port assertions pass in `tests/modern-floral-template.test.ts`, and `node --check` passes for the bridge and motion runner. The preview route returned HTTP 200 from the workspace process. Rendered browser comparison is still open: the in-app browser returned `ERR_CONNECTION_REFUSED` for workspace localhost ports 3001 and 3002, `host.docker.internal` failed DNS resolution, and the local headless Edge capture stalled without producing an image. A direct local source-file browser attempt also did not return a browser state. Therefore animation appearance and timing have not been visually confirmed against the original capture; keep Modern Floral unpublished until a rendered source/package comparison is completed.
