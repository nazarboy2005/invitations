import type { MetadataRoute } from "next";
import { getPublishedCatalogLastModified } from "@/server/catalog";
import {
  serviceCategories,
  serviceListings,
} from "@/modules/services/services-data";

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

  const servicesPages: MetadataRoute.Sitemap = [
    { url: `${CANONICAL_ORIGIN}/services` },
    ...serviceCategories
      .filter((category) => category.id !== "invitation")
      .map((category) => ({
        url: `${CANONICAL_ORIGIN}/services/${category.id}`,
      })),
    ...serviceListings.map((listing) => ({
      url: `${CANONICAL_ORIGIN}/services/b/${listing.slug}`,
      lastModified: listing.importedAt,
    })),
  ];
  return [...catalogPages, ...servicesPages];
}
