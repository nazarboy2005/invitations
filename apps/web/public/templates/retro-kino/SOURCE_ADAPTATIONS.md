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

The captured `index.html` body, `template.css` styling, `template.js` motion,
`meta.js` metadata, and artwork remain preserved as tested against the
untouched reference. The only stylesheet change is the existing removal of the
external Google Fonts import in favor of bundled local font files.
