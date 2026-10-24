# Green Gold source integration

The original `preview-frame.html` snapshot is preserved byte-for-byte at
`source/preview-frame.html`. The extracted runnable page keeps its 13 source
sections, localizes the template-owned assets, removes captured invitation
sample values, and does not load the captured Next.js or Chorlove site runtime.
The source component's six default gallery photos are shown only as ephemeral
preview fallbacks when no creator photos exist; creator uploads replace them,
and public invitations never receive these sample photos. Source CSS chunks
remain preserved under `source/styles/` for fidelity review. Five source artwork files are
byte-identical in `assets/`; the exact original `vertical-line.png` was recovered
from its source URL and is recorded in `source-assets.provenance.json`. A Cyrillic Playfair Display subset and shared
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
entrance and exit. Browser comparison exposed that the wrapper around the
thirteen sections prevented the original section lookup from matching, and
that the reveal observer was initialized before reveal targets existed; both
were corrected. Completed finite Web Animations now commit their final styles
so the snapshot's inline initial states do not re-hide content after the
animation ends. `bridge.js` continues to own shared-contract binding and
service APIs, and only starts the motion adapter and signals updated data or
reduced-motion preferences. The former generic sparkle keyframes and green
gallery overlay were replaced with the source animation and full-screen dark
lightbox treatment. Detailed chunk, element, and timing provenance is recorded
in `source-assets.provenance.json`.

The archive capture manifest and full Chorlove image-cache manifest contain no
separate Green Gold catalog portrait or cover metadata; they list the captured
preview page and the five template artwork assets. A source-faithful cover is
now captured as `catalog-cover-opening.png` at 432x768 (9:16) from the preserved
original page, original CSS and route JavaScript, and local original assets. The
only runtime content binding is the shared preview fixture's Uzbek greeting;
the fixture remains ephemeral. No crop, compositing, or redraw was used.
`preview.provenance.json` and the `catalogArtwork` entry in
`source-assets.provenance.json` record the capture, source and fixture hashes,
viewport, and loaded image/font checks. The typed catalog entry points to this
artwork. Green Gold remains unpublished. Browser verification at matching
390x844 viewports confirms source/package opening composition, cover-rule
finish, section reveal on scroll, and reduced-motion state without runtime
errors. The exact source default gallery order is restored in previews using
the captured shared gallery image files; creator uploads take precedence and an
empty public gallery stays hidden. Complete public/creator integration remains
an open release check. The archive omitted `vertical-line.png`; the exact
original PNG has been recovered from Chorlove and packaged without conversion.

## Shared contract adapter

`bridge.js` maps names and greetings, invitation text, localized calendar and
countdown, venue/map, contacts and hosts, To'yona card, gallery, wishes, RSVP,
locales, reduced motion, and click-to-play music to the shared Chorlove payload
and platform APIs. Preview-only content remains ephemeral. Accessibility
support includes localized form labels and validation, keyboard RSVP controls,
live status messages, gallery labels, and visible focus indicators. Empty
creator-photo galleries remain hidden in public invitations; the template's
opening art and ornaments remain visible.
