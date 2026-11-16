import { normalizeContactLinks } from "./contacts.mjs";

// Mapping only. Downloading, storage and publication belong to their separate layers.
export function toFotihaDraft(result, input, slug, images, categoryName) {
  const m = result.merged;
  const validLocation =
    Number.isFinite(m.location?.lat) &&
    Number.isFinite(m.location?.lng) &&
    Math.abs(m.location.lat) <= 90 &&
    Math.abs(m.location.lng) <= 180;
  const clean = (v, max = 12000) =>
    String(v ?? "")
      .trim()
      .slice(0, max);
  return {
    slug,
    name: clean(m.name, 180),
    categoryIds: [input.categoryId],
    categoryLabel: categoryName,
    description: clean(m.description),
    region: input.region || "",
    district: "",
    address: clean(m.address, 600),
    phones: (m.phones ?? [])
      .filter((p) => /^\+?[\d\s()-]{7,50}$/.test(p))
      .slice(0, 10)
      .map((value) => ({ label: "Telefon", value })),
    links: normalizeContactLinks(m.links)
      .slice(0, 15)
      .map((l) => ({
        label: clean(l.type || l.label || "Veb-sayt", 80),
        url: clean(l.url, 2000),
      })),
    email: m.emails?.find((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) ?? null,
    latitude: validLocation ? m.location.lat : null,
    longitude: validLocation ? m.location.lng : null,
    // Food menus and mixed units cannot establish a hall's wedding package range.
    // The editor exposes observed products/ranges for an explicit human decision.
    price: {
      kind: "negotiable",
      min: null,
      max: null,
      currency: "UZS",
      sourceText: "",
    },
    images,
    importedAt: result.completedAt,
    featured: false,
    featuredOrder: 0,
  };
}
export function importEvidence(result, duplicates = []) {
  const m = result.merged;
  return {
    status: result.status,
    collectedAt: result.completedAt,
    sources: result.sources.map(({ images, ...s }) => s),
    matches: result.matches,
    candidates: result.candidates?.map(({ images, ...s }) => s),
    conflicts: m.conflicts,
    missing: m.missing,
    provenance: m.provenance,
    products: m.products,
    priceRanges: m.priceRanges,
    errors: result.errors,
    mediaErrors: result.media.errors,
    imageSelection: result.media.selection,
    imageProvenance: result.media.images.map(({ file, ...i }) => i),
    duplicates,
  };
}
