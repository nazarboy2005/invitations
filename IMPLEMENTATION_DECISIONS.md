# Implementation decisions

This file records durable, user-approved product requirements and a small number of explicit open decisions. It is not a conversation transcript, task log, implementation checklist, or release report. Read it selectively: scan the headings, then read the sections relevant to the work and any cross-cutting requirements that apply.

## Invitation content and languages

- Keep one invitation content model independent of template rendering. Support the event's people and family/host names, event type, localized event label and invitation text, date/time, venue and directions, repeatable program entries, optional story, photos, music, contacts, RSVP, guest wishes, dress code, and optional to'yona details where supported.
- User requirement: audit Studio inputs against every published and unpublished template's actual renderer. Show only supported settings and enforce field support and slot limits on the server before saving; bypassing hidden controls must return a validation error. Previously saved content hidden by a template switch may remain unchanged for recovery, but cannot be newly authored or edited while unsupported.
- Support Uzbek Latin (`uz-Latn`), Uzbek Cyrillic (`uz-Cyrl`), English (`en`), and Russian (`ru`). An invitation may enable only the languages its creator needs; its language variants share one invitation, owner, URL, event data, and media.
- Catalog and Studio template previews use an event date ten calendar days after the visitor's current date in the visitor's timezone, refreshed on each visit. Published invitations always use their saved event date and timezone. Templates with live countdowns show an ended state after the event instant instead of negative values.
- Authored names and text are locale-specific. Never silently transliterate or overwrite another locale. Wedding starter wording may be localized; other event types must not receive wedding wording. Sample preview content is presentation-only and must never be saved or published. See the shared preview-data requirements in `AGENTS.md`.
- Optional repeated content stays optional and repeatable; do not impose fixed item counts or invent unsupported creator fields. Preserve optional content when changing templates, even when a template cannot display it natively.
- Studio optional sections show their enable switch in the section row, independently of opening the editor. Enabling opens its settings; leaving a feature that requires creator content without usable content turns it back off. Turning a feature off hides it from guests while preserving its authored data.
- Keep template-native calendar actions, including direct `.ics` downloads. Do not add a shared calendar-provider chooser.

## Venue and maps

- Yandex Maps is the approved venue provider. Preserve manually entered venues and links; provider search is optional assistance, and selecting a result must not silently overwrite later creator edits.
- Invitation map controls use the invitation's saved venue. Keep the template's original map presentation while adapting its destination to the shared venue. Do not rely on a template provider's runtime, sample venue, or external QR/URL-shortening service.
- Static invitation QR codes use a short Fotiha URL mapped to a validated Yandex Maps destination. Keep mappings immutable so an already-downloaded invitation continues to open the destination encoded when it was created.

## Creator identity and access

- Telegram user ID is the account identity for creators and administrators. Authenticate with verified Telegram identity; do not request, integrate, or store account phone numbers for sign-in, invitation creation, purchases, or administrative access. Optional creator-authored invitation contacts and guest RSVP fields remain separate from account identity.
- Ordinary bot `/start` sends one complete personalized welcome with an inline Mini App button and never asks for a phone number.
- Authenticate and authorize protected actions on the server. Do not trust client-supplied user IDs, public invitation links, Telegram usernames, or callback data as proof of ownership.
- Keep creator sessions persistent across ordinary browser restarts while valid, server-managed, revocable, and separate per browser/device. Preserve recoverable drafts through login recovery. Exact session lifetime and sensitive-action reauthentication rules remain implementation choices.

## Editing and publication

- A purchased invitation belongs to one event. At first publication, lock its event identity (main people and event type). Practical text, photo, music, program, venue, contact, and optional-setting edits remain available until the approved editing deadline.
- Identity/name corrections and postponements use administrator-reviewed requests with reasons and an audit history. A different event or different main people requires a new invitation. An approved postponement updates the existing invitation and URL; changing a date never extends editing access automatically. Only an administrator may extend the deadline.
- The initial editing deadline is the end of the approved event day in the event timezone, or the last approved ceremony for multi-ceremony events. After it, creator content edits and new personalized guest-link creation close; moderation and permitted repeat downloads remain available.
- Static invitations lock content after the first successful download except for the approved location details and start date/time. A date may move to the original approved day or earlier; a later date requires administrator approval. Previously downloaded image files do not change when the saved invitation is edited.
- Keep the creator editing deadline, RSVP deadline, receipt-upload deadline, and public-view retention as separate policies. Exact public-view retention and some guest-submission closing controls remain undecided.

## Template catalog and switching

- Catalog categories organize discovery and are independent of event types. A template may belong to multiple shared categories. Event compatibility is separately declared per template, managed in the database, checked when saving, and used to filter creator choices.
- Store a template's stable ID with the invitation; display-name changes must not change the selected renderer. Keep authored invitation data independent of the template.
- Before publication, creators may switch among published templates without re-entering content. Preview the existing content with the target design and its price. Preserve all data and uploaded asset references when switching, including optional content that the target design cannot currently show.
- Platform administrators control template publication and pricing. If a template is retired, an administrator may choose a replacement for existing invitations while preserving their identity, URL, content, and history. Retirement must not unlock creator edits or silently move invitations back if the old template is republished. Ordinary creator switching after publication, refund rules for retirement, and some replacement pricing details remain undecided.
- Preserve every template animation when improving performance. Optimize large images/videos and pause effects outside the screen, resuming them when they return; do not remove animations as a performance shortcut.
- Template source integration, publication gates, database authorization, and deployment limits are maintained in `AGENTS.md` and the template implementation prompt; do not duplicate per-template status or verification reports here.

### Removed templates — do not reimplement

- **Amru Maruf Edition** (`amru-maruf-edition-v1`) is permanently removed at the user's request. Do not recreate, restore, register, publish, or adapt this template in future work. Its source/runtime assets and application integrations have been deleted; the removal migration deletes its catalog row. The original registration migration remains only as immutable migration history.
- **E-invitation Osh Edition** (`osh-edition-v1`) is permanently removed at the user's request. Do not recreate, restore, register, publish, or adapt this template in future work. This applies only to this exact ID; other Osh and Nahorgi Osh templates remain distinct. Its source/runtime assets and application integrations have been deleted; the removal migration deletes its catalog row. The original registration migration remains only as immutable migration history.
- **Manor** (`manor-edition`) is permanently removed at the user's request. Do not recreate, restore, register, publish, or adapt this template in future work. This applies only to this exact ID; Olive Manor and other similarly named designs remain distinct. Its source/runtime assets and application integrations have been deleted; the removal migration deletes its catalog row. The original registration migration remains only as immutable migration history.
- **Royal Blue** (`royal-blue`), **Royal Green** (`royal-green`), **Royal Red** (`royal-red`), and **Bahor Navosi** (`bahor-navosi`, including queued Chorlove alias `spring-bahor`) are permanently excluded at the user's request. Do not recreate, restore, register, publish, or adapt them in future work. They were queued registry entries, not published or unpublished catalog rows; their database/catalog search returned no matches. They have been removed from the Chorlove registry and implementation queues.

## Pricing and payments

- Platform administrators set each template's price; creators and tenant administrators cannot change it. Preserve the quoted price, currency, template, and order identity in durable order records.
- A browser redirect, checkout opening, screenshot, or client status is not proof of payment. Verify provider notifications/status server-side, validate amount and currency, and make fulfillment idempotent. Pending or failed checkouts remain recoverable; do not silently switch the selected design or create a second order on return.
- A verified payment grants the applicable publication entitlement. Keep platform template fees separate from optional guest to'yona transfers and receipt uploads. Do not activate live payments or deploy externally without separate authorization.

## RSVP, guest wishes, and to'yona

- User requirement: save source-supported visitor features on every template, including unpublished templates. Activity shows only supported, enabled submission sections; retain access to existing submissions when an owner disables an optional form. Phone/deadline RSVP information is not an online attendance response form.
- User requirement: notify the owner through Telegram when visitor submissions are saved, using short, clean messages. Keep website activity as the durable record and keep receipt files private; bot messages link to activity.
- RSVP attendance is one person per response; do not add a guest-count field unless the user approves a contract change.
- User requirement: each visitor may keep one RSVP per invitation and submit at most two wishes. Editing an RSVP updates that same response; enforce both limits on the server, restore the saved RSVP after refresh, and hide the wish input after the second submission. Use the server-issued visitor cookie for anonymous visitors and the invitation guest identity when present. A shared anonymous link cannot guarantee one identity per human after cookies are cleared.
- Persist guest wishes against the invitation. New wishes remain private and pending until the owner approves them. Only approved, non-deleted wishes appear publicly. Owners can moderate them through the website; bot notifications are supplementary. Verify ownership server-side for every moderation action and safely render guest text.
- To'yona card details are optional and creator-controlled. Receipt uploads are a separate optional feature. Keep uploaded receipts private to the owner and authorized administrators; a receipt is not proof of money received. The owner reviews it manually. AI receipt screening was explicitly declined.

## Approved Studio music library

- Sample template previews choose a random track from the available music library on each opening; the selection is temporary and must never replace a creator's chosen or uploaded music.
- Studio offers the approved bundled instrumental library alongside creator audio uploads. Library music is opt-in and never replaces creator-selected music automatically; bundled tracks remain valid through save, edit, and publication.
- Keep the Step 4 music picker compact and unified: search opens one list containing bundled and creator-uploaded tracks, with preview controls beside each title and no separate player after selection. Keep chooser details to title, creator, and duration; show a scrubber instead of creator/duration while a track plays. Keep source and license records with the library and public credits rather than in the picker.
- Preserve each track's source record and required attribution. Composition status alone does not establish recording rights; exclude recordings whose source permissions are unclear. Track-level metadata and assets live with the music library rather than in this decision record.

## Record maintenance

- Add only durable, confirmed product requirements or corrections likely to guide future work. Distinguish user requirements, recommendations, and unresolved questions when those distinctions matter.
- Do not record typo fixes, routine visual polish, one-off implementation details, test results, completed-task summaries, or template-by-template audit/release status. Keep implementation plans and verification evidence in focused task documents or the relevant code/report.
- Revise or remove superseded decisions instead of appending contradictory history. When a detail is temporary, already represented clearly in code, or unlikely to affect a future decision, leave it out.
