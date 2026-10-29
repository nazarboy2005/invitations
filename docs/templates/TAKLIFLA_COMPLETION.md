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
| Midnight Palace | taklifla-tungi-saroy | Published | Pending audit |
| Tovus | taklifla-tovus | Published | Pending audit |
| Barakali | taklifla-barakali | Private package | Pending |
| Bookie Navy | taklifla-yubiley-sahifasi | Private package | Pending |
| Bookie Terracotta | taklifla-fayzli-xonadon | Private package | Pending |
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
