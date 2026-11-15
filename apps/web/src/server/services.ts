import { cache } from "react";
import { getDb } from "@taklifnoma/database";
import { serviceListings } from "@/modules/services/services-data";
import type { ServiceListing } from "@/modules/services/services-utils";

// Request-scoped only: publication, removal and partner placement are immediately visible.
// A configured database failure must not resurrect archived bundled seed records.
export const getPublishedServices = cache(
  async (): Promise<ServiceListing[]> => {
    if (!process.env.DATABASE_URL) return serviceListings;
    const rows =
      await getDb()`SELECT published FROM service_listings WHERE published IS NOT NULL ORDER BY position`;
    return rows.map((r) => r.published as ServiceListing);
  },
);
