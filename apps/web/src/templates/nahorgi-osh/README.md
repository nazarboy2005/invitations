# Nahorgi Osh source package

This is the isolated production copy of the captured Marxaba Nahorgi Osh
invitation at `Osh va iftorlik/templates/nahorgi-osh`. Its body markup, template
CSS, animation script, localization dictionary, metadata, and dawn artwork are
kept from the capture. The application wrapper at `apps/web/src/templates/nahorgi-osh`
passes typed invitation data into the shared Marxaba iframe renderer.

The captured HTML head is adapted only to load locally packaged Lora and
Manrope fonts and the shared application runtime. The original shared Marxaba
sample invitation and `sample-overrides.js` are deliberately excluded. GSAP,
ScrollTrigger, and LZ-String load from the shared local nikoh runtime. The
captured CSS, JavaScript, i18n dictionary, metadata, page body, and art are
otherwise byte-identical to the reference capture.

The source metadata declares `osh`, `sunnat`, and `nikoh` compatibility. These
map to the platform's `osh`, `sunnat-toyi`, and `wedding` event IDs, independent
of the template's Osh catalog category. In the blank catalog preview, the
adapter presents the central sample as a Nahorgi Osh invitation; creator data
remains unchanged. The source-only `extras.celebrant` title is derived from the
first available person name by the shared Marxaba bridge. The source has a
`venue.photo` slot, which is not part of the approved invitation contract and
is not filled with sample media. It remains a gap until the contract/editor
supports venue photos; the creator's venue text and map data continue to work.

The capture's `meta.js` names `preview.webp`, but that image was not present in
the captured folder. The package now includes an authentic portrait catalog
preview rendered from the integrated opening and the centralized
`apps/web/src/modules/catalog/preview-sample.json` fixture. It shows the full
opening page at 720×1280, centered at its source 480×1244 dimensions with the
surrounding page background. The platform locale control and subsequent page
content are excluded from the catalog artwork. `preview.provenance.json` records
the source, fixture, and output SHA-256 hashes and the render/crop parameters.

The typed registry and additive migration register this template under the
`osh` catalog category with `osh`, `sunnat-toyi`, and `wedding` event support;
these compatibility values are separate from category membership. The
database row remains unpublished. `tests/nahorgi-osh-template.test.ts` checks
source fidelity, local assets/fonts, fixture and adapter mapping in all four
locales, morning schedule values, unpublished registration, and the documented
source-only venue photo field. Browser release verification remains pending.
