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

## Gallery lightbox motion follow-up

The exact source route module has the lightbox dialog enter/exit at opacity 0/1
and the image enter/exit at opacity 0/1 and scale .96/1, with no explicit
transition props. The archived Motion engine chunk
`_next/static/chunks/0ceoe4zwq362f.js` (140,967 bytes, SHA-256
`5dd7d6dc70babc6b0507d8940a534b916c15ae8ede6a63ebb140f07aaf60836d`) resolves
those defaults to a 300ms opacity tween with
`cubic-bezier(.25, .1, .35, 1)` and a scale spring with stiffness 550, damping
30, mass 1, rest speed 10, and rest delta .005. The previous 300ms ease-out
approximation missed the source curve and spring and did not animate the image
on exit. `source-motion.js` now evaluates the source spring formula on each
animation frame, applies the source opacity curve, animates both image and
dialog on exit, and waits for their transitions before removing the lightbox.
Only the source-derived
transition values are used; the Chorlove site and Motion runtime are not
packaged. Both source and runtime chunk hashes are pinned in
`source-assets.provenance.json` and the focused source test. In a matched
390×844 browser run, source/package opacity was .795/.793 at 120ms and 1/1 by
240ms; both images settled at 367×550, and both dialogs were gone by 400ms
after close. The first 40ms sample differed (.336/.214), so the local harness
does not prove frame-origin synchronization; the source page also reports
React hydration error #418. The package's reduced-motion preview opens without
an animation and removes the dialog immediately on close.

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
finish, section reveal on scroll, and package reduced-motion state. The source
capture reports React hydration error #418 while its external site services are
blocked in the local harness; the package frame has no uncaught JavaScript
errors. The exact source default gallery order is supplied by the shared
preview-only sample fixture using the captured gallery files; the source page
contains two responsive copies of those six photos. The adapter binds both
copies and accepts `green-gold-source-preview-*` items only when the renderer
marks a catalog or initial template-selection preview. Creator uploads take
precedence, blank creator/public galleries remain hidden, and the adapter does
not inject sample photos. Complete public/creator integration remains an open
release check. The
archive omitted `vertical-line.png`; the exact
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

The captured RSVP form has no guest-count control. Following the approved
product requirement, the adapter sends a fixed party size of 1 for attending
and 0 for declining, and hides its empty live-status paragraph until feedback
is needed. The source route module in the recovered Chorlove archive confirms
the exact To'yona interaction: the “Send gift” button reveals owner and number
labels inside the existing card, using the source placeholder when a value is
empty. Its copy button is disabled without a number and writes the trimmed
number to the clipboard; the label changes to “Copied” for 1.8 seconds. The
adapter reproduces those states and source card layout in
`showGiftCardDetails`; module path, ID, hash, and observed states are recorded
in `source-assets.provenance.json`.

The full platform preview suppresses generic story, dress-code, and extra-family
sections because the 13-section Green Gold source has no such sections. The
optional private receipt-upload flow remains attached to the source to'yona
section and stays hidden unless the invitation owner enables it.
