# Tungi Saroy — Taklifla Midnight Palace

Complete captured Uzbek template, integrated in catalog, studio, public page and
personalized cover generation. Registration: migration 0171; publication: 0172.
Wedding compatibility is independent of its wedding catalog category.

## Source and adaptations

`public/templates/taklifla-tungi-saroy/source/provenance.json` identifies the
untouched original HTML, source CSS and every local art/font dependency by hash.
The CSS and art are unchanged. `tests/taklifla-luxury-source.test.ts` verifies
them against the capture. All assets are local; no provider site runtime,
analytics, demo guestbook storage or source invitation data is loaded.

The original palace/moon artwork, framed invitation, gold shimmer, 12 fireflies
in each of the hero and countdown, scroll fades, 950ms opening and guestbook
closing panel are retained. `source/template-motion.js` and `wish-panel.js` are
template-only extractions; `platform-adapter.js` owns all data/API bindings.
`labels.js` completes the formerly missing dictionary with four locales and
accurate pending/error feedback. `platform.css` adds accessibility, reduced
motion, wrapping and Cyrillic font fallback; source CSS remains exact.

Long names shrink within source scenes; ordinary names retain original source
font sizes. Preview music waits for an opening gesture. Real music playback,
pause and retry are tracked without restarting after an intentional pause.

## Data mapping

| Source content/control | Shared contract |
| --- | --- |
| Initials, opening, hero, invitation and footer names | active locale people |
| Greeting and message | greeting/personalGreeting with resolved guest, message |
| Family line | shared hosts, displayed once |
| Dates, time and countdown | startsAt + timezone; real UTC event instant |
| Repeatable event cards | program stable IDs/time/title/description |
| Venue, city inference, note, map | venueName/address/landmark, saved venue.mapUrl or coordinates |
| Dress and phone response information | dressCode, RSVP deadline/enabled and contact phone |
| Wishes | wishes settings, guest token and shared approved-only GET/pending POST |
| Audio | creator music; canonical catalog music only in ephemeral preview |

The shared contract has one family/host string, so it is not duplicated into
both source parent blocks. Source weather, hotel/airport guidance and hashtag
are optional and hidden because they have no approved shared editor fields.
Independent per-program dates/places are not invented; all cards use the shared
same-day program. The decorative footer wording remains translated template
copy. There is no source gallery, gift/payment form or guest-count input.

Sample names, venue and Google map come only from the canonical preview JSON;
creator content replaces them and never receives source defaults. The selected
catalog image is the actual opened palace hero at 480×800. Personalized covers
use the same opening recipe with creator names.

See `docs/templates/luxury-uzbek-verification/README.md` for comparison captures,
motion/audio checks, real backend/studio verification and publication evidence.
