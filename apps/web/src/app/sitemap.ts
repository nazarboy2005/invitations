import type { MetadataRoute } from "next";
import { getPublishedCatalogLastModified } from "@/server/catalog";

const CANONICAL_ORIGIN = "https://fotiha.uz";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = await getPublishedCatalogLastModified();
  const catalogPages: MetadataRoute.Sitemap = [
    { url: `${CANONICAL_ORIGIN}/` },
    { url: `${CANONICAL_ORIGIN}/templates` },
  ];

  // Both pages display the published template catalog. Omit lastmod when the
  // database is unavailable instead of inventing a date.
  if (lastModified) {
    for (const page of catalogPages) page.lastModified = lastModified;
  }

  return catalogPages;
}
