# Palace Rose source package (release gated)

Source folder: `Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/palace-rose`.

The manifest's exact page source is the rendered `preview-frame.html`. The application package uses its extracted `.palace-rose-page` DOM in `source/design.html`, removing the Chorlove page shell, runtime and analytics references, baked sample invitation values, remote sample music, unrelated gallery/gift images, and the fixed demo map URL. The source capture folder remains untouched. Its 17 Palace Rose manifest artwork files are copied byte-for-byte to `assets/`.

All four CSS files linked by the capture are packaged under `source/css/` and loaded from this template. Their capture checksums and package checksums are recorded in `source/provenance.json`; URL references are localized to `source/media/`. The two image-library stylesheets are unchanged. In the shared Next font stylesheet, unrelated application-wide font faces were omitted where the full archive has no font file; the template's captured Qellia, Cormorant Garamond, The Nautigal, Great Vibes, Fraunces, Jost, and Marcellus files are present locally. The general Tailwind stylesheet still contains Leaflet's three generic sprite URLs; those sprites are absent from the full archive and are not used by this template's iframe-based venue map.

A full archive audit also found the Palace Rose React implementation and its motion code inside shared compiled chunk `Web invitations/_next/static/chunks/0dg.9_70mpb0j.js` (module 99664). The isolated package does not load that Chorlove application bundle: it carries the captured template DOM, package-local captured CSS, and a narrow `bridge.js` contract/service adapter. The bridge preserves the source opening timing (0.6 s fade after 0.45 s, 0.8 s envelope lift, 0.85 s petal exit), the 12 source-positioned petals (per-petal 19.7–26 s fall and 1.2× spin cycles), the seal pulse, shine, flower sway, scroll parallax ranges, and section-specific reveal thresholds/staggers. Reduced motion removes those effects and leaves every section visible. The isolated page does not ship Chorlove runtime, analytics, or compiled sample invitation defaults. The component references eight gift-box decoration files outside its 17-file manifest asset set. Three are present only in another template's asset folder and are excluded; five do not exist in the full archive. The gift-box ornaments are omitted, while Palace Rose's captured To‘yona card interaction remains connected to the invitation's own card details.

The adapter maps names, personalized greeting, event label, hosts/message, event date and time, locale-aware date card/calendar/countdown, repeatable program, venue/address/map, creator gallery, guest wishes, RSVP and party size, To‘yona card details, contacts, music, locale controls, and reduced motion. Preview fixture content is supplied only by the shared preview path and public creator media is used only when present. The packaged 450×800 opening portrait is captured from the real isolated renderer using the approved preview values; capture provenance is recorded in `source/provenance.json`.

Catalog/database registration is private (`published=false`) and wedding-only. Keep it unpublished until all interactions, four locales, reduced motion, source-motion comparison, creator/public preview parity, and focused release checks pass.

## Provenance

- Capture manifest: `Invitations - this folder will be removed from production/Chorlove/capture-manifest.json`
- Manifest source path: `Web invitations/templates/palace-rose/preview-frame.html`
- Captured page title: `Palace Rose`; capture URL: `https://chorlove.uz/templates/palace-rose/preview-frame`
- Full archive component: `Web invitations/_next/static/chunks/0dg.9_70mpb0j.js`, module 99664; bundle and asset audit hashes/gaps are recorded in `source/provenance.json`.
- Original capture SHA-256: `a0adfef8355a20c0b3a2e4eddb9b5b04ea46525ae993dd6a3ced8ab157fd513f`
- Adapted page structure: `source/design.html`; artifact and asset checksums: `source/provenance.json`.
- Assets: exact `Web invitations/images/palace-rose/*` manifest resources; copied without edits.
- Capture files were not modified.
