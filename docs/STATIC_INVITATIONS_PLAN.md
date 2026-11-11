# Static image invitations plan

> Update (2026-11-11): free publication/download behavior described below is superseded. All new website publication and clean PNG downloads require verified payment; no publishing-mode setting exists. QA now uses disposable paid order fixtures. See [payments](PAYMENTS.md).

Date: 2026-11-03. Status: initial implementation authorized for one original 5:7
image, free testing without Click, on Templates/Studio/Taklifnomalarim only.
The first design is Oq atirgul (`ivory-rose-card`), exporting 1500 x 2100 PNGs.
Confirmed requirements are recorded separately in `IMPLEMENTATION_DECISIONS.md`;
the sections below retain the design rationale and distinguish later options.

## Product and creator flow

User requirements: fixed-composition image templates, creator details mapped into
the artwork, flattened image download, protection against ordinary preview copy
and download, and visibility in Templates, Studio and Taklifnomalarim. Select the
aspect ratio before preparing artwork; device viewport dimensions do not define
the invitation's proportions.

Proposed flow: select an image template and event -> enter supported details ->
review protected preview -> authenticate/save -> confirm final details -> free
owned PNG download. Payment is a later follow-up after user confirmation.

Treat image invitations as a second format alongside existing web invitations
initially. Do not remove or convert existing invitations. A static export does not
require a public invitation webpage or public invitation URL.

## Aspect ratio and output

| Option | Example export | Intended composition |
| --- | --- | --- |
| 5:7 portrait, recommended starting point | 1500 x 2100 px | Traditional invitation card with room for names and event details |
| 4:5 portrait | 1600 x 2000 px | Shorter card for compact image sharing |
| 9:16 portrait | 1080 x 1920 px | Tall story-style composition |

The user approved 5:7. Avoid multiple
ratios for the same design in the first release: reflow requires deliberate
artwork/layout changes, not an automatic crop. Store dimensions per template so
other ratios can be introduced later. Scale the entire card proportionally in
Studio and show uncropped artwork in catalog/dashboard cards.

Recommend flattened PNG for crisp text. JPEG could follow if smaller sharing files
are needed. Export no editable SVG, PDF text, HTML, design file or layered source.
This is a digital-image first release; print production is separate scope.

## Artwork and field mapping

The user can supply finished artwork or request generated designs after the ratio
is chosen. Prefer a clean high-resolution background without variable names,
dates or venue text baked into it. For an example containing text, distinguish
decorative permanent lettering from replaceable content; obtain or prepare a clean
background before turning it into a reusable template. Keep originals untouched.

For each design, inspect the artwork and prepare a mapping for review: field,
bounding box, font/style/color, alignment, line limit, size range and whether it is
required. Examples: greeting, event label, people, hosts, invitation wording,
date/time, venue, address and optional contact. Only expose fields the design fits.
Allow creator photo slots only when intentionally supported by that design.

Use fixed slots rather than a free-position design editor. Define controlled line
wrapping and font shrinking with a readable minimum; report overflow before final
download instead of silently clipping or truncating names. Optional empty fields
follow an explicit layout rule. Bundle fonts locally, verify all supported scripts,
and test long Uzbek Latin/Cyrillic, Russian and English content.

Use the image invitation's default locale without language selectors. Preserve
existing stored translations; never silently translate. Catalog samples come from
the shared preview JSON and never become saved creator data. Static images have no
music, animation, interactive RSVP or wishes forms. Supported designs include a
locally generated location QR targeting the selected Yandex destination (or a Yandex
search for a written-only address). Reuse the existing Yandex venue editor/APIs.

Each design declares supported content fields and owns its visual hierarchy; there
is no universal names/date composition. Oq atirgul omits greeting, hosts and contacts.
Mandatory: event people, heading, invitation text, date/time, timezone, venue name
and location (written address or map). Only supported inputs appear or persist.
Format choice comes first: Veb taklifnoma / Rasm taklifnoma. Web catalog categories
are hidden for images; Studio event choices depend on the selected format. Both
formats use the same artwork-left/detail-right popup arrangement with create first.

## Preview protection and export boundary

No browser implementation can guarantee that a visible preview cannot be captured,
saved through developer tools or photographed. Flattening removes editable text
layers but cannot stop OCR, retouching or AI edits after download.

Recommend reduced-resolution preview images with a repeated, readable watermark
baked into the actual pixels on the server. The browser receives neither a clean
full-resolution personalized image nor reusable background/text layers. Disable
ordinary context-menu, drag and long-press image actions on the preview surface
where practical, without affecting input editing or keyboard access. These UI
measures are deterrents, not authorization controls. A removable CSS overlay alone
does not protect the underlying image.

Keep full-resolution artwork, layout definitions and final exports in private
server storage, separate from public template artwork and dashboard thumbnails.
Public catalog art uses sample content. Personalized previews need draft/owner
authorization, account-safe caching and no public CDN delivery. Rate-limit preview
rendering and debounce edits. Scope anonymous draft previews to their own session.

Render final output from the validated saved invitation and a versioned template
definition. Verify owner, entitlement, template compatibility, current content
revision and editing permissions on the server; never accept the browser's claimed
price or payment state. Store the resulting clean image privately and deliver only
through an authorized download endpoint. Use one rendering definition for preview
and final export, with explicit resolution and watermark parameters.

## Integration with the existing application

- Contracts/database: add an explicit format discriminator (proposed `web` or
  `image`), dimensions, supported slots and versioned static layout metadata.
  Preserve existing web records through additive migrations. Keep format separate
  from categories and event compatibility.
- Templates: add a format filter/badge; retain categories, favorites, prices and
  published/event-compatible selection. Show the whole static artwork at its ratio.
- Studio: reuse account/draft/language infrastructure, but show image-supported
  fields and a fixed-ratio preview. Use a download-oriented final action. Hide
  unsupported web features. Define cross-format switching and warn before any
  existing capability projection discards unsupported authored content.
- Taklifnomalarim: mix formats in the existing list with format/status labels,
  personalized protected thumbnails, edit/resume and authorized download actions.
  Static cards must not promise a public link, view statistics or RSVP activity.
- Admin: retain price, category, event compatibility and catalog publication
  controls. Keep new static designs unavailable until their own verification passes.
- Payments/fulfillment: separate a verified purchase entitlement from web-page
  publication. If paid image downloads are approved, fulfill an image entitlement
  rather than automatically publishing a web invitation or promising its URL in
  payment notifications. Preserve idempotent fulfillment and retry without another
  charge after render/storage failure. No live payment activation is implied.
- Rendering/storage: inspect the existing cover browser and private storage for
  reusable components, but build a dedicated static export flow with its own
  limits. Confirm runtime/memory/concurrency suitability before choosing browser
  capture versus image composition. Do not use dashboard covers as final exports.

## Editing and reuse policy mapping

Existing web invitations belong to one event, with publication/checkout identity
locks, reviewed name/date corrections and an event-day editing deadline. Preserve
those rules for web invitations. Static exports need an explicit equivalent
milestone because there is no public publication step. The implementation uses
the first successful download as that milestone, preserving the existing policy.

Recommend event-specific entitlement: freely edit before purchase/finalization;
lock people/event identity when the entitlement is finalized (and reserve identity
at checkout if applicable); allow practical corrections until the approved event
deadline; send identity/date changes through existing admin review. Re-download
the same entitled result without charging again. Allowed corrections create a
new version and leave earlier downloaded files unaffected. First-download identity
locking and the event-day editing deadline are the implemented equivalents of
existing web policy. Future paid entitlements and download retention remain open.

## Implementation sequence and verification

1. Confirm ratio, first artwork, preview watermark, price/free mode, identity-lock
   milestone and post-download correction/re-download policy.
2. Prepare one complete design and review its field mapping. Verify long names,
   optional omissions and all four scripts at the chosen dimensions.
3. Build the static contract, renderer, private preview/export storage and owned
   download service. Add only the required additive schema changes.
4. Integrate that design into Templates, Studio, Taklifnomalarim and admin, including
   appropriate entitlement fulfillment if paid downloads are approved.
5. Verify equal preview/export placement; exact PNG dimensions and flattened
   output; missing/overflow handling; locale correctness; no saved sample data;
   anonymous/other-account denial; no clean pre-entitlement image in browser
   responses; revision integrity; duplicate fulfillment; failed render recovery;
   dashboard save/reopen/download; and existing web invitation regression paths.
6. Publish the first static catalog design only after the gates pass. Then add
   further designs through the same mapping and verification process.

## Decisions still open

- Whether static designs remain alongside web invitations long term.
- Whether the initial generated design and watermarked preview meet user approval.
- Future static prices/Click activation; do not implement payment until requested.
- Download retention after export.
- One selected-language download initially versus a multi-language bundle.

The subsequent user instruction authorizes artwork generation, local application
implementation and catalog integration. External application deployment and live
payment activation are excluded.
