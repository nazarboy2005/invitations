# Atlas application adapter notes

The captured `template.css`, `template.js`, `meta.js`, and textile artwork are
byte-for-byte copies. The hosted `index.html` preserves the captured body
markup and replaces only the external Marxaba site runtime, sample invitation,
and Google Fonts requests with the app's shared renderer, contract bridge, and
locally packaged fonts. The source runtime, motion, and textile assets remain
isolated in this template folder.

`platform-adapter.js` owns the fields that the captured page hard-codes for its
standalone sample: the document title/description, city/date labels, venue
stamp, and marquee copy. It fills them from the typed invitation after initial
render and after contract updates, using text nodes for user-authored values.
This keeps the captured markup and animation script unchanged while removing
the sample invitation details from the rendered invitation. `contract-adapter.css`
only hides the two source gift fields that have no counterpart in the shared
contract.

- The catalog and blank template-selection preview may use the shared
  four-locale fixture, including six localized program entries, clothing
  details, three preview wishes, To‘yona card details, phone/Telegram contacts,
  and six empty gallery photos. This sample never enters saved or public
  invitation data.
- Empty Lahzalar photos render as the shared icon placeholder without visible
  photo labels. Gallery arrows and dots use shared modulo navigation and smooth
  scrolling, with instant movement for reduced-motion preferences.
- The source To‘yona section has `toyona.note` and `toyona.bank` slots, which are
  not fields in the shared contract. A scoped adapter hides those empty slots
  without changing the captured stylesheet.
- The catalog artwork is a 720×1280 capture of the actual reference renderer's
  initial opening page, rendered with the shared catalog fixture, original
  template CSS/JavaScript, fonts, and artwork, plus the isolated platform
  adapter. The former thumbnail showed the hero after the opening interaction
  and did not match this first-page state.
- The capture has no `preview.webp` even though its metadata names that file;
  the opening-page render supplies the missing catalog art. Browser visual and
  interaction checks and live save/reopen behavior remain runtime/service
  release gates.
