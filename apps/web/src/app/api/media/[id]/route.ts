import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { apiError, ApiError } from "@/server/api";
import { getSessionUser } from "@/server/auth";
import { mediaReadUrl } from "@/server/storage";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    z.uuid().parse(id);
    const [asset] =
      await getDb()`SELECT * FROM media_assets WHERE id=${id} AND status='ready'`;
    if (!asset) throw new ApiError(404, "NOT_FOUND", "Fayl topilmadi.");
    let publicAccess = false;
    if (asset.mime_type.startsWith("audio/")) {
      const catalogTrack =
        await getDb()`SELECT id FROM catalog_music_tracks WHERE asset_id=${id} LIMIT 1`;
      publicAccess = catalogTrack.length > 0;
    }
    if (
      !publicAccess &&
      asset.visibility === "public" &&
      /^(image|audio)\//.test(asset.mime_type)
    ) {
      const mediaUrl = `/api/media/${id}`;
      const referenced = await getDb()`SELECT id FROM invitations
          WHERE owner_id=${asset.owner_id} AND status='published'
            AND (
              data->'music' @> jsonb_build_object(
                'enabled', true, 'assetId', ${id}, 'url', ${mediaUrl}
              )
              OR EXISTS (
                SELECT 1 FROM jsonb_array_elements(
                  COALESCE(data->'gallery', '[]'::jsonb)
                ) AS image
                WHERE image->>'id'=${id} AND image->>'url'=${mediaUrl}
              )
            )
          LIMIT 1`;
      publicAccess = referenced.length > 0;
    }
    if (!publicAccess) {
      const user = await getSessionUser();
      if (!user || user.id !== asset.owner_id)
        throw new ApiError(404, "NOT_FOUND", "Fayl topilmadi.");
    }
    // Authorized media is transferred by R2, not buffered through a Vercel function.
    return new Response(null, {
      status: 302,
      headers: {
        Location: await mediaReadUrl(asset.object_key, asset.mime_type),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    return apiError(e);
  }
}
