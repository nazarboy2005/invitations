import { getDb } from "@taklifnoma/database";
import { TEMPLATES } from "@taklifnoma/contracts";

export async function listFavorites(userId: string, db = getDb()) {
  const rows =
    await db`SELECT template_id,saved_at FROM template_favorites WHERE user_id=${userId} ORDER BY saved_at DESC,template_id`;
  return rows.map((row) => ({
    templateId: String(row.template_id),
    savedAt: new Date(row.saved_at).toISOString(),
  }));
}

export async function mergeFavorites(
  userId: string,
  ids: string[],
  savedAt: Record<string, string> = {},
  db = getDb(),
) {
  // Retain known designs that became unpublished between a guest save and login.
  const known = [...new Set(ids)].filter((id) =>
    TEMPLATES.some((template) => template.id === id),
  );
  const entries = known.map((id, index) => ({
    id,
    saved_at: new Date(
      Math.min(
        Date.now() - index,
        savedAt[id] ? Date.parse(savedAt[id]) : Date.now() - index,
      ),
    ).toISOString(),
  }));
  if (known.length)
    await db`
    INSERT INTO template_favorites(user_id,template_id,saved_at)
    SELECT ${userId}::uuid,t.id,f.saved_at
    FROM jsonb_to_recordset(${db.json(entries)}) AS f(id text,saved_at timestamptz)
    JOIN templates t ON t.id=f.id
    ON CONFLICT (user_id,template_id) DO NOTHING`;
  return listFavorites(userId, db);
}
