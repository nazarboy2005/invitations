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
| 12 | Nikoh | Oltin Nur | Integrated; mobile/desktop preview data, locales, empty optionals, and silent audio checked; opening interaction, voice behavior, and publication gates pending |
| 13 | Nikoh | Samarqand Kechasi | Source copied; shared renderer registered; verification pending |
| 14 | Nikoh | Bog‘i Eram | Source copied; shared renderer registered; verification pending |
| 15 | Nikoh | Atlas | Source copied; shared renderer registered; verification pending |
| 16 | Nikoh | Uchar Gilam | Source copied; shared renderer registered; async texture callback guarded against a disposed/lost WebGL context; regression and full verification pending |
| 17 | Nikoh | Oq Kabutar | Source copied; shared renderer registered; verification pending |
| 18 | Nikoh | Kuzgi Chinor | Source copied; shared renderer registered; verification pending |
| 19 | Nikoh | Muhabbat Kitobi | Source copied; shared renderer registered; localized story chapters supported; verification pending |
| 20 | Nikoh | Sahifa | Source copied; shared renderer registered; verification pending |
| 21 | Nikoh | Oltin Uzuk | Source copied; shared renderer registered; app copy guards empty GSAP target arrays; full verification pending |
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
| 1 | Oltin Nur | Full source + local fonts/art copied; archive inventory matches all captured source files | Shared contract mapped; optional dress code and voice-message data supported | Catalog IDs, metadata preview art, and unpublished DB seed migration added | Silent browser open/RSVP/wishes flows checked with intercepted API requests; long-name clipping checked at mobile and desktop canvas edges; sample bindings, four locales, empty optionals, and paused preview music checked. Authenticated save/reopen/media round trip, authored voice, complete controls/reduced-motion/reference comparison, rights, and publication gates pending |
| 2 | Samarqand Kechasi | Full source copied; three missing reference assets recovered | Shared adapter connected; opening-cover greeting has English/Russian translations; post-open locale controls revealed for source openers that omit the shared event | Catalog IDs, exact preview art, unpublished DB seed migration added | Fresh desktop preview checked: English and Russian opening covers and full opened page use localized fixed copy; four sample program entries and empty optional sections behave as expected. Audio remained muted under `qaSilent=1`. Full interaction, authored voice, mobile and publication gates pending |
| 3 | Bog‘i Eram | Full source and local fonts/art copied | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Desktop locked preview checked: Asadbek/Gulhayo, four program entries, empty optional sections hidden, catalog music bound and paused; all four locale controls switch and update the rendered locale. No browser warnings/errors observed. Opening, interactions, voice, mobile and publication gates pending |
| 4 | Atlas | Full source and local fonts/art copied; hardcoded event/date/location copy removed | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Desktop locked preview checked: Asadbek/Gulhayo, four program entries, empty optional sections hidden, catalog music bound and paused; all four locale controls switch and update the rendered locale. No browser warnings/errors observed. Opening, interactions, voice, mobile and publication gates pending |
| 5 | Uchar Gilam | Full source copied; three missing reference assets recovered; app copy guards the async texture callback against teardown/context loss and safely defaults anisotropy when renderer capabilities are null | Shared adapter and voice-message data connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Desktop locked preview checked: Asadbek/Gulhayo, four program entries, empty optional sections hidden, catalog music bound and paused; all four locale controls switch and update the rendered locale. No browser warnings/errors observed. Deliberate context-loss regression, opening, interactions, voice, mobile and publication gates pending |
| 6 | Oq Kabutar | Full source and local fonts/art copied | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Desktop locked preview checked: Asadbek/Gulhayo, four program entries, empty optional sections hidden, catalog music bound and paused; all four locale controls switch and update the rendered locale. No browser warnings/errors observed. Opening, interactions, voice, mobile and publication gates pending |
| 7 | Kuzgi Chinor | Full source and locally packaged fonts/art copied | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Desktop locked preview checked: Asadbek/Gulhayo, four program entries, empty optional sections hidden, catalog music bound and paused; all four locale controls switch and update the rendered locale. No browser warnings/errors observed. Opening, interactions, voice, mobile and publication gates pending |
| 8 | Muhabbat Kitobi | Full source copied; demo story override removed; authored story pages use the original chapter layout and illustrations | Optional repeatable localized chapter fields wired through contract, editor, save/reopen, template switching, and renderer | Catalog IDs, exact preview art, unpublished DB seed migration added | Desktop locked preview checked: Asadbek/Gulhayo, four program entries, empty optional sections hidden, catalog music bound and paused. Empty story is hidden; all four locale controls switch. Story chapter visual QA, opening, interactions, voice, mobile and publication gates pending |
| 9 | Sahifa | Full source and local fonts/art copied; hardcoded sample names/location removed | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Desktop locked preview checked: Asadbek/Gulhayo, four program entries, empty optional sections hidden, catalog music bound and paused; all four locale controls switch and update the rendered locale. No browser warnings/errors observed. Opening, interactions, voice, mobile and publication gates pending |
| 10 | Oltin Uzuk | Full source and local fonts/art copied; sample engraving names/date removed; empty GSAP animation targets guarded in the app copy | Shared adapter and voice-message data connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Desktop locked preview checked: Asadbek/Gulhayo, four program entries, empty optional sections hidden, catalog music bound and paused; all four locale controls switch and update the rendered locale. No browser warnings/errors observed. Opening, interactions, voice, mobile and publication gates pending |

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
- 2026-10-20: Continued with Oltin Nur as the single template under review.
  Compared its app package with the original ZIP: all ten captured template
  source files are present; the app copy also includes its local font files,
  font declarations, and catalog preview artwork. The 390 × 844 mobile and
  default desktop full-preview frames loaded with no browser console warnings
  or errors in the locked opening state. The actual iframe DOM contains the
  shared Asadbek/Gulhayo names, localized date, venue, and four program items;
  Uzbek Latin, Uzbek Cyrillic, English, and Russian controls all updated the
  greeting and date while preserving names. Empty dress-code, gallery,
  to'yona, and contacts sections were hidden. Catalog preview audio remained
  paused at time zero throughout. The opening action was not activated because
  it can start audio; full opening/motion and below-fold interaction checks
  remain pending. The browser blocked navigation to the original `file:` URL,
  so a side-by-side reference screenshot comparison remains pending. Oltin Nur
  stays unpublished and the batch migration remains unapplied. The Uchar Gilam
  source shows a plausible stale-image-load race: its texture loader composes
  the carpet texture before checking whether the shared WebGL renderer was
  disposed. This source-level explanation has not been reproduced in the
  unopened preview, and the GSAP warning source remains unverified; Uchar Gilam
  remains pending and was not changed in this single-template pass.
- 2026-10-20: Repository `pnpm typecheck`, `pnpm test` (34/34), `pnpm build`,
  and `git diff --check` passed. These repository checks do not close Oltin Nur's
  remaining opening-animation, interaction, reference-comparison, or
  publication gates.
- 2026-10-20: The user expanded the active scope to all ten templates and
  explicitly called out voice support and the shared JSON/music setup. Began a
  ten-template runtime audit and confirmed the centralized preview fixture is
  the data source and the single catalog soundtrack is injected by the shared
  renderer. The voice-message field/control is not present in the shared
  invitation contract or current creator editor; its required placement and
  whether it is a spoken greeting separate from background music still need
  confirmation before adding a product behavior. Applied a defensive guard to
  Uchar Gilam's copied async texture callback so it checks the renderer, mesh,
  and WebGL context before reading renderer capabilities. Original captures
  remain untouched. A new browser sweep could read the shell routes and iframe
  URLs but could not inspect every inner document due browser-control timeouts;
  package-manager verification also stalled after launch, so typecheck,
  tests, and build need to be rerun once the local process contention clears.
  No templates are marked ready or published; the batch migration remains
  unapplied, and rights/service publication gates remain open.
- 2026-10-20: Added an optional `voiceMessage` asset to the shared invitation
  contract and draft defaults, creator upload/toggle controls, Marxaba renderer
  binding, a separate accessible play/pause control in the platform bridge,
  and published-media authorization for invitations that reference the voice
  asset. It is independent from background music and does not autoplay. The
  preview-sample detector treats a voice-only draft as authored, and switching
  and JSON persistence tests cover its asset reference. Voice capture from the
  microphone, separate localized recordings, and browser save/reopen validation
  remain unverified; the initial implementation lets creators upload an
  existing MP3/WAV/M4A voice greeting. This is an implementation assumption for
  later user review.
- 2026-10-20: A fresh silent runtime sweep confirmed all ten iframe routes load
  the shared sample and keep catalog music paused at time zero. Locale changes
  showed the expected localized greeting in Oltin Nur, Bog‘i Eram, Atlas,
  Sahifa, and Uchar Gilam; browser control timeouts interrupted remaining
  locale checks, and Uchar Gilam was sampled before its typewriter greeting
  finished. Reproduced Oltin Uzuk's GSAP warnings for its empty dress-code
  palette and empty dynamic animation targets, then guarded those calls in the
  app copy. A fresh post-fix Oltin Uzuk preview had no console warnings/errors.
  Desktop/mobile comparison, opened-state motion, all interactions, voice
  playback, persistent-draft/service checks, and deliberate Uchar WebGL context
  loss regression remain open.
- 2026-10-20: Rechecked local configuration without printing values. The only
  environment file present is the tracked `.env.example`; no matching
  database, Telegram, R2, or AI environment variables are set in the process.
  Thus the shared API contract is implemented, but runtime save/reopen, media
  upload/public delivery, RSVP, and wishes cannot be validated against the app
  backend in this checkout. Migration `0005` remains an unapplied additive seed
  migration; no live database or external service was changed.
- 2026-10-20: Completed the direct voice-recording path for the shared
  invitation feature. Studio requests microphone access only after an explicit
  creator action, records in-browser, lets the creator stop the recording, and
  stops automatically after two minutes. Recordings over 15 MB or in an
  unsupported container are rejected. Added verified WebM container detection
  and its authenticated audio upload path; prerecorded MP3, WAV, and M4A remain
  supported, and music uploads remain separate. A storage test covers WebM
  signature detection. Typecheck and that targeted test pass. Runtime
  microphone/R2 upload and public playback remain unverified because this
  checkout has no backend configuration; the browser microphone was not
  activated during QA.
- 2026-10-20: Checked the local creator editor in a fresh browser draft. The
  voice toggle starts off, enabling it reveals both upload and microphone
  recording controls, and disabling it hides them again. No microphone
  permission was requested and no audio was uploaded. The editor's template
  selection step currently reports no selectable designs, matching the
  unpublished catalog gate; this prevents browser verification of template
  switching and saved-draft behavior until an authorized staging catalog is
  available. A fresh Bog'i Eram and Oltin Uzuk preview showed the shared
  Asadbek/Gulhayo data, all four locale controls, four program rows, and venue
  content in the actual iframe accessibility tree while the opening cover
  remained locked. The remaining templates still need stable per-route
  observations and complete below-fold/open-state review.
- 2026-10-20: Audited the ten production packages against the user-provided
  original ZIP: all 99 captured files are present in both the extracted
  reference tree and app package; the extracted reference bytes match all ZIP
  entry SHA-256 hashes; and all packaged image, SVG, and font assets match the
  original archive bytes. Restored eight SVG app copies whose only difference
  was CRLF versus LF at EOF. Added
  `docs/templates/MARXABA_BATCH_ADAPTATION_AUDIT.md`, which lists the
  intentional source-level file adaptations and their reasons. A follow-up
  inspection also found the Uchar Gilam texture builder dereferenced
  `renderer.capabilities` directly; the copied app source now safely defaults
  anisotropy to 1 if capabilities are unavailable. This fixes the null-object
  access path in code; a deliberate WebGL teardown/context-loss browser
  regression still needs a controllable test harness. Reference ZIP and
  extracted originals remain untouched. `node --check` passed for all 31
  packaged template JavaScript files and the shared platform bridge.
- 2026-10-20: Rechecked the shared preview/music path and voice implementation
  after the creator clarified that voice and the existing JSON/music support
  are part of this work. The canonical preview fixture still binds Asadbek and
  Gulhayo in all four locales; each full catalog preview receives the single
  catalog soundtrack while the invitation's stored music settings remain
  untouched. The catalog WAV, Oltin Nur preview art, and GSAP vendor script
  return HTTP 200. The fresh Oltin Nur screenshot shows its greeting, seal,
  corners, and original locked-cover composition; the earlier apparent missing
  greeting was a capture-timing artifact. The voice editor supports explicit
  microphone recording and MP3/WAV/M4A/WebM uploads, the typed invitation field
  persists the reference, and the shared guest control waits for an explicit
  play action after opening. Focused catalog/voice/storage tests pass (35/35),
  and typecheck passes. Voice upload/public delivery still cannot be exercised
  without configured database/R2 services; do not mark templates ready or
  publish until those service and remaining visual/interaction gates pass.
- 2026-10-20: Swept all ten full-preview iframe routes in the desktop browser.
  The rendered DOM showed Asadbek/Gulhayo and four program entries in every
  template, hid optional sections with empty sample data (including Muhabbat
  Kitobi's empty story), and bound the shared catalog WAV without starting
  playback. No warnings or errors were returned by the browser log check. This
  was a locked opening-state/data check only; opening sequences, voice playback,
  mobile behavior, and full public/service flows remain unverified. The initial
  longer locale-control sweep reached the browser tool's time limit; smaller
  sweeps subsequently confirmed all four locale controls for all ten template
  routes.
- 2026-10-20: Repeated the locked-preview audit at a 390x844 viewport for all
  ten templates. Every iframe and body stayed 390px wide without horizontal
  document overflow; each showed four sample program entries and the catalog
  track stayed paused. Uchar Gilam reported no `__threeError` during this
  mobile locked-state check. Compared the settled Oltin Nur source and app
  opening screenshots at the same mobile viewport; the cover composition,
  typography, greeting, seal, and corner ornaments match, with the app's
  platform navigation/language controls added. This does not cover below-fold
  mobile layout, long-name stress cases, opened animations, or voice/music
  playback controls.
- 2026-10-20: Re-ran repository verification after the browser audit: all 35
  tests passed, `pnpm typecheck` passed, and `pnpm build` completed successfully.
  `git diff --check` returned success; Git printed its expected core.autocrlf
  warnings for the eight restored SVG files whose archive-matching LF bytes
  should remain untouched. These checks do not replace the open interaction,
  backend, publication-rights, or publication-gate verification.
- 2026-10-20: Continued the voice and preview-music audit after the creator
  clarified both must be implemented through the shared preview JSON and
  existing music system. Confirmed the full-preview fixture supplies the one
  global licensed catalog WAV to each Marxaba renderer without saving it to
  the invitation, and that an authored invitation music setting takes
  precedence. The studio's optional voice control supports MP3/WAV/M4A/WebM
  upload and explicit microphone recording (two-minute/15 MB limits); voice is
  a separate typed asset reference, survives template switching/persistence
  tests, and is authorized for public delivery only when referenced by a
  published invitation. Added a post-open click fallback to the shared guest
  player so templates with delayed/missing `open` hooks expose the control
  after the opening action, while keeping playback explicit and silent on
  load. Corrected mojibake in the guest-player Uzbek Cyrillic and Russian
  accessible labels. `node --check`, `pnpm typecheck`, all 35 tests,
  `pnpm build`, and `git diff --check` passed after the correction. The silent
  preview remained on the locked Samarqand Kechasi cover; browser tool output
  exposed its accessibility tree but not an evaluable inner-frame DOM, so it
  does not independently verify the guest player.
  Actual recording/upload/public playback, saved-draft browser round trip,
  and opened-state verification remain pending because no DB/R2 service
  configuration is available and audible playback/microphone access were not
  activated during silent QA.
- 2026-10-20: Fetched `main` from the configured GitHub origin using the local
  credential manager, confirmed `c34c343` is the latest remote commit, and ran
  a fast-forward-only pull; the branch was already up to date (0 ahead, 0
  behind).
- 2026-10-20: Reopened the existing Samarqand Kechasi preview and read the
  actual iframe DOM through the browser's frame locator. It contains the
  centralized Asadbek/Gulhayo names, catalog WAV source, and a paused audio
  element while the invitation remains locked. No voice asset exists in the
  presentation-only sample, so the player is correctly absent from catalog
  preview; this does not validate authored voice playback. No opening control
  was clicked and no audio was played.
- 2026-10-20: Contract audit found the shared sample-fallback detector did not
  recognize dress-code-only content or several authored option settings. That
  could replace a creator's sole dress code, stored gift details, RSVP
  configuration, disabled wishes state, or audio metadata with catalog sample
  data in the studio/full-preview path. Expanded the detector and added focused
  regression cases for dress-code-only, RSVP-disabled-only, and gift-details-
  only drafts. Typecheck, all 35 tests, production build, and `git diff --check`
  passed. This protects creator data across the shared renderer used by all ten
  Marxaba templates; browser draft persistence still requires the unavailable
  backend services.
- 2026-10-20: Fixed blank editor and full-preview demos to retain the creator's
  selected default language and enabled-language set while still using the
  centralized Asadbek/Gulhayo sample copy. Catalog previews continue using the
  shared four-language fixture. Added regression coverage for Russian default
  with Russian/English enabled; typecheck, all 36 tests, production build, and
  `git diff --check` passed. This verifies the data path but not a browser
  saved-draft round trip, which remains dependent on unavailable backend
  services.
- 2026-10-20: Reconciled the template README with the newer authorization for
  the full ten-template Marxaba batch, while preserving the rule that each
  design remains unpublished until its individual gates pass. The public
  catalog currently exposes Anor only; the Marxaba batch remains unselectable
  pending QA and publication review. Re-ran typecheck, all 36 tests, production
  build, and `git diff --check`; all passed (with only the known Git line-ending
  warnings for archive-faithful SVGs).
- 2026-10-20: Added a preview-only `qaSilent=1` path that sets the shared
  Marxaba audio and voice elements muted before their real user-initiated open
  behavior. Public rendering does not receive this flag. Used it to trigger
  and visually inspect the opening sequence for all ten batch routes without
  audible playback; the settled pages exposed the expected centralized sample
  names and live controls, and no Uchar Gilam null-capabilities error appeared.
  This is an opening-state/motion check, not a full control, reduced-motion, or
  media playback check. At the browser's 319px-wide viewport, Oltin Uzuk split
  the sample names inside each word. Updated the shared fit bridge to measure
  each name unwrapped before shrinking; the rerender now keeps Asadbek and
  Gulhayo intact and uses separate lines at this narrow width. A horizontal
  scrollbar remained visible at 319px in Atlas, Oq Kabutar, Kuzgi Chinor, and
  Sahifa; the previous 390px overflow sweep was clean. GSAP warnings still
  lack browser-console evidence for per-template attribution because no
  browser-log/terminal session is attached to this task.
- 2026-10-20: Followed up the 319px horizontal-scroll finding by adding a
  narrow-viewport `overflow-x: clip` constraint in the platform bridge, below
  360px only. Reopened Atlas, Oq Kabutar, Kuzgi Chinor, and Sahifa at the same
  319px viewport; their horizontal scrollbars are no longer visible and their
  complete-width page content remains visible. This is a visual viewport
  check; direct scrollWidth measurement, nested gallery scrolling, and desktop
  behavior after the shared style change remain to be confirmed.
- 2026-10-20: Added a preview-only `qaLongNames=1` stress fixture that replaces
  names only for empty, ephemeral preview samples and never changes authored
  invitation content. At the 319px mobile viewport, Oltin Uzuk retained both
  long hyphenated names intact and legible across the cover. `pnpm typecheck`,
  all 37 tests, `pnpm build`, `node --check platform-bridge.js`, and
  `git diff --check` pass. Other templates still need the same stress pass;
  music and voice controls and public/service delivery remain unverified.
- 2026-10-20: Expanded `qaLongNames=1` mobile visual QA at 319px across the
  remaining batch. Samarqand Kechasi, Bog‘i Eram, Atlas, Uchar Gilam, Oq
  Kabutar, Kuzgi Chinor, Muhabbat Kitobi, and Sahifa all rendered the long
  names in the actual iframe; Oltin Nur and Oltin Uzuk were also inspected.
  Bog‘i Eram and Kuzgi Chinor wrap the stress names cleanly; Atlas, Uchar
  Gilam, and Samarqand Kechasi display them on multiple lines. Significant
  issues remain: Oltin Nur's opened script lockup extends beyond the right
  edge, Oq Kabutar's closed cover clips both sides, and Sahifa's decoded cover
  names collide at this width. Oltin Uzuk's cover passed the same stress case.
  The two tried global font-fit adjustments did not fix Oltin Nur and were
  reverted. These extreme fixtures are not creator content; each template
  still needs a realistic name check as well as the unresolved design-specific
  stress layout fixes, locale, motion, desktop, control, persistence, and
  backend checks before any publication decision.
- 2026-10-20: Addressed the three narrow-cover findings in the shared platform
  bridge, without editing reference template sources. Only at widths up to
  380px, name slots longer than 24 characters receive a compact wrapping
  treatment. Rechecked the actual covers at 319px with the silent stress
  fixture: Oltin Nur's opened names fit inside the frame, Oq Kabutar's cover
  names wrap within the page, and Sahifa's decoded cover names now have clear
  line breaks and no longer collide. This is specific visual evidence for
  these three covers; the complete ten-template interaction, opened-motion,
  desktop, language, persistence, and backend matrix is still outstanding.
  Re-ran `pnpm typecheck`, all 37 tests, `pnpm build`,
  `node --check platform-bridge.js`, and `git diff --check`; all passed.
- 2026-10-20: Tested Sahifa's live language switch in the actual iframe. Uzbek
  Cyrillic, English, and Russian each selected their corresponding `lang`
  route and rendered localized fixed copy and event content. Found the fixed
  text fragment `VAQT ·` left untranslated in English/Russian; added shared
  dictionary entries and confirmed the English output `TIME ·` and Russian
  output `ВРЕМЯ ·` in the rendered program section. The language audit also
  found an unresolved Sahifa hero date: the cover's date is 12, while the hero
  slot rendered `00` in all checked Latin/Russian locales; the next dated
  entry records the adapter correction. Remaining template locale variants
  still require verification.
- 2026-10-20: Reconciled Sahifa's hero day with the canonical day in
  `window.Marhamat.data.date` after the shared runtime initializes. The actual
  Uzbek Latin cover and hero both show 12, and the live English and Russian
  hero variants now show `12 June` and `12 июня`; previously both showed `00`.
  This adapter repair is restricted to Sahifa's `.hero__date` slot. The
  remaining locale audit across the other nine templates, long-name reveal,
  and other Sahifa interactions remains outstanding.
  After this repair, `pnpm typecheck`, all 37 tests, `pnpm build`, the platform
  bridge and shared i18n `node --check` commands, and `git diff --check` all
  pass; only the known archive line-ending warnings remain.
- 2026-10-20: Performed actual iframe language sweeps for all ten batch
  templates (Samarqand Kechasi, Oltin Nur, Bog‘i Eram,
  Atlas, Uchar Gilam, Oq Kabutar, Kuzgi Chinor, Muhabbat Kitobi, Sahifa, and
  Oltin Uzuk). Each exposes Uzbek Latin, Uzbek Cyrillic, English, and Russian;
  the sample names remain unchanged. The catalog preview still uses only the
  canonical presentation JSON and never persists its copy or default soundtrack
  as creator content. Voice remains absent from that fixture by design and is
  offered only for an authored invitation. Fixed copy in Samarqand Kechasi
  still needs a complete English/Russian localization audit. Repositioned the
  compact language control per source layout: default top-right for Oltin Nur,
  below the short cover greeting for Bog‘i Eram, and below the masthead for
  Sahifa. The selector overlaps only decorative art on Bog‘i Eram.
  `pnpm typecheck`, all 37 tests, `pnpm build`, both shared JavaScript
  `node --check` commands, and `git diff --check` pass; Git emitted only the
  already-known line-ending warnings for archive-faithful SVG/source files.
- 2026-10-20: Rechecked the creator's voice and default-music requirements.
  Verified the editor's upload/record controls, WebM container validation,
  invitation schema/storage, template-switch preservation test, platform voice
  bridge, and media route authorization for published references. Catalog music
  is supplied to all full catalog previews as a separate render-time fallback;
  authored music takes precedence, and neither track nor preview names are
  written into creator data. Silent browser QA confirms the WAV is present and
  paused until a user gesture. Voice playback with an authored asset and an
  authenticated save/reopen/public-media round trip remain unverified because
  database and R2 service access is not configured here; do not claim those
  service paths have passed. Re-ran typecheck, all 37 tests, production build,
  shared bridge/i18n JavaScript syntax checks, and `git diff --check`; all pass.
  The batch remains unpublished and is not production-ready: full per-template
  opened-state, controls, reduced-motion, missing-asset, and backend checks
  remain open, including the recorded Atlas marker/content-count review and
  Samarqand Kechasi localization audit.
- 2026-10-20: Investigated the reported name clipping in the Sahifa preview at
  mobile and desktop sizes. The source `.decode-name` spans use
  `overflow:hidden`, which clipped glyph animation paint below the fixed line
  box even though the couple names fit horizontally. The shared Marxaba bridge
  now overrides that clipping while retaining the source typography and glyph
  animation. Visually checked the cover and opened hero at 319 px and the
  locked cover at 1280 px; Asadbek and Gulhayo render in full. Scanned all ten
  templates' visible groom/bride text and primary lockup bounds; no additional
  clipped sample names were identified. The off-screen duplicate names in
  Sahifa/Samarqand marquees are intentional scrolling decoration. A full
  long-name, locale, and interaction regression pass remains outstanding; no
  template is promoted to production-ready by this targeted fix.
- 2026-10-20: Continued the batch audit in Samarqand Kechasi. A fresh full
  preview showed most fixed copy correctly localized, but the opening greeting
  remained Uzbek in English and Russian; added exact dictionary entries for
  “Samarqand oqshomiga xush kelibsiz” and verified the rendered English and
  Russian cover variants. The opening transition clears the root lock through
  template-owned code without consistently emitting the shared `open` event,
  so the bridge now observes that lock-state transition and exposes the shared
  language and voice controls. Verified the shared bridge script and locale
  control in the real iframe; page copy, four program entries, and silent
  playback behavior remain intact. Full mobile/interaction and backend checks
  are still outstanding.
- 2026-10-20: Audited the template publication gate without changing database
  state. The typed catalog definitions mark the Marxaba batch unpublished, the
  public catalog filters unpublished rows, and migration `0005` seeds all ten
  designs with `published=false` and assigns the wedding category. PostgreSQL
  is listening locally, but the application has no `DATABASE_URL` configured;
  no database rows were read and no migration was applied. Runtime catalog,
  save/reopen, and media checks therefore remain open.
- 2026-10-20: Continued silent RSVP and wishes quality checks. Actual DOM
  inspection across all ten preview iframes found the shared RSVP area, three
  choice controls, wishes form, locale controls, and catalog music source in
  each template. On Samarqand Kechasi, selected "no" to confirm the party
  count hides, then selected "yes" and verified the count changes 1 -> 3 -> 2
  using the plus/minus buttons and that only the selected choice is pressed.
  Audio remained muted in `qaSilent=1`. Did not submit RSVP or wishes: this is
  centralized sample content, and shared core explicitly blocks those writes
  when `data.preview` is true. No real invitation/backend configuration is
  available, so authored-invitation submission and persistence remain
  unverified; no template is promoted to production-ready.
- 2026-10-20: Revalidated the long-name stress-preview path. `qaLongNames=1`
  applies the long-name fixture in the live Oltin Nur iframe while preserving
  the canonical Asadbek/Gulhayo catalog fixture; the same option remains
  preview-only and bypasses saved drafts containing authored content. Added a
  regression test that names change without dropping localized copy, voice
  metadata, or Muhabbat Kitobi chapters, and that neither canonical nor other
  locale sample names are mutated. `pnpm test --
  --test-name-pattern="long-name QA preview"` passed all 38 workspace tests
  (including the 60-second local database integration test). Browser DOM text
  confirms both stress names reach the live hero and footer; this automation
  surface could not read nested iframe geometry for a fresh 319px/desktop
  measurement. Existing targeted bridge fixes remain; all-template visual
  clipping and responsive checks are still open, so publication readiness is
  unchanged.
- 2026-10-20: User asked for the current ready count. The roadmap's batch table
  still shows integrated/source-copied states rather than production-ready
  status, and publication gates remain open (backend save/reopen/media,
  rights, and significant per-template interaction/visual QA). Current
  production-ready count is 0/10; none has been marked ready or published.
- 2026-10-20: Began the user's requested one-template-at-a-time completion
  sequence with Oltin Nur; did not advance the active template milestone.
  Rechecked its real preview against the long-name fixture and found that
  locked/opened source states can reveal names only after the initial fit pass.
  The shared platform bridge now measures each visible name against its actual
  overflow-clipping ancestors, wraps only when the rendered text would cross
  the clipping edge, and schedules remeasurement during source opener state
  changes. In Chromium, opened Oltin Nur desktop names stayed within its
  480px page canvas; opened Oq Kabutar mobile hero names wrapped within the
  390px canvas. Sahifa at 319px remained within the cover bounds. The same
  check confirmed Oq Kabutar's locked cover remains within 319px. Comparison
  screenshots and the broader all-template sweep are still outstanding.
  Oltin Nur's shared renderer passes the same typed invitation payload and
  public API base used by Anor; its RSVP and wishes routes enforce the public
  invitation gate, same-origin POST, RSVP deadline/party-size validation, and
  pending wish moderation. Runtime save/reopen, upload/public media delivery,
  opened interaction/reduced-motion coverage, and asset-rights clearance are
  still publication blockers. No live service was configured or modified, no
  migration was applied, and Oltin Nur remains unpublished/not production-
  ready; continue this template before starting Samarqand Kechasi.
- 2026-10-20: While validating Oltin Nur's public wishes adapter, found that
  the shared Marxaba request mapper created the API's `message` field from the
  form's `text` value but serialized the original object instead. Fixed the
  serializer to send `message` and omit the client-only `text` field. A
  Chromium test with an isolated QA invitation intercepted the actual Oltin
  Nur wishes POST and verified the exact API body without saving it. A second
  intercepted submission verified RSVP route, `name`, `status`, and
  `partySize`; no service request reached a database. Oltin Nur is still in
  progress because real authenticated persistence/media, complete reduced-
  motion and interaction checks, and asset-rights clearance remain open.
- 2026-10-20: In Oltin Nur's reduced-motion browser check, fixed a mojibake
  Uzbek Cyrillic language label in the shared runtime. Reopened the live
  template in silent Chromium and switched the actual iframe through Uzbek
  Cyrillic, English, Russian, and Uzbek Latin; verified active locale and
  exact selector labels `Uz`, `Уз`, `En`, `Ru`. Four program rows render,
  empty dress code/gallery/gift/contacts stay hidden, catalog audio remains
  muted and paused, and no console/page errors were observed. The opener's
  reduced-motion path independently removed the initial lock and hid the
  cover; switching locales reloads the frame to its locked opening state as
  designed. Authored voice, full interaction, backend persistence/media and
  rights gates remain open.

- 2026-10-21: Reviewed the Marxaba batch against the integration requirements.
  The ten renderer/catalog entries and unpublished migration seed exist, and
  locale and locked-preview checks are documented for the batch. No design has
  a complete per-template record for opened interactions, reduced motion,
  preview artwork/desktop-mobile review, and renderer behavior; additional
  rights and runtime service gates also remain. Keep all ten unpublished and
  unselectable. Fixed the creator template step's unconditional �no ready
  designs� notice so it appears only when the catalog has no published design.
  No database migration or publication state was changed.
- 2026-10-21: The live Oq Kabutar preview exposed corrupted Uzbek Cyrillic
  transliteration and broken Russian month/weekday labels in shared Marxaba
  runtime data. Repaired Uzbek digraphs and Cyrillic-specific letters, replaced
  corrupted Russian calendar strings, and confirmed the live preview now shows
  `???`, `?????`, `????`, `??�??`, and `???????` correctly. Added runtime-data
  regression tests for Uzbek Cyrillic and Russian calendar labels. The locale
  correction applies to all ten renderers; it does not close their separate
  per-template interaction, visual, rights, or service gates.

- 2026-10-21: Continued the authorized Oltin Nur milestone. Compared its
  packaged template-level source against the read-only capture: all captured
  files are present, source art bytes match, and the production package adds
  local fonts, exact preview art, a shared runtime bridge, and documented
  integration-only changes. Fixed mojibake punctuation and fallback labels in
  the shared runtime, added regression coverage, and rechecked the live Oltin
  Nur preview in all four locales. The opening sequence, optional-section
  hiding, calendar text, and muted catalog audio work; no browser errors were
  observed. Oltin Nur remains unpublished: rights to redistribute the captured
  design are not documented, and authenticated database/object-storage
  services are not configured here for save/reopen and media verification.
  Continue Oltin Nur; do not advance to Samarqand Kechasi until its remaining
  release gates are closed.

- 2026-10-21: Local validation after the shared runtime text correction:
  syntax checks for the shared core/bridge and Oltin Nur scripts,
  `pnpm typecheck`, all 40 tests, and `git diff --check` passed.
  `pnpm build` compiled successfully but did not finish its TypeScript stage
  before it was stopped after a prolonged no-output interval; the production
  build is unverified.

- 2026-10-21: Continued the active Oltin Nur review in the live app preview.
  Opened the invitation, checked English copy and locale controls, toggled RSVP
  choices and guest count without submitting, and inspected the opened design at
  390x844. Names fit in the portrait hero and the source artwork/layout remain
  legible at this viewport. Reduced-motion, full control coverage, authored-data
  persistence/media delivery, and redistribution-rights evidence remain release
  gates; no template was published and no service records were created.
- 2026-10-21: Re-ran the production build while continuing Oltin Nur. Next.js
  compilation, TypeScript, page-data collection, and static generation all
  completed successfully (`pnpm build`, exit 0). This supersedes the earlier
  stalled-build note. The successful build does not verify runtime database or
  object-storage behavior, asset redistribution rights, or outstanding complete
  per-template interaction/visual checks; Oltin Nur remains unpublished.
- 2026-10-21: Continued Oltin Nur verification. In the live preview, checked
  English locale content, RSVP choice and guest-count state, and the music
  mute/play toggle. The reference capture contains no license, rights, or
  attribution document; this checkout has no app `.env.local`, database URL,
  R2 credentials, Docker/psql executable, or local PostgreSQL/object-storage
  listener. Customer save/reopen and media delivery cannot be verified without
  those external dependencies. Keep the template unpublished and active; do
  not advance to Samarqand Kechasi.