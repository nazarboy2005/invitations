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

The captured route HTML and compiled route chunk in the recovered source archive match the provenance SHA-256 hashes. Static source-to-runner checks cover all captured reveal variants, delays/staggers, 34 petal parameters, floating ornaments, heart/halo/scroll loops, music/map hover and press states, and the wishes marquee. The runner also exposes reduced-motion handling; the captured route chunk has no corresponding reduced-motion branch, so this is an accessibility adaptation. Same-browser 390×844 captures previously compared the opening and couple-name section; during this audit the source and package were also scrolled through their next reveals. The captured HTML archive is a recovery snapshot rather than a stable original live route: its archived Next runtime reports a React hydration error, and the different invitation sample data prevents pixel-by-pixel content matching.

The packaged preview exposed a `ReferenceError` in `renderWishes`: it called an undefined `data()` accessor twice before the existing render could finish. All three wishes-data reads now use the bridge's `d()` accessor. A fresh packaged preview tab now renders through guest wishes, RSVP, and the footer with no browser console errors; the focused regression test rejects any unresolved `data()` call in the bridge. This is a platform adapter correction, not a change to captured source styles or motion.

The compiled source and runner settings were checked for all reveal, stagger, loop, and control-motion declarations. The following browser interactions were not individually captured side-by-side in this pass: each reveal frame across all 13 sections, music/map hover and press, every gallery lightbox open/close state, the live wishes-marquee loop, and reduced-motion emulation. The HTML archive's hydration error also means a complete visual comparison against a healthy original live route is not established. Keep Modern Floral unpublished until these runtime visual comparisons are completed against the source site or a validated source runtime.
