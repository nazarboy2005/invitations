# Invitate Wedding integration

Source entry: `Invitate/Web invitations/invitate.uz/wedding.html`, as listed in
`Invitate/capture-manifest.json`. The original capture remains untouched. The
application package keeps the captured markup, CSS, and motion script isolated
under this template, with data and API binding in `wedding-adapter.js` and
`apps/web/src/templates/invitate/wedding-adapter.ts`.

The package includes all manifest-captured images used by the page, captured
Google Fonts CSS, locally downloaded WOFF2 files referenced by that CSS, the
local banner video, source audio, and eight locally captured artist portraits.
Analytics, browser anti-inspection handlers, the source `send.php` RSVP path,
and source-site footer destinations were removed. RSVP uses the application's
public RSVP endpoint. Music is opt-in and uses creator audio only. Reduced-motion
styles suppress CSS animation and the particle loop; autoplay video is paused
for reduced-motion users.

Source changes are limited to these integration adaptations:

- `index.html` retains the captured page structure and sections. Font and
  captured-image URLs point to local package files; names, date, venue, address,
  greeting, programme, gallery, dress code, and form controls are bound by the
  isolated bridge. Analytics and source-site footer destinations were removed.
  The exact captured artist section is retained because it has no contract
  field. The missing source strip/programme/location media URLs are preserved
  and are unresolved.
- `assets/css/wedding.css` is the captured stylesheet with added reduced-motion
  rules; original layout, responsive styling, and animation declarations stay.
- `assets/js/wedding.js` is the captured animation/interaction script with
  source anti-inspection/analytics behavior removed and its countdown target
  supplied by the adapter. RSVP service behavior lives in the separate bridge.
- `wedding-adapter.js` is the app-side bridge for data, locale, contacts, RSVP,
  gallery, and reduced motion; it is not part of the copied provider runtime.

Contract binding covers names, event date and countdown, invitation text,
venue/address/map, repeatable program entries, creator gallery and dress code,
RSVP, optional music, locales (Uzbek Latin/Cyrillic, English, Russian), and
guest-personalized greeting. Catalog fixture photos are preview-only and are
replaced by creator uploads; public galleries are hidden when no uploads exist.
The source photostrip stays template-owned and visible, independent of creator
gallery uploads. The captured artist section and eight portraits also remain
intact as fixed source content because the shared contract has no editable
artist-lineup field. The captured programme includes per-entry descriptions,
while the shared program contract stores only times and titles; those source
description strings are not carried into authored invitations. This remains a
source-field coverage gap for a product decision.

Release gates remain open. The manifest omits the garden-strip photo, the
programme background, and the city-at-night location video. On 2026-10-24,
direct GETs to the exact source URLs returned HTTP 404, 404, and 403. A
filename/URL search of the complete local capture archive found no recoverable
copies; the same broken strip URL also appears in the captured Aurora page.
The exact source URLs are preserved in this private package. No unrelated or
cross-template media is substituted. `preview.jpg` is a portrait screenshot of
the fully rendered shared renderer using the approved catalog fixture; capture
details are in `preview.provenance.json`.

The source contains a fixed eight-artist lineup and portraits, but the shared
Invitation contract and editor have no artist-lineup field. The program
contract stores only stable item IDs, times, and localized titles; captured
per-item program descriptions cannot be authored or persisted. These source
values remain fixed in the private package only. Treat the artist lineup as
potential sample invitation content and do not publish until the product
decision establishes whether to add editable contract/editor/storage fields or
remove that content. Do not invent those fields or silently drop the program
descriptions.

## Fidelity review (2026-10-23)

The manifest resources, entire Invitate capture tree, source HTML/CSS/JS, and
captured script text were searched for the missing URL and location video. The
page uses its captured `wedding.js`; no additional wedding runtime chunk or
copy of the missing resources was found. The source itself displays a failed
location video in the captured browser. Of the nine distinct strip images in
the captured HTML, eight have manifest resources and the 404 garden image does
not. The source photostrip and artist section remain intact in the adapted
HTML and are independent of creator gallery uploads.

The original page and package were opened in a browser at matching desktop and
390×844 mobile viewports. Their opening uses the same captured markup, hero
artwork, frame, fonts, and name/date composition, with the shared fixture
replacing the captured sample invitation values. The packaged lower page also
renders its localized program, gallery images, dress code, venue, RSVP, and
footer contacts. Preview RSVP is disabled. On the QA reduced-motion route, the
sandboxed template frame had the `reduced-motion` class and zero autoplay
videos; normal mode had `template-ready` and two autoplay videos. App and source
browser consoles showed no warning/error messages. The full-preview route now
forwards the reduced-motion flag. The catalog opening uses the same shared
renderer and preview fixture. On 2026-10-24, `tests/invitate-wedding.integration.ts`
passed against the configured database and local app: a disposable draft saved
and reopened through the creator API; the regular publication API correctly
rejected the unpublished template; then a test-only status update exercised the
local public page and iframe asset. The test removed its generated invitation,
session, and user, and verified cleanup. This does not verify creator-initiated
publication. Missing source media and the artist/program contract gaps remain
release blockers.
