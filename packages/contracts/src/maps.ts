/** One destination for the invitation map and its click-through link. */
export type VenueLocation = {
  latitude: number | null;
  longitude: number | null;
  mapUrl: string;
  placeUri?: string;
};

export function hasVenuePoint(venue: Pick<VenueLocation, "latitude" | "longitude">): boolean {
  return venue.latitude !== null && venue.longitude !== null &&
    Number.isFinite(venue.latitude) && Number.isFinite(venue.longitude) &&
    Math.abs(venue.latitude) <= 90 && Math.abs(venue.longitude) <= 180;
}

export function yandexMapUrl(venue: VenueLocation, query = ""): string {
  const url = new URL("https://yandex.uz/maps/");
  url.searchParams.set("lang", "uz_UZ");
  if (hasVenuePoint(venue)) {
    const organization = venue.placeUri?.match(/^ymapsbm1:\/\/org\?oid=(\d+)$/)?.[1];
    if (organization) url.pathname = `/maps/org/${organization}/`;
    const point = `${venue.longitude},${venue.latitude}`;
    url.searchParams.set("ll", point);
    url.searchParams.set("z", "16");
    url.searchParams.set("pt", `${point},pm2rdm`);
    return url.toString();
  }
  try {
    const saved = new URL(venue.mapUrl);
    if (saved.protocol === "https:" && /^(?:www\.)?yandex\.(?:uz|ru|com)$/.test(saved.hostname) && saved.pathname.startsWith("/maps")) {
      saved.hostname = "yandex.uz";
      saved.searchParams.set("lang", "uz_UZ");
      return saved.toString();
    }
  } catch { /* Blank drafts have no link. */ }
  if (!query.trim()) return "";
  url.searchParams.set("text", query.trim());
  return url.toString();
}

export function normalizeVenue<T extends VenueLocation>(venue: T): T {
  const valid = hasVenuePoint(venue);
  const normalized = { ...venue, latitude: valid ? venue.latitude : null, longitude: valid ? venue.longitude : null };
  const result = { ...normalized, mapUrl: yandexMapUrl(normalized) };
  if (!valid) delete result.placeUri;
  return result;
}

