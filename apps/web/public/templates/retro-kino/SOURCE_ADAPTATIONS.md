# Retro Kino source adaptations

- `index.html` loads `uz-cyrl-copy.js` after the captured template and shared
  runtime scripts.
- `uz-cyrl-copy.js` corrects only two Uzbek Cyrillic copy cases after the
  shared transliterator runs: `Premyera` becomes `Премьера`, and the English
  loan phrase `Marquee chiroqlari` becomes the localized `Кино чироқлари`.
  The correction covers rendered text, accessible text attributes, and page
  metadata, including the `data-print` value used by the captured heading's
  decorative duplicate. Uzbek Latin, Russian, English, source styling, and
  source motion are unchanged.
- `template.js` guards the captured countdown animation's mutation-observer
  target lookup. Character-data mutation records point to text nodes, so the
  adapter resolves their parent element before calling `closest()`. This
  preserves the digit-flip effect while avoiding a browser TypeError when the
  countdown updates.
- `index.html` additionally loads `contract-adapter.css`. That isolated
  platform stylesheet hides the empty venue-photo fallback and empty
  unsupported To‘yona note/bank slots (and an empty card-holder slot), so absent
  optional contract data does not leave source-shaped blank blocks. The source
  section structure and design remain intact. Venue photos and gift notes are
  not part of the approved shared contract; bank-name entry is intentionally
  absent from the editor.
- `preview.webp` is a byte-for-byte copy of the template's own `art/poster.webp`
  at its original 941×1672 portrait dimensions. `preview.provenance.json`
  records its SHA-256 checksum and source path.

The captured `index.html` body, `template.css` styling, `template.js` motion,
`meta.js` metadata, and artwork remain preserved as tested against the
untouched reference. The captured stylesheet only has its external Google
Fonts import removed in favor of bundled local font files; the platform's
empty-slot behavior is isolated in `contract-adapter.css`.
