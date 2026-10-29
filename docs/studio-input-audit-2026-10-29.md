# Studio input and music audit — 2026-10-29

The original findings below describe the earlier audit. The user subsequently
approved implementation of the language, music and capability fixes; the current
status is recorded here. Maps behavior remains deferred.

## Implemented follow-up

- Silent draft restoration. Four language toggles in one editor step; enabled
  state uses checkmarks/green styling, with independent translation editing.
  No creator-selected primary language. Public initial locale honors guest choice,
  hosting IP-country, browser language and enabled fallback, without GPS access.
  Vercel country headers are supplied in deployed requests, not local development:
  https://vercel.com/docs/headers/request-headers#x-vercel-ip-country
- A real shared piano track defaults on for new creator invitations. Existing
  off choices survive. No-track settings normalize to off without a publication
  blocker. Uploaded/selected tracks replace the one soundtrack. Failed uploads
  retain the old selection without leaving a misleading local replacement sample.
- Fixes for Modern Floral/Luxury Gold/Palace Rose looping and off states, Olive
  Manor's string/object mismatch, unintended guest-preview muting, Osh's muted
  autoplay, Aurelia's absent player, and Doira discarding selected music.
  Embedded Studio stays quiet with a separate looping listening sample.
- Version-controlled capability definitions cover every typed catalog design and
  are returned in catalog metadata. The editor and server use the same registry;
  the server ignores any client-supplied capability claims. Normalize before
  account saves/updates and publication, including old data read for public APIs.
- Unsupported content is cleared, including hidden gift/receipt/contact values,
  age, photos, program copy, story/artist slots and unrelated template payloads.
  Source limits include Barakali's one portrait and Asalari's one name.
  Deadline support is separate from actual RSVP forms or phone confirmation.
  RSVP uses one guest. Existing paid checkouts tolerate removal of unused name
  slots while retaining all visible identity/date/design protections.
- Creator gallery/artist images now require verified uploads; the editor no longer
  asks for remote image URLs and the server rejects them before storage. Existing
  external images must be replaced by uploads to save/publish that invitation.
  Catalog artwork and sample gallery data remain preview-only and unchanged.
- The final checklist groups linked missing fields by step, with locale badges.
- Maps support is explicit per template. No provider, search, key, or venue-sync
  changes are part of this follow-up.

## Follow-up verification

- Production build and TypeScript checks passed; focused Studio, contract,
  publication, music and payment tests passed: 78 focused cases, seven Doira
  source-fidelity cases, and two Pulau adapter cases. The wider affected-source
  checks retain existing Aurelia/Palace Rose price-expectation failures. Doira
  fidelity checks allow only the approved music-binding blocks and compare all
  remaining source code, artwork and effects to the untouched capture.
- Browser checks passed for language toggles/editor persistence, removal of the
  old fallback language, one-language hiding, quiet draft recovery, music
  default/remove/re-enable, desktop/mobile overflow, and Asalari/Barakali gating.
- Real authenticated POST/PUT/GET requests plus inspection of saved database JSON
  confirmed unsupported values are never stored, forged client capabilities are
  ignored, supported values survive, and remote images are rejected before insert.
  The disposable verification account, session and drafts were removed.
- Music renderer checks cover the published catalog plus affected hidden designs.
  Source-owned players outside the DOM and cover-gated audio require distinct
  checks. Final on/off/replacement checks passed for Aurelia, Doira, Osh, Osmon,
  Pulau and Zarhal; earlier checks passed for the three looping fixes, Olive
  Manor and the other affected guest previews. Silent Pulau sessions now use
  separate progress storage so they cannot overwrite active guest sound choices.
  Results/artifacts remain in the workspace output directory.

The sections below are the historical audit, not the current behavior.

## Scope and verification

Reviewed the four Studio steps, shared contract, publication validation, upload,
Places, RSVP, wishes and receipt endpoints, shared renderer adapters and selected
source bridges. Browser checks covered one-language rendering for all 90 currently
published designs and four additional affected designs, plus two-language rendering
for all 15 changed adapters. Doira needed a retry using DOM readiness rather than
network idle. Studio add/remove-language, locale persistence across steps, desktop
and mobile checks passed. These are local renderer checks, not a new authenticated
save/pay/publish lifecycle or proof of production service configuration.

Production build, typecheck and 54 focused invitation/Studio/catalog tests pass.
The wider affected-template run returned 91 passes and 14 failures. Repeating it
with reads of the 15 changed public scripts replaced by their HEAD versions
produced the same 14 failures: missing archived source paths, existing source-byte
or price expectations, an old Cloud Castle music-code assertion, and a Pulau test
invoked without the web alias configuration. Pulau's two adapter tests pass with
`--tsconfig apps/web/tsconfig.json`. No test expectations or source captures changed.

## Current music behavior

- New invitations use `enabled: false`, an empty URL and no audio asset. Selecting
  a design does not select that design's archived soundtrack.
- Catalog demonstrations generally use the shared **Emotional piano** sample;
  that is distinct from the creator's saved music. Source audio files can exist
  in a template package without becoming an invitation default.
- Turning music on exposes the shared piano, active administrator library tracks
  and the signed-in creator's ready audio uploads. Merely turning it on does not
  choose a track. Publication requires a usable track or music disabled.
- Selecting a library track replaces the invitation's one music reference.
  Successful custom upload sets the asset ID/URL/name and enables music. It
  replaces the reference rather than layering tracks. Save is still required to
  persist the change to the account. Failed uploads retain the previous track;
  the selected local file can remain as an explicitly labeled editor-only sample.
- Turning music off retains the selected reference for later reuse, but adapters
  are expected to suppress playback. Removing the track clears its reference.
- Supported background players generally loop. Browser inspection confirmed
  **Modern Floral, Luxury Gold and Palace Rose** have `audio.loop === false`.
  They currently stop at the end. There is no shared looping enforcement.
- **Olive Manor currently loses selected music:** its React adapter sends a URL
  string, while its source renderer reads `data.music?.url`. A configured track
  produced no audio element in the browser. This mismatch also affects public
  rendering because it uses the same adapter.
- Some Studio source previews intentionally suppress music. The middle-column
  audio player is a separate manual sample. Full guest preview/public playback
  attempts vary by template (opening gesture or initial autoplay). The shared
  public helper retries blocked playback on a normal guest interaction and does
  not continuously restart a guest-paused track. Audible autoplay remains subject
  to browser permission. The editor audio sample itself does not loop.
- Upload limits/formats are 15 MB, MP3/WAV/M4A. Ready media is verified before
  publication. Creator uploads require sign-in and configured storage; an
  unuploaded local preview cannot be published as a track.

Relevant implementations: `modules/studio/studio.tsx`,
`modules/catalog/catalog-music.ts`, `modules/catalog/invitation-view-tracker.tsx`,
`templates/olive-manor/renderer.tsx`, public
`templates/olive-manor-edition/renderer.js`, and the three non-looping bridges.

## Confirmed input gaps

| Input / feature | Current mismatch | Recommendation only |
| --- | --- | --- |
| Template capabilities | Studio exposes common optional controls regardless of what the chosen design renders. There is no per-design capability gate. Saving a value does not establish that it appears. | Declare supported fields/limits per design and hide unsupported controls while preserving stored data on template changes. |
| Photos | Asalari and Tovus do not map creator galleries at all. Barakali maps only the first uploaded photo, although Studio permits 50 and presents them as a gallery. | Hide photos for designs without photo slots; describe/enforce Barakali's one portrait slot. |
| Program and dress code | Barakali maps neither program rows nor dress-code settings, while Studio offers both. | Hide these sections for designs that do not render them. |
| Gift card and receipts | Studio offers card details and receipt uploads globally. Tovus/Asalari do not map gift details, and their renderers do not install the shared receipt form. The receipt backend exists, but that does not create a guest-facing form for these designs. | Gate card and receipt controls independently by actual renderer support. |
| RSVP and party limit | The backend enforces deadline and maximum party size for real RSVP submissions. Many source designs submit only one person; some use phone confirmation or show only deadline text. Tovus maps a deadline but has no RSVP submission form. Asalari maps no RSVP setting. Studio still offers a global maximum-party-size input. | Follow the existing one-person product rule and remove the generic party-limit input; distinguish phone confirmation, deadline information and a real response form. |
| Contacts | Asalari does not map the Studio phone/Telegram fields. Tovus also has no contact mapping. Barakali maps phone only, not Telegram. | Expose only the contact types the chosen template supports. |
| Birthday age / names | Studio shows age for every birthday, but only Asalari and Sharlar consume `celebrantAge`. Asalari reads only the first person while Studio can add more names. | Restrict age/name slots to actual supported fields. |
| Maps availability | Google Places server endpoints exist; the checked local environment has no `GOOGLE_MAPS_API_KEY`. Guests cannot use authenticated Places search. Manual address and map-link entry remain available. | Configure and verify Places, or make manual entry the clear default. This finding does not establish production key status. |
| Map consistency | Editing a previously selected place's name/address does not clear its old coordinates/link. Pasting a new map URL also retains old coordinates. Some embedded panels use coordinates while direction buttons prefer the URL, so they can point to different places. | Keep venue identity, coordinates and link synchronized, with explicit reset/replace behavior. |
| External image links | Studio checks only the URL prefix; public-media validation accepts external HTTP(S) gallery URLs without verifying image content or lasting availability. A page link, protected image or expired signed URL can remain saved but fail to display. | Prefer upload; verify external image loading and explain failed/temporary links. |

Evidence is in the generic controls in `modules/studio/studio.tsx`,
`modules/studio/place-search.tsx`, `server/publication.ts`, public RSVP route,
`templates/use-invitation-extras.ts`, and the Asalari, Tovus and Barakali adapters.

## Operational dependencies and supported paths

Creator uploads, server-side media checks, moderated wishes, real RSVP storage and
private receipts have backend implementations. They are not all inert fields.
They depend on sign-in/publication, database access and, for files, storage. Local
configuration currently chooses local storage and has no complete R2 settings.
That is suitable for local work; production storage must be verified separately.
The Pulau gift-well feature records private gift intentions; it does not transfer
money. Its video/live fields are URL-based, not a video-upload service.

Recommended priority: per-template field support first, venue synchronization
second, then consistent music mapping/looping and upload feedback. No Mapbox
migration, music-default change or additional feature repair was made in this pass.
