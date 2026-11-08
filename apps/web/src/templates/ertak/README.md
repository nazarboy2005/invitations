# Ertak — Taklifla

Complete wedding tunnel-book source, catalog/studio/public use the same renderer.
Registration migration 0179; release 0180 after verification. Wedding category
and wedding compatibility are independently recorded.

## Exact source and adaptations

The immutable source capture, complete CSS, nine exact sky/castle/garden/foliage/
balloon/moon/butterfly/arch/frame images and twelve local fonts are tracked by
source/provenance.json and fonts/dependencies.json. Template CSS is unchanged.
The source parallax/ambient engine runs directly in source/motion.js. Its only
motion changes are reduced-motion guards, RAF recovery when reduction stops,
and stopping ambient drift during reduced-motion scrolling. Normal depth/easing,
mouse tilt, scroll dolly, float animations, shadows and responsive art are retained.
Original reference captures remain untouched.

platform-adapter.js handles only typed data, locale, safe maps, real wishes,
creator music and unusual-name fitting. Provider runtime, analytics, source
sample names/dates/program/wishes/storage are excluded. Normal names keep source
sizes; long names fit the source opening/card. Shared maps use saved Google URL,
coordinates or authored venue/address search. No map API key is embedded.

Names/monograms, greeting, hosts, date/countdown, venue/map and stable program
items map to the shared invitation contract. Invitation wording remains visible
even without program rows. Wish links/forms use the real shared moderation API,
with pending responses never appended to the approved list. Load/send failures
are distinguished. Canonical sample wishes exist only in catalog previews.
There is no source gallery, gift or attendance-count form to fabricate.
Music is optional: public playback attempts follow browser policy, catalog waits
for a gesture and manual pause survives locale changes. Four locales/reduced
motion are supported. Source template copy remains translated built-in labels.

## Verification

Three source/adapter tests check immutable capture/CSS/art/fonts, all locales,
stable data, maps, isolation and blank creator data. Source/app comparisons at
320/390/1280 also verify active mouse parallax and ambient scroll drift, seven
program items, long names, all locales, canonical wishes, preview no-send, HTTP
error retention, native reduced motion and empty optional sections. Real
save/reopen/switching/publication/studio/public tests persist a pending guest wish
and check personalized four-locale pages and Place/manual Google URLs. Actual
audio decoding and catalog/personalized opening covers are recorded separately.
Evidence: docs/templates/taklifla-audit/ertak*. Typecheck and production build pass.
No external deployment or live payment activation.
