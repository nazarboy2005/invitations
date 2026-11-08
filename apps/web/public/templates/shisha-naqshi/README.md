# Stained Glass

Source-complete Chorlove integration using the untouched local capture in `source/preview-frame.html`. `source/template-module.js` preserves the captured module as implementation evidence; it is not executed with the provider application. The shared captured CSS and local fonts are under `../chorlove/shared/_next`.

`index.html` retains the captured template DOM, artwork, typography and layout. The package contains 74 distinct asset files; 18 missing originals were recovered from their exact source asset URLs. Byte hashes and archive paths are pinned in `source-provenance.json`. The original `Templates/Chorlove` directory was not edited.

`motion.js` separates source motion from platform bindings. `../chorlove/shared/three-bridge.js` receives typed invitation data, localizes controls, and binds maps, calendar, gallery, creator music, contacts, RSVP and moderated wishes. Source sample content, the source soundtrack, branding, analytics and provider runtime are excluded from the runnable page. All design assets and fonts are served locally.

Catalog/empty-selection previews receive only the shared fixture and its template-owned preview media. Real invitations receive creator content; galleries and the Stained Glass scratch-photo section hide without uploaded photos. Existing optional content and template-specific data are retained when switching among these designs. Story, extra people and private receipt upload use the existing platform adapter.

Source motion and deliberate adaptations:

- The original 7.041667-second door video is gesture-gated; the final artwork crossfades over 0.6 seconds after video completion, with the original 9-second recovery fallback. Hero lines enter over 1.1 seconds with 0.2-second staggered delays.
- Original glass shimmer, sunlight, hanging leaves/pendants, falling leaves, sand and candle-glow CSS keyframes remain intact. Gazebo vines reveal over 2.4 seconds after a 0.3-second delay. Scroll reveals use the captured 25% threshold.
- The scratch canvas uses the original gradient, 0.55 texture opacity, 52px brush and 39% cleared threshold. Enter/Space also reveals the creator photo.
- Longer programs repeat the original three-row artwork composition, preserving each row's source placement and icon rather than extending text below its artwork.
- The local gallery dialog retains zoom, swipe, thumbnails and keyboard navigation with a focus trap. The provider-independent lightbox adapter is reused from the existing Chorlove implementation. Source samples are replaced with uploaded images.
- Four language controls are Fotiha controls. Locale changes update in place, preserving opening state, scroll, form input and explicit music pause. Music attempts playback publicly and respects browser gesture restrictions; previews remain gesture-gated.
- Reduced motion skips video playback on opening, shows poster/final artwork immediately and suppresses motion. Optional Yandex maps use the saved venue and the platform's map service; a manually pasted saved link stays directly usable when coordinates are absent. Calendar downloads are generated locally.

Typed catalog/capabilities, wedding category and wedding event support are registered by additive migration `0222_register_chorlove_three.sql`; `0223_publish_chorlove_three.sql` publishes only these three additions. Other template rows are preserved. See [verification](../../../../../docs/templates/chorlove-three-verification/README.md).
