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
| 1 | Nikoh | Toscana | Published at 150,000 UZS through migration 0076_publish_toscana.sql; the configured database and live /api/catalog confirm wedding category and wedding/fotiha compatibility. Focused template/art/contract/music checks pass 9/9, registration/migration check passes 1/1, typecheck, production build, and authenticated four-locale save/publish/public-render/reopen integration pass. Browser review confirms the captured opening, all four locale switches, 390x844 viewport fit without horizontal overflow, localized six-entry program, gallery, Toyona disclosure, RSVP guest-count increment, live creator-name updates, and clean console. The source-art package preserves the opening image byte-for-byte; the unsupported venue.photo slot uses the approved map fallback when coordinates exist and hides its empty frame otherwise. Reduced-motion runtime emulation and external deployment remain unverified. |
| 2 | Nikoh | Vals | Published at 150,000 UZS through migration `0075_publish_vals.sql`; the configured database and live `/api/catalog` confirm wedding category and wedding/fotiha compatibility. Focused source/contract suite passes 6/6, Emotional Piano and registration checks pass, and web typecheck passes. Release browser QA covers all four locales, desktop/mobile, long names, opening/skip, reduced motion, sections, assets, and silent audio; authentic 720x1280 intro preview and checksum provenance are recorded. The authenticated four-locale save/publish/public-render/reopen integration passes specifically for Vals. The captured venue-photo and bank-name fields remain unsupported and empty. External deployment and live payment activation remain separate. |
| 3 | Nikoh | Muhr | Published at 150,000 UZS through additive migration `0077_publish_muhr.sql`; live `/api/catalog` confirms wedding category and wedding/fotiha/qiz-uzatish support. Exact captured body, CSS, scripts, metadata, localization, motion, fonts, and art checks pass. The portrait catalog image is byte-identical to the captured envelope. Four-locale fixture mapping, blank-draft isolation, creator fields, shared Emotional Piano, registration checks, and web typecheck pass. The source-only venue photo and To'yona bank/note fields remain empty because the shared contract has no fields for them. Browser QA was skipped under the user's release instruction while browser transport was unavailable. Authenticated catalog-wide four-locale save/publish/public-render/reopen integration passes 20/20, including Muhr. |
| 4 | Nikoh | Bulbul | Published at 150,000 UZS through additive migration `0083_publish_bulbul.sql`. The configured database and `/api/catalog` verify its production JPEG capture, wedding category, and wedding/fotiha/qiz-uzatish support. Fixture/image SHA-256 provenance is recorded; focused Marxaba checks, typecheck, and production build pass. Authenticated four-locale save/publish/public-render/reopen integration passes 1/1. The approved in-app browser verified the canonical fixture, 320px overflow-free mobile layout, centered desktop presentation, opening interaction, and reduced-motion rendering. The authorized Telegram notice was delivered after verification.
| 5 | Nikoh | Qandil | Published at 150,000 UZS after source, contract, preview-art provenance, four-locale, responsive, gallery, venue, RSVP, and catalog checks. Focused suite passes 11/11; full suite passes 388/388; typecheck and production build pass. Browser QA confirmed mobile/desktop opening, long-name fit, four locales, gallery wraparound, venue fallback, RSVP interaction, and clean logs. Reduced-motion browser emulation and authenticated save/reopen remain unverified; the source includes reduced-motion handling. Migration `0049_publish_qandil.sql` is applied and the live catalog API reports the published row. |
| 6 | Nikoh | Ko‘zgu | Published at 150,000 UZS after source, contract, exact metadata preview-art provenance, four-locale, responsive, gallery, venue, RSVP, and catalog checks. Focused suite passes 8/8; full suite passes 388/388; typecheck and production build pass. Browser QA confirmed mirror opening, all required sections, four locales, icon-only gallery and wraparound, three wishes, RSVP controls, long-name fit, hidden empty venue frame, and clean logs. Reduced-motion browser emulation and authenticated save/reopen remain unverified; source reduced-motion handling is present. Migration `0050_publish_kozgu.sql` is applied and the live catalog API reports the published row. |
| 7 | Nikoh | Parda | Published at 150,000 UZS through additive migration `0084_publish_parda.sql`. Configured PostgreSQL and `/api/catalog` confirm the production fixture capture, wedding category, and wedding/fotiha/qiz-uzatish support. Canonical fixture/image SHA-256 provenance is recorded. Focused Parda and shared Marxaba checks, typecheck, and production build pass; authenticated four-locale save/publish/public-render/reopen integration passes 1/1. The approved in-app browser verified the 390px mobile layout without horizontal overflow, Uzbek Cyrillic, and reduced-motion opening. The authorized Telegram notice was delivered after catalog verification.
| 8 | Nikoh | Doira | Published at 150,000 UZS through additive migration `0078_publish_doira.sql`; live catalog verification confirms wedding category and wedding/sunnat-toyi support. Full captured source and both artwork files pass parity checks; the 430×932 source-opening preview has checksum provenance. Focused suite passes 7/7; all source fonts, four-locale fixture mapping, blank-draft isolation, and shared Emotional Piano pass. Venue photo and To'yona bank/note are unsupported by the approved contract and stay empty. Browser QA was skipped under the user's release instruction while browser transport was unavailable. Authenticated Doira-specific four-locale save/publish/public-render/reopen integration passes 1/1. |
| 9 | Nikoh | Ganch | Published at 150,000 UZS through additive migration `0085_publish_ganch.sql`. Configured PostgreSQL and `/api/catalog` confirm the canonical production capture, wedding category, and wedding/fotiha/qiz-bazmi support. Fixture and image SHA-256 provenance is recorded. Focused Ganch and shared Marxaba checks, typecheck, and production build pass; configured four-locale save/publish/public-render/reopen integration passes 1/1. The approved in-app browser verified 390px fit, English locale, and reduced-motion opening. The authorized Telegram notice was delivered after verification.
| 10 | Nikoh | Qatlam | Published at 150,000 UZS through additive migration 0079_publish_qatlam.sql; the live catalog confirms wedding, qiz-bazmi, and fotiha compatibility. Captured body, CSS/JS/i18n/meta, and art parity pass; the 720x1280 fixture-based opening preview has provenance. Focused source/contract/music/registration/database checks pass 23/23, and typecheck passes. The source supports responsive and reduced-motion behavior; runtime browser emulation was unavailable. Venue photo and gift bank/note remain unsupported and empty. Browser QA was skipped under the user release instruction. Qatlam-specific authenticated four-locale save/publish/public-render/reopen integration passes 1/1.
| 11 | Nikoh | Anor | Integrated and published at 150,000 UZS. Latest static audit verifies four-locale fixture, six program entries, five-color dress data in the adapter, preview-only wishes, To‘yona/contacts, icon-only empty Lahzalar and sample isolation; scoped bridge CSS hides unsupported empty bank/note rows. Focused tests and typecheck pass. The captured Anor source has no clothing section, so this remains a source-fidelity exception to the preview clothing request; browser and live service checks were not repeated |
| 12 | Nikoh | Oltin Nur | Integrated and published; local catalog/API previously verified at 150,000 UZS; opening, four locales, RSVP controls, empty optionals, silent audio, and long-name layout checked. Latest audit verifies sample clothing, six-item program, wishes, To‘yona/contacts, icon-only empty gallery, and blank-draft isolation; scoped CSS hides unsupported empty To‘yona note/bank rows, with 20 focused tests and typecheck passing. The configured local database and catalog currently confirm Oltin Nur remains published. External deployment and cloud-service readiness remain unverified. External deployment and cloud-service readiness remain unverified |
| 13 | Nikoh | Samarqand Kechasi | Full source and shared renderer verified; published at 150,000 UZS after four-locale, opening, long-name, date/program, RSVP/wishes and optional-section checks; external deployment remains unverified |
| 14 | Nikoh | Bogi Eram | Full source integrated; published at 150,000 UZS after four-locale, gate, responsive preview, RSVP, empty-optional, and language-control checks. Latest static audit verifies shared four-locale clothing, six-item program, wishes, To‘yona, contacts, icon-only empty Lahzalar, and blank-draft sample isolation; scoped adapter hides unsupported empty gift rows and gallery fallback text. Focused contract/localization tests pass 6/6 and typecheck passes. External deployment remains unverified |
| 15 | Nikoh | Atlas | Full source integrated; published at 150,000 UZS after four-locale, responsive long-name, gate, RSVP, optional-section, and catalog checks. Latest static audit verifies the canonical four-locale six-item preview, wishes, To‘yona/contacts, icon-only empty Lahzalar, wrapping controls, and blank-draft isolation; scoped adapter hides unsupported empty gift rows. 17 focused tests and typecheck pass; browser and live service verification remain open |
| 16 | Nikoh | Uchar Gilam | Skipped by explicit user request; keep unpublished and unselectable |
| 17 | Nikoh | Oq Kabutar | Exact captured body, CSS and JavaScript retained; published at 150,000 UZS after four-locale opening, metadata, mobile, RSVP, optional-section and asset checks. Latest static audit verifies the captured opening/clothing, six-item program, preview wishes, To‘yona/contacts, empty gallery, and blank-draft isolation; scoped CSS hides unsupported empty bank/note rows. Focused Oq Kabutar tests pass 7/7 and typecheck passes; external deployment and cloud-media verification remain unverified |
| 18 | Nikoh | Kuzgi Chinor | Full reference source retained; published at 150,000 UZS after four-locale metadata, opening, mobile, RSVP, optional-section, reduced-motion guard and asset checks. Latest static audit verifies the shared four-locale six-item sample, wishes, gifts/contacts, icon-only empty Lahzalar and blank-draft isolation. A scoped adapter hides unsupported empty To‘yona bank/note rows; 15 focused tests and typecheck pass. Venue-photo remains an empty source-only hook; external deployment and cloud-media verification remain unverified |
| 19 | Nikoh | Muhabbat Kitobi | Full captured body, styles, motion, and assets retained; localized authored chapters use original page layout; published at 150,000 UZS by migration 0019. Latest audit verifies four-locale clothing, six-item program, wishes, To‘yona/contacts, icon-only empty Lahzalar, wrapping controls, and blank-draft sample isolation. Scoped adapter hides unsupported empty To‘yona note/bank rows; 15 focused tests and typecheck pass. Browser and live service gates could not be rechecked |
| 20 | Nikoh | Sahifa | Full captured source integrated; published at 150,000 UZS after four-locale sample/content checks, 390px responsive check, opening, optionals, localized metadata, and clean console. Latest contract audit confirms six-item program, wishes, dress guidance, To‘yona, contacts, icon-only empty Lahzalar, wrapping controls, and blank-draft sample isolation. A scoped adapter now hides unsupported empty To‘yona note/bank hooks; 5 focused tests and typecheck pass. External deployment and cloud-media verification remain unverified |
| 21 | Nikoh | Oltin Uzuk | Captured styles, ring animation and art integrated; published at 150,000 UZS after four-locale content/metadata, wishes, 390px responsive, opening, RSVP, hidden optional-section and clean console checks. Latest static audit verifies all four shared preview fixtures, six-item program, wishes, gift/contacts, icon-only empty Lahzalar, and sample isolation. Removed competing template-local gallery arrow handlers so shared modulo controls wrap correctly, and hid unsupported empty To‘yona bank/note slots with a scoped adapter; 15 combined tests and typecheck pass. Browser/service state was unavailable for recheck |
| 22 | Nikoh | Oynavand | Full source integrated; published at 150,000 UZS after four-locale, opening, six-item program, dress code, empty Lahzalar, To‘yona/contact sample, RSVP, and asset checks. Latest static audit confirms four-locale sample coverage, icon-only empty Lahzalar, wrapping gallery behavior, and blank-draft isolation; scoped adapter hides unsupported empty To‘yona note/bank fields. Focused suite passes, typecheck passes; browser/live DB and external service readiness remain unverified |
| 23 | Nikoh | Somon Yo‘li | Full source integrated; published at 150,000 UZS after four-locale, opening, program, gift/contact fixture, RSVP/wishes, and build checks. Latest static audit verifies six localized program entries, clothing, wishes, To‘yona/contacts, icon-only empty Lahzalar, and blank-draft isolation; scoped adapter hides unsupported gift rows. 18 focused tests and typecheck pass; browser and cloud-service checks remain unverified |
| 24 | Nikoh | Qog‘oz Turna | Full captured body, styles, and motion integrated; published at 150,000 UZS after four-locale, opening, six-item program, preview-art, gallery, To'yona/contact, and RSVP checks. Latest static audit adds four-locale sample coverage and hides unsupported empty bank/note rows with a scoped adapter; 16 focused tests and typecheck pass. Browser/mobile, reduced-motion, and save/service gates were not rechecked; venue.photo remains unsupported |
| 25 | Nikoh | Nilufar | Published at 150,000 UZS via migration `0052_publish_nilufar.sql`. Captured source/art provenance, four-locale fixture, sections, opening, and English switching verified; focused suite 8/8, typecheck and production build pass. At 390px, the viewport and document widths both measure 390px with no horizontal overflow. Public catalog API reports Nilufar published with `wedding`/`fotiha` compatibility. Authenticated four-locale save/publish/reopen integration passes across every published template (2/2 tests). Reduced-motion runtime emulation is unavailable in the browser; package guards and focused source assertions pass. External deployment and payment activation were not performed. |
| 26 | Nikoh | Suzani | Published at 150,000 UZS after source fidelity, desktop/mobile opening, four-locale content, focused suite (5/5), typecheck, and four-locale save/publish/public-render/reopen integration passed. Fixed source-art stacking in a scoped adapter. Browser reduced-motion emulation remains unavailable; source guards and assertions pass. |
| 27 | Nikoh | O‘rik Guli | Published at 150,000 UZS via migration `0054_publish_orik_guli.sql`. Source/adapter suite 5/5, typecheck and production build pass. Reference comparison, 390px mobile page with no overflow, long names, all four locales and full sections, opening/skip, gallery lightbox and wrap, To‘yona, guest count, and clean console verified. Exact 780×1170 first-view catalog art has SHA-256 provenance. Four-locale save/publish/public-render/reopen integration passes for every published template. Reduced-motion runtime emulation remains unavailable; captured JS handling, CSS adaptation, and source assertions pass. |
| 28 | Nikoh | Paxta | Published at 150,000 UZS via migration `0055_publish_paxta.sql`; database and `/api/catalog` confirm wedding category and wedding/fotiha support; portrait artwork returns HTTP 200. Focused suite passes 8/8, typecheck and production build pass. Browser desktop check confirms the full fixture and captured opening; gallery, To‘yona disclosure, and guest-count control were exercised. At 390px both page and invitation frame fit with no overflow. Isolated four-locale save/publish/public-render/reopen integration passes across every published template. Reduced-motion browser emulation is unavailable; source handling/assertions pass. Venue photo and gift note/bank-name slots lack contract fields and are hidden when empty. |
| 29 | Nikoh | Monogram | Published at 150,000 UZS via migration `0056_publish_monogram.sql`; DB and `/api/catalog` confirm wedding category and wedding/fotiha support, and portrait artwork returns HTTP 200. Captured body/CSS/JS/local fonts retain source parity with documented year, gallery label, and empty gift-slot adapters. Focused source/contract suite passes 9/9; typecheck and production build pass. Desktop source opening compared; runtime locale checks pass for all four locales. At 390px there is no horizontal overflow, including with long names. Gallery next/previous wrap and To‘yona disclosure work; browser logs are clean. The four-locale save/publish/public-render/reopen integration across all published templates passes. Reduced-motion browser emulation was unavailable; source guards/assertions pass. Venue photo and gift note/bank slots are unsupported and remain empty. |
| 30 | Nikoh | Retro Kino | Published at 150,000 UZS via migration `0057_publish_retro_kino.sql`; DB and `/api/catalog` confirm wedding category and wedding-only support, and poster art returns HTTP 200. Captured layout, styling, motion and local fonts pass parity tests; focused source/contract suite passes 11/11, typecheck and production build pass. Source opening compared; runtime Uzbek Latin, Uzbek Cyrillic, English, and Russian checks pass, including localized Cyrillic headline correction. At 390px page and frame fit without overflow, including long names. Open curtain, gallery movement and wrap, empty-photo lightbox fallback, To‘yona disclosure, and RSVP count work; browser logs are clean. Four-locale save/publish/public-render/reopen integration across every published template passes. Reduced-motion runtime is unavailable; captured JS and CSS provide reduced-motion handling. Venue photo and gift note/bank fields remain unsupported. |
| 31 | Nikoh | Sahro Fonusi | Published at 150,000 UZS via migration `0058_publish_sahro_fonusi.sql`; DB and `/api/catalog` confirm wedding category and wedding/fotiha support; portrait preview returns HTTP 200. Focused suite passes 8/8, typecheck and production build pass. Compared the captured source panorama opening with the app; runtime locale checks pass in all four locales. At 390px there is no overflow, including the long-name fixture. Opening animation, gallery carousel and lightbox fallback, To‘yona disclosure, and RSVP guest count work; console is clean. Four-locale save/publish/public-render/reopen integration across all published templates passes. Reduced-motion runtime emulation is unavailable; source JS/CSS guards pass. Venue photos and gift note/bank slots are unsupported and stay empty. |
| 32 | Qiz uzatish | Lola | Published at 150,000 UZS through migration `0059_publish_lola.sql`; DB and `/api/catalog` confirm `qiz-bazmi` category with `qiz-uzatish`/`fotiha` compatibility; portrait opener returns HTTP 200. Focused source/contract suite passes 8/8; typecheck, production build, and four-locale save/publish/public-render/reopen integration pass. Opened invitation, gallery selection, To‘yona chest, and locale controls work; Uzbek Latin/Cyrillic, English, and Russian copy verified. At 390px with long names, page and iframe widths stay at 390px with no horizontal overflow; browser warnings/errors are clean after a documented footer GSAP target repair. Reduced-motion browser emulation unavailable; source/CSS handling remains. Unsupported venue-photo and gift note/bank slots stay empty. |
| 33 | Qiz uzatish | Qiz Bazmi | Published at 150,000 UZS through migration `0060_publish_qiz_bazmi.sql`; DB and `/api/catalog` confirm `qiz-bazmi` category and qiz-uzatish/fotiha/birthday compatibility; 450×800 portrait opening returns HTTP 200. Captured source package, catalog art provenance, central four-locale sample mapping, unsupported venue-photo/gift-note handling, and blank-draft isolation pass focused coverage (24/24 with catalog and queued integration tests); typecheck passes. Browser verifies the intro against the capture, four locales, 390px long-name fit with no overflow, gallery dot/arrow wrap, To‘yona disclosure, RSVP guest count, and clean warning/error logs. Four-locale save/publish/public-render/reopen integration passes for all published templates. Reduced-motion browser emulation unavailable; source JS/CSS guards are present. |
| 34 | Sunnat to‘yi | Shahzoda | Published at 150,000 UZS via migration `0062_publish_shahzoda.sql`; DB and `/api/catalog` confirm category `other`, Sunnat-only compatibility, and HTTP 200 portrait art. Full captured body, CSS, JS, metadata and art parity pass; focused template/queued/database checks pass 23/23 after refreshing stale publication expectations, web typecheck and production build pass. Browser checks cover opening and four locales; at 390px, long names now wrap inside both plaque and hero with no document overflow. Opening, gift disclosure, gallery wrap and RSVP count work. Four-locale save/publish/public-render/reopen integration across all published templates passes. Reduced-motion runtime emulation unavailable; captured script/CSS paths are retained. Venue photo and gift bank/note fields remain unsupported and empty. |
| 35 | Sunnat to'yi | Chavandoz | Published at 150,000 UZS through migration `0063_publish_chavandoz.sql`; DB and `/api/catalog` confirm category `other`, Sunnat/birthday compatibility, and HTTP 200 portrait art. Captured package and typed contract map the first authored person, host, locale-specific copy/date, program, venue/map, dress colors, gallery, RSVP, wishes, gift details, contacts, and music; unsupported venue photo and gift bank/note remain empty. Focused source/catalog/database checks, typecheck, and production build pass. Compared capture and app opening; verified all four locales, the long-name intro banner and hero at 390×844, six-card gallery wrap, To‘yona disclosure, and RSVP guest count; console is clean. Four-locale save/publish/public-render/reopen integration across published templates passes. Reduced-motion browser emulation is unavailable; captured CSS/JS and shared core support it. |
| 36 | Beshik toyi | Beshik | Published at 150,000 UZS through additive migration `0064_publish_beshik.sql`; DB and `/api/catalog` confirm category `other`, beshik-toyi/birthday compatibility, and HTTP 200 720×1280 portrait opener. Captured body, CSS, scripts, art, and bundled fonts pass source parity. A scoped adapter wraps long names in the animated opening and hero without changing normal-name typography. Focused source/catalog/database tests, typecheck, and production build pass. Reference and app checked at desktop and 390×844; all four locales, opening animation, six-card gallery wrap, To‘yona disclosure, RSVP count, and clean console verified. Four-locale save/publish/public-render/reopen integration across the published catalog passes. Reduced-motion browser emulation unavailable; captured source paths support it. Venue photo and gift bank/note remain unsupported and empty. |
| 37 | Nikoh | Konfetti | Published at 150,000 UZS through additive migration `0065_publish_konfetti.sql`; DB and `/api/catalog` confirm birthday category, birthday/jubilee compatibility, and HTTP 200 authentic 450×800 portrait opener. Captured body, CSS, translations, metadata and artwork match; only documented GSAP empty-slot guards and app-shell adaptation differ. Source parity, four-locale sample coverage, typecheck, build, full tests, and save/publish/public-render/reopen integration pass. Browser review checks candle opening, all four locales, long name, gallery movement, guest count, and clean console. Narrow viewport override did not take effect in the browser tool; responsive CSS/name-fit path is present, but runtime mobile retest remains unverified. Reduced-motion browser emulation remains unavailable; source JS/CSS support it. Age, venue photo, gift bank/note are unsupported and remain empty. |
| 38 | Tug'ilgan kun va yubiley | Shirin Bayram | Published at 150,000 UZS through additive migrations `0067_publish_shirin_bayram.sql` and `0068_shirin_bayram_birthday_only.sql`; DB and `/api/catalog` confirm birthday category and birthday-only compatibility, with HTTP 200 checksum-backed 720×1280 opening art. Captured body, styles, translations, metadata, animation, and art pass source parity. Fixed the captured `overflow-wrap:anywhere` name splitting with a scoped fit adapter; corrected the preview-only Russian greeting. Focused package, fixture, catalog, typecheck/build, full suite, and catalog-wide save/publish/public-render/reopen integration pass. Browser review covers opening, all four locales, long names, gallery wrap, gift disclosure, RSVP counter, and clean console. Narrow viewport override did not take effect; mobile runtime review remains unverified. Reduced-motion runtime emulation is unavailable; captured source paths support it. Celebrant age and gift bank/note remain unsupported and empty. |
| 39 | Tug'ilgan kun va yubiley | Oltin Yosh | Published at 150,000 UZS through additive migration `0069_publish_oltin_yosh.sql`; DB and `/api/catalog` confirm birthday category, birthday/yubiley support, and HTTP 200 portrait art. Captured body, CSS, metadata, artwork, and fonts are packaged; the scoped name-fit adapter keeps the long-name opening action visible, and empty age/gift bank/note slots stay hidden. Focused package, database/catalog, full suite, typecheck, production build, and catalog-wide four-locale save/publish/public-render/reopen integration pass. Browser review checks all four locales, long-name opening, opening action, gallery movement, gift disclosure, RSVP controls, and clean console. Narrow viewport override did not take effect; mobile runtime review remains unverified. Reduced-motion runtime emulation is unavailable; captured CSS/JS support it. Age, venue photo, and gift bank/note remain unsupported and empty. |
| 40 | Tug'ilgan kun va yubiley | Oltin Kuz | Published at 150,000 UZS through additive migration `0066_publish_oltin_kuz.sql`; DB and `/api/catalog` confirm birthday category and birthday/jubiley compatibility, with HTTP 200 authentic 480×854 opening preview. Captured body, CSS, metadata, art, and fonts match; documented app-only script guard preserves the opening letter reveal and removes empty-target GSAP warnings. Scoped styling keeps long names legible at word/hyphen breaks. Focused package, source, locale, and blank-draft tests, typecheck/build, full suite, and save/publish/public-render/reopen integration pass. Desktop browser checks cover opening animation, all four locales, long names, gallery wrap, gift disclosure, RSVP counter, and clean console. Narrow viewport override did not take effect; responsive runtime check remains unverified, while source breakpoints and adapter are present. Reduced-motion browser emulation is unavailable; source CSS/JS support it. Age, venue photo, gallery year, and gift bank/note remain unsupported and empty. |
| 41 | Osh va iftorlik | Nahor | Published at 150,000 UZS through additive migration `0070_publish_nahor.sql`; DB and `/api/catalog` confirm the `osh` category, `osh` support, and HTTP 200 portrait opening art. The captured source body, CSS, JS, art, and local fonts remain packaged, with fixture-derived preview provenance and scoped empty gift bank/note adaptation. Four-locale fixture mapping and blank-draft tests pass; full suite, typecheck, production build, and catalog-wide four-locale save/publish/public-render/reopen integration pass. Browser review compared the source and app qozon opening, then checked the lid reveal, all four locales, gallery movement/empty-photo lightbox, gift disclosure, RSVP count/choice, and clean console output. Narrow viewport and reduced-motion runtime emulation remain unavailable; captured responsive and reduced-motion paths are in place. Venue photo, gift bank name, and gift note remain unsupported and empty. |
| 42 | Osh va iftorlik | Nahorgi Osh | Published at 150,000 UZS through additive migration `0071_publish_nahorgi_osh.sql`; DB and `/api/catalog` confirm category `osh`, Osh/Sunnat/Nikoh support, and HTTP 200 source portrait art. Captured body, styling, motion, translations, metadata, and artwork remain preserved with local runtime/fonts; typed adapter maps the shared fixture and blank drafts. Focused and full suites, typecheck, build, and catalog-wide four-locale save/publish/public-render/reopen integration pass. Desktop browser review compares reference/app opening and checks qozon reveal, all locales, gallery movement/lightbox, gift disclosure, RSVP controls, and clean console. Narrow viewport/reduced-motion runtime emulation remains unavailable; source responsive/motion paths are in place. Venue photo and empty gift bank/note/cardholder slots stay unsupported and empty. |
| 43 | Osh va iftorlik | Hilol | Published at 150,000 UZS through additive migration `0072_publish_hilol.sql`; DB and `/api/catalog` confirm the iftorlik category, iftorlik/osh support, and HTTP 200 portrait preview. Captured source body, CSS, art, animation and fonts are preserved with scoped Three.js scale/timezone adapters and wrapped gallery navigation. Focused tests, full suite, typecheck, production build, and catalog-wide four-locale save/publish/public-render/reopen integration pass. Desktop browser comparison verifies the opening artwork, all locales, animation path, gallery movement/lightbox fallback, RSVP count/choice, To‘yona disclosure and clean console. Narrow viewport and reduced-motion browser emulation were unavailable; captured responsive/motion paths remain. Unsupported gift bank/note fields stay empty. |
| 44 | Boshqa tadbirlar | Bitiruv | Published at 150,000 UZS through additive migration `0073_publish_bitiruv.sql`; configured database confirms `published=true`, category `other`, and birthday/bitiruv/korporativ support. Captured body, CSS, localization, metadata, artwork, and animation source parity pass (normalized for Windows checkout line endings); the local Three.js path and safe resize-after-WebGL-fallback guard are the only script adaptations. Focused tests pass 10/10, including a reduced-motion VM check; production build and authenticated four-locale save/publish/public-render/reopen integration pass. Browser review verifies opening, mobile layout, all four locales, gallery lightbox, RSVP choice, gift details, and clean console. Shared default Emotional Piano audio is present. Full unit suite still has unrelated missing-source ENOENT failures for several captures after force-pull. |
| 45 | Boshqa tadbirlar | Korporativ | Published at 150,000 UZS through migration `0074_publish_korporativ.sql`; the configured database and live `/api/catalog` confirm `published=true`, category `other`, and `korporativ`/`bitiruv`/`yubiley` support. The user explicitly waived browser-rendered desktop/mobile, locale-switching, reduced-motion, interaction, and console QA. Full captured source is packaged and statically compared; single-honoree mapping and localized four-locale fixture are covered. The official metadata-declared 720×1280 preview asset is packaged unchanged with SHA-256 provenance; fixture content matches the art. Focused tests pass 9/9, including source parity, adapter fields, assets, translations, motion, and Emotional Piano default. Production build passes. The authenticated PostgreSQL + app integration passes for Korporativ as part of the four-locale save/publish/public-render/reopen test across every published template. No external deployment or live payment activation. |
| 46 | Boshqa tadbirlar | Yangi Uy | Published at 150,000 UZS through additive migration `0086_publish_yangi_uy.sql`. Configured PostgreSQL and `/api/catalog` confirm the canonical production capture, housewarming category, and yangi-uy/osh event support. Fixture and image SHA-256 provenance is recorded. Focused Yangi Uy and shared Marxaba checks, typecheck, and production build pass; configured four-locale save/publish/public-render/reopen integration passes 1/1. The approved in-app browser verified 390px fit, English locale, and reduced-motion opening. The authorized Telegram notice was delivered after verification. Unsupported gift bank/note fields remain empty.

## Next-ten batch

| Order | Template | Renderer / source audit | Contract adapter | Catalog + DB | Verification / blockers |
|---:|---|---|---|---|---|
| 1 | Oltin Nur | Full captured source + local fonts/art copied | Shared contract mapped; optional dress code supported | Migration 0005 applied to Neon; Oltin Nur published in catalog with wedding category and existing price | Local 3001 catalog/API show the published template. Desktop/mobile, four locales, RSVP state, hidden empty optionals, silent audio, and long-name checks; 41 tests, typecheck, and build pass. Telegram bot token verified; local auth configuration returns 200. External Vercel deployment is unverified; public bot webhook, R2 credentials, end-to-end cloud media/save, receipt processing, live reduced-motion and complete reference/control comparison remain outstanding. Catalog publication does not assert production service readiness.
| 2 | Samarqand Kechasi | Full source copied; three missing reference assets recovered | Shared adapter connected; opening-cover and static page copy localized; shared language controls retained | Catalog IDs, exact preview art, publication migration 0014; wedding event support and category retained | Local responsive preview verified: opening sequence, four locales, all sample content, four program entries, dates/calendar/countdown, empty optional sections, RSVP/wishes controls, and long names. Added static-copy localization regression test. Published in catalog at 150,000 UZS; external deployment and cloud-service readiness remain unverified |
| 3 | Bogi Eram | Full source, local fonts/art and missing motion sprites packaged; exact portrait preview artwork wired | Shared adapter connected; four locale metadata localized; language picker returns to top-right after gate opens | Catalog IDs, exact preview art, additive publication migration 0015; wedding event support/category retained | Gate intro and opening sequence visually compared with source; all four locales verified including corrected Cyrillic Gulhayo form; empty dress-code/gallery/gift/contact sections hidden; RSVP choice and guest count verified; picker position checked before/after opening and while scrolled. Project tests, typecheck, build and diff checks pass. Published at 150,000 UZS; external deployment and cloud-service readiness remain unverified |
| 4 | Atlas | Full source and local fonts/art retained; source intro and transition compared | Shared contract connected; localized document/share metadata; long-name fitting preserves word breaks | Catalog IDs, exact preview art, additive publication migration 0016; wedding event support/category retained | Four locales and metadata verified; opening and RSVP controls checked; empty dress-code/gallery/gift/contact sections hidden; long names fit cover and hero; no console errors. 58 tests, typecheck, production build, and diff checks pass. Published at 150,000 UZS; external deployment and cloud-service readiness remain unverified |
| 5 | Uchar Gilam | Full source copied; three missing reference assets recovered; app copy guards the async texture callback against teardown/context loss and safely defaults anisotropy when renderer capabilities are null | Shared adapter connected; fixed-copy translations cover all static HTML text, accessibility labels, and metadata values for Russian and English; Uzbek Cyrillic uses the shared transliterator | Catalog IDs, exact preview art, unpublished DB seed migration added | Prior desktop locked-preview evidence covers sample names, four program entries, empty optionals, paused catalog music, and all four locale switches. Added regression tests for static copy/metadata localization, portrait and scene assets, and late texture teardown. Full suite (62), typecheck, and production build pass. Current browser session URL policy denied preview access; opening flow, complete controls, mobile, reduced-motion, and remaining visual checks cannot be verified in this turn. Keep unpublished |
| 6 | Oq Kabutar | Full source and local fonts/art copied; HTML body, CSS, and JavaScript match the captured source after line-ending normalization | Shared adapter connected; added missing Russian and English document metadata translations | Catalog IDs, exact preview art, unpublished seed migration plus publication migration 0017; wedding event support/category retained | Source fidelity checked; opening transition and all four locales verified; Russian title/description now localize; mobile checked at 390px with no horizontal overflow; RSVP choice and guest counter respond; empty gallery, optional gift, and contacts stay hidden; no browser console warnings/errors. All 65 tests, typecheck, build, and diff checks pass. Published at 150,000 UZS; external deployment and cloud-media/save service verification remain unverified |
| 7 | Kuzgi Chinor | Full reference body and JavaScript retained; CSS differs only by replacing the captured external font import with locally bundled font files | Shared renderer connected; fixed Uzbek, Uzbek Cyrillic, English, and Russian page title/description translations | Catalog IDs and wedding category/event support retained; seed migration plus publication migration 0018 | All locales, including Uzbek Cyrillic metadata, verified in browser; opening transition checked; mobile at 390px has no horizontal overflow; RSVP no/yes and party count respond; empty gallery/toyona/contact sections hide; browser logs clean. Tests, typecheck, build, and diff checks pass; published at 150,000 UZS. External deployment and cloud-media/save verification remain unverified |
| 8 | Muhabbat Kitobi | Captured body, CSS, motion, and assets retained; app adapter uses authored repeatable chapters | Localized chapter fields use the shared contract and renderer; generated chapter labels translate in all four locales | Catalog IDs, exact preview art, seed migration plus publication migration 0019; wedding category/event support retained | Opened preview and checked mobile 390px with no overflow; all four locales, RSVP choice and guest count work; empty optionals hide and browser logs are clean. Source fidelity, 69 tests, typecheck, production build, and diff checks pass. Published at 150,000 UZS; external deployment and cloud-media/save verification remain unverified |
| 9 | Sahifa | Full source and local fonts/art copied; hardcoded sample names/location removed | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Desktop locked preview checked: Asadbek/Gulhayo, four program entries, empty optional sections hidden, catalog music bound and paused; all four locale controls switch and update the rendered locale. No browser warnings/errors observed. Opening, interactions, mobile and publication gates pending |
| 10 | Oltin Uzuk | Full source and local fonts/art copied; sample engraving names/date removed; empty GSAP animation targets guarded in the app copy | Shared adapter connected | Catalog IDs, exact preview art, unpublished DB seed migration added | Desktop locked preview checked: Asadbek/Gulhayo, four program entries, empty optional sections hidden, catalog music bound and paused; all four locale controls switch and update the rendered locale. No browser warnings/errors observed. Opening, interactions, mobile and publication gates pending |

## Progress log
- 2026-10-22: Resumed the active next design, Nilufar, per the user's request to
  make the next design publishable and then publish it. Confirmed its exact
  source package, 1080×1920 opening artwork, full preview sections, opening
  interaction, and English locale switch in the local browser. Nilufar-focused
  tests pass 8/8; typecheck and production build pass. Read-only inspection of
  the configured database confirms its row is still unpublished at 150,000 UZS
  and supports both `wedding` and `fotiha`; migrations through `0051` are
  applied. Publication is not ready: runtime reduced-motion and 390px checks
  were unavailable, the browser has no signed-in account for authenticated
  save/reopen, and the public service flow could not be exercised. The Next.js
  development server also logged a root-layout hydration warning after the
  Telegram Web App script added viewport CSS properties before hydration; this
  is outside Nilufar's isolated renderer and should be rechecked in a normal
  production browser. No publication migration was applied.
- 2026-10-21: Published Qandil and Ko‘zgu after template-focused review. Applied only migrations `0049_publish_qandil.sql` and `0050_publish_kozgu.sql` to the configured Neon catalog; its public catalog API now returns both at 150,000 UZS, with wedding category and their declared event compatibility. Qandil commit: `239435f`; Ko‘zgu commit: `b8c9ee6`. Full tests pass 388/388; web typecheck and production build pass. External app deployment, browser reduced-motion emulation, and authenticated save/reopen were not verified.
- 2026-10-21: Independently checked Parda in the live local preview after its package audit: fixture names, date, six-item program and gallery bind correctly; opening completes, Russian content switches, and browser logs are clean. Root reran the full suite (243/243) and typecheck successfully. Static audit added explicit preview-art provenance blocker and blank unsupported Toyona-field regression coverage; focused Parda tests pass (5/5). The source capture omits its metadata-declared preview.webp, so keep the existing catalog image unchanged and Parda unpublished until its provenance is verified or replaced with an authenticated opening capture. Mobile, all-locale browser, reduced-motion runtime, and service gates remain.
- 2026-10-21: Root independently verified Vals source fidelity, preview provenance, contract hooks, localized copy, focused tests (5/5), and web typecheck. The worker browser report covers four locales, opening/skip, reduced motion, desktop/mobile, sections, and clean Vals-frame logs. Vals remains unpublished pending project-level service and database release gates; no migration or external database was applied.
- 2026-10-21: Vals preview-fixture checksum is now normalized to LF before hashing, so its provenance test is stable across Windows and Unix checkouts. Independent focused source and integration tests pass (6/6). The captured venue-photo and bank-name fields remain unsupported by the approved shared contract and intentionally receive no sample values. Browser/service publication gates remain open.
- 2026-10-21: Toscana browser review traced three GSAP warnings to the captured title tween receiving no word spans after the shared data bridge refreshed live text. Updated only the app copy to restore the source title wrappers before the scroll animation; documented the adaptation and regression test. The opening and Uzbek Cyrillic, English, Russian locale changes plus RSVP choice/party-size controls now run without browser warnings/errors; focused tests (3/3), typecheck, syntax and scoped diff checks pass. Mobile, reduced-motion and service-release verification remain; Toscana stays unpublished.
- 2026-10-21: Independent Shirin Bayram audit confirmed the source metadata
  supports birthday only; yubiley is intentionally excluded from the
  registry and seed. Expanded regression coverage for exact compatibility,
  four-locale sample fields, and fixed visible/accessibility copy. Focused
  source tests pass (8/8); verified portrait opening and checksum provenance.
  Mobile, remaining locale browser checks, reduced motion, and services remain.
- 2026-10-21: Reviewed and integrated the Shirin Bayram source package. The
  captured body, styles, localization copy, cake artwork, fonts, and animation
  dependencies are retained in an isolated package; the typed catalog and
  additive database seed register the birthday design as unpublished. Added a
  localized birthday sample in the shared JSON fixture so its greeting,
  program, venue, and child-friendly dress palette do not inherit wedding
  copy. Focused source, preview-fixture, integration, and Beshik tests pass
  (21); typecheck passes. The Uzbek desktop preview renders all source sections
  and fixture content. Other locales, mobile, reduced-motion, and full
  interaction verification remain before publication.
- 2026-10-21: Qogoz Turna is integrated with its captured invitation body,
  original styles and interactions, local fonts, shared renderer, and local
  runtime. Packaged the source metadata's exact 720x1280 portrait preview
  art. Browser review verified Uzbek Latin, Uzbek Cyrillic, English, and
  Russian, the opening, all six localized program rows, five dress-code
  colors, the captured empty gallery layout, shared wishes and gift/contact
  fixture, and RSVP controls. Migrations 0026 and 0027 were applied; it is
  published at 150,000 UZS. Focused tests, typecheck, and build pass. The
  full suite still has the unrelated Paxta preview.webp failure. External
  deployment and cloud-service readiness remain unverified; continue with
  Nilufar.
- 2026-10-21: Somon Yo'li is integrated through the shared typed renderer,
  retaining its captured body, styles, star-map artwork, opening animation,
  local fonts, and packaged Three.js runtime. Local preview review verified
  Uzbek Cyrillic and English copy, six localized program rows, dress code,
  the captured empty Lahzalar gallery, preview-only gift details, contact
  links, RSVP controls, and three shared sample wishes. Fixed locale-specific
  program data in the shared runtime and added regression coverage. Migrations
  0024 and 0025 were applied; Somon Yo'li is published at 150,000 UZS and
  appears in /api/catalog. Typecheck, build, and focused tests pass. The full
  suite has one unrelated Paxta missing-preview.webp failure. External deploy
  and cloud-service readiness remain unverified. Continue with Qogoz Turna.
- 2026-10-21: Oynavand is integrated through the shared typed renderer with its
  captured page, styles, animation, local fonts, poster art, and shared nikoh
  runtime. The source's own Lahzalar section remains visible in the empty
  preview; no replacement gallery cards were added. Browser review verified
  Uzbek Latin, Uzbek Cyrillic, English, and Russian, the opening, all six
  localized program rows, five dress-code colors, three shared sample wishes,
  preview-only To’yona details, phone/Telegram contacts, and RSVP attendance and
  party-size controls. Added portrait `preview.webp` from the packaged captured
  opening artwork. Focused tests, typecheck, production build, and diff checks
  pass; the repository-wide suite has one unrelated existing failure because
  Paxta's `preview.webp` is missing. Migrations `0022` and `0023` published
  Oynavand at 150,000 UZS in the catalog. External website deployment and
  cloud-service readiness remain unverified. Continue with Somon Yo’li.


- 2026-10-21: Continued Uchar Gilam after Atlas. Added regression coverage for
  every static HTML label, accessibility attribute, and metadata string, and
  localized the initial title, description, and Bukhara venue-image alt text.
  Added checks for the exact portrait/scene assets and the late WebGL texture
  teardown guards. All 62 tests, typecheck, and production build pass. The
  current browser URL policy denied access to the local preview, so opening,
  full controls, mobile and reduced-motion visual verification remain open;
  no publication migration was applied and Uchar Gilam remains unpublished.
  The source-to-contract audit also found a missing localized platform footer
  value and an empty bank-name slot that contradicted the current contract. Added
  a locale-specific footer to the shared adapter, removed the unsupported bank
  slot, and hid the unsupported empty gift-note paragraph. A normalized
  source/package audit confirms all 11 captured files are present: seven are
  content-identical and four have documented integration changes.
  A scan also found a missing `og.jpg` target; Open Graph now uses the actual
  `preview.webp`. Tests verify local HTML/CSS/font references resolve, Google
  Fonts are not fetched remotely, and the generated map title is translated.

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
  its source site. It is not packaged into the product because it is remotely
  streamed rather than a local asset. Creator music selection now includes reusable tracks the
  authenticated creator uploaded previously; public delivery resolves an
  owned track when any of that creator's published invitations references it.
  Studio and local start scripts now use port 3001. Browser review caught and
  fixed Sahifa's static "14 Noyabr" date; its date spread now uses the shared
  invitation day and month fields. Typecheck, all 33 repository tests, and an
  isolated production build passed. The batch remains unpublished pending
  per-template visual/interaction review and the noted story, receipt, audio
  and database-configuration gaps.
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
  unapplied, and service publication gates remain open.
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
  backend or publication-gate verification.
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
  and significant per-template interaction/visual QA). Current
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
  opened interaction/reduced-motion coverage, remain publication blockers. No live service was configured or modified, no
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
  motion and interaction checks, remain open.
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
  service gates remain open.

- 2026-10-21: Reviewed the Marxaba batch against the integration requirements.
  The ten renderer/catalog entries and unpublished migration seed exist, and
  locale and locked-preview checks are documented for the batch. No design has
  a complete per-template record for opened interactions, reduced motion,
  preview artwork/desktop-mobile review, and renderer behavior; additional
  runtime service gates also remain. Keep all ten unpublished and
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
  per-template interaction, visual, or service gates.

- 2026-10-21: Continued the authorized Oltin Nur milestone. Compared its
  packaged template-level source against the read-only capture: all captured
  files are present, source art bytes match, and the production package adds
  local fonts, exact preview art, a shared runtime bridge, and documented
  integration-only changes. Fixed mojibake punctuation and fallback labels in
  the shared runtime, added regression coverage, and rechecked the live Oltin
  Nur preview in all four locales. The opening sequence, optional-section
  hiding, calendar text, and muted catalog audio work; no browser errors were
  observed. Oltin Nur remains unpublished: authenticated database/object-storage
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
  persistence/media delivery, and service/quality checks remain release
  gates; no template was published and no service records were created.
- 2026-10-21: Re-ran the production build while continuing Oltin Nur. Next.js
  compilation, TypeScript, page-data collection, and static generation all
  completed successfully (`pnpm build`, exit 0). This supersedes the earlier
  stalled-build note. The successful build does not verify runtime database or
  object-storage behavior or outstanding complete per-template
  interaction/visual checks; Oltin Nur remains unpublished.
- 2026-10-21: Continued Oltin Nur verification. In the live preview, checked
  English locale content, RSVP choice and guest-count state, and the music
  mute/play toggle. This checkout has no app `.env.local`, database URL,
  R2 credentials, Docker/psql executable, or local PostgreSQL/object-storage
  listener. Customer save/reopen and media delivery cannot be verified without
  those external dependencies. Keep the template unpublished and active; do
  not advance to Samarqand Kechasi.
- 2026-10-21: Continued Oltin Nur verification in the live preview with audio muted. Confirmed the opening sequence at desktop and mobile, all four language variants, the shared sample names/program and localized date copy, RSVP choices and attendee count, hidden empty optional sections, and no browser errors. Reproduced a real long-name clipping bug: the reference hero content expanded to the names’ intrinsic width inside its fixed portrait canvas. Constrained `.hero__content` in the shared adapter (`min-width:0; max-width:100%`); the opened long-name fixture now stays fully inside the design at 320px, 390px, and desktop. Typecheck, all 40 tests, and the production build pass. This does not close live reduced-motion emulation, complete reference comparison, authenticated save/reopen and media delivery, receipt processing or publication gates.

- 2026-10-21: Applied migrations 0001-0005 to the user-provided Neon database and, at the user's explicit request, marked Oltin Nur published. Verified the local port 3001 catalog API returns it as published in the wedding category at the existing price. Tests (41), typecheck, build, and git diff checks pass. This is a catalog/database publication; no Vercel project or CLI is linked, so external deployment and cloud-service flows have not been verified.

- 2026-10-21: User supplied a Telegram bot token; stored it only in ignored `apps/web/.env.local`, verified its bot identity with Telegram getMe, and configured the local username plus generated session/webhook secrets. Port 3001 auth session endpoint now returns HTTP 200 (unauthenticated). No webhook was changed because APP_URL is local and no public HTTPS deployment is linked.

- 2026-10-21: Removed the optional voice greeting from the studio, invitation contract, and template bridge at the creator request. Migration 0010 strips legacy invitation fields and removes voice-only media records; background music is unchanged.


- 2026-10-21: Completed the requested Samarqand Kechasi release using catalog
  publication migration 0014 at the existing 150,000 UZS price. Fixed the
  English/Russian hero link and document title, and added a regression test
  covering the template static locale copy. Local preview checks covered the
  opening sequence, all four locales, dates/calendar/countdown, program,
  RSVP/wishes, empty optional sections, and long names. Typecheck, all 53 tests,
  production build, and `git diff --check` pass. The local catalog API and UI
  show Samarqand Kechasi as published; external deployment and cloud-service
  readiness remain unverified. This supersedes earlier roadmap notes that kept
  Samarqand Kechasi or Oltin Nur unpublished.

- 2026-10-21: Completed Bogi Eram for catalog publication. Added missing motion sprites from the exact reference paths, corrected portrait Open Graph artwork/metadata, localized document/share metadata, and fixed the language picker so its opening-screen offset ends when the gate unlocks. The shared sample spells Uzbek Cyrillic Gulhayo as the requested x-form; general transliteration remains standard. Four locales, gate opening, hidden empty optional sections, RSVP choice/guest count, responsive full preview, and picker position were checked. All project tests, typecheck, production build, and diff checks pass. Migration 0015 publishes Bogi Eram at 150,000 UZS; external deployment and cloud-service readiness remain unverified.

- 2026-10-21: Completed Atlas for catalog publication. Localized browser title and sharing metadata, kept its exact portrait catalog artwork and full captured renderer, and improved the shared long-name fitter so long Uzbek names break at word boundaries after fitting to the design width. Compared the captured intro/opening with the integrated preview; verified four locale controls and metadata, hidden empty optional sections, RSVP state and party size, direct creation opening at step 2, and catalog actions. All 58 tests, typecheck, production build, syntax checks, and diff checks pass. Migration 0016 publishes Atlas at 150,000 UZS. External deployment and cloud-service readiness remain unverified.

- 2026-10-21: Continued Uchar Gilam readiness work. Fixed the copied opening
  animation's dynamic Three.js bundle URL to resolve to the packaged shared
  runtime, and added an asset-resolution regression check. All 62 tests,
  typecheck, production build, and diff checks pass. Runtime browser/interaction
  verification and the remaining publication gates are still open; keep the
  template unpublished.

- 2026-10-21: Source review found one reduced-motion oversight in Uchar
  Gilam's wish-added flourish. The event handler now skips Web Animations when
  reduced motion is active, with a regression assertion; the RSVP and gift
  effects already had guards. Focused template tests (4), JavaScript syntax,
  and diff checks pass. Browser-level verification remains outstanding.

- 2026-10-21: Hardened Uchar Gilam teardown further: its font-ready repaint
  now checks whether the CanvasTexture was disposed or the renderer was
  released before updating it. Added the condition to the teardown regression
  test. Focused tests (4), JavaScript syntax, and diff checks pass.

- 2026-10-21: Expanded the Uchar Gilam adapter test from checking only top-level
  data roots to checking every distinct dotted content slot used in the HTML.
  The template integration test passes with all authored slots mapped to the
  shared legacy adapter contract.


- 2026-10-21: Completed Oq Kabutar source-fidelity and preview review. Its packaged HTML body, CSS, and JavaScript match the untouched capture after normalizing line endings. Verified the opening, four locales, 390px mobile layout, RSVP choice/count controls, hidden empty optional sections, local art, and clean browser logs. Added Russian and English iframe title/description translations with regression coverage. All 65 tests, typecheck, production build, and diff checks pass. Additive migration 0017 publishes Oq Kabutar in the Neon catalog at 150,000 UZS; the local catalog API confirms wedding compatibility and publication. External deployment and cloud-media/save verification remain unverified. User explicitly skipped Uchar Gilam; leave it unpublished and continue with Kuzgi Chinor.

- 2026-10-21: Completed Kuzgi Chinor. The packaged HTML body and JavaScript match the capture; its stylesheet differs only by replacing the external Google Fonts import with locally bundled font files. Added full static-copy/metadata and source-fidelity regression coverage, corrected all four page-metadata locales (including Uzbek Cyrillic), and verified the opening, mobile layout, RSVP choice/count, hidden empty sections, and clean browser logs. The reduced-motion behavior remains in the unchanged captured JavaScript and is guarded by the shared runtime. All 67 tests, typecheck, production build, and diff checks pass. Additive migration 0018 publishes Kuzgi Chinor at 150,000 UZS; local catalog API confirms wedding category/event support. External deployment and cloud-media/save verification remain unverified. Continue with Muhabbat Kitobi; Uchar Gilam remains skipped.
- 2026-10-21: Completed Muhabbat Kitobi source and release checks. The captured page body, styles, motion scripts and assets are retained; the shared renderer maps authored localized story chapters into the original layout. Verified mobile width, locale controls, RSVP choice/count, empty optional sections, and clean browser logs. Added localized chapter labels and regression coverage. All 69 tests, typecheck, production build and diff checks pass. Additive migration 0019 publishes the template at 150,000 UZS; local catalog API verifies it. External deployment and cloud-media/save verification remain unverified. Continue with Sahifa; Uchar Gilam remains skipped.
 - 2026-10-21: Completed Sahifa. Preserved the captured layout and motion with guarded empty GSAP targets, localized page metadata and shared sample wishes; fixed locale switching to retain invitation data. Verified all four locales, sample wishes, 390px overflow, opening, hidden optional sections and clean browser logs. All 72 tests, typecheck, production build and diff checks pass. Additive migration 0020 publishes Sahifa at 150,000 UZS; local catalog API confirms wedding category and event support. External deployment and cloud-media/save verification remain unverified. Continue with Oltin Uzuk; Uchar Gilam remains skipped.
 - 2026-10-21: Sahifa release-state follow-up aligned the typed catalog's `published` flag with migration 0020, which publishes Sahifa at 150,000 UZS. The focused Sahifa contract suite passes 4/4, the full project suite passes 382/382, typecheck passes, and production build passes. This audit did not query the configured database, so whether migration 0020 is applied to the current database remains unverified; external deployment and cloud-media/save verification also remain open.
 - 2026-10-21: Follow-up to the immediate Russian iframe snapshot: after the iframe settled, the Russian Sahifa document had `lang="ru"`, both wishes and program sections visible, and all generated content (3 wishes, 6 program rows). The first empty-list snapshot was a navigation timing race, not a persistent locale regression. The browser evaluation bridge did not expose `window.Marhamat`, so direct inspection of its private data object was unavailable; rendered DOM confirms the payload was consumed. No configured database was queried or changed.

 - 2026-10-21: Completed Oltin Uzuk. Kept captured styles, ring assets and ring animation while mapping localized invitation fields, clothing, RSVP, gifts, and sample wishes. Corrected page metadata and guarded optional 3D animation targets so the captured photo animation opens without GSAP warnings. Verified all four locales, 390px responsive width, opening, RSVP selection/count, hidden empty optional sections, and clean browser logs. All 74 tests, typecheck, production build, JavaScript syntax checks and diff checks pass. Additive migration 0021 publishes Oltin Uzuk at 150,000 UZS; local catalog API confirms wedding category and event support. External deployment and cloud-media/save verification remain unverified. Continue with Oynavand; Uchar Gilam remains skipped.

## Current Marxaba worker batch (2026-10-21)

Toscana and Muhr are packaged, registered in the typed catalog, and have additive unpublished database registration in migration 0032. Toscana uses the captured aisle opening artwork because the source metadata preview file is missing. Both pass focused source/contract tests and typecheck; browser release review remains.

- 2026-10-21: Independently audited Muhr's package and live preview. Focused
  source/integration tests (7) and web TypeScript check pass. Exact-source
  assertions cover the captured body, CSS, template/seal scripts, metadata,
  localization, and source art; the catalog preview uses the source envelope
  artwork. Browser checks verified the opening, Uzbek Latin/Cyrillic, English
  and Russian sample data (six localized program entries, five dress-code
  colors, and three wishes), RSVP choice and guest count, plus To'yona
  expansion and contact links. Muhr remains unpublished. Mobile/reduced-motion,
  browser-console inspection, complete source comparison, and authenticated
  save/reopen/service verification remain release gates. The captured venue
  photo slot and To'yona bank/note slots lack approved editor/shared-contract
  fields and are not populated with sample data. Added `SOURCE_ADAPTATIONS.md`
  and a package-only CSS rule to hide the empty bank label. The refreshed
  focused source/contract suite passes (10/10).

Vals is packaged and registered but remains unpublished pending release review. Qandil, Bulbul, and Kozgu source packages passed parent review; Qandil has a source-rendered 720x1280 opening and verified provenance, with full live and contract review still underway. Parda, Doira, and Ganch are registered unpublished; opening-art provenance has been reviewed for Doira and Ganch. Nahorgi Osh now has a verified portrait opening and provenance-backed capture; browser release checks remain. All remain unpublished pending their individual release gates.

- 2026-10-21: Integrated the reviewed Konfetti, Oltin Kuz, Oltin Yosh, and Nahor
  source packages as unpublished catalog entries. Added exact typed birthday,
  jubilee, and osh compatibility with separate catalog categories, an additive
  database seed, and localized centralized preview samples. Browser checks show
  Konfetti's full invitation sections, Oltin Kuz's Russian program after opening,
  and Nahor's localized morning schedule. Added Nahorgi Osh's unpublished entry
  and source compatibility, and rendered its authentic opening as a fixture-based portrait preview with provenance. It remains unpublished until browser release checks pass. Added the source-backed `iftorlik`
  event type and localized sample needed for Hilol. Focused package, fixture,
  migration, and type checks pass; responsive and remaining locale release
  checks remain open.
- 2026-10-21: Audited O‘rik Guli’s captured page body, scripts, preview artwork, fonts, four-locale copy, and shared preview contract. Added a template-scoped CSS adaptation so blank unsupported To‘yona bank and note slots do not leave empty space; regression coverage verifies the packaged stylesheet differs from capture only by the documented reduced-motion and empty-slot rules. O‘rik Guli focused source/contract tests pass (4/4). Desktop/mobile interaction, reduced-motion browser, persistence/service, and publication gates remain pending; keep unpublished.- 2026-10-21: Independently audited Monogram source packaging and static interactions. All captured files are present; only `index.html` and `i18n.js` differ for the documented dynamic year and gallery-dot label, while all other source files and assets are byte-identical. The release suite passes 6/6; source includes a reduced-motion path for opening, seal drawing, scroll motion, confetti and dust, plus responsive breakpoints and shared contract hooks for date/calendar, program, venue/map, dress code, gallery, RSVP, wishes, To‘yona and contacts. Computer-use inventory reported no browser tabs/providers in this session, so live locale/mobile/reduced-motion interaction checks remain unverified. Monogram stays unpublished.- 2026-10-21: Follow-up Monogram contract audit: confirmed that its empty To‘yona note and unsupported bank slots retained blank vertical space in the source layout. Added a narrowly scoped CSS rule in the packaged copy, documented in `SOURCE_ADAPTATIONS.md`, and expanded source-fidelity coverage to permit only that rule. Focused suite remains green (6/6); publication and browser QA are unchanged.
- 2026-10-21: Lola audit confirmed the capture manifest includes bouquet.webp, paper.webp, pressed-tulip.webp, and sandiq.webp, but omits sandiq-lid.webp although captured CSS references it. The packaged lid is an exact 800x300 transparent WebP recovered from the deployed template, not captured local source; a source-only reconstruction from the closed-chest art would be approximation. Added checksum-backed structured preview provenance and tests. Browser inventory was empty, so prior render provenance was not independently repeated; the original lid is present in the package; browser and service release verification remain open.- 2026-10-21: Independently audited Oltin Kuz’s captured package and shared adapter. All captured files are present; packaged `index.html` and `i18n.js` contain only the documented app-shell/data-sample adaptations, and `sample-overrides.js` is excluded. Added four-locale contract mapping checks for one celebrant, localized date/address/program, dress palette, preview gallery/wishes/gift/contact data, plus static Russian/English copy/accessibility coverage. The complete focused package, fixture, and unpublished-registration suite passes (16/16); typecheck passes. Documented unsupported `extras.age`, `extras.yearLabel`, `gallery[].year`, `venue.photo`, and `toyona.bank` explicitly; keep unpublished pending product/contract review plus browser and service release checks.
- 2026-10-21: Audited Chavandoz source packaging and integration. Confirmed the captured invitation body, CSS, metadata, translation table, and art are preserved exactly; only the documented HTML head/runtime paths and Three.js/empty-selector GSAP guards differ. Added four-locale mapping coverage for the one-person sunnat fixture, event/date/venue, six stable program entries, dress palette, icon-only gallery, wishes, To'yona, and contacts. Focused package/fixture/gallery/registration tests pass (19/19); web typecheck passes. Source gaps venue.photo, toyona.bank, and toyona.note remain documented. Browser inventory is empty; mobile, locale switch, reduced-motion, interaction, and service gates remain open; keep unpublished.
- 2026-10-21: Audited the existing Beshik integration, corrected stale source-adaptation documentation, and added end-to-end contract fixture assertions across Uzbek Latin/Cyrillic, English, and Russian for the one-person celebrant, date, venue/landmark, six ordered program items, dress-code palette, preview gallery, wishes, To'yona, and contacts. Source/body/style/script/art assertions plus focused fixture/gallery/registration tests pass (19/19). pnpm typecheck passes now that the shared Anor locale maps include all current event labels. CUA inventory is empty; browser, mobile, locale-switch, reduced-motion, interaction, and service release gates remain open. Beshik stays unpublished.
- 2026-10-21: Yangi Uy source/adapter, unpublished typed catalog and additive migration, localized sample content, and source gallery wrapping/reduced-motion behavior audited; 34 focused tests and web typecheck pass. Keep unpublished: regenerate the catalog opening image for the household sample and complete browser/service release gates.
- 2026-10-21: Independently audited Nahor source body, CSS, JavaScript, localization, metadata, fonts, animation dependencies, and artwork; captured body/scripts/styles/art remain exact in the package. Added four-locale fixture mapping coverage and documented the source-only venue-photo slot plus unsupported gift bank-name/note slots. The adapter hides empty bank-name/note elements without modifying captured styles. Focused Nahor and queued integration tests pass (7/7). Keep unpublished; browser/mobile/reduced-motion interaction and save/reopen service gates remain.

- 2026-10-21: Independently audited Konfetti against its captured Marxaba source. Verified byte-identical body, CSS, i18n, metadata, and five artwork assets; the app shell and five optional-content GSAP guards are the documented adaptations. Added source-diff regression coverage, four-locale birthday/jubilee fixture coverage, and checksum-backed provenance for the authentic 450x800 catalog opener. Focused package/integration/sample suite passes 17/17 and web typecheck passes. Browser/mobile/reduced-motion, interaction, persistence, and service release checks remain; Konfetti stays unpublished.
- 2026-10-21: Parent-reviewed Nahor's single-celebrant creator field and Shirin Bayram/Nahorgi Osh's empty optional-field adapters. Their localized fixture and package suites pass (20/20 combined); full project tests pass (371/371), typecheck and production build pass. These designs remain unpublished because desktop/mobile runtime, locale/motion/interaction, save/reopen and service release checks are still outstanding. The project-wide user instruction to complete all authentic Marxaba captures supersedes the earlier provisional Shirin Bayram starter-design exclusion; the source-backed Shirin Bayram remains unpublished until its gates pass.
- 2026-10-21: Parent-reviewed Ganch, Korporativ, Yangi Uy, Hilol, Oltin Yosh, and Oltin Kuz follow-up audits. Added all-locale household sample coverage for Yangi Uy; localized accessible labels for Oltin Yosh's icon-only gallery; age/year cleanup and birthday-opening provenance for Oltin Kuz; and fixture/blank-draft mapping plus empty To‘yona adapters for Hilol. Korporativ's empty-gallery rule now hides only its repeated source label while preserving the shared icon placeholder. Ganch's stale preview checksum and incorrect A&M/date pixels are pinned as an explicit release blocker. Focused combined suites pass (26/26 for Ganch/Korporativ/Yangi Uy and 23/23 for Hilol/Oltin Kuz/Oltin Yosh); full project tests pass (371/371), typecheck and production build pass. No publication state changed; authentic catalog art where stale and browser/mobile/reduced-motion/interaction/save/service release gates remain open.
- 2026-10-21: Wish-section audit across Oq Kabutar, Parda, Shahzoda, Korporativ, Chavandoz, and Anor found the source hooks and localized preview fixture were wired correctly. Fixed a shared Marxaba runtime stale-state bug: late iframe payloads now refresh wishes before rerendering, while preserving locally stored and approved remote wishes. Added cross-template regression coverage. Full tests, web typecheck, production build, and diff check pass; publication state is unchanged.
  - 2026-10-21: Continued Parda release review after the wishes audit. Its captured section hooks and shared four-locale wish adapter remain wired correctly; focused Parda/shared-wishes tests pass (8/8), the full suite passes (382/382), and web typecheck and production build pass. The local browser provider returned no browsers, so the remaining opening/mobile/locale/reduced-motion/persistence behavior checks could not be completed. The catalog image still has no verifiable source-render capture, while the metadata-declared remote asset has a noncanonical date/time. Parda remains unpublished pending those gates and cloud-service verification.
- 2026-10-21: Korporativ follow-up verified the packaged 720×1280 opener's SHA-256 against the official `meta.js` preview URL. The fixture now matches the image's “Yil yakuni kechasi” label, Marxaba Tech honoree, and 14 November 2026, 18:30. Focused template/wishes/catalog-fixture checks pass (21/21), Korporativ-only checks pass (9/9), embedded DB checks pass (15/15), and typecheck/build pass. Browser control remains unavailable. Local catalog/preview GET requests reported a configured database whose target could not be verified safely; no writes or authenticated save/reopen were attempted. Runtime/mobile/locale/reduced-motion/console and save/reopen service gates remain open; keep unpublished.
- 2026-10-21: Qandil release follow-up fixed mobile cropping for long couple names without changing the captured source: an isolated platform adapter refits SVG name slots after preview data arrives and constrains oversized text to the original cover width. Browser QA verified the opening on mobile and desktop, both mobile long names fitting the cover, Uzbek Latin/Cyrillic, English, and Russian content, six icon-only gallery entries and last-to-first wrapping; the venue frame hides without a map and console warning/error logs are empty. Qandil focused tests pass 10/10, the full suite 386/386, typecheck and production build pass. Catalog GET still reports 13 published designs and omits Qandil; the configured database host is external Neon, so its publication migration was not applied. RSVP runtime interaction, reduced-motion browser verification, authenticated save/reopen, and database publication verification remain release gates. Qandil remains unpublished.
- 2026-10-21 correction: a first accessibility snapshot was captured while the Nilufar iframe was reloading after a locale change, so it temporarily showed empty content. Settled browser checks confirm program and wishes in Uzbek Latin, Uzbek Cyrillic, English, and Russian. The opening interaction works, the browser console is clean, Nilufar's focused tests pass 7/7, and web typecheck/build pass. Read-only Neon inspection confirms the template row remains unpublished at 15,000,000 UZS and only supports `wedding`; the existing event-type constraint already permits `fotiha`. Do not publish yet: mobile viewport and reduced-motion browser verification are unavailable in the current browser session, authenticated API save/reopen requires Telegram sign-in, and public service checks remain open. User authorization permits applying the Nilufar publication migration once those gates pass.
- 2026-10-22 release: published Nilufar at 150,000 UZS with additive migration `0052_publish_nilufar.sql`; live DB confirms `published=true` and both `wedding` and `fotiha` support. The public catalog API lists it. At a 390px viewport, `documentElement.scrollWidth` equals `innerWidth` (390px). Authenticated four-locale save/publish/reopen integration passes for every published template (2/2 tests). Focused Nilufar source/integration suite passes 8/8; typecheck and production build pass. Browser reduced-motion emulation was unavailable; reduced-motion source handling and focused source assertions pass. No external app deployment or live payment activation was done.
- 2026-10-22 release: published Suzani at 150,000 UZS with additive migration `0053_publish_suzani.sql`; the configured database migration completed and the public catalog/save/reopen integration includes Suzani. Focused source suite passes 5/5 and web typecheck passes. Browser comparison found and fixed a stacking rule that hid the embroidered opening art; desktop/mobile checks then showed it correctly, with all four locales and clean browser logs. The filtered four-locale save/publish/public-render/reopen integration passes. The accidental unfiltered run also exposed 9 unrelated publishing-integration failures returning `PUBLISHING_UNAVAILABLE`; the isolated target passes. Browser reduced-motion emulation remains unavailable; source guards/assertions pass. No external app deployment or live payment activation was done. Continue with O‘rik Guli.
- 2026-10-22 release: published O‘rik Guli at 150,000 UZS with additive migration `0054_publish_orik_guli.sql`; DB confirms publication, wedding category, and wedding/fotiha/qiz-uzatish support, while `/api/catalog` lists it and its portrait artwork returns HTTP 200. Added exact first-view art provenance (780×1170, SHA-256 verified against the capture). The focused suite passes 5/5, typecheck and production build pass. Reference comparison and browser checks covered desktop/mobile (390px, no overflow), four full-page locales, long names, opening, gallery/modal/wrap controls, To‘yona, and RSVP guest-count control; browser logs are clean. The isolated four-locale save/publish/public-render/reopen integration passes for every published template. Reduced-motion runtime emulation is unavailable; its captured JavaScript path, platform CSS, and source assertions pass. No external app deployment or live payment activation was done. Continue with Paxta.
- 2026-10-22 release: published Paxta at 150,000 UZS with additive migration `0055_publish_paxta.sql`; DB and `/api/catalog` confirm wedding category and wedding/fotiha support, and preview artwork returns HTTP 200. Focused suite passes 8/8, typecheck, production build, and the isolated four-locale save/publish/public-render/reopen integration across every published template pass. Desktop preview shows the full fixture; opening, gallery, To‘yona, and RSVP guest-count interactions were checked. A fresh 390px preview verifies no horizontal overflow. Reduced-motion behavior is covered by source guards/assertions, not runtime emulation. No external app deployment or live payment activation was done. Continue with Monogram.
- 2026-10-22 release: published Monogram at 150,000 UZS with additive migration `0056_publish_monogram.sql`; DB and `/api/catalog` confirm wedding category and wedding/fotiha support, and portrait artwork returns HTTP 200. The focused source/contract suite passes 9/9, typecheck and production build pass. Compared the packaged opening to the untouched captured source; live renderer locale checks pass for Uzbek Latin, Uzbek Cyrillic, English, and Russian. At 390px, both preview and iframe widths match with no horizontal overflow, including the long-name fixture. Gallery next/previous wrap and To‘yona disclosure work; browser logs are clean. The isolated four-locale save/publish/public-render/reopen integration across all published templates passed. Reduced-motion browser emulation remains unavailable; source guards/assertions pass. Venue photo and gift note/bank slots remain unsupported and empty. No external app deployment or live payment activation was done. Continue with Retro Kino.
- 2026-10-22 release: published Retro Kino at 150,000 UZS with additive migration `0057_publish_retro_kino.sql`; DB and `/api/catalog` confirm wedding category and wedding-only compatibility, and the authentic 941×1672 poster is served as catalog art. Focused source/contract tests pass 11/11, typecheck, and production build pass. Reference and app openings were compared; Uzbek Latin, Uzbek Cyrillic, English, and Russian runtime copy checks pass, including the Cyrillic loanword correction. At 390px, page and frame widths match without overflow, including long names. The open interaction, gallery carousel and wrap, icon fallback lightbox, gift disclosure, and RSVP count were checked with clean console logs. Four-locale save/publish/public-render/reopen integration across every published template passes. Reduced-motion runtime emulation is unavailable; source JS/CSS handling is present. No external app deployment or live payment activation was done. Continue with Sahro Fonusi.
- 2026-10-22 release: published Sahro Fonusi at 150,000 UZS with additive migration `0058_publish_sahro_fonusi.sql`; DB and `/api/catalog` confirm wedding category and wedding/fotiha support, and portrait preview artwork returns HTTP 200. Focused tests pass 8/8, typecheck and production build pass. Compared the untouched captured opening panorama to the app; Uzbek Latin, Uzbek Cyrillic, English, and Russian runtime checks pass. The live renderer fits at 390px, including long names, with no horizontal overflow. Opening animation, gallery movement and fallback lightbox, To‘yona disclosure, and RSVP count were checked; browser logs are clean. The four-locale save/publish/public-render/reopen integration across every published template passes. Reduced-motion browser emulation is unavailable; source JS/CSS support is in place. No external app deployment or live payment activation was done. Continue with Lola.

- 2026-10-22 release: published Lola at 150,000 UZS with additive migration `0059_publish_lola.sql`; DB and `/api/catalog` confirm `qiz-bazmi` category and `qiz-uzatish`/`fotiha` compatibility, and portrait catalog art returns HTTP 200. Focused source/contract tests pass 8/8; typecheck, production build, and isolated four-locale save/publish/public-render/reopen integration across all published templates pass. Browser checks cover the captured opening, gallery and chest modal, RSVP controls, Uzbek Latin/Cyrillic, English, and Russian. At 390px with long names, page and iframe widths are 390px without overflow; browser warnings/errors are clean after documenting a narrow GSAP footer-target repair that preserves the glow. Reduced-motion runtime emulation is unavailable; CSS handling and source assertions remain. Venue-photo and gift note/bank fields remain unsupported and empty. No external application deployment or live payment activation was done. Continue with Qiz Bazmi.

- 2026-10-22 release: published Qiz Bazmi at 150,000 UZS with additive migration `0060_publish_qiz_bazmi.sql`; DB and `/api/catalog` verify qiz-bazmi category and qiz-uzatish/fotiha/birthday compatibility, and the 450×800 portrait opener returns HTTP 200. Source/contract and catalog/queued tests pass (24/24); typecheck passes. Reference and app intro were visually compared; all four locales work. At 390px with long names, the renderer fits without horizontal overflow. Opening, gallery selection and wraparound, To‘yona disclosure, and RSVP guest count work; browser warnings/errors are clean. Four-locale save/publish/public-render/reopen integration across the published catalog passes. Reduced-motion browser emulation unavailable; captured JS/CSS guards remain. No external application deployment or live payment activation was done. Continue with Shahzoda.
- 2026-10-22 release: published Shahzoda at 150,000 UZS through additive migration `0062_publish_shahzoda.sql`; DB and `/api/catalog` confirm category `other`, Sunnat-only compatibility, and HTTP 200 portrait art. Full captured source and art parity pass; focused template/queued/database checks pass 23/23, typecheck/build and four-locale save/publish/public-render/reopen integration pass. Fixed long-name clipping in the intro plaque and hero with a scoped app adapter. At 390px the plaque and hero wrap without document overflow; opening, gift disclosure, gallery wrap and RSVP count work. Reduced-motion runtime emulation unavailable; source/CSS paths are retained. Venue photo and gift bank/note remain unsupported and empty. No external deployment or live payment activation. Continue with Chavandoz.
- 2026-10-22 release: published Chavandoz at 150,000 UZS through additive migration `0063_publish_chavandoz.sql`; DB and `/api/catalog` confirm category `other`, Sunnat/birthday compatibility, and HTTP 200 portrait art. Compared the captured opening with the app at desktop and 390×844; the opening banner and hero fit long names, all four locales work, and six-card gallery wrap, To‘yona disclosure, and RSVP count work with clean browser logs. Focused source/catalog/database checks, typecheck, production build, full suite (402/402), and four-locale save/publish/public-render/reopen integration across all published templates pass. Reduced-motion browser emulation is unavailable; captured CSS/JS and shared core support it. Venue photo and gift bank/note remain unsupported and are not fabricated. No external deployment or live payment activation. Continue with Beshik.

- 2026-10-22 continuation after force-pull: restored the untouched Toscana, Vals, Muhr, Bulbul, Parda, Doira, Ganch, and Qatlam source captures from the user-supplied archive into the ignored local fidelity-test folder; no captured source files were modified. Corrected several textual parity tests to ignore Windows CRLF/BOM differences while retaining exact checks for binary artwork and source-provenance hashes. Focused suites pass: Toscana 8/8, Vals 5/5, Muhr 7/7, Bulbul 6/6, Parda 7/7, Doira 7/7, Ganch 7/7, Qatlam 7/7, and Yangi Uy 8/8. Added a shared 1/1 guard for Emotional Piano on all full-template preview render paths. These checks do not close the documented visual, source-preview-provenance, responsive, reduced-motion, persistence, or service gates; publication state is unchanged. Korporativ's migration 0074 is prepared but cannot be applied in this checkout because `apps/web/.env.local` and `DATABASE_URL` are absent. No Telegram notification was sent.

- 2026-10-22 source-art check: searched the full user-supplied ZIP for image files associated with Yangi Uy, Bulbul, Ganch, and Parda. It contains no opening-preview image for those templates; Yangi Uy has only `art/house-iso.webp`. The current preview-art gaps cannot be resolved by copying another captured opening image from this archive, so those templates remain unpublished until a faithful fixture-based render and its provenance can be produced.
- 2026-10-22 continuation: the workspace database configuration is now available from the local root `.env.local` (credentials kept private). Confirmed all ten remaining template records exist and were unpublished; migration `0074_publish_korporativ.sql` was the sole pending migration. Applied it, verified Korporativ in the live catalog at 150,000 UZS with `other` category and `korporativ`/`bitiruv`/`yubiley` event support, and sent the user-authorized Telegram notice. The authenticated integration test `every published template preserves every editor field across four-language save, publish and reopen` passes 1/1 against the live configured database and local app, including Korporativ. Nine other previously reviewed designs remain unpublished pending their individual source-art, browser, and release gates. Fixed the integration harness to remove an environment key when its original value is unset and updated wish moderation to use the supported deleted state; the full publishing suite now passes 20/20. No external application deployment or live payment activation.
- 2026-10-22 release: published Vals at 150,000 UZS through migration `0075_publish_vals.sql`; live database and catalog verify wedding category and wedding/fotiha support. The four-locale authenticated save/publish/public-render/reopen integration passed 1/1 specifically for Vals; source parity/art, release browser QA, focused tests (23/23), typecheck, and the shared Emotional Piano preview default pass. Telegram notification was delivered after catalog verification. External deployment and live payment activation were not performed.
- 2026-10-22 release: published Toscana at 150,000 UZS through migration 0076_publish_toscana.sql; the live catalog confirms wedding category and wedding/fotiha support. Its captured opening, four locales, mobile fit, program, gallery, Toyona, RSVP control, creator-name updates, and clean browser logs were previously verified. Authenticated four-locale save/publish/public-render/reopen integration passed 1/1 specifically for Toscana. Focused source/art/music checks pass 9/9, typecheck and production build pass. Telegram notification was delivered after catalog verification. Reduced-motion runtime emulation and external deployment remain unverified.
- 2026-10-22 release: published Muhr at 150,000 UZS through additive migration `0077_publish_muhr.sql`; live `/api/catalog` confirms wedding category and wedding/fotiha/qiz-uzatish compatibility, and the exact captured envelope is catalog artwork. Focused source/contract/music/registration checks pass, web typecheck passes, and authenticated catalog-wide four-locale save/publish/public-render/reopen integration passes 20/20, including Muhr. Browser QA was skipped under the user's release instruction while the browser transport returned `Transport closed`. Source-only venue-photo and gift bank/note fields remain empty. No external deployment or live payment activation.
- 2026-10-22 release: published Doira at 150,000 UZS through additive migration `0078_publish_doira.sql`; source parity and preview provenance tests pass 7/7, live catalog confirmation and Doira-specific four-locale save/publish/public-render/reopen integration passes 1/1. Telegram notice delivered. Browser QA was skipped under the user's release instruction while browser transport was unavailable. Unsupported venue-photo and gift bank/note fields remain empty.
- 2026-10-22 continuation: the shared Marxaba renderer receives authored Invitation data and feeds creator previews and public pages; save and publish use the common API. The live catalog had 38 published templates before Muhr, Doira, and Qatlam. Korporativ, Vals, Toscana, Muhr, Doira, and Qatlam are catalog-verified and have user-requested Telegram notices. Muhr passes the catalog-wide four-locale integration (20/20); Doira and Qatlam each pass template-specific save/publish/public-render/reopen integrations (1/1). The remaining unpublished source-backed designs are Bulbul, Parda, Ganch, and Yangi Uy. Their source-art provenance blockers remain unresolved; source/contract/music checks and browser review continue per design.

- 2026-10-22 release: published Qatlam at 150,000 UZS through additive migration 0079_publish_qatlam.sql; live catalog and template-specific authenticated four-locale save/publish/public-render/reopen integration pass. Source parity and the fixture-based 720x1280 opening preview provenance pass 7/7. Browser QA was skipped under the user release instruction while browser transport was unavailable. Unsupported venue-photo and gift bank/note fields remain empty. Telegram notice delivered.
- 2026-10-22 validation: the restored original Marxaba archive has no opening-preview images for Bulbul, Parda, Ganch, or Yangi Uy; only the captured decorative art is present. The visible-window Computer Use check exposed only the Codex app, so visual browser QA remains unavailable. Current full unit suite reports 382/407 passing; the 25 failures are source-parity assertions in existing template packages after their original capture files were restored, with no missing-file failures. Muhr, Doira, and Qatlam focused release checks and integrations pass; typecheck and production build pass.

- 2026-10-22 Bulbul release: applied `0083_publish_bulbul.sql`; configured database and approved in-app `/api/catalog` verify the published row and canonical capture. Authenticated four-locale save/publish/public-render/reopen integration passed 1/1 with disposable test users cleaned up. Telegram notice delivered after verification. No external deployment was performed.

- 2026-10-22 Parda release: applied `0084_publish_parda.sql`; configured catalog and approved in-app preview verify the published row, canonical artwork, supported events, Uzbek Cyrillic, 390px layout, and reduced-motion rendering. Authenticated save/publish/public-render/reopen integration passed 1/1 with generated test users cleaned up. Telegram notice delivered after verification.

- 2026-10-22 Ganch release: applied `0085_publish_ganch.sql`; configured catalog and approved in-app preview confirm the published row, canonical art, expected event support, mobile fit, English locale, and reduced-motion rendering. Authenticated save/publish/public-render/reopen integration passed 1/1 and test users were cleaned up. Telegram notice delivered after verification.

- 2026-10-22 Yangi Uy release: applied `0086_publish_yangi_uy.sql`; configured catalog and approved in-app preview verify the published row, canonical art, housewarming event support, mobile fit, English locale, and reduced-motion rendering. Authenticated save/publish/public-render/reopen integration passed 1/1; test users were cleaned up. Telegram notice delivered after verification.

## E-invitation release

- 2026-10-22 Velvet Royale (`royal-burgundy-edition`) is published at 150,000 UZS after source, renderer, catalog, backend, visual, and authenticated save/publish/public-render/reopen checks passed. Focused checks pass 6/6; typecheck and production build pass. The authorized Telegram notice was sent. Guest table assignment remains unsupported by the shared invitation contract.


## Chorlove source-backed release progress

The archive contains 28 captured preview snapshots. Each candidate is adapted from its preserved capture and released only after its own contract, backend/catalog, browser-art provenance, visual, and publishing integration checks pass.

| Archive ID | Design | Status |
| --- | --- | --- |
| `cloud-castle` | Cloud Castle | Published |
| `glass-pink` | Glass Pink | Published |
| `golden-card` | Golden Card | Published through `0093_publish_golden_card.sql` |
| `green-garden` | Green Garden | Queued |
| `green-gold` | Green Gold | Queued |
| `green-white` | Green White | Queued |
| `ivory-love` | Ivory Love | Queued |
| `jasmine-white` | Jasmine White | Queued |
| `lace` | Lace | Queued |
| `love-sakura` | Love Sakura | Queued |
| `luxury-gold` | Luxury Gold | Queued |
| `modern-floral` | Modern Floral | Queued |
| `orchid-amplop` | Orchid Amplop | Queued |
| `osh` | Osh | Queued |
| `palace-rose` | Palace Rose | Queued |
| `palov` | Palov | Queued |
| `pink-lotus` | Pink Lotus | Queued |
| `purple-flower` | Purple Flower | Queued |
| `red-rose-card` | Red Rose Card | Queued |
| `royal-blue` | Royal Blue | Queued |
| `royal-green` | Royal Green | Queued |
| `royal-purple` | Royal Purple | Queued |
| `royal-red` | Royal Red | Queued |
| `spring-bahor` | Spring Bahor | Queued |
| `stained-glass` | Stained Glass | Queued |
| `sunset` | Sunset | Queued |
| `swan-garden` | Swan Garden | Queued |
| `velvet-romance` | Velvet Romance | Queued |

- 2026-10-22 Golden Card release: saved the approved in-app browser rendering of the canonical preview fixture as `apps/web/public/templates/golden-card/preview-browser-capture.jpg` (335x469; SHA-256 `d43879e07c14b32fec48123445950f8b6de34d3a70e7bcdc94e81e23f6cf40b1`). The original capture hash remains unchanged. Registration `0092_register_golden_card.sql` and publication `0093_publish_golden_card.sql` are applied; configured PostgreSQL and `/api/catalog` verify wedding category, wedding event support, and publication. Focused package checks pass 12/12, web typecheck and production build pass, and authenticated four-locale save/publish/public-render/reopen passes 1/1 against both the isolated local and configured databases. The approved in-app browser confirmed the canonical preview, cover opening, localized content, mobile fit, and reduced-motion behavior. The authorized Telegram release notice was delivered after verification. No external deployment was performed.

- 2026-10-22 Cloud Castle release: applied additive migration `0088_publish_cloud_castle.sql`; configured PostgreSQL and the approved in-app `/api/catalog` confirm the published wedding entry at 150,000 UZS with its browser-captured preview image. The source snapshot remains unchanged; the app package keeps its original art/styles while removing captured site runtime and sample data. Mobile preview fits 319px without horizontal overflow, and the event date, countdown, calendar, shared Emotional Piano, locale switching, reduced-motion flag, gallery/story visibility, and preview-only controls were checked. Preview provenance SHA-256 is recorded. Focused checks pass 4/4, web typecheck and production build pass, and the authenticated four-locale save/publish/public-render/reopen suite passes 20/20 with test rows cleaned. The authorized Telegram notice was delivered after verification. No external deployment was performed.


- 2026-10-22 Glass Pink release: registration `0089_register_glass_pink.sql` and publication `0091_publish_glass_pink.sql` are applied. The configured catalog confirms the wedding entry and canonical preview. Source, four-locale controls, mobile fit, reduced motion, authenticated save/publish/public-render/reopen, typecheck, production build, and focused package checks pass. The authorized Telegram notice was delivered after verification; no external deployment.
