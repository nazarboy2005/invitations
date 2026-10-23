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
- The available reference is a Next.js server-rendered preview snapshot, not
  template-level HTML/CSS/JavaScript source. Its recorded SHA-256 matches the
  package provenance record. The package extracts the captured subtree and
  retains the source styles/fonts/art while excluding the app runtime and
  sample data; platform behavior is rebound by `bridge.js`.
- The previous catalog image `preview-browser-capture.jpg` was 319×668 (ratio
  0.478) and showed the language selector, music button, and scrollbar. It has
  been replaced by `preview-opening.png`, a clean 720×1280 (9:16) capture of
  the post-envelope opening hero from the packaged snapshot renderer using the
  canonical preview names. The capture has no browser or catalog controls and
  its SHA-256 and viewport are recorded in `source/provenance.json`.
- The all-provider manifest and asset search found no alternate metadata cover
  or separate Cloud Castle source package. The available reference remains a
  server-rendered snapshot. Its markup/styles/assets substantiate the captured
  opening composition and portrait crop, but do not include the original
  component/runtime handlers. Interaction and animation parity remain
  unverifiable from this archive; the cover does not claim that parity.
- Exact opening animation sequence and original interaction handlers cannot be
  audited from this capture because the snapshot does not contain the original
  component/runtime event code. `SOURCE_ADAPTATIONS.md` documents the adapter
  behavior and the unrepresented-control release-gate question. This is a
  source-archive limitation, not evidence that the adapter reproduces the
  original runtime.
- The adapter checks the operating-system reduced-motion preference and a
  preview QA flag, then suppresses its adapted entrance reveal. This verifies
  the adapter's own path only; it cannot establish how the missing source
  runtime handled motion.
- The bridge filters gallery data to entries with creator image URLs, hides
  empty image slots, and hides the story/gallery container when it has neither
  authored chapters nor photos. Template-owned opening artwork remains in the
  snapshot and is independent of creator gallery content.
- To‘yona and contact data are adapted through the shared invitation contract;
  no static source evidence in this audit establishes every interaction or
  reduced-motion state.

## Follow-up IDs

Queried the configured database directly for published IDs greater than
`cloud-castle`, sorted by ID. The next three are `doira`, `evelina`, and `ganch`.
