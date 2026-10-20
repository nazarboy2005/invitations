# Marxaba template implementation progress

## Scope

This batch continues from Anor and follows the captured Marxaba catalog order in
`Invitations - this folder will be removed from production/Marxaba/capture-manifest.json`.
The source capture is read-only. Each production template must use its own full
template source and assets, plus a separate platform adapter. A row is complete
only after integration and verification; templates with unresolved blockers
remain unpublished.

The capture contains **46 Marxaba templates**. Anor is the already-integrated
reference; the next ten are the ten immediately following it in the captured
catalog order.

## Complete source inventory

| # | Category | Template | Status |
|---:|---|---|---|
| 1 | Nikoh | Toscana | Not started |
| 2 | Nikoh | Vals | Not started |
| 3 | Nikoh | Muhr | Not started |
| 4 | Nikoh | Bulbul | Not started |
| 5 | Nikoh | Qandil | Not started |
| 6 | Nikoh | Ko‘zgu | Not started |
| 7 | Nikoh | Parda | Not started |
| 8 | Nikoh | Doira | Not started |
| 9 | Nikoh | Ganch | Not started |
| 10 | Nikoh | Qatlam | Not started |
| 11 | Nikoh | Anor | Integrated; preview-only pending blockers |
| 12 | Nikoh | Oltin Nur | Source copied; iframe renderer active; verification in progress |
| 13 | Nikoh | Samarqand Kechasi | Source copied; shared renderer registered; verification pending |
| 14 | Nikoh | Bog‘i Eram | Source copied; shared renderer registered; verification pending |
| 15 | Nikoh | Atlas | Source copied; shared renderer registered; verification pending |
| 16 | Nikoh | Uchar Gilam | Source copied; shared renderer registered; verification pending |
| 17 | Nikoh | Oq Kabutar | Source copied; shared renderer registered; verification pending |
| 18 | Nikoh | Kuzgi Chinor | Source copied; shared renderer registered; verification pending |
| 19 | Nikoh | Muhabbat Kitobi | Source copied; shared renderer registered; localized story chapters supported; verification pending |
| 20 | Nikoh | Sahifa | Source copied; shared renderer registered; verification pending |
| 21 | Nikoh | Oltin Uzuk | Source copied; shared renderer registered; verification pending |
| 22 | Nikoh | Oynavand | Not started |
| 23 | Nikoh | Somon Yo‘li | Not started |
| 24 | Nikoh | Qog‘oz Turna | Not started |
| 25 | Nikoh | Nilufar | Not started |
| 26 | Nikoh | Suzani | Not started |
| 27 | Nikoh | O‘rik Guli | Not started |
| 28 | Nikoh | Paxta | Not started |
| 29 | Nikoh | Monogram | Not started |
| 30 | Nikoh | Retro Kino | Not started |
| 31 | Nikoh | Sahro Fonusi | Not started |
| 32 | Qiz uzatish | Lola | Not started |
| 33 | Qiz uzatish | Qiz Bazmi | Not started |
| 34 | Sunnat to‘yi | Shahzoda | Not started |
| 35 | Sunnat to‘yi | Chavandoz | Not started |
| 36 | Beshik to‘yi | Beshik | Not started |
| 37 | Nikoh | Konfetti | Not started |
| 38 | Tug‘ilgan kun va yubiley | Shirin Bayram | Not started |
| 39 | Tug‘ilgan kun va yubiley | Oltin Yosh | Not started |
| 40 | Tug‘ilgan kun va yubiley | Oltin Kuz | Not started |
| 41 | Osh va iftorlik | Nahor | Not started |
| 42 | Osh va iftorlik | Nahorgi Osh | Not started |
| 43 | Osh va iftorlik | Hilol | Not started |
| 44 | Boshqa tadbirlar | Bitiruv | Not started |
| 45 | Boshqa tadbirlar | Korporativ | Not started |
| 46 | Boshqa tadbirlar | Yangi Uy | Not started |

## Next-ten batch

| Order | Template | Renderer / source audit | Contract adapter | Catalog + DB | Verification / blockers |
|---:|---|---|---|---|---|
| 1 | Oltin Nur | Full source + local fonts/art copied; shared typed adapter and all app routes connected | Shared contract mapped; optional dress code supported | Catalog IDs, exact preview art, and unpublished DB seed migration added | Browser rendering and silent default-audio load confirmed; full interaction/locale/device checks pending |
| 2 | Samarqand Kechasi | Full source copied; three missing reference assets recovered | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Default CC0 catalog-preview music wired; source toggle retained; runtime verification pending |
| 3 | Bog‘i Eram | Full source and local fonts/art copied | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Default CC0 catalog-preview music wired; source toggle retained; runtime verification pending |
| 4 | Atlas | Full source and local fonts/art copied; hardcoded event/date/location copy removed | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Default CC0 catalog-preview music wired; source toggle retained; runtime verification pending |
| 5 | Uchar Gilam | Full source copied; three missing reference assets recovered | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Default CC0 catalog-preview music wired; source toggle retained; runtime verification pending |
| 6 | Oq Kabutar | Full source and local fonts/art copied | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Default CC0 catalog-preview music wired; source toggle retained; runtime verification pending |
| 7 | Kuzgi Chinor | Full source and locally packaged fonts/art copied | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Default CC0 catalog-preview music wired; source toggle retained; runtime verification pending |
| 8 | Muhabbat Kitobi | Full source copied; demo story override removed; authored story pages use the original chapter layout and illustrations | Optional repeatable localized chapter fields wired through contract, editor, save/reopen, template switching, and renderer | Catalog IDs, exact preview art, unpublished DB seed migration added | Silent default-audio load confirmed; story visual QA and remaining interaction verification pending |
| 9 | Sahifa | Full source and local fonts/art copied; hardcoded sample names/location removed | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Default CC0 catalog-preview music wired; source toggle retained; runtime verification pending |
| 10 | Oltin Uzuk | Full source and local fonts/art copied; sample engraving names/date removed | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Default CC0 catalog-preview music wired; source toggle retained; runtime verification pending |

## Progress log

- 2026-10-20: Inventoried all 46 captured Marxaba designs, verified the order
  against the capture manifest, and selected the ten after Anor. Oltin Nur is
  first. No reference files have been changed.
- 2026-10-20: Copied all ten complete source template folders into the app,
  copied the shared Marxaba runtime and local vendor dependencies, and added a
  typed shared invitation adapter for editor preview, full preview, and public
  rendering. Packaged the exact metadata preview images, local Google Fonts,
  and four assets absent from the capture. Removed source sample data and
  hardcoded example names/date/location from the relevant app copies. Added
  ten unpublished catalog definitions and migration `0005`; it has not been
  applied because the template implementation brief prohibits live database
  mutations. The Neon URL was supplied in chat but is not configured locally.
  Oltin Nur renders the shared sample content in the browser. Batch interaction,
  locale, desktop/mobile, and build verification remain in progress. The
  At this point in the log, Muhabbat Kitobi story fields were still pending;
  receipt upload is still an application-level backend gap. Audited music UI in
  all ten copied templates: each includes the reference mute/play button and
  audio element, but none includes an audio file; their `meta.js` music values
  are style descriptions. The separate local Spring Bahor reference page has a
  working toggle and streams `Patrick Watson – Je te laisserai des mots` from
  its source site. It is not packaged into the product because its reuse rights
  are unverified. Creator music selection now includes reusable tracks the
  authenticated creator uploaded previously; public delivery resolves an
  owned track when any of that creator's published invitations references it.
  Studio and local start scripts now use port 3001. Browser review caught and
  fixed Sahifa's static "14 Noyabr" date; its date spread now uses the shared
  invitation day and month fields. Typecheck, all 33 repository tests, and an
  isolated production build passed. The batch remains unpublished pending
  per-template visual/interaction review and the noted story, receipt, audio
  rights, and database-configuration gaps.
- 2026-10-20: In response to the catalog-music correction, added a built-in
  CC0 1.0 "Emotional Piano" track to every supported full catalog preview and
  made it an optional choice in the creator music library. Catalog audio only
  starts after the original template open interaction and is not written into
  the sample invitation. Updated the shared fixture names to Asadbek and
  Gulhayo, and changed visible language labels to Uz, Уз, En, and Ru while
  retaining locale codes internally. The audio is a 16-second loop; verify its
  quality and playback behavior across all templates before calling the batch
  ready.
- 2026-10-20: After the user asked to test without sound, verified all ten
  Marxaba preview frames and Anor while each remained before its open action:
  the same global catalog track was assigned, each audio element stayed
  paused, and each template's open control was present. Muhabbat Kitobi needed
  extra time to finish loading, then passed the same silent check. The shared
  source for changing the default across every design is
  `apps/web/src/modules/catalog/catalog-music.ts`.
- 2026-10-20: Tested the ten-template preview batch with temporary long names
  (`Muhammadali Sherzodbek` and `Gulruxsora Mahbuba`) without opening or playing
  any invitation. Found Sahifa's intro width expanding beyond the mobile
  viewport; added a platform-bridge fit rule that keeps its glyph animation
  while reducing only oversized names. Rechecked all ten frames: catalog audio
  remained paused at time zero. Restored the shared fixture to Asadbek and
  Gulhayo. This is a targeted mobile name-fit check; complete locale, desktop,
  and per-section visual review remains pending. The Neon URL was supplied in
  chat, but it is not stored in the local environment; migration `0005` remains
  unapplied per the template implementation brief's live-database restriction.
- 2026-10-20: Added the seven existing E-Taklifnoma captures to the local
  reference gallery, grouped under Nikoh to'yi, Nahor oshi, and Xatna to'yi.
  The gallery serves each saved category from its own localhost root so
  root-relative Nuxt and cached asset paths keep working. Confirmed all seven
  page files return HTTP 200 and sampled six local stylesheet/script/font or
  media assets from each page with no missing responses. The reference capture
  files were left untouched; these are gallery references, not production
  templates. The Marxaba batch remains in verification and is not marked
  complete.
- 2026-10-20: Rechecked the main name lockups in all ten Marxaba frames at the
  mobile preview viewport (about 474 × 764). Asadbek and Gulhayo are present in
  full and their rendered text bounds are not clipped by any overflow ancestor;
  the exact Sahifa preview image also shows both names completely. Revisited
  the earlier long-name regression check: Sahifa's oversized names are handled
  by the shared bridge while keeping the captured glyph animation. A silent
  runtime sweep kept every template's audio paused at time zero and found no
  browser console errors. Current `pnpm typecheck`, all 33 `pnpm test` cases,
  and `pnpm build` pass. These checks do not cover desktop visual comparison,
  every below-the-fold interaction, every locale in every design, or all lazy
  media loads; the batch remains in verification and unpublished.
- 2026-10-20: Fixed a locale-switch race in the shared Marxaba renderer: on a
  data or language change, it now navigates the iframe to the exact new frame
  URL instead of reloading the previous document URL. Verified live switching
  among Uz, Уз, En, and Ru in all ten templates; each frame adopted the selected
  locale, retained Asadbek/Gulhayo and the event date, localized its greeting,
  and kept audio paused. Uchar Gilam's typewriter greeting was checked after
  completion separately in all four languages. Typecheck, all 33 tests, and a
  production build pass with the renderer change. Desktop comparison, full
  below-the-fold interaction review, and production media/payment blockers
  remain open.
- 2026-10-20: Audited the shared sample binding in all ten frames: both names,
  greeting, event date, venue name/address, and all four repeatable program rows
  populate from the contract. Each catalog preview resolves the same default
  emotional-piano file and every audio element remains paused at time zero.
  Checked copied HTML/CSS local asset references against the packaged files;
  all resolve. A source scan found no sample couple names, fixed example date,
  phone number, or 16-digit card number left in the template HTML/CSS/JS. The
  only available browser surface is the 474-pixel-wide in-app viewport, so
  desktop visual comparison and full opened-page interaction review remain
  pending; opening an invitation was avoided to honor silent testing.
- 2026-10-20: Captured the initial mobile opening state for all ten templates.
  Oltin Nur's short-height source rule intentionally hides the full name
  lockup before opening and presents the couple's monogram instead; names are
  still bound in the document and appear in its post-opening hero. These are
  implementation captures, not side-by-side comparisons with the reference;
  completed opening transitions and below-the-fold interactions remain
  unverified because they may start the assigned music.
- 2026-10-20: Investigated the reported name clipping in the mobile previews.
  The Sahifa opening screenshot shows both Asadbek and Gulhayo in full. A
  shared `width: 100%` override was overriding the source opening-card insets
  in Kuzgi Chinor, so it was removed; the shared bridge now scales a name only
  when its painted text is wider than its authored lockup. Rechecked Kuzgi
  Chinor in the 474 × 764 preview: both names fit inside the original card.
  The other nine templates retain their source sizing when their text fits.
  `pnpm typecheck`, all 33 tests, and `pnpm build` pass. Long custom names and
  desktop title layouts still need dedicated visual QA.
- 2026-10-20: The user approved optional repeatable story chapters with a stable
  ID and localized title/body for Muhabbat Kitobi. Added the fields to the
  shared invitation contract and default draft, exposed per-language chapter
  editing in Studio, included chapters in the shared Marxaba adapter, and kept
  empty chapters out of catalog/demo fallback detection. The captured chapter
  page scaffold and illustrations remain template-controlled; the original
  opening sequence now reads authored chapters from shared invitation data.
  Chapter numbers are generated by the shared runtime, and story-section
  visibility updates when preview content changes. JSON round-trip, template
  switching, max chapter count, and story-only authored-content tests pass.
  Typecheck, 34 tests, production build, formatting, and runtime-script syntax
  checks pass. Muhabbat Kitobi remains unpublished pending full visual and
  interaction review; other batch verification and media/payment blockers
  remain open.
- 2026-10-20: A fresh mobile preview of Samarqand Kechasi confirmed shared
  names and all four program rows are present in the template DOM while its
  opening cover is locked; accessibility snapshots of that initial cover do
  not expose the hidden invitation pages. A silent batch sweep confirmed all
  ten preview routes and their opening controls load. The browser recorded a
  Uchar Gilam runtime error in `makeFlightCarpetTexture` when reading
  `capabilities` from a null object, plus unattributed GSAP missing-target
  warnings during the sweep. These findings need investigation and per-template
  rechecks before publication. Samarqand's audio was paused at time zero; no
  opening control was activated.
