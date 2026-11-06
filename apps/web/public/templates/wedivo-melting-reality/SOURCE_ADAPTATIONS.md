# Source and platform adaptations

Exact capture: `Wedivo/Web invitations/templates/zkIhLR9Uv1c8xwbW76Sw/index.html`
under the nested reference archive. Its manifest says `embedded-source`.
The original capture is unchanged; its SHA-256 is in `source/provenance.json`.
No original credential, provider preview stub or parameter default data is served.

User requirement added during implementation: use Uzbek catalog naming and
natural Uzbek Latin as the default user-facing copy. Proposed catalog name is
**Tush va haqiqat**. Internal source ID and archived title stay technical provenance.
All production headings, source-generated labels/statuses, placeholders, aria
labels and calendar download names are localized in the bridge/engine. Authored
names and prose remain dynamic. English/Russian/Uzbek Cyrillic are explicit
enabled variants, never source-default fallbacks in Uzbek mode.

## Retained implementation

- The full source DOM/SVG scene, painting layers, CSS, melt geometry, WebGL shader,
  single animation loop, reveal observers, curtain/opening sequence, progress
  navigation, portrait pinches, four dream interpretations, four reality checks,
  clock-to-ring transformation, venue door, paint palette, hanging gallery,
  lightbox/swipe/keyboard/focus behavior, spinning RSVP top, wishes and closing
  composition are packaged. These are adapted source implementations.
- All required captured font faces for Fraunces, Newsreader, Syne and Caveat are
  local. The font stylesheet and template-owned decorative art URLs are remapped
  to exact captured bytes. Nine exact source gallery photos are preview-only.
  `source/provenance.json` records hashes and original asset URLs for 39 files.
- CSS is the complete captured style blocks with only the Google Fonts import
  removed and artwork URLs localized. A focused test reconstructs and compares
  that transformation. MeltClock/MeltFrame source geometry is byte-compared.

## File changes

- `index.html`: captured markup is parsed/serialized; all invitation-specific
  text, sample metadata, media URLs, remote embeds and provider JSON/preview
  runtime are removed. IDs/classes/structural SVG are retained. The RSVP
  headcount label/input are removed entirely. Local CSS and `adapter.js` replace
  inline source scripts. The page stays hidden until contract data arrives.
- `source/template.js`: extracted source engine. Dates/names/gallery/program
  read mapped data instead of constants. Event timezone controls displayed
  dates and clock hands. Source ceremony two has no default data and stays
  hidden. Program IDs and gallery accessible text come from the contract.
  Story count and paint-color count support repeatable platform data. Source
  output strings are localized. Music honors creator configuration, preview
  silence and guest pause choice. Gallery hover becomes instantaneous under
  reduced motion. The bridge runs before engine initialization to prevent demo
  flashes and source empty-state removal from racing creator data.
- `adapter.js`/`adapter.css`: separate public-contract and API bridge, optional
  section gating, four locale controls and labels, preview no-send state,
  responsive name fitting and reduced-motion overrides. Updates reload only
  this source frame with the new presentation payload; they never save data.

## Supported field mapping

| Source content | Shared contract / behavior |
| --- | --- |
| Cover/hero/closing names; portrait names | Locale-specific `content.people[0..1]` |
| Family/hosts | `content.hosts`; no invented separate parental records |
| Greeting/personal guest | `greeting`, `personalGreeting`, public guest name |
| Hero/opening/invitation/closing prose | `content.message`; distinct source prose slots share this approved value |
| Main ceremony/calendar/countdown/clocks | `startsAt`, `timezone`, localized event label; correct instant in calendar export |
| Venue/address/directions | `venueName`, `address`, `landmark`, map URL or coordinates; source door and fallback map art retained |
| Programme stairs | Ordered stable `program.id`, time, localized title/description; `programHeading` |
| Dream journal | Ordered stable story IDs and localized titles/text; extends source card pattern beyond four |
| Dress/paint models | Enabled/style/text/note, all supplied color IDs/names/hex values; extends palette pattern beyond four |
| Gallery/portrait/closing photo | Creator gallery URLs, alt/caption; original SVG/monogram fallbacks without uploads |
| Music | Optional creator URL or explicit shared catalog music; play/pause and gesture retry |
| RSVP | Existing public endpoint, name/status/note/guest token; fixed partySize 1 for attending, 0 otherwise |
| Wishes | Existing moderated wish endpoint and approved-wishes list; central three-wish fixture only in preview |

The source has **no bank-card/cardholder UI**, no receipt-upload UI, and no
standalone phone/Telegram contact section. None is injected.

## Source fields with no approved complete storage/service mapping

These are implementation gaps, not new requirements. No shared schema/editor
changes were made by this owner. No source sample values are used as creator data.

- Separate nickname versus full name, per-person parents, individual dreams/bios
  and per-person Instagram accounts: names use the two shared people and hosts;
  extra personal slots are empty/hidden. The global Instagram contact must not
  silently be assigned to a particular person.
- Dedicated cover/countdown/gallery/RSVP/wish/closing notes, quotation and source,
  closing salutation, hashtag, dream-interpretation authored pairs and reality-test
  result text: no separate editor fields exist. Template explanatory controls are
  localized; personal/custom slots are hidden or use the approved shared prose.
  The interpretation interaction remains with non-personal explanatory copy.
- Journal date/signature and distinct per-chapter photo fields: no date/signature
  defaults are retained; journal text still renders with source fallback artwork.
- Distinct ceremony-two date/end/venue/notes and livestream URL: hidden; shared
  repeatable programme is fully mapped in the stairs section instead.
- Source gift amount confirmation, postal delivery address and day-of check-in:
  no corresponding complete platform data/service exists. The original source
  nodes remain isolated but hidden; gift submission controls are disabled.
  No synthetic transfer confirmation, card-number UI or receipt success is added.
- Original provider credential-based Google Maps embed is excluded. Source door
  opens its original fallback map art and the real creator directions link works.

These source-feature gaps and the browser/integration gates in `HANDOFF.md`
must be reviewed by the coordinator before claiming complete source fidelity.
