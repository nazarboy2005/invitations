# Swan Garden

Source-complete Chorlove integration using the untouched local capture in `source/preview-frame.html`. `source/template-module.js` preserves the captured module as implementation evidence; it is not executed with the provider application. The shared captured CSS and local fonts are under `../chorlove/shared/_next`.

`index.html` retains the captured template DOM, artwork, typography and layout. The package contains 17 distinct asset files; 5 missing originals were recovered from their exact source asset URLs. Byte hashes and archive paths are pinned in `source-provenance.json`. The original `Templates/Chorlove` directory was not edited.

`motion.js` separates source motion from platform bindings. `../chorlove/shared/three-bridge.js` receives typed invitation data, localizes controls, and binds maps, calendar, gallery, creator music, contacts, RSVP and moderated wishes. Source sample content, the source soundtrack, branding, analytics and provider runtime are excluded from the runnable page. All design assets and fonts are served locally.

Catalog/empty-selection previews receive only the shared fixture and its template-owned preview media. Real invitations receive creator content; galleries and the Stained Glass scratch-photo section hide without uploaded photos. Existing optional content and template-specific data are retained when switching among these designs. Story, extra people and private receipt upload use the existing platform adapter.

Source motion and deliberate adaptations:

- The exact envelope video reveals the hero at playback time 5.2 seconds, with a 6.5-second recovery fallback and 0.9-second opacity/scale exit. Hero copy uses the captured per-design delays and 1.1-second fade/translation/blur motion. Background and hero loops remain the original local videos.
- Reveals use the original 30% visibility threshold, 28px translation and 6px blur. The original Embla core and Autoplay implementation are extracted into `three-carousel.js` without the provider module loader or React hook; looping, drag physics, centered alignment and 3500ms autoplay remain source behavior.
- The local gallery dialog retains zoom, swipe, thumbnails and keyboard navigation with a focus trap. The provider-independent lightbox adapter is reused from the existing Chorlove implementation. Source samples are replaced with uploaded images.
- Four language controls are Fotiha controls. Locale changes update in place, preserving opening state, scroll, form input and explicit music pause. Music attempts playback publicly and respects browser gesture restrictions; previews remain gesture-gated.
- Reduced motion skips video playback on opening, shows poster/final artwork immediately and suppresses motion. Optional Yandex maps use the saved venue and the platform's map service; a manually pasted saved link stays directly usable when coordinates are absent. Calendar downloads are generated locally.

Typed catalog/capabilities, wedding category and wedding event support are registered by additive migration `0222_register_chorlove_three.sql`; `0223_publish_chorlove_three.sql` publishes only these three additions. Other template rows are preserved. See [verification](../../../../../docs/templates/chorlove-three-verification/README.md).
