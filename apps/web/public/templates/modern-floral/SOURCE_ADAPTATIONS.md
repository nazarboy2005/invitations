# Modern Floral source integration

The packaged page keeps the captured Modern Floral HTML structure and its shared Chorlove styles. `source-motion.js` ports the choreography from the original route chunk recorded in `source-assets.provenance.json`; `bridge.js` remains responsible for invitation data and platform actions.

## Source behavior retained

- Opening greeting reveal, curtain collapse, and overlay fade at the original 1.45 s / 2.25 s / 3.0 s timing.
- Thirty-four drifting petals with the source's deterministic positions, delays, duration, rotation, and sway.
- Viewport-based section reveals, including source stagger, blur, scale, and translation treatments.
- Floating floral ornaments, the opening halo rotation and heart pulse, the couple-divider pulse, the countdown heart pulse, the scroll cue, and wishes marquee.
- Lightbox transitions and hover/press feedback for music and map controls.
- Reduced-motion mode makes the content visible without starting decorative motion.

The captured first-page catalog artwork is packaged as `catalog-opening.jpg`; its original URL, dimensions, and SHA-256 are recorded in `source-assets.provenance.json`. The six unrelated Orchid Amplop gallery images referenced in the captured sample are not included as Modern Floral assets. Creator gallery content continues to come from the invitation data adapter.

The source route chunk is not loaded as an application runtime. Its template-level animation behavior is implemented in the isolated motion runner; invitation data, RSVP, wishes, language, and platform services remain in the bridge.

The preserved `source/preview-frame.html` matches the original Chorlove capture after line-ending normalization. The two shared Chorlove CSS chunks match the captured chunks after normalizing only CSS `url(...)` targets and line endings; those URL changes point into the package's shared local media directory. Every URL in the packaged CSS resolves to a local file, and all twelve media files present in the original capture have byte-identical packaged copies. No template layout/style declarations were changed in those shared CSS chunks.

## Verification status

The captured route HTML and compiled route chunk in the recovered source archive match the provenance SHA-256 hashes. The source chunk confirms 13 sections, no dress-code section, all reveal variants and timings, 34 petal parameters, floating ornaments, three distinct heart/halo loops, the scroll cue, music/map hover and press feedback, and the wishes marquee. Comparison exposed missing negative-Y wave reveals, missing spring behavior for spring-configured reveals, and wrongly targeted/missing heart loops; these are corrected in `source-motion.js`. The adapter now removes any legacy party-size control and always submits `1` for attendance or `0` for decline. The regression suite also verifies the captured 13-section source and that no dress-code content is injected. Run direct archive comparisons by setting `MODERN_FLORAL_SOURCE_ROOT` to the local Chorlove `Web invitations` archive. Previously captured same-browser comparisons at 390×844 cover the opening and couple-name section. A fresh rendered source-versus-package pass for all sections and animation frames remains outstanding; keep Modern Floral unpublished until that visual pass is complete.
