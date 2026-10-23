# Remaining source template assignments

Central coordination ledger for template integrations. Each source template has
one owner chat. Published templates are excluded from this queue. Shared
registry, migration, and catalog integration are reconciled centrally before
release. Keep source captures unchanged and keep incomplete templates private.
For every worker, require the captured template's original HTML, CSS, JavaScript,
fonts, art, opening sequence, animation choreography, and interactions to be
packaged faithfully; screenshots are comparison evidence, never implementation
substitutes. Verify original versus packaged source in a browser with normal and
reduced motion, and verify the catalog art shows the authentic opening.

## Existing assignments and workers dispatched 2026-10-23

| Template | Provider / exact source | Assigned chat | Status | Shared ID / migration | Verification / publication | Notes |
|---|---|---|---|---|---|---|
| Swan | Invitate / `Web invitations/invitate.uz/swan.html` plus manifest assets | Coordinator chat `01a16710-8b3c-7c83-90af-4f31ec3fb819` | In progress in shared checkout | `swan`; tentative migration 0120 after applied 0119s | Private; opening art and visual/API verification pending | Preserve concurrent edits; 0119 Swan is not applied. |
| Osh (`osh`) | Chorlove / `Web invitations/templates/osh/preview-frame.html`; app chunk investigation ongoing | `01a16708-7b50-7472-a55b-06f87964048c` | Active; source-component recovery in progress | Existing shared Chorlove ID only; no database row observed in prior check; do not allocate migration until coordinator reconciles | Unpublished; implementation incomplete | Earlier preflight claimed incomplete snapshot but worker resumed after finding Osh component/styles in captured Chorlove chunks and exact local image/font; re-review completeness and implementation evidence. |
| Palace Rose (`palace-rose`) | Chorlove / `Web invitations/templates/palace-rose/preview-frame.html` and 17 source images | `01a16708-9f96-7af3-934b-c0c0329310e4` | Source preflight only | Existing ID; migration file 0119 and DB registration applied, but conflicts by prefix with Swan | Registered, unpublished, not selectable; no renderer or authentic portrait art | Exact frame is server-rendered snapshot with site runtime and baked sample data. |
| Orchid Amplop (`orchid-amplop`) | Chorlove / `Web invitations/templates/orchid-amplop/preview-frame.html`, `Web invitations/images/templates/orchid-amplop/*`, shared component in `_next/static/chunks/0v0-3ulc~exde.js` | `01a16716-911f-7ed2-8383-4f170c55eb8b` | Isolated package and shared renderer route wired; source/package opener compared at 390×844 and 1280×800; normal-motion gate, gallery lightbox, gift expand/collapse, and package reduced-motion QA checked; DB migration applied | `orchid-amplop`; migration `0132_register_orchid_amplop.sql` confirmed applied; wedding category/event; unpublished | Not selectable or published; public catalog API excludes it | Gate entrance/exit, stagger, pulse, chevrons, hover/press, reveal thresholds/delays, icon paths, and music stacking are adapted from source. The gallery lightbox uses Web Animations tweens instead of source Framer Motion's default spring; browser-level source reduced-motion comparison remains pending. Full archive search confirms the six extra image references are absent. Metadata opening art includes sample names/provider UI; generated renderer screenshot contains a dev badge. No Orchid invitations exist for public/API smoke tests. |
| Palov (`palov`) | Chorlove / `Web invitations/templates/palov/preview-frame.html` plus `Web invitations/images/palov/palov.png`; component in `11~zi79p5fltu.js` | `01a16717-ea7c-79c2-9442-4395e3582844` | Isolated source package, renderer, typed registration, migration, focused checks, and browser source/package opening comparison complete; normal/reduced motion captures inspected at 480×1040 and desktop source/package captures compared | Typed ID `palov`; migration `0135_register_chorlove_palov.sql` applied; DB confirms `osh`/`osh`, 15,000,000 UZS, unpublished | Private pending creator save/publish/reopen and public route/API integration checks; optional source Instagram link cannot be mapped because shared invitation contacts have no Instagram field | Distinct from Invitate Palov (`invitate-palov`) and Chorlove Osh. Migration 0135 was applied directly under the advisory lock after confirming no existing Chorlove `palov` row and tracker through 0134. Catalog art was recaptured from the renderer with the canonical Osh title; hash is in provenance. |
| Whiteless | Invitate / `Web invitations/invitate.uz/whiteless.html` plus manifest assets | `01a1670b-18f8-7833-aeb6-aa0991b9624c` | Assigned; chat idle at last observation | Pending | Not registered | Continue existing chat; confirm whether idle means stopped and request progress. |
| Velvet | Invitate / `Web invitations/invitate.uz/velvet.html` + exact referenced source assets | `01a16711-01bf-73c3-bf96-d27005021b32` | Package, adapter, renderer and portrait cover integrated; focused 3/3, JS syntax, typecheck and build pass; manifest inventory confirmed page, CSS/JS, two videos, music and art assets | ID `velvet`; migration `0120_register_velvet_template.sql` applied; DB row remains unpublished | Private; full browser interaction, public route/save-reopen and real RSVP remain unverified | Preview route HTTP 200 locally, but IAB loopback navigation timed out/was denied; no published Velvet invitation exists. Documented intentional data/API changes and unresolved motion/browser parity in `IMPLEMENTATION_DECISIONS.md`; keep private. |
| Estelle | Invitate / `Web invitations/invitate.uz/estelle.html` + exact referenced source assets | `01a16711-1406-7712-8176-fe7da0239a90` | Source package and shared renderer integrated; portrait art/provenance added; static checks pass | `estelle`; migration `0132_register_estelle_template.sql` applied; DB confirms wedding, 15,000,000 UZS, unpublished | Private/unselectable; local browser and RSVP/wishes service verification still incomplete | Exact capture preserved. Local preview navigation timed out; do not publish until focused scratch/reduced-motion, locale/date and service checks complete. |
| Palov (Invitate) | Invitate / `Web invitations/invitate.uz/palov.html` + page-referenced artwork/fonts | `01a16711-2a77-7480-94f3-9baff58a8de2` | Isolated page/package and localized adapter prepared; focused package checks 3/3 and `node --check` pass | Reserved ID `invitate-palov`; tentative migration 0122 | Private; catalog art and renderer/API QA pending | Page explicitly describes Nahorgi osh. Category/event `osh`/`osh`. Separate from Chorlove `palov`; unrelated 0310 aggregate images/scripts excluded. |
| Nahorgi Osh (Invitate) | Invitate / `Web invitations/invitate.uz/nahorgi-osh.html` + source assets | `01a16711-4546-7211-b3f8-02e510fe1828` | Dispatched | Reserved ID `invitate-nahorgi-osh`; tentative migration 0131 | Pending | Distinct from Chorlove `osh` and Marxaba `nahorgi-osh`. |
| Fairy | Invitate / `Web invitations/invitate.uz/fairy.html` + exact referenced source assets | `01a16711-6c2f-73e1-9c87-3ee2daa122ed` | Dispatched; isolated package/adapter prepared | Reserved ID `fairy`; tentative migration 0123 | Pending source QA and registration | Worker reports shared contract busy; preserve concurrent edits. |
| Bloom | Invitate / `Web invitations/invitate.uz/bloom.html` + source assets | `01a16711-86e3-7421-8a1c-dba4a01e3443` | Renderer, local source package, and typed adapter implemented; real-renderer portrait cover captured | ID `bloom`; private migration `0126_register_bloom_template.sql` | Unpublished; typecheck and focused browser preview passed; broader release checks pending | Birthday only, based on source title/sections. |
| Golden Hour | Invitate / `Web invitations/invitate.uz/golden-hour.html` + source assets | `01a16711-b2be-7bc0-b485-eda0b7662c67` | Source package and shared Invitate renderer integrated; captured countdown/reveals/music toggle now adapted; focused checks and typecheck pass; full suite has unrelated concurrent failures | ID `golden-hour`; migration `0127_register_golden_hour_template.sql` applied | Private/unselectable; source-vs-app matching viewport and reduced-motion comparison is blocked/unverified | Birthday only. Full archive search found referenced `lanadel.mp3` but it is excluded as source sample media; referenced PHP endpoint is absent and replaced with shared RSVP API. No age field in contract, so fixed source age/slogan omitted. Browser policy blocked the captured `file:` URL and disallows alternate serving. |
| Wedding (Invitate) | Invitate / `Web invitations/invitate.uz/wedding.html` + source assets | `01a16712-65ad-78c0-967d-b08344d1702f` | Dispatched | Reserved ID `invitate-wedding`; tentative migration 0128 | Pending | Provider-scoped ID avoids colliding with other source templates. |
| Girls Party | Invitate / `Web invitations/invitate.uz/girlsparty.html` + source assets | `01a16712-8148-7463-bcbd-11ef668ab4b1` | Source package/typed renderer and authentic cover; matching normal/reduced browser captures; syntax/typecheck, four locales, reduced motion, preview RSVP guard pass | ID `girlsparty`; migration `0125_register_girlsparty_template.sql` applied, row unpublished and verified | Pending: timeline step-label/description fidelity gap, public-route parity, and real RSVP/wish persistence | Archive spelling is `girlsparty.html`; timeline gap blocks completion and selection. |
| Butterfly | Invitate / `Web invitations/invitate.uz/butterfly.html` + source assets | `01a16712-a2dd-7c70-b955-00e85f9ebd9e` | Isolated package, typed adapter/renderer, route integration, portrait art, and focused checks complete | ID `butterfly`; migration `0129_register_butterfly_template.sql` applied; DB row is wedding-only, 15,000,000 UZS, unpublished | Private/unselectable; product decision for unsupported sections, full app typecheck, and public save/reopen verification pending | Catalog DB check excludes it while unpublished; focused tests pass 3/3. |
| Safir | Invitate / `Web invitations/invitate.uz/safir.html` + source assets | `01a16712-bebd-7ca3-a370-f0420855a717` | Captured HTML/CSS/JS and assets preserved; typed adapter/renderer and clean portrait opening art staged; integrated React renderer showed all sections and passed all four locale handoffs and preview no-send check on temporary local route | ID `safir`; additive migration `0136_register_safir_template.sql` applied | Private/unselectable; typecheck, source JS hash, cover hash, and bridge syntax pass; matching viewport source/package comparisons in normal and reduced motion, production preview route, public save/reopen, mobile/desktop, and final release checks pending | Coordinator confirmed no DB row and unique next migration after 0135; migration applied under lock. Resumption browser comparison blocked because local browser automation is disabled. |
| Velora | Invitate / `Web invitations/invitate.uz/velora.html` + exact referenced source assets | `01a16712-4984-78d0-8120-202c15df2b20` | Source package and shared renderer adapter integrated; browser field/control pass complete | `velora`; migration `0124_register_velora_template.sql` applied | Private; typed catalog and DB both confirm unpublished; public-route/API save/reopen verification remains pending | 480×860 real renderer opening captured from the shared fixture and provenance recorded. Headless browser verified 6 agenda rows, 3 story items, 5 palette colors, RSVP empty validation, localized date/calendar, map binding, and reduced-motion preference. Font/art requests returned 200. Local HTML/CSS/JS/fonts/art are isolated; no captured video. No source gallery, gift/To‘yona, or wishes feed. |
| Invitate source set inventory | Invitate / manifest lists 27 capture pages; 26 page files exist in provider archive | Unassigned remainder after dispatched rows; see archive-name list below | Inventory pending | Check DB/catalog before assigning | Exclude published IDs; assign remaining complete sources singly | Additional captured names: celeste, afina, lovella, olive, miller, dream, beauty, aurora, amor, moonlight, blossom; reconcile registration/publication and other providers first. |

## Chat coordination notes

- The user requested exact one-template ownership. Existing chats remain owners
  even while idle; do not duplicate their template assignments.
- Previously active relevant chats: Swan/coordinator (`01a16710-...`), Osh,
  Palace Rose, and Whiteless. Palace Rose ended at source-preflight state; Osh
  is currently active again. Continue Whiteless rather than creating another
  Whiteless chat.
- The configured DB authorized migration/publication workflow remains in force.
  Never externally deploy or activate live payments.
- Migration-coordination note updated 2026-10-23: a direct read-only query
  confirms the configured database's `schema_migrations` log currently records
  through `0136_register_safir_template.sql`;
  the repository has several different migration files sharing numeric prefixes,
  so the old planned-sequence paragraph below this table was stale. Do not run
  the generic migration runner while unrelated files are pending. Check the
  actual database log and exact template row before each additive migration;
  central reservations must use a currently unused filename. Chorlove Palov is
  reserved `palov` / `0135_register_chorlove_palov.sql`; Invitate Safir is
  reserved `safir` / `0136_register_safir_template.sql` after a direct DB query
  confirmed no existing `safir` row.
- Every worker must report exact source folder/provider, implementation status,
  changed files, verification evidence, blockers, DB/publication state, and
  commit hash. Commit only scoped completed work, preserving concurrent edits.

## Active Chorlove source-fidelity repairs

Static archive-to-package review found source motion declarations not reflected
in the current bridges for these designs. The findings are preliminary; do not
claim a mismatch is resolved until each owner compares exact source/package
behavior in a real browser under normal and reduced motion and records the
result. Preserve captures and never use screenshots as implementation source.

| Template | Dedicated repair chat | Preliminary evidence / status |
|---|---|---|
| Glass Pink | `01a169fb-417e-7753-afba-7acd8644295c` | Source motion repair complete and committed as `a9a41c7c`; 450 ms pause, 600 ms fade, card/flower choreography and valid WAAPI easing restored. Normal/reduced-motion browser checks pass; focused tests 9/9. |
| Golden Card | `01a169fb-6383-7023-b91e-7567118fc11d` | Motion/typography repair complete at `d9935c34`; restored the 200 ms reveal delay, original Lobster font subsets, 34 sparkles/loops and close/reopen/reduced-motion states. Normal/reduced-motion browser checks pass; focused 5/5, syntax/diff checks pass. |
| Green Garden | `01a169fb-85ff-72c3-8233-2cec292a49ae` | Source motion/schedule-art repair committed as `5ae89fd2`; corrected WAAPI easing and restored source timing, hero reveal, schedule art and seven To’yona ornament loops. Focused 6/6, syntax/diff checks pass. Final browser verification after the edits is unavailable; two source-referenced leaf ornaments remain absent, so do not claim parity complete yet. |
| Green Gold | `01a169fb-9fc0-7ec3-8e15-c308dd3e8741` | Source-motion repair committed as `66c21afd`; restored five-part opening, section/date/countdown/gallery reveals, 18 ornament rotations, 30 starbursts and wishes loop, with reduced-motion and gallery lightbox behavior. Focused motion test, both JS syntax checks and scoped diff check pass. Broader suite remains unresolved due archived absolute-path and shared CSS byte-count expectations; unpublished pending portrait cover and release checks. |
| Green White | `01a169fb-baf3-76d3-ac4a-bb6df9d6ed1e` | Motion repair committed as `fb07ddef`; restored the two-curtain opener (1450/1650 ms), label/name card timeline, hero art, 42-star and 11/13s cloud loops, source-specific reveal thresholds and reduced motion. Focused 5/5 and syntax/diff checks pass. No authentic catalog-cover asset exists yet; keep incomplete/private until one is captured. |
| Jasmine White | `01a169fb-db26-7c30-85d3-10f329ca34a0` | Source-motion and gift-modal repair committed as `c862128b`; restored exact opener/card/flower, petal, heart, sheen, hero/reveal, and seven gift-flower timing/transforms. Browser checked hero/petals and modal open/close; syntax/provenance/diff pass. TypeScript check timed out (not passing evidence). Authentic catalog cover is still missing; template remains private/incomplete. |
| Lace | `01a169fb-f197-72d2-b627-cb7b38963280` | Source-motion repair complete at `862e8d7b`; restored poster fade/opening, 2s overlay removal, hero names delay, 0.9s section reveals and 0.6s/0.05s program-row stagger with source thresholds, plus reduced motion. Browser normal/reduced checks pass; focused 3/3, no console warnings/errors. |
| Love Sakura | `01a169fc-09a2-7de1-b3ce-e14c2209ef8d` | Source RSVP/motion repair is in mixed commit `32fe08c6` with Luxury Gold changes. Restored the 0.6s fade/15px rise, source music-button motion, RSVP API wiring and locale-safe rerender. Focused 3/3, JS syntax and clean browser preview pass. Official catalog cover is absent; keep incomplete/private. |
| Luxury Gold | `01a169fc-3b6b-7531-b212-fd008d9b1cb1` | Source-motion repair is in mixed commit `32fe08c6` with Love Sakura changes. Restored opening/14-section reveals, hero zoom, calendar, sheens, stars/ornaments/hearts, sparkle canvas, gallery/lightbox and reduced-motion interactions. Focused 3/3, JS syntax/diff and source-opening preview pass. No dedicated catalog cover; remain unpublished/open. |
| Modern Floral | `01a169fc-598b-7ca3-a1da-fdb28bb6e1ce` | Source-motion repair committed as `633e4f0d`; restored curtain/greeting/fade, 34 petals, viewport/stagger reveals, decorative loops, lightbox/control feedback and reduced motion. Focused 3/3, syntax and preview-image HTTP 200 pass. Authentic 810×1754 source opening is packaged at `catalog-opening.jpg` (SHA-256 `6c4de03a01ba15e3b462a519f34f3ad90a87b34851372a4f868aa0381e2052dc`); typed preview path is present in the current working tree but was not included in the worker commit. Browser visual comparison timed out, so exact parity is unverified and the template stays unpublished. |
| Palace Rose | Existing owner `01a16708-9f96-7af3-934b-c0c0329310e4` | 127 source motion markers; bridge scan found no Web Animations `.animate()` calls. |

Existing Chorlove Osh, Orchid Amplop, and Palov owners were asked to include
source motion parity in their completion gates. Cloud Castle's motion repair is
committed as `e3a9f28c`; its archive still lacks the original component/runtime,
so that source limitation remains explicit.

## Archive/provider inventory remains open

Manifest/page inventory captured 2026-10-23. These are captured-page counts,
not eligible template totals; sample invitations, repeated listing pages, and
already-published designs still require reconciliation before assignment.

| Provider | Captured pages | Inventory note |
|---|---:|---|
| Chorlove | 28 | Distinct design slugs; some share event types. Search shared chunks for complete source components. |
| Invitate | 27 | Mixture of source designs and sample invitation pages; exact template source names reconciled in the assignment rows above. |
| Invitio | 9 | Nine listed design pages. |
| Marxaba | 46 | Includes existing registered and published IDs; avoid re-auditing published templates. |
| Mytaklif | 3 | Captured invitation examples, template eligibility not yet confirmed. |
| OnlineTaklifnoma | 11 | Design pages, many already registered in the current catalog. |
| Taklifiy | 16 | Repeated live-demo pages, not necessarily 16 distinct source designs. |
| Taklifla | 24 | Invitation examples; template eligibility not yet confirmed. |
| Taklifnomachi | 8 | Invitation examples; template eligibility not yet confirmed. |
| Wedivo | 156 | Large design archive; extract distinct source templates and reconcile by ID. |
| Wedvitation | 28 | 28 distinct listed designs. |
| Yoryor | 48 | Repeated invitation examples; template eligibility not yet confirmed. |
| Yumevite | 57 | Design pages; reconcile actual template source folders. |

The E-invitation folder has no `capture-manifest.json`; inspect its actual source
directories and any nested manifests. Continue reconciling every provider,
including all To'yona-capable designs, against the configured DB and public
catalog. Do not infer that work is exhausted from manifest page counts or
template-category names; inspect each exact source folder and current
registration/publication first. Include To'yona as a supported feature in every
applicable template adapter, mapping only approved contract fields and keeping
empty optional details hidden.

- 2026-10-23 continuation: Estelle's exact source paths resolved to Invitate/Web invitations/invitate.uz/estelle.html, assets/css/estelle.css, assets/js/estelle.js, fonts and Adelina artwork listed in the capture manifest. Isolated source package and typed renderer adapter are present; unpublished pending final full-fidelity verification, clean portrait artwork, and migration sequence assignment.

