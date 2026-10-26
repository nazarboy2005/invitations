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
| Osh (`osh`) | Chorlove / `Web invitations/templates/osh/preview-frame.html` and matching source chunk | `01a16708-7b50-7472-a55b-06f87964048c` (continuation `01a17489-18bb-7aa2-a7e6-3144de68c941`) | Count-free RSVP and Instagram mapping `7910fb45`; exact woven `osh-suzani` SVG restoration `8fa0bb24`; source capture/chunk and 778×1686 cover hashes match provenance. Post-fix comparison of original capture/source chunk with `/preview?template=osh` at 1280×720 confirms woven opening, layout/type/timing align; missing hidden `osh-suzani` SVG was restored in `8fa0bb24`. Reduced-motion browser confirms 0.01ms effects with artwork visible. Fonts/assets and authentic 778×1686 cover hash match; shared fixture/creator renderer is used. Source has no schedule/gift/wishes/gallery/story/venue photo; `.osh-photo` retains its source-owned Palov illustration when no creator image is uploaded. Preview-image audit commit `389f85e0` verifies the 778×1686 cover and empty sample gallery; focused suite 4/4 and diff pass. | Registered via `0119_register_chorlove_osh.sql`; local typed fallback is published; migration `0140_publish_chorlove_osh.sql` prepared | The checkout has no `DATABASE_URL`; `/api/catalog` reports `configured=false`, so configured-database publication is pending migration `0140`. RSVP payload remains fixed 1/0. |
| Palace Rose (`palace-rose`) | Chorlove / `Web invitations/templates/palace-rose/preview-frame.html`, 17 source images and six font variants | `01a16708-9f96-7af3-934b-c0c0329310e4` (sole active code owner) | Package, typed cover pointer and shared preview/creator/public iframe routes are present; 17 source images and six font variants match archive hashes; 450×800 source-opening cover verified; four gift files match other archive assets and four have exact-URL hashes | `palace-rose`; registration exists, prior configured DB check recorded unpublished; current DB state unavailable | `455d5a46` aligns source scroll/modal structure and reveals; `729cfa7e` records source/package close, backdrop, inside-click, and copy checks. Focused suite 5/5. Private; creator save/reopen, public rendering and enabled receipt content remain unverified. | Source includes native To’yona flow; source does not close the modal on Escape. Package Escape/ARIA semantics are accessibility additions. Keep source-absent story/dress/extra-people sections hidden.
| Orchid Amplop (`orchid-amplop`) | Chorlove / `Web invitations/templates/orchid-amplop/preview-frame.html`, route chunk `_next/static/chunks/0v0-3ulc~exde.js`, eight archive-local and seven recovered-URL images | `01a16716-a961-7702-9a09-af726672d4fe` | Source opener/package compared at 1280×720; hero prayer/blessing/kicker/names/date and typography align. `4421dfa09` adds provider reset, internal viewport scroller, source story/event/lightbox styling and divider structure. Follow-up `fa8f222bf` removes extra story headings, restores 24px inherited line-height, matches 18px story gap, and restores scrollbar width. A temporary local proxy served the seven source URLs from exact-hash-verified package bytes; with matched fixture content, source/package content width is 1265px and all nine section starts/heights match at 1280×720: starts 0,767,1763,2910,3944,4953,5296,6893,7351; total scroll height 7850px. Package browser check opened all major sections/social links/six gallery cells and showed lightbox close control. All 16 image and nine font hashes plus source CSS hash match; bridge syntax, provenance JSON, web typecheck, and scoped diff checks pass. Commit `8d6c3ac93` adds six source gallery images, story portraits, couple portraits, venue backdrop and localized story text only to the preview sample. Actual catalog preview loads all source media; creator/public views hide the gallery and contain no source sample photos. `tests/orchid-preview-media.test.ts` passes 2/2. Shared contact contract has invitation-wide links only; same contacts appear on both profiles/footer. | `orchid-amplop`; migration `0132_register_orchid_amplop.sql` applied; prior configured DB check showed unpublished | Keep unpublished; save/reopen and public-render lifecycle remain unverified.
| Palov (`palov`) | Chorlove / `Web invitations/templates/palov/preview-frame.html` plus `Web invitations/images/palov/palov.png`; component in `11~zi79p5fltu.js` | `01a16717-ea7c-79c2-9442-4395e3582844` (continuation `01a17489-18bb-7aa2-a7e6-3144de68c941`) | Full source audit: capture SHA256 `c10ef41d93f785d81fe8176d6040160bfbf832b7d01f082224932183bd920ee6`; chunk `11~zi79p5fltu.js` SHA256 `05765da53e7ff4363f684be2ebcc35b671df705136339e985e297ff91ff458df`; source CSS SHA256 `09c287841b1ef87f6e62629ac3e325532ac2779897c2c1685eaa58e933dcbea8`; all 22 packaged font hashes and source plate asset hash `6ff6955eb9f53d994f4f9052f3c000201a2e0a364a16c295990f5224399f8077` match provenance. Catalog cover `catalog-opening.png` is 480×1040, SHA256 `e357099ddf3ad0df4124bbae17d80c0f98f5f6376a9895d677f019bdb558a96a`, showing localized Nahorgi osh opening/art. Source has only the source-owned plate illustration, no separate gallery/story/venue photo, and no template-specific gallery sample; the cover excludes source demo data. Matched source/package desktop and 390×844 opening/section flow; hero/reveal timing and reduced-motion behavior checked against source. Focused 4/4, bridge syntax and web typecheck pass. Guest-count prompt omitted per requirement; RSVP submission and external playback not exercised. | Typed ID `palov`; registration `0135_register_chorlove_palov.sql` and publication `0139_publish_chorlove_palov.sql` applied; prior configured DB/catalog check confirmed published at 15,000,000 UZS, category/event `osh`/`osh`; current checkout has no DB config, so fresh DB verification unavailable | Already published through configured catalog; publication state left untouched | Distinct from Invitate Palov (`invitate-palov`) and Chorlove Osh. No external deployment or payment activation. |
| Whiteless | Invitate / `Web invitations/invitate.uz/whiteless.html` plus manifest assets | `01a1670b-18f8-7833-aeb6-aa0991b9624c` | Assigned; chat idle at last observation | Pending | Not registered | Continue existing chat; confirm whether idle means stopped and request progress. |
| Velvet | Invitate / `Web invitations/invitate.uz/velvet.html` + exact referenced source assets | `01a16711-01bf-73c3-bf96-d27005021b32` | Package, adapter, renderer and portrait cover integrated; focused 3/3, JS syntax, typecheck and build pass; manifest inventory confirmed page, CSS/JS, two videos, music and art assets | ID `velvet`; migration `0120_register_velvet_template.sql` applied; DB row remains unpublished | Private; full browser interaction, public route/save-reopen and real RSVP remain unverified | Preview route HTTP 200 locally, but IAB loopback navigation timed out/was denied; no published Velvet invitation exists. Documented intentional data/API changes and unresolved motion/browser parity in `IMPLEMENTATION_DECISIONS.md`; keep private. |
| Estelle | Invitate / `Web invitations/invitate.uz/estelle.html` + exact referenced source assets | `01a16711-1406-7712-8176-fe7da0239a90` | Source package and shared renderer integrated; portrait art/provenance added; static checks pass | `estelle`; migration `0132_register_estelle_template.sql` applied; DB confirms wedding, 15,000,000 UZS, unpublished | Private/unselectable; local browser and RSVP/wishes service verification still incomplete | Exact capture preserved. Local preview navigation timed out; do not publish until focused scratch/reduced-motion, locale/date and service checks complete. |
| Palov (Invitate) | Invitate / `Web invitations/invitate.uz/palov.html` + page-referenced artwork/fonts | `01a16711-2a77-7480-94f3-9baff58a8de2` | Isolated page/package and localized adapter prepared; focused package checks 3/3 and `node --check` pass | Reserved ID `invitate-palov`; tentative migration 0122 | Private; catalog art and renderer/API QA pending | Page explicitly describes Nahorgi osh. Category/event `osh`/`osh`. Separate from Chorlove `palov`; unrelated 0310 aggregate images/scripts excluded. |
| Nahorgi Osh (Invitate) | Invitate / `Web invitations/invitate.uz/nahorgi-osh.html` + source assets | `01a16711-4546-7211-b3f8-02e510fe1828` | Dispatched | Reserved ID `invitate-nahorgi-osh`; tentative migration 0131 | Pending | Distinct from Chorlove `osh` and Marxaba `nahorgi-osh`. |
| Fairy | Invitate / `Web invitations/invitate.uz/fairy.html` + exact referenced source assets | `01a16711-6c2f-73e1-9c87-3ee2daa122ed` | Isolated source package, shared renderer, authentic 480×850 cover; focused checks 3/3, typecheck and source normal-motion comparison complete | Published by `0144_publish_invitate_fairy.sql`; 15,000,000 UZS, wedding category/event | Published; authenticated creator save/publish/public-render/reopen integration passes 1/1 | RSVP/wishes deferred; user will manually review reduced-motion comparison. No external deployment. |
| Bloom | Invitate / `Web invitations/invitate.uz/bloom.html` + source assets | `01a16711-86e3-7421-8a1c-dba4a01e3443` | Renderer, local source package, and typed adapter implemented; real-renderer portrait cover captured | ID `bloom`; private migration `0126_register_bloom_template.sql` | Unpublished; typecheck and focused browser preview passed; broader release checks pending | Birthday only, based on source title/sections. |
| Golden Hour | Invitate / `Web invitations/invitate.uz/golden-hour.html` + source assets | `01a16711-b2be-7bc0-b485-eda0b7662c67` | Source package, authentic portrait cover, focused suite 5/5, web typecheck, normal-motion source comparison at 390×844 and 1280×720, and creator save/publish/public-render/reopen lifecycle pass | Published by `0146_publish_invitate_golden_hour.sql`; birthday category/event, 15,000,000 UZS | Published to configured catalog; human reduced-motion review remains available as follow-up | Birthday only. Demo age/tagline/signature omitted; shared birthday preview swatches differ from source demo palette. Console clear on source/app comparison. Archive soundtrack retained for audit, not creator media; missing PHP endpoint uses shared RSVP API. No external deployment. |
| Wedding (Invitate) | Invitate / `Web invitations/invitate.uz/wedding.html` + source assets | `01a16712-65ad-78c0-967d-b08344d1702f` | Dispatched | Reserved ID `invitate-wedding`; tentative migration 0128 | Pending | Provider-scoped ID avoids colliding with other source templates. |
| Girls Party | Invitate / `Web invitations/invitate.uz/girlsparty.html` + source assets | `01a16712-8148-7463-bcbd-11ef668ab4b1` | Source package/typed renderer and authentic cover; matching normal/reduced browser captures; syntax/typecheck, four locales, reduced motion, preview RSVP guard pass | ID `girlsparty`; migration `0125_register_girlsparty_template.sql` applied, row unpublished and verified | Pending: timeline step-label/description fidelity gap, public-route parity, and real RSVP/wish persistence | Archive spelling is `girlsparty.html`; timeline gap blocks completion and selection. |
| Butterfly | Invitate / `Web invitations/invitate.uz/butterfly.html` + source assets | `01a16712-a2dd-7c70-b955-00e85f9ebd9e` | Source package, typed adapter/renderer, portrait art, focused checks 3/3, and web typecheck complete | Published by `0143_publish_invitate_butterfly.sql`; 15,000,000 UZS, wedding category/event | Published; authenticated creator save/publish/public-render/reopen integration passes 1/1 | Source-absent sections remain hidden per user decision; RSVP/wishes deferred; user will review the documented reduced-motion gate difference manually. No external deployment. |
| Safir | Invitate / `Web invitations/invitate.uz/safir.html` + source assets | `01a16712-bebd-7ca3-a370-f0420855a717` | Captured HTML/CSS/JS and assets preserved; typed adapter/renderer and clean portrait opening art staged; integrated React renderer showed all sections and passed all four locale handoffs and preview no-send check on temporary local route | ID `safir`; additive migration `0136_register_safir_template.sql` applied | Private/unselectable; typecheck, source JS hash, cover hash, and bridge syntax pass; matching viewport source/package comparisons in normal and reduced motion, production preview route, public save/reopen, mobile/desktop, and final release checks pending | Coordinator confirmed no DB row and unique next migration after 0135; migration applied under lock. Browser retries on 2026-10-24 and 2026-10-25 timed out (`cua.getState`, max 15s today). No comparison capture or authenticated non-RSVP save/reopen evidence. Last DB check on 2026-10-24 was `published=false`; current recheck unavailable because `apps/web/.env.local` is absent in this session. Keep unpublished. |
| Velora | Invitate / `Web invitations/invitate.uz/velora.html` + exact referenced source assets | `01a16712-4984-78d0-8120-202c15df2b20` | Source package/adapter, authentic portrait opening, focused suite 8/8, typecheck and source hashes pass | Published by `0145_publish_invitate_velora.sql`; 15,000,000 UZS, wedding category/event | Published; authenticated creator save/publish/public-render/reopen passes 1/1 | Manifest screenshot is absent; user will manually review source/package visuals and reduced motion. RSVP submission was not exercised. No external deployment. |
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
| Cloud Castle | `01a16a08-89c2-7110-8767-0e7648fa0f3f` | Source-motion fixes `6a969c9`, `d7e1e7de`, and burst-observer exclusion `90dd3d2`; opening/hero integration `4d828214`; live source comparison `c59551992`; trigger assertion `1f66d0a9`; dialog sizing/focus `f464a960`; contact hover/press spring `c671712c`; source gallery/font package updates are also in mixed commit `ceed8f54b`. The gift overlay explicitly uses 100vw (avoiding scrollbar-reduced width) and focuses the dialog container rather than the close button. Owner compared dialog width at 390px and 768px; it matches source and adds no close-button focus ring. Recovered capture (`preview-frame.html`, SHA-256 `b5c3324d0bd44c0a925a873a671f8a643f1e3cde10b870a6a5ffd699dcf476a7`) and component module 909129 (SHA-256 `81f9356f44be09216be952fd5a90739b0796f8825c9c7c398479b3d8205cee6b`) are present. Matched source/package opener checks at 375×844, 390×844, 768×844 and 1280×720 show matching artwork, typography, and composition; longer platform fixture names change title wrapping/content bounds. At 768×844, the schedule was scrolled away to contacts then back for a matched reveal check. At ~80ms heading opacity was source .993032/package .981994; by ~480ms both were 1. End geometry matched within 0.1px (y=394.09/394.18; width 719.2px), with the same Times New Roman 24px and 2.4px letter spacing and floral/table composition. Three source demo rows vs six canonical preview rows change timeline height. The gift modal at 375px now matches the source viewport width, and at 768px both cards reach the same max width with matching close icon/focus appearance. All 21 images and seven active fonts hash-match; both shared CSS chunks match after line-ending/font-URL normalization. Cover is authentic 720×1280 (9:16) post-envelope hero. Burst bug fixed: generic reveal observer matched particle inline opacity strings and replaced source's 850ms [initial,1,0] ease-out fade with 480ms [initial,1]; selector now excludes `.cc-source-petal`. Matched-time source/package opacity at ~56/192/328/570ms: .67975/.678985, .873766/.87309, .892045/.893493, .304717/.305692. Ambient opacity remains static at .592831; sway/repeat/delay also source-matched. Embedded source capture's five story images are sample content; `ceed8f54b` packages five source gallery files; `b09bac245` adds the six-image `templateSamples.cloud-castle` mapping used only in blank-selection previews. The live full preview loaded all five images; empty creator/public galleries remain data-driven and hidden. Commit `9eed674b8` restores the source venue map iframe conditionally from creator latitude/longitude; `50eefbd0` targets the exact captured source map section. Browser QA with temporary coordinates 41.2995, 69.2401 rendered a live Yandex marker. Map frame is 560×380 at desktop and 327×280 at mobile before the source reveal transform. No fixed demo coordinates were added. Focused Cloud Castle suite passes 11/11. At matched 375×844, venue, countdown, program, wishes, RSVP, gift, and contacts sections were opened, scrolled away from and re-entered; shared typography, ornaments, forms, and reveal end states aligned. Source demo content has three program rows and fixed guest/contact details; platform preview has six program labels and conditionally hides optional gallery/map/contact details when creator data is absent, so section content/height may differ by fixture. `c671712c` restores contact-link hover scale 1.03/lift 2px and press scale .98 using the source default spring (stiffness 500/damping 25/restSpeed 10), with reduced-motion suppression and keyboard/touch handling. Cloud Castle focused suite passes 11/11 after preview media; bridge syntax passes. `ceed8f54b` also includes Lace and Luxury Gold owner files from a shared staged index; follow-up commits isolate the subsequent renderer/fixture corrections. The opening and gallery checks pass; full page comparison remains open. This latest interaction patch remains browser-unverified because the browser controller could not identify Chrome’s active URL; the full-page mobile/desktop comparison remains open. Reduced-motion QA (`qaReducedMotion=1`) immediately removes the envelope, makes reveal content static and suppresses ambient/gift ornament motion. The archived shared Motion runtime `0ceoe4zwq362f.js` sets `reducedMotion:"never"`, so the source has no OS reduced-motion mode; reduced motion is the platform's required accessibility accommodation. No extra responsive style/layout mismatch found at tested widths. The 1280×720 paired opening transitions into matching full-screen cloud art/typography/composition, and reduced-motion controls/sections load immediately. Full-page image-loading and source comparison remain open; published state unchanged. |
| Glass Pink | `01a169fb-417e-7753-afba-7acd8644295c` | Modal/timeline source fix `044af9ad`; schedule parity `258d8f75`; gift glyph `2a87e1ee`; guestbook/venue `e65b2506`; modal easing/detail `bec251db` / `89d5757`; preview media `4a03fed3` / `42c23522`; modal closeout `ac8f11a93` | Source and package gift modal compare at 1280×720: centered 448px card, 402px height, matching content. Source card motion is 250ms opacity/scale/y; package uses matching 250ms opacity/transform and 300ms overlay fade. The slight x-coordinate difference follows the package iframe's scrollbar-reduced content width. Six source-identical gallery photos appear only in preview; creator gallery remains empty. Focused suite 19/19; no source-backed mismatch found. Source has no OS reduced-motion branch; package accessibility mode is verified with `qaReducedMotion=1`, but browser OS preference could not be toggled. | Published state unchanged; no catalog change. |
| Golden Card | `01a169fb-6383-7023-b91e-7567118fc11d` | Motion/source alignment `138974e4`; long-title clear-band fix `5c1b19e7`; regenerated fitted cover `a9248d81` | Published by `0093_publish_golden_card.sql`; preserved source HTML SHA-256 `75ac0b6d0edd52500a4a24cc15ed001fa6a0230571ce461a33859703180cc888`, compiled component chunk SHA-256 `f054bd58d6153468c79967a1906e68bb69171b61e76f4e45f914cd1ad627b653`, and extracted source CSS SHA-256 `7435a8f8b32dc186457ef1052ae0729fcfed9026a8c3a755746cbc7bdc0bd4a7`; all three source images match packaged bytes. Opening dimensions and choreography remain source-aligned; the long canonical title stays within the 48% center band. Catalog cover `preview-browser-capture.jpg` was regenerated from the live shared renderer at 335×469; the full opening card and CTA are visible, and the title clears both ornaments (SHA-256 `9c65c2a0a06e0d2cb2d8a1da195a60323dde99fdaddaad946da1b90df4e33561`). Normal/reduced-motion states were checked; focused suite 6/6 and bridge syntax pass. Preview-image audit: exact source capture and component/CSS reference only opening mandala/corner art; no gallery, story, venue-photo, or optional photo section exists. Source artwork is packaged and the 335×469 live-rendered catalog cover contains no placeholder photo slots; there is no empty uploaded-photo section to hide. Focused `tests/golden-card-template.test.ts` rechecked 6/6, bridge syntax and scoped diff pass. No source-backed opening, motion, style, or cover issue remains. No migration/publication action repeated; RSVP service deferred. |
| Green Garden | `01a169fb-85ff-72c3-8233-2cec292a49ae` | Source fidelity commits `040dc828`, `b60d4ad6`, `88728b16`; opening timing `3a543cdd`; calendar/empty-status fix `ccb54894`. Recovered archive capture/module hashes and all 15 images/3 fonts match package; seven To’yona ornament motion tuples match source. Restored source guestbook/gift/RSVP (fixed party size 1/0); source has no dress-code section. Opening cover remains the authentic 432×768 full-viewport capture of the archived source, SHA-256 `5f87cee9d7efba25b614008054aa1965c5df7f611e6e0c5f68367745c1d22b11`. Matched normal-motion browser run at 432×768: source/package opening bounds 432×768, card 310×430.375, button 190.078×48, same names, 12 petals; petal delay/duration/fall/rotation/fade match after `3a543cdd`. Full-page static-DOM geometry at 432×768 after loading fonts/equivalent data: hero 650.4px, calendar 941.5px, program 429px, wishes 952px vs 951px, RSVP 351.5px, gift 390px, contacts 438px. `ccb54894` restores calendar subtitle/month heading and hides empty API status nodes. Catalog/blank-selection preview now supplies the six captured Orchid Amplop gallery photos in source order plus the exact captured Unsplash venue photo; both are confined to templateSamples and hidden from empty creator/public data. The venue asset is 355,870 bytes, SHA-256 `ef71550b3110fe9d17b3c49c7deccb7ff93a34c9fe0e79d6079fe34e140b1a55`. Commit `d12ac401` restores the source gallery 3.5s autoplay, 500ms 3D position formula/opacity/scale tiers, and lightbox pause/resume, using creator-authored photos only. A 432×768 browser run observed index 0→1 after 3.5s, modal pause through 3.6s, and resume after close. Generic and schedule item reveals now reset offscreen and replay on re-entry; schedule time/marker/title are observed individually because their source list row is `display:contents`. Browser checks confirmed calendar and schedule re-entry; reduced-motion had zero running animations and no auto-advance after 3.6s. Source route chunk was fetched from the captured-source server (HTTP 200, 69,437 bytes, SHA-256 `2c9968ae8a5d482044e5595df02cb26da2181d1e307f6a3c444e137ae0789e76`). Green Garden focused and shared preview tests pass 11/11 and 19/19; web typecheck, bridge syntax pass. Package media commit `bc9e8c403` is path-scoped and verified; the shared preview mapping and renderer integration are included in `b09bac245`; focused preview/media tests pass 11/11 and the combined preview suite passed 95/95. Source capture still throws hydration error #418, so motion was verified against hash-pinned source code and package browser behavior, not live hydrated source screenshots. The previous empty-gallery/venue fixture height comparison is superseded by the source-matched preview sample; creator/public data remains photo-free unless authored. Rechecked 2026-10-26; expanded two-root audit committed as `8e446ffa5`: canonical leaf URL returns HTTP 404 (0 redirects; text/html, 39,311 bytes); all five source/package refs remain. Exact recursive search across both complete roots (`D:\Projects\Invitations` and the project `Invitations - this folder will be removed from production`) found only the distinct Glass Pink same-name image. Alternate-name visual audit covered 184 unique transparent botanical raster candidates across both roots, deduplicated by SHA-256; no source-identical or confidently equivalent image was found. No substitute was packaged. Archived preview route returns 200 but Chromium still reports React #418 after 2.5s; SSR text remains and live hydrated visual parity is unavailable. Prior configured DB/catalog records published; fresh DB unavailable. |
| Green Gold | `01a169fb-9fc0-7ec3-8e15-c308dd3e8741` | Source interaction `505d72c9`; inventory `abd146a4`; source sections `938af515`; gallery motion `d03036ab9`; related motion/divider/RSVP commits; responsive gallery binding `c5c8e8eaf` | `938af515` suppresses generic dress-code/story/extra-people sections absent from the 13-section source; tests 9/9. `d03036ab9` replaces the gallery’s 300ms ease-out approximation with the captured 300ms cubic opacity curve and 550/30 spring, including image/dialog exit. At 390×844, source/package settle to 367×550; at 120ms opacity .795/.793 and by 240ms both are 1; both dialogs are gone by 400ms on close. First 40ms differs (.336/.214), so exact initial-frame parity is not claimed. Opening matches; cover hash verifies. The six source preview photos hash-match both complete Chorlove trees and the packaged Orchid assets. `c5c8e8eaf` fills all 12 responsive gallery buttons; focused suite 9/9, syntax and provenance checks pass. `b09bac245` commits the six URLs in `templateSamples.green-gold`, maps them only through the preview renderer, and keeps authored gallery data separate. Expanded Green Gold plus shared preview suite passes 29/29. Archive hydration #418 and missing/CORS resources limit live motion evidence; unpublished. Unpublished.
| Green White | `01a169fb-baf3-76d3-ac4a-bb6df9d6ed1e` | Gallery/assets repair `20a5272a`; centered thumbnails `c178967c`; transitions `794527c9`; slide cleanup `673347b3`; slideshow controls `883b656f`; timer and handler tests `7376eff2` / `cd630ef8`; cover pointer `c348977b`; drag repair `de5b35a6a`; preview-only source gallery `210880174` | Six source-identical images load in the shared preview fixture only; empty creator/public gallery stays hidden. Source-rendered cover `/templates/green-white/preview-opening.png` verified at 430×573. Opening curtain/title/petals and source route reveal timings align with source. Live 1280×720 normal-motion drag advanced 1/6→2/6. Reduced-motion preview verified localized dates/content in English, Russian, Uzbek Cyrillic, and Uzbek Latin; previous/next wrap, direct next/previous, and thumbnail 6 selection; gallery fade is 0ms and Play is disabled. Focused suite 10/10; JS syntax and scoped diff pass. | Unpublished (`published=false`); creator save/reopen and public lifecycle remain open. |
| Jasmine White | `01a169fb-db26-7c30-85d3-10f329ca34a0` | Source-motion/gift-modal repair `c862128b`; contract correction `db3f0c1e`; exact archive test `8a392e57`; mobile hero binding `015490a3`; desktop date binding `da5d1305`; petal and source preview media `09773832` | `015490a3` maps event/host fields while preserving source paragraph order and date/time labels. `da5d1305` fixes desktop date targeting: the bridge now selects the captured date span instead of the greeting paragraph. At 1280×800 with matching fixture and source assets, envelope cards both measure 600×412 at x340/y194; hero headers match at 1278×800; couple name rectangles and 54px Great Vibes typography match; first section starts y801. Focused source test 1/1, bridge syntax, formatting and scoped commit checks pass. The 12 source petal records now match field-for-field. Browser samples phase-matched at 5,637 ms confirm source-level ease-in-out with linear opacity keyframe segments; opacity differs by 0.00014 and rotated glyph bounds by less than 0.02 CSS px. Initial opacity/position, inherited 19.8px line-height, and source stacking are aligned. Jasmine catalog preview now loads the four exact archive gallery photos (all source SHA-256s are pinned in SOURCE_ADAPTATIONS.md) and the captured venue image; creator/public empty-gallery hiding remains in the bridge. Focused Jasmine and preview-sample tests pass 20/20; scoped package/test commit `09773832` passes commit checks. Shared preview fixture and Chorlove renderer integration are included in `b09bac245`; the combined source/preview suite passed 95/95. Browser route `/preview?template=jasmine-white` loaded all five source photos. Public save/reopen/catalog integration unavailable without DB/auth/session configuration; no publication attempted. Keep lifecycle gate open.
| Lace | `01a169fb-f197-72d2-b627-cb7b38963280` | Source-motion repair `862e8d7b`; gallery imagery/control match `208fb9e7`; focus/backdrop behavior repair `5e5fb3508` | Source opening, curtain, hero names, 0.9s section reveals and program stagger are preserved; reduced mode opens immediately, keeps rows visible and pauses videos. At 390×844 cover/schedule layout align; source and package gallery order, toolbar, thumbnails, slideshow timing and controls were compared; prior package browser run verified `1 of 6`, settled 2× zoom, next to `2 of 6`, thumbnail 6 selection, and normal close/Escape/backdrop behavior. Latest source-browser pass verified keyboard focus cycle/return, zoomed pan, image-click stays open, slide-backdrop closes, and centered five-item thumbnail rail. `5e5fb3508` adds source-matched focus return and backdrop hit testing. The newest package iframe failed to initialize in CUA (bridge resource itself returned 200), so fresh live package comparison of these new interactions remains unverified; regression assertions cover the source behaviors. Focused Lace suite passes 11/11; JS syntax and scoped diff checks pass. Six source gallery URLs remain in `templateSamples.lace` only (`b09bac245`); authored gallery replaces them. Creator/public lifecycle remains open; unpublished. |
| Love Sakura | `01a169fc-09a2-7de1-b3ce-e14c2209ef8d` | Runtime fix `c44eba47`; source inventory `aeaa1370`; reveal/gallery parity `a9c76541`; preview-image evidence `6d1dd628` | Archive has no template/image folder, but exact route module `0hdebqnzl-9~n.js` matches manifest hash; live page and 10-section capture align, all 35 image refs/order and ten image bytes match package, seven fonts and used source CSS rules match. Commit `a9c76541` prevents initial offscreen exit animation and filters empty-src gallery entries; browser source/package static comparisons pixel-match at 390/450 CSS px; 25/25 images loaded, no capture console/network errors; music hover/tap/pulse and reduced motion checked; empty gallery hides with no uploaded images. Focused 4/4, bridge syntax and scoped diff pass. Browser captures/report are in `docs/templates/qa-artifacts/love-sakura/`. The captured gallery has six photos in hero-couple/bride/groom repeated order; story is text-only and no venue photo is present. Catalog and card preview show six loaded source images. `6d1dd628` records this browser evidence; its sample fixture/renderer integration is included in `b09bac245`. Catalog opening is source-rendered; no standalone original cover found. Keep unpublished: valid RSVP API returned 503 and local DB config is absent, so saved invitation, RSVP/wishes, save/reopen and public lifecycle remain unverified. |
| Luxury Gold | `01a169fc-3b6b-7531-b212-fd008d9b1cb1` | Prior motion package in mixed commit `32fe08c6`; source-matched spring/sheens/timings `83c42265`; cover provenance `c49b1f89`; 14-section comparison `68088644`; preview gallery `ceed8f54b`; deduplicated sample `f64a3b180` | Source-motion values remain pinned: calendar spring (stiffness 220/damping 15), To’yona sheen 3.6s + 2.4s pause, divider 2.8s, flower 3.5s, heart 4s, star 8s, hero 10s, and section viewport threshold 0.35. Matched archive/package at 480×720 across all 14 sections with temporary neutral SVG fixtures and three contact entries. Section heights match for indices 0–9 and 11–13, including 1,318px gallery; wishes differ 896px source vs 720px package because captured demo wishes are excluded. Total scroller difference is 176px and remaining section positions align within 3px from scroll-snap rounding. Measured heading font properties match. Archive hydration #418 and missing/CORS resources prevent reliable live frame-by-frame motion verification; evidence is source-code correspondence plus package runtime behavior. The source gallery preview uses six byte-identical Orchid Amplop images in captured order, only in the preview sample; `f64a3b180` removes the duplicate fixture key accidentally included in `ceed8f54b`. Owner closeout at 480×720 covers all 14 sections, opener, 800ms corner/gallery reveal, and cover provenance; source-code motion correspondence plus package runtime checks found no new mismatch. Focused Luxury Gold suite passes 3/3; bridge syntax and scoped diff pass. Archive hydration #418 and missing/CORS resources still prevent reliable live frame-by-frame motion comparison. Unpublished.
| Modern Floral | `01a169fc-598b-7ca3-a1da-fdb28bb6e1ce` | Source motion `633e4f0d`; preview scroll/wishes `48789fc8`; gallery/scroll `cda50bce`; music control `6688f27b`; marquee/RSVP `354a2f0f`; control reuse `7d1faa70`; motion limits `c9ca0322`; gift interaction `56181208`; copy feedback `91965e60`; contrast `00906545`; reduced-motion test `c6be1140`; gift style `d638525a`; paired checks `1270b699`; captured group layout `96db1975`; source preview gallery `2b2bcbe0`; preview/cover audit `052d0504`; reduced-motion root scroll `f60c0066`; full-page asset sweep; paired source runtime retry e7f0c925; Framer defaults `eede5a02` `b7701f75` `f60c0066` | Source gift card expands in place with mapped owner/number and localized copy; copied checkmark lasts 1.8s. Motion uses source Framer defaults: 550/30 scale spring, 500/25 transform spring, 300ms cubic opacity; `eede5a02` restores those values and Enter-key press state. At 390×844, source/package outer card width/radius/padding match; source and fixed package number/copy group are 93.6px (40px field + 12px gap + 41.6px button). `96db1975` fixes the wrapper hierarchy; source/package copy button colors now match. Browser click showed source check glyph and localized copied label, returning to copy label after 1.9s. Commit `2b2bcbe0` keeps six byte-identical source gallery photos in `preview-sample.json` only, in source order; all loaded at 390×844 and lightbox open/close worked. Empty creator/public galleries remain hidden. The optimized `flower.png` matches the full Chorlove mirror (117,434 bytes; SHA-256 `8966ae466465cc0bbfb7a6633a3e0a8476d118a4689feb3fbbbe4da31dd5fbd9a`); a similarly named Invitate image differs. The catalog opening `/templates/modern-floral/catalog-opening.jpg` is the source-hash-matched 810×1754 portrait (58,677 bytes; SHA-256 `6c4de03a01ba15e3b462a519f34f3ad90a87b34851372a4f868aa0381e2052dc`), and all six gallery URLs return HTTP 200 image/webp. `052d0504` pins the preview/cover evidence and empty-gallery behavior. Focused Modern Floral and shared preview-sample suites pass 28/28 after reduced-motion root scroll fix, full-page media sweep, and captured motion defaults; bridge syntax, scoped commit and diff checks pass; bridge syntax, scoped commit and diff checks pass; `c6be1140` tests live reduced-motion preference changes. `b7701f75` records a 478×720 preview sweep through all 13 sections; all visible 423×589 flower ornaments and six source gallery images loaded in order 2,1,3,6,4,5. `f60c0066` verifies reduced-motion root `scroll-behavior:auto` while preserving the 13 sections and 9,411px scroll range. One source/package couple section aligned at 390×844. Commit `e7f0c925` records that the offline streamed Next.js source capture errors before rendering `main`/sections. Live Chorlove route comparison recorded in `498b4394b` supersedes the earlier claim that no source renderer is available: live source and package expose the same 13 section order/classes, source loaded 21/21 images, and all 12 gallery nodes use the same six source URLs/order. Opening and invitation-message section reveal end states match. The runs used unequal widths (source 1280×720, package iframe 480×720), so they do not establish pixel parity. Full paired traversal at matching viewports, hover/press, synchronized wishes frames, remaining section reveal/motion, and paired normal/reduced-motion checks remain incomplete. Unpublished.
| Palace Rose | Existing owner `01a16708-9f96-7af3-934b-c0c0329310e4` | Media provenance `66bfe731`; section/modal policy `c21b7b10`; reduced-motion rule audit `09dcbc03`; source scroll/modal parity `455d5a46`; modal interaction evidence `729cfa7e`; source preview media `d56d09378` | `455d5a46` aligns the 1280×720 internal scroll root, per-section reveal thresholds/durations/stagger, opening petals, and native gift modal structure; focused suite 5/5 and scoped checks pass. Commit `729cfa7e` records source/package close-button, backdrop, inside-click and copy-success behavior; source does not close on Escape, while package Escape/ARIA behavior is an accessibility addition. Receipt host returns under body on close; actual enabled receipt content remains unverified because preview contains none. `d56d09378` adds six source gallery images plus the exact venue photo to preview-only data; creator/public invitation data remains blank unless authored. Full-preview browser exposed the source track `.flex.touch-pan-y` and leaf counter mismatch; commit `4c82f3b78` fixes both selectors. Live preview confirms all six source gallery URLs load with natural dimensions and the 1400×1000 venue image loads. Captured-source click semantics were rechecked: clicking the active slide opens the lightbox; clicking another slide selects it first. Commit `e2cc4f898` matches that behavior and adds regression coverage; focused Palace suite passes 6/6 and bridge syntax passes. Six fonts match source; reduced-motion CSS is pinned but source OS emulation unavailable. Fixture content explains remaining page-height differences. Remains private; database-backed public invitation/receipt lifecycle unavailable.

Existing Chorlove Osh, Orchid Amplop, and Palov owners were asked to include
source motion parity in their completion gates. Cloud Castle's original capture
and component module are present in the recovered Chorlove archive; its source
limitations are browser/runtime verification gaps, not missing source code.

## Chorlove catalog-cover sweep (2026-10-26)

The owner checked all 15 implemented Chorlove catalog-cover pointers: every file exists and decodes, and a 5×3 contact sheet shows the distinctive source opening artwork. Dimensions: Cloud Castle 720×1280; Glass Pink, Green Garden, Green Gold, Jasmine White 432×768; Golden Card 335×469; Green White 430×573; Lace 1080×1920; Love Sakura 900×1444; Luxury Gold 480×720; Modern Floral 810×1754; Orchid Amplop and Palace Rose 450×800; Osh 778×1686; Palov 480×1040. Per-template cover hashes remain recorded in source notes/manifests. Full-template preview gallery/image behavior is tracked in each row separately.
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

## Ongoing source-fidelity follow-up (2026-10-25)

- Green Gold commit `625f6923` restores the exact source venue divider PNG in
  its original wrapper. Source/package divider rectangles match at
  `[276,5064,32,844]`; focused checks pass 9/9, and the 65×3203 image loads.
  Catalog art pointer is committed in `7619d036`; database publication remains
  unchanged.
- Green Garden commit `040dc828` restores source guestbook card/date/hover
  styling, source-style To'yana modal with number/holder/copy/close/dismiss,
  and removes the guest-count selector while sending fixed RSVP `partySize`
  1/0. Focused checks pass 9/9; bridge syntax and scoped diff-check pass.
  Owner confirms no source dress-code section, source/package flower composition
  and parallax match at scroll 0/300/600, and artwork/font/icon hashes match
  provenance. Five source leaf URLs fail at both source and package origins.
  A fresh live DB/API query was unavailable because the local app server was
  not running; the earlier live catalog check showed Green Garden published.
- Cloud Castle commit `4d828214` restores source guestbook presentation,
  count-free RSVP with fixed 1/0 payload, source-absent dress-code gating, and
  the centered gift modal with backdrop, copy, close/Escape/dismiss controls.
  It also clears captured transforms before parallax. Focused checks pass 8/8;
  syntax and scoped diff-check pass. Source-to-package opener clarification:
  stacked names and ampersand match; greeting comes from preview data and the
  language selector is platform chrome. Full direct source audit was completed
  from the recovered archive using a temporary read-only junction: compiled
  module 909129 confirms the opening/hero/particle/gift timings; commit
  `6a969c93` corrects ambient sway/rotation/opacity delays and repeat behavior
  against the source module. Focused suite passes 8/8; guestbook and
  RSVP fields align with source/product requirements; gift art hash matches;
  21/21 images and seven active fonts are byte-identical; CSS changes only
  font-face URLs for local assets. Focused checks pass 8/8. No new mismatch was
  found; published state remains unchanged.
  Follow-up test-only commit `1f66d0a9` corrects the source gift-trigger
  assertion to the exact captured `aria-label="Open gift box"`; focused suite
  rerun passes 8/8. Original capture SHA-256 is
  `b5c3324d0bd44c0a925a873a671f8a643f1e3cde10b870a6a5ffd699dcf476a7`, and
  module 909129 is 58,812 bytes with SHA-256
  `81f9356f44be09216be952fd5a90739b0796f8825c9c7c398479b3d8205cee6b`.
  The source audit records 21/21 image and seven active font matches plus the
  720×1280 authentic post-envelope opening cover. Later browser evidence uses
  the actual canonical sample preview at 1280×720: post-opening hero geometry,
  type and art composition match the source; invitation names differ as the
  fixture replaces baked source names, and platform language/music controls
  are additional chrome. Two reduced-motion package captures one second apart
  are identical; normal preview console has no errors. Source reduced-motion
  mode cannot be media-emulated in the available browser, and source/package
  reduced-motion parity plus exact timed sequence comparison remain open. Keep
  this published design's source-fidelity audit open. Follow-up `d7e1e7de`
  removes the incorrect ambient opacity loop, uses deterministic source opacity,
  and moves the opening burst fade to the wrapper. Source/package computed
  opacity now matches at 0.592831 across samples. A fresh original/package runtime read saw the first petal at 0.592831 initially and one second later, confirming static opacity with no ambient pulse. Focused 8/8, syntax and scoped
  diff checks pass; this does not establish same-frame burst interpolation.
  A further 1280×720 owner pass confirms opened-hero geometry/type/art match,
  both CSS chunks match exactly, all seven font and 21 image hashes match the
  package. Publication state is unchanged. Matched interactive source/app
  browser checks show identical floral-card treatment and width at 390×844;
  source title is one line while canonical preview title wraps to two, changing
  content-driven card bounds. At 1280×720 post-open, cloud/castle hero,
  typography and composition align. A prior burst screenshot was timing-skewed and is not evidence; follow-up commit `90dd3d2c` synchronizes source/package samples at four timestamps and excludes generated petals from generic reveals to preserve the source 850ms fade. Focused 8/8 and scoped checks pass; full section/re-entry checks remain open, with no responsive mismatch isolated at 390×844. Source story gallery images are sample
  data, while the canonical fixture has no gallery URLs, so the optional
  gallery stays hidden until authored uploads replace it. Source module 909129
  and package ambient x loop now match: symmetric `[0,sway,0]` keyframes, half-
  duration ease-in-out, infinite reverse/alternate traversal, and no delay.
  This confirms the loop and requires no further code change. The archived
  runtime sets reducedMotion to `never` and has no located root user-motion
  provider; package reduce behavior is an accessibility extension, not proven
  source parity. Interactive opener and frame-aligned burst are now verified across four timestamps by `90dd3d2c`; this does not establish full-page section/re-entry/responsive behavior. Commit `9c1dad69` corrects the source reduced-motion
  note.
- Glass Pink repair `c381f234` restores the source guestbook name/date/message
  layout, date split, reveal timing and 🪄 suggestion control, and removes the
  guest-count question. The original gift animation is preserved, and the
  unsupported dress-code section stays absent. Selected focused checks pass
  3/3; eight source-dependent tests are blocked by the missing captured provider
  archive in this checkout.
- Golden Card commit `138974e4` restores music-control hover scale 1.1, tap
  scale 0.9 and playback-state icon swap; removes source-absent To'yana/gift,
  receipt, dress-code and generic optional sections; and aligns RSVP to yes/no
  with fixed 1/0 payload. Focused checks pass 6/6; syntax and scoped diff-check
  pass. Fresh browser comparison was unavailable.
- Existing owner chats resumed for continued audits: Chorlove Osh
  `01a16708-7b50-7472-a55b-06f87964048c`, Orchid Amplop
  `01a16716-a961-7702-9a09-af726672d4fe`, Palace Rose
  `01a16708-9f96-7af3-934b-c0c0329310e4`. Chorlove Osh is continuing the
  already-started no-headcount change in continuity chat
  `01a17489-220a-7d53-bc7d-6c054a431d49`; Orchid opener correction remains
  committed as `1ef04587` and its source audit is active. Palace Rose remains
  at its existing preflight checkpoint.
- Orchid Amplop follow-up commits `07d18cc6` and `8aa72abb` restore its
  preview-only gallery mapping, suppress source-absent generic dress-code and
  family sections, and place receipt upload inside the source gift-card reveal.
  The captured component chunk still matches its provenance hash; fixed-party
  RSVP and reduced-motion behavior remain in place. Commit `dcb5ed33` restores
  the gift CTA/icon and cardholder fallback; `689fbf7a` corrects the exact
  source gallery order (2,1,3,6,4,5) and provenance. Source capture and module
  hashes match; all 16 chunks, nine fonts, 16 package assets, and catalog art
  validate. Focused browser and reduced-motion checks pass. Saved invitation
  reopen/public display remains an open non-RSVP lifecycle gate because there
  is no Orchid invitation row or configured database URL in the owner shell.
- Green White RSVP/source alignment is committed as `2f1da98c`: its source
  supports the Dress-kod palette and name/yes-no RSVP, but no headcount prompt;
  selected focused check passes 1/1.
- Jasmine White's source has neither a guest-count field nor dress-code section;
  its active follow-up removes the count UI and uses fixed API values 1/0.
  Syntax/diff checks pass; the archive-dependent full source test is unavailable
  in this checkout. Exact scoped files await the coordinator's commit window.
- Green Gold commits `625f6923` and `aa1dde0f` restore the source venue divider
  and remove its RSVP guest-count control even for
  invitations with `maxGuests > 1`; browser confirms the source-height 206px
  card and focused checks pass 9/9. The gift click behavior remains open because
  the captured handler chunk is unavailable (404).
- Chorlove Osh's existing work now removes the source headcount prompt/stepper,
  maps Instagram, and updates source-adaptation notes. Focused checks pass 2/2,
  bridge syntax and provenance JSON parse; its preview route returned 404, so
  post-fix rendered behavior is not verified. Changes remain uncommitted.
- Chorlove Palov publication migration `0139_publish_chorlove_palov.sql` is
  applied; the configured DB and `/api/catalog` reported it published at
  15,000,000 UZS for `osh`. Post-publication review found and removed a guest-
  count stepper; yes/no maps to fixed partySize 1/0. The owner is rerunning
  isolated checks after a workspace reset removed local DB config, in
  existing-assignment continuity chat `01a17489-18bb-7aa2-a7e6-3144de68c941`.
  Keep published and queue only the exact scoped correction commit.
- No new template implementation assignments were created. Continuity forks
  track only existing assignments. No external deployment was made.

- Archive availability correction (2026-10-25): the full original Chorlove
  source archive is present at
  `D:\$RECYCLE.BIN\S-1-5-21-3366971363-407715079-3029606043-1001\$R4OL8GR\Chorlove\Web invitations`
  with `_next`, `fonts`, `images`, `music`, and `templates`. This supersedes
  earlier notes in this ledger that marked source-dependent comparisons as
  blocked by the archive being absent. Existing owners are rechecking each
  assigned design directly against its exact capture/chunks; limitations remain
  only where that template's specific source file is missing or browser evidence
  cannot be obtained.

- Registry reconciliation (2026-10-25): `CHORLOVE_TEMPLATE_IDS` contains 28 IDs.
  The recovered provider `templates` directory contains 26 template folders
  with 26 `preview-frame.html` captures. `love-sakura` and `royal-purple` have
  no folder/capture there; Love Sakura still has an existing app package and
  previously verified compiled-source evidence, while Royal Purple has no app
  package. Fifteen registry IDs currently have package directories: `cloud-castle`,
  `glass-pink`, `golden-card`, `green-garden`, `green-gold`, `green-white`,
  `jasmine-white`, `lace`, `love-sakura`, `luxury-gold`, `modern-floral`,
  `orchid-amplop`, `osh`, `palace-rose`, and `palov` (12 at the public template
  root; `orchid-amplop`, `osh`, and `palov` under the Chorlove namespace). The
  other 13 registry IDs
  without package directories are `ivory-love`, `pink-lotus`, `purple-flower`,
  `red-rose-card`, `royal-blue`, `royal-green`, `royal-purple`, `royal-red`,
  `spring-bahor`, `stained-glass`, `sunset`, `swan-garden`, and `velvet-romance`;
  this inventory does not claim that all 15 packages passed the full audit.
  Local `/api/catalog` is `configured=false`, so it is not authoritative for
  the full database publication list.
- Green White source gallery repair is committed as `20a5272a` (10 Green
  White-scoped files); focused suite 7/7 and scoped diff check pass. The source
  lightbox styles/assets and loop/swipe, thumbnail, zoom/fullscreen, close,
  empty-gallery, keyboard and reduced-motion behavior were restored. Browser
  interaction checks could not be completed, so those runtime interactions
  remain unverified in-browser; template remains unpublished.
- Published Chorlove Palov completed the requested source audit: capture,
  component and CSS hashes match provenance; all 22 local fonts and the main
  plate image match source; source/package opener was compared at desktop and
  390x844; reveal timing/reduced-motion, cover art, and the shared preview/public
  iframe route were checked. Focused suite 4/4, syntax and typecheck pass. The
  stale namespace test assertion is fixed in scoped commit `6e8ac579`; a
  Palov-only renderer policy in `c5b74f4c` suppresses generic dress-code, story,
  and extra-people sections absent from the captured source. After the fix, the
  public preview shows hero, intro, countdown, time/venue, RSVP and footer in
  the captured order; the focused test asserts the absent extras. The owner
  could not refresh the authoritative DB publication list from this checkout
  (`DATABASE_URL` absent; API serves typed fallback); prior configured DB/API
  verification established Palov published and distinct from `invitate-palov`.
  Keep published status as last verified; this audit made no DB or publication
  changes.
- Orchid Amplop asset reconciliation (2026-10-25): exact-name search across the
  recovered Chorlove and Marxaba provider archives found none of the seven
  component image refs; each original Chorlove URL returns HTTP 200 with bytes
  and SHA-256 matching the packaged asset/provenance. Source component/CSS hashes
  match. The real opener cover (`catalog-opening.png`, 450×800) was inspected and
  its provenance hash verifies. Commits `4796d6ea` and `6e4646e0` corrected the
  lightbox scale and motion evidence; `c19a4612` fixes reduced-motion CSS and
  records full archive results. Integrated local preview opener/gallery work in
  normal and reduced motion. Production source preview currently returns 404,
  so a fresh live side-by-side remains unavailable. Saved/public lifecycle is
  unverified and Orchid stays private.
- Orchid Amplop source comparison follow-up (2026-10-26): the recovered,
  untouched `preview-frame.html` was served from the archive and compared with
  the isolated package at 1280×720 after opening/reveal animations settled.
  Prayer, blessing, kicker, names, date, Comfortaa/Allura fonts, and bounding
  boxes match. The earlier apparent vertical offset was a transient reveal
  animation frame, not a layout difference. Exact lightbox surface, image
  bounds, close icon, and source 0.96↔1 spring endpoints were also checked.
  Package source styles now match the captured hero, event-card, story-grid,
  wish-field, and lightbox declarations; gallery cursor matches source zoom-in.
  `index.html` uses the source's Lucide close icon. The source's viewport-sized
  inner scroll container reserves 15px for its scrollbar; the package matches,
  and open/back-to-top controls target that container. The seven missing source
  image URLs were fulfilled during comparison with the exact verified package
  bytes. With source-matched content, all nine section starts/heights and total
  scroll height (7850px) match at 1280×720. Source/package lightboxes were
  rechecked after the scroller change. The source page was reached from the recovered archive;
  the production preview URL still returns 404.
  Keep Orchid private because saved-draft/public invitation lifecycle checks
  remain unverified.
- Golden Card follow-up (2026-10-25): commit `a1fd784a` fits the long canonical
  preview title within the cover's clear center band using the active font and
  recomputes on resize; captured CSS, short-title size, art and opening motion
  remain intact. Focused test 6/6, bridge syntax and scoped diff checks pass.
  The post-fix screenshot was obscured by the desktop overlay, so no new
  post-fix visual comparison is claimed. Existing source/asset/catalog-cover
  hashes match their provenance.
- Osh route reconciliation (2026-10-25): the earlier 404 came from the
  obsolete `/templates/osh/index.html` path. The actual namespaced route
  `/templates/chorlove/osh/index.html` returns HTTP 200 and the live preview
  shows the source opening and its intro/date/venue/map/footer; no dress-code
  panel is injected. Source capture/chunk hashes and the 778×1686 opening cover
  match provenance. The owner commit `7910fb45` contains six Osh-scoped paths;
  I reran `tests/chorlove-osh-template.test.ts` and all 3/3 checks pass. Current
  database/migration state is unverified because this checkout has no database
  configuration.
- Palace Rose provenance/gate audit is committed as `dea1e6cb` (README,
  provenance, focused test). Seventeen source images and six font variants
  match archive hashes; four gift art files match other archive folders, while
  four are absent from the archive but their exact recorded Chorlove URL bytes
  match the package. Its 450×800 cover, preview pointer and shared renderer
  route are confirmed. Focused checks 4/4, web typecheck, JS syntax and scoped
  diff check pass. A Palace Rose-only adapter still needs to suppress injected
  source-absent sections and place receipt UI compatibly with the native
  To’yona flow; browser motion and preview/public parity also remain open.
  Prior configured DB evidence recorded it unpublished; keep it private.
- Glass Pink full source follow-up is committed as `044af9ad` (nine Glass
  Pink-scoped files). Provenance/tests pin compiled source module
  `0wvjbn--75n3p.js` at 68,749 bytes and SHA-256
  `e79d2091c5d38ac1ba100340f43b62cf994b2b6b79668dd0d274b8ec784fc36e`.
  Restored the three original timeline icons from Chorlove with exact hashes,
  reinstated their 600ms/0.3-threshold/150ms-stagger reveals, and connected the
  gift box to its source body-portal modal. Browser checks covered modal size
  and contents, close/Escape and immediate reduced-motion dismissal. The
  focused suite passes 16/16, syntax and scoped diff checks pass; published
  state is unchanged.
  Commit `258d8f75` completes the matched schedule/re-entry comparison at
  1280×720, including the source opacity/scale start and reduced-motion final
  state; focused suite passes 17/17. No catalog/publication changes.
  Follow-up `2a87e1ee` replaces four mojibake sparkle characters with exact
  source `✦` and records matched opener/modal/schedule geometry and reduced-
  motion app-preview evidence. Archived source reduced-motion was not
  OS-emulated; no catalog/publication changes.
- Glass Pink documentation follow-up `3fb65071` records valid browser evidence
  and supersedes earlier uncertainty about the gift click/modal. Full-page
  section reveal/re-entry visual timing is still open; continue the same owner
  audit before calling the animation comparison complete.
- Green Gold source follow-up (2026-10-25) supersedes the earlier ledger note
  that its route chunk was unavailable and gift behavior unverified. Captured
  route chunk `09cpm7sbnsw7i.js` SHA-256
  `cc9472f5f183b8f7fcbfe281f0cbdeaa573b774cc594e56446736694bfe09b75` matches
  provenance; the component and route modules identify the native gift action.
  The source swaps its card button for owner/number, disables copy when empty,
  copies a trimmed number, and displays copied feedback for 1800ms; no modal or
  close control exists. Browser checks verified reveal/copy/reset with no page
  errors. The 432×768 cover hash matches the typed pointer, seven font hashes
  match, focused checks pass 9/9, bridge syntax and scoped diff checks pass.
  `505d72c9` contains the source interaction fix; `abd146a4` fixes the archive
  test inventory. Green Gold remains unpublished.
- Green Garden source URL follow-up (2026-10-25): the exact referenced
  `https://chorlove.uz/images/green-garden/leaf1-bloom.webp` returned HTTP 404
  with no redirects. The recovered archive contains only the different Glass
  Pink image under that basename, and both captured source and package refer
  five times to the missing Green Garden URL; no substitute was used. The
  focused suite passes 10/10 and the typed catalog still points to the 432×768
  source-opening cover. The prior configured catalog check recorded Green
  Garden published; current DB status is unavailable here.
- Publication-state reconciliation (2026-10-25): current typed fallback marks
  `cloud-castle`, `glass-pink`, `golden-card`, and `palov` published, but marks
  `green-garden` unpublished. Previous configured DB checks recorded Green
  Garden published, and Palov was subsequently verified published by its
  configured DB/API. No current configured DB connection exists to resolve the
  divergence; do not treat typed flags or `/api/catalog` fallback as a fresh
  DB snapshot or alter publication based on it.
- Green White gallery follow-up (2026-10-25): its source comparison now uses a
  12-photo lightbox. Runtime harness passes 19/19, including wraparound,
  thumbnails, swipe-handler input, zoom/fullscreen state, empty-gallery hiding,
  reduced-motion rendering, close, and focus restoration. A real-browser
  interaction pass is still underway. Source requires the active thumbnail to
  center in the rail; the owner found initial centering can run before the
  closed dialog has measurable width and is correcting that timing. Keep the
  template private until the change and actual browser interactions are
  verified; do not rely on the synthetic swipe assertion as a real gesture.
- Green White centered-thumbnail follow-up is committed as `c178967c` (four
  Green White-scoped files); focused suite 7/7, JS syntax and scoped diff checks
  pass. In a 12-photo browser fixture, initial-last and selected-first thumbs
  measure exactly 0px from rail center after the delayed layout positioning.
  A real drag changed slide 2/3→3/3; real thumb click, zoom toggle, Escape close
  and focus restoration were also observed. Swipe handler's broader assertion
  remains synthetic input; fullscreen did not enter in the available IAB, so
  native fullscreen behavior remains unverified. Template stays unpublished.
## Chorlove registry, archive, and package reconciliation (2026-10-25)

A fresh exact-path check confirms three separate inventories:

- The typed Chorlove registry contains 28 IDs; the shared renderer accepts those
  IDs but selects a template-specific frame path, which only exists for the
  packaged set below. Registry presence alone is not package/source evidence.
- The recovered Chorlove `templates/` archive has 26 directories with
  `preview-frame.html`. The missing captures are `love-sakura` and
  `royal-purple`. Love Sakura is nevertheless packaged and its route module was
  matched to the live source/manifest; Royal Purple has neither capture nor
  package.
- There are 15 actual Chorlove packages: 12 top-level (`cloud-castle`,
  `glass-pink`, `golden-card`, `green-garden`, `green-gold`, `green-white`,
  `jasmine-white`, `lace`, `love-sakura`, `luxury-gold`, `modern-floral`,
  `palace-rose`) and three namespaced (`orchid-amplop`, `osh`, `palov`).

The other 13 registry IDs have no Chorlove package path:
`ivory-love`, `pink-lotus`, `purple-flower`, `red-rose-card`, `royal-blue`,
`royal-green`, `royal-purple`, `royal-red`, `spring-bahor`, `stained-glass`,
`sunset`, `swan-garden`, `velvet-romance`. Twelve have archive snapshots only;
Royal Purple has no archive snapshot. Do not count these as implemented source
fidelity packages based on registry/catalog placeholders alone. Published
Palov is included in the 15-package count and has its source/cover/motion record
above. No publication state is changed by this inventory reconciliation.

- Green White preview-media follow-up (2026-10-26): the captured source gallery
  references six sample photos in order (`gallery-2`, `gallery-1`, `gallery-3`,
  `gallery-6`, `gallery-4`, `gallery-5`). The Green White preview fixture now
  maps those to exact archive-identical files at
  `apps/web/public/templates/chorlove/orchid-amplop/assets/`; all six SHA-256
  checks match the archive under `Chorlove/Web invitations/images/templates/orchid-amplop/`.
  The live app invitation preview rendered the same six image URLs in that order.
  Empty invitations still have an empty gallery, and Green White's renderer hides
  the entire gallery section when no creator photos exist. The source has a map
  embed rather than a venue photo and has no story-photo section. Focused suite
  passes 10/10. Green White remains unpublished; no catalog publication change.
