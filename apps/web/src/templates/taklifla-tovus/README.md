# Tovus — Taklifla

Complete emerald/gold peacock source template integrated in catalog, studio,
public view and personalized covers. Registration: migration 0171; release: 0172.
Wedding compatibility and catalog category are registered separately.

## Source and adaptations

`public/templates/taklifla-tovus/dependencies.json` records the untouched capture,
six original artwork files and exact local fonts. Source CSS is byte-identical;
hash checks are in `tests/taklifla-luxury-source.test.ts`. The original HTML copy
is retained as inert `.html.txt` verification evidence outside public assets.
Original captures remain untouched.

The source crest opening, frame/feather mask, hero, garlands, venue art, source
card structure, gold sheen, six floating particles and 1100ms opening are
preserved. `source/motion.js` extracts source motion with a reduced-motion guard.
`bridge.js` binds data/APIs; `copy.js` contains template-owned four-locale labels.
The source closing-panel builder is extracted separately and uses the shared
event instant. No provider runtime, analytics, demo storage or provider APIs run.

Normal names keep source sizes. Long names fit into the hero, frame and opening.
Shared story chapters reuse the original quote typography and preserve stable
IDs/order. Original event cards repeat for the shared program rather than
retaining the source's two sample events. Preview music remains gesture gated;
manual pause survives language changes. Preview wishes come from the same
canonical JSON as other designs; real pending wishes are never shown publicly.

## Data mapping

| Source content/control | Shared contract |
| --- | --- |
| Names throughout all scenes | localized people |
| Invitation wording and family | greeting/personalGreeting, hosts, message |
| Quote area | ordered localized story chapters with stable IDs |
| Dates, countdown and event cards | startsAt + timezone, program IDs/time/title/description |
| Venue/city/map | venueName/address/landmark and shared venue.mapUrl/coordinates |
| Dress/timing/deadline | dressCode, program times and RSVP deadline |
| Guestbook and source closed state | wishes settings, event instant, guest token and shared moderation API |
| Music | optional creator music; canonical catalog track only in preview |

Separate parental biographies and parking prose have no shared authoring fields;
the shared hosts string is shown once and the optional parking row stays hidden.
There is no source gallery, gift/payment form or party-count control. Source
venue art stays as decorative artwork without pretending to be a creator photo.

All semantic preview content and map targets come from the canonical JSON;
creator content never falls back to sample values. Catalog art and personalized
dashboard covers use the actual opened 480×800 hero scene.

See `docs/templates/luxury-uzbek-verification/README.md` for reproducible checks,
source comparisons, backend evidence and publication state.
