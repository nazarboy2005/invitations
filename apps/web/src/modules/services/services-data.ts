import importedListings from "./data/listings.json";
import importedCategories from "./data/categories.json";
import {
  serviceDirectory as filterDirectory,
  type ServiceListing,
  type ServiceCategory,
  type ServiceFilters,
} from "./services-utils";
export * from "./services-utils";
export const serviceListings = importedListings as ServiceListing[];
export const serviceCategories = importedCategories as ServiceCategory[];
export function serviceDirectory(filters: ServiceFilters = {}) {
  return filterDirectory(filters, serviceListings, serviceCategories);
}
