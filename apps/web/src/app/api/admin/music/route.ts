import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import {
  requireAdmin,
  requireAdminMutation,
  recordAdminChange,
  adminError,
} from "@/server/admin";
import { ApiError, privateHeaders, readJson } from "@/server/api";

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
    return adminError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdminMutation(request);
    const input = z
      .object({ assetId: z.uuid(), title: z.string().trim().min(1).max(160) })
      .strict()
      .parse(await readJson(request, 5000));
    const track = await getDb().begin(async (tx) => {
      const [asset] = await tx`
      SELECT id FROM media_assets
      WHERE id=${input.assetId} AND owner_id=${user.id} AND draft_id IS NULL
        AND status='ready' AND mime_type LIKE 'audio/%'
        AND (object_key LIKE 'verified/platform-music/%' OR object_key LIKE 'local/platform-music/%') FOR UPDATE`;
      if (!asset)
        throw new ApiError(404, "MUSIC_ASSET_NOT_FOUND", "Audio topilmadi.");
      const [existing] =
        await tx`SELECT id FROM catalog_music_tracks WHERE asset_id=${input.assetId}`;
      if (existing)
        throw new ApiError(
          409,
          "MUSIC_EXISTS",
          "Bu audio kutubxonaga qo‘shilgan.",
        );
      const [position] = await tx`
      SELECT COALESCE(max(position), -1)::int + 1 AS next
      FROM catalog_music_tracks`;
      const [created] = await tx`
      INSERT INTO catalog_music_tracks(asset_id,title,position)
      VALUES(${input.assetId},${input.title},${position.next})
      RETURNING id,title,active,position,created_at`;
      await recordAdminChange(tx, user.id, "music.create", created.id, null, {
        title: created.title,
        active: created.active,
        assetId: input.assetId,
      });
      return created;
    });
    return NextResponse.json(
      { track },
      { status: 201, headers: privateHeaders },
    );
  } catch (error) {
    return adminError(error);
  }
}
