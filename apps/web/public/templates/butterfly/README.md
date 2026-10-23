# Butterfly source package

Provider: Invitate.

Exact captured source folder: `Invitations - this folder will be removed from
production/Invitate/Web invitations/invitate.uz`, resolved from
`Invitate/capture-manifest.json` entries for `butterfly.html`,
`assets/css/butterfly.css`, `assets/js/butterfly.js`, the referenced
`assets/images/rasm1.png`, `assets/images/afina/image2.png` and
`assets/images/afina/image3.png`, the captured `assets/audio/music.mp3`, and
font files listed in the captured Google Fonts stylesheet. `afina/image.png`
and `afina/image4.png` are also packaged from the provider's template asset
folder but are not referenced by the selected `butterfly.html` page.

`font-reference.css` is the untouched Google Fonts response captured in the
provider archive and is retained as source evidence only; the application
page does not link it. The local `index.html`, `assets/css/butterfly.css`, and
`assets/js/butterfly.js` retain the captured template structure, design, and
motion while replacing the reference-site runtime dependencies. The captured
statistics script, injected browser-extension markup, external font requests,
fixed names/date/venue/map, and automatic audio-start/retry logic are removed.
Source music is included as an asset but only a creator-selected music URL is
bound; playback starts from the template's explicit music control. The source's
global pointer and visibility handlers that retried autoplay are removed, while
the control's fade, pause, and replay behavior is retained. Captured
opening and source gallery images are packaged under `assets/images` and used
for the ephemeral catalog/empty-selection preview gallery only.

The captured font CSS points to Manrope and Marcellus Cyrillic subsets that
were absent from the complete provider archive. Those two files were fetched
from the exact `fonts.gstatic.com` URLs recorded in `font-reference.css` and
are packaged as `assets/fonts/manrope-cyrillic.woff2` and
`assets/fonts/marcellus-cyrillic.woff2`. The captured archive already contains
the Latin subsets and Cormorant Cyrillic subset. The local CSS uses separate
Unicode ranges for Latin and Cyrillic so Uzbek Cyrillic and Russian do not
fall back to an unrelated font face.

## Contract binding

`apps/web/src/templates/invitate/butterfly-adapter.ts` maps the shared
invitation contract to Butterfly's source DOM through the isolated
`butterfly-renderer.tsx` iframe. Names, personalized greeting, event label,
invitation copy, localized date/time/countdown, venue/address/map, uploaded
gallery photos, and optional music are connected. Preview gallery photos are
ephemeral and are omitted when creator uploads exist. Four supported locales
are mapped, and the source stylesheet has reduced-motion overrides.

The captured source contains no program, RSVP form, gift/to'yona, dress-code,
contact, or guest-wish sections or behavior. The shared contracts support
several of these features, but this reference has no corresponding template UI;
those gaps must be resolved or explicitly accepted in a reviewed product
decision before publication.

`preview.png` is a portrait browser capture of the real `.opening-scene` rendered
through `/preview?template=butterfly` with the shared
`preview-sample.json` fixture. The fixture is preview-only.

## Fidelity review

The complete provider archive and its capture manifest were searched for
Butterfly-specific bundles and assets; the manifest-referenced page, CSS, JS,
audio, photographs, and captured font response were the available template
source. A local browser comparison at 1280×800 and 390×844 found matching
opening-scene geometry (1120×770 desktop; 372×719 mobile), matching typeface,
name lockup and date layout, and no browser errors. The package preserves the
source opening eyebrow (“Bismillahir rohmanir rohim”); a first comparison
revealed an adapter overwrite which was removed. Gallery lightbox open and
Escape-close behavior were also checked.

Reduced motion intentionally suppresses the source's animated butterflies and
gate-opening transition. The source's static reduced-motion page retains the
full gate image overlay, while the adapted page hides the gate overlay to avoid
blocking interaction; that visible accessibility difference remains. The
captured sample also has an internal countdown-date mismatch (its displayed
date and source countdown target differ); the adapter binds the authored event
date consistently instead. Full invitation fields still need a product
decision before publication (see above).

## Release status

Private and unselectable. The source directory remains untouched. The typed
catalog entry and additive `0129_register_butterfly_template.sql` migration
register `butterfly` for wedding events in the wedding category at 15,000,000
UZS. The configured database confirms migration 0129 is applied and the row is
still unpublished; the template remains unselectable because field/service
gaps and full release verification are unresolved.

`node --check apps/web/public/templates/butterfly/assets/js/butterfly.js`
passes. The focused Butterfly suite passes 3/3, and a scoped TypeScript check
of its adapter/renderer passes. The database-backed catalog check confirms
Butterfly is excluded from the public catalog and present when unpublished
entries are requested. The local preview route rendered the shared sample;
desktop and portrait openings were inspected, and the gallery lightbox opened
and closed with Escape without browser page errors. The workspace-wide web
typecheck currently fails on a stale `.next/types/validator.ts` reference to
`src/app/safir-qa/page.js`; its generated route output is shared with concurrent
work. No publication, external deployment, or payment change was made.
