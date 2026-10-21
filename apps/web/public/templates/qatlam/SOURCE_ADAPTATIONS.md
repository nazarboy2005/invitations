# Qatlam package notes

The package preserves the captured page body, `template.css`, `template.js`, `i18n.js`, `meta.js`, and all files under `art/`. The source metadata names `preview.webp`, which was rendered from the packaged opening at 720×1280 using the centralized catalog fixture; `preview.provenance.json` records its route, fixture, locale, dimensions, and hash. The app shell is adapted to load local shared Marxaba runtime files and local Lora/Great Vibes fonts; its captured body remains unchanged. The captured sample-invitation loader and external Google Fonts import are omitted; the typed adapter provides catalog, editor, or invitation data.

The source includes `venue.photo`, `toyona.bank`, and `toyona.note` slots. Venue photos and gift notes are not part of the approved invitation contract, and the bank-name field was removed by user requirement, so platform integration must not supply these values. Keep source markup/styles intact for fidelity while treating all three fields as unsupported data. The supported gift card number and cardholder remain available through the shared contract.

Source metadata declares `Nikoh to‘yi`, `Qiz bazmi`, and `Fotiha`. These represent wedding, qiz-bazmi, and fotiha compatibility respectively; catalog categories remain independently assigned.
