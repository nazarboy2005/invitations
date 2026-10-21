# Invitation templates

Anor is the first Marxaba reference renderer. The next ten Marxaba nikoh
references are also authorized for production integration and are tracked in
`docs/templates/TEMPLATE_ROADMAP.md`. Anor and the ten-template batch remain
unpublished and unselectable until their own documented completeness,
integration, rights, and quality gates pass. Do not treat documented service
limitations as completed integrations.

Keep every future template in its own renderer, styles, assets, and motion
implementation. When a reference source exists, integrate that exact complete
HTML/CSS/JavaScript/assets implementation; do not recreate it from screenshots.
Keep platform data and API adapters separate from the template source. Register
only complete designs in the shared catalog. A renderer consumes the shared
invitation contract and must not insert demo names, dates, venues, program
entries, or default media. Switching templates preserves creator-entered
content and uploaded assets. Catalog previews and a blank invitation's template
selection step may use an ephemeral, realistic sample fixture so visitors can
judge the complete design. The fixture must never enter saved/exported drafts or
public invitations, and authored invitation content always replaces it.
The canonical fixture is `apps/web/src/modules/catalog/preview-sample.json`;
keep sample copy and repeatable program entries there for the four supported
locales rather than defining template-specific examples.

The local reference captures are stored outside the application in
`Invitations - this folder will be removed from production`. Keep that folder
untouched while working on the application. Build and review one exact reference
at a time, including its visible animation behavior and reduced-motion support.
Give each selectable template a dedicated full-page preview at its real public
size, available from both the catalog and editor. During creation, show the same
real renderer and opening behavior at the available viewport size without a
decorative phone frame that clips template controls or content.

Anor's captured `index.html`, `template.css`, `template.js`, and `seeds.js` are
packaged under `apps/web/public/templates/anor/source` and run in an isolated
same-origin frame. The original template renderer and animation engine are
reused directly; `bridge.js` maps the typed invitation contract and connects
the original controls to this application's APIs. Marxaba's sample invitation
and general site runtime are excluded. Keep the source capture untouched.
For catalog art, honor the template's `meta.js` preview asset instead of
substituting an arbitrary crop of its opening-stage artwork. Anor's metadata
points to `preview.webp`; that exact asset is packaged separately under
`apps/web/public/templates/anor/preview.webp` because it was absent from the
local capture. Show the first-page image at its full portrait ratio in the
public catalog and creator template picker. Confirm upstream asset rights
before commercial release.
The reference requests Cormorant Garamond (400/500/600 normal and 400/500
italic) and Great Vibes. Serve those exact Google Fonts files locally with
matching `@font-face` declarations so rendering does not depend on a third-party
font request or silently fall back to system fonts.

The next ten Marxaba nikoh designs are packaged directly under
`apps/web/public/templates/<template-id>` and use the same-origin
`MarxabaInvitation` iframe adapter. Their original per-template HTML, CSS,
JavaScript, motion scripts, artwork, and font faces stay together. Shared
nikoh runtime dependencies live in `apps/web/public/templates/shared/nikoh`.
The application adapter injects only contract data and public API identifiers.
See `docs/templates/TEMPLATE_ROADMAP.md` for the full 46-template inventory,
batch progress, and known gaps. Keep every copied source capture untouched.

For silent visual QA of a full Marxaba preview, add `qaSilent=1` to the preview
URL. This mutes background music and voice playback inside the preview frame
while preserving the real opening interaction and animations. The flag is
preview-only and is never sent to public invitation rendering.

For ephemeral responsive-name stress checks on an empty preview, add
`qaLongNames=1` to the preview URL. It replaces only the centralized fixture
names, never authored creator content or saved invitations.
