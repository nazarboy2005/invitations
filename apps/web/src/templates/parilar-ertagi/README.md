# Parilar ertagi — Taklifla Pari

Full wedding source integration; hidden registration 0191, release 0192.
Same renderer in catalog/studio/public; category and supported event are wedding.

## Source and packaging repairs

The private HTML extractor matched literal `<body>` text inside a head-script
comment and served only comment fragments. Complete scripts are now removed
before locating the actual body. The full original splash, six-layer tunnel,
invitation card, timeline, venue, notes, wishes, countdown and footer are restored.
Original capture stays untouched. Exact CSS/eleven images/twelve fonts and motion
checksums are recorded in source/provenance.json. The production stylesheet is
also served from the template root so its original relative artwork URLs resolve.
Native opening, tunnel scroll parallax, reveal observer and falling petals run
directly, with reduced-motion/focus/visibility guards. No provider app, analytics,
query examples, demo wishes/storage or placeholder MP3 are served.

| Source | Typed contract/platform |
| --- | --- |
| Names/monograms, invitation/hosts | localized people, greeting/personalGreeting, message, hosts, eventLabel |
| Hero/invitation/footer dates/countdown | startsAt and timezone |
| Timeline time/title/description | all shared program items with stable IDs |
| Supplementary script labels | validated templateData.programLabels keyed by program ID/locale |
| Arrival note | validated localized templateData.arrivalNote |
| Venue/address/map | shared Google URL/coordinates/address search, landmark |
| Dress/RSVP prose | shared dressCode, contacts and wishes settings |
| Wishes | real approved/pending service with resolved guest token |
| Music/language | optional real audio, enabled locales; catalog gesture gated |

Arrival and supplementary labels have editor controls, validation and real
save/reopen/switch preservation. Canonical wedding details provide shared
preview-only examples. Static nonpersonal source copy remains translated;
creator content replaces every bound field, with no sample records in public
invitations. Source pin/arrow markup and exact normal typography remain intact.
No guest-count input or independent attendance/payment form is added.

## Verification

25 shared/package tests check exact capture/styles/dependencies, complete body,
no leaked JavaScript/sample identities, localized source fields, stable IDs/maps
and preview isolation. Source comparisons at 320/390/1280 verify matching tunnel
font/geometry/six layers, opening, active parallax/petals and reveals. Four
locales, canonical wishes, all program labels, seven rows, long names, empty
optionals, reduced motion, preview no-send and failure retention pass. Real
disposable account checks cover arrival/label save/reopen, compatible switching,
studio, shared publication, personalized public locales, selected/manual maps
and actual pending wishes. Actual audio, source hero catalog/personalized covers,
typecheck and production build pass. Evidence: docs/templates/taklifla-audit/pari*.
No external app deployment or live payments.
