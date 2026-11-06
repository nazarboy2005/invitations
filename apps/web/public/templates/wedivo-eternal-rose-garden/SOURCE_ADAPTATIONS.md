# Source adaptations

The ignored original capture is untouched. Its path and SHA-256 are in
`source/provenance.json`; that file also audits every packaged artwork/font binary.

`index.html` retains source element identities and layout, including all blooms,
garden scenes, SVG decoration and interactive stages. Extraction removes the
provider parameter/default-data manifest, rundown sample JSON, preview stub,
external font links/import, original metadata and example text/URLs. BeautifulSoup
serializes this HTML; HTML-parser normalization of SVG attribute spelling is
restored by the browser's SVG parser. Platform data is applied before source
runtime startup, so no sample text flashes or public sample-data fallback occurs.

`source/template.css` retains every original rule and animation, with the Google
Fonts import removed and the exact source artwork URLs mapped to local binaries.
The matching Cormorant Garamond, Marcellus SC, Mulish and Pinyon Script font
families are declared locally with their original weights/styles.

`source/template.js` preserves template algorithms. Documented substitutions:

- Local artwork prefix and URLs for the source chroma-key/cutout engine.
- Contract event instant and timezone replace example date/Indonesian zone;
  calendar export uses UTC stamps and the configured zone for displayed dates.
- Runtime strings/section names use the four-locale adapter dictionary.
- Story chapter enumeration follows all authored chapters instead of a fixed four.
- Gallery URLs, alt text and stable IDs come from creator data.
- The data-bound program JSON replaces the source sample rundown.
- No guest-count input; candle visualization uses one person and platform RSVP
  submits party size 1 for yes, 0 otherwise.
- Public map URLs/coordinates replace the provider place ID and map credential.
- Reduced motion accepts the OS preference and preview QA flag before startup.
- Preview sound effects are muted; explicit guest music pause survives payload
  reloads, and optional configured music retains the original opening/control logic.

`adapter.js` keeps service integration outside source code. It validates the
parent window/origin, binds typed payloads with text nodes, reloads the isolated
document for changed data, builds localized controls, hides unsupported optional
source fields, and connects only the existing public RSVP and moderated-wishes
APIs. HTTP failures cannot show success; a newly submitted wish is never appended
to the approved public wall. Preview submissions do not call those APIs.

The original gift form is amount-based and has no card-number field. Its provider
transfer confirmation and physical mailing workflow are unsupported, so it is
hidden. No generic to‘yona or receipt block is introduced. The video, live-stream,
second ceremony, check-in and person-biography fields likewise have no matching
approved contract/service and remain hidden. Original rose meanings remain as
localized botanical presentation, with invitation-specific anecdotes removed.

The package is private and unregistered. Exact browser comparison, catalog opening
capture and creator/public lifecycle checks remain pending; see the renderer README.

Confirmed localization update (2026-10-26): use **So‘lmas atirgullar** as the
proposed catalog name and Uzbek Latin as the default. All visible default copy,
including dynamically generated graft states, clipboard/download feedback,
calendar details/reminders, music accessibility labels and form
placeholders, is translated in the isolated adapter. Other approved locales
remain available for explicitly enabled variants. Authored personal fields are
never replaced by translated provider example content. The original source
language is retained only in internal lookup keys and the untouched capture.
The source has no language switcher; the host's existing locale/route selection
chooses the renderer language instead of adding a new control to the design.
