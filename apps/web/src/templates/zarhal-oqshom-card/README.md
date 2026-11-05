# Zarhal oqshom

Retired from new selections at the user's request; replaced by the light
Sahar ifori through migrations 0216/0217. Retain this renderer and its private
assets so existing invitations continue to open and download correctly.

Original 5:7 Art Deco stationery: charcoal paper, fine gold geometry, staggered
uppercase Forum names, italic supporting text and a framed QR balancing the
left-aligned venue. The border/fans/engraved surface are editable, template-owned
vector artwork in `assets/background.svg`. It is authored directly as SVG, with
no generated raster art, reference site runtime, credits or external dependencies.
`layout.ts` owns all invitation typesetting and aligned information-group rules.

| Visual element | Shared contract |
| --- | --- |
| Tracked occasion heading | `content[locale].eventLabel` |
| Staggered upright names and italic ampersand | `.people[0..1]` |
| Greeting and supporting paragraph | Optional `.greeting`, mandatory `.message` |
| Ruled day/month/year/time band | `startsAt`, `timezone`, locale |
| Venue name/address/landmark | `.venueName`, `.address`, `.landmark` |
| Signature under the venue | Optional `.hosts` |
| QR in double gold frame | Shared Yandex venue / written-address fallback |

Local Forum and regular/italic EB Garamond cover Latin/Cyrillic. Layout dimensions
are final 1500×2100 pixels; the same private server renderer produces 750×1050
watermarked previews and clean 1500×2100 flattened PNG downloads. QR generation is
local with a quiet zone and the existing immutable short-location-link adapter.
All art/fonts stay outside public; only the actual sample-card poster is public.
Names wrap and fit readable bounds; excessive content yields 422, never clipping.
Optional content stays blank. Omitting a greeting releases its space to the paragraph.

Catalog preview text comes only from the shared canonical fixture; saved invitations
and downloads use creator-authored data. Wedding/fotiha compatibility is declared
independently of the wedding catalog category, at zero price for current free
testing. Existing ownership, revisions, identity locks and bounded date/location
corrections apply. Studio exposes only mapped fields. No RSVP, music, photo gallery,
contacts, gifts, public webpage, live payments or external deployment.

Checks and screenshots: `docs/templates/static-stationery-verification`;
`scripts/verify-static-collection.mts`, `scripts/verify-static-collection-ui.mts`.
