# Source, mapping and release status

Exact reference: Wedivo manifest `captureType: embedded-source`, template
`dty2fpZ5Qcb4YnMt4mzf`, title **Peony Paradise — Mekar Pelan-Pelan**.
`provenance.json` records the untouched capture hash, original inline CSS/JS
hashes, and all 33 byte-exact dependencies: 19 artwork JPEGs and 14 local
Bodoni Moda/Jost/WindSong TTFs. No required design dependency is missing.

## Uzbek name and translation (2026-10-26)

The confirmed requirement is Uzbek Latin naming and default user-facing copy.
Proposed catalog name for the coordinator: **Gulbarglar sehri**. The internal ID
`wedivo-peony-paradise` remains stable; no shared registration is changed here.
`release-status.json` records this name and default locale `uz-Latn`.

The renderer defaults to Uzbek Latin when no locale is explicitly requested.
Its accessible frame title and the source document's fallback title use the
Uzbek name. Headings, source-owned body copy, controls, placeholders, form
validation/success/error states, accessibility labels, countdown/program text,
calendar filename and fixed verse citation are localized through `i18n.js`.
The dormant source anniversary/video controls also use that dictionary; their
remaining Indonesian runtime literals have been removed without enabling the
unsupported sections. Explicit English, Russian and Uzbek Cyrillic variants
remain available. Personal names, guest greeting substitutions, authored
messages, dates, places, photo captions and other creator data remain dynamic;
the adapter never translates or replaces them with reference demo data.

Uzbek headings are kept compact to fit the source: “Ikki g‘uncha”, “Birinchi
gulbarg”, “Muhabbat fasllari”, and “Baxtli kun yaqin”. Source font faces,
heading sizes, line containers, spacing, composition and animation are unchanged.
No forced line breaks or new sections/controls are added for localization.
Actual mobile/desktop line wrapping remains a browser verification gate.

Browser-native required-field validation uses localized custom validity messages.
The receipt input retains its native file selection behavior and accessible
label while a localized filename caption prevents the browser's English
“Choose file” text appearing in the Uzbek UI. Embedded maps and calendar links
receive the requested locale. These changes add no new sections or controls.

The production copy contains the reference DOM/SVG structure, original style
rules and the actual source animation/interaction engine. It is not a redraw.
No raw captured invitation, provider parameter defaults, provider preview stub,
analytics, demo account key, sample couple uploads, sample music, guest wishes
or provider data service is included in the package.

## Adaptations

- `template.css`: extracted original inline CSS; only the Google Fonts import
  is removed and 19 remote design asset URLs become local paths. `fonts.css`
  keeps all captured face/weight/style definitions with local URLs.
- `index.html`: original template DOM/SVG, with blank data-bound text and no
  remote personal media. The metadata/defaults, sample rundown and provider
  preview stub are removed. Local template/adapter scripts replace inline boot.
  Optional unsupported nodes remain present, hidden, so the complete source
  engine remains available. The no-headcount policy converts the source's pax
  field to a hidden constant; the visible label is hidden.
- `template-source.js`: original watercolor background-removal/cropping,
  generated peony geometry, split-letter reveals, silk curtain opening,
  ambient/burst petals, couple-card taps/swipes, story bloom/progress, ant/garden
  interactions, countdown, program stem, silk dye, gallery/lightbox and touch/
  keyboard navigation, gift knot, RSVP vase, wishes decoration, navigation,
  replay and optional music engine. Boot becomes `startPeonySource(payload)`;
  artwork URLs, gallery data and translated runtime labels are bound; story
  length is repeatable and item IDs are retained. Calendar and map/date binding
  move to the platform adapter for event timezone correctness. RSVP vase uses
  one flower, regardless of the legacy `maxPartySize` setting.
- `platform-adapter.js`: content via `textContent`, optional visibility,
  repeatable content, UTC calendar/ICS, user-authored map/directions and copy,
  four locales and real public APIs. It accepts a first-party parent message
  only and never starts from embedded sample defaults. Original source DOM
  remains hidden until the typed payload is supplied. Captured transfer
  confirmation is replaced by the existing private receipt service, inside the
  same source silk card. A transfer is never claimed to have succeeded.
- `platform.css`: hidden-state handling, safe text wrapping, keyboard focus,
  localized status/language controls, receipt integration and motion reduction.
  Original font sizes/layout rules are retained.
- `i18n.js`: four-language control/heading copy, including a translation of the
  source's fixed Ar-Rum verse. Creator copy is not translated or overwritten.

## Contract mapping

| Source | Shared invitation field / behavior |
| --- | --- |
| Cover, hero, couple cards, closing | localized `people[1]` (bride), `people[0]` (groom); source bride-first order |
| Guest salutation | verified renderer `guestName`, `greeting`, `personalGreeting` substitution |
| Invitation/closing copy, family line | localized `message`, `hosts`, `title`, `eventLabel` |
| Day/date/time/countdown/calendar | `startsAt`, `timezone`, shared event date helpers; calendar uses the actual instant |
| Primary event/venue/map/copy | localized venue/address/landmark, `venue.mapUrl`, latitude/longitude |
| Ordered program | stable program IDs, time, localized title and description; no source demo rows |
| Ordered story | stable chapter IDs, localized title/text; all chapters, beyond the four source examples |
| Photo placements | authored gallery ordering: hero index 0, bride index 1, groom index 2; story photos by chapter index; original source no-photo states otherwise |
| Gallery/lightbox | stable gallery IDs, uploaded URL, alt and caption; source masonry/swipe/arrows/Escape |
| Dress palette/silk interaction | localized dress style/text/note and stable named color IDs/hex values |
| Shared Instagram contact | first couple contact control; the second per-person Instagram remains hidden |
| Music | optional creator audio or central catalog preview audio; open attempts playback, source button remains and explicit pause is respected |
| RSVP vase/form | `/api/public/invitations/[id]/rsvp`; name/status/note and guest token, attending `partySize:1`, other answers `0` |
| Wishes/cards/chips | approved-wishes GET; pending moderated POST, no immediate public insertion; central sample wishes only when `preview && sampleWishes` |
| Gift/card/copy/receipt | `gift.enabled`, number/holder and existing `/receipts` service; original knot celebration runs only after the API accepts a receipt |

The source has RSVP, wishes and gift UI, so those integrations are source-backed.
Phone and Telegram sections are not injected because the source has only
per-person Instagram controls. Preview submissions never call write APIs.
Failed API calls never show source success/celebration state.

## Unresolved source fields: keep private

The shared contract/editor has no storage for source nickname versus full name,
per-person parents/birth order/biography/variety/Instagram, four personal
thank-you cards (role/name/message), five anniversary promises, creator video,
livestream, distinct second event date/end time/venue, gift shipping address,
gift amount/message acknowledgement, hashtag, story dates or per-chapter photo
assignment. These samples are excluded rather than persisted or displayed.
The ant thank-you section, anniversary garden, video/livestream, second event,
personal biography/family extras, check-in and physical-gift fields stay hidden.
Their source structure/interaction code is retained. Check-in also has no
approved platform endpoint. Current single event duration is a two-hour
calendar default because no end time exists in the contract.

These are explicit completeness gaps, not a claim that the missing fields were
implemented. Coordinator/product follow-up is required before source-complete
publication. Avoid inventing a mapping to unrelated invitation fields.

## Verification / coordinator handoff

- Proposed ID `wedivo-peony-paradise`; category `wedding`; event support only
  `wedding`. Needs one coordinator-assigned additive registration migration,
  unpublished, plus category and event assignments. Proposed price follows the
  current 15,000,000 minor-unit UZS catalog convention; coordinator confirms it.
- Focused suite passes 7/7: exact source/art/font provenance, source behaviors,
  no provider demo/runtime leakage, authored payload/no mutation, timezone,
  all locales, preview-only samples/music, no-headcount service behavior,
  preview no-send, failed-save states and receipt acceptance/preview/failure
  behavior, Uzbek naming/defaults and source-language removal. Node syntax
  checks pass.
- Template-scoped TypeScript check passes. Full web typecheck hit
  `.next/dev/types/validator.ts` importing a generated `routes.d.ts` reported
  as not a module; no template error was reported. Shared generated output was
  not edited.
- Isolated nonvisual DOM initialization passes for `uz-Latn`, `uz-Cyrl`, `en`,
  `ru`, long names, empty optionals, and an authored fixture with six ordered
  stories/six program rows/two gallery items, with no duplicate element IDs.
  Canvas/layout/audio were stubbed: this is not browser or motion evidence.
- Browser access initially timed out, then recovered. The isolated source and
  app openings were compared at the same 390×844 requested phone viewport
  (screenshots measure 390×843) and 1280×720 desktop viewport. Source artwork,
  Bodoni/Jost/WindSong typography, silk/ribbon/card layering and motion rules are
  retained. The card height naturally adapts to translated copy and the generic
  guest greeting instead of the source's two-line sample guest name; pixel
  identity is not claimed. The actual app opening is `preview.jpg`, with its
  dimensions/hash/central-fixture provenance in `provenance.json`. No app
  preview controls appear in that portrait cover.
- Browser checks passed for the source curtain/bloom opening, couple-card
  switch, palette dye, gift-knot toggle, hidden RSVP headcount, Uzbek
  required-field validation and preview RSVP/wish messages without a success
  state. Preview reduced motion sets `platform-reduced` and opens directly;
  the actual reduced-motion hero was captured. The long-name phone opening
  wraps both names with the open button visible and no horizontal clipping.
- Source/app screenshots and the form/long-name/reduced-motion captures are in
  ignored `.data/peony-qa`: `source-mobile.jpg`, `source-desktop.jpg`,
  `app-desktop.jpg`, `app-reduced-desktop.jpg`, `long-mobile.jpg`, and
  `forms-mobile.jpg`. The original reference capture stays untouched; the
  comparison copy only localizes asset paths and suppresses provider demo media,
  maps/livestream and the preview stub. Production copy is separately adapted.
- The initial normal app run had no console warnings/errors. One later
  navigation console entry reported an unassigned MutationObserver error with
  no source URL. Repeating the reduced-motion app initialization/opening with
  a frame error listener reported no errors and `data-platform-ready=true`.
  Browser commands were intermittently timing out, including the multi-locale
  browser loop; do not count that loop as verified. All four locales pass the
  separate nonvisual DOM checks. Full scene-by-scene normal/reduced motion,
  explicit locale visual review, media playback, real service persistence,
  save/reopen and shared route integration remain release gates.
- Shared catalog/registry/migrations/database/publication are untouched by this
  worker, as requested. No external deployment or live payments.

Changed paths: this public package, `apps/web/src/templates/wedivo-peony-paradise`,
and `tests/wedivo-peony-paradise-template.test.ts`. Temporary QA fixtures live
only in ignored `.data/peony-qa` and use the central preview sample.
