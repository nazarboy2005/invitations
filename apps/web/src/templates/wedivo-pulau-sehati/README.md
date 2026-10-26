# Ko‘ngillar oroli — Pulau Sehati source integration

Status: **private, registered, not publication-ready**. ID
`wedivo-pulau-sehati`, display name `Ko‘ngillar oroli`, category `wedding`, supported
event types `wedding` only. Registration is additive migration
`0154_register_wedivo_pulau_sehati.sql`, price 15,000,000 UZS, published=false.
Gift-intention storage is additive migration `0155_pulau_gift_intentions.sql`;
`0156_pulau_gift_intention_amount_units.sql` names the stored integer as the
entered currency amount.
No external deployment or live payment was performed.

## Reference and exact dependencies

The selected capture is Wedivo embedded-source `ds2ytTMWiepahvAu6cOB`, titled
“Pulau Sehati — Semua Jalan Menuju Pelaminan”. Before implementation, searches
for the title, slug and capture ID in the typed catalog, packages and tests found
no existing representation. This is a procedural WebGL island game with a title
screen, walk/auto-walk, joystick/keyboard controls, camera rotation, world map,
fast travel, discovery/progress, day/night cycle and conventional page mode.

The reference capture remains untouched. `source/provenance.json` records its
SHA-256, source-script checksum, every downloaded asset URL and binary checksum.
The original embedded detail texture, shader programs, palette, materials and
procedural building/terrain geometry are reused, with focused equality checks.
The seven source JPEG texture maps and 18 font files (Lilita One, Fredoka,
Nunito, Pixelify Sans, Cormorant Garamond and Amiri) are local. No external font,
provider application runtime, preview stub, tracking, source demo photo/audio,
reference Maps key, sample wishes or provider parameter manifest is shipped.

`index.html` retains the source DOM and SVG sprites; source CSS and main script
are extracted to `source/template.css` and `source/template.js`. HTML serialization
normalizes whitespace/attribute formatting. Changes to source CSS are local asset
URL substitution and removal of its Google Fonts import. Changes to source JS
are narrow config boundaries: contract dates/timezone/deadline and gallery,
preview/reduced-motion/sound settings, per-invitation progress key, localized UI
strings, authored captions/alt text and stable program IDs. The four fixed story
slots extend to all authored chapters using clones of the source row. Original
opening, map, avatar/outfit, viewer/filter/swipe and game code remain in this
package; source opening fidelity and the exercised browser states are documented below.

## Contract mapping

| Source UI | Platform input |
| --- | --- |
| Cover, hero, character tabs and credits | Localized `people`, `eventLabel`, title/message and hosts |
| Guest name and welcome | Guest presentation props and localized personal greeting with `{name}` replacement |
| Countdown, calendar/ICS and event tile | `startsAt`, event timezone and localized date/time; no invented second ceremony |
| Festival gate schedule | Every program item ID/time/title/description, in order |
| Tower venue/directions | Venue name, address, landmark, map URL; no reference API key |
| Trophy room | All authored story chapter IDs/titles/text |
| Hero/character photos, studio/viewer | Creator gallery images only, authored captions and alt text |
| Dressing room and avatar outfit | Enabled dress code, style/text/note, all palette colors |
| Music and synthesized effects | Optional configured music and source sound control; silent previews, public playback attempt and saved sound choice |
| Adventurers’ hall RSVP | Existing RSVP API, name/yes/no/maybe/note and optional opaque guest token |
| Wishes garden | Approved public wishes API; submissions remain pending moderation |

The bridge never creates preview data. Its caller supplies the centralized
`preview-sample.json` through existing preview helpers for catalog/initial
selection. Real creator/public data replaces it. Preview sample wishes are
explicitly gated by `preview`; the adapter does not mutate the invitation.
An empty preview retains the source studio grid using the canonical empty photo
slots; an empty public gallery is hidden. No unrelated or cross-template photos
are used. Guest RSVP never asks headcount: `partySize=1` for yes and `0` otherwise.
Preview forms do not fetch or simulate success. Service errors use inline status.

The typed adapter and renderer live under `src/templates/wedivo-pulau-sehati`.
Creator preview and public display use the same isolated iframe renderer.
Locale buttons are `Uz`, `Уз`, `En`, `Ru`, gated by enabled locales. Authored text
is never machine-translated. Built-in copy is in `ui-copy.js`; its Uzbek Cyrillic
variant is generated from the template’s own Uzbek labels. The confirmed 2026-10-26 requirement sets Uzbek Latin as the default and
`Ko‘ngillar oroli` as the proposed catalog name. Production HTML is translated
before binding, and built-in runtime messages, accessibility labels, feedback,
map/discovery text, countdown/program labels and placeholders use the localized
copy table. Translation preserves source CSS, font families and motion code;
source religious/example personal text is never assigned to creator content.
Browser line-wrap, dynamic-message and glyph coverage checks remain required. Reduced motion selects page mode and disables CSS motion; it does not
replace the original engine with a newly drawn design.

## Expanded source-present support

The shared invitation object now stores validated namespaced JSONB data under
`templateData["wedivo-pulau-sehati"]`. `pulauSehatiDataSchema` validates URL
protocols, bounded text, array sizes, stats and keepsake icon IDs; existing
save/load/publication JSON persistence carries it through and template switching
preserves it. Creator controls now author inscription text and attribution,
two separate profiles and metadata, two accommodations, video/live URLs, a
second ceremony, story dates, co-inviters, five missions, six keepsakes, the
source hashtag and gift intentions. Locale-specific inscription and profile
text are authored per enabled editor language and the renderer passes only the
selected locale to the source frame.

The source adapter binds those values into the original optional sections and
keeps empty entries hidden. Film URLs are accepted only as HTTP(S) URLs; no
creator video upload API exists. The gift well records a guest's sender name,
amount and note as a private intention in its own table, visible to invitation
hosts in activity. It says clearly that this does not transfer or receive money;
no payment provider, confirmation or financial receipt is involved. Empty
optional source sections remain hidden. The source check-in button has no handler
or platform service and remains hidden. Existing parent/family shared text
continues to bind where no template-specific profile bio was authored.
## Verification and release gates

Passed locally on 2026-10-26:

- Focused source/contract/localization suite: **6/6**.
- Web TypeScript check; JavaScript syntax checks for adapter, UI copy and source.
- Real typed-adapter checks in four locales, blank invitation, immutable canonical
  fixture data, authored names/descriptions, stable IDs, personalized greeting
  and Asia/Tashkent wall-clock offset.
- Exact dependency hashes and source texture/shader/palette/geometry equality;
  complete source CSS theme variables survive import/asset localization.
- Chrome 390×844 WebGL opening → source opening action → hero panel, correct
  local source typefaces, all six canonical program rows and no width overflow.
- Four locales load their names, opening action, calendar month and preview form
  feedback. Preview submissions do not fetch. RSVP headcount is hidden.
- Reduced-motion page mode and empty optional sections; six authored story
  chapters and three synthetic authored photos; long names with word-preserving
  adaptive source typography; desktop 1280×900 map with 12 valid source locations.
- Mock transport verifies failure does not show success, RSVP sends fixed
  `partySize=1`, and wishes acknowledge pending moderation without inserting
  the pending message into the public list. This is not an actual API/DB check.
- Original source and package opening captures were visually reviewed. Source
  composition, colors, font families, texture treatment, island engine and
  opening camera/panel behavior are retained. The Uzbek title wraps onto two
  lines; optional buildings follow available contract content, unlike the source
  demo that enables all its creator-specific sections.
- `preview.png` is the actual 720×1280 bound opening with canonical fixture data,
  no personalized guest, ready local fonts, muted sound and hidden injected
  locale control. No crop/resize. Its hash and fixture hash are recorded in
  `preview.provenance.json`. Artwork eligibility does not mean publication-ready.
- `browser-matrix.json` and `browser-final.json` report no template console
  errors. The standalone server's favicon 404 and deliberately nonexistent
  `qa-pulau` public wish-list GET are harness-only responses. No template asset
  request failed. Initial failed/blank verification attempts were superseded by
  these successful runs after fixing runtime-copy initialization, CSS import
  parsing and the retained source cover-year hook.

Evidence is under `docs/templates/qa-artifacts/wedivo-pulau-sehati`:
`reference-opening-mobile.png`, `app-opening-mobile.png`, `app-open-mobile.png`,
`app-opening-desktop.png`, `app-map-desktop.png`, `app-long-mobile.png`,
`app-reduced-empty-mobile.png` and the JSON browser reports. The original source
capture is unchanged; comparison photos/dates differ because production uses
canonical/authored data instead of source demo values.

## Final package control checks (2026-10-27)

`browser-controls.json` exercises the original source handlers in Chrome with
actual keyboard, pointer and touch input. A read-only state snapshot was installed
through a debugger call frame for measurement; no QA hook was added to production.

- Keyboard W moved the character 3.84 world units; the touch joystick moved it
  2.76 units and reset to zero/inactive on release.
- Photo next and touch swipe advanced through all three authored test images;
  the warm filter applied, and authored alt text followed the selected image.
- The third contract palette colour (`#78805b`) and long-hair style updated the
  mirror, HUD and source player. Progress/outfit persisted through locale change.
- The actual Google Calendar link encodes the canonical event at 12:00 UTC
  (17:00 Asia/Tashkent). Clicking the source ICS control produced a valid
  `VCALENDAR`/`VEVENT`, correct dates/location and an alarm. QA retained the actual
  generated Blob bytes as `downloads/source-generated-calendar.ics`; this does
  not claim the browser saved a native download or created a Google event.
- Clipboard copying matched the contract venue/address; the prior clipboard
  value was restored and was never written to QA evidence.
- Configured local WAV music played and advanced; the source sound button paused
  and resumed it. A subsequent locale reload retained the guest's paused choice.
- `browser-music-retry.json` separately injects an initial browser-style
  `NotAllowedError`: one autoplay attempt failed with the control available;
  a real guest click retried actual WAV playback (readyState 4, time advancing).
  Pausing and then interacting again left the track paused with no new play call.
- Locale update to Russian retained all three photo IDs, six program IDs, music,
  visited locations and outfit; it localized the visible names without replacing
  authored content. This exercises the source-frame update/reload protocol; the
  registered React route is a coordinator integration check.
- Reduced motion selected page mode, stopped the island day cycle (`todSpeed=0`),
  reduced CSS transition time to 0.01ms and retained the chosen paused audio state.
- These runs report no template console errors or missing template assets. The
  only HTTP 404 in the final controls/audio run is the standalone QA favicon.

Extra evidence: `controls-island-mobile.png`, `controls-photo-filter-mobile.png`,
`controls-outfit-mobile.png`, `browser-controls.json`, `browser-music-retry.json`
and the generated calendar file. These supplement the canonical portrait cover,
long-name, four-locale, source-opening and responsive checks above.

**Coordinator checks completed in this integration:** typed registry/creator and
catalog preview/public route wiring; private DB registration and event/category
verification; authenticated API save/reopen/template-switch preservation; gift
intention submission and private activity listing; existing RSVP/wishes service
integration; focused schema/payload checks, TypeScript check, production build
and source JavaScript syntax checks. The public renderer is wired to the same
iframe component used in preview. The local `/preview?template=wedivo-pulau-sehati`
route was visually opened in the in-app browser: the island renderer and source
opening action load, the opening panel is Uzbek, and the source panel/control DOM
is present. This verifies renderer startup only.

The first isolated creator browser pass exposed a concrete contract bug: blank
Pulau data failed because `hashtag` had no default. Giving it an empty-string
default fixed studio initialization. A fresh
`/studio?template=wedivo-pulau-sehati&new=1` then loaded all Pulau controls in
Uzbek with no application error. Browser verification confirmed creator field
edits update the iframe preview, the gift-well toggle reveals the source gift
location and panel with the explicit no-money-transfer copy, and reload restores
local draft values. Together with the preview/opening pass above, this clears
the creator browser release gate.

**Publication (2026-10-27):** additive migration
`0157_publish_wedivo_pulau_sehati.sql` was applied to the configured database.
The database and `/api/catalog` verify the published `Ko‘ngillar oroli` entry at
15,000,000 UZS with wedding category and wedding-only compatibility. The
published preview route returns successfully. Focused adapter tests pass 2/2,
TypeScript check and production build pass, and source adapter/template syntax
checks pass. No external deployment or live payment activation occurred.
