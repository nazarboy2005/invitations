# Cloud Castle source adaptations

The source archive provides `preview-frame.html`, a Next.js server-rendered
preview snapshot rather than a standalone template package. The app package
keeps the captured page subtree, its utility styling, local font files, and
Cloud Castle artwork. It excludes the Next.js runtime, page scripts, external
music, fixed Chorlove contact details, and snapshot guest names, date, venue,
gallery photos, and wishes. The source capture remains unchanged.

`bridge.js` maps the shared invitation through `makeLegacyData` and rebinds the
captured nodes for the couple, event, date, program, venue, gallery, story,
contacts, gift, RSVP, guest wishes, and language. The creator preview and public
route use the same renderer. RSVP and wish submissions use the existing public
API routes; preview submissions are disabled. Music uses the shared Emotional
Piano only in catalog/selection preview and otherwise uses the creator's
selected track after opening the invitation. OS and preview reduced-motion
settings suppress the adapted entrance reveal.

The snapshot contains its final DOM and inline reveal starting styles but not
the source component or original event handlers. The adapter preserves the
captured layout and visual assets while reconnecting the supported controls.
Unrepresented source controls remain a release-gate review item until browser
inspection confirms the complete interaction inventory.

## Catalog artwork

`preview-opening.png` is a clean 720×1280 (9:16) capture of the packaged snapshot renderer's post-envelope opening hero. It uses the canonical catalog preview fixture names and the captured Cloud Castle page markup, styles, fonts, and artwork. The language selector, music control, and browser scrollbar are absent. The former `preview-browser-capture.jpg` was a narrow application screenshot and is retained only as superseded provenance; it is no longer used by the catalog. The source archive contains a server-rendered snapshot, so this image verifies the opening composition and its crop only. The archive does not provide the original component/runtime handlers, and this artwork does not establish interaction or animation parity.
