# Green Gold source integration

The original `preview-frame.html` snapshot is preserved byte-for-byte at
`source/preview-frame.html`. The extracted runnable page keeps its 13 source
sections, localizes the template-owned assets, removes captured invitation
sample values and unrelated Orchid Amplop gallery photos, and does not load the
captured Next.js or Chorlove site runtime. Source CSS chunks remain preserved
under `source/styles/` for fidelity review. Five source artwork files are
byte-identical in `assets/`; the source's `vertical-line.png` is absent, so its
observed optimized WebP rendition is packaged with that limitation recorded in
`source-assets.provenance.json`. A Cyrillic Playfair Display subset and shared
CSS dependencies are served from local Chorlove media.

## Recovered source motion

The full Chorlove archive includes route chunk
`Web invitations/_next/static/chunks/09cpm7sbnsw7i.js`, module `995238`, with
SHA-256 `cc9472f5f183b8f7fcbfe281f0cbdeaa573b774cc594e56446736694bfe09b75`.
The captured page snapshot encodes 58 initial hidden opacity/transform states,
but the extracted package had stripped them and did not include this module's
motion handlers. That left the opening static and removed section reveals.

`source-motion.js` adapts the original template-only choreography without the
source app runtime: the five-step staggered cover entrance; source-specific
section, date, countdown, and responsive gallery reveals; 18 rotating naqsh
ornaments with their captured directions and periods; 30 source-style random
starbursts; the looping wishes ticker; and the gallery lightbox's fade/scale
entrance and exit. `bridge.js` continues to own shared-contract binding and
service APIs, and only starts the motion adapter and signals updated data or
reduced-motion preferences. The former generic sparkle keyframes and green
gallery overlay were replaced with the source animation and full-screen dark
lightbox treatment. Detailed chunk, element, and timing provenance is recorded
in `source-assets.provenance.json`.

The typed catalog and additive migration `0100_register_green_gold.sql`
register this wedding design as unpublished; the configured database also
confirms it remains unpublished. No authentic portrait catalog artwork is
currently packaged, and none is present in the local Chorlove template folder
or asset manifest. The captured page and first-page artwork are in the right
proportion for a clean portrait capture, but the catalog cover still needs to
be captured and verified before publication. Browser comparison of source and
package timing, gallery art behavior, and public/creator integration remain
release checks.

## Shared contract adapter

`bridge.js` maps names and greetings, invitation text, localized calendar and
countdown, venue/map, contacts and hosts, To'yona card, gallery, wishes, RSVP,
locales, reduced motion, and click-to-play music to the shared Chorlove payload
and platform APIs. Preview-only content remains ephemeral. Accessibility
support includes localized form labels and validation, keyboard RSVP controls,
live status messages, gallery labels, and visible focus indicators. Empty
creator-photo galleries remain hidden in public invitations; the template's
opening art and ornaments remain visible.
