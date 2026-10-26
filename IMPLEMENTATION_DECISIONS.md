# Implementation decisions

## Multi-provider source reconciliation (2026-10-25)

- User requested scanning Chorlove and Marxaba first, then the listed providers,
  comparing actual reference captures with the app and avoiding duplicate
  designs under another name. A newly identified distinct design should be
  reported in this chat before continuing. Implement only when complete
  template-level source is available; keep source captures unchanged and follow
  existing per-template verification, private-until-ready and publish/commit
  gates.
- The Chorlove archive manifest lists 28 slugs. Thirteen currently absent from
  the typed Chorlove registry/package set are Bahor Navosi (`spring-bahor`),
  Purple Flower, Royal Red, Royal Blue, Royal Green, Red Rose Card, Ivory Love,
  Velvet Romance, Royal Purple, Pink Lotus, Swan Garden, Sunset, and Stained
  Glass. The capture has only isolated `preview-frame.html` snapshots for these
  designs, without their template CSS, JavaScript, fonts, or art. Do not
  implement them from screenshots or the snapshot alone.
- Marxaba's 46 listed template IDs are already represented in the typed
  Marxaba registry. The OnlineTaklifnoma 11 designs and Taklifnomachi 8 demos
  are likewise already represented by existing renderers/packages. Other
  provider archive pages are invitations/demos, not confirmed distinct
  template-level source; continue checking actual catalog/template inventory
  before assigning or registering any candidate. No new template was
  registered, migrated, published, or committed during this source audit.

## Catalog navigation and curated covers (2026-10-25)

- Match `/templates` to the homepage Visol brand, navigation links, mobile menu
  and hide-down/reappear-up scroll behavior. Keep its background transparent,
  including while scrolling, like the homepage; retain readable link/account colors.
- Homepage shows only these published designs, in order: Anor, Bog‘i Eram,
  Cloud Castle, Ganch, Kuzgi Chinor, Nahor, Yangi Uy, Shirin Bayram. Omit an
  unavailable selection instead of substituting an unrequested design.
- User authorized choosing better static covers from actual rendered template
  scenes. Keep strong existing covers; replace weaker openings with settled
  scenes, preserving source captures and original artwork. Shared cover selection
  applies to home, catalog, detail-dialog posters and studio template choices.
- Add preview-only `poster=1` capture mode: canonical sample content, one locale,
  muted music and no app preview controls. Ignore draft input in this mode.
  No saved/public invitation data or template animation changes are required.
- Bog‘i Eram's selected cover must show the opened garden with both people's
  names fully visible and opaque, after the name reveal completes.

## Homepage occasions orbit (2026-10-25)

- User approved replacing the occasion strip immediately after the hero with
  the proposed scroll-driven drop/release/orbit section, before featured designs.
- Follow-up approved: a drop falls into a visible light/champagne water surface,
  makes ripples, rebounds on a liquid neck, separates and rounds into the central
  pomegranate orb. Then release Nikoh to‘yi, Tug‘ilgan kun, Oilaviy tantana and
  Unutilmas lahzalar, orbiting through a quarter turn while staying upright.
  No extra category or video asset required.
- Begin the sequence after the section fills the screen. Allow 1.6 extra viewports
  for the water sequence and orbit, fully reversible, with no automatic spinning or scroll lock.
  Phones use a tall oval and two-line labels; reduced motion/no JavaScript shows
  the complete static arrangement, and short landscape screens use a compact grid.
- Preserve the existing cinematic features and their timing.
- Remove the reply phone and all its sample contents from “Eng yaqin insonlar /
  Eng yaqinlaringiz bilan, birga.” Keep its copy, position and scroll timing unchanged.
- User explicitly requires keeping the site fast. Use a deferred, dependency-free
  single-pass WebGL effect with capped pixel budgets, no perpetual render loop,
  no offscreen/background-tab drawing, and no GPU drawing after the HTML orbit
  takes over. Keep a CSS fallback for unavailable/lost WebGL and skip the renderer
  for reduced motion and short landscape layouts.
- Latest approved refinement: replace the plain labels-only orbit with the user's
  supplied photographic reference direction: four silk-framed scenes (bouquet/rings,
  birthday cake, family table, sealed envelope), numbered serif captions, pearl
  details, soft petals, fine layered orbit and a reflective burgundy centre.
  Use “Tadbirlar / Unutilmas lahzalar” with the reference's short two-line copy,
  superseding the earlier central “Bir taklif.” text. Preserve the water sequence.
- Keep captions as real HTML and use four small transparent WebP cutouts.
- Latest motion correction: desktop captions must follow each photograph's current
  side, smoothly crossing around the image instead of jumping between fixed anchors.
  Keep one readable caption throughout; fade its number/rule briefly at the poles
  and subtly scale the photo when needed to clear the central jewel.
- Phones must complete the same quarter-turn and occupy the next image's place,
  superseding the earlier 20-degree limit. Keep phone captions below photographs.
  Remove the “Scroll qiling” cue and its icon entirely.

## Homepage three-step section (2026-10-25)

- User approved replacing the standalone process block with a photographic
  invitation scene inspired by their supplied reference: left-aligned serif
  heading, pomegranate action, and three translucent numbered cards. Retain
  “Katta kun sari. Uch kichik qadam.” and use a stacked phone layout.
- Join this section directly to the cinematic features as its closing section.
  Remove the intervening “Ezgu niyatga qulay bir yo‘l” to‘yona promotion and
  sample/disclaimer text. This removes homepage copy only, not product features.
- Preserve the existing cinematic scroll timing and light campaign direction.

## Cinematic homepage sequence (2026-10-25)

- User wants the scroll transitions shown in their Bugatti Chiron recording:
  incoming full-width image panels rise over the previous image, with slower
  image movement and readable overlaid copy. Following the content/placement
  exploration, user approved implementing the complete proposed direction.
- Replace the existing Why us panels after
  featured designs with four photographic chapters covering design, personal
  details, venue navigation, and guest replies/wishes. Use one coherent sample
  invitation and retain the platform's approved visual direction. Retain the
  centered section introduction. Keep native touch scrolling and support reduced motion.
- Pacing correction: incoming photographs must fill the viewport quickly,
  then hold while their copy travels from the lower portion to above the top.
  Only then may the next photograph rise over them. The earlier implementation
  left copy too high and took a full screen of scrolling to reveal each image.
  Use a common pinned stage, a 0.32-screen image reveal and a separate 0.9-screen
  reading distance. Keep the incoming copy low until its image is fully revealed.
- Venue correction: remove the pale “Sizni kutamiz” map card. Use a route,
  location pin and compact labels integrated into the venue photograph.
- User approved replacing all four dark photographs with a coordinated bright
  daylight set: white stone, champagne fabrics, white flowers, soft shadows,
  and pomegranate accents. Keep the platform light; use charcoal/pomegranate
  chapter copy and light local washes rather than darkening the new photos.
- Laptop venue labels need a small translucent backing and larger type. Keep
  the route/pin and use a smoked plum glass panel behind city/date/navigation,
  rather than restoring the previous pale paper card. Recheck on laptop/phone.

## RSVP guest count and source-absent sections (2026-10-25)

- Confirmed user requirement: published guest-facing RSVP forms must not ask
  how many people a guest is bringing. Keep the existing response API contract
  by submitting a fixed party size of 1 for attending and 0 for not attending.
- For Chorlove designs, render optional sections such as dress code only when
  that exact original design includes the section. Do not inject a generic
  section into designs whose source has no such UI. Apply the same source-
  presence check to other providers during fidelity work.
- Gift/to'yona and wishes interactions in Chorlove packages must follow the
  original design's layout and opening/animation behavior, with invitation
  data mapped through the platform adapter.

## Platform color refresh (2026-10-25)

- User approved applying the reviewed pomegranate, white, and charcoal direction
  throughout the platform after finding the cream-heavy design too subdued.
  This supersedes the earlier ivory/gold palette and cream-only Why us guidance.
- White page/card surfaces, pomegranate primary actions (`#b8324a`, hover
  `#98263d`), charcoal text (`#29252a`), neutral muted text, and selective pale
  blush surfaces (`#fff1f3`). Gold (`#c6a15b`) is reserved for small decorative
  details, with separate gold tokens; interactive accents use pomegranate.
- Apply the shared tokens to navigation, catalog/preview chrome, editor,
  dashboard/activity pages, forms, and dialogs. Replace hardcoded beige/brown
  homepage treatments and feature illustrations; keep the workspace calm and
  the catalog neutral. Preserve the existing fonts, layout, motion preferences,
  and each invitation template's own source colors/assets.
- Add a prominent “Dizaynlarni ko‘rish” hero link to `/templates`, superseding
  the earlier instruction against a hero action. Keep existing navigation and
  preview/create behavior. Do not change template data, pricing, publication,
  authentication, or guest-response behavior as part of this visual refresh.

## Homepage discovery and full catalog (2026-10-25)

- User approved shortening the homepage to eight handpicked published designs,
  followed by a centered “Barcha shablonlar” link to a dedicated catalog.
  Selection shows a mix of visual styles and occasions, not a popularity rank;
  use other published entries if a selected design becomes unavailable.
- Homepage has no search/category controls; `/templates` contains the complete
  published catalog with existing search, category transitions, single-preview
  playback, and animated detail dialogs. Navigation and full-preview return
  links point there; legacy `/preview` list visits redirect there. Individual
  `/preview?template=…` routes and source packages stay unchanged.
- Approved order: hero → occasion orbit → featured designs → visual Why us →
  how it works → FAQ → final create/discovery invitation. Update the old FAQ
  “View button” wording.
- Why us explains personal design/photos/music, Google Maps navigation, guest
  replies, moderated wishes and optional to‘yona card details/receipt uploads.
  Language support remains elsewhere in the product; do not imply automatic
  bank verification, payment processing, automatic translation, or invented
  usage statistics.
- User requested a complete Why us redesign after rejecting the previous phone
  illustration and icon-card layout. Keep the centered “Nega aynan biz?” title
  and supporting copy, but rebuild the visual composition from scratch.
- Earlier cream-only Why us guidance is superseded by the approved platform
  color refresh above. No green brand accents are introduced.
- Implemented composition: white/blush section, neutral bordered panels,
  large serif headings, an asymmetric invitation/map lead row, then distinct
  reply, handwritten-wish and sealed-envelope illustrations. Use the existing
  fonts and catalog artwork; illustrations are lightweight HTML/CSS/SVG and
  explicitly marked as samples, with no extra live renderer. Each feature has a
  relevant icon and its own desktop hover response. Phone panels stack for
  readability; respect reduced motion.
- Keep the centered catalog CTA without its old promotional sentence/banner.
- Follow-up: remove the Why us eyebrow “Har bir tafsilot — mehr bilan” and
  divider lines at both section boundaries (including the next section's top
  border). A temporary four-language panel was later removed at the user's
  request; keep the section focused on its invitation, map, reply, wish, and
  to‘yona examples.
- Latest refinement: remove the four-language panel altogether and reduce the
  featured-templates bottom padding and Why us top padding for a closer section
  transition on desktop, tablet, and phone.

## Catalog cards, playback, and scrolling (2026-10-25)

- User requirement: taller, fully clickable template cards. Put the name and
  description over a dark bottom gradient; remove the separate information
  panel and View/Create buttons. Use full-width 3:5 portrait windows with the
  same poster/live-preview bounds and no neutral side gutters.
- Clicking opens a detail dialog with price, a phone mockup containing the real
  silent template opening, and full-preview/create actions. On phones use an
  animated bottom sheet below 90% of viewport height, with a visible backdrop,
  safe-area padding, internal scrolling, and reduced-motion fallback. Preserve
  keyboard focus, Escape dismissal, background scroll lock, and focus return.
- User follow-up: enter from below and slide slowly back down on X, backdrop,
  or Escape dismissal. Keep the modal mounted and background locked through
  the exit; reduced motion dismisses immediately. Size the live frame to the
  measured inner phone screen so no poster strip is visible at the bottom.
- Opening stability: focus the stationary dialog before the moving close
  button, preserve page width when locking scroll, clip entrance overflow, and
  defer live-renderer mounting until the entrance finishes. Keep closing intact.
- Show category badges at the top left only in All. Hide them after selecting
  a category. Keep published-template eligibility and selected-template URLs.
- Play one real opening on desktop hover/focus; on touch choose one mostly
  visible card near the viewport center once scrolling settles. Stop the old
  renderer on switching, scrolling, hiding the page, or opening the dialog.
  Respect reduced-motion and data-saving preferences, including the dialog.
  Hide scrollbar chrome only inside catalog embeds; full previews stay usable.
- User correction: the site feels slow and scrolling jumps. Supersedes the
  previous request for touch weighting: restore native phone/tablet momentum,
  use lighter desktop wheel smoothing, lazy-load cover images and the selected
  renderer, and avoid per-card route prefetch. Do not load new live previews
  during active scrolling. Physical swipe feel still needs a device check.
- Category changes retain the brief exit fade and 200ms/6px entrance,
  immediate selection feedback, cancellation of stale transitions, and reduced
  motion. Remove animation of the entire multi-row result height to avoid
  repeated layout work and interference with scrolling.
- Test maintenance: validate historical catalog captures against the archived
  fixture from `7d7d1e3`; normalize text line endings but keep binary assets
  byte-exact. Preserve original capture files and provenance.

## Invitate Wedding registration and source gaps (2026-10-23)

- User requirement: reserve catalog ID `invitate-wedding` and additive migration
  `0128_register_invitate_wedding_template.sql`; support wedding events and keep
  the entry private/unselectable until the release checks pass.
- The manifest points to `Invitate/Web invitations/invitate.uz/wedding.html`.
  The source HTML/CSS/JavaScript, locally captured assets, and captured fonts
  are packaged under the isolated template folder. The application adapter maps
  contract names, date/countdown, message, venue/map, program, gallery,
  dress-code, RSVP, music, guest greeting, and four approved locales.
- Confirmed release gaps: the manifest omits the referenced location-night
  video and one strip image; the celebrity lineup has no shared contract field
  and is hidden. The local portrait catalog art is cropped from the hero
  background and does not show the text overlay. These remain fidelity gates;
  do not publish until a complete opening capture and missing-source decisions
  are resolved and normal/reduced-motion, RSVP, and public-render checks pass.
- Fidelity follow-up (2026-10-23): the exact missing asset URLs were searched
  across the full Invitate capture manifest/tree and captured script text. No
  matching local resource or separate Wedding runtime chunk exists; the
  captured source itself reports the location video as unavailable. Browser
  comparison at desktop and 390×844 confirmed the same source hero composition.
  QA reduced-motion showed the reduced-motion class and no autoplay video; the
  full-preview route forwards its reduced-motion flag. See the package README
  for the later verification record.
- Follow-up (2026-10-24): the disposable creator integration test verified
  draft save/reopen and a test-only public render; normal invitation
  publication correctly rejected the still-private template. This did not
  verify creator-initiated publication. Missing garden-strip, program
  background, and location video media, plus absent artist-lineup and
  per-program-description contract fields, remained release blockers.
- Follow-up (2026-10-25): the referenced capture archive is not present under
  `D:\Projects` in this checkout. A recycle-bin ZIP of that archive was found
  and inspected in place without restoring or modifying it. The source confirms
  eight artist cards (portrait, role, name) and four program descriptions; no
  copies of the three missing remote media files were present. The shared
  contract, studio editor, invitation save/reopen shape, and Wedding adapter now
  support localized artist lineup and per-program descriptions. Source examples
  are held only in the canonical preview fixture; new invitations start empty.
  Direct retries of the three referenced media URLs again returned HTTP 404,
  404, and 403.
  Focused contract/fixture/adapter tests pass 5/5 and web typecheck passes.
  The configured integration test could not be rerun because
  `apps/web/.env.local`, `DATABASE_URL`, `APP_URL`, and a local app server are
  absent. Missing garden-strip, program-background, and location-video assets
  remain publication blockers; RSVP verification is deferred for this pass.

## Invitate Safir implementation status (2026-10-23)

- User request: implement only Safir from the exact Invitate manifest path
  `Web invitations/invitate.uz/safir.html`; its paired CSS, JavaScript, fonts,
  and image assets are in the same Invitate capture tree. Preserve the capture.
- Coordination: catalog ID `safir` is reserved. The database has no existing
  Safir row; migrations `0131` through `0135` are assigned, so use the unique
  next migration `0136_register_safir_template.sql`. Register it additively and
  keep it private until the remaining release checks pass.
- Safir is a wedding-only design. Its isolated source package adapts the
  captured floral invitation to the shared renderer, including localized
  content, venue/map, repeatable programme, dress-code palette, optional
  music, contact, RSVP, and moderated wish submission. The clean portrait
  opening art and a local React-renderer check (all four locale handoffs and
  preview no-send) are complete. Captured `safir.js` and `safir.css` are
  preserved byte-for-byte in `source/`; the adapted production bridge handles
  platform data and API calls. Provenance records the original JS hash and
  opening-art hash. It is registered in the typed catalog and database by
  migration `0136_register_safir_template.sql`. It remains unpublished and
  unselectable pending matching viewport source/package comparison under
  normal and reduced motion, production preview, public save/reopen,
  mobile/desktop, and final release checks. Browser verification could not run
  in the resumption session because local browser automation is disabled;
  catalog/package hashes and typecheck pass, but visual parity is not claimed.

## Remaining source-template coordination (2026-10-23)

- User requirement: implement every eligible complete captured source template
  that is not already integrated and published. Skip completed/published
  templates without reopening fidelity audits; maintain a central per-template
  assignment ledger, assign one unique template per worker chat, and keep
  catalog/database changes coordinated and unpublished until release checks
  pass. Apply authorized additive migrations and publish through the catalog
  mechanism only after completion; do not deploy externally or enable live
  payments.
- User requirement: package the selected source template and its assets,
  preserve original captures, use the shared typed contract/preview fixture,
  and exclude source app runtime, analytics, and sample invitation data. Do not
  research rights. A capture that lacks enough template-level source must be
  marked for source-completeness review rather than approximated from a static
  page.

## Chorlove Palov registration (2026-10-23)

- User requirement: implement Chorlove's Palov source under the existing `palov`
  ID, distinct from Invitate Palov (`invitate-palov`), and support `osh` only.
- The isolated package keeps the captured Chorlove component styling, local
  Lora/Playfair fonts and Palov illustration, with the shared-contract bridge
  and canonical 480×1040 fixture-based catalog opening. Browser captures of the
  source and package opening were compared at mobile and desktop sizes, including
  normal and reduced motion; the cover was refreshed after the Osh title fixture
  was added. Its focused suite passes 4/4, bridge syntax and web typecheck pass.
- Additive migration `0135_register_chorlove_palov.sql` was applied directly
  under the migration advisory lock after confirming no existing `palov` row
  and tracker state through `0134`. The database confirms 15,000,000 UZS,
  category/event `osh`/`osh`, and `published=false`. Keep it private until
  the coordinated publication step. The local integration suite verifies
  creator draft save/reopen, the private publish guard, and public route/view/RSVP
  behavior with a disposable invitation. The
  source's optional Instagram contact link maps through the backwards-compatible
  optional `contacts.instagramUrl` field and creator input. Old invitations parse
  with an empty Instagram value. The source has no native to'yona section; when
  enabled, the shared gift receipt-upload adapter renders its platform section
  before the footer rather than inserting into a source panel.
- Publication follow-up (2026-10-25): user authorized catalog publication after
  release checks. Additive migration `0139_publish_chorlove_palov.sql` was
  applied under the migration advisory lock; the database verifies published,
  `osh` category/event and 15,000,000 UZS. `/api/catalog` returns Palov with its
  distinct `invitate-palov` peer. The local creator API integration now checks
  draft save/reopen, publish, public page, view and RSVP using disposable rows.
  The guest-facing RSVP no longer asks party size and submits fixed count one
  for attendance, following the confirmed platform-wide requirement. Keep
  publication local to this configured catalog; no external deployment or
  payment activation was performed.
- Local integration check (2026-10-23): `/api/catalog` returns 200 and omits
  private `palov`; the package renderer and 480×1040 cover both return 200.
  The opt-in Palov integration test creates a temporary creator session, saves
  and reopens an existing private draft, confirms publish returns
  `TEMPLATE_UNAVAILABLE`, then marks only its disposable invitation row
  published to exercise the public page, view endpoint and RSVP endpoint on
  localhost. Teardown removes the test invitation, session and user; the
  catalog template row remains unpublished.

## Invitate Nahorgi Osh source registration (2026-10-23)

- User requirement: implement the exact Invitate manifest page
  `Web invitations/invitate.uz/nahorgi-osh.html`; it is distinct from the
  adjacent `palov.html` Peshtoq page. The existing `nahorgi-osh` ID belongs to
  another provider's Marxaba template, so this Invitate design uses the unique
  ID `invitate-nahorgi-osh`.
- Source review: the captured design is morning-osh specific. Assign catalog
  category `osh` and event support `osh` only. Release condition was to keep it
  unpublished until its renderer, authentic opening artwork, and verification
  gates passed; that condition is now satisfied.
- Completed: the exact captured HTML/CSS/JavaScript, local fonts and image are
  isolated under `apps/web/public/templates/invitate-nahorgi-osh`; the shared
  renderer maps the four supported locales and API-backed RSVP. The catalog
  portrait is a 780×1688 render of the captured opening with blank invitation
  fields, so fixture content is not stored in the image.
- The configured database has the unique row registered by migration `0131`
  and published by additive migration `0134`; its `osh` category and `osh`
  event support are verified. The focused suite passes 4/4, typecheck and
  production build pass, and preview and RSVP guard behavior were checked
  locally. No external deployment or live payment activation is included.

## Chorlove Orchid Amplop implementation update (2026-10-23; verified 2026-10-25)

- Orchid uses the isolated original component module 482485, embedded source CSS,
  local fonts/assets, and a shared typed adapter. The captured component chunk's served SHA-256 matches provenance. The restored
  source image directory's eight files are byte-identical to the package; a full
  tree filename search confirms the seven other component paths are absent and
  were recovered from exact source URLs. The 16-chunk graph and all asset/font/CSS
  hashes validate.
- Source-designed guest sections are hero/opener, couple, date/program, story,
  gallery, gift, wishes, RSVP, and footer contacts. Source has no dress-code or
  extra-family-people section. Orchid integration suppresses those generic
  injections. The optional platform receipt-upload form is nested within the
  source gift-card reveal; card number/cardholder remain in source-designed
  layout. No RSVP guest-count prompt is shown; existing API receives partySize
  1 for attending and 0 for not attending.
- The canonical preview-only gallery uses the six original Orchid images in source
  order: gallery-2, gallery-1, gallery-3, gallery-6, gallery-4, gallery-5. Creator
  uploads replace them; no source demo photo is included publicly.
  Both typed registry entries use the real 450x800 opening capture built from
  the shared fixture. The source metadata image stays excluded because it has
  baked sample names and provider UI.
- Commit 1ef04587 corrected four Uzbek Latin opener strings to source text.
  Browser checks at 390x844 cover source/package opening, gallery and gift
  interactions, spring/lightbox normal motion, and reduced-motion adaptation.
  Source continues animating under reduced motion; the app intentionally removes
  opener/reveal/lightbox movement. Four locales are supported. RSVP and wishes
  verification alone is not a publication blocker per the current user decision.
- Migration 0132 is applied; recorded DB evidence confirms wedding-only,
  unpublished. The public catalog excluded Orchid. No Orchid invitation exists,
  so saved-draft reopen and public invitation lifecycle checks remain open.
  Keep unpublished until the remaining non-RSVP integration gates pass.
- Source comparison follow-up (2026-10-26): the untouched recovered source frame
  and package were compared at 1280×720 after the reveal settled. The hero's
  text, local fonts, and element positions match; an earlier apparent vertical
  offset was a transient animation frame. The isolated platform stylesheet now
  matches source hero, event-card, story-grid, wish-field, and lightbox styling.
  The package also uses the source's viewport-sized inner scroller and reserved
  scrollbar width (1265px content width in a 1280px viewport); opening and
  back-to-top now scroll that container. All nine section starts and heights,
  plus total scroll height (7850px), match with source-matched content and the
  seven missing source image URLs fulfilled using the exact verified package
  bytes. The recovered
  archive frame enabled this comparison even though the current public
  source-preview URL returns 404. Reduced-motion differences remain an
  intentional accessibility adaptation.

## Invitate Velvet source preflight (2026-10-23)

- User request: implement exactly one Invitate template, Velvet, from the path
  resolved in its capture manifest (`Web invitations/invitate.uz/velvet.html`).
  The manifest also supplies its dedicated CSS/JS, two videos, image, music,
  and a shared curtain background image. These assets are separate from the
  existing Velvet Royale template.
- Velvet's typed registration and additive database migration are set to the
  wedding category and wedding event type, at 150,000 UZS, unpublished. Its
  source package, localized typed adapter, iframe bridge, and portrait opening
  artwork are staged. Do not publish until browser/service/database release
  verification passes. Migration numbering remains subject to coordinator
  sequencing; do not apply or rename it before that coordination.
- The app package binds creator names, localized greeting/message, date,
  venue/map, repeatable program, dress code, gift details, photos, and RSVP to
  the shared contract and public RSVP API. The captured sample fields, webhook,
  prompt, remote icons, font requests, and animation stylesheet were removed or
  replaced with app-local resources; the original capture remains unchanged.
  RSVP note carries the source song request. Reduced motion and all four
  approved locales are implemented. Browser, public route, persistence, and
  database release verification remain pending.

## Invitate Velvet fidelity verification update (2026-10-23)

- The manifest and full Invitate archive confirm the captured Velvet source
  set: its HTML, `velvet.css`, `velvet.js`, two videos, source music,
  `image1.png`, `look.png`, and shared curtain image. A whole-archive text
  search found no additional Velvet component or JavaScript chunk.
- App-source changes affecting source behavior are identified: the captured
  sample webhook RSVP is replaced with the platform RSVP API; the hard-coded
  sample date/countdown and calendar date are bound to invitation data; and the
  source Enter-key calendar-date prompt is removed in favor of the invitation
  date highlight. Source-only analytics, remote icon requests, and sample data
  are excluded. The portrait cover depicts the same captured opening hero and
  slider scene.
- Matched-browser source/app comparison and reduced-motion review remain
  unverified. The local preview server responds in the workspace, but the
  in-app browser could not load the preview and browser policy rejected the
  loopback URL used for the isolated source page. Do not mark complete or
  publish until real-browser visual, motion, interaction, save/reopen, public
  route, and RSVP checks pass; record remaining differences after comparison.

## Palace Rose registration (2026-10-23)

- Full-archive audit: the original React component and motion declarations are present in shared compiled chunk `Web invitations/_next/static/chunks/0dg.9_70mpb0j.js` (module 99664), although no standalone Palace Rose script or stylesheet is captured. Its portable source depends on Chorlove app modules and providers, so the isolated renderer retains the captured template DOM/shared CSS and maps the shared invitation contract in a separate adapter. The component references eight additional gift-box images: three exist only under another template and are excluded; five are absent from the complete archive. Provenance records the bundle hash and this exact gap.
- Palace Rose is registered as unpublished, wedding-category, wedding-event-only at 150,000 UZS. Migration `0119_register_palace_rose.sql` is applied; the configured database confirms `published=false`. The 17 exact manifest artwork files are byte-identical in the package; only its opening art uses the actual renderer and canonical preview values at 450×800 portrait. The fresh app preview maps six program rows, calendar/countdown, venue, wishes, RSVP, To‘yona, contacts, and locales. Focused source/contract tests (3/3), JavaScript syntax check, web typecheck, and production build pass. A browser check confirms all four locale controls and six program rows; reduced-motion opening has no petal animation and no console errors. Source-to-app motion comparison, public/preview parity, and full service interaction QA remain. Keep it unpublished until those checks pass. These are implementation gates, not rights checks.

- Matched browser follow-up (2026-10-26): the earlier date/host binding and empty-gallery findings remain as recorded. Compared the archived capture running its original compiled module (port 3004) and packaged renderer at 1280×720. The template root now matches the source's full-width, 720px internal scroller and white outer gutters; total scroll heights differ with the source-demo versus shared-preview fixture content. Reveal selection no longer mistakes `opacity:0.7` ornaments for hidden nodes. Detail, calendar, venue, program-row, wishes, and gift reveal timings/thresholds follow the recovered component; opening still uses 12 petals. To‘yona has the source backdrop/panel/card geometry after the empty receipt host is removed from the flex flow; backdrop, close, Escape, and copy interactions remain. Reduced-motion source/code evidence remains as recorded: the captured CSS disables its motion classes for the native preference, while package `qaReducedMotion=1` removes petals, reveals content immediately, and opens without transition. Browser controls cannot toggle the native preference. Focused Palace Rose tests (5/5), JavaScript syntax, and web typecheck pass. Public DB and editor-draft/receipt lifecycle checks remain separate; Palace Rose stays unpublished.

- Preview-media and receipt follow-up (2026-10-26): the canonical shared fixture now maps Palace Rose's six source demo gallery photos and the venue photo only into catalog/initial-selection previews. Exact source/package gallery bytes and hashes are recorded in `apps/web/public/templates/palace-rose/source/provenance.json`; the Palace poster is the actual 450×800 renderer opening image. Empty creator/public photo gallery and venue slots remain hidden. Temporary QA-only dummy receipt content was never submitted or saved; source/package modal controls match at 1280×678 and 390×678, and both fit 390×500 with scrollable inner content and visible close control. File selection shows its name without a thumbnail. Database-backed public route and actual editor receipt lifecycle remain unverified; keep Palace Rose unpublished.

## Chorlove Osh source recovery and implementation (2026-10-23)

- User request: implement exactly one Chorlove template, `osh`, from the exact folder identified by `Invitations - this folder will be removed from production/Chorlove/capture-manifest.json`, and publish only after all release checks pass.
- User correction: search the complete provider archive and recover the original source beyond the preview-frame snapshot.
- Recovered the exact component/CSS chunk from `Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0r~7st8t0.ow1.js` (module 753736), the exact palov art from `Web invitations/images/palov/palov.png`, and Cormorant Garamond from `Web invitations/fonts/CormorantGaramond-Regular.ttf`. The chunk declares Forum through Google Fonts; the matching TTF was packaged locally. The complete archive still has no authentic local catalog portrait; the snapshot metadata points to a remote payment media image.
- Osh now has an isolated source package under `apps/web/public/templates/chorlove/osh`, shared-contract renderer routing through catalog, creator and public views, and a typed `osh`-category/`osh`-event registry entry. Migration `0119_register_chorlove_osh.sql` was applied alone under the migration advisory lock because unrelated Swan and Velvet migrations were pending. Database confirms `published=false`, 150,000 UZS, category `osh`, and event support `osh`.
- The Osh source frame uses local art/fonts and a dedicated shared-contract bridge for localized content, venue/map, contacts, reduced motion, preview-only fixture rendering and the real RSVP endpoint. Its authentic 778×1686 portrait catalog opening was recovered from the exact metadata media URL and packaged as `preview.jpg`. Browser review confirms the source-styled opening, venue/map, RSVP and closing sections render; `qaReducedMotion=1` opens without the animated entrance. A synthetic local published-invitation fixture verified the public route returns 200 with the Osh iframe and bound fixture names, and the RSVP API returns 201 and stores one response; its temporary data and rate-limit entry were deleted. A disposable creator session also verified draft save (201), reopen (200), updated content and incremented revision. Publish correctly returned 409 `TEMPLATE_UNAVAILABLE` while `templates.published=false`; the disposable draft, session and account were cleaned up. The catalog API omits Osh. `node --check`, web typecheck, and production build pass; the packaged HTML contains no captured sample names. Keep Osh unpublished. A successful authenticated publish → public render → reopen cycle depends on enabling the catalog row first; no user account or credential was required for the checks completed. See `apps/web/public/templates/chorlove/osh/SOURCE_ADAPTATIONS.md` for mappings and remaining gates.
- Matched source/package follow-up (2026-10-25): the archived preview frame and source chunk were compared with the real `/preview?template=osh` renderer at 1280×720. The audit found that the package referenced `osh-suzani` but omitted the source's hidden SVG pattern definition; the exact source block is restored, and the woven opening now matches. Source palette, composition, typography, opening animation timing, and viewport reveal behavior match; `qaReducedMotion=1` suppresses entrance/reveal motion. The isolated package uses source Palov artwork and local Cormorant/Forum fonts; metadata's exact 778×1686 first-page cover is `preview.jpg`, with hashes in provenance. The real renderer supplies preview/creator data and exposes only RSVP name, yes/no, and submit. The user-approved no-headcount rule overrides the source stepper: yes submits `partySize=1`, no submits `0`, both accepted by the API contract. Template music remains opt-in and supports creator direct audio plus source YouTube URL forms; provider sample audio/runtime is excluded. Telegram, Instagram, and phone map to typed contacts; source has no schedule, To’yona/gift/card, or wishes section. No further source-backed opening/style/motion gap was found. The focused suite passes 3/3. The authenticated creator-publish → public-render → reopen lifecycle now passes; RSVP service checks are not a blocker, and no deployment or live payment activation is included.
- Publication follow-up (2026-10-26): Chorlove Osh is published through additive migration `0140_publish_chorlove_osh.sql`; the migration tracker and configured catalog confirm the row. The authenticated creator save → publish → public-render → reopen integration passed, and `/api/catalog` includes Osh. Focused Osh checks pass 4/4. No external deployment or live payment activation.

## Published-template source-fidelity audit, batches 1–4 (2026-10-23)

- Reconciled report coverage for published IDs 1–12: Anor/Atlas/Aurelia (1–3), Beshik/Bitiruv/Bog‘i Eram (4–6), Bulbul/Chavandoz/Cloud Castle (7–9), and Doira/Evelina/Ganch (10–12). Batch 1 and 2 findings are now in `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_1.md` and `_BATCH_2.md`; the former batch 4 report is normalized to `SOURCE_FIDELITY_AUDIT_BATCH_4.md`.
- Rechecked all provider manifests and captures for rows 1–3. Marxaba has the exact Anor and Atlas sources; Invitate has Aurelia. Yoryor's matching Anor image is a standalone asset, not a complete template capture. Initial Anor/Bog‘i Eram/Sahifa cover findings compared `preview.webp` with the runtime opening and were superseded after checking the canonical original-site catalog assets; those local covers match the source assets. Atlas and Aurelia covers depict their actual source openings.
- The combined focused suites for rows 1–6 pass 48/48 after correcting three stale assertions that referred to an older preview-photo gate. They now verify the shared preview-only gate, creator upload precedence, and template-scoped venue samples. These were test expectation updates; no runtime implementation changed.
- Anor's separate cover task (`01a166ef-0ccd-7f41-a136-ffa150ca0bcd`) is superseded by canonical asset verification: local `preview.webp` is byte-identical to `https://www.marxaba.uz/templates/anor/preview.webp`, and the archived `meta.js` declares that asset. No replacement capture is needed; provenance is recorded beside the package.

## Retro Kino catalog artwork correction (2026-10-23)

- User requirement: replace the panel-only poster copy with the actual packaged `#intro` catalog opening, captured cleanly in portrait from the canonical preview fixture, with provenance and focused assertions. Keep all reference captures, source art, CSS/JS, adapters, galleries, and public behavior unchanged; no DB, publication, deployment, or payment changes.
- Confirmed source: Marxaba manifest `Nikoh/templates/retro-kino` contains the exact source. Its opening has film leader, greeting, credits, date, ticket, and open action; `preview.webp` is instead a byte-copy of the later `art/poster.webp`.
- The initial comparison incorrectly treated runtime `#intro` as the only valid catalog cover. The original Marxaba `meta.js` declares `preview.webp`, and its canonical URL serves the official 720×1280 catalog image. The package now contains that exact source file (SHA-256 `10d391f6…`); provenance and focused checks are updated. No renderer screenshot is needed to verify an unchanged official catalog asset.

## Sahifa catalog artwork verification (2026-10-23)

- User requirement: use the actual packaged Sahifa `#intro` as its catalog cover, portrait and without UI chrome. Keep `preview-sample.json` ephemeral, preserve all Marxaba source captures, keep empty public creator-photo galleries hidden, and make no DB/publication/deployment/payment changes.
- Confirmed the Marxaba manifest lists `Nikoh/templates/sahifa/index.html`; its source folder contains only index, metadata, template/motion CSS/JS, with no image assets or declared preview art. The local app's `/preview?template=sahifa` renders the canonical fixture in the genuine intro, including greeting, decoded names, issue/date lockup, and “Sonni ochish”.
- Capture is blocked by the permitted UI surface: its screenshot includes outer preview chrome, while browser evaluation is read-only and cannot access the iframe document needed to isolate the intro or set a portrait viewport. No alternate automation export or security bypass was used. Existing `preview.webp` remains unchanged pending a permitted clean capture. No template/data/runtime changes made.
- The initial comparison incorrectly required Sahifa's catalog image to equal its runtime `#intro`. The canonical Marxaba path `https://www.marxaba.uz/templates/sahifa/preview.webp` serves the exact bytes already packaged locally (SHA-256 `8aa4b7dd…`). The archived `meta.js` does not declare a preview property, so provenance records the source-path match and that caveat. No replacement renderer capture is needed.

## Suzani catalog opening cover repair (2026-10-23)

- User requirement: replace the confirmed panel-image mismatch with the actual packaged Suzani opening, using the shared preview fixture only for capture. Preserve all reference captures; no database, catalog publication, deployment, payments, or unrelated template changes.
- Researched all 13 provider capture manifests again. Only Marxaba contains the exact Suzani template source; its complete source folder has no `preview.webp` or alternate authentic opening image. The metadata keeps its `preview.webp` catalog path, now backed by a clean 450×800 render of the locked packaged `#intro`, including the stitched hoop, fixture greeting/names/date, and open control. The raw PNG and WebP, source/renderer/fixture hashes, manifest search, full viewport crop, Chrome version, and capture-only exclusions are recorded in `apps/web/public/templates/suzani/preview.provenance.json`; the focused test asserts the rendered-opening provenance and dimensions.
- Focused Suzani checks pass. Source capture folders remain untouched; no database, catalog publication, deployment, or payment state changed.

## Published-template source-fidelity audit, final batch (2026-10-23)

- Read-only configured-PostgreSQL catalog verification returns 51 published templates. Final IDs 49–51 are Toscana, Vals, and Yangi Uy, each priced at 150,000 UZS. Toscana and Vals are wedding category and support wedding/fotiha; Yangi Uy is category `yangi-uy` and supports `yangi-uy`/`osh`. Full audit: `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_17.md`.
- Searched every one of the 13 provider capture manifests and all matching provider files. Marxaba alone contains exact full sources: `Nikoh/templates/toscana`, `Nikoh/templates/vals`, and `Boshqa tadbirlar/templates/yangi-uy`. Captures were preserved.
- Toscana and Vals packaged openings, captured sections, source motion/control code, To‘yona card/holder hooks, and empty gallery bindings are present. Their shared renderer gates preview photos to ephemeral preview-only data and the public renderer hides creator-photo sections when no uploaded URLs exist. Reduced-motion source paths are present. Yangi Uy also retains its opening and sections, but its package README/provenance incorrectly point to a nonexistent Marxaba `Nikoh/templates/yangi-uy`; the complete capture is under `Boshqa tadbirlar`. Its cover is 478×668 (not portrait) and shows only the first viewport, not the full intro page. Its capture dependency includes `og.jpg` absent from the package, while packaged HTML correctly points to the current fixture-rendered cover. These are confirmed provenance/artwork issues.
- Focused suite (`toscana-template`, `toscana-preview-contract`, `toscana-preview-art`, `vals-template`, `yangi-uy-template`) reports 22/23 passing. The sole failure is Yangi Uy cover provenance: current fixture SHA-256 is `a88ccb99…`, matching the recorded provenance, while the test expects stale `54017a29…`. Do not change template code to mask this test issue. Fresh browser runtime, normal/reduced-motion interaction, console/network, and public empty/upload gallery checks were not run in this audit; static reduced-motion and data-path checks passed. No confirmed source runtime mismatch was found.
- Checked existing chats before repair creation; no existing owner was found. A separate Yangi Uy cover/provenance repair chat was created (`01a166d8-c482-76c2-94f9-24243d66ec75`). Toscana's README/browser claims were reviewed only statically. No template files, DB/publication, deployment, or payment settings changed.
- Browser follow-up in the in-app browser exercised all three openers in normal and `qaReducedMotion=1` modes. Toscana reached its complete normal and reduced opening states; Vals entered its dance interaction normally and left the untouched intro via reduced-motion skip; Yangi Uy faded out its intro with invitation content available in both modes. No console errors occurred. Toscana/Vals had no observed warnings. Yangi Uy logged GSAP missing-target warnings (`.program:before` and empty targets) and a Three.js `PCFSoftShadowMap` deprecation warning. The browser API exposed console/DOM but no subresource network-status event stream; subresource HTTP failures remain unverified. See Batch 17 report.

## Samarqand Kechasi catalog artwork and asset repair (2026-10-23)

- User requirement: replace the post-opening catalog art with a portrait capture of the actual locked `.intro`, using the shared preview fixture ephemerally (fixture event date/time `2026-11-14T18:30`), and preserve original captures. Also verify the packaged `art/door-leaf.webp` against the source and repair only this scoped issue. No database, publication, deployment, payments, or unrelated templates.
- Source investigation: Marxaba's captured Samarqand Kechasi folder and manifest omit `door-leaf.webp`; the packaged file is unsupported. The footer already has a captured `✳` portal mark, so its CSS now uses a radial background instead and the extra file was removed. The focused Samarqand contract test passes 4/4.
- The catalog now uses a clean 560×1280 capture of the locked Registon-and-lantern `.intro` from the local preview, with the `2026-11-14T18:30` fixture used ephemerally. Locale UI, page background, Next.js badge, and outer chrome are excluded. The raw PNG, source/fixture/artwork hashes, capture setup, and focused cover assertions are recorded alongside the template. All original captures remain untouched.
- The focused Samarqand contract and cover suite passes 5/5. Catalog registration, DB/publication, deployment, and payments were not changed.

## Sahro Fonusi catalog opening artwork (2026-10-23)

- User requirement: replace the 540×960 panorama-only crop with a clean portrait render of the complete packaged `.intro` using the shared preview fixture, excluding app/browser chrome and the injected locale control. Preserve captures; do not change catalog publication, database, deployment, or payments.
- The catalog now uses a 720×1280 capture of the packaged renderer's true `.intro`, including greeting, names/date, opening action, frame, and brass lantern treatment. The earlier half-background was a capture artifact: shared `qaReducedMotion=1` CSS applied `translate(-50%,-50%)` to `.intro__poster`, shifting its full-inset source box. Browser reduced-motion emulation now preserves the source's `scale(1.035)` geometry. Capture-session-only cleanup hid `.mh-lang` inside the renderer iframe and removed the outer preview's `nextjs-portal` host; template/runtime/UI files were not changed. Fixture, source, raw-capture, and output hashes plus geometry are in `apps/web/public/templates/sahro-fonusi/preview.provenance.json`. The focused suite passes 7/7. No database, publication, deployment, or payment state changed.

## Shahzoda catalog opening cover repair (2026-10-23)

- User requirement: remove the shared runtime-injected `.mh-lang` language control from Shahzoda's 720×1280 catalog cover while preserving its actual curtain/plaque opening and canonical fixture name/date. The control was hidden with temporary CSS injected only into the same-origin iframe during capture; neither the source template nor the real invitation UI changed. The screenshot and fixture hashes and capture setup are recorded in `apps/web/public/templates/shahzoda/preview.provenance.json`; the focused Shahzoda suite passes 7/7. No database, catalog publication, deployment, payment, or other-template state changed.

## Native browser prompts (2026-10-23)

- User requirement: the website must never ask through native browser `prompt()`, `confirm()`, or `alert()` dialogs. Use in-page modal dialogs for input and confirmation throughout the dashboard, admin tools, guest moderation, and invitation templates.
- The dashboard unpublish action, template hiding, wish deletion, and Velvet calendar day selection use modal interfaces. Continue replacing any native browser prompt APIs found in future work.

## Published-template source-fidelity audit, batch 14 (2026-10-23)

- A full live ID-order cross-check found that Qog‘oz Turna, Retro Kino, and Sahifa (positions 40–42) had been listed as the next entries after Qiz Bazmi but had no completed report. Their audit is now recorded in `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_14.md`.
- Focused source-parity checks pass after correcting a stale Retro Kino empty-gallery assertion. A later regression gate now deliberately fails on the unresolved Retro Kino cover. Confirmed catalog fixes are separately tracked: Qog‘oz Turna's opening cover shows a 2026 date while the canonical fixture is 2027; Retro Kino's cover is the later blank hero poster rather than its distinctive intro; Sahifa's cover is the later editorial hero rather than its opening page. Repair chats: `01a166e7-a16d-7792-8f08-1728210d0aed`, `01a166e7-6f15-7dd1-b956-b6f538dc89a6`, and `01a166e7-cb83-7761-ad08-c1783a7a0cab`.
- The capture tasks found no permitted route to save a clean portrait image: Qog‘oz Turna's screenshot interface exposed no rendered asset; the Retro Kino and Sahifa browser views could display the real intro but could not save an isolated iframe capture. Local browser UI remains disabled in Work settings. No alternate automation export or browser-security bypass was used; the current covers and source captures remain unchanged. See Batch 14 for the precise remaining cover work.
- Batch numbering is aligned with the actual 51-row catalog. Reports previously labelled batches 14–16 covered positions 43–45, 46–48, and 49–51; their filenames and headings are now batches 15–17. Batch 13's row positions were corrected from 36–38 to 37–39. No template or publication state changed during this documentation correction.

## Published-template source-fidelity audit, batch 15 (2026-10-23)

- The configured PostgreSQL catalog returns 51 published templates. The next entries after Sahifa are Sahro Fonusi, Samarqand Kechasi, and Shahzoda, each at 150,000 UZS. Their category/event compatibility and the next IDs are recorded in `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_15.md`.
- Searched all 13 provider capture manifests and the complete local capture tree. Marxaba is the only provider with complete template-level source captures for these three designs; original captures remain untouched.
- Confirmed catalog-art inconsistencies: Sahro Fonusi uses only a crop of its panorama background instead of the full opening composition; Samarqand Kechasi shows its later hero rather than the locked intro and the cover time is 18:00 while the fixture says 18:30; Shahzoda's opening cover includes the shared runtime's injected `.mh-lang` control. Samarqand's packaged `art/door-leaf.webp` has no matching source file in its capture folder and its canonical source remains unresolved.
- Focused source/contract/gallery checks pass 20/20. A fresh Playwright run against the local preview route confirmed all three openings in normal and OS-emulated reduced-motion modes (6/6; HTTP 200, opened states reached, no page errors or failed HTTP responses). Separate repair chats were created for each confirmed cover issue (Samarqand also includes source-asset provenance). No template, asset, database, publication, deployment, or payment state changed in this audit.

## Published-template source-fidelity audit, batch 16 (2026-10-23)

- Read-only configured-DB verification confirms Shirin Bayram, Somon Yo‘li, and Suzani are the next three published IDs after Shahzoda, all at 150,000 UZS. Category and supported-event mappings are in `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_16.md`.
- Searched all 13 provider capture manifests and each capture folder. Marxaba is the only provider with complete sources for these designs; E-invitation has no capture manifest or exact-ID match. Original captures remain untouched.
- Shirin Bayram and Somon Yo‘li catalog openings match their documented design/cover choices. Suzani's `meta.js` names a `preview.webp` absent from its source folder; the panel-based cover was repaired by the separate task `01a166d5-36c1-7813-8e25-4c793a1288f3`, which captured the packaged renderer's locked opening at 450×800 with fixture/provenance hashes. Its focused test passes 5/5; original captures and publication state remain untouched.
- The combined focused checks pass 21/21 after fixing the stale Shirin Bayram `extras.celebrant` assertion (the expected mapping was present; the regex had not allowed a trailing comma). Batch 16 browser follow-up reached the opened state for Shirin Bayram and Suzani in normal and reduced-motion runs. A resumed Chrome preview also confirmed Somon Yo‘li reaches `body.is-open` with the intro hidden after one activation in both normal and reduced-motion modes; details are in the batch report. No uncaught page errors or completed HTTP error responses occurred in the recorded runs. One generic console 404 in normal Shirin Bayram had no corresponding completed response; shared editor-sections requests were aborted at navigation. Gallery and venue media behavior remains unverified. Suzani's opening-cover repair is recorded in `apps/web/public/templates/suzani/preview.provenance.json`.
- No source/template, database/publication, deployment, or payment changes were made.

## Oltin Nur catalog cover repair (2026-10-23)

- User requirement: replace the post-opening hero cover with the clean portrait capture of the canonical Marxaba renderer's initial `.intro`; preserve the capture, record provenance/hashes, and add focused verification. The settled 720×1280 source render is stored at `apps/web/public/templates/oltin-nur/preview.webp`, with raw capture and dependency checksums in `preview.provenance.json`.
- Source correction: the captured CSS explicitly hides the name/date lockup on the initial cover until the seal-opening sequence. Keep that source behavior; document it rather than changing the source or synthesizing an alternate state.
- The capture excludes `.mh-lang`, browser/app chrome, and scrollbars. No catalog publication, database, deployment, or payment state changed.

## Published-template source-fidelity audit, batch 13 (2026-10-23)

- The configured PostgreSQL catalog returns 51 published templates in ID order. Reconfirmed entries 36–38 are Qandil, Qatlam, and Qiz Bazmi, each at 150,000 UZS. Their category/event compatibility is recorded in `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_13.md`; the next three IDs after Qiz Bazmi are Qog‘oz Turna, Retro Kino, and Sahifa.
- Searched every one of the 13 provider capture manifests and the complete local capture tree. Marxaba is the only provider with complete template-level captures for these IDs. Invitate's `qandil.png` is an unrelated fairy asset. All original captures remain untouched.
- Qandil and Qatlam source/package markup, CSS, JavaScript, fonts, and artwork parity checks pass; Qiz Bazmi's captured markup, scripts, styles, metadata, and artwork checks pass. The three portrait covers visibly show the designs' distinctive source openings. Source and adapter reduced-motion paths exist. Shared fixture stays preview-only; these templates have no source gallery-photo samples to substitute for empty preview galleries, creator uploads populate the gallery, and the shared public renderer hides empty creator-photo sections. No confirmed template repair is needed.
- Focused run: 31/32 passed. Qiz Bazmi's sole failure is a stale test expecting a superseded `hideIf('gallery',...)` expression; the current shared runtime hides empty galleries based on absence of real URLs. An expanded shared integration run also fails an unrelated stale Bulbul cover-path assertion. Neither failure establishes a mismatch in this batch. Follow-up headless Chrome verification ran all three preview routes in normal and reduced-motion mode (6/6 opening controls completed); the reduced sessions confirmed both media emulation and the preview reduction flag. No template asset responses failed. The app shell's `/favicon.ico` returned 404; a shared editor script request was navigation-aborted. No page JavaScript errors were observed. Template source, DB state, publication, deployment, and payment settings were unchanged; no repair chats were needed.

## O‘rik Guli catalog-opening cover repair (2026-10-23)

- User requirement: replace the raw `art/view-0.webp` catalog cover with a clean portrait render of O‘rik Guli’s actual initial opening from its packaged source renderer. Preserve reference captures and do not change the shared renderer, publication, database, deployment, or payments.
- The cover is now a 480×720 render of the locked intro from the full template preview using the shared sample fixture ephemerally. The crop includes the paintings, window, fog and traced initials, greeting, petals layer, opening bands, and wipe prompt; app controls and browser chrome are excluded. Provenance records the fixture, route, crop, dimensions, and output hash.
- The O‘rik Guli source test checks capture integrity and verifies catalog art is the rendered opening rather than the raw painting. Catalog and publication state are unchanged.

## Oltin Yosh catalog opening cover repair (2026-10-23)

- User requirement: replace the 450×800 Oltin Yosh catalog/selection cover because the old source-rendered opening included the app-injected locale selector. Keep the reference capture untouched, use a clean full-ratio render of the true closed opening, and do not change the shared renderer, publication, database, deployment, or payments.
- The capture manifest declares `preview.webp`, but it is absent from the local source folder. Recaptured the packaged renderer at 450×800 / DPR 1 with the centralized preview fixture; capture-session-only CSS hid `.mh-lang` and the Next.js development portal. The template package and app source styles were not altered for capture cleanup. Preview artifact SHA-256 is `63b3f6c0…1decf4f`; fixture hash, route, capture setup, dimensions, and checksum are in `apps/web/public/templates/oltin-yosh/preview.provenance.json`.
- Updated the focused Oltin Yosh package test and adapter README to verify/document the clean cover provenance. No catalog registration, renderer, publication, database, deployment, or payment change is part of this repair.

## Oltin Uzuk catalog opening cover correction (2026-10-23)

- User requirement: replace the post-opening ring hero used as the Oltin Uzuk catalog cover with a clean portrait capture of the canonical Marxaba `#intro` opening. Keep the captured source untouched, keep gallery/venue samples ephemeral, and limit this repair to the cover, provenance, and focused checks; do not alter database, publication, deployment, or payment state.
- The catalog now points to `apps/web/public/templates/oltin-uzuk/catalog-cover-opening.png`, a 450×800 capture of the captured `#intro` page using the shared Uzbek Latin preview fixture. It shows the source-defined hand-and-ring CSS fallback scene with the invitation copy and opening action; the later `.hero` is excluded. For this static capture only, the `.intro__fallback-scene` is revealed and `.rx--intro` photo rig plus the shared locale selector are hidden. Source, fixture, viewport, capture state, overrides, and artwork SHA-256 values are recorded in the package provenance and covered by a focused test. The owner rechecked this corrected composition and reports the focused preview/localization checks pass 7/7.

## Oq Kabutar catalog cover repair (2026-10-23)

- User requirement: make Oq Kabutar's catalog and selection cover show its real closed opening rather than the post-opening hero. The cover is a clean portrait capture of the packaged source renderer using the shared preview fixture; the capture remains untouched, and publication, DB, deployment, and payments are out of scope.
- The typed catalog now points to a 450×800 opening render. Source, fixture, and image hashes plus capture exclusions are recorded in `apps/web/public/templates/oq-kabutar/preview.provenance.json`; focused cover checks lock the opening structure and provenance.

## Oltin Kuz preview media gap repair (2026-10-23)

- User requirement: use Oltin Kuz's authentic captured venue and gallery artwork in catalog and blank-selection previews as ephemeral media. Creator uploads take precedence; preview images must never be persisted, and public creator-photo sections remain hidden when empty. Keep captures untouched; do not change catalog publication, database, deployment, or payments.
- The shared Marxaba preview adapter now maps the six media paths named by Marxaba's captured sample overrides (`art/venue.svg` and `art/memory-01.svg` through `memory-05.svg`) into preview payloads only. All six packaged assets are tested byte-identical to the capture, and gallery alt text is localized across the four supported locales.
- Any authored gallery photo suppresses the source sample gallery and venue sample. Preview payload mapping does not mutate invitation content; public rendering receives no sample media. Source provenance and these guarantees are covered in `apps/web/public/templates/oltin-kuz/SOURCE_ADAPTATIONS.md` and `tests/oltin-kuz-package.test.ts`.

## Published-template source-fidelity audit, batch 10 (2026-10-23)

- The configured PostgreSQL catalog confirms 51 published templates. The next consecutive IDs after Nilufar are Oltin Kuz, Oltin Nur, and Oltin Uzuk, each published at 150,000 UZS. Oltin Kuz is in category `birthday` and supports `birthday`/`yubiley`; Oltin Nur and Oltin Uzuk are in category `wedding` and each supports `wedding`.
- Searched all 13 provider `capture-manifest.json` files. Only `Marxaba/capture-manifest.json` declares these templates: Oltin Kuz under `Tug'ilgan kun va Yubiley/templates/oltin-kuz`, and Oltin Nur/Oltin Uzuk under `Nikoh/templates`. Captures remain untouched.
- Confirmed Oltin Kuz preview imagery is missing from the shared preview adapter: the captured `sample-overrides.js` uses `art/venue.svg` plus `art/memory-01.svg`–`art/memory-05.svg`; all six source assets are already packaged byte-identically. The app's catalog/initial-selection preview currently renders six empty gallery slots and no venue photo. Creator uploads must continue replacing preview-only images, and public empty creator-photo sections must stay hidden.
- The Oltin Nur and Oltin Uzuk catalog covers are portrait images without browser/app locale chrome, but show their post-opening hero screens. Their captured first sections are distinct invitation openers with seal/open controls; those initial pages are absent from the current covers. The captures' local folders do not contain the metadata-declared `preview.webp`, so the current cover provenance cannot be tied to the captured source asset. Separate repairs are required for both covers.
- Focused command `pnpm exec tsx --test tests/oltin-kuz-package.test.ts tests/oltin-nur-preview.test.ts tests/oltin-uzuk-preview.test.ts tests/oltin-uzuk-localization.test.ts` reports 16/17 passing. The sole failure is a stale adapter test assertion in `tests/oltin-kuz-package.test.ts` that expects the older `extras` expression in the shared renderer. Preview-fixture isolation, current adapter behavior, sections, localized content, optional To'yona rows, captured asset/style guards, and reduced-motion paths were statically checked. Fresh browser motion/reduced-motion sessions were not run.
- At the initial audit handoff, separate repair tasks were requested for the three confirmed template issues, but the Codex `create_thread` tool returned `create_thread received invalid arguments`; that was a handoff failure at the time, not a remaining product blocker. Subsequent separate owner tasks resolved all three findings: Kuz's preview-only sample imagery mapping is covered by focused checks passing 8/8; Nur's clean 720×1280 `#intro` cover is covered by 5/5; and Uzuk's corrected hand-and-ring fallback `#intro` cover is covered by 7/7. Owners reported no remaining blockers. No database or publication state changed.

## Published-template source-fidelity audit, batch 11 (2026-10-23)

- The configured database confirms the next entries after Oltin Uzuk are Oltin Yosh, Oq Kabutar, and O‘rik Guli, all published at 150,000 UZS. Their category/event compatibility is birthday with birthday/yubiley, wedding with wedding, and wedding with wedding/fotiha/qiz-uzatish, respectively.
- All 13 provider capture manifests and the full capture tree were searched. Only Marxaba contains these complete sources. Source, assets, contract wiring, galleries/To‘yona, opening interactions, and reduced-motion paths were checked; source captures remain untouched. Focused tests pass 21/21. Fresh browser and OS reduced-motion sessions were not run.
- Confirmed separate catalog-art repairs: Oltin Yosh's otherwise authentic portrait cover has the app locale selector baked into it; Oq Kabutar uses its post-opening hero instead of its distinct dove-and-ribbon opening; O‘rik Guli uses only the raw first background asset, omitting the actual window-wipe opening composition. Repair tasks: `01a166c0-5048-71d0-b8a2-f01383585ee3`, `01a166c0-7ffb-7bb3-bb23-b365e6ea38b3`, and `01a166c0-9433-7e23-88e3-af9f413f667c`.
- Browser follow-up: production preview routes were exercised in Chrome at 450×800 in normal and reduced-motion modes. Reduced-motion opens completed without CSS animation; Oltin Yosh and Oq Kabutar reached the hero normally, while the O‘rik Guli normal screenshot at 3.6 seconds remained in its long authored transition. No uncaught page errors or completed HTTP error responses were captured. Generic resource 404 console messages appeared once in normal Oltin Yosh and O‘rik Guli runs, but the associated observed requests were aborted and no missing template asset was confirmed. Details and artifact path are in `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_11.md`.

## Paxta catalog opening artwork repair (2026-10-23)

- User requirement: recapture Paxta’s closed opening from the packaged source renderer with the canonical fixture date, preserve the source capture and publication/database state, and tie the displayed date to the fixture in provenance and focused checks.
- The 720×1280 cover now displays “Shanba, 12 iyun 2027,” rendered from fixture start time `2027-06-12T17:00`. The capture excludes the injected language selector and Next.js development badge. Its screenshot remained ephemeral; source captures and published state were untouched. The Paxta focused suite passes 8/8.

## Published-template source-fidelity audit, batch 12 (2026-10-23)

- The configured database confirms 51 published rows and the next IDs after O‘rik Guli are Oynavand, Parda, and Paxta. All are 150,000 UZS in category `wedding`; supported event types are Oynavand `wedding`, Parda `fotiha`/`qiz-uzatish`/`wedding`, and Paxta `fotiha`/`wedding`.
- All 13 provider manifests were searched; only Marxaba declares the three complete captures. Focused source/contract checks pass except one Parda preview-provenance assertion: its recorded fixture hash is stale. Paxta's opening cover visibly has an outdated 2026 date while the shared preview fixture is dated 2027-06-12. Follow-up browser checks verified normal and reduced-motion opening interactions for all three (6/6), with no template asset failures or page JS exceptions; the app favicon returned 404. Source captures, code, database, and publication state were unchanged. See `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_12.md`.
- Separate project repair tasks: Parda provenance `01a166c4-d665-7b63-93af-59d530b56f57`; Paxta opening cover `01a166c5-6e2f-7721-8ab0-fc859b9eeff5`.
- Follow-up: browser interaction and OS-emulated reduced-motion checks pass 6/6. The separate Parda repair refreshed the fixture hash (focused test 5/5); the Paxta repair recaptured the closed opening with the fixture date (focused suite 8/8). Browser diagnostics found only an app-shell favicon 404 and app requests aborted during iframe/navigation changes; no template asset failures or page JavaScript exceptions.

## Published-template source-fidelity audit, batch 9 (2026-10-23)

- The configured database confirms 51 published templates and the next consecutive IDs after Muhr are Nahor, Nahorgi Osh, and Nilufar. All are published at 150,000 UZS; their category and event compatibility are recorded in `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_9.md`.
- All 13 provider capture manifests were searched. The canonical complete template source for these IDs is in `Marxaba/capture-manifest.json`; a separate Invitate page and assets with “Nilufar” in their names are not the Marxaba Nilufar template source. Captures remain untouched.
- Source markup, styles, scripts, fonts, animation, localization, To‘yona/RSVP/wishes wiring, blank creator-photo behavior, and ephemeral preview-fixture mapping were checked. Focused checks pass 25/25. Nilufar catalog art is byte-identical to its source poster; Nahorgi Osh has a clean 720×1280 opening render. Nahor's 480×720 cover has the app-injected locale switcher baked into the upper-right corner. The separate Nahor repair task is `01a166b8-375e-7680-a746-abcda7e8de0f`; no implementation change belongs in this audit.
- Local visual review found no injected app chrome on the Nahorgi Osh or Nilufar covers. Source artwork remains template-owned; preview fixture gallery slots stay ephemeral, creator uploads take precedence, and public empty creator-photo galleries remain hidden. See the batch report for details and limits.

### Nahor catalog cover correction (2026-10-23)

- User requirement: remove the app locale switcher baked into Nahor's catalog cover by capturing the authentic opening from the packaged renderer; preserve the reference capture and update provenance and focused tests.
- The corrected 480×720 WebP is captured from `/preview?template=nahor&qaSilent=1&qaReducedMotion=1` with bundled Playwright and headless Chrome at DPR 1. Capture-only styling hides the injected `.mh-lang` control inside the iframe and removes the outer Next.js `<nextjs-portal>` host, which contained the shadow-root dev mark. Source HTML, CSS, artwork, and runtime remain unchanged. Keep `preview-capture.png` as PNG render evidence and record both checksums in provenance. Visual inspection confirms no injected controls; the focused Nahor suite passes 8/8.

## Published-template fidelity audit, batch 8 correction (2026-10-23)

- Muhabbat Kitobi's canonical Marxaba capture includes the Story section and its story CSS. Batch 8's initial audit incorrectly treated the section as absent. Preserve captured `index.html`, CSS, motion files, and `template.js`; the actual packaged-body discrepancy was a stray blank line. The Marxaba bridge maps typed top-level `Invitation.story` to source-native `extras.story` and omits the duplicate top-level story payload for this template. Focused Batch 8 checks pass 22/22, including the corrected catalog-opening artwork assertion.
- Muhabbat Kitobi's catalog cover now shows a clean 430×932 capture of the source's closed-book opening, including its ribbon greeting and open action. Checksum provenance and a focused opening-art assertion were added; the original capture and publication state were left unchanged. Its focused cover suite passes 5/5.

## Published-template source-fidelity audit, batch 8 (2026-10-23)

- The configured database confirms the next published IDs after Lola are Monogram, Muhabbat Kitobi, and Muhr (51 published rows total). All three are published at 150,000 UZS in the wedding category; supported event types are recorded separately in `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_8.md`.
- All 13 provider manifests were searched; only `Marxaba/capture-manifest.json` declares these source folders. Monogram and Muhr preserve the captured presentation and their portrait openings. Muhabbat Kitobi's captured HTML already contains its Story section; its captured stylesheet, motion files, JavaScript, metadata, and four still-life assets match the packaged source after line-ending normalization. The only body-parity defect was one extra blank line, which was removed. The adapter maps localized top-level invitation chapters into the capture's `extras.story` slot and suppresses duplicate generic story rendering.
- Monogram's package notes now match the configured catalog's published state, 150,000 UZS price, category, and supported event types. This was a documentation-only correction; catalog state and captures did not change.
- Focused source/contract suite: 22/22 pass. The web TypeScript check passes. Browser interaction and reduced-motion runtime checks were not rerun; captured source and adapter motion paths were inspected statically. Source captures remain untouched.

## Published-template source-fidelity audit, batch 7 (2026-10-23)

- Reconfirmed from the configured database that the next IDs after Korporativ are Ko‘zgu, Kuzgi Chinor, and Lola (51 published rows total); categories, event types, and 150,000 UZS prices are recorded separately in `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_7.md`.
- All 13 provider manifests were searched; only `Marxaba/capture-manifest.json` declares the source paths. Ko‘zgu and Kuzgi Chinor have no confirmed source or catalog-art defect, and their authentic portrait covers are visually clear of injected UI. Neither source supplies sample gallery photos.
- Lola's 480×900 catalog cover visibly includes the app-injected language selector. Its separate repair task is `01a166a8-fc37-7483-ba8f-a3e5b50e1bde`; keep the original capture unchanged and avoid shared-renderer edits during concurrent repair work.
- Focused source/fixture suite passed 20/20. Browser interaction and reduced-motion QA were not rerun for this batch.

## Ganch catalog-art provenance correction (2026-10-23)

- User requirement: refresh Ganch catalog art from the production preview route and current shared fixture when provenance hashes are stale. Keep the captured Marxaba source and assets untouched, keep publication state unchanged, and correct documentation to match migration `0085_publish_ganch.sql`.
- New user requirement: use authentic original-source imagery in catalog and template previews wherever available, strictly as preview-only content that is never saved to creator invitations. Public creator-photo galleries and optional photo slots remain hidden until the creator uploads an image; template-owned artwork remains visible.
- Anor and Atlas implementation: their catalog and blank-selection previews fill the six empty gallery slots with authentic images from their packaged source assets only when there are no creator-uploaded gallery URLs. This is renderer-only ephemeral data; authored uploads replace it and public empty galleries remain hidden.
- Ganch's verified catalog capture is the 430 × 932 closed-door Uzbek opening from `/preview?template=ganch&qaSilent=1`, using the captured door and medallion artwork; its fixture and image SHA-256 values are recorded in `preview.provenance.json`.

## Published-template source-fidelity audit, batch 5 (2026-10-23)

- Confirmed the canonical captures for Glass Pink, Golden Card, and Green Garden are all in `Chorlove/capture-manifest.json`; no other provider manifest contains these IDs. Each capture is a Next.js server-rendered HTML snapshot, not a standalone original JavaScript/CSS package. The application adapters provide the interaction and reduced-motion behavior; preserve this limitation in future fidelity claims.
- Catalog-art finding at audit time: Glass Pink (392×720) and Green Garden (390×720) covers were app-preview screenshots with the language selector and scrollbar baked into the image. Golden Card's 335×469 art showed the complete closed-card opening and open button without screenshot UI.
- Source provenance findings at audit time: Glass Pink did not preserve the raw HTML capture beside its provenance. Golden Card and Green Garden preserved snapshot text with line-ending differences from their archives. Green Garden's preview fixture hash was stale. The Green Garden items are resolved below; do not modify reference captures.
- Focused verification at audit time: `node --check` passed for the four staged Glass Pink, Golden Card, and Green Garden bridge scripts. Glass Pink and Golden Card tests could not import the unlinked workspace package `@taklifnoma/contracts`; Green Garden had 3 passing and 2 failing checks (source byte hash and stale fixture hash). No dependencies were installed during that audit.

### Green Garden source and preview correction (2026-10-23)

- Restored `source/preview-frame.html` byte-for-byte from the sole canonical entry in `Chorlove/capture-manifest.json` (90,075 bytes; SHA-256 `d7ba584a…204a8`). Refreshed the shared fixture hash to `54017a29…8871`.
- Replaced the UI-contaminated cover with a 390×720 full-viewport capture of the packaged renderer's floral opening. It has no crop or resize; browser/app UI, language selector, scrollbar, and development portal are excluded. Provenance records source, fixture, and artifact checksums.
- User correction (2026-10-26): Green Garden's captured source preview directly uses six Orchid Amplop gallery photos in a fixed sequence and a venue sample photograph. Use these exact source media in the catalog and blank initial-selection previews only; keep them out of invitation storage/publication. Creator uploads replace preview photos, and hide the gallery in creator/public views when no creator image is present. This template-specific source use supersedes the earlier exclusion of these six photos for Green Garden; it does not authorize unrelated sample imagery.
- Focused Green Garden checks pass 6/6 and `node --check` passes. Publication, price, and event compatibility are unchanged; To'yona card details remain contract-bound.

### Glass Pink raw source and preview-media repair (2026-10-23)

- User requirement: preserve a byte-identical copy of the canonical `Chorlove/Web invitations/templates/glass-pink/preview-frame.html` beside its provenance; keep the archived capture untouched and exclude Chorlove's site runtime and example invitation data from the runnable package.
- User requirement: use authentic Glass Pink source artwork in catalog and blank-template previews, only as ephemeral preview content. Creator photos replace preview content, sample media never enters saved/public invitations, and public optional galleries stay hidden until a creator uploads a photo.
- Source audit: all six captured Glass Pink gallery references point to Orchid Amplop sample photos in `Chorlove/capture-manifest.json`, so exclude them. No original Glass Pink gallery photographs are present; preserve the package's own floral/decorative assets and empty preview-only gallery slots.
- The production package now preserves the 90,239-byte source snapshot with SHA-256 `dcb16406…06f2`; the typed catalog points to a 432×768 source-rendered envelope capture and its provenance pins the canonical fixture hash. Focused checks pass 7/7 and both staged bridge scripts pass `node --check`.
- Follow-up completed (2026-10-23): the lower-right white arc was the fixed music-toggle control in the packaged page, not source artwork. Captured a clean 432×768 initial envelope directly from the packaged renderer with that preview control hidden; source artwork, opening, and public music behavior remain intact. Updated capture provenance and SHA-256; focused Glass Pink checks pass 7/7.
- Follow-up completed (2026-10-23): the earlier overlapping-letter candidate was captured before the source fonts and finite reveal completed. A new 432×768 renderer-iframe capture waits for `document.fonts.ready`, verifies Fz Qellia/Cormorant Garamond/The Nautigal loaded and the reveal animations finished, and hides only injected language/music controls, the Next.js badge, and scrollbar for the screenshot. Visual inspection confirms one title and one opening action with the full floral envelope; the catalog cover is now eligible and its hash is `66b58de5…4bb00b`. The archived source snapshot and runtime behavior are unchanged. Since the archive contains no original JavaScript runtime, animation timing parity remains unavailable to verify.

## Published-template source-fidelity audit, batch 6 (2026-10-23)

- The configured database has 51 published templates; the next sorted IDs after Green Garden are Hilol, Konfetti, and Korporativ. Their publication/category/event compatibility and migrations 0072, 0065, and 0074 were verified against PostgreSQL.
- The source captures for all three exist only in `Marxaba/capture-manifest.json`. Source parity, local typography, reduced-motion code, shared interaction wiring, To‘yona/wishes mapping, and portrait cover dimensions were checked; detailed evidence is in `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_6.md`.
- Confirmed repair items: Hilol and Konfetti cover captures include the app-injected language bar and omit source-gallery preview images recorded by their original sample overrides. Korporativ omits its captured source-gallery preview images and its typed fallback/test/package notes say unpublished while PostgreSQL says published.
- The preview repairs for Hilol, Konfetti, and Korporativ are complete. Their combined focused suite passes 26/26. Korporativ's 450×800 live preview opens in normal and reduced-motion modes; its four preview SVGs load, gallery navigation advances, and RSVP choices update without submitting. The preview uses the lite CSS fallback, so the full-tier Three.js scene remains unverified. Locale switching, additional responsive sizes, and RSVP save/reopen are also unverified; see Batch 6.
- Korporativ correction: migration `0074_publish_korporativ.sql` is already applied and PostgreSQL/public catalog verify it published at 150,000 UZS. The typed fallback and package notes must reflect that state; no database change is part of the repair. Its four captured gallery SVGs belong only in catalog/initial-selection preview payloads, with creator uploads taking precedence and public empty galleries hidden.

## Glass Pink catalog cover correction (2026-10-23)

- User requirement: compare the published cover with the exact Chorlove source opening; keep the capture untouched and use the packaged source renderer to make clean portrait artwork without UI chrome.
- Located the canonical source at `Chorlove/Web invitations/templates/glass-pink/preview-frame.html`, listed in `Chorlove/capture-manifest.json`. Its SHA-256 remains `dcb16406f91a3fb12241f75a97fc0fa5eca95c0aba0a6bc9e0d95953cce806f2`. The capture is server-rendered HTML plus assets; the original template JavaScript runtime is absent.
- Replaced the catalog mapping from the 392×720 app-preview screenshot with a 432×768 local render of the packaged source opening envelope. The first cover was rejected for overlapping lettering and its control arc. Central audit commit `cfeded0` supersedes that image with the settled, font-ready renderer capture at SHA-256 `66b58de5fab291089494816422ef67547c258d5cc3787a9e607f57c6984bb00b`; it uses the canonical preview fixture and excludes the injected language picker, music toggle, Next.js badge, and scrollbar. Visual inspection confirms one title and one opening action without overlap. `source/provenance.json` marks the cover eligible. The raw source snapshot remains byte-identical; the archive lacks the original template JavaScript, so original animation timing parity is not claimed.
- The Glass Pink focused test and bridge syntax checks pass; batch 5 passes 18/18. No migration, publication, database, deployment, or payment state changed.

- Follow-up (2026-10-23): restored Golden Card's staged `source/preview-frame.html` byte-for-byte from the canonical Chorlove capture (39,134 bytes; SHA-256 `75ac0b6d0edd52500a4a24cc15ed001fa6a0230571ce461a33859703180cc888`). Provenance now records matching archive and preserved-copy hashes/lengths, and the focused test guards both. The 335×469 catalog art remains unchanged. The complete provider-manifest search found only three Golden Card source images (corner, mandala, navy texture), all packaged byte-identically and used by the real renderer; the capture includes no gallery/photo images or gallery section. Empty-selection preview gallery entries remain ephemeral with blank URLs, while a new Golden Card draft starts with an empty gallery. The focused Golden Card checks pass 4/4 and `node --check` passes.
- User requirement (2026-10-23): source photos may appear in catalog/blank previews only when the reference actually includes them; those samples remain ephemeral, creator uploads replace preview samples, and public invitations hide optional creator-photo sections when no creator image exists. Golden Card has no source gallery/photo imagery or optional gallery section, so its captured renderer artwork remains the only displayed imagery; creator gallery content is not injected into this reference renderer.
- User correction: use authentic image assets from each original template in catalog and initial template previews wherever those assets belong to that template. Preview-only images are ephemeral and must never be saved to creator drafts or published invitation content; creator-uploaded images replace preview imagery. Public creator-photo galleries stay hidden until at least one creator image exists. Template-owned opening and decorative artwork remains visible independently of gallery content. Do not use unrelated cross-template/site sample photos as if they were original template assets.
- Follow-up (2026-10-23): Glass Pink, Golden Card, and Green Garden source-fidelity repairs and their 18/18 focused checks were committed as `616783a4` (`Restore Chorlove template source fidelity`). Green Garden's two archive-referenced leaf ornaments remain unavailable in the captured archive; the package records that gap without substituting unrelated art.
- Further Glass Pink motion follow-up (2026-10-23): restored the source's 450 ms opener pause, 600 ms fade, card/flower exit choreography, and valid Web Animations easing. Normal/reduced-motion browser checks and focused 9/9 checks pass; commit `a9a41c7c` records the scoped fix. The original capture is unchanged.
- Golden Card motion follow-up (2026-10-23): restored the captured 200 ms invitation delay, original Lobster font subsets, 34 sparkle loops, child transitions, and close/reopen/reduced-motion states. Normal/reduced-motion browser and focused 5/5 checks pass; commit `d9935c34` contains the scoped repair.
- Green Garden motion follow-up (2026-10-23): restored valid easing, source opener/hero/flower timing, seven To'yona ornament loops, and the captured schedule illustrations. Focused 6/6 checks pass in commit `5ae89fd2`; browser verification after these edits remains unavailable, and `leaf1-bloom.webp` is absent from the archive. Do not claim full motion parity until final browser review is possible.
- Modern Floral catalog-art correction (2026-10-23): exact source-declared opening is packaged as `apps/web/public/templates/modern-floral/catalog-opening.jpg`; 810×1754 JPEG, 58,677 bytes, SHA-256 `6c4de03a01ba15e3b462a519f34f3ad90a87b34851372a4f868aa0381e2052dc`, source URL `https://payment.chorlove.uz/media-assets/958746e5-dc6c-4540-ad17-2c6e692d2212/file`. Visual review confirms the authentic floral heart opener. The typed `previewImage` and public catalog metadata point to this path; the owner is still restoring source motion, so the template remains unpublished.
- Green Gold source-motion follow-up (2026-10-23): commit `66c21afd` restores the five-part opening, section/date/countdown/gallery reveals, ornament rotations, starbursts, wishes loop, reduced motion and source gallery lightbox from route module 995238 (`09cpm7sbnsw7i.js`, SHA-256 `cc9472f5f183b8f7fcbfe281f0cbdeaa573b774cc594e56446736694bfe09b75`). The focused motion test, both JavaScript syntax checks and scoped diff check pass. The broader existing suite still fails on an unavailable archived absolute path and shared CSS byte-count expectations; do not claim it passes. Green Gold remains unpublished pending authentic portrait art and release checks.
- Green White source-motion follow-up (2026-10-23; release update 2026-10-26): commit `fb07ddef` restores the source two-curtain opener, label/name-card and hero timeline, 42-star loops, cloud loops, source-specific reveals and reduced motion from route chunk `12pjntsqxzj70.js` (SHA-256 `8f9857bd0e9308808c0d876bed05168962a61e988afa1c8936a5c37689317c9f`). The source-rendered portrait cover and source gallery assets are verified. Current focused checks pass 10/10 and web typecheck passes. The authenticated creator save/publish/public-render/reopen lifecycle also passes. Migration `0147_publish_chorlove_green_white.sql` publishes it at 15,000,000 UZS for wedding events. Human review can follow; no external deployment.
- Lace source-motion follow-up (2026-10-23): commit `862e8d7b` restores the captured poster fade and opener timing, 2-second overlay exit, hero-name delay, section reveals and program-row stagger/thresholds, and reduced-motion behavior from `0j~ix342hy.sg.js` (SHA-256 `f8f02fc84097ac74933c62abdbf3f3ef676621bdc450f0686ac106fea836ed69`). Normal/reduced-motion browser checks and focused 3/3 tests pass; the source capture/module is unchanged.
- Love Sakura and Luxury Gold source-motion follow-up (2026-10-23): mixed commit `32fe08c6` contains only those two template packages and tests. Love Sakura restores its RSVP fade/rise, source music-button motion, API wiring and locale-safe rerender; focused 3/3, syntax and clean browser preview pass. Luxury Gold restores its source opening, 14-section reveal timeline, hero zoom, calendar/decorative loops, gallery/lightbox and reduced motion; focused 3/3, syntax/diff and source-opening preview pass. Neither template has its dedicated authentic catalog cover yet; keep both private.
- Modern Floral source-motion follow-up (2026-10-23): commit `633e4f0d` restores the source curtain/greeting/fade, petal fall, source viewport/stagger reveals, decorative loops, lightbox/control feedback and reduced motion; focused 3/3, syntax and HTTP 200 checks pass. The authentic 810×1754 source opening is committed with provenance. The shared typed `previewImage` pointer is present in the working tree but not in that commit; browser visual comparison timed out. Keep the template unpublished until the typed pointer is separately committed and visual parity/release checks pass.
- Jasmine White source-motion follow-up (2026-10-23; release update 2026-10-26): commit `c862128b` restores the captured opener/card/flower exits, ambient/burst petals, heart/sheens, hero/reveal timing and seven gift-flower loops, plus gift-modal enter/exit. Browser checked hero/petals and modal open/close. The authentic 432×768 portrait opener, source assets, four preview gallery images, and venue image are packaged with hash provenance. Current focused source test and web typecheck pass; authenticated creator save/publish/public-render/reopen passes. Migration `0148_publish_chorlove_jasmine_white.sql` publishes it at 15,000,000 UZS for wedding events. The phase of every ambient falling petal was not synchronized across the desktop source/package capture, so human visual review remains available; the captured timing/keyframe records and opener/gift modal behavior are source-matched. No external deployment.
- Lace release (2026-10-26): guarded migration `0150_publish_chorlove_lace.sql` publishes the existing 15,000,000 UZS wedding-only row; the configured catalog contains 64 published templates. Focused source/fixture checks pass 34/34, web typecheck passes, and authenticated publishing integration passes 15/15 including save → publish → public render → reopen. The captured source includes its optional gift-card section, which is preserved. Public Lace makes a one-time autoplay attempt when enabled music is received and keeps guest pause state across data/locale refresh and cover opening; audible playback remains subject to browser autoplay policy. Human visual follow-up may happen after publication. No external deployment or live payment activation.

## Cloud Castle catalog cover correction (2026-10-23)

- User requirement: replace the published Cloud Castle cover that showed a narrow browser screenshot with clean portrait artwork showing the captured opening page, using its exact local source style and assets. Keep the source capture untouched and search every provider manifest/package before concluding alternate source is absent.
- Audit result: the captured Cloud Castle page is a server-rendered snapshot; a later full chunk-archive search recovered its original route module `14t58uni224ve.js`, module 909129 (SHA-256 `81f9356f44be09216be952fd5a90739b0796f8825c9c7c398479b3d8205cee6b`). The catalog uses clean 720×1280 portrait opening art without language/music controls or scrollbar; the original capture remains unchanged.
- Follow-up (2026-10-23): commit `e3a9f28c` (`Restore Cloud Castle source motion`) restores source opening, hero, parallax and gift animation behavior. Normal/reduced-motion browser checks and `node --check` pass; focused checks pass 5/5.

## Marxaba source-fidelity correction (2026-10-23)

- User requirement: when auditing an existing published template, compare every production source file and its catalog cover with the authoritative local capture. Restore captured source exactly and keep any contract, localization, or service wiring in separate app adapter files. Preserve the capture itself untouched.
- User requirement: a catalog cover that is explicitly required to show the reference opening must be rendered from the original renderer and assets, then packaged at portrait aspect ratio. Do not approximate the page from CSS or screenshots.
- Anor/Atlas audit: the authoritative captures are the `Anor` and `Atlas` entries in `Marxaba/capture-manifest.json`. Keep their event and catalog publication state unchanged while repairing renderer fidelity. Do not research or record template-source rights.
- Follow-up (2026-10-23): restored byte-identical captured Anor and Atlas template styles/scripts/metadata/assets; Atlas's hosted body markup now matches the capture. Platform-only dynamic labels and the Anor contract hooks remain in separate adapters. Restored Anor's captured dress-code section and palette binding. Replaced Atlas's hero thumbnail with a 720×1280 opening-page render using the canonical catalog fixture. The Anor metadata image still depicts the opened hero while its initial capture shows the closed pomegranate; retain that distinct metadata artwork as the source explicitly names it `preview.webp`. Six focused Anor/Atlas test files pass; the captured Atlas opener transitions to the hero without browser warnings/errors. No external deployment or publication change.

## Published-template fidelity audit, batch 4 (2026-10-23)

- Audit confirmed Doira and Ganch originals in the Marxaba manifest and Evelina in the Invitate manifest after searching the full local capture tree. Their packaged binary art matches the named captures. Doira's captured body, CSS, and renderer scripts match after line-ending normalization; Ganch's body, CSS, renderer scripts, and images also match. Evelina's captured images, videos, and fonts match; its HTML/CSS/JavaScript are adapted in the application package.
- Audit finding: Ganch's catalog-capture provenance is pinned to an older preview fixture. The two focused Ganch art tests fail because the recorded fixture hash is `a88ccb99419b87f60e86f7470366f8badaa912db74ab67ad1f757aeeaf6d29c2` while the current shared fixture is `54017a292d4a5235593d93a5e2f8bca1fe3bab89433182fac912c5d948878871`. A separate Ganch artwork refresh task is open; publication remains unchanged.
- Resolved: Evelina preview provenance now points to the packaged captured hero and `preview.webp`, with both file hashes recorded. Its focused test checks that provenance paths exist and hashes match; the original 480×900 capture evidence and its checksum remain recorded. Catalog state is unchanged.
- Database audit confirmed the next published IDs in sorted catalog order are `glass-pink`, `golden-card`, and `green-garden`.

## Guest activity and Telegram wish notifications (2026-10-22)

- User request: improve the invitation activity page and notify the invitation owner through Telegram when a guest submits a new wish. Wishes remain pending until the owner approves them; notification does not publish guest content.
- Implementation choice: deliver Telegram notifications from the durable `jobs` queue with retries, and provide approve/hide buttons in Telegram plus a link to the owner's activity page. The owner must have opened the bot at least once so Telegram can deliver a private message; activity UI should explain how to connect if delivery is unavailable. Production must run a worker or scheduled queue processor; the local combined Telegram poller can process updates and wishes together.
- User-reported issue: the studio/publication flow can claim a future date has passed, even after correcting/reselecting it. Compare the stored local event time in the invitation's timezone to the current instant without relying on server/browser timezone conversion.
- Implementation choice: activity page gains wish status filters, submission times, and clearer pending counts/empty states while preserving existing RSVP, moderation, and private receipt functions.
- User request: make Telegram bot messages more attractive with improved formatting and stickers.
- Implementation choice: use Telegram HTML formatting with escaped user-provided values, concise Uzbek copy, and contextual emoji. Send optional welcome, onboarding-success, and new-wish stickers only when corresponding bot file ID environment values are configured; missing or invalid decorative stickers never block bot flows. Do not bundle a sticker ID from another bot or chat.
- User clarification (2026-10-22): guest wishes must reach the owner through the Telegram bot with approve and reject controls. Approved wishes appear publicly on the invitation; rejected wishes are deleted and never appear publicly. The bot's reject action uses the existing deleted status and soft-delete timestamp; public reads include only approved, non-deleted wishes.
- User requirement (2026-10-22): show invitation view counts. Count at most one view per anonymous browser per invitation in each rolling 24-hour period using an HttpOnly random cookie, store only a one-way hash for deduplication, and display the aggregate count on published dashboard cards. Do not collect IP addresses or retain a per-view event log.
- User requirement (2026-10-22): new invitation creation defaults the event type to Nikoh to‘yi. Keep the public catalog and creator design picker at two equal columns on mobile and provide design search in both places; search narrows the currently category- and event-compatible designs.
- User request (2026-10-22): improve mobile date/time selection so the time controls and confirmation action are not pushed far below the calendar; use a viewport-bounded picker that keeps the entire date and time task accessible.
- User correction (2026-10-22): keep each program item's time and title side by side on mobile, with enough room for the hour and minute controls; each row should read as “time, program name” before the next row.
- User requirement (2026-10-22): new invitations and newly added program rows start with a localized, editable example entry (“Mehmonlarni kutib olish”); creators can change or remove it like any other row. When adding a language, carry this example over in that locale only while it remains unchanged in an existing locale.
- User requirement (2026-10-22): program time choices must be scrollable; hour choices use whole hours and minute choices use five-minute intervals while retaining any existing non-five-minute value until changed. Give program names more room and show a live preview of each time/name row below its editor fields.
- User requirement (2026-10-22): program entries should use compact cards. Remove both drag behavior/handle and move-up/down buttons; keep the delete action.
- User requirement (2026-10-22): let creators set each program time directly in its invitation preview row.
- User correction (2026-10-22): keep “Taklifnomada ko‘rinishi” as a separate read-only schedule preview; edit the heading, times, and item names in the program editor above it.
- User correction (2026-10-22): keep the existing 300-character limit for program item titles and show their current character count.
- User requirement (2026-10-22): remove the creator-facing draft JSON download control and its export behavior.
- User requirement (2026-10-22): make the invitation activity header match the studio's clean top bar: back control, invitation name, and edit/refresh actions aligned in one sticky header; use the studio's plain arrow treatment for back/refresh and filled primary treatment for edit; keep long names readable without pushing controls offscreen.
- User requirement (2026-10-22): use the studio button pattern across the management dashboard and invitation activity page: shared sizing, rounded corners, typography, outlines, hover and focus states, with existing primary, destructive, and tab roles preserved.
- User requirement (2026-10-22): full template demo previews show navigation controls only while scrolling upward. Use a translucent circular back control at the top left and a separate “Yaratish” pill at the top right for published templates. Back returns to the design list even when the preview was opened directly; creation preserves the selected template.

## Database publication authorization (2026-10-21)

- User requirement: template tasks may apply the required additive migrations to the configured database and publish templates through the existing catalog mechanism once their release gates pass. An external/live database is not itself a blocker. Inspect current state, apply only required migrations, verify catalog publication, and commit the publication locally.
- External application deployment and live payment activation remain outside this authorization.

## Continuing template releases (2026-10-22)

- User request: proceed to each next source-backed template in the roadmap in sequence, continue through the remaining inventory, fix issues found, and publish completed templates so users can select them. Apply the established per-template source, contract, verification, migration, and local commit rules. Pause only for a concrete blocker that cannot be resolved in the project.
- User direction (2026-10-22): switch this implementation sequence from the concurrent Marxaba work to the captured Invitate designs and use an isolated branch to avoid overlap. Evelina is the first locally captured Invitate design that also appears in Invitate's current catalog. Its existing ignored reference capture is the source; do not duplicate or modify that capture. Continue through the Invitate inventory sequentially after each design passes its release gates.
- User correction (2026-10-23): for every source-fidelity audit, search all local provider/archive directories, manifests, aliases, and asset paths before declaring a same-named capture or source asset absent; the production package does not establish the capture provider. Compare catalog art with the reference opening page, including state, crop, and portrait ratio. Keep captures untouched, restore exact-source mismatches when possible, and document any remaining difference.
- Audit status correction (2026-10-23): current focused reruns clear the old Evelina and Ganch provenance failures (batch 4: 22/22), Lola's injected-selector cover finding (batch 7: 20/20), and Nahor's injected-selector cover finding (batch 9: 25/25). Batch 5 focused checks pass 18/18; Golden Card and Green Garden source/art fixes are reflected in their current files. Glass Pink remains visually unresolved: its candidate cover is explicitly rejected in `source/provenance.json` because lettering overlaps (`catalogEligible: false`). Do not infer visual approval from passing code/source tests. See each batch report's follow-up section.
- Bog‘i Eram audit correction (2026-10-23): the captured `template.js` references two sprite files missing from local archives, but their exact original Marxaba source URLs remain live. Retrieved and verified both binaries against the packaged assets; source URLs, retrieval time, dimensions, and SHA-256 hashes are recorded in `apps/web/public/templates/bogi-eram/SOURCE_ADAPTATIONS.md`. Both canvas animations now have verified original assets. Its local catalog cover is byte-identical to the canonical original-site `preview.webp`; it need not equal the runtime closed-gate opening.

Recorded on 2026-10-19 from the user's explicit approval. These are product requirements for future implementation, not implemented features.

## Maintaining this record

The user requests that the important things discussed be kept here and updated as the discussion continues. Record confirmed requirements and corrections promptly, distinguish recommendations from approved decisions, and keep unresolved choices explicit. Replace superseded requirements so future implementation follows the latest agreement. This instruction authorizes maintaining project documentation, not beginning implementation.

## Current implementation authorization and visual direction (2026-10-20)

- User requirement (2026-10-25): rebuild the homepage hero to match the supplied Visol reference image, including its warm photographic phone/stationery scene, wordmark and navigation, serif/italic headline, burgundy create action, four benefits, corner linework, and handwritten caption. Omit the “Qanday ishlaydi / 2 daqiqalik video” control entirely. This supersedes the earlier homepage hero's floating cards, rating control, activity badge, statistics, and floating navigation panel. Scope the reference colors and header treatment to the homepage; preserve the existing catalog, studio, and invitation renderers. Implement real text and working links and compare the desktop at the reference's 1699×926 content size, with a responsive mobile layout.
- User mobile/header correction (2026-10-25): follow the new portrait reference on phones, with a dedicated portrait phone/stationery/floral composition, gold italic headline, hamburger navigation, gold handwritten caption beside the create action, and four benefits across a curved bottom panel with a down-scroll cue. Preserve readable live copy and the existing desktop composition. The homepage header must move upward from the start of downward scrolling and reappear on upward scrolling; keep its background transparent with no scroll-triggered fill, blur, or shadow. The mobile menu must expose the working catalog/about/account links.

- The user has now authorized agents to begin building the project. Earlier statements that implementation had not yet been requested describe the prior planning stage and no longer block this work. External deployment, live payments, or use of unavailable credentials are not implied by starting local development.
- User correction (2026-10-21): do not research, record, or treat template-source or template-asset licensing/rights as implementation or publication blockers. Continue copying and integrating the requested local reference source. Template publication readiness is determined by implementation, integration, service, and quality requirements only.
- Installed complementary design skills: Anthropic `frontend-design` and Vercel `web-design-guidelines`; existing UI/UX Pro Max and shadcn remain available. Installation was explicitly requested before implementation continued.
- The original ivory/gold palette selected on 2026-10-22 is superseded by the approved 2026-10-25 platform color refresh above. Preserve accessible contrast, visible keyboard focus, restrained effects, and invitation renderers’ exact source designs.
- User request (2026-10-22): redesign the whole homepage with creative freedom and use expressive, curving typography selectively in the hero. Implementation choice: an invitation-atelier composition with locally hosted Cormorant Garamond headings, Great Vibes calligraphy accents, Manrope body text, real catalog artwork, fine gold linework, an explanatory three-step section, feature illustration, charcoal statement panel, FAQ, and footer. Use the current approved platform palette and keep working preview/creation links; decorative homepage stationery is separate from invitation renderers.
- User request (2026-10-22): give homepage scrolling a slower, weighted feel. Keep the shared site header anchored to the viewport, sliding out gently when scrolling down and returning when scrolling up. Redesign the creator input workspace using the existing palette. Implementation choice: scoped desktop wheel inertia with native touch/reduced-motion fallbacks; preserve native studio and invitation-frame scrolling. Keep site navigation absent from the studio and retain its own save toolbar. Improve the four-step navigation, field hierarchy, language controls, and live-preview presentation without changing invitation source designs.
- User request (2026-10-22): make the homepage more expressive with text/background gradients, ratings, invitation activity, an improved header, and shorter catalog cards. Original implementation (palette/gradients superseded by the 2026-10-25 refresh): ivory/champagne light gradients, metallic charcoal/gold headings, gently floating real template previews with a pause control, a clearly labeled sample completion card, a floating glass navigation surface, and compact portrait artwork frames. Use the actual published catalog count and an anonymous published-invitation count when nonzero; never fabricate customers or review scores. The star control is a personal, unsent design preference rather than an aggregate rating. The 2026-10-25 refresh adds an approved hero catalog action; keep preview/create actions working.

## Template catalog status and admin-managed categories (2026-10-20)

Confirmed requirements:

- Platform administrators can assign any template to any category throughout the website. Categories are catalog organization, independent from an invitation's event type, selected design, price, publication state, or authored content.
- Use shared category assignments across the public catalog and creator template picker, rather than hard-coded categories in each screen. A template can belong to multiple categories; administrators can update assignments without editing customer invitations.
- User requirement (2026-10-21): template event compatibility is separate from catalog categories. Each template has an admin-managed set of supported event types in the database. Show only compatible published templates after the creator chooses an event type, and reject incompatible template/event pairs when saving. Admins cannot remove a supported event type while saved invitations still use that template with that event type. A template must support at least one event type.
- User requirement (2026-10-21): keep each implementation agent on its assigned template until that template clears its release gates and is published; do not reassign it to another design first. If an environment limitation blocks a gate, record the exact blocker and keep working on that template rather than claiming publication readiness.
- Implementation recommendation (2026-10-21): the captured Marxaba metadata uses distinct Fotiha, Qiz uzatish, and Sunnat to‘yi event labels. Represent these as typed event IDs and localized creator options, mapping only the exact event types each template declares. Keep catalog category assignments unchanged; this extends the currently small event-type list based on the approved source-backed compatibility model.
- Implementation recommendation (2026-10-21): the captured Beshik design declares Beshik to‘yi and birthday compatibility. Add Beshik to‘yi as a localized event type, keep its compatibility separate from catalog categories, and present one celebrant field for the Beshik design.
- Source-backed event mapping (2026-10-21): add distinct localized `yubiley` and `iftorlik` event IDs when captured template metadata declares them. Map source IDs exactly (`tugilgan-kun` to `birthday`, `yubiley` to `yubiley`; `iftorlik` to `iftorlik`) and keep these event compatibility values separate from the `birthday` and `osh` catalog categories.
- In the creator’s template picker, show only category filters that contain at least one published template compatible with the selected event type. “Barchasi” counts and displays the complete compatible template set.
- User requirement (2026-10-21): make template selection the first creator step. Keep event type selection in that first step so the available templates and category filters can be constrained immediately. Follow with invitation details, date/location/program, and photos/options.
- Current correction: remove every provisional/dummy template from the application. The Suzani and Ivory Love starter designs are not approved final templates and must not appear as selectable, previewable, or public invitation designs. The user's later instruction to complete every remaining source-backed Marxaba design explicitly includes Shirin Bayram; that authentic captured design supersedes the earlier exclusion of the starter entry with the same name. Keep it unpublished until its individual release gates pass.
- Use exact designs from the existing local `Invitations - this folder will be removed from production` reference collection. Leave captures untouched. Template integration has resumed under the user's 2026-10-22 request to continue sequentially through the remaining designs.
- Do not show dummy designs. Template-selection lists contain only real published designs. A full preview uses the real renderer.
- User request (2026-10-20): show the ready Anor design on the homepage and public catalog so people can inspect it. This was initially preview-only. User later explicitly requested that Anor have the same creation action as published templates; that supersedes the preview-only restriction for Anor. Publish it at its existing catalog price and keep other unpublished templates out of selection.
- User correction (2026-10-21): label catalog preview actions “Ko‘rish” and creation actions “Yaratish”. Place them in one row, with the creation button using a 1.5fr column and Ko‘rish using 1fr.
- User requirement (2026-10-21): clicking “Yaratish” on a specific catalog template starts a fresh invitation with that template selected and opens the creator at invitation details, skipping the template-selection step. Drafts that already have a selected template also resume at invitation details; generic creation without a template starts at template selection.
- User correction (2026-10-21): remove the duplicate homepage hero buttons because the catalog and header already provide navigation. In the shared site header, label the dashboard link “Kirish” when signed out and “Taklifnomalarim” when signed in.
- User correction (2026-10-20): catalog cards must use the design's actual reference preview artwork, not an unrelated crop of another scene from the template. Prefer the dedicated image named by the template metadata when present.
- User correction (2026-10-21): Somon Yo‘li’s catalog cover should show the source hero with its astrolabe, names, date, and motto, matching the user-provided reference. Keep the galaxy poster as the invitation’s original opening scene.
- User clarification (2026-10-20): realistic sample invitation details may appear in a catalog preview and during the template-selection stage while the creator has not entered any invitation content. Once any creator-authored content exists, preview their actual content. Sample data is ephemeral presentation data: never save it, publish it, export it as a creator draft, or let it override authored fields. Keep the no-sample rule for later creation stages and public invitations.
- Preserve genuine reference behavior, including meaningful animations and opening sequences, when each exact template is integrated. Follow reduced-motion preferences. Sample invitation copy may demonstrate the layout only in the limited preview cases above; it must not introduce unrelated template artwork or media.
- Earlier approval to build `ivory-love` first is superseded by this correction.
- Current user request (2026-10-20) explicitly resumes production integration and authorizes completing one Marxaba design. Anor is the selected first template. This supersedes the temporary empty-catalog requirement for Anor only; do not proceed to another template until this one is verified.
- Anor's renderer and catalog metadata may be developed and previewed, but keep it unpublished/unselectable until the template passes the requested end-to-end checks and production blockers (including receipt uploads when enabled) are resolved. Do not treat a partial renderer as ready to publish.
- Reuse the selected template's own source for the Anor layout and motion, support reduced motion, and use the same isolated renderer for creator preview and public display. Keep the source capture untouched.
- User clarification (2026-10-20): "copy" means reuse the template's actual captured HTML, CSS, JavaScript, and assets instead of recreating the design. Anor's local capture contains those source files. Supersede the earlier Anor-only recommendation to recreate the design in a native renderer: package and run the template-level source in an isolated same-origin frame, retaining its original layout and motion code, and bridge it to the platform's typed invitation contract and real RSVP/wishes APIs. Do not import Marxaba's general sample-invitation or platform core/runtime; those carry unrelated sample data and site-level behavior. Keep the source capture untouched.
- User reiterated that fidelity includes the original typography and every visual detail. Preserve the captured font families, weight/style variants, CSS, artwork, HTML structure, and motion; package externally referenced font files locally when needed, and do not substitute platform fonts or styling. Platform data/API adapters may be added without redesigning the template.
- Dress code is an optional creator-selected invitation section. When enabled, prefill missing editable localized style/text/note and a five-color palette: evening attire; attire guidance; champagne, powder, olive, dark blue, and burgundy; and the note that guests should avoid white because it is the bride’s color. Apply defaults when enabling it and when opening an older enabled draft with missing values. Preserve existing creator-authored dress-code values and colors. When disabled or empty, hide it. The venue-photo field remains absent from the editor/shared data contract; do not fill it with sample invitation media. User clarification (2026-10-21): retain the current contract and use a map when coordinates are available; otherwise hide an empty venue-photo frame. This fallback is accepted and is not a release blocker by itself.
- User requirement (2026-10-20): every new template must use the complete source implementation from its selected reference, including its HTML, CSS, JavaScript, animation code, fonts, artwork, and interactions. Do not approximate or rebuild the design. Keep template-owned source files unchanged and put typed data/API integration in a separate adapter; any necessary source changes must preserve the reference output and be documented. Keep the original capture untouched.
- User requirement (2026-10-20): provide a dedicated full-page preview for each real template so people can see the whole design at its actual public size, including its opening sequence and scroll behavior. Do not confine the only full preview to a phone-shaped mockup in the editor. Catalog cards and the editor's design choices should link to the full preview; the editor may keep a compact live preview for quick feedback.
- User requirement (2026-10-20): the live preview shown during invitation creation should look and behave like the real invitation page at the available viewport size, rather than being clipped inside a decorative phone frame. Keep real creator-entered data in it. Only show illustrative sample names/details while browsing a template or at the template-selection stage before any content has been entered.
- User requirement (2026-10-20): the site must feel polished, complete, responsive, and carefully reviewed on desktop and mobile. Use the current approved platform palette, while keeping each invitation template's source visual identity intact. Do not publish placeholder or visibly unfinished pages.

Implementation choices:

- Store categories and template/category relationships in PostgreSQL; expose admin-only category creation/renaming and assignment controls. Site administrators can assign any template to any number of categories, and category filters must help customers discover matching designs in the public catalog and editor picker. Seed existing event categories as a starting point, with no restriction tying designs to those events.
- Template registry and renderer modules must remain independent and modular so exact references can be added one at a time. For Anor, package only its template-level HTML, CSS, animation scripts, and assets in the isolated renderer; do not embed the complete captured website or import Marxaba's general site runtime/sample invitation. Live service validation requires configured PostgreSQL, Telegram, and the selected storage provider (local development disk or R2).

## Required invitation content

- User requirement (2026-10-21): hide the site-wide navigation header throughout invitation creation/editing; it belongs on the landing page, not inside the studio. Rename the fourth creator step from “Rasmlar va imkoniyatlar” to “Qo‘shimcha”.
- User correction (2026-10-22): use one consistent shared site header across the homepage, design catalog, and dashboard; this supersedes the earlier separate dashboard account bar. Keep site navigation absent from the studio.
- User requirement (2026-10-22): dashboard cards show each invitation’s actual opening design with creator-authored content, use a compact layout, and combine browser drafts and saved invitations in newest-created-first order. Implementation choice: lazy-mounted, silent, noninteractive real renderer thumbnails; database creation timestamps and retained browser-draft creation timestamps determine order. Legacy browser drafts fall back to their earliest available saved timestamp.
- User requirement (2026-10-21): remove the browser autosave status line beneath the invitation title in the creator header; report storage failures through the existing error message.
- User requirement (2026-10-21): label the creator’s save action “Saqlash”. Signed-in users save directly; signed-out users complete Telegram login and then the same draft is saved.
- User requirement (2026-10-21): replace repeatable contact cards with two optional fields, phone number and Telegram username. Render each non-empty contact and omit the empty one. Store these as `contacts.phoneNumber` and `contacts.telegramUsername`; convert existing array-form contacts without losing the first non-empty value of either type.

- Do not ask creators for “Taklifnoma sarlavhasi” while no template displays it as invitation content. Keep the internal title for the renderer’s accessible iframe name; provide it from localized defaults instead of a creator field.
- When no custom event label is saved, show the selected event type as the field’s visible initial value. Creator editor placeholders follow the editor interface language, not the invitation language being authored. The current editor interface is Uzbek Latin, so placeholders remain in Uzbek Latin when switching invitation language tabs. The optional hosts example is “Raxmonovlar oilasi”; placeholders are examples only and must not be saved as creator content.
- Support names of the people involved, family/host names (for example, Al Thani family), event type, date/time, and editable introductory/invitation text.
- New wedding invitations prefill the editable invitation message with localized starter wording in Uzbek Latin, Uzbek Cyrillic, English, or Russian. Other event types do not inherit wedding wording. Newly added language variants get localized built-in defaults for the title, event name, greeting, wedding message, and program heading, while people’s names and other authored content start blank for that locale. Never copy names from another language; creators enter each language’s spellings independently.
- The localized “Tadbir nomi” field defaults to the selected event type (for example, “Nikoh to‘yi”). Update that default when the event type changes only while the field is still blank or still contains the previous generated default; preserve creator-authored wording. Generate the standard event label for each newly added supported locale.
- Support a general greeting such as "Assalomu alaykum, aziz mehmon!" and personalized greetings using a guest's name. Create the general invitation before its personalized versions, which reuse the same content.
- Support repeatable event program entries with time and title; do not impose a fixed four-entry structure.
- Support venue/restaurant name, address, map location, landmark/orientir, and further directions or location details.
- Support RSVP responses, guest wishes, photos of the couple/celebrants, music, and repeatable contact details including phone numbers and Telegram usernames.
- To'yona card details and guest receipt uploads are optional creator-controlled features, as specified below.
- Event types must support weddings (nikoh to'yi), qiz bazmi, nahorgi osh, birthdays, and expansion to other events. The exact full event-type catalog remains open.
- Additional content found in the templates includes gallery years and program speakers; support for these remains a recommendation pending schema approval. Story chapters are now approved as described below. Multilingual creation is a confirmed requirement, as detailed below.
- User approval (2026-10-20): invitations may include an optional repeatable story section. Each chapter has a stable ID and localized title and story text; chapter numbering and template illustrations remain controlled by the selected template. Preserve chapter content through save/reopen and template switching. Render the section only when at least one chapter has content in the active language. Do not add sample story text to saved or published invitations.

## Invitation languages and content variants

Confirmed requirements:

- Support invitation creation in Uzbek Latin (existing language), Uzbek Cyrillic, English, and Russian. Recommended standard locale keys: `uz-Latn`, `uz-Cyrl`, `en`, `ru`.
- Each invitation has one selected default language and optional additional language variants. Creators add variants only where needed; creating in one language must not require filling every supported language.
- Creators can remove any non-primary language variant from the editor. To remove the primary language, they first designate another enabled language as primary. Removing a language also deletes that locale's authored text and localized story/dress-code labels; shared event data and media remain unchanged.
- Keep variants under one invitation/owner/URL with shared events, guest records, and media, rather than creating independent invitation copies.
- Allow separate wording for names/family names when needed, greetings and personalized greeting patterns, invitation/introduction text, event labels, program titles/descriptions/speakers, venue names/addresses/directions, contact labels, stories, dress-code text, photo captions/alt text, gift notes, and other editable visible text.
- Couple/celebrant names are locale-specific authored content too: store and edit each enabled language's names independently, render the active language's values in every template, and never silently transliterate or overwrite another language's names. The shared catalog fixture may demonstrate the appropriate Uzbek Cyrillic and Russian spellings; it remains preview-only.
- Preserve all language variants when switching templates. Every selectable template must render supported language variants without losing fields.

Recommended behavior and schema guidance:

- Editor: choose a primary language, then "Til qo'shish" / Add language to enter only language-dependent fields. Reuse shared dates/times, coordinates/map references, contact values, card details, uploaded files, and event/program item identities/order. Display dates/numbers using the active locale; do not store duplicate dates or media per language. New events use Asia/Tashkent by default; timezone remains internal event data and is not creator-editable in the current editor.
- Supply translated built-in interface text (section/button labels, RSVP choices, music controls, moderation acknowledgments, and receipt messages); creators should not have to translate standard controls themselves. Custom heading overrides can have language variants.
- Public invitation language selector shows only enabled/published variants. Recommended locale URL selector: `?lang=ru`, compatible with personalized links such as `?g=<token>&lang=ru`. A language change must not create a new invitation or duplicate a guest/RSVP/receipt.
- Allow incomplete variants to be saved privately. Before exposing a variant publicly, validate its required text and identify missing fields. Recommend default-language fallback for optional missing wording, shown clearly to the creator in preview; exact per-field fallback policy remains to be finalized. Do not silently publish a supposedly complete translation with missing required content.
- Translation/transliteration assistance may be added later, but automatic AI translation is not requested or approved. Never silently translate names or overwrite authored text. Guest-submitted wishes and receipt images remain original content, not automatic translations.
- Suggested schema: `invitations.default_locale`, enabled locales, and `invitation_content` unique by `(invitation_id, locale)`; translated repeatable items reference the same stable item ID and locale. Choose one consistent translation-table/JSONB approach during final schema design. Guest preferred locale can be optional; all variants reuse the same greeting placeholders and guest identity.
- Language variants follow existing creator editing deadlines. Per-language prices, separate publication fees, and exact interface-language settings have not been decided.

## Optional venue/restaurant autocomplete

Confirmed requirements:

- As a creator types a venue/restaurant name, show matching place suggestions. Selecting one prefills the venue name, address, and map location/coordinates where available.
- Suggestions are only an entry aid. Selection is never mandatory: allow entirely manual venues, including homes or places absent from map listings, and allow pasting a map link or setting a pin.
- After selecting a suggestion, the creator may edit any invitation location field, including venue name, address, coordinates/pin, links, hall, landmark/orientir, and directions. Do not lock user-facing details to a provider's place record or refresh over their edits.

Recommended implementation:

- Use supported Google Places Autocomplete + Place Details or Yandex Geosuggest + appropriate place-detail/search/geocoding API, not scraping map HTML. Final provider is undecided; evaluate real venue coverage in target cities, cost, supported languages, and licensing for persistent invitation content.
- Use an interchangeable place-search module. Show locality/address in suggestions to distinguish same-named venues and optionally bias results by selected city/country without requiring GPS access. Include restaurants, wedding halls, and other event venues rather than restricting every event to restaurants.
- Prefill only after explicit selection. Debounce/rate-limit search and discard stale responses; outages/no results must not prevent manual entry, saving, or publication. Do not guess missing coordinates or claim venue availability/bookability from search results.
- Keep creator-authored display fields independent from optional provider references (`place_provider`, `place_id`/URI). Preserve existing location data and language variants when switching templates. Renaming a venue must not silently move its map pin; changing the pin/location should update navigation targets consistently. Selecting a different suggestion must not silently overwrite authored translations or additional venue notes.
- Provider content has attribution, map-display, and storage/caching restrictions; confirm the selected plan permits the intended long-lived data use before choosing a persistence strategy. Do not assume copying or editing API data removes its licensing restrictions, or mix Google-derived place data onto another provider's map without checking permitted use. Persist only permitted provider metadata and separate it from creator-entered values.
- API keys, provider setup, exact map UI, storage/refresh policy, and any alternate provider fallback remain implementation choices; no scraping job or restaurant database import is requested.

References checked on 2026-10-19: Google autocomplete https://developers.google.com/maps/documentation/places/web-service/place-autocomplete and policies https://developers.google.com/maps/documentation/places/web-service/policies; Yandex suggestions https://yandex.com/maps-api/docs/suggest-api/request.html and place search https://yandex.com/maps-api/docs/geosearch-api/request.html.

## Custom invitation music

- Confirmed clarification: music is optional for each invitation. Creators may leave music off entirely; no audio upload or track selection is required to save or publish an invitation. If they want music, allow them to upload their preferred audio file and use it as background music.
- Confirmed clarification (2026-10-20): when music is enabled, creators may either upload a new track or choose one of their previously uploaded audio tracks from a reusable personal music library. A track stays owned by its creator and can be reused across that creator's invitations; do not expose another creator's uploads in the picker.
- User requirement (2026-10-21): administrators must be able to add shared music tracks and choose which tracks are available in creators' music selectors. The creator selector combines active platform-curated tracks with that creator's own uploads; personal tracks remain private and reusable only by their owner. Platform tracks are uploaded to R2, stored as catalog entries, and can be hidden from new selections without removing existing invitation references.
- User requirement (2026-10-20): preserve and check each reference template's own music and mute/play control. Every full catalog template preview must have default preview music, even when the source capture only has a toggle and no bundled track. Catalog preview music starts only after the visitor opens/plays the preview; never autoplay on catalog load.
- User correction (2026-10-26): for every published invitation with creator-enabled music, attempt playback automatically when the public invitation opens. Guests can pause/stop it and start it again with the template's control. If the browser blocks autoplay, keep the template control available and retry on guest interaction where supported; never auto-restart a track after it has started successfully and the guest paused it. Invitations with music disabled remain silent. This public invitation rule is separate from catalog preview music.
- Catalog preview music is presentation-only and must not be saved into an invitation or override creator music settings. Creators may separately choose a clearly licensed platform library track or one of their own uploaded tracks for an invitation.
- The default catalog soundtrack is one global setting shared by all templates. Changing that single setting updates every supported full preview; do not maintain separate per-template defaults unless the user later requests them. This global preview setting is separate from each creator's invitation music.
- Current implementation uses "Emotional Piano" by triangelx, verified as CC0 1.0 on its Wikimedia Commons file page, for catalog previews and as an optional platform-library selection. Keep the source/license record in `apps/web/src/modules/catalog/catalog-music.ts`; replace the file if its license or availability is later disputed.
- Keep the uploaded track linked to the invitation independently of its template; switching designs must retain the selection, asset, and enabled/disabled choice. Template defaults must not enable music against the creator's choice.
- Recommended controls: preview, replace/remove the track, and disable music; guests receive accessible play/pause or mute controls.
- Store audio in R2 and reference it through the proposed `media_assets` / `invitation_music` records. Validate actual audio content and size/duration; supported upload formats and exact limits remain undecided. Recommend MP3 playback output, converting accepted source formats in a background worker where necessary.
- Only when the creator has enabled music, attempt automatic playback when the public invitation opens. Browsers can block audible autoplay; handle failure and preserve a usable Play control. Never force playback after the guest pauses a track that has started successfully. Invitations without music must not show inactive audio controls.
- Audio loading/conversion must not block displaying the invitation. Creator replacement/removal follows the existing editing deadline.
- Browser behavior reference checked on 2026-10-19: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay. Audible autoplay can be blocked by browser policy; the public route attempts playback and retains guest controls.

## Source-supported template sections

- User correction (2026-10-26): a template must not add a To'yana/gift card
  section or related creator-facing fields unless its original source includes
  that section. Compare each published template with its matching original
  capture and remove template-specific gift UI/adapters when the source has
  none. Preserve gift support only for source designs that include it; this
  does not remove the shared invitation gift data used by other templates.

## Voice greeting removal

- User correction (2026-10-21): remove optional voice greetings from the creator editor, invitation contract, template bridge, and stored invitation data. Background music remains supported.
- Migration `0010_remove_voice_greetings.sql` removes legacy `voiceMessage` JSON data and deletes any referenced media-asset rows that are not also used as invitation music or gallery images. New invitations and template work must not add a separate voice-greeting field or player.

## To'yona bank-name field removal

- User correction (2026-10-21): do not request or store the bank name for a to'yona destination. Keep the card number, cardholder name, and optional receipt-upload setting.
- Migration `0011_remove_gift_bank_name.sql` removes the legacy `gift.bankName` value while preserving the other gift settings. New invitation contracts and editor forms must not add the field back.

## Telegram authentication and invitation ownership

User requirements:

- Telegram is the authentication method for invitation creators. Website visitors may prepare an invitation before login; saving it to their account requires Telegram authentication and ownership association.
- Confirmed addition: sharing the creator's own Telegram phone number is mandatory to complete creator onboarding/authentication. Collect it through Telegram's native contact-sharing request, not a typed number or another person's contact. This applies to website and Mini App creator entry; ordinary invitation guests are not subject to creator onboarding.
- Website entry uses our bot's deep link with an opaque login request payload, for example `https://t.me/<our_bot>?start=auth_<random-token>`. The bot identifies the person through a trusted Telegram update and links the draft to that person's account after login completion.
- Telegram Mini App entry identifies the user automatically using validated Telegram data, without a separate identity-login prompt. If their required phone contact has not been collected, they must still complete phone sharing before creator access/ownership claiming is activated. This supersedes the earlier assumption that Mini App entry always needs no onboarding step.
- The same Telegram user must resolve to the same platform account across website, bot, and Mini App.

Validated design recommendations:

- Create an internal `users.id` and a unique `telegram_user_id` (PostgreSQL `BIGINT`). Link `invitations.owner_id` to the internal user. Telegram username, display name, URL parameters, and visitor-submitted IDs are not proof of identity; username changes must not create new accounts.
- Bot phone sharing: show a reply-keyboard button such as "Telefon raqamimni yuborish" with `request_contact: true` in the private bot chat. Accept the contact only through the trusted bot update flow and require `message.contact.user_id` to be present and equal `message.from.id` and the Telegram user associated with the pending request. Reject other people's contacts, typed numbers, forwarded contacts, or missing/mismatched user IDs and ask the user to use the native button again.
- Mini App phone sharing: use `Telegram.WebApp.requestContact()` when required. Its client callback is not proof of the phone number; complete the requirement only after the backend receives and validates the corresponding Telegram contact update for the same verified user. Offer the private bot contact-sharing flow when the native Mini App method is unavailable.
- Do not finalize website login/draft claiming or activate Mini App creator access until identity checks, login consent, and the required phone-sharing check have completed. Refusing phone sharing leaves the user in incomplete onboarding while preserving their draft.
- Recommend requesting the phone once at first onboarding and reusing the recorded Telegram-shared contact on later logins; forced sharing on every login is not yet requested. Keep Telegram user ID as the account identity, not the phone number. No account merging or ownership transfer based on matching phone numbers. Telegram contact sharing is not an independent SMS verification or two-factor login; no SMS OTP step is currently requested.
- Store the normalized phone privately with source and collection time. Do not automatically display the authentication phone as an invitation contact; publishing a contact number is a separate creator choice. Recollection after phone/account changes remains an implementation policy to finalize.
- Give an anonymous editor an unguessable draft capability bound to its browser session. Preserve form data while opening Telegram. Apply limits/expiry to anonymous drafts/uploads; exact retention remains undecided.
- Generate login requests on the server, bind each to its originating browser session and intended draft, and use short-lived, single-use random tokens stored as hashes. A five-minute lifetime is a recommendation, not a finalized product rule. The Telegram `start` payload allows up to 64 characters from A-Z/a-z/0-9/_/-. Do not put personal data, raw invitation IDs, or a reusable application session token in it.
- In a private bot chat, read identity from authenticated Telegram update `from.id`; verify callbacks against the same Telegram user. Ask for explicit website-login confirmation. The browser-bound, short-lived, opaque Telegram `/start` token identifies the pending login; do not display or request a matching numeric login code. Receiving `/start` alone must not silently log a browser into the sender's account. Never ask users to share login links with others.
- The originating browser checks request status using its own session-bound secret, not merely the public bot-link payload. After bot confirmation, show the authenticated Telegram identity and require browser confirmation before establishing account access and claiming the draft. This reduces accidental account linking and forwarded-link/login-CSRF risks.
- Finalize login and draft claiming atomically, consuming the request once and checking draft possession. Rotate the application session and use secure server-managed sessions (HttpOnly/Secure cookie for the normal website, CSRF protection, expiry/logout). Duplicate Telegram deliveries or concurrent claims must be harmless. Already authenticated creators can save directly.
- Do not transfer an invitation that already has another owner, auto-merge conflicting accounts, or grant ownership because someone opened a public/personalized invitation URL. Public invitation guests do not need creator login just to view, RSVP, submit wishes, or upload receipts where allowed. An owned invitation cannot be claimed again through a new login request.
- Bot webhooks must validate the configured Telegram secret header; a separate AWS bot calling the Vercel backend must use authenticated service-to-service requests. Do not trust arbitrary incoming JSON claiming to be a Telegram update.
- Mini App: send raw `Telegram.WebApp.initData` to the backend; verify its signature/hash for our bot using Telegram's official procedure, validate `auth_date` freshness, and require a verified user field before issuing an application session. Do not trust `initDataUnsafe.user.id` or a client-supplied user ID as authentication. Limit replay/exchange and apply normal session authorization to subsequent requests. Exact freshness/session lifetimes remain undecided.
- Missing, invalid, or expired Mini App identity must not silently become an authenticated user; request a fresh Telegram launch or offer the website login flow. Anonymous form data should survive login recovery.
- Mini App authentication does not itself guarantee permission for the bot to send private receipt notifications. Use the bot-start flow or Mini App `requestWriteAccess` where needed, record verified messaging availability, and handle revoked access/blocked bot separately from login status.
- Platform-admin privileges are assigned independently on the server; Telegram authentication never grants them automatically.

Suggested schema additions (final schema/migrations remain pending):

- `users`: internal ID, unique `telegram_user_id`, private `phone_number`, `phone_source` (`telegram_contact`), `phone_shared_at`, onboarding completion status/time, Telegram profile fields as non-authoritative display metadata, timestamps. Phone fields may be absent on an incomplete record but are required for completed creator onboarding. This replaces the earlier generic authentication-subject proposal for the selected Telegram-only creator login.
- `auth_requests`: token hash, originating anonymous/browser session reference, intended draft reference, Telegram user ID after confirmation, state, expiry, bot confirmation time, consumption time. Store browser-side challenge secrets separately from the bot-link token.
- `sessions`: user reference, hashed session secret, expiry and revocation; anonymous draft sessions tracked separately as needed.
- `telegram_connections`: reuse the receipt-delivery connection table for verified user/private-chat IDs and messaging status, rather than creating a competing identity record.

Checked on 2026-10-19 against Telegram deep links https://core.telegram.org/bots/features#deep-linking, Mini App validation/write access https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app, and webhook authentication https://core.telegram.org/bots/api#setwebhook. Documentation/design only; no authentication code or bot integration implemented.

Phone-sharing addition checked on 2026-10-19: https://core.telegram.org/bots/api#keyboardbutton (`request_contact`, private chats only), https://core.telegram.org/bots/api#contact (`user_id` is optional, so explicitly require a matching ID for our onboarding), and https://core.telegram.org/bots/webapps#initializing-mini-apps (`requestContact`).

## Persistent creator sessions

Confirmed requirement:

- Returning website creators should remain signed in on the same browser/device across page refreshes and normal browser restarts while their session remains valid. Do not repeat Telegram login or phone sharing on every visit, save, or checkout. The user's OpenAI website example describes the desired experience; no claim is made about OpenAI's internal implementation.

Recommended design and behavior:

- Use a persistent, opaque session credential in a first-party HttpOnly/Secure cookie with appropriate SameSite/CSRF protection and explicit expiry. Store hashed session credentials and revocation/expiry state in durable server-side storage shared across Vercel instances/deployments; do not rely on process memory or expose reusable login tokens in localStorage/URLs.
- Validate sessions and owner/platform-admin authorization on the server for protected requests. Render the authenticated initial page without an unnecessary login-screen flash; never put private dashboard/session responses in a public CDN cache.
- Renew eligible sessions transparently with a controlled sliding idle timeout and a fixed absolute lifetime. Rotation must handle concurrent tabs/requests without spurious logout and must not revive expired/revoked sessions or extend access forever. Background polling alone should not keep an otherwise unused session alive indefinitely. Exact idle/absolute durations and rotation intervals remain undecided.
- Explicit logout invalidates the server session as well as clearing its cookie. Provide an active-session/device list, revoke-one-session action, and "Log out all devices"; revoked sessions must lose access on subsequent protected requests. Device descriptions are approximate metadata, not proof of identity.
- Each browser/device has its own session. Website and Mini App resolve to the same Telegram account but need not share cookies or session storage. A new browser/device, cleared cookies, private browsing after its storage is cleared, expiration, or revocation may require Telegram login again. Reuse a previously completed phone-sharing record unless recollection is explicitly required; no routine repeat onboarding.
- Preserve recoverable drafts and return users to their interrupted editor/checkout after reauthentication. Distinguish temporary network/backend errors from actual session expiry so an outage does not falsely log users out or discard edits.
- Require fresh Telegram confirmation for appropriate sensitive/risk events and apply stricter session rules to platform admins; do not hard-bind ordinary sessions to an IP address, since mobile networks change. Exact sensitive-action list remains undecided. Existing invitation edit deadlines and payment/ownership checks apply even while signed in.
- Extend proposed `sessions` fields with created/last-active times, idle and absolute expiry, revocation time, rotation metadata as needed, device description, and last-authenticated time. Avoid unnecessary retention of precise device/network identifiers.

Reference checked on 2026-10-19: OWASP Session Management Cheat Sheet https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html. Session-library selection and exact policies remain implementation decisions; no authentication code has been changed.

## Approved invitation editing and reuse policy

A purchased invitation belongs to one specific event. Changing its displayed event date must never automatically extend editing access.

- Before publication, the creator may freely edit all invitation content.
- At first publication, lock the event identity: main people/names and event type. Record the first publication time and identity lock time.
- After publication and before the approved editing deadline, allow practical updates to text, photos, music, program, location, contacts, and optional to'yona settings.
- Name corrections such as "Nodor" to "Nodir" use a correction request reviewed by an administrator. Do not automatically accept or reject corrections based solely on character edit distance.
- Replacing the main people or changing the invitation to a different event requires a new invitation.
- Postponement requires a request containing the proposed date and a short explanation. An administrator approves the date and editing deadline together. Keep approved date history.
- An approved postponement updates the existing invitation and preserves its URL, guests, and responses.
- Initially set the editing deadline to the end of the approved event day in the event's timezone. For multiple ceremonies, use the last approved ceremony.
- After publication, only an administrator can extend the editing deadline. Changing dates or adding ceremonies must not automatically extend it.
- Do not disable all editing several days before the event; urgent practical updates must remain possible until the approved editing deadline.
- After the editing deadline, creator editing and new personalized guest-link creation close. Further corrections require administrator approval.
- Enforce permissions on the server for website and bot actions, including uploads and guest-link creation. Hiding controls in the UI is insufficient.

Keep these concerns separate:

1. Creator editing deadline.
2. RSVP deadline.
3. Optional receipt-upload deadline, which may remain open briefly after the event.
4. Public viewing expiry/retention. Read-only invitations may remain viewable as keepsakes; the exact retention duration has not been decided.

Database additions agreed as part of this policy:

- `invitations`: `first_published_at`, `identity_locked_at`, `edit_deadline_at`, `archived_at`.
- `invitation_change_requests`: `id`, `invitation_id`, `requested_by`, `change_type`, `proposed_changes`, `reason`, `status`, `reviewed_by`, `reviewed_at`, `review_note`, creation/update timestamps.
- `invitation_audit_log`: `id`, `invitation_id`, `actor_id`, `action`, `previous_values`, `new_values`, `created_at`.

## Platform-controlled template pricing

- Platform administrators (the project operators) must be able to set a separate price for each template.
- Tenant administrators, invitation creators, and ordinary users cannot change template prices. Enforce this distinction on the server.
- Display the selected template's price clearly when choosing or switching templates.
- Implementation guidance: store an exact amount in the currency's minor units and a currency code, associated with the template. Record which platform administrator changed a price and when.
- Implementation guidance: calculate prices on the server and snapshot the selected template, amount, and currency on any checkout/order record. A template switch must never silently reuse a payment or quote for a different template. Exact checkout, quote validity, and payment adjustment rules remain to be decided.

## Current invitation publication milestone (2026-10-22)

- User requirement: plan the publishing flow first. During the current prelaunch stage, clicking Publish should publish a valid invitation immediately without checkout or a payment requirement. Payment integration is a later milestone. This concerns customer invitations, separately from administrator publication of catalog templates.
- Preserve existing authenticated ownership, draft recovery, authored-content validation, and post-publication editing rules. The user has not requested anonymous publishing or an authentication bypass.
- User decision (2026-10-22): public invitation codes must be exactly **six Base62 characters**, using `0-9`, `A-Z`, and `a-z`, for example `/i/aB3xY9` on the existing invitation route. This supersedes the earlier ten-character lowercase recommendation. Generate random codes on the server, preserve case, enforce database uniqueness, retry collisions, and keep the code stable through allowed edits. A custom domain is not required to implement this flow: keep the stored slug independent from the configured application origin.
- Implementation recommendation: use an explicit server-side free/paid publication mode and record free publication honestly. Later payment verification gates the same publication service. Recommend keeping early free publications accessible when paid publishing begins.
- User authorization (2026-10-22): implement the publishing plan, configure the supplied database/Telegram/application environment privately, review the implementation, and run related tests. Store credentials in ignored `apps/web/.env.local`; never include values in committed documentation or test output.
- Implemented: authenticated free publication through `POST /api/invitations/[id]/publish`, save-before-publish in the studio, enabled-locale/content/date/location/media validation, six-character case-sensitive Base62 allocation with unique-constraint retry, one transactional publication/audit/identity-lock/deadline update, and stable copy/open links in studio/dashboard. Initial editing deadline is the end of the event day in its timezone, including DST. Existing publications remain accessible when free publication is disabled. No payment records are fabricated.
- Implementation choice: provide an optional localhost Telegram polling adapter that forwards to the existing authenticated webhook handler, refuses to replace an active webhook, and never logs secrets or message payloads. Human account confirmation is still required. The concrete sequence and verification limits are in `docs/INVITATION_PUBLISHING_PLAN.md` and `docs/PUBLISHING_VERIFICATION.md`.
- User feedback during verification: Telegram identity confirmation succeeded, but the next action after returning to the website was unclear. Show a confirmed-account card and a clearly labeled **Nashr qilishni yakunlash** (or **Saqlashni yakunlash**) button with instructions; focus that action when confirmation arrives. Preserve the chosen save/publish intent and the account confirmation step.

## Future payments and authentication-first checkout

Confirmed user intent:

- Add Click Uzbekistan payments later for the website and the Telegram-facing experience; the user will supply the merchant credentials during implementation. No credentials are needed for the current planning discussion and no payment integration is authorized yet.
- Authenticate the creator first (including mandatory Telegram phone-sharing onboarding if not already completed), then allow payment. Preserve their draft throughout login and checkout; reuse a valid existing authenticated session.
- Use the selected template's platform-admin-controlled price for checkout. Charge only against an order associated with the authenticated owner and the intended invitation/template.

Validated constraint and recommendations:

- Website: plan for Click web checkout. Click's official overview lists web and Telegram payment interfaces, but that alone does not establish eligibility to use Click for our specific product inside Telegram.
- A paid digital invitation/template-publication service appears to be a digital service. Telegram's current official rules require Telegram Stars (`XTR`) for digital goods/services sold inside bots and Mini Apps, even if the merchant also runs a separate website. Therefore native Click checkout inside our bot/Mini App is not an approved technical assumption. Keep the user's desired Telegram payment experience recorded, with the provider/channel decision unresolved; Stars is a recommendation subject to user agreement, not a replacement requirement silently adopted. Recheck official rules and merchant eligibility before implementation.
- Recommended sequence: draft/preview -> authenticate and complete required phone sharing -> server-created checkout/order -> verified payment completion -> publication entitlement. Exact publication trigger (automatic or explicit creator confirmation) remains undecided.
- Store merchant secrets only in server-side secret/environment configuration, never this document, frontend bundles, or Git. Keep provider integration behind a modular payment adapter.
- Persist order price/currency/template snapshots and payment attempts/provider transaction references. Validate payment notifications using the chosen provider's documented verification process; check order, amount, currency, and final successful state. Browser redirects, screenshots, AI screening, or an initial payment/preparation event do not prove platform payment completion. Handle retries/duplicate notifications idempotently.
- Keep failed/cancelled/pending checkout drafts recoverable. Template switching before publication remains allowed; switching after checkout creation must invalidate/reconcile the old quote/payment entitlement rather than publish a different-priced template under a stale order. Upgrade, refund, quote-expiry, and post-payment switching rules remain open.
- Platform publication fees are separate from optional guest to'yona transfers and their AI-screened receipt uploads.

Checked on 2026-10-19: Click overview https://docs.click.uz/ (Prepare/Complete and supported interfaces); Telegram digital-payment requirements https://core.telegram.org/bots/payments-stars, especially its alternate-provider and separate-website FAQ. Detailed Click integration endpoints/contract eligibility still need verification during implementation.

## Template publication, retirement, and replacement (2026-10-20)

Confirmed requirements:

- Platform administrators can publish or unpublish any template at any time. Tenant admins and creators cannot change catalog publication status.
- When unpublishing a template used by existing invitations, the platform admin must be able to select another template as its replacement. This is an admin-selected design replacement for affected invitations, including already-published ones, not a request to recreate invitation content.
- Unpublished templates are unavailable for new selection; publishing them makes them selectable again.

Recommended behavior and safeguards:

- Admin workflow: show affected draft/live invitation counts, select an eligible published replacement, preview representative invitations with their existing data, then apply retirement/replacement. A plain catalog-hide action that preserves existing users can be offered separately, but must not be confused with the requested replace-existing-invitations action.
- Preserve invitation IDs, public/personalized URLs, owner, event identity/dates, all language content, media/music choices, guest links, RSVP responses, wishes/moderation, receipts, and payment history. Change only the rendering template/version and explicitly mapped presentation settings. Missing design-specific sections use the shared fallback approach; never delete their data or substitute demo content.
- Admin replacement is a controlled exception to the creator's template/edit locks: it may occur after publication or the event deadline, but must not unlock creator editing, extend deadlines, or alter event identity. Ordinary creator template switching after publication remains undecided.
- Recommend no additional charge or automatic refund solely because the platform retires/replaces a paid template. Retain original order/template/price snapshots and record a separate admin replacement/entitlement mapping. Reconcile unpaid checkout quotes explicitly so stale callbacks cannot attach the wrong template/price. Detailed unpaid-order/refund handling remains to be finalized.
- Do not delete template versions/assets still needed to serve invitations or recover from failed replacement. Stop new selection promptly; migrate existing assignments in a resumable, idempotent process that keeps a valid renderer available until each replacement succeeds. Revalidate template eligibility when saving/publishing to handle retirement during an open editor/checkout.
- Notify affected creators in their dashboard; recommend a deduplicated bot notice where messaging is available. If a previously retired template is republished, do not automatically move invitations back.
- Validate platform-admin authority server-side. Record actor, reason, old/new template versions, affected invitations, job status/errors, and timestamps; provide an auditable rollback of rendering assignments where compatible with current invitation data.

Suggested schema additions (not approved migrations): `templates.publication_status`, `published_at`, `unpublished_at`, optional `replacement_template_id`; a replacement operation/job record with per-invitation outcomes and before/after assignment versions. Use the existing invitation audit log for applied changes. Final status names, batch controls, notification wording, and pricing exceptions remain design recommendations.

## Template switching before publication

- Before publication, users must be able to choose any published/selectable template and switch templates without entering their invitation details again. Platform-retired templates are excluded from new selection.
- Store invitation content independently from template rendering. Selecting a new template changes the design selection, not the underlying invitation or its entered content.
- Confirmed (2026-10-20): persist the selected template's stable ID with the invitation, not its display name. Keep the ID in both `invitations.template_id` (foreign key to the template catalog) and the invitation data snapshot; when a draft or published invitation is reopened, resolve that ID to the matching renderer so the same design opens. Renaming a template changes its catalog label without changing which design existing invitations use.
- Reuse all applicable existing information: people and family names, event types/dates/timezones, greetings and editable text, program entries, locations, RSVP configuration, gallery/media, to'yona and receipt settings, contacts, music, stories, and dress codes.
- Preserve uploaded asset references and repeatable item order. Do not replace entered values with template sample names, dates, or other demo content.
- All selectable templates must consume a shared invitation data contract, with template adapters or common fallback sections where needed. Support switching across event types without forcing a wedding-only bride/groom structure onto other events.
- Do not discard optional content when the target design lacks a native presentation for it. Preserve it, use a suitable fallback where possible, and explain any presentation limitation in the preview. Switching back must retain the original data.
- Preview the new template with the existing content and its applicable price before publication.
- Creator-initiated template changes after publication remain undecided. Platform-admin replacement of retired templates is separately authorized above and does not grant ordinary creators post-publication switching rights.

## Personalized invitation links at scale

- User correction (2026-10-21): do not show the personalized-greeting pattern field in the general invitation editor until personalized guest links are managed there. Keep the contract field for the future flow and preserve any existing value.
- User proposes personalized URLs such as `ourdomain.org/onar-gentlement/person=nazar` and wants thousands of personalized invitations without duplicating the base invitation.
- Recommended URL for greeting-only personalization: `https://ourdomain.org/onar-gentlement?person=Nazar`. The query parameter changes the displayed greeting; it is not guest authentication or a trustworthy guest identifier. Normalize/limit the name and render it as escaped text, never HTML.
- Recommended URL for recorded guests: `https://ourdomain.org/onar-gentlement?g=<opaque-random-token>`. Resolve the token to an invitation-scoped guest record and its display name. Store a token hash; do not put sequential guest IDs or use names as unique identities. A shared token identifies the link, not the real-world person opening it.
- In both cases, retain one invitation and its media. Recorded personalization adds lightweight guest records, not copied websites, builds, or media. General invitation updates flow through to all personalized links.
- Recommended bulk workflow: paste many names or import a list, create guest records/links in bounded batches, and export/copy the links. Duplicate names must remain distinguishable by guest record/token. Importing a list does not authorize sending messages to those guests.
- Avoid sharing cached personalized HTML between guests: cache common invitation content separately and resolve the greeting per request or on the client. Never let a shared CDN cache expose one guest's greeting or response data to another.
- Keep the existing general-invitation-first and publication/edit-deadline rules. Whether greeting-only links, recorded token links, or both are exposed in the product is still a recommendation under discussion, not a finalized URL scheme or plan limit.

## Guest wishes/messages: creator inbox and moderation

Confirmed requirements:

- Persist guest wishes/messages against the specific invitation and show them in that invitation's creator dashboard. Telegram is a notification/control surface, not the only copy of the message.
- Notify the invitation creator through the bot with the submitted guest name, message, invitation context, and actions to view it in the invitation ("Taklifnomada ko'rish") and delete it ("O'chirish").
- The creator must control what appears publicly, to prevent improper or malicious guest submissions from remaining on the invitation.

Recommended moderation workflow:

- New submissions default to `pending` and remain private until the creator explicitly approves them. Add a separate "Tasdiqlash" / "Taklifnomada ko'rsatish" action; opening "Taklifnomada ko'rish" must not itself approve a message. For pending messages, the view action opens an authenticated creator-only preview at the message; it must not expose unpublished messages publicly.
- Dashboard filters: pending, published, hidden/rejected, and deleted. Support approve, hide/unpublish, and delete from the dashboard as well as the bot. Display submission time and guest identity/link association when available; names entered by public visitors are self-reported.
- Recommend reversible deletion: remove immediately from public visibility and active lists, retain in the creator's deleted/private dashboard view until a defined purge. Exact retention and permanent-deletion policy remain undecided. Deleted messages must never be returned by public message endpoints.
- Persist a submission before queuing its bot notification. Bot failures must not lose the message or cause it to become public. Retry delivery without duplicate routine notifications and keep dashboard access usable if the bot is blocked.
- Every bot callback/dashboard action must verify the authenticated actor owns this invitation or has explicitly granted platform-admin authority. Do not authorize by a message ID, URL, Telegram username, or callback data alone. Make duplicate/stale actions harmless and keep bot/dashboard moderation state synchronized.
- Public views/APIs query approved, nondeleted messages only; authorization for private previews is server-side. Refresh/invalidate public caches after hiding/deleting messages. Render user text safely, apply length limits/rate limits and spam controls; filtering may assist but never overrides creator approval.
- Guest acknowledgment before approval: "Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko'rinadi."
- Creator message moderation and dashboard access remain available after the event editing deadline; that deadline locks invitation-content edits, not the ability to remove improper guest content. Guest submission closing dates/controls remain a separate undecided policy.

Suggested schema extensions (pending final migration design):

- `wishes`: invitation reference, optional guest reference, author name, message, moderation status (`pending`/`approved`/`rejected`), submitted time, moderated-by user/time, optional deleted time and deleting actor.
- `wish_settings`: message submissions enabled and approval-required setting; approval-before-publication is the recommended default, not yet a separately approved user configuration policy.
- Reuse a general notification outbox/delivery mechanism for wish notifications, tracking wish/creator connection, status, retries, Telegram message ID, and a deduplication key. Keep delivery state independent from moderation status.

## Receipt uploads and owner review (updated 2026-10-22)

- Latest user correction: skip receipt AI checks. This supersedes the earlier requirement to screen receipts using an AI gateway/fallback before delivery. AI integration and automatic forwarding are outside the current implementation.
- Guests can upload a JPG/PNG/WebP image or PDF with the names of the givers when the creator enables receipt uploads. Keep files private to the invitation owner; uploads never prove receipt of money.
- The owner reviews receipts in the website dashboard and explicitly marks received/problem after checking their account. Show the absence of AI/bank verification to guests and owners. Do not report successful Telegram delivery when none occurred.
- Associate a verified personalized guest token when supplied, rate-limit uploads, and deduplicate identical files per invitation. Disabling uploads preserves existing private receipts.
- User request: audit every editor input and make publication work locally without unavailable R2 setup. Implementation choice: private local storage for local development, retaining R2 for deployment. Store bytes outside public/, keep credentials/settings in ignored .env.local, and preserve ownership/readiness checks. Refuse local disk on Vercel; production self-hosting must explicitly configure persistent storage and backups.
- Owner RSVP responses and wish approval/hiding must be available through the website. Do not leave the wish-approval promise dependent on an absent notification worker.

## Other established requirements and stack choices

- Structure the project modularly.
- Website: Next.js and TypeScript, deployed on Vercel.
- Media storage: Cloudflare R2.
- Database provider: user supplied a Neon PostgreSQL connection string for this project. Keep its secret URL out of this decision file and other tracked files; configure it through the `DATABASE_URL` environment secret during authorized setup. Telegram bot hosting is not finalized.
- Create a general invitation first, then personalized guest links that inherit its content. Guest-link creation after publication was recommended.
- Creator chooses whether to include to'yona card details. Only when enabled, show a second choice to allow guest transfer-receipt image/PDF uploads.
- Receipt uploads are private to the invitation owner and authorized administrators; do not place them in public galleries. An upload does not itself verify receipt of money.
- Associate receipts with a personalized guest when available; allow a sender name for general invitation visitors.
- Disabling to'yona also disables new receipt uploads; preserve existing receipts privately for the owner.

The comprehensive invitation schema discussed in chat is still a proposal; do not treat every proposed table or field as separately approved. No application, database migration, or infrastructure implementation was requested at the time this record was saved.

## Recommended development-agent organization (2026-10-20)

User requested recommendations for specialized workers/agents. The following is a proposed organization, not approval to spawn agents or begin implementation:

- Lead/integration agent: coordinates tasks, requirements, shared contracts, integration, and final verification. Maintains this record; does not silently promote open recommendations to approved product rules.
- Core/backend agent: owns schema/migrations, invitation lifecycle/ownership, server authorization, Telegram identity verification/session logic, and shared API/data contracts.
- Web/editor agent: owns creator flows, multilingual editor/preview, dashboard, and platform-admin interface; consumes the shared contracts and backend rules.
- Template agent: owns the renderer/registry, isolated template styles/animations/assets, and data-preserving switching. Keep the catalog empty until exact local reference templates are selected for integration; then add and review them one at a time.
- Telegram agent: owns bot/Mini App transport, contact-sharing UX, login handoff, notification delivery/buttons, and bot moderation actions; calls shared backend authorization/business rules.
- Integrations/background-jobs agent: owns R2/media/audio handling, place-provider adapters, AI receipt processing/fallback, and durable jobs/retries. Click checkout is a later scoped assignment; do not implement the unresolved Telegram payment-provider choice.
- QA/release agent: independently checks critical scenarios, mobile visuals/performance, privacy/authorization boundaries, failure recovery, and staging/release readiness. Lead retains integration responsibility.

Recommended sequence: preserve the empty template catalog until the user selects exact local references. For each selected reference, build a modular renderer and verify shared-data switching, save/reopen, motion, and language behavior before moving to the next one. Add guest interactions/moderation/admin controls and provider-heavy features in scoped stages.

Use the lead plus up to three focused specialists concurrently initially, rotating roles with the phase. Give every assignment owned files/modules, dependencies, acceptance criteria, and a handoff describing changes, checks, and unresolved issues. Core/backend is the single migration owner; other agents propose shared-contract changes through the lead. Avoid concurrent writes to shared files; use isolated branches/worktrees once Git is established and consolidate before integration checks. Implementers verify their changes; independent QA does not replace that duty.

Development agents are distinct from production queue workers. The running app will need durable job types for Telegram notifications, receipt analysis, media processing, and template replacement; these can initially share a worker deployment with bounded concurrency/retries rather than separate microservices. Only receipt analysis needs an AI provider by current requirements.

## Additional reference captures (2026-10-20)

- User requested local design captures from taklifnomachi.uz, onlinetaklifnoma.app, taklifla.uz/templates, taklifiy.uz/ru/invitations, yoryor.org, mytaklif.uz/t, and invitate.uz, in the existing per-source capture workspace format.
- User also requested opening and checking every newly copied template. Preserve public source URLs and record missing assets or rendering limitations; do not claim perfect copies without verification.
- This authorizes reference capture and local preview work, not production integration or a change to the product requirements.
- User additionally authorized capturing the 156 Wedivo previews exposed by scrolling through their signed-in dashboard and adding them to the same local gallery. Treat this as reference capture only; do not convert these templates into production renderers without a separate implementation decision.
- User additionally authorized adding the existing Chorlove and Marxaba reference captures to that local gallery and checking their live catalogs for missing designs. The catalogs were checked on 2026-10-20; captures remain reference material only and are not production templates.

- User additionally authorized capturing the public Invitio theme previews at invitio.co.id and adding them to the same local reference gallery. Keep as reference captures only; do not integrate into production without a separate decision.

- User additionally authorized adding Wedvitation’s public invitation previews to the local reference gallery. Capture its public catalog designs only; do not promote them into production templates without a separate decision.

- User additionally authorized capturing all public Yumevite catalog template previews in the local reference gallery. Keep as reference material only; production integration requires a separate decision.
- User additionally authorized adding the existing E-Taklifnoma (e-invitation.uz) captures to the local reference gallery. Include its seven saved previews across Nikoh to'yi, Nahor oshi, and Xatna to'yi; keep source captures untouched and do not treat this as production template integration.

## Production template conversion brief (2026-10-20)

- User requested a reusable prompt for a coding agent to convert captured reference templates into production templates with dynamic invitation fields, preserving the complete design, animations, and interactions.
- This request is for the implementation brief only; it does not itself resume reference integration in this session. Apply the existing modular renderer, shared-data, language, optional-feature, and reference-preservation requirements when integration is authorized.

## Shared template preview sample data (2026-10-20)

- Current scope correction (2026-10-20): the user authorized preparing all ten
  Marxaba nikoh templates listed in `docs/templates/TEMPLATE_ROADMAP.md` after
  the earlier Anor-first restriction. Continue the full batch without waiting
  for per-template approval. Each template remains unpublished/unselectable
  until its own documented gates pass. User authorization (2026-10-21): publish
  Qandil and Ko‘zgu after passing their release checks; their catalog migrations
  were applied and committed separately. External app deployment remains a
  separate step.

- Confirmed: use one shared `apps/web/src/modules/catalog/preview-sample.json` fixture for catalog and the initial template-selection stage. It contains consistent sample names, family/hosts, event date and time, venue, greeting, invitation text, event label, and repeatable program entries in Uzbek Latin, Uzbek Cyrillic, English, and Russian.
- User requirement (2026-10-21): show three example guest wishes in every template's catalog and initial template-selection preview, with the section eyebrow “Yurakdan” where that is part of the captured design. Keep sample wishes in the shared localized `preview-sample.json` fixture and never persist or publish them as invitation content.
- User correction (2026-10-21): use the catalog artwork names Javohir and Madina as the shared demo couple in every locale, so opening a template preview matches its catalog card. In Uzbek Cyrillic and Russian demo names, render the Latin name sound `h` with `х` (Javohir → Жавохир); keep normal Uzbek Cyrillic spelling such as `ҳ` in the surrounding Uzbek copy. Apply these names only to catalog/initial selection samples; authored creator content replaces them and sample data is never saved or published.
- User requirement (2026-10-20): show language choices as `Uz`, `Уз`, `En`, and `Ru` in the invitation language switcher, while retaining the internal locale identifiers for storage and routing.
- Every template maps the same fixture into its own source design. Creator-authored data takes precedence; the fixture is presentation-only and must never be saved, exported, or published.
- Keep fixture editing in source control for now. An admin settings screen for changing preview samples is a future option, not a current requirement.
- Confirmed: the catalog card uses the template's distinctive first/opening page artwork at its full portrait aspect ratio, rather than cropping a landscape scene or substituting another image. Source metadata's dedicated preview asset takes precedence.
- User correction: invitation names must remain fully visible in every template and at narrow screen sizes. Preserve the source's authored display typography when both names fit; adapt only the overflowing name lockup with responsive sizing or wrapping. Test unusually long names as part of template review.

- User request (2026-10-21): continue template work one design at a time. Finish
  the active design with complete source-level dynamic integration and its
  customer-ready verification, then publish it before advancing to the next
  design. If any required release gate is still open, stay on that design and
  leave it unpublished; do not count implementation progress as publication
  readiness.
- User follow-up (2026-10-22): continue with the next design already in the
  conversion sequence and publish it through the existing catalog once its
  documented release gates pass. The current roadmap identifies Nilufar as the
  active next design; its existing publication authorization remains subject
  to those gates.
- Follow-up (2026-10-22): Nilufar is now catalog-published at 150,000 UZS with
  wedding and fotiha compatibility. Migration `0052_publish_nilufar.sql` was
  applied and the public catalog API, 390px layout, and authenticated
  four-locale save/publish/reopen flow were verified. Reduced-motion runtime
  emulation was unavailable; source guards and focused assertions pass.
  External deployment and live payment activation were not performed. Continue
  with the next design in the approved conversion sequence.
- User selected Samarqand Kechasi as the next template and requested publication
  through the same catalog mechanism and existing 150,000 UZS price after its
  template checks pass. This authorizes its additive catalog publication
  migration; it does not authorize external deployment or live payment changes.
- User requested that, after Samarqand Kechasi, the next template be fully
  prepared and published using the same catalog mechanism. Bog‘i Eram is the
  next template in the approved batch. The request authorizes its additive
  publication migration at the existing 150,000 UZS price; it does not
  authorize external deployment or live payment changes.
- User requested that template work continue after Bog‘i Eram. Atlas is the
  next design and may be published with an additive migration at its existing
  150,000 UZS price after its documented checks pass. Do not deploy externally
  or activate live payments as part of this work.

- User request (2026-10-21): continue through the remaining Marxaba templates
  and other already captured, approved reference sources one at a time. Make each
  publishable and publish it through the existing catalog mechanism only after
  its required release gates pass. This supersedes the earlier pause after Atlas
  for the newly approved sequence; it does not authorize external deployment or
  live payment activation.
- User clarification (2026-10-21): finish the remaining Marxaba designs first,
  then continue with Chorlove. Work on distinct templates in parallel where
  possible; the primary agent reviews each worker's changes and release gates
  before publication. Unfinished designs remain unpublished. This does not
  authorize external deployment or live payment activation.
- User correction (2026-10-21): Uchar Gilam's names must appear directly on the
  carpet as in its original artwork; the dark rounded text panel is not
  acceptable. Published template previews should show the original clothing
  section, populated with localized sample dress-code text and palette.

- User correction (2026-10-21): skip Uchar Gilam completely and continue with
  the next template. Oq Kabutar is now catalog-published at 150,000 UZS after
  source fidelity, four locales, opening, mobile layout, RSVP state, optional
  sections, and browser checks passed. External deployment and cloud-media/save
  verification remain open. Continue with Kuzgi Chinor.
- Follow-up (2026-10-21): Kuzgi Chinor is now catalog-published at 150,000 UZS
  after the four-locale, source-fidelity, opening, mobile, RSVP, optional-section,
  reduced-motion source guard, and asset checks passed. Its app-specific page
  metadata uses Uzbek as the source text so Uzbek Cyrillic renders naturally.
  External deployment and cloud-media/save verification remain open. Continue
  with Muhabbat Kitobi; Uchar Gilam remains skipped.

- Follow-up (2026-10-21): Muhabbat Kitobi is catalog-published at 150,000 UZS after its four-locale copy/metadata, source fidelity, responsive preview, RSVP, authored-story integration, and release checks passed. Story chapter labels are localized. External deployment and cloud-media/save verification remain open. Continue with Sahifa; Uchar Gilam remains skipped.
- Follow-up (2026-10-21): Sahifa is catalog-published at 150,000 UZS after source fidelity, localized metadata, four-locale content, opening, mobile width, optional sections, and clean browser-console checks passed. Preview wishes use the shared localized sample fixture; locale switching preserves invitation data. External deployment and cloud-media/save verification remain open. Continue with Oltin Uzuk; Uchar Gilam remains skipped.
- Follow-up (2026-10-21): Oltin Uzuk is catalog-published at 150,000 UZS after source artwork/styles, four-locale content and metadata, mobile width, opening, RSVP, optional sections, example wishes, and clean browser-console checks passed. Empty scene animations are skipped when the captured photo-based ring film replaces the 3D scene. External deployment and cloud-media/save verification remain open. Continue with Oynavand; Uchar Gilam remains skipped.
- User requirement (2026-10-21): every catalog and initial template-selection preview must show the optional To‘yona section using the shared preview-only JSON fixture. The example card details are `8600 1234 5678 9012` and `AZIZ AZIZOV`; never include them in saved creator invitations or public invitation data.
- User requirement (2026-10-22): Invitate designs display creator-provided To‘yona card details in a way that fits each template. Evelina and Aurelia show the optional section only when To‘yona is enabled and a card number is present; conceal the details on a card that flips open on click, include the cardholder when supplied, and allow copying the number.
- User requirement (2026-10-21): every catalog and initial template-selection preview must show the Bog‘lanish section with the shared preview-only contact examples `+998 90 123 45 67` and `@demo`. Keep these out of saved creator invitations and public invitation data.
- User requirement (2026-10-21): extend the shared preview-only wedding program to six localized entries (17:30 guest arrival, 18:00 couple entrance, 18:30 congratulations and dinner, 20:00 dancing and music, 21:30 cake, 22:30 closing words). Keep the Lahzalar section visible in template previews even when the gallery has no images; continue hiding empty galleries on public invitations.
- User correction (2026-10-23): preserve each captured Lahzalar/gallery section and use authentic original-source images in catalog and initial creator previews wherever available. Preview fixture content is ephemeral and never saved or published. Hide creator-photo galleries and optional creator-photo sections in public invitations when the creator uploaded no image. Keep source-owned opening/decorative art and intentional template default photos visible as the design requires; Aurelia retains its two captured default photos in empty slots, with creator uploads replacing those slots. This supersedes the prior empty-gallery placeholder-image rule.
- Follow-up (2026-10-21): Oynavand is catalog-published at 150,000 UZS after
  source fidelity, portrait opening artwork, four-locale, opening, sample
  program/dress-code/wishes/To‘yona/contact, empty Lahzalar, and RSVP checks.
  Additive migrations `0022` and `0023` were applied. External website deploy
  and cloud-service readiness remain unverified; continue with Somon Yo‘li.
- Follow-up (2026-10-21): Somon Yo‘li is catalog-published at 150,000 UZS
  after four-locale, opening, six-item localized program, source gallery,
  preview-only gift/contact, RSVP/wishes, and build checks. Migrations `0024`
  and `0025` were applied. Fixed locale-specific program delivery in the shared
  Marxaba runtime. External website deployment and cloud-service readiness
  remain unverified; continue with Qog‘oz Turna. The full test suite has one
  unrelated existing failure because Paxta's expected `preview.webp` is absent.
- Follow-up (2026-10-21): Qog‘oz Turna is catalog-published at 150,000 UZS
  after exact captured body/style/motion checks, packaged portrait artwork,
  four-locale browser review, opening behavior, the complete six-item program,
  preview gallery, shared wishes, gift/contact sample, and RSVP controls passed.
  Migrations `0026` and `0027` were applied. External deployment and cloud
  service readiness remain unverified; continue with Nilufar.
- Superseded by the 2026-10-23 user requirement above: catalog and blank creator
  previews use authentic original-source imagery wherever available, only as
  preview content and never in saved invitations. Keep empty icon cards where
  no authentic source image is available. Public creator-photo galleries and
  optional photo slots remain hidden until a creator uploads an image. Refresh
  placeholder image fallback and carousel bindings when preview data arrives
  after iframe initialization.

- Superseded on 2026-10-23: preview-only empty Lahzalar icon placeholders do not replace authentic original-source images when available. Keep accessible localized gallery controls, wraparound, smooth movement, and reduced-motion support.
- User requirement (2026-10-21): after each template is published, create a local Git commit for that publication; do not push it. Commit only after the template has passed its release gates and its publication state is verified.
- User correction (2026-10-21): Qandil and Oynavand catalog covers must match their captured source openings. Qandil uses the original source's initial dark-room, hanging-lantern opening rendered from `index.html`; do not substitute a user-provided screenshot. Oynavand must show its opening copy and names rather than an empty background. Refresh cover provenance whenever either source capture changes.
- Follow-up (2026-10-22): Suzani is catalog-published at 150,000 UZS via additive migration `0053_publish_suzani.sql`. The focused package suite, typecheck, responsive/four-locale browser checks, and isolated four-locale save/publish/public-render/reopen integration passed. Fixed the captured embroidered opening art's stacking with a documented template-scoped adapter. Reduced-motion browser emulation remains unavailable; source guards and assertions pass. Continue with O‘rik Guli. No external deployment or live payment activation.
- Follow-up (2026-10-22): O‘rik Guli is catalog-published at 150,000 UZS through migration `0054_publish_orik_guli.sql`. The database and `/api/catalog` confirm publication and wedding/fotiha/qiz-uzatish compatibility. Mobile reference comparison at 390×844, all four full-page locales, long names, gallery/lightbox controls, To‘yona, and guest-count control pass; no horizontal overflow or browser errors. The five focused package/fixture tests, web typecheck, production build, and isolated save/publish/public-render/reopen integration pass. Added exact 780×1170 first-view catalog-art provenance and a source-adaptations record. Runtime reduced-motion emulation remains unavailable; captured JavaScript/CSS handling and source assertions pass. No external deployment or live payment activation.

- Follow-up (2026-10-22): Lola is published at 150,000 UZS through additive migration `0059_publish_lola.sql`; four-locale save/publish/reopen integration and browser checks pass. Continue sequentially with Qiz Bazmi. Reduced-motion browser emulation remains unavailable; captured and CSS guards are present.
- Follow-up (2026-10-22): Qiz Bazmi is published at 150,000 UZS through additive migration `0060_publish_qiz_bazmi.sql`; four-locale save/publish/reopen integration passes for the catalog. Continue sequentially with Shahzoda. Reduced-motion browser emulation remains unavailable; captured and CSS guards are present.
- Follow-up (2026-10-22): Shahzoda is published at 150,000 UZS through additive migration `0062_publish_shahzoda.sql`; four-locale save/publish/reopen integration passes across the catalog. Fixed long-name clipping in the captured intro plaque and hero using a scoped app adapter. Continue sequentially with Chavandoz. Reduced-motion browser emulation remains unavailable; captured and CSS guards are present.
- Follow-up (2026-10-22): Chavandoz is published at 150,000 UZS through additive migration `0063_publish_chavandoz.sql`; the database and `/api/catalog` confirm Sunnat/birthday support. Full four-locale save/publish/public-render/reopen integration passes. Corrected published flags in the typed fallback catalog for all completed database releases so local catalog visibility matches publication state. Continue sequentially with Beshik; reduced-motion runtime emulation remains unavailable while captured CSS/JS paths are present.
- Follow-up (2026-10-22): Beshik is published at 150,000 UZS through additive migration `0064_publish_beshik.sql`; the database and `/api/catalog` confirm category `other` plus beshik-toyi/birthday compatibility. Fixed long-name clipping in the animated opening and hero with scoped adapter CSS. Full 402-test suite, typecheck, production build, browser checks, and four-locale save/publish/public-render/reopen integration pass. Continue sequentially with Konfetti; reduced-motion runtime emulation remains unavailable.
- Follow-up (2026-10-22): Konfetti is published at 150,000 UZS through additive migration `0065_publish_konfetti.sql`; DB and `/api/catalog` confirm the birthday category and birthday/jubilee support. Four-locale copy, long-name fit, candle opening, gallery movement, guest count, clean console, source parity, 402 tests, typecheck, build, and the catalog-wide save/publish/public-render/reopen integration pass. The in-app browser viewport override did not take effect, so mobile runtime review remains unverified; responsive rules and shared name-fit remain in place. Reduced-motion runtime emulation is unavailable; source JS/CSS support it. Continue sequentially with Oltin Kuz.

- Follow-up (2026-10-22): Invitate Evelina is published at 150,000 UZS after a local-source package, mobile/browser checks, focused tests, typecheck, production build, and the authenticated four-locale save/publish/public-render/reopen integration passed. The Cyrillic calligraphy fallback visually maps unsupported Uzbek `ҳ/қ` glyphs to `х/к` while retaining the original accessible text. The language chooser follows Anor's fixed header control. Continue with Aurelia, the first locally captured design in Invitate's live catalog order.
- User correction (2026-10-22): For Aurelia, preserve the two captured photo assets as visible design defaults. The first uploaded creator gallery image replaces the celebration photo and the second replaces the restaurant photo; an empty slot retains its captured default. Keep these defaults as template assets rather than saving them into invitation content.
- Source-fidelity follow-up (2026-10-23): Chavandoz's metadata-declared `preview.webp` was omitted from the local capture manifest/tree but remains available at the exact Marxaba source URL. Preserve that asset separately with provenance. Keep the catalog's existing authentic renderer capture, whose clean opening state differs from the recovered source preview's concrete sample invitation and crop; record both dimensions and SHA-256 values. Do not modify the source capture.

- Follow-up (2026-10-23): Bulbul's published catalog cover now uses a verified 430×932 direct render of the packaged source's closed-cage #intro opening. The previous 478×668 app-preview capture remains preserved as QA evidence, not catalog artwork. Its provenance and package adaptation note identify the render and source manifest.

- Source-fidelity follow-up (2026-10-23): Glass Pink's preserved and packaged opening markup contains one title and one open-button label; the adapters replace text nodes instead of appending duplicates. The original seven fonts were missing at the captured CSS's site-root paths and are now packaged under Glass Pink assets with template-scoped URL mappings. No standalone source cover asset was present locally, so central audit commit `cfeded0` captured the actual packaged renderer after the three opening fonts loaded and finite reveal animations finished. The inspected 432×768 cover has no overlap and `catalogEligible` is true. The archived HTML still lacks its original template JavaScript; animation timing parity remains unverified.

## Latest repair status for published-template audit (2026-10-23)

- Independently rechecked repaired reports and focused suites: batch 4 is 22/22; batch 5 is 18/18 with Glass Pink's settled catalog opening now approved; batch 6 is 26/26; batch 7 is 20/20; batch 9 is 25/25; batch 10 is 20/20; Oltin Yosh is 8/8. Batch 11's Oq Kabutar current 450×800 intro artifact was visually checked and its focused localization/contract suite passes 6/6.
- Resolved catalog/image findings: Anor, Bog‘i Eram, Evelina, Ganch, Hilol, Konfetti, Korporativ's typed publication metadata and preview gallery, Lola, Nahor, Oltin Kuz preview photos, Oltin Nur, Oltin Yosh, Oq Kabutar, Oltin Uzuk, Qog‘oz Turna, Retro Kino, Sahifa, Golden Card, Green Garden, and Yangi Uy. Anor/Bog‘i Eram/Sahifa are verified against their canonical Marxaba preview URLs; Qog‘oz Turna and Retro Kino package the exact source-declared preview bytes. Oltin Uzuk's repaired hand-and-ring opening cover passes its focused checks; its repair thread reports 7/7. Their batch reports now contain follow-up status where verified.
- Source-cover verification correction (2026-10-23): compare catalog imagery against the original site's own catalog asset as well as the invitation's runtime opening. For Marxaba templates, where `meta.js` declares `preview.webp`, the exact asset served from the canonical template URL is authoritative catalog-art evidence; do not classify an official post-opening preview as a mismatch solely because runtime `#intro` is a different state. Anor and Bog‘i Eram local covers are byte-identical to their official source previews; Bog‘i Eram's two sprite files also match their exact canonical source URLs. Sahifa's canonical source-path `preview.webp` is byte-identical to the local cover although its `meta.js` does not declare that property. Retro Kino and Qog‘oz Turna local covers differed from their source-declared previews, so those exact original files have replaced them. The combined Batch 14 focused suite now passes 22/22.
- O‘rik Guli's catalog opening cover passes 5/5 focused checks. A fresh Chrome preview confirms its delayed intro petals appear in normal motion (536 non-transparent canvas pixels during the transition) and stay absent in reduced motion; see the Batch 11 report. Yangi Uy’s cover follow-up is verified: a full `.intro` render uses the canonical fixture at 478×668, has corrected source provenance, and its focused test passes 8/8. Other reported runtime checks that remain unverified are recorded per batch. Glass Pink's catalog overlap is resolved by a settled, font-ready source-render capture; its original snapshot still does not include source JavaScript for an animation-by-animation comparison.
- Batch 1 runtime follow-up: Anor's normal opening completed its authored ~11-second sequence and reduced-motion mode opened directly; Atlas reached its open state in normal and reduced modes. Aurelia exposed a `templateId` temporal-dead-zone error in the shared Invitate renderer; the separate Aurelia repair task moved the declaration before the memo, and both Aurelia/Evelina focused checks pass 15/15. Aurelia now loads in both modes and pauses its hero video for reduced motion. Details are in `docs/templates/SOURCE_FIDELITY_AUDIT_BATCH_1.md`.
- Every published ID through the final batch has an audit report; all 51 DB entries were grouped in batches of three. Each confirmed repair finding has a template-specific project chat. Continue coordinating the remaining owners from this central thread and update the relevant batch record with concrete evidence.
- Aurelia runtime repair (2026-10-23): the shared Invitate renderer read `templateId` inside its memoized payload before the `const` initialization below the hook, causing the published Aurelia preview to throw before mounting its source iframe. Moved the initialization above the memo and added a focused source-order regression assertion. A fresh local bundle now initializes `templateId` before the callback, and normal/reduced-motion Aurelia previews both mount cleanly with fixture names and no page or resource errors. The source hero video plays in normal mode and pauses for reduced motion. Aurelia and Evelina focused tests pass 15/15.

## Invitate Palov event compatibility (2026-10-23)

- The Invitate manifest resolves this design to `Web invitations/invitate.uz/palov.html`. Its explicit “Nahorgi osh” content and Palov artwork establish event support `osh` only and category `osh`; category assignment does not imply event support. Its app ID is `invitate-palov`, distinct from Chorlove’s existing `palov`.
- The complete captured page, local font files, and API-backed adapter are packaged under `apps/web/public/templates/invitate-palov`. The catalog image is a 480×860 capture of the actual adapted opening rendered with `createTemplatePreviewSample("invitate-palov")`; its hash and capture method are recorded in `source-provenance.json`. Catalog preview and public invitation dispatch both use the shared `InvitateInvitation` renderer.
- Focused checks pass 5/5, the production build passes, browser preview and RSVP validation were verified, and the public catalog API returns the image with HTTP 200. Additive migration `0132_publish_invitate_palov.sql` was applied alone under the migration lock; the database and catalog API confirm the template published with `osh` category/event support at 150,000 UZS. No external deployment or live payment activation is included.

## Invitate Estelle implementation status (2026-10-23)

- User-assigned task: implement only Estelle from the exact Invitate capture
  paths `Web invitations/invitate.uz/estelle.html`, `assets/css/estelle.css`,
  `assets/js/estelle.js`, locally captured font files, and the page's referenced
  `assets/previews/template/adelina` art/video. Captures remain untouched.
- The isolated package is under `apps/web/public/templates/estelle`; the typed
  renderer adapter uses the shared contract and central preview fixture. The
  captured intro/video, scratch-to-reveal, section composition, and motion code
  are carried over; site tracking, reference RSVP endpoint, native alerts, map
  embed, and captured invitation copy are excluded/replaced. `estelle` is typed
  as wedding-only, wedding-category, 150,000 UZS and unpublished.
- Release remains pending: clean portrait opening artwork/provenance, focused
  end-to-end validation of scratch/reduced-motion, locale/date rendering and
  RSVP/wishes APIs, and central assignment of a unique additive migration
  sequence. Do not select or publish before these checks pass.

## Invitate Velora registration reservation (2026-10-23)

- The exact source is `Invitate/Web invitations/invitate.uz/velora.html` as
  resolved from its capture manifest. Coordinator reservation: unique typed
  catalog ID `velora`, wedding category and wedding-only event compatibility,
  migration filename `0124_register_velora_template.sql`.
- The initial configured-database check found no Velora row. The reserved
  additive migration was subsequently applied alone under the migration lock;
  it registers `velora` at 150,000 UZS in wedding category/event with
  `published=false`. Keep it unselectable until the source adapter, authentic
  portrait opening artwork, integration, and verification gates pass. Do not
  deploy externally or enable live payments.
- The packaged renderer was exercised in headless Edge at a 480×860 viewport
  with a fixture payload: six ordered agenda rows, three story entries, five
  dress palette colors, localized date/calendar, map link, and empty RSVP
  validation rendered as expected. A second run confirmed reduced-motion
  preference detection; all requested source artwork/font resources returned
  HTTP 200. The focused Velora suite passes 4/4; typecheck, production build,
  both packaged JS syntax checks, and `git diff --check` passed. Public-route/API
  submission/save-reopen checks are still pending, so keep the catalog and
  database row unpublished.

## Invitate Girls Party source mapping (2026-10-23)

- User-assigned source: Invitate `Web invitations/invitate.uz/girlsparty.html`
  and its captured `girls.css`, `girls.js`, video, image, and font resources.
  Register compatibility for the existing `qiz-bazmi` event type only; its
  category is separate from event compatibility. Use ID `girlsparty` and
  migration `0125_register_girlsparty_template.sql`; the migration is applied
  and the verified database row remains unpublished at 150,000 UZS with
  `qiz-bazmi` category and event support.
- The source's dietary restriction and favorite-song form fields have no
  approved shared contract/storage mapping and are excluded. Its fixed gift
  advice is invitation-specific sample content without a creator field and is
  excluded. The isolated source package is connected to the shared Invitate
  renderer, including localized contract data, countdown date and preview RSVP
  guard. The authentic 450×800 opening is captured from the shared renderer;
  provenance is in the template package. Matching viewport source/package
  browser captures were reviewed in normal and reduced motion. Four locales,
  fresh reduced motion, fixture binding and the preview RSVP no-fetch guard
  pass. The source timeline also has a step label and description that the
  shared program contract cannot represent; these remain hidden and are a
  fidelity gap. The fixed gift-advice sample copy is excluded, and its source
  card layout displays catalog-only fixture wishes or approved public wishes
  through the existing moderation service. Keep private/unselectable until
  the timeline gap is resolved, public-route parity and real RSVP/wish
  persistence are verified.

## Invitate Golden Hour source mapping (2026-10-23)

- Exact source: Invitate `Web invitations/invitate.uz/golden-hour.html` and its
  manifest-matched CSS, JavaScript, five images and local font faces. A search
  of the full Invitate archive found the referenced `assets/audio/lanadel.mp3`
  (9,386,537 bytes) and no additional Golden Hour HTML/JS chunks. The audio is
  intentionally not copied as creator media. The referenced `golden-hour.php`
  endpoint is absent and replaced by the shared RSVP API adapter. Use ID
  `golden-hour`, birthday category, and birthday-only event compatibility.
- Package behavior adapts the captured countdown, reveal observer, and music
  toggle from the original script in `golden-hour-source.js`; the narrow app
  adapter maps typed data and replaces the missing PHP RSVP endpoint with
  shared RSVP/wishes APIs. Public invitations now attempt playback on open under
  the 2026-10-26 music requirement; the template toggle remains available.
- Migration `0127_register_golden_hour_template.sql` is applied to the
  configured database. The catalog and
  shared Invitate renderer use the same localized contract adapter and
  ephemeral `preview-sample.json` values.
- The captured age `20` and tagline are source sample content, and the shared
  Invitation contract has no age field. The app copy omits both instead of
  displaying or saving sample age data. The catalog artwork uses the exact
  portrait hero image supplied by the source capture.
- The original capture has no gift/To'yana section; the app-added gift markup,
  card mapping/copy action, and receipt hook have been removed. RSVP and wishes
  use the public invitation APIs. A
  normal-motion comparison against the live source and app preview is complete
  at 390×844 and 1280×720. Hero image/crop, centered desktop column,
  typography, location, and dress-code styling match. Contract-driven preview
  copy omits source demo age/tagline/signature; the shared birthday fixture
  swatches differ from the source demo palette. Both pages had no browser
  console errors. The browser reports reduced motion as false and this session
  cannot emulate it, so runtime parity under that preference is unverified;
  CSS reduction rules and focused source checks are present.
- Publication follow-up (2026-10-26): focused Golden Hour checks pass 5/5 and
  web `tsc --noEmit` passes. The authenticated HTTP lifecycle passed: creator
  save, publish, public render, reopen, and allowed edits. Migration
  `0146_publish_invitate_golden_hour.sql` verifies birthday-only metadata and
  publishes the existing 150,000 UZS row. Reduced-motion runtime comparison
  remains a human visual follow-up; CSS rules and source checks are present.
  Normal-motion comparison and exact source artwork/style asset hashes were
  already verified at the recorded desktop and mobile viewports.

## Invitate Butterfly implementation status (2026-10-23)

- User assignment: implement only Butterfly from the manifest-resolved
  `Invitate/Web invitations/invitate.uz/butterfly.html` source and its paired
  template assets. Use ID `butterfly`, wedding category/event compatibility,
  and reserved migration `0129_register_butterfly_template.sql`. Preserve the
  capture; rights research is out of scope.
- The isolated source, shared-contract adapter/renderer, catalog/creator/public
  routes, and portrait opening preview are present. Migration 0129 is already
  applied to the configured database; its row is verified at 15,000,000 UZS,
  wedding category/event, `published=false`. Keep the typed entry private.
- The source has no program, RSVP, gift/to'yona, dress-code, contact, or guest
  wishes UI. User decision (2026-10-25): preserve the reference and do not add
  these absent sections; treat them as source-absent optional content, not a
  product blocker. Map supported fields and keep unsupported optional content
  hidden. RSVP verification is explicitly deferred.
- Follow-up (2026-10-25): full web `tsc --noEmit` passes; focused Butterfly
  tests pass 3/3, `node --check` passes, and scoped `git diff --check` passes.
  The 2026-10-24 local app run returned HTTP 200 for the real preview route,
  packaged source page, and authentic portrait cover. No app listener or
  browser tab was available today, and `DATABASE_URL` is unset, so no fresh
  route or database/catalog check was possible. The source-absence decision is
  resolved above. Authenticated save/reopen and fresh DB/catalog verification
  remain unavailable because `DATABASE_URL` and the local app server are
  absent; keep the template unpublished until those checks pass.

- Publication follow-up (2026-10-26): the database is now configured in the
  ignored local env. Butterfly is published by migration
  `0143_publish_invitate_butterfly.sql`; wedding-only metadata and 15,000,000
  UZS are verified. Focused source checks pass 3/3, web typecheck passes, and
  authenticated creator save → publish → public-render → reopen passes 1/1.
  RSVP/wishes remain deferred. The known reduced-motion gate presentation
  difference is recorded for the user's manual review. No external deployment
  or live payment activation occurred.

## Invitate Fairy implementation status (2026-10-23)

- Exact source is Invitate `Web invitations/invitate.uz/fairy.html` with its
  manifest-referenced CSS, JavaScript, image, font, and audio assets. Use ID
  `fairy`, wedding category/event compatibility, 150,000 UZS, and additive
  migration `0123_register_fairy_template.sql`. Prior read-only DB inspection
  confirmed the migration is applied and the row is unpublished. The current
  checkout's app environment is separate and has no configured database.
- The isolated source package is integrated through the shared Invitate
  renderer for preview and public routes. It maps names, greetings, date,
  program, venue/map, dress code, music, contacts, RSVP, and wishes in the four
  supported locales. The captured page has no gallery or family/host fields;
  an optional localized To‘yona section is added per the established Invitate
  requirement and stays hidden unless enabled with a card number.
- Source-authentic 480×850 portrait opening art uses ephemeral shared preview
  fixture data; original captures are untouched. Local checks cover all four
  locales, long names, To‘yona, preview RSVP failure handling, source-handler
  removal, and typed wedding registration. The isolated package is committed
  as `eda7db21`; the shared renderer/doc edits remain unstaged.
- Follow-up (2026-10-25): a disposable browser-local creator draft with names
  `Fairy QA` / `Malika QA` survived reload, and the full
  `/preview?template=fairy&draft=…` route rendered those names through the
  shared Fairy frame. This confirms browser-local draft recovery and preview
  rendering only. The local `/api/auth/session` reports `configured:false` and
  missing `DATABASE_URL`, `APP_URL`, `SESSION_SECRET`, and Telegram settings;
  clicking Save also displayed that Telegram saving is not configured and the
  draft stays in this browser. No DB-backed invitation save/reopen or actual
  `/i/[slug]` public route was possible. Keep Fairy unpublished until those
  non-RSVP checks can pass. Per user decision, RSVP/wishes verification may be
  deferred and handled later; do not claim it is verified.

- Publication follow-up (2026-10-26): Fairy is published by additive migration
  `0144_publish_invitate_fairy.sql` at 15,000,000 UZS with wedding-only
  compatibility. Focused source checks pass 3/3; web typecheck passes; the
  authenticated creator save → publish → public-render → reopen integration
  passes 1/1. RSVP/wishes remain deferred. Reduced-motion browser comparison
  remains for the user's manual review. No external deployment or live payment
  activation occurred.

## Invitate Velora publication (2026-10-26)

- Velora is published by additive migration `0145_publish_invitate_velora.sql`
  at 15,000,000 UZS with wedding-only compatibility. Its focused package suite
  passes 8/8, web typecheck passes, and the authenticated creator save → publish
  → public-render → reopen integration passes 1/1.
- The source CSS/JS/HTML and local font assets are hash-checked, but the manifest
  screenshot is absent and valid source/package visual and browser reduced-motion
  comparisons remain for the user's manual review. RSVP service submission was
  not exercised. No external deployment or live payment activation occurred.

## Chorlove Orchid Amplop publication (2026-10-26)

- The remaining non-RSVP creator/public lifecycle gate passed through the
  authenticated save → publish → public-render → reopen integration (1/1).
  Focused preview-media checks pass 2/2. Additive migration
  `0141_publish_chorlove_orchid_amplop.sql` published the existing row; the
  database confirms 15,000,000 UZS with wedding category/event support.
- The configured `/api/catalog` includes Orchid Amplop. RSVP/wishes verification
  remains deferred under the user's existing decision. No external deployment
  or live payment activation was performed.

## Chorlove Palace Rose publication (2026-10-26)

- The authenticated creator save → publish → public-render → reopen integration
  passed (1/1); focused Palace Rose checks pass 6/6. Additive migration
  `0142_publish_chorlove_palace_rose.sql` published the existing wedding-only
  row at 15,000,000 UZS, and the configured catalog includes it.
- The user will complete the remaining manual check of an editor draft with an
  optional receipt host. Native OS reduced-motion emulation was unavailable;
  the captured reduced-motion rules and package preview path were checked.
  No external deployment or live payment activation was performed.

