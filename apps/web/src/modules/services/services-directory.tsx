import { getCatalog } from "@/server/catalog";
import { serviceCategories, type ServiceFilters } from "./services-data";
import { ServicesDirectoryClient } from "./services-directory-client";
import { getPublishedServices } from "@/server/services";
export async function ServicesDirectory({
  filters,
}: {
  filters: ServiceFilters;
}) {
  const [catalog, serviceListings] = await Promise.all([
    getCatalog(),
    getPublishedServices(),
  ]);
  return (
    <ServicesDirectoryClient
      filters={filters}
      serviceListings={serviceListings}
      serviceCategories={serviceCategories}
      templateCount={catalog.templates.length}
    />
  );
}
