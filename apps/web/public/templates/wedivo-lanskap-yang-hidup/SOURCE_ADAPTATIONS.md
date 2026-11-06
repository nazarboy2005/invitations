# Jonli vodiy — source integration

Source: Wedivo **Lanskap yang Hidup — Sehari di Lembah Kita**, manifest entry
`Web invitations/templates/XkAzuF8SSX5Pplof0P2d/index.html` (`embedded-source`).
The archive is untouched. Its SHA-256 and every copied dependency are recorded in
`source/provenance.json`. The selected design was absent from the typed catalog,
renderer packages, aliases and current source ownership inventory at preflight.

Proposed catalog ID `wedivo-lanskap-yang-hidup`, Uzbek name **Jonli vodiy**,
description direction **Vodiyimizda bir kun**, category `wedding`, event support
`wedding` only. A coordinator-managed additive private registration migration and
shared route/registry wiring are still required. No shared registry, catalog,
migration, database or publication files were changed by this template task.

## Packaged source and adaptations

- `source/template.css` is the complete captured template stylesheet. The exact
  Google Fonts CSS is localized in `assets/fonts.css`; all 17 TTFs and four paper,
  pond, linen and wood textures are byte-exact local archive dependencies.
- `source/template.js` retains the complete original procedural valley engine,
  tree/flower growth, sunrise-to-night scroll timeline, cover opening, flower
  dial, sound synthesis, pond/koi gallery, lightbox, fireflies and fireworks.
  The `LAND` engine block is byte-identical, verified separately from the narrow
  data/time/localization/reduced-motion hooks. Canvas text localization is an
  iframe-scoped `fillText` wrapper outside the source engine.
- `index.html` retains the captured body/SVG structure. The provider parameter
  manifest, provider preview shim, sample rundown, source invitation values,
  third-party map key/embed, source music and captured invitation photos are
  removed. Its empty production content is bound before the source script starts.
  A reproducible packager is `scripts/templates/package-wedivo-lanskap.py`.
- `platform-adapter.js`, `platform.css`, `locales.js` and the typed React adapter
  are separate from the captured source. `window.lanskapRuntime` updates cached
  date/name/media data and rebuilds only repeatable sections; it preserves the
  opened state and guest audio choice on content/locale refresh.
- Twelve source invitation photos are isolated in `preview-only/`, hash-checked,
  and used only in ephemeral catalog/initial-selection payloads. Six gallery
  images follow source order. The preview uses the exact captured bride/groom
  portraits. These paths are never inserted into creator/public invitation data.

## Field/interaction mapping

| Source UI | Shared contract / behavior |
| --- | --- |
| Cover, hero, couple and closing names | Localized `content.people[0]` groom, `[1]` bride; source bride-first visual order retained |
| Greeting and named guest | `greeting` / `personalGreeting` with `{name}` and public guest name |
| Invitation copy, opening title, family closing | Localized `message`, `title`, `hosts` |
| Date, countdown, Google Calendar and ICS | `startsAt` and IANA `timezone`; fractional timezone offsets supported; source two-hour calendar duration retained because contract has no end time |
| Main event and directions | Localized `eventLabel`, venue name/address/landmark and `venue.mapUrl` |
| Program flower stalk | All `program` entries, stable IDs/order, times, localized titles and descriptions |
| Rice-growth story | All `story` chapters, stable IDs/order; original source four-slot limit lifted without changing its layout |
| Dress figures and interactive palette | `dressCode` style/text/note and every approved color; source palette buttons still change clothing and valley flower colors |
| Pond photos/lightbox | Creator gallery IDs, URLs, captions/alt text; originals are preview-only; public empty gallery hidden |
| Source Instagram link | Shared `contacts.instagramUrl`, displayed once; no source-absent phone/Telegram block added |
| RSVP | Real public RSVP API; yes/no/maybe, name and note. No guest-count prompt; `partySize` fixed to 1 for yes and 0 otherwise |
| Wishes/fireflies | Public approved wishes API and real submission; pending wishes never enter public list/fireflies. Preview uses the shared localized three-wish fixture |
| Sound control | Creator track, global catalog preview track, browser autoplay attempt, original toggle and synthesis. Guest pause survives refresh. Disabled creator music never autostarts. Source nature effects remain guest-gesture controlled |
| Opening/dial/gallery/fireworks | Original source interaction, keyboard/touch behavior and motion engine |

## Precise unsupported source fields/services

These structures are preserved in the package, hidden in production, and not
replaced with invented features or fake successes:

- **Gift / Buah Tangan:** source asks sender name, Indonesian-currency amount,
  preset amounts and message, then expects a transfer/checkout instruction flow.
  It has no card-number/cardholder UI. The approved contract has optional card
  details/receipt upload, but no amount/checkout provider or transfer API.
  `sec-hadiah` and its nav item stay hidden, and its form cannot submit. No card,
  receipt or payment UI is inserted and no transfer success is simulated.
- **Video/live:** source has prewedding video, poster and livestream URL tabs.
  There are no approved video/livestream fields or persistence/editor support.
  `sec-video`/navigation stay hidden; no captured demo live URL is retained.
- **Check-in:** source has an on-location check-in CTA without a matching platform
  check-in API. It stays hidden.
- **Guest signposts:** source has six separate practical-instruction title/text
  pairs (parking, prayer room, shoes, children, weather and camera). No contract
  stores these fields. `sec-rambu` stays hidden; its captured promises are cleared.
- **Profiles:** separate legal/nick names, parent pairs, birth-order text, personal
  bios, Instagram handles, portrait slots and personal bloom/meeting times have
  no equivalent independent contract fields. Shared names are bound, parent/bio/
  order/personal anecdote copy is cleared, and shared hosts/Instagram use existing
  matching source locations. Creator/public profiles use source initials instead
  of assuming gallery photos identify a particular person. Source flower-clock
  demonstration times remain theme mechanics; no fictional personal claims remain.
- **Other source content:** quote/verse/source, per-story dates/photos, extra
  event date/end-time/venue, separate location notes, hashtag and personally
  authored nature memories have no separate approved fields. They are cleared or
  represented by the supported shared event/story/venue data. Nature captions are
  translated into neutral theme descriptions rather than copied demo anecdotes.

These contract/service gaps need coordinator review before publication readiness
can be claimed. Their original captured markup is retained for a future approved
contract extension; this task does not expand the shared schema.

## Translation decision (confirmed 2026-10-26)

The user's Uzbek naming/default-copy requirement supersedes Indonesian source
copy. Uzbek Latin is the default production document locale and visible copy.
`locales.js` contains natural Uzbek headings, narrative, controls, form labels,
placeholders, validation/success/moderation feedback, botanical/time labels and
accessibility names, plus Uzbek Cyrillic, English and Russian variants. Personal
names/copy remain authored contract fields. Source captures are not translated.
Line lengths are shortened where needed to keep the source composition; the
original Noto Serif Display, Geologica, Waiting for the Sunrise, Fragment Mono
and Amiri font files, source colors, art and animations remain.

## Verification and remaining gates

- Six focused source/contract tests pass, including exact source engine and 33
  dependency hashes, no captured invitation values/keys/runtime, real service
  routing, no headcount, reduced-motion hooks and four-locale dictionaries.
- Web typecheck and all three packaged JavaScript syntax checks pass.
- Chromium interaction QA passes at desktop and 390px phone: opening, flower
  dial keyboard/play/reset, pond/lightbox/next/Escape, six program items, five
  palette colors, all four locale refreshes, three sample wishes, long names,
  empty sections/restoration, no horizontal overflow, no console errors or failed
  network requests. This uses a local QA harness with the real renderer payload.
- Portrait cover and source/package screenshots are produced from the real local
  renderer. The reference test page replaces font URLs with the exact localized
  captured fonts and scrubs its captured map key; the archive remains untouched.
- Native reduced-motion rendering is checked; still captures alone do not prove
  every ambient animation. A normal-motion/guest-service pass and final Uzbek
  visible-string/aria sweep are recorded in the follow-up verification report.
- Shared catalog/public routing, authenticated save/reopen/template switching and
  publish/public lifecycle remain coordinator-managed integration gates. This
  worker did not create temporary database rows, apply migrations or publish.
- No external app deployment or live payments were activated.
