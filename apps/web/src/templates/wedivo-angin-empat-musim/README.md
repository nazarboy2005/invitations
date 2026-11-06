# Seni olib kelgan shamol

Isolated Wedivo “Angin yang Membawamu — Anime Romansa Empat Musim” package.
Provider ID: `mY6OrlB3cqA84nHvvBKq`. Proposed application ID:
`wedivo-angin-empat-musim`; category `wedding`; supported event types `wedding`.
The distinctive opening uses a school locker, a love letter, anime-style
illustrations, a four-season sky, and the captured canvas/SVG/motion engine.

The original capture is untouched. The exact capture hash, ten localized
design-image hashes, eleven font-weight hashes and transformations are recorded
in the public package's `source/provenance.json`. No duplicate provider ID,
design name or existing Angin renderer was present in the typed catalogs or
packages at preflight. Original creator/demo photographs and music are excluded.
Original font outlines are retained in WOFF2 subsets covering Latin, extended
Latin, Cyrillic, punctuation and every original source character. The eleven
weights total 871,564 bytes, avoiding 70 MB of uncompressed font downloads.

`renderer.tsx` is the single proposed preview/public renderer. `adapter.ts`
maps the shared `Invitation` to source-present fields; the frame's
`platform-adapter.js` binds the original source DOM before the captured engine
initializes. The coordinator owns dispatch/catalog integration. This package
does not change the shared catalog, registry, database or publication state.

## Data and interactions

| Captured UI                                         | Shared field/service                                                                                                                                |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Opening logo, letter, hero, names and closing       | localized title, people, hosts, greeting/personalGreeting, message, eventLabel                                                                      |
| Countdown, event station, calendar/ICS              | startsAt resolved in the event timezone; date wording from the shared adapter                                                                       |
| Story player and transcript                         | all stable story chapter IDs, localized titles/text, original scene/player controls; original repeated scene structure extends beyond four chapters |
| Storyboard/program                                  | all stable program IDs/times and localized titles/descriptions, in creator order                                                                    |
| Venue station, address copy and route               | localized venueName/address/landmark, mapUrl or coordinates                                                                                         |
| Optional photos, portraits, montage, gallery/viewer | uploaded gallery URLs, captions and alt text; no creator photos means hidden optional media on public display                                       |
| Dress sheet/interactive paint                       | enabled localized dress-code fields and all stable palette IDs                                                                                      |
| Original Instagram link                             | creator's Instagram contact; no new phone/Telegram section                                                                                          |
| Music/SFX                                           | optional creator music, source controls and pause choice; preview stays silent unless explicitly enabled                                            |
| RSVP visual-novel form                              | real existing RSVP API; yes = 1, no/maybe = 0; guest-count UI and check-in hidden                                                                   |
| Wishes/comment animation                            | existing moderated-wishes GET/POST; only approved wishes displayed publicly; preview submissions disabled                                           |

The shared canonical preview fixture is supplied by the caller. Only canonical
catalog/initial-selection previews map six of this design's own illustrations
into empty gallery slots. Any uploaded image replaces that preview substitution.
The adapter never mutates or persists fixture data, media or sample wishes.

## Translation decision

User confirmed Uzbek Latin naming and default copy on 2026-10-26. Proposed
catalog name **Seni olib kelgan shamol** translates the original title naturally;
“To‘rt fasl muhabbati” is a suitable short descriptor. Built-in headings,
instructions, nav, buttons, form labels/placeholders, status messages, aria
labels, countdown/program/calendar copy and meaningful Japanese captions are
localized in the production adapter. The source's personal kana name readings
are replaced with the actual localized creator-entered names. Original fonts,
artwork, CSS geometry, canvas/SVG drawings, opening sequence and transitions
remain the design foundation. Other approved locales remain available and the
parent renderer remaps authored content when the guest changes locale.

## Source/contract gaps and release gate

Keep private/unselectable. The source has configurable character biographies,
family/supporting-character relationship notes, a proposal mini-game/anecdote,
an independent quotation/prologue narrative, venue photo, video/live stream,
song credits, a second independently configured ceremony, and a money-amount
gift-confirmation flow without a card-number UI. The current approved contract
has no corresponding fields/services. Those original structures remain hidden
and their demo values are cleared. No card number, receipt, fake transfer
confirmation or new section is added. These fields require the coordinator's
completeness review.

An additive migration is required to register this ID, wedding category and
wedding event support with `published=false`. Pricing, migration numbering,
shared registry/dispatch integration and eventual publication are coordinator
owned. Full creator save/reopen, switching, actual public route and live service
submission cannot be certified before that integration. No external deployment
or live payment activation is included.
