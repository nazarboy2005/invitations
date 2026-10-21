# Ko‘zgu source and catalog artwork

The isolated package keeps the captured Ko‘zgu body, template stylesheet,
template and mirror scripts, shared artwork, and locally hosted fonts. The
typed platform adapter supplies invitation content and APIs without replacing
the captured layout or interaction.

The captured `meta.js` names `preview.webp`, but that file is absent from the
reference capture. The application package contains a 480 × 900 WebP at that
path. Its visible composition matches the captured opening scene (room, mirror
frame, curtains, console, and opening prompt), and the package test distinguishes
it from the standalone frame asset. However, there is no retained source
preview file or browser-capture record to establish how this composite image
was produced. Treat its source fidelity as visually plausible, not provenance-
verified. Do not describe it as a fresh source render until browser capture
metadata is recorded.

The current artifact SHA-256 is
`8a7d72e4b610c6e54fb8411e71c12303e1fed9632fe2bf5317950d6b826d109f`.
`tests/kozgu-template.test.ts` locks this digest, dimensions, the missing-source
condition, and the matching source opening layers so an image replacement
requires an intentional provenance review.

The captured sample invitation loader is not included. The shared typed
invitation contract supplies creator data; the centralized catalog fixture is
used only for catalog and initial template-selection previews. The visible
venue-photo, gift bank-name, and gift-note fields are subject to the shared
contract and approved editor/database requirements.
