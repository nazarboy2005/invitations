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
