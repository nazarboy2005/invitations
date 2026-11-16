import { cache } from "react";
import { getDb } from "@taklifnoma/database";
import { serviceListings } from "@/modules/services/services-data";
import type { ServiceListing } from "@/modules/services/services-utils";
import { createServiceDirectoryCache } from "./service-directory-cache";

const directory = globalThis as typeof globalThis & {
  fotihaServiceDirectoryCache?: ReturnType<typeof createServiceDirectoryCache>;
};
const readDirectoryCache = (directory.fotihaServiceDirectoryCache ??=
  createServiceDirectoryCache());

// Re-read the durable revision on every request. Never serve stale data on DB failure.
// A configured database failure must not resurrect archived bundled seed records.
export const getPublishedServices = cache(
  async (): Promise<ServiceListing[]> => {
    if (!process.env.DATABASE_URL) return serviceListings;
    const db = getDb();
    let revision;
    try {
      [revision] =
        await db`SELECT revision::text FROM service_directory_cache_state WHERE singleton`;
    } catch (error) {
      // Rolling upgrades remain correct before the additive migration is applied.
      if ((error as { code?: string }).code !== "42P01") throw error;
    }
    if (!revision) {
      const rows =
        await db`SELECT published FROM service_listings WHERE published IS NOT NULL ORDER BY position`;
      return rows.map((r) => r.published as ServiceListing);
    }
    return readDirectoryCache(
      process.env.DATABASE_URL,
      revision.revision,
      async () => {
        // One statement gives revision and content the SAME database snapshot.
        const [row] = await db`SELECT revision::text,
        COALESCE((SELECT jsonb_agg(published ORDER BY position) FROM service_listings
          WHERE published IS NOT NULL), '[]'::jsonb) AS listings
        FROM service_directory_cache_state WHERE singleton`;
        if (!row) throw new Error("Services cache revision unavailable");
        return {
          revision: row.revision as string,
          listings: row.listings as ServiceListing[],
        };
      },
    );
  },
);

/** A fresh authority check for photos; never use a cached directory as permission. */
export async function getPublishedService(
  slug: string,
): Promise<ServiceListing | undefined> {
  if (!process.env.DATABASE_URL)
    return serviceListings.find((item) => item.slug === slug);
  const [row] =
    await getDb()`SELECT published FROM service_listings WHERE slug=${slug} AND published IS NOT NULL`;
  return row?.published as ServiceListing | undefined;
}
