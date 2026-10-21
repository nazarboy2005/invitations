# Parda source adaptations

- `index.html` keeps the captured body unchanged except for one app-owned dress-code section, marked `data-platform-added`. The captured Parda reference has no clothing section, while the approved product requirement requires every invitation to support the optional dress-code content. The added section uses the shared `dressCode` contract hooks and is placed between the venue and gallery.
- `template.css` appends Parda-colored styling for that section; all captured styles remain intact.
- `app-i18n.js` adds Uzbek, Russian, and English labels for the new section. Its editable style, guidance, palette, and note come from localized invitation data.
- The shared renderer maps the supported gift card number and cardholder into the captured To‘yona card. The captured venue-photo slot has no matching approved invitation field, and gift bank name/note are absent from the shared contract (bank name was explicitly removed from the editor), so those hooks remain empty.
