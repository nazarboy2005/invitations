# Moviy ravoq

Original 5:7 blue porcelain stationery with a finely painted Uzbek architectural
ravoq, upright/italic EB Garamond hierarchy and a centered ceremony composition.
A large central day is flanked by weekday/year and time; a broad venue section
leads to a left-aligned family signature and right-hand framed QR. Fine rules
align the information groups without competing with the painted frame.

`layout.ts` contains the complete typesetting and connecting linework.
`assets/background.png` preserves the unmodified built-in imagegen artwork;
`generation-prompt.md` records the exact prompt. All fonts and artwork are private
and local. No reference site, external service/assets, branding or animation.

| Visual element | Shared contract |
| --- | --- |
| Greeting below the arch | Optional `content[locale].greeting` |
| Tracked occasion heading | `.eventLabel` |
| Italic name pair with ampersand | `.people[0..1]` |
| Invitation paragraph | `.message` |
| Three-part date composition | `startsAt`, `timezone`, locale |
| Venue name and supporting directions | `.venueName`, `.address`, `.landmark` |
| Family signature | Optional `.hosts` |
| Framed QR and captions | Shared Yandex venue / written-address fallback |

Coordinates are final 1500×2100 pixels; output is the same definition at 750×1050
for private watermarked previews and 1500×2100 for clean flattened PNG downloads.
Local regular/italic EB Garamond supports all four approved locales. Text fits
within readable slot bounds; oversized content returns 422. Empty optional fields
remain empty. The shared preview JSON is used only for the public flattened sample
poster and ephemeral previews; creator content replaces it before persistence/export.

Wedding/fotiha event compatibility is separate from the wedding catalog category.
Zero price preserves free static testing. Existing ownership/revision checks,
identity finalization, date/location corrections, immutable QR short links and
private preview policies apply. Studio exposes only mapped fields. No webpage,
RSVP, music, gallery, contacts, gifts, payment activation or external deployment.

Checks and screenshots: `docs/templates/static-stationery-verification`;
`scripts/verify-static-collection.mts`, `scripts/verify-static-collection-ui.mts`.
