import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { authenticatedUser } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";

async function requireAdmin() {
  const user = await authenticatedUser();
  if (!user.isAdmin)
    throw new ApiError(403, "FORBIDDEN", "Administrator huquqi kerak.");
  return user;
}

export async function GET() {
  try {
    await requireAdmin();
    const tracks = await getDb()`
      SELECT t.id, t.title, t.active, t.position, t.created_at,
             a.id AS asset_id, a.filename AS original_filename, a.url,
             a.size_bytes, a.mime_type, a.status
      FROM catalog_music_tracks t
      JOIN media_assets a ON a.id=t.asset_id
      ORDER BY t.position, t.created_at DESC`;
    return NextResponse.json({ tracks }, { headers: privateHeaders });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    verifySameOrigin(request);
    const user = await requireAdmin();
    const input = z
      .object({ assetId: z.uuid(), title: z.string().trim().min(1).max(160) })
      .strict()
      .parse(await readJson(request, 5000));
    const [asset] = await getDb()`
      SELECT id FROM media_assets
      WHERE id=${input.assetId} AND owner_id=${user.id} AND draft_id IS NULL
        AND status='ready' AND mime_type LIKE 'audio/%'
        AND object_key LIKE 'platform-music/%'`;
    if (!asset)
      throw new ApiError(404, "MUSIC_ASSET_NOT_FOUND", "Audio topilmadi.");
    const [position] = await getDb()`
      SELECT COALESCE(max(position), -1)::int + 1 AS next
      FROM catalog_music_tracks`;
    const [track] = await getDb()`
      INSERT INTO catalog_music_tracks(asset_id,title,position)
      VALUES(${input.assetId},${input.title},${position.next})
      RETURNING id,title,active,position,created_at`;
    return NextResponse.json(
      { track },
      { status: 201, headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
