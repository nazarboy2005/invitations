// Curated, settled scenes from the real renderers. Historical/source artwork
// stays untouched. See docs/catalog-covers.md for capture and replacement steps.
export const CATALOG_COVERS: Readonly<Record<string, string>> =
  Object.fromEntries(
    [
      "atlas",
      "bogi-eram",
      "doira",
      "ganch",
      "monogram",
      "muhr",
      "nahor",
      "orik-guli",
      "parda",
      "qatlam",
      "yangi-uy",
    ].map((id) => [id, `/images/catalog/${id}-cover.webp`]),
  );
