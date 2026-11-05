# Lola maktubi

Original 5:7 static stationery, commissioned after the Oq atirgul composition
revision. Burgundy tulip engravings balance a left-aligned column of Great Vibes
names, a distinct ruled day/month-time group and a venue/QR correspondence footer.
The full typesetting and linework are in `layout.ts`; the unmodified original
generated art is in `assets/background.png`, with its full built-in imagegen
prompt in `generation-prompt.md`. This is an original design, with no reference
site runtime, external fonts/assets, provider credits or animation.

| Visual element | Shared contract |
| --- | --- |
| Tracked heading | `content[locale].eventLabel` |
| Two calligraphic names, connecting ampersand | `content[locale].people[0..1]` |
| Optional italic greeting, invitation paragraph | `content[locale].greeting`, `.message` |
| Large day, month/year and weekday/time | `startsAt`, `timezone`, locale |
| Venue, address and landmark | `.venueName`, `.address`, `.landmark` |
| Signature | Optional `.hosts` |
| Framed QR and localized caption | Shared Yandex venue / written-address fallback |

All coordinates are final 1500×2100 pixels. Local EB Garamond regular/italic
and four Great Vibes subsets cover Latin/extended Latin/Cyrillic. Names wrap and
fit within readable bounds; excessive text is rejected with 422 instead of clipped.
Empty optional fields stay empty; omitting the greeting lets the paragraph use
its space. The shared font/runtime services are server-only. Preview and export
use precisely the same definition: 750×1050 watermarked pixels and clean 1500×2100
PNG respectively. Only the canonical shared JSON supplies catalog sample text;
saved downloads use creator data. Artwork/fonts stay outside public assets;
only a flattened sample poster is public.

Wedding and fotiha support are registered separately from the wedding catalog
category, at zero price under the existing free static testing policy. Studio
shows only mapped inputs. Existing ownership, revision, one-event identity locks,
correction windows, private previews and immutable location short links apply.
No RSVP, music, gallery, contacts, gifts, payments or public invitation webpage.
No external deployment.

Checks and screenshots: `docs/templates/static-stationery-verification`;
`scripts/verify-static-collection.mts`, `scripts/verify-static-collection-ui.mts`.
