# Taklifla completion queue

User-directed sequential audit/integration, started 2026-10-29. There are 24
distinct captured source HTML templates. Six were already integrated at the
start; private source packages do not count as finished. Complete, verify,
publish and commit one source before starting the next. Original captures stay
untouched. Application deployment and live payment activation are excluded.

| Source | Application ID | Initial state | Current review |
| --- | --- | --- | --- |
| Asalari | taklifla-asalari | Published | Complete — source/6 browser cases, real lifecycle and actual audio verified; music gap fixed |
| Diyora-Shahzod | taklifla-zarhal-sahifa | Published | Complete — missing studio renderer, Google fallback and catalog audio fixed; real lifecycle verified |
| Envelope | taklifla-muhrli-maktub | Published | Complete — shared Google links/wish samples, gesture audio and studio opening corrected |
| Fasllar | taklifla-tort-fasl | Published | Complete — studio opening and shared sample wishes corrected; full source/lifecycle/audio checks pass |
| Midnight Palace | taklifla-tungi-saroy | Published | Complete — current source, three-viewport motion, audio and real lifecycle audit passes |
| Tovus | taklifla-tovus | Published | Complete — current source, three-viewport motion/audio and real lifecycle audit passes |
| Barakali | taklifla-barakali | Private package | Complete — fully integrated and published through migrations 0173/0174 |
| Bookie Navy | taklifla-yubiley-sahifasi | Private package | Complete — anniversary fields, map and real RSVP implemented; published 0175/0176 |
| Bookie Terracotta | taklifla-fayzli-xonadon | Private package | Complete — dinner menu integrated, source engine reused; published 0177/0178 |
| Ertak | taklifla-ertak | Private package | Complete — source parallax/ambient, shared wishes and lifecycle verified; published 0179/0180 |
| Garden Arch | taklifla-gulbog | Private package | Complete — family/reminder/footer fields restored; source/lifecycle/audio verified; published 0181/0182 |
| Marigold | taklifla-zarrin-gullar | Private package | Complete — family/stay/footer/hashtag restored; shared data and source verified; published 0183/0184 |
| Mountain | taklifla-toglar-bagrida | Private package | Complete — independent scene times, shared maps/wishes and full routes restored; published 0185/0186 |
| Oltin Yo‘l | taklifla-oltin-yol | Private package | Complete — renderer/bridge, notes, timetable/wishes and full source motion integrated; published 0187/0188 |
| Osmon | taklifla-osmon | Private package | Complete — exact airplane recovered, editable notes/shared wishes/closure restored; published 0189/0190 |
| Pari | taklifla-parilar-ertagi | Private package | Complete — broken body extraction repaired; full renderer/bridge and editable labels/arrival integrated; published 0191/0192 |
| Qog‘oz | taklifla-qogoz-ertagi | Private package | Complete — full bridge, fitting/closure, editable notes and routes restored; published 0193/0194 |
| Sakura | taklifla-sakura-guli | Private package | Complete — hidden notes/city, empty timeline, wishes/music/status/sizing fixed; published 0195/0196 |
| Sharlar | taklifla-sharlar | Private package | Complete — missing bridge/motion, shared age/doors/maps/wishes restored; published 0197/0198 |
| Starry Night | taklifla-yulduzli-tun | Private package | Complete — broken scene URLs, hidden information, native menu and shared wishes/maps restored; published 0199/0200 |
| Terracotta | taklifla-terracotta | Private package | Complete — missing bridge/services/routes, editable notes/shared maps/music restored; published 0201/0202 |
| Uchrashuv | taklifla-uchrashuv | Private package | Pending |
| Yaylov | To reconcile | No registered package | Pending |
| Yomg‘ir | taklifla-yomgirdan-song | Private package | Pending |

## Verification required per source

Exact capture/CSS/asset/font checks; responsive source comparison and motion;
all locales, long names, empty optionals, shared maps/sample data; actual
save/reopen and public/studio rendering; real moderated wishes where present;
music/reduced motion; authentic catalog and personalized artwork; compatible
category/event registration and configured DB publication. Record evidence and
the individual commit below each completed row.

## Asalari audit

- All 17 art/font dependencies and captured CSS retain exact bytes; age pill, birthday wording, maps, four locales, motion and empty states pass.
- Fixed missing catalog track and prevented the preview shell from bypassing template gesture gating. Public creator playback is retained; manual pause survives language switches.
- Actual birthday save/reopen, compatible template switching, studio/public rendering, personalized guest, manual/Place maps and pending wishes pass.
- Evidence: `apps/web/src/templates/taklifla-asalari/evidence`, `docs/templates/taklifla-audit/asalari-integration.json` and `asalari-audio.json`. Existing database publication/price are preserved.

## Zarhal Sahifa audit

- Preserved exact source CSS and 30 captured dependencies. Mobile/desktop source comparisons, reveals, four locales, long/empty data, seven gallery items, reduced motion and service error handling pass.
- Fixed missing studio dispatch, Google Maps fallback and catalog gesture gating. Actual local audio decoding, pause across locale switching and resume pass.
- Real authenticated save/reopen, compatible switching, studio/public routes, publication, personalized four-locale data, selected/manual Google maps and pending wishes pass. Existing publication and admin price are preserved.
- Evidence: `apps/web/src/templates/taklifla-zarhal-sahifa/evidence`, `docs/templates/taklifla-audit/zarhal-integration.json` and `zarhal-audio.json`. Four package tests and web typecheck pass.

## Muhrli Maktub audit

- Original capture/CSS, ten images and twelve fonts retain their bytes. Five source/browser cases cover sealed/open/unfold states, four locales, repeats, long copy, empty sections, closed wishes, reduced motion and HTTP errors.
- Both map buttons use the shared Google target. Preview wish cards use only canonical localized samples. Audio starts on opening, follows actual play/pause events and retains manual pause across locale changes.
- Studio opens the source scene and targets authored names/location/RSVP. Real four-locale save/reopen and source flowers notes, switching, publication, public guest/maps, edited content/manual link and pending wish persistence pass.
- Evidence: `apps/web/src/templates/taklifla-muhrli-maktub/evidence`, `docs/templates/taklifla-audit/muhrli-integration.json`, `muhrli-audio.json`. Package tests and typecheck pass; original catalog publication/price unchanged.

## To‘rt fasl audit

- Capture/CSS/assets remain exact. Browser comparison at 320/390/1280 verifies seasonal particles, parallax, source sections, four locales, long/empty fields, reduced motion, closed wishes and transport failure handling.
- Catalog wishes now use canonical preview-only data. Studio opens the source scene and targets authored names/location. Real save/reopen, compatible switching, studio, four-locale personalized public data, Google Place/manual map, publication and pending wishes pass.
- Evidence: `apps/web/src/templates/taklifla-tort-fasl/qa`, `docs/templates/tort-fasl-verification/integration-report.json`, `docs/templates/taklifla-audit/fasllar-audio.json`. Four source/adapter tests and typecheck pass; existing publication/price retained.

## Tungi Saroy audit

- No new implementation gap found. Four source/data tests pass; 320/390/1280 source comparisons verify palace scene, particles, reveal/parallax, four locales, stable program items, long/empty content, Google maps and reduced motion.
- Real authenticated lifecycle including compatible switching, studio opening, public four-locale personalization, publication, manual Google edits and pending wishes passes. Actual catalog audio is gesture gated and pause/resume survives locale changes.
- Evidence: `docs/templates/luxury-uzbek-verification/taklifla-tungi-saroy-*`, `docs/templates/taklifla-audit/tungi-saroy-audio.json`. Publication and price remain unchanged.

## Tovus audit

- No new implementation gap found. Four source/adapter tests and 320/390/1280 browser comparisons pass: source feather/crest composition, particles, reveals, four locales, long/empty names, stable repeatable items, shared Google maps, reduced motion and closed wishes.
- Real authenticated save/reopen, compatible switching, publication, studio opening, personalized four-locale public content, selected/manual Google maps and pending wishes pass. Catalog audio decodes after opening and pause/resume survives locale changes.
- Evidence: `docs/templates/luxury-uzbek-verification/taklifla-tovus-*`, `docs/templates/taklifla-audit/tovus-audio.json`. Existing publication and price preserved.

## Barakali integration

- Complete source floral SVG/CSS/reveal implementation and ten local fonts retained; no missing image-directory dependency. Fixed Google destinations, preview gesture audio, and private QA harness defects. Birthday-only compatibility/category registered separately.
- Same real renderer in catalog/studio/public. Canonical birthday fixture, translated sample wishes, creator portrait/alt/caption, guest greeting, date/countdown, contacts and Google venue bind through the typed contract. Public samples never leak.
- Five package tests, mobile/desktop source comparison with motion, four locales/long/empty/reduced checks, actual audio, real authenticated lifecycle/moderated wishes, personalized cover, typecheck and production build pass. Compatible switching is rechecked after publication.
- Applied only additive migrations 0173/0174; configured catalog confirms published birthday design. Evidence in `apps/web/src/templates/taklifla-barakali/evidence` and `docs/templates/taklifla-audit/barakali-*`. No app deployment or payment activation.

## Yubiley Sahifasi integration

- Exact navy book corporate source CSS, city photo and fonts retained. Restored missing hero/closing anniversary years, founder role, milestone years and statistic cards with validated editable persistent fields. Shared stories/program retain stable IDs.
- Source venue illustration now links to the shared Google venue. Real one-person RSVP includes organisation/note and guest identity; repaired the hidden acknowledgment. Catalog music is gesture gated; all four locales, reduced motion, long/empty fields and seven repeated items pass.
- Source/browser comparisons at 320/390/1280, 24 shared/adapter tests, actual audio, real save/reopen/source-data persistence, compatible switching, studio/public, publication/manual map/RSVP, personalized covers, typecheck and build pass.
- Applied additive migrations 0175/0176, category other and supported corporate event registered independently. Configured catalog publication is confirmed. Evidence: `docs/templates/taklifla-audit/yubiley*`, `taklifla-yubiley-sahifasi-personalized-cover.webp`.

## Fayzli Xonadon integration

- Complete terracotta housewarming source, exact house photo/fonts/three CSS blocks and source reveal engine are packaged and reused directly. Source dinner section is restored with localized editable/persistent courses and stable IDs; the floor-plan SVG remains decorative source art.
- Shared Google venue, hosts/greetings/date, dress palette, optional audio and real RSVP bind through typed data. No guest-count field. Catalog semantics/menu live in the shared event profile only.
- 27 shared/package tests, source comparisons at 320/390/1280, actual audio, four locales/long/empty/reduced checks, real menu save/reopen/studio/publication/public/maps/one-person RSVP, covers, typecheck/build pass. Compatible switching is checked after release.
- Additive migrations 0177/0178 publish only this design for housewarming, category other. Evidence: `docs/templates/taklifla-audit/xonadon*` and `taklifla-fayzli-xonadon-personalized-cover.webp`.

## Ertak integration

- Complete tunnel-book source CSS, nine exact artwork layers and twelve fonts retained. Source mouse/scroll parallax and ambient engine run directly; reduced-motion guards stop ambient drift and recover RAF scheduling. Long names fit without changing normal typography.
- Catalog autoplay and missing canonical wishes corrected. Shared names/greetings/hosts/date/maps/program/music/wishes bind through typed data; all map actions use the selected/manual Google venue or authored address search. No source gallery/gift/count interface invented.
- Three source/adapter tests, source comparisons and active motion checks at 320/390/1280, four locales, long/empty/repeated/reduced data, actual audio, real save/reopen/studio/publication/public/maps/pending wishes, compatible switching, cover captures, typecheck and build pass.
- Additive migrations 0179/0180 publish only Ertak for weddings. Evidence: `docs/templates/taklifla-audit/ertak*` and `taklifla-ertak-personalized-cover.webp`.

## Gulbog integration

- Exact garden/floral artwork, fonts and source styles retained. Source monogram opening, 18 petals, countdown and reveal engine run directly. Added typed/persistent editor support for the omitted bride-family, reminder and footer fields. Main authored data/maps/program remain shared.
- Canonical wedding profile/wishes and catalog gesture music are wired. Partial wedding preview profiles preserve the shared event label; other event-label behavior stays intact. Studio waits for bound data before opening; source hero is captured for catalog/personalized artwork.
- 25 shared/package tests, source comparisons at 320/390/1280, petal/reveal/opening, all locales, long/empty/seven-event/reduced data, preview no-send/failures, real source-field save/reopen/switching/studio/publication/public/maps/pending wishes, audio play/pause/resume/dismiss, covers, typecheck and build pass.
- Additive migrations 0181/0182 publish only Gulbog for weddings. Evidence: `docs/templates/taklifla-audit/gulbog*` and `taklifla-gulbog-personalized-cover.webp`.

## Zarrin gullar integration

- Complete Marigold source, exact CSS/art/fonts, native opener/ten petals/reveals/closed-wishes builder retained. Restored editable/persistent bride and groom families, accommodation, footer and hashtag. Stable payload dependencies prevent preview UI rerenders from resetting language/input.
- Shared wedding details now supply canonical family/footer examples across this design and Gulbog; maps/music/wishes stay canonical and preview-only. Normal/reduced motion, four locales, long/empty/seven-row data and failure states pass.
- 28 shared/package tests, three-viewport source comparisons, actual audio, real authenticated source-field save/reopen/studio/publication/public/maps/pending wishes, compatible switching, source/personalized covers, typecheck and production build pass. Evidence: `docs/templates/taklifla-audit/zarrin*`.
- Additive migrations 0183/0184 publish only Zarrin gullar for weddings. Configured API confirms publication; no external deployment or payments.

## Mountain integration

- Exact captured watercolor mountain/floral assets, source CSS/fonts and native three-layer idle/parallax/reveal retained. Added reduced-motion guard, missing independent scene time editor/persistence, canonical localized preview wishes and authored-address Google fallback. Scene copy reuses shared story chapters.
- 25 shared/package tests, source comparisons at 320/390/1280 and active motion/reveal checks, all locales/long/empty/seven-row data, real authenticated save/reopen/studio/publication/public/maps/pending wishes and compatible switching, actual audio, covers, typecheck/build pass.
- Additive migrations 0185/0186 register/publish only Mountain for weddings; configured catalog publication verified. Evidence: `docs/templates/taklifla-audit/mountain*`.

## Oltin Yo‘l integration

- Former art-only private package now has a full typed renderer/bridge and all routes. Exact source CSS/eight images/23 font dependencies, native opening/train marker/background interpolation/parallax/24 motes/reveals and timetable/telegram-card/closed-panel builders are retained. Long names wrap only when native fitting cannot fit; Cyrillic labels corrected.
- Source arrival/gift/contact/footer notes are editable, validated, saved/reopened and preserved on switching. Dress/contact/venue/program/date/identity reuse shared data. Canonical wedding notes/wishes/music/maps never enter public invitations.
- 31 shared/regression tests, three-viewport source/motion comparisons, all locales/long/empty/seven-row/reduced/closed/failure checks, actual audio, real authenticated note save/reopen/studio/publication/public/maps/pending wishes and switching, authentic covers, typecheck/build pass. Migrations 0187/0188 publish only this wedding design. Evidence: `docs/templates/taklifla-audit/oltin*`.

## Osmon integration

- Recovered the exact source airplane previously omitted after HTTP 403; all 19 cloud/flying objects and 14 seeded stars are present. Exact CSS/dependency hashes and original CLOUDS/DRIFTERS arrays verified. Native sky interpolation/parallax/floating/opening/reveal/fitting retained.
- Added validated editable/persistent RSVP/gift prose, canonical localized preview wishes, original source close panel, correct Cyrillic labels, zero countdown and audio URL handling. Shared hosts/dress/maps/identity/program remain reusable; ready handshake avoids payload in window.name.
- 25 shared/package tests, source/motion comparisons at 320/390/1280, four locales/long/empty/seven-event/reduced/closed/failure checks, real notes save/reopen/studio/publication/public/maps/pending wishes and compatible switching, actual audio, covers, typecheck/build pass. Migrations 0189/0190 publish only this wedding design. Evidence: `docs/templates/taklifla-audit/osmon*`.

## Parilar ertagi integration

- Repaired extraction that matched `<body>` inside a script comment and produced an empty design. Full native page is restored; exact CSS/eleven images/twelve fonts and source tunnel/opening/parallax/reveal/petals retained. Root CSS resolves original artwork paths correctly; source pin/arrow markup preserved.
- Added full typed bridge and route integration, editable/persistent localized arrival note and stable-ID supplementary program labels, shared canonical wedding examples/wishes, shared maps/dress/contacts/identity and real moderated wishes. No sample identities/storage or placeholder audio served.
- 25 shared/package checks, source comparisons at 320/390/1280 with six layers and active motion, four locales/long/empty/seven-event/reduced/failure/preview checks, real label/arrival save/reopen/studio/publication/public/maps/pending wishes and switching, actual audio, covers, typecheck/build pass. Migrations 0191/0192 publish only this wedding design. Evidence: `docs/templates/taklifla-audit/pari*`.

## Qog‘oz ertagi integration

- Complete source paper-book DOM/inline CSS, twelve images/twelve fonts, cover turn, scene parallax/desk color/reveals/bobbing/fitting retained. Original timeline/wish builders and 24-hour close panel restored; real bridge and all routes added.
- Contact/footer notes are validated, editable and persistent; shared identity/date/venue/maps/program/dress/contacts remain reusable. Canonical fixture/wishes stay preview-only. Failure status is translated accurately after native locale changes; related Zarrin/Oltin regressions were corrected in commit 55d8a8fd2.
- 25 shared/package checks, three-viewport source/motion comparisons, four locales/long/empty/seven-row/reduced/closed/failure checks, actual audio, real authenticated notes save/reopen/studio/publication/public/maps/pending wishes and switching, covers, typecheck/build pass. Migrations 0193/0194 publish only this wedding design. Evidence: `docs/templates/taklifla-audit/qogoz*`.

## Sakura Guli integration

- Exact source CSS/eight images/thirteen fonts and native 37 petals/reveals/parallax/background/fitting/opening retained. Restored hidden city/info/footer/contact prose, original closed-wishes panel and full routes. New notes have typed editor/persistence and shared canonical examples.
- Fixed empty timeline exception, unstable preview memo, missing canonical wishes/audio, invisible/unchecked success states, locale failure handling, dynamic reduced motion and preview sizing. Extended copy grows the source floral frame without clipping; normal geometry stays 2:3.
- 25 shared/package tests, source/motion comparisons at 320/390/1280, all locales/long names and copy/seven rows/empty/reduced/closed/failure checks, real notes save/reopen/studio/publication/public/maps/pending wishes and switching, actual audio, covers, typecheck/build pass. Migrations 0195/0196 publish only this wedding design. Evidence: `docs/templates/taklifla-audit/sakura*`.

## Sharlar integration

- Reused exact source CSS and all 29 art/font dependencies, restored native 36 stars, three arches, three balloons, six confetti pieces, opening, parallax and reveals. The former package referenced a nonexistent bridge and never loaded its visual engine.
- Shared birthday identity/age, date, hosts, program, dress and Google venue now drive every route. Doors opening uses a validated editable time in templateData; canonical preview derives it from shared program data. Original source language menu supports all four locales; desktop preview controls leave it usable. No guest-count field or provider sample storage/runtime.
- 25 shared/package checks, three source comparison viewports, active motion, four locales, long/empty/seven-event/reduced/failure and preview checks, actual audio, authentic covers, real authenticated save/reopen/studio/publication/public/maps/moderated wishes and compatible birthday switching, typecheck and production build pass. Migrations 0197/0198 publish only Sharlar. Evidence: docs/templates/taklifla-audit/sharlar*.

## Starry Night integration

- All six paintings and nine fonts, exact source CSS, 120 stars, 35 native particles, shimmer/opening/reveals/countdown and original language popover retained. CSS now resolves four previously broken painted scene paths. Previously hidden information prose has editable localized persistence; footer note restored similarly.
- Full route registration, ready handshake, canonical localized preview wishes, authored-address Google fallback and status/context handling added. Shared identity/hosts/message/program/maps stay reusable. No sample provider data or storage served.
- 25 shared/package checks, three-viewport source/motion comparisons, four locales, long/empty/seven events/reduced/failed and preview checks, actual audio, source/personalized covers, real note save/reopen/studio/publication/public/maps/pending wishes and compatible switching, typecheck/build pass. Migrations 0199/0200 publish only Starry Night. Evidence: docs/templates/taklifla-audit/starry*.

## Terracotta integration

- Connected previously missing bridge while retaining exact source CSS/art/fonts, original opener, four botanical layers, 22 particles, parallax, shimmer and reveals. Full native timeline/wish markup retained. Editor/public/catalog share one real renderer.
- Added validated editable information/footer notes with canonical shared preview examples; shared names/date/greeting/message/hosts/program and Google venue drive source data. Canonical wishes/music remain preview-only. Failures retain input and translated status; moderated submissions require real API acknowledgement. No guest-count form.
- 25 shared/package checks, source/motion comparisons at 320/390/1280, four locales/long/empty/seven events/reduced/failure/preview checks, actual decoded audio, covers, real notes save/reopen/studio/publication/personalized public/maps/pending wishes and compatible switching, typecheck/build pass. Migrations 0201/0202 publish only Terracotta. Evidence: docs/templates/taklifla-audit/terracotta*.
