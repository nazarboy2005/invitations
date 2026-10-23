# Source fidelity audit: batch 3

Audit scope: published template IDs `bulbul`, `chavandoz`, and `cloud-castle`,
in the configured database order following `bogi-eram`. Local captures were
searched across provider folders and manifests. The source capture directories
were left untouched.

Preview-only artwork rule: use authentic source images in previews when the
capture provides them, and never persist those images in creator invitation
content. In public invitations, hide creator-photo gallery/optional photo
sections until creator images exist; retain template-owned opening art and
decorations.

## Findings

### `bulbul`

- Source: `Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/bulbul`.
- The captured `template.css`, `template.js`, and `plaque.js` are byte-identical
  in the package. The packaged body preserves the capture. The separate
  `i18n.js` is adapted, and `index.html`/`meta.js` point to the platform runtime,
  local fonts, and platform preview. The source capture has no cover image.
- Confirmed catalog-cover defect: the typed catalog record points to
  `/templates/bulbul/preview-browser-capture.jpg` (478×668, ratio 0.716), a
  first-viewport browser screenshot. The screenshot visibly includes the
  overlaid language selector clipped at the right edge and shows only a partial
  tall opening scene. The package also has `preview.png` at 430×932 (ratio
  0.461), but its provenance is undocumented and the catalog does not use it.
  Thus the selected catalog art is not a clean portrait first-page image and
  does not show the complete opening scene. Replace/verify the actual opening
  artwork before treating the cover as source-faithful.
- The opening/animation can be inspected from captured source code: the bird,
  cage, and garden sequence are implemented in the preserved template scripts.
  The packaged stylesheet includes a `prefers-reduced-motion` block. The
  browser capture itself shows the opening scene before the complete sequence,
  so a static image cannot establish runtime sequence parity.
- To‘yona bank-name remains intentionally unrepresented under the approved
  product contract, as recorded in `SOURCE_ADAPTATIONS.md`; no data is invented.
- The shared Marxaba runtime keeps empty galleries visible in previews and hides
  the gallery section on public invitations without creator photos. Template
  opening art remains sourced from the template package.

### `chavandoz`

- Source: `Invitations - this folder will be removed from production/Marxaba/Sunnat to'yi/templates/chavandoz`.
- The captured stylesheet, locale file, and metadata are byte-identical in the
  package. The document and script differ to localize dependencies and adapt
  optional selectors; the README documents these changes. The capture's
  metadata-declared `preview.webp` resolves relative to the source page at
  `https://www.marxaba.uz/templates/chavandoz/preview.webp`. Although omitted
  from `capture-manifest.json` and the local capture tree, the origin serves it
  (HTTP 200, `image/webp`, 720×1280; SHA-256
  `dae64947a37574f1be8ae08e17ad17809a937fbcb9b6490c054e38dff3bfadd4`). Its
  exact bytes are preserved separately as `source-preview.webp`; the source
  capture tree remains untouched.
- The source preview is visually a filled sample invitation crop: carousel,
  horses, “Abdulloh,” invitation copy, family attribution, and date/time. It is
  not byte-identical to the catalog image (450×800, SHA-256
  `3d808aa28f6d5df0685d99f260a7de0319bd7f4b1c1851c0a1a7987571bb73f9`). The
  catalog image is an authentic browser capture of the packaged source opening
  with the centralized preview fixture; it shows the clean greeting, language
  control, and source “Taklifnomani ochish” action. It is not recreated art.
  The existing catalog image is retained because the recovered source asset
  embeds concrete sample invitation content and uses a different crop. Both
  image provenance and hashes are recorded in the package README and
  `preview.provenance.json`.
- Captured code and documentation identify the carousel, GSAP/ScrollTrigger
  motion, scroll rider, calendar, RSVP, wishes, gallery, To‘yona, and contact
  controls. This supports implementation presence; exact runtime sequence,
  and control parity still require a live browser comparison. The packaged
  script checks `prefers-reduced-motion`, bypasses the opening transition when
  reduced motion is active, and skips its 3D setup. The README records browser
  interaction checks as previously completed; this audit did not rerun them.
- `venue.photo`, `toyona.bank`, and `toyona.note` have no approved contract
  fields and are left empty/hidden per the documented adapter policy.
- The shared Marxaba runtime keeps the empty gallery visible in previews and
  hides it in public invitations when creator photos are absent.

### `cloud-castle`

- Source: `Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/cloud-castle/preview-frame.html`, with assets under `Chorlove/Web invitations/images/cloud-castle`.
- The capture is a Next.js server-rendered preview snapshot. Its matching
  original page module is also present in the Chorlove chunk archive:
  `_next/static/chunks/14t58uni224ve.js` (module 909129; 58,812 bytes; SHA-256
  `81f9356f44be09216be952fd5a90739b0796f8825c9c7c398479b3d8205cee6b`). The
  module contains the source envelope, particle system, hero entrances,
  cloud/castle scroll values, and section motion variants. The isolated package
  retains captured markup/styles/assets while excluding the site runtime and
  sample invitation data.
- The previous catalog image `preview-browser-capture.jpg` was 319×668 (ratio
  0.478) and showed the language selector, music button, and scrollbar. It has
  been replaced by `preview-opening.png`, a clean 720×1280 (9:16) capture of
  the post-envelope opening hero from the packaged snapshot renderer using the
  canonical preview names. The capture has no browser or catalog controls and
  its SHA-256 and viewport are recorded in `source/provenance.json`.
- The all-provider manifest and asset search found no alternate metadata cover.
  The current opening cover is a clean 720×1280 capture of the source-styled
  post-envelope hero. Its full choreography is verified against the compiled
  page module, with values recorded in `SOURCE_ADAPTATIONS.md` and
  `source/provenance.json`.
- The bridge reproduces the source envelope's 32 deterministic particles,
  ambient fall/sway/rotation, burst, heart pulse, button sheen, card/flower
  exits, and delayed overlay fade. It restores the original hero entrances and
  the source scroll ranges for the three clouds, castle, and decorative
  flowers. The platform reduced-motion path skips those animations and opens
  immediately.
- The bridge filters gallery data to entries with creator image URLs, hides
  empty image slots, and hides the story/gallery container when it has neither
  authored chapters nor photos. Template-owned opening artwork remains in the
  snapshot and is independent of creator gallery content.
- To‘yona and contact data are adapted through the shared invitation contract.
  The compiled source module also defines the original To‘yona decorative
  object animations; they remain a distinct follow-up if full interaction-level
  parity is required beyond the opener, hero, and page reveal behaviors.

## Follow-up IDs

Queried the configured database directly for published IDs greater than
`cloud-castle`, sorted by ID. The next three are `doira`, `evelina`, and `ganch`.
