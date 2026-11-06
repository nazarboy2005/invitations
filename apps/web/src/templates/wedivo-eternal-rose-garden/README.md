# So‘lmas atirgullar

Proposed ID: `wedivo-eternal-rose-garden`. Source: Wedivo embedded template
`2Vn0nk5HHqwO4V5FJ6Xg`, “Eternal Rose Garden — Taman Mawar yang Nggak Pernah Layu”.
The typed catalog/package audit found no existing representation of this design.
Suggested category: `wedding`; supported event types: `wedding` only.
Proposed Uzbek catalog name: **So‘lmas atirgullar**. Uzbek Latin is the catalog
and invitation default, superseding the captured Indonesian copy. Approved
Uzbek Cyrillic, English and Russian variants remain available only when enabled.

This isolated renderer is **unregistered, unpublished and unselectable**.
The coordinator owns registry/catalog, migrations, database and publication.
Do not publish based on the unit/DOM checks alone: visual/browser and lifecycle
gates below remain open.

## Package

- `renderer.tsx`: one same-origin iframe renderer for creator preview and public
  display, authenticated contract props and updates in the host-selected locale.
- `adapter.ts`: typed `Invitation` → source payload, using the established date
  and shared preview-wish adapter. No template-specific fixture is persisted.
- `public/templates/wedivo-eternal-rose-garden/index.html`: captured DOM with
  provider manifest, preview shim, example contents/media and credentials removed.
- `source/template.css`: original CSS, changing only font import removal and
  artwork URLs. The original fonts are locally declared in `assets/fonts.css`.
- `source/template.js`: original bloom/cutout/environment/cover/reveal, vine,
  graft, sundial, floral-program-clock, palette, gallery and candle algorithms.
  Narrow documented substitutions provide platform data and localized strings.
- `adapter.js` / `adapter.css`: platform fields, locales, service calls,
  optional sections, reduced-motion and long-text safeguards.
- `source/provenance.json`: untouched capture hash and hashes/original URLs for
  15 template artwork images and 24 exact font binaries. No raw captured page
  containing its example data or credentials is served by the application.
- `scripts/templates/package-wedivo-eternal-rose-garden.py`: repeatable source
  extraction/sanitization; requires Python and BeautifulSoup. Run from repo root.

## Fields and behavior

| Captured UI | Contract / platform behavior |
| --- | --- |
| Cover, hero, person cards, graft certificate, closing | Active-locale people, hosts, event label, message and personalized greeting |
| Dew drops | Greeting, authored invitation message and hosts; original drop/reveal interaction |
| Countdown, event rose, sundial, calendars | Event instant and timezone, localized dates/time; Google Calendar and ICS |
| Story vine | Every nonempty authored story chapter, stable ID/order; source markup extends beyond four chapters |
| Flower clock | All program entries, stable IDs/order, localized titles/descriptions and times |
| Venue garden map, real map, route/copy controls | Venue name/address/landmark, supplied map URL or coordinates; no provider map credential |
| Person/hero/story/gallery photos | Creator gallery images and alt text; no provider example photos |
| Dress palette | Creator-enabled localized style/text/note and every configured color |
| Rose-language dictionary | Localized template-owned rose meanings; personal example anecdotes removed |
| Person contact links | Creator phone/Telegram contacts through the original contact slots |
| Candle RSVP | Existing public RSVP API, yes/maybe/no, optional note, guest token; no headcount input, fixed party size 1/0 |
| Wishes wall | Approved public API listing; submissions remain private until approved; preview uses only central preview wishes |
| Music | Optional configured creator URL or explicit catalog music; open gesture, source controls and retained pause preference |

Unsupported source fields are not replaced with unrelated UI: separate person
biographies/traits/parents, dated story chapters, a second separately scheduled
ceremony, prewedding video, live stream, physical-gift address and provider
check-in have no approved matching contract/service. Their demo data/UI are
hidden. Shared hosts occupy the available family slot. Source gift confirmation
asks for an amount and does not contain a card-number UI; the whole gift section
is hidden, and no to‘yona/card/receipt UI is added. Authored data remains intact
when another template can display those shared options.

## Verification and remaining gates

- Focused source/asset/privacy/service-boundary suite: 6/6 passed.
- Web TypeScript check passed during implementation; JavaScript syntax checks pass.
- Four-locale DOM execution of adapter plus source passed in preview and public
  modes (8/8 cases), with mocked service responses and SVG/canvas
  geometry stubbed: six program rows, five palette colors, six story chapters,
  gallery binding, contacts, preview wishes, RSVP selection and preview blocking,
  fixed-count yes/no payloads, HTTP-failure feedback and pending-wish privacy.
  These checks establish data/DOM integration, **not visual or animation parity**.
  Repeat with `node scripts/templates/qa-wedivo-eternal-rose-garden.cjs` in an
  environment providing `jsdom`; the disposable local QA dependency directory
  is also supported. The Uzbek cases reject untranslated source-language DOM
  copy and verify the localized music label and calendar invitation text.
- No shared registration, migrations, database writes, external deployment or
  payment activation were performed.
- Browser inspection initially opened the isolated page, then navigation,
  reinspection and browser inventory timed out. Desktop/mobile screenshots,
  motion/reduced-motion visual review, long-name fit and actual opening catalog
  artwork are pending. `catalogEligible` stays false; no substitute poster exists.
- Creator save/reopen, template switching and actual public-route lifecycle
  verification require the coordinator's shared renderer registration and remain
  pending. A full Next build was not claimed for this unregistered package.

Coordinator handoff: `01a1799d-f44a-77b1-8491-802254dc23d2`. Required additive
migration should insert this ID **unpublished**, with separate wedding category
assignment and wedding event compatibility. Price should follow the coordinator's
approved catalog policy. Publish only after the remaining gates pass.

Translation decision (2026-10-26): all built-in section headings, narratives,
buttons, field labels/placeholders, validation/success messages, countdown and
program captions, image-viewer controls, music accessibility labels and
calendar reminders default to natural Uzbek Latin. Runtime Indonesian strings
are lookup keys only, never the Uzbek output. Source identity, names, dates,
  media, biographies and private anecdotes are not translated into demo content;
they are replaced by creator fields or omitted where unsupported. Section-title
emphasis markup stays intact, and concise Uzbek labels preserve the source's
floral composition. Browser line-fit confirmation remains a release gate.
The source has no language switcher. Respecting the no-source-absent-controls
requirement, locale changes use the existing platform/route controls and the
renderer locale prop; this package injects no separate language switcher.
