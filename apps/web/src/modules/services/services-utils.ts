import exchangeRate from "./data/exchange-rate.json";
import {
  CURRENT_LOCATION_REGION,
  serviceDistance,
  type ServiceCoordinates,
} from "./service-distance";
export type ServiceImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};
export type ServiceCategory = {
  id: string;
  name: string;
  description?: string;
};
export type ServiceListing = {
  slug: string;
  name: string;
  categoryIds: string[];
  categoryLabel: string;
  description: string;
  region: string;
  district: string;
  address: string;
  phones: { label: string; value: string }[];
  links: { label: string; url: string }[];
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  price: {
    kind: "range" | "from" | "fixed" | "negotiable";
    min: number | null;
    max: number | null;
    currency: string;
    sourceText: string;
    unit?: "person";
  };
  images: ServiceImage[];
  importedAt: string;
  featured: boolean;
  featuredOrder?: number;
  featuredSince?: string;
};

export const SERVICES_PAGE_SIZE = 12;
const NEARBY_PARTNER_RADIUS_METERS = 5_000;
const NEARBY_PARTNER_NEAREST_COUNT = 5;
// Keep SSR and browser output identical across ICU locale versions.
const number = {
  format: (value: number) =>
    new Intl.NumberFormat("en-US").format(value).replace(/,/g, "\u00a0"),
};

export function servicePrice(price: ServiceListing["price"]): string {
  if (price.kind === "negotiable" || price.min === null)
    return "Kelishuv asosida";
  const currency = price.currency.toUpperCase();
  const rate = /^(UZS|SOM|SO‘M|SO'M)$/.test(currency)
    ? 1
    : currency === exchangeRate.currency
      ? exchangeRate.uzsPerUnit
      : null;
  if (rate === null) return "Narxni aniqlashtiring";
  const min = roundServicePrice(price.min * rate);
  const max = price.max === null ? null : roundServicePrice(price.max * rate);
  const unit = price.unit === "person" ? " / kishi" : "";
  if (price.kind === "range" && max !== null && max > min)
    return `${number.format(min)} – ${number.format(max)} so‘m${unit}`;
  return `${number.format(min)} so‘m${price.kind === "from" ? " dan" : ""}${unit}`;
}

/** Keep estimates easy to scan without rounding small prices down to zero. */
export function roundServicePrice(value: number): number {
  if (value <= 0) return 0;
  const step =
    value >= 100_000
      ? 100_000
      : value >= 10_000
        ? 10_000
        : value >= 1_000
          ? 1_000
          : 1;
  return Math.round(value / step) * step;
}

export function serviceLocation(
  listing: Pick<ServiceListing, "region" | "district" | "address">,
): string {
  return (
    [listing.region, listing.district].filter(Boolean).join(", ") ||
    listing.address
  );
}

export function normalizeServiceSearch(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("uz")
    .replace(/[‘’ʻʼ`´']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export type ServiceFilters = {
  category?: string;
  q?: string;
  region?: string;
  page?: string | number;
  favorites?: boolean;
  origin?: ServiceCoordinates | null;
};

export function serviceDirectory(
  filters: ServiceFilters = {},
  serviceListings: ServiceListing[],
  serviceCategories: ServiceCategory[],
) {
  const query = (filters.q ?? "").trim().slice(0, 120);
  const region = filters.region ?? "";
  const category = serviceCategories.find(
    (item) => item.id === filters.category,
  );
  const terms = normalizeServiceSearch(query).split(" ").filter(Boolean);
  const matches = serviceListings.filter(
    (listing) =>
      (!category || listing.categoryIds.includes(category.id)) &&
      (!region ||
        region === CURRENT_LOCATION_REGION ||
        listing.region === region) &&
      terms.every((term) =>
        normalizeServiceSearch(
          [
            listing.name,
            listing.categoryLabel,
            listing.description,
            listing.region,
            listing.district,
            listing.address,
          ].join(" "),
        ).includes(term),
      ),
  );
  // Mix the all-services view so each category gets a place in discovery.
  const categoryOrder = new Map(
    serviceCategories.map((item, index) => [item.id, index]),
  );
  const positions = new Map<string, number>();
  const nearby = region === CURRENT_LOCATION_REGION && Boolean(filters.origin);
  const ranked = matches.map((listing, index) => {
    const categoryId = listing.categoryIds[0];
    const position = positions.get(categoryId) ?? 0;
    positions.set(categoryId, position + 1);
    return {
      listing,
      distance: serviceDistance(filters.origin, listing) ?? Infinity,
      rank:
        position * serviceCategories.length +
        (categoryOrder.get(categoryId) ?? index),
      index,
    };
  });
  // Determine eligibility from the filtered, unboosted results before pagination.
  // Missing coordinates cannot qualify a partner for nearby promotion.
  const nearest = new Set(
    nearby
      ? ranked
          .filter((item) => Number.isFinite(item.distance))
          .sort((a, b) => a.distance - b.distance || a.index - b.index)
          .slice(0, NEARBY_PARTNER_NEAREST_COUNT)
          .map((item) => item.index)
      : [],
  );
  const promoted = (item: (typeof ranked)[number]) =>
    item.listing.featured &&
    (!nearby ||
      item.distance <= NEARBY_PARTNER_RADIUS_METERS ||
      nearest.has(item.index));
  ranked.sort((a, b) => {
    const aPromoted = promoted(a);
    const bPromoted = promoted(b);
    return (
      Number(bPromoted) - Number(aPromoted) ||
      (aPromoted && bPromoted
        ? (a.listing.featuredOrder ?? 0) - (b.listing.featuredOrder ?? 0) ||
          (Date.parse(b.listing.featuredSince ?? "") || 0) -
            (Date.parse(a.listing.featuredSince ?? "") || 0) ||
          // Legacy/bundled listings retain insertion order as a final tie-breaker.
          b.index - a.index
        : 0) ||
      (nearby
        ? (a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0) ||
          a.index - b.index
        : category
          ? a.index - b.index
          : a.rank - b.rank)
    );
  });
  const pages = Math.max(1, Math.ceil(ranked.length / SERVICES_PAGE_SIZE));
  const requestedPage = Number(filters.page ?? 1);
  const page = Math.min(
    pages,
    Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1),
  );
  return {
    query,
    region,
    category,
    page,
    pages,
    total: ranked.length,
    listings: ranked
      .slice((page - 1) * SERVICES_PAGE_SIZE, page * SERVICES_PAGE_SIZE)
      .map((item) => item.listing),
  };
}

export function serviceDirectoryUrl(filters: ServiceFilters = {}) {
  if (filters.category === "invitation") return "/templates";
  const pathname = filters.category
    ? `/services/${encodeURIComponent(filters.category)}`
    : "/services";
  const params = new URLSearchParams();
  if (filters.favorites) params.set("favorites", "1");
  if (filters.q?.trim()) params.set("q", filters.q.trim().slice(0, 120));
  if (filters.region) params.set("region", filters.region);
  if (filters.page && Number(filters.page) > 1)
    params.set("page", String(filters.page));
  return `${pathname}${params.size ? `?${params}` : ""}`;
}

export function serviceMapUrl(
  listing: Pick<ServiceListing, "latitude" | "longitude" | "address" | "name">,
) {
  const url = new URL("https://yandex.uz/maps/");
  url.searchParams.set("lang", "uz_UZ");
  if (
    listing.latitude !== null &&
    listing.longitude !== null &&
    Number.isFinite(listing.latitude) &&
    Number.isFinite(listing.longitude) &&
    Math.abs(listing.latitude) <= 90 &&
    Math.abs(listing.longitude) <= 180
  ) {
    url.searchParams.set(
      "pt",
      `${listing.longitude},${listing.latitude},pm2rdm`,
    );
    url.searchParams.set("ll", `${listing.longitude},${listing.latitude}`);
    url.searchParams.set("z", "16");
  } else
    url.searchParams.set(
      "text",
      [listing.name, listing.address].filter(Boolean).join(", "),
    );
  return url.toString();
}

export function servicePhoneUrl(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15 ? `tel:+${digits}` : null;
}

export function serviceExternalUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
