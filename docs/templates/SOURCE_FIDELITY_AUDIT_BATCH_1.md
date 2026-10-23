# Published-template source-fidelity audit — batch 1

Date: 2026-10-23

## Database order and provider search

The configured database lists Anor, Atlas, and Aurelia as published rows 1–3 by
template ID. Searched all available provider manifests and the full local
capture tree, including Marxaba, Invitate, Chorlove, and the other archived
providers. Marxaba contains the exact Anor and Atlas sources; Invitate contains
the exact Aurelia source. Yoryor's `anor.webp` is a standalone asset, not an
alternate Anor template. No other complete exact-name source was found.
Original captures remain untouched.

## Findings

- **Anor:** The captured template files and artwork are retained in the isolated
  package; the platform bridge owns contract data, locale, and services. The
  full captured dress-code section is mapped, source To‘yona bank/note fields
  without contract equivalents are hidden, and source wishes stay preview-only
  or use the platform API. The current catalog image shows the post-opening
  hero. The captured `#intro` is a closed pomegranate opening with greeting and
  “Anorni ochish” action. At audit time the capture manifest's metadata preview
  file was absent from the local source folder, so the hero was initially
  classified as a catalog-cover mismatch. The later canonical source-URL check
  below supersedes that classification.
- **Atlas:** Captured CSS, JavaScript, metadata, textile artwork, and body
  structure are retained; invitation-specific values are mapped through its
  platform adapter and the captured source fonts are local. Its portrait
  catalog image depicts the actual first/opening page. Captured gallery art is
  supplied only in empty catalog/selection previews, creator uploads take
  precedence, and the shared public renderer hides an empty creator-photo
  gallery. Source opening and reduced-motion paths remain in the package.
- **Aurelia:** The exact Invitate page, CSS, JavaScript, fonts, ornaments, and
  hero video are packaged. The adapter handles localization, RSVP/wishes APIs,
  gallery uploads, and To‘yona while preserving the source opening, countdown,
  and motion. The extra captured RSVP handler that reported success without
  contacting the service was removed. The opening cover matches the captured
  source composition. The two captured default photos remain template-owned
  artwork when creator slots are empty; creator uploads replace them.

## Preview and verification

The shared preview fixture is used only for catalog and initial selection;
blank drafts do not inherit its content. Public creator-photo sections stay
hidden until an uploaded image exists, except for deliberate template-owned
defaults such as Aurelia's captured photos.

The combined focused suite for batches 1 and 2 passed **48/48** after correcting
three stale assertions that expected an older, template-specific sample-photo
condition. They now guard the shared renderer's preview-only gate, creator
upload precedence, and template-scoped venue sample behavior. Fresh browser
animation and interaction runs were not performed in this audit.

Anor's separate repair task (`01a166ef-0ccd-7f41-a136-ffa150ca0bcd`) initially
attempted a renderer capture. Its cover finding was later closed after the
canonical source URL was checked below. No replacement capture was needed. No
database, publication, deployment, or payment state changed.

## Catalog source-image follow-up (2026-10-23)

The captured Anor `meta.js` and canonical `https://www.marxaba.uz/templates/anor/meta.js` have the same SHA-256. The original source's declared `https://www.marxaba.uz/templates/anor/preview.webp` is 720×1280 and byte-identical to the packaged catalog image (133,366 bytes; SHA-256 `2a17a48b…5bdfc`). Its post-opening composition is the original site's own catalog cover, so the earlier claim that this cover was mismatched because runtime `#intro` is a closed pomegranate is superseded. No opening screenshot replacement is required; provenance is recorded in the template package.

## Runtime interaction follow-up (2026-10-23)

Opened the actual local preview routes in Chrome at 450×800 in normal and reduced-motion modes. Anor's captured pomegranate opener entered its `is-open` state after activation in both modes; Atlas's `#open-invitation` entered its opening state in both modes, with five running animations in normal mode and zero before activation in reduced mode. Aurelia's source iframe now renders without a React error in either mode; its hero video plays in normal mode and remains paused for `prefers-reduced-motion: reduce`. The fixture names appear after the renderer finishes loading. Targeted checks found no broken image URLs or template asset HTTP errors. The focused Aurelia/Evelina suites pass 15/15.

## Normal/reduced-motion runtime follow-up (2026-10-23)

Opened the current local preview routes at 450×800. Anor and Atlas both loaded
their source frames (HTTP 200) without page exceptions or failed template-asset
responses. Anor's normal fruit-opening sequence completed after its authored
approximately 11-second animation; the reduced-motion opener completed directly
to the opened state. Atlas reached its opened body state in normal and reduced
motion, with no active Web Animations remaining in the reduced run.

Aurelia initially failed before its frame loaded because the shared Invitate
renderer read `templateId` inside `useMemo` before its later `const` declaration.
The one-template Aurelia repair task `01a16709-c2c4-76d3-9ba8-a322abae31b6`
moved the declaration before the memo. After the fix, Aurelia loaded in normal
and reduced-motion previews; the source hero video played normally and paused
under `prefers-reduced-motion`. The focused Aurelia/Evelina suite passes 15/15.
No source capture, database, publication, deployment, or payment state changed.
