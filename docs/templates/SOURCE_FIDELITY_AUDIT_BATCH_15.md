# Published-template source-fidelity audit — batch 15

Date: 2026-10-23

## Database order and catalog

Read-only `getCatalog()` query against the configured PostgreSQL database returned 51 published templates. The requested IDs are consecutive after the previous batch's `sahifa`: Sahro Fonusi, Samarqand Kechasi, and Shahzoda. Each costs 15,000,000 minor units (150,000 UZS). Category and event compatibility were queried independently:

| ID | Name | Category | Supported event types |
| --- | --- | --- | --- |
| `sahro-fonusi` | Sahro Fonusi | wedding | fotiha, wedding |
| `samarqand-kechasi` | Samarqand Kechasi | wedding | wedding |
| `shahzoda` | Shahzoda | other | sunnat-toyi |

The next three IDs after Shahzoda are `shirin-bayram`, `somon-yoli`, and `suzani`, each published at 150,000 UZS. Shirin Bayram is birthday category / birthday event; Somon Yo‘li is wedding / wedding; Suzani is wedding / fotiha and wedding.

## Provider search and source/package comparison

Searched all 13 provider `capture-manifest.json` files and the local capture tree for the three IDs and their exact template folder names. Marxaba is the only provider manifest that declares these complete template captures: `Marxaba/Nikoh/templates/sahro-fonusi`, `Marxaba/Nikoh/templates/samarqand-kechasi`, and `Marxaba/Sunnat to'yi/templates/shahzoda`. Name occurrences in other archived files are shared copy or unrelated assets, not complete alternate template sources. Captures were not modified.

- **Sahro Fonusi:** Focused checks confirm captured body, CSS, localization, metadata, panorama art, source opening interactions, and source CSS/JS reduced-motion paths; creator fixture mapping and blank-invitation isolation pass. Fonts are locally bundled; the source's Three.js path is the documented package rewrite. The 540×960 catalog image is only a crop of `art/desert-panorama.webp`: it omits the captured opening composition with greeting, names/date, lantern treatment, frame, and open button. This is a confirmed catalog cover mismatch.
- **Samarqand Kechasi:** Source body and motion assets were compared with the package. Changes are the documented local font/shared runtime/bridge wiring, empty unsupported gift hooks, and icon-only empty gallery alt; package also has an extra `art/door-leaf.webp`, used as the footer background but absent from the captured Samarqand folder and all exact-name source matches (the same-named Wedvitation asset is different by SHA-256). The current portrait cover shows the later hero and a details CTA, not the captured locked `#intro`; it displays 18:00 although the shared fixture's `startsAt` is 2026-11-14 18:30. The cover/opening mismatch is confirmed; the extra footer asset's canonical origin remains unresolved.
- **Shahzoda:** Focused checks confirm captured body bindings, CSS, JavaScript, metadata, all source art, local fonts, four-locale copy, single-honoree mapping, and reduced-motion handling. Its 720×1280 cover depicts the source curtain/plaque opening and canonical fixture content, but includes the top-right `.mh-lang` language selector injected by the shared runtime; the captured source has no such element. This is a confirmed app-chrome artifact in the catalog image.

Across these designs the shared preview fixture is mapped ephemerally for catalog/selection only; blank invitations do not inherit people, repeatable content, wishes, or gift/contact values. Creator gallery URLs bind through the shared photo bridge; empty gallery cards stay decorative and the public runtime hides photo sections with no usable creator URLs. To‘yona card number/holder remain mapped where supported; unsupported bank/note slots are hidden. Reduced-motion behavior exists in captured/template or shared runtime code and was checked statically.

## Focused verification and follow-ups

Command:

```text
pnpm exec tsx --test tests/sahro-fonusi-template.test.ts tests/samarqand-preview-contract.test.ts tests/samarqand-localization.test.ts tests/shahzoda-template.test.ts tests/marxaba-gallery-preview.test.ts
```

Result: 20 passed, 0 failed. Package covers were visually reviewed. A fresh headless Playwright run against the existing local `/preview?template=…&qaSilent=1` route then tested opening each of the three templates in normal mode and with `prefers-reduced-motion: reduce` emulated (6/6). All route responses were HTTP 200, each opening control reached the opened state, the browser confirmed reduced-motion media preference in the three reduced runs, and no page errors or failed HTTP responses were recorded. One initial automation attempt raced iframe navigation and had a too-narrow state predicate; after synchronizing on the loaded iframe and accepting the templates' different opened-state classes, all six checks passed. No template or asset, database, publication, deployment, or payment state changed by this audit. Separate local repair chats were created for the Sahro Fonusi opening cover, Samarqand Kechasi opening cover/source-asset provenance, and Shahzoda language-control-free catalog image.
