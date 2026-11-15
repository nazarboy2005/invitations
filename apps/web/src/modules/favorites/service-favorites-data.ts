export type Favorite = { serviceSlug: string; savedAt: string };
export const GUEST_FAVORITES_KEY = "taklifnoma:service-favorites:guest:v1";

export function parseFavorites(raw: string | null): Favorite[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const seen = new Set<string>();
    return value
      .filter((item): item is Favorite => {
        if (
          !item ||
          typeof item.serviceSlug !== "string" ||
          !/^[a-z0-9-]{1,100}$/.test(item.serviceSlug) ||
          typeof item.savedAt !== "string" ||
          !Number.isFinite(Date.parse(item.savedAt)) ||
          seen.has(item.serviceSlug)
        )
          return false;
        seen.add(item.serviceSlug);
        return true;
      })
      .slice(0, 500)
      .map((item) => ({
        serviceSlug: item.serviceSlug,
        savedAt: new Date(item.savedAt).toISOString(),
      }));
  } catch {
    return [];
  }
}
