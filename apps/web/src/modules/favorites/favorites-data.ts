export type Favorite = { templateId: string; savedAt: string };
export const GUEST_FAVORITES_KEY = "taklifnoma:favorites:guest:v1";

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
          typeof item.templateId !== "string" ||
          !/^[a-z0-9-]{1,100}$/.test(item.templateId) ||
          typeof item.savedAt !== "string" ||
          !Number.isFinite(Date.parse(item.savedAt)) ||
          seen.has(item.templateId)
        )
          return false;
        seen.add(item.templateId);
        return true;
      })
      .slice(0, 500)
      .map((item) => ({
        templateId: item.templateId,
        savedAt: new Date(item.savedAt).toISOString(),
      }));
  } catch {
    return [];
  }
}

/** Stable partition: preserve the catalog order within both groups. */
export function favoritesFirst<T extends { id: string }>(
  templates: T[],
  favorites: Favorite[],
): T[] {
  const ids = new Set(favorites.map((item) => item.templateId));
  return [
    ...templates.filter((item) => ids.has(item.id)),
    ...templates.filter((item) => !ids.has(item.id)),
  ];
}
