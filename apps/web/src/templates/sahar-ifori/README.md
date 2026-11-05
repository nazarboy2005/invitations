# Sahar ifori

Original light 5:7 stationery replacing Zarhal oqshom in new selections, following
the user's request. Warm ivory paper, blush sweet-pea/cosmos botanical watercolor,
sage calligraphy and fine champagne linework. The original generated background
is preserved unchanged; the exact built-in imagegen prompt is saved beside this
file. All artwork and Latin/Cyrillic fonts are local and private.

`layout.ts` owns the composition: offset calligraphic names balanced against the
top-left floral spray, a three-part date band, left-aligned venue, and a framed QR
with its own greeting, directions and family signature. Text never relies on
generated lettering. EB Garamond supports the Great Vibes names. Long names fit
their bounded slots; excessive content returns 422 instead of clipping.

| Composition | Shared invitation field |
| --- | --- |
| Tracked heading | `content[locale].eventLabel` |
| Two calligraphic names | `.people[0..1]` |
| Greeting and invitation paragraph | Optional `.greeting`, mandatory `.message` |
| Month/weekday, large day, year/time | `startsAt`, `timezone`, locale |
| Venue, address and landmark | `.venueName`, `.address`, `.landmark` |
| Family signature beside QR | Optional `.hosts` |
| Local QR | Shared Yandex destination / written-address fallback |

Same real renderer for protected 750×1050 previews and clean 1500×2100 PNGs.
The existing immutable short-location-link adapter powers owned downloads.
The canonical shared fixture supplies catalog posters only; authored content
always replaces it and no sample data is persisted. Four locales, wedding/fotiha,
zero-price static testing, existing ownership and identity/editing rules apply.
No web-only services, deployment or live payment activation.

Migrations 0216/0217 retire the dark design from selection and register/publish
this replacement. Retired Zarhal source stays available for existing invitations.
Verification: `docs/templates/static-stationery-verification/sahar-ifori.md`.
