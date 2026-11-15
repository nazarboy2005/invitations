import { getDb } from "@taklifnoma/database";
import { getPublishedServices } from "./services";
export async function listFavorites(userId: string, db = getDb()) {
  const rows =
    await db`SELECT service_slug,saved_at FROM service_favorites WHERE user_id=${userId} ORDER BY saved_at DESC,service_slug`;
  return rows.map((row) => ({
    serviceSlug: String(row.service_slug),
    savedAt: new Date(row.saved_at).toISOString(),
  }));
}
export async function mergeFavorites(
  userId: string,
  ids: string[],
  savedAt: Record<string, string> = {},
  db = getDb(),
) {
  const known = new Set((await getPublishedServices()).map((item) => item.slug));
  const entries = [...new Set(ids)]
    .filter((id) => known.has(id))
    .map((id, index) => ({
      id,
      saved_at: new Date(
        Math.min(
          Date.now() - index,
          savedAt[id] ? Date.parse(savedAt[id]) : Date.now() - index,
        ),
      ).toISOString(),
    }));
  if (entries.length)
    await db`INSERT INTO service_favorites(user_id,service_slug,saved_at) SELECT ${userId}::uuid,f.id,f.saved_at FROM jsonb_to_recordset(${db.json(entries)}) AS f(id text,saved_at timestamptz) ON CONFLICT (user_id,service_slug) DO NOTHING`;
  return listFavorites(userId, db);
}
