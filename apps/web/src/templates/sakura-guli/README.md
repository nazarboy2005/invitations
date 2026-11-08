# Sakura Guli — Taklifla Sakura

Complete wedding source, shared renderer across catalog/studio/public.
Registration 0195 and publication 0196; wedding category/event recorded separately.

## Source and repaired gaps

Exact captured CSS, eight artwork images and thirteen local font files retain
checksums in provenance.json. Original captures stay untouched. Native timeline,
fitting, 37 petals, reveal observer, parallax/background interpolation and source
splash transition are reused. The font subset retains the source's exact Latin/
extended Latin/Cyrillic URLs for approved locales; unused Japanese subsets are
excluded. Original closed-wishes panel is restored. Provider analytics/app/query
customizer/storage/guestbook runtime are excluded.

| Source field | Typed shared/platform data |
| --- | --- |
| Names, monograms, invitation/hosts | localized people, greeting/personalGreeting, message, hosts, eventLabel |
| Dates/time/countdown | startsAt/timezone |
| Hero city chip and framed venue tail | original city-first authored-address heuristic |
| Venue/map/note | shared Google URL/coordinates/address search and landmark |
| Timeline/dress | stable shared program IDs/text and shared dressCode/colors |
| Contact prose, information note, footer | validated localized editable templateData |
| Contact links | shared phone/Telegram/Instagram |
| Wishes/closure | real approved/pending API, resolved guest, source 24-hour closed state |
| Music/languages | canonical gesture-gated catalog audio; optional creator audio; four locales |

Previously hidden source info/footer fields and city chip now render. Notes have
real editor/save/reopen/switch support. Canonical examples/wishes remain in the
shared event fixture, never creator saves/public data. Empty timeline no longer
throws; previews bind canonical wishes/audio. Stable memo dependencies preserve
native locale choice. Confirmations require the real API ok response and are
visible; failures retain input and their translated state. Guest changes reset
form context. Reduced motion works when changed after load. Long invitation
copy can grow its floral card; normal content retains the original 2:3 geometry.
Preview sizing follows available container height; public display fills viewport.
No guest-count or payment form is added.

## Verification

25 shared/package tests verify exact source/dependency/helper bytes, notes/city,
stable IDs/maps, sample isolation and empty data. Source/app comparisons at
320/390/1280 match fonts/geometry/all 37 petals, native opening, active parallax/
reveals, city, four locales, canonical wishes, seven rows, long names/extended
copy without clipping, empty optionals, reduced motion, closed wishes and failed
submissions surviving language changes. Real disposable-account tests cover all
notes save/reopen/switching, studio/shared publication/personalized public views,
selected/manual maps, actual pending wishes and visible truthful confirmation.
Actual decoded audio, catalog/personalized source hero captures, typecheck and
production build pass. Evidence: docs/templates/taklifla-audit/sakura*.
No external app deployment or live payments.
