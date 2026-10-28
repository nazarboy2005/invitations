# Anor source adaptations

The captured template stylesheet, animation script, seeds engine, i18n file,
metadata, and artwork are copied byte-for-byte into `source/`. The app-hosted
`source/index.html` keeps the captured page structure and adds local asset links
plus the `data-slot="programHeading"` contract hook. `source/bridge.js` owns
contract binding, localization, service calls, and UI adapters; it does not
change the captured renderer. `source/base.css`, `source/bridge.css`, local
fonts, and the local GSAP vendor files supply the app runtime and controls.

The full captured dress-code section was restored to the hosted page. The
adapter renders its localized palette from `Invitation.dressCode.colors`,
maps each validated hex color to its swatch style, and hides the section only
when the creator has not enabled or filled it. The captured dress-code styles
remain unchanged.

`bridge.css` only hides the captured gift bank-name and note slots, which have
no corresponding shared contract fields. Card number and card holder remain
supported. Catalog wishes come from the shared localized preview-wishes helper
and are never saved with creator data.

The capture manifest identifies the source as
`Marxaba/Nikoh/templates/anor`. Its local capture does not contain the
`preview.webp` named by `meta.js`; Yoryor's matching Anor image is a standalone
asset, not a full template source. The existing packaged catalog image depicts
the opened hero scene, while the captured renderer's initial page is the closed
pomegranate opening with greeting and “Anorni ochish” action. A clean portrait
capture of that opening remains pending: the available browser UI can display
the real renderer but does not provide a permitted way to save an isolated
iframe screenshot into the workspace. No substitute artwork was made, and the
existing preview and all original captures remain unchanged.

Catalog-art verification (2026-10-23): the captured `meta.js` declares `preview.webp`, and its SHA-256 matches the canonical Marxaba `meta.js` at `https://www.marxaba.uz/templates/anor/meta.js` (`3844ba95…80bfe8`). The source's official `https://www.marxaba.uz/templates/anor/preview.webp` is 720×1280, 133,366 bytes, SHA-256 `2a17a48b…5bdfc`; the packaged `preview.webp` is byte-identical. This official source catalog cover depicts the post-opening hero; that is source-authentic catalog art. The earlier finding that treated the closed `#intro` as the only acceptable cover is superseded. No replacement capture is needed. See `preview.provenance.json`.
# Shared Google Maps correction (2026-10-28)

The platform bridge now prioritizes `venue.mapUrl` on every navigation control.
Its capture-phase map-toggle adapter loads Google coordinates in the original
map panel. Captured `template.js` remains byte-for-byte unchanged; its provider
map handler is intercepted by the bridge. The shared Nikoh runtime likewise uses
Google embeds and the authored navigation URL instead of Yandex static maps.
