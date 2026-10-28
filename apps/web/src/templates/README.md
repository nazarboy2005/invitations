# Invitation templates

This directory contains 34 template renderer folders at different stages of
integration and review. Static assets and captured source packages are also
stored under `apps/web/public/templates`; their presence does not make a design
available in the catalog. Without `DATABASE_URL`, the local typed fallback
catalog currently exposes 38 published templates. A configured database can
have a different catalog state. Check the typed catalog and applied migrations
for current publication status, and see `docs/templates/TEMPLATE_ROADMAP.md`
for template-by-template integration and release notes. External deployment
and cloud-service verification remain separate from local renderer checks.

Keep every future template in its own renderer, styles, assets, and motion
implementation. When a reference source exists, integrate that exact complete
HTML/CSS/JavaScript/assets implementation; do not recreate it from screenshots.
Map controls must use the shared invitation venue's Google Maps link or coordinates.
Verify a Google Places selection and a manually pasted map URL in preview and
public rendering; never copy a source template's sample map API key or location.
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
The fixture also owns the Google Maps mock URL and coordinates. Apply event
profiles consistently across designs; template overrides may contain visual
media only. Do not add guest-count inputs; attendance uses the existing
one-person API value when a source attendance control is present.

The local reference captures are stored outside the application in
`Invitations - this folder will be removed from production`. Keep that folder
untouched while working on the application. Build and review one exact reference
at a time, including its visible animation behavior and reduced-motion support.
Give each selectable template a dedicated full-page preview at its real public
size, available from both the catalog and editor. During creation, show the same
real renderer and opening behavior at the available viewport size without a
decorative phone frame that clips template controls or content.

Anor's captured `template.css`, `template.js`, `seeds.js`, `i18n.js`, and
`meta.js` are copied byte-for-byte under `apps/web/public/templates/anor/source`
and run in an isolated same-origin frame. The app-hosted `index.html` keeps
the captured page structure and adds local runtime links plus a program-heading
binding hook. The original renderer, styles, and animation engine are reused
directly; `bridge.js` maps the typed invitation contract and connects the
original controls to this application's APIs. The captured dress-code section
and palette are retained and bound from the shared contract. Marxaba's sample
invitation and general site runtime are excluded. Keep the source capture
untouched.
For catalog art, honor the template's `meta.js` preview asset instead of
substituting an arbitrary crop of its opening-stage artwork. Anor's metadata
points to `preview.webp`; that exact asset is packaged separately under
`apps/web/public/templates/anor/preview.webp` because it was absent from the
local capture. Show the first-page image at its full portrait ratio in the
public catalog and creator template picker. The reference requests Cormorant Garamond (400/500/600 normal and 400/500
italic) and Great Vibes. Serve those exact Google Fonts files locally with
matching `@font-face` declarations so rendering does not depend on a third-party
font request or silently fall back to system fonts.

Keep each template's complete captured Lahzalar/gallery section as authored,
including its layout, empty-state decoration (when present), and interactions.
The shared preview fixture supplies six empty gallery slots. In catalog and
initial template-selection previews, a template may map authentic image assets
from its own captured source into those preview-only slots wherever such images
are available. Do not use unrelated site or cross-template sample photos. Keep
these preview images ephemeral: never write them to creator drafts or published
invitation data, and replace them with creator-authored uploads as soon as
those exist. Public invitations hide creator-photo galleries and optional
creator-photo slots while there are no uploaded images. Template-owned opening
artwork, backgrounds, and decorative images remain visible whether or not the
creator has uploaded gallery photos. Anor and Atlas implement this source-art
mapping in their renderer adapters; the shared fixture remains empty.

Atlas keeps byte-identical copies of its captured `template.css`,
`template.js`, `meta.js`, and textile artwork under
`apps/web/public/templates/atlas`. Its app-hosted `index.html` retains the
captured body and swaps the site runtime and sample invitation for the shared
typed bridge. `platform-adapter.js` maps only the standalone sample labels that
the original page hard-codes. Its catalog artwork is a 720×1280 screenshot of
the captured renderer's initial opening page; the captured metadata points to
a `preview.webp` that is absent from the local capture.

The next ten Marxaba nikoh designs are packaged directly under
`apps/web/public/templates/<template-id>` and use the same-origin
`MarxabaInvitation` iframe adapter. Their original per-template HTML, CSS,
JavaScript, motion scripts, artwork, and font faces stay together. Shared
nikoh runtime dependencies live in `apps/web/public/templates/shared/nikoh`.
The application adapter injects only contract data and public API identifiers.
See `docs/templates/TEMPLATE_ROADMAP.md` for the full 46-template inventory,
batch progress, and known gaps. Keep every copied source capture untouched.

For silent visual QA of a full Marxaba preview, add `qaSilent=1` to the preview
URL. This mutes background music inside the preview frame
while preserving the real opening interaction and animations. The flag is
preview-only and is never sent to public invitation rendering.

For ephemeral responsive-name stress checks on an empty preview, add
`qaLongNames=1` to the preview URL. It replaces only the centralized fixture
names, never authored creator content or saved invitations.

To verify reduced-motion behavior in the Marxaba preview without changing the
browser or operating-system preference, add `qaReducedMotion=1`. The preview
passes this flag into the source runtime before its template scripts initialize
and applies the same motion suppression used by the captured templates' reduced
motion styles. The flag is only propagated from the preview route, never to a
public invitation.

Invitate templates have a dedicated renderer module under
`apps/web/src/templates/invitate` and isolated public source packages under
`apps/web/public/templates/<id>`. Their adapters use the shared invitation
contract and renderer in creator preview and public display. See
`docs/templates/INVITATE_ROADMAP.md` for the separate Invitate sequence.

The E-invitation design Velvet Royale uses exact catalog ID
`royal-burgundy-edition` and its own adapter at
`apps/web/src/templates/velvet-royale`; it is separate from Invitate and
Chorlove. See its source adaptations note and the template roadmap for source
transformations, supported fields, and release gates.
