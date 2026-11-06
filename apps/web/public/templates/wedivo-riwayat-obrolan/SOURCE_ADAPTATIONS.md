# Riwayat Obrolan source integration

Exact capture: Wedivo `Web invitations/templates/cl18spIdFB8VbBu1Yiyb/index.html`,
manifest type `embedded-source`. Original capture is untouched; its SHA-256 and
every packaged asset hash are in `source-provenance.json`. No rights research,
external deployment, payment activation, catalog/database changes are included.

## Uzbek presentation decision (2026-10-26)

The user requires an Uzbek catalog name and Uzbek Latin default copy, superseding
the original Indonesian defaults. Proposed name: **Bir xabardan to‘yga**, subtitle
**Suhbatimiz tarixi**. `index.html` defaults to `uz-Latn`; actual locale comes from
the shared invitation. Built-in copy, placeholders, validation/status feedback,
tooltips, icon/aria labels and countdown labels use `i18n.js`. Fixed source sticker
text is translated in the production script without changing its SVG composition;
the notification's source “P” motif becomes “S” for “Salom”. Creator names, dates,
stories and personal content stay dynamic. Other approved locales remain supported.
Line wrapping is scoped to long authored text and name slots; original typography,
source palette, section spacing, timing and animation code remain in the package.

## Package boundary

- `source/template.css` is the complete captured main style block, with only its
  Google Fonts import removed and its five exact image URLs made local.
- `assets/fonts.css` preserves the captured Google Fonts declarations, with
  twelve exact captured font files served locally: Figtree 400–900 normal,
  500/600 italic, Amiri 400/700, Gloock and Lobster.
- `index.html` retains the source DOM and its SVG/icon/sticker artwork. It removes
  the provider parameter manifest and preview stub, source sample copy/media,
  map API key/embed, external demo links and demo rundown/wishes. HTML serialization
  changes formatting, not the source element hierarchy. All source sections remain
  in the package; unsupported panels are marked `data-contract-gap` and inactive.
- `source/template.js` carries the complete source motion and interaction engine:
  notification launch, typing/reveal queue, blue ticks, bubbles, reactions,
  generated doodle wallpaper, status/photo viewers, wallpaper/theme controls,
  ambient and burst canvases, navigation/search, countdown and calendar export.
  Narrow source adaptations replace baked event date/time/gallery and Indonesian
  date arrays, use all ordered contract story chapters instead of the five-source
  limit, preserve stable program/gallery IDs, map image alt/captions, use the real
  parent invitation URL for sharing, namespace local cosmetic preferences per
  invitation and apply reduced-motion overrides before initialization.
- The provider's simulated RSVP/amount-transfer success observers and wish
  submission side effects are removed. `adapter.js` owns the existing API calls.
  Successful UI feedback requires an actual `ok:true` HTTP success. Pending wishes
  are acknowledged but never added to the public list. Public wishes GET returns
  approved messages only; previews issue no public API requests.
  An actual successful RSVP also invokes the original source chat-bubble engine
  with the selected localized status. It never invents a reply from the couple.
- The source voice-call Easter egg invokes the authored phone contact through a
  real `tel:` link. It is absent without a phone contact. The amount-transfer,
  check-in, fake group leave/mute and video controls remain inactive because no
  matching platform operation exists; no success is fabricated.

## Field mapping

| Source UI | Shared data / behavior |
| --- | --- |
| Notification senders, names, avatars, profile cards, closing | Localized `content.people`; actual `gallery` photos supply optional source avatar slots; source initials remain the empty-image fallback |
| Group title, notification opening, description, pinned message, invitation, closing | `content.title`, personalized `greeting`/`personalGreeting`, `message`, `eventLabel` |
| Formal family/hosts panel | `content.hosts`; individual source family chat anecdotes are excluded |
| Conversation chapters and source rich-text/chat parser | Every ordered `story` item, stable ID, localized title/text; story dates/photos are absent because the contract has no such fields |
| Scheduled message, event card, countdown, Google Calendar, ICS | `startsAt`, `timezone`, localized event label; no invented second ceremony; real event instant comes from shared date helpers |
| Program checklist | Every ordered `program` ID/time and localized title/description |
| Location card, decorative map, address copy, directions | Localized venue/address/landmark and authored `venue.mapUrl`; no external map embed or provider key |
| Photo albums, viewer, heart and next/previous/Escape | `gallery`, stable IDs, alt/caption; empty public albums hidden |
| Dress theme and clickable swatches | Enabled `dressCode`, localized style/text/note and every ordered color; source theme interaction retained |
| Shared Instagram and phone action | Authored contacts; shared Instagram appears once rather than inventing two individual accounts |
| Source RSVP status/name/note | Existing `/api/public/invitations/:id/rsvp`, guest token when present; no headcount field, fixed party size one for yes and zero for no/maybe |
| Wishes form and guest list | Existing moderated wishes GET/POST; preview wishes from the central fixture; no optimistic publication |
| Source music control | Optional creator audio; public playback attempted initially and again on source opening if wanted, browser failures retain the control; source pause choice persists; catalog playback requires opening interaction |

## Explicit unsupported source content

The source has per-person full/nickname/parent/bio/status fields but the contract
has only names, shared hosts, and shared contact data. Names reuse their existing
slots; absent bios/parent claims and status text are blank. The source Quran
quote/translation does not have a creator field; the pinned-message panel instead
shows the authored greeting/message in the same source card.

The source secret glossary, contact-name history, unsent-message drafts, individual
family-chat messages and historical dates have no approved editor/storage fields.
Their layouts and code remain packaged but they are not shown with provider demo
anecdotes. The family formal host panel still displays real shared hosts.

The source gift UI collects an amount, sender, and message, then expects provider
bank/wallet details. There is no matching platform amount-transfer service and no
source card-number UI. It remains hidden/inactive; no To‘yona card or receipt UI
has been added. No shipping-address field is present in this exact source DOM;
the coordinator's initial generic shipping-gap note does not establish one here.

The source video-call/live-stream UI has no approved invitation video/live-stream
field. It remains inactive. Its third-party example YouTube link is removed.
The shared artist lineup/Telegram contact/gift settings have no source slots and
are preserved in the invitation, never injected as new sections.

## Ephemeral previews

The adapter receives `createTemplatePreviewSample` data from the central fixture.
It maps the six empty preview gallery slots to this source's exact local captured
photos only when `preview && sampleWishes` and there are no creator photos.
These paths and sample wishes exist only in the renderer payload; they are never
written back to drafts or public invitation data. Source media are recorded as
`assets/preview` dependencies. Creator uploads replace them completely.

## Verification and release status

The package remains private. Full route dispatch, authenticated save/reopen,
template-switch persistence and public-route parity require coordinator wiring.
Browser evidence and remaining checks are in `browser-verification.json` and the
coordinator handoff. Mocked HTTP tests prove request/feedback behavior only; they
do not establish database persistence or Telegram delivery. Normal source-versus-
package screenshots must be assessed with the documented differences in demo
copy, optional media and unsupported panels; static images do not prove motion.
