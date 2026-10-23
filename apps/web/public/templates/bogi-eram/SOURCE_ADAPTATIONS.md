# Bog‘i Eram platform adaptations

The captured template files and shared Marxaba runtime remain the source of the
rendered design. The platform adds `platform-adapter.css` after the captured
stylesheet to collapse empty note and bank-name hooks; those fields are not
present in the approved invitation contract. The gallery image's fallback `alt`
text is blank so the empty-photo decorative star remains icon-only; the shared
runtime supplies a localized alt description when an uploaded image exists.

The adapter does not add sample content. Catalog and initial template-selection
previews receive the centralized `preview-sample.json` through the typed
renderer; blank or authored invitations receive only their own contract data.

## 2026-10-23 source-fidelity audit

The exact named capture is `Marxaba/Nikoh/templates/bogi-eram`, confirmed by
`Marxaba/capture-manifest.json`. A repository-wide provider/manifest search also
found OnlineTaklifnoma's `jannat-bogi`, whose captured page is a separate
Next.js design titled “Jannat bogʻi: video toʻy taklifnomasi”; it is not an
alternate capture of Bog‘i Eram. The original capture remains untouched.

After normalizing line endings, the packaged template stylesheet and metadata
match the capture. The body preserves the gate, layered doors, greeting, hint,
and page sections; the only body markup adaptation is blanking the fallback
gallery `alt` so the empty-photo ornament stays decorative. The isolated HTML
head replaces remote fonts and Marxaba's sample/site runtime with the local
font sheet and shared invitation runtime. Localized metadata strings were
added to `i18n.js`; `template.js` adds localized document/Open Graph metadata
while retaining the gate knock/open choreography, door animation, petals,
fountain, and dove motion. Captured garden, gate, door, petal, ornament, and gift
art that exists in this design folder is byte-identical in the package. The
package includes `bird-sprite.webp` and `doves.webp`. Though absent from the
local capture archive, both original Marxaba-hosted URLs referenced by the
captured `template.js` remain available. Retrieved the exact relative URLs from
the capture manifest origin on 2026-10-23 at 05:32:08 Asia/Riyadh (02:32:08
UTC):

| Asset | Source URL | MIME / dimensions | SHA-256 |
| --- | --- | --- | --- |
| `art/doves.webp` | `https://www.marxaba.uz/templates/bogi-eram/art/doves.webp` | `image/webp`, 1024×128 RGBA | `75b7f313583a3abe366974b2baceb6d0ebc94e33c3cfcd70708591d64d92bee0` |
| `art/bird-sprite.webp` | `https://www.marxaba.uz/templates/bogi-eram/art/bird-sprite.webp` | `image/webp`, 512×116 RGBA | `27400e5ec38a4aa8cf3f0beb4a7e61a4f55af894022c7c7bcc3f8837faa11691` |

Both downloads are byte-identical to the packaged binaries and have been
restored at those production paths. All provider capture manifests and 4,435
archived image files were checked, including SHA-256 alias matches; neither
binary exists in the local archive. The same-named Muhr capture sprite is
different. The captured `template.js` requests and draws both sheets on canvas,
so these source animations now have verified original binaries and provenance.
The local font sheet bundles the captured Cormorant Garamond, Great Vibes, and
Lora families for the supported scripts.

Catalog-cover finding: the previous 720×1280 (9:16) `preview.webp` showed the
post-opening garden and skipped the distinctive closed carved gate, greeting,
and “tap to open” prompt. The source renderer opens on the gate, layered from
the captured gate/door artwork and HTML overlays. The source metadata names
`preview.webp`, but that file is absent from the local capture. The catalog
cover correction is being handled alongside this audit; it must be a portrait
capture of the real first opening render, with platform-only preview controls
excluded. Do not substitute a hand-built composite or modify the source
capture.
