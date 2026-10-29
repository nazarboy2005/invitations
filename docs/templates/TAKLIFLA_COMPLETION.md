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
| Ertak | taklifla-ertak | Private package | Pending |
| Garden Arch | taklifla-gulbog | Private package | Pending |
| Marigold | taklifla-zarrin-gullar | Private package | Pending |
| Mountain | taklifla-toglar-bagrida | Private package | Pending |
| Oltin Yo‘l | taklifla-oltin-yol | Private package | Pending |
| Osmon | taklifla-osmon | Private package | Pending |
| Pari | taklifla-parilar-ertagi | Private package | Pending |
| Qog‘oz | taklifla-qogoz-ertagi | Private package | Pending |
| Sakura | taklifla-sakura-guli | Private package | Pending |
| Sharlar | taklifla-sharlar | Private package | Pending |
| Starry Night | taklifla-yulduzli-tun | Private package | Pending |
| Terracotta | taklifla-terracotta | Private package | Pending |
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
