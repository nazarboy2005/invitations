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
    if (
      asset.draft_id &&
      asset.visibility === "public" &&
      /^(image|audio)\//.test(asset.mime_type)
    ) {
      const [published] =
        await getDb()`SELECT data FROM invitations WHERE id=${asset.draft_id} AND owner_id=${asset.owner_id} AND status='published'`;
      const data = published?.data;
      publicAccess =
        !!data &&
        (data.gallery?.some(
          (image: { id: string; url: string }) =>
            image.id === id && image.url === `/api/media/${id}`,
        ) ||
          (data.music?.enabled === true &&
            data.music?.assetId === id &&
            data.music?.url === `/api/media/${id}`));
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
