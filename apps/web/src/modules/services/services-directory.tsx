import { getCatalog } from "@/server/catalog";
import {
  serviceListings,
  serviceCategories,
  type ServiceFilters,
} from "./services-data";
import { ServicesDirectoryClient } from "./services-directory-client";
export async function ServicesDirectory({
  filters,
}: {
  filters: ServiceFilters;
}) {
  const catalog = await getCatalog();
  return (
    <ServicesDirectoryClient
      filters={filters}
      serviceListings={serviceListings}
      serviceCategories={serviceCategories}
      templateCount={catalog.templates.length}
    />
  );
}
