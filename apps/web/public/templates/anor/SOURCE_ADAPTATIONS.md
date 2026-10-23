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
`preview.webp` named by `meta.js`; the existing packaged catalog image is kept
as that separately supplied metadata artwork. It depicts the opened hero
scene, while the captured renderer's initial page is the closed pomegranate
opening. The opening was rendered from the capture for comparison; catalog art
continues to follow the metadata asset.
