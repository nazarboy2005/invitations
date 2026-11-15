import { getDb } from "@taklifnoma/database";
import { z } from "zod";
import { requireAdmin, adminError } from "@/server/admin";
import { ApiError } from "@/server/api";
import { readMedia } from "@/server/storage";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = z.uuid().parse((await params).id),
      db = getDb();
    const [media] = await db`SELECT * FROM service_media WHERE id=${id}`;
    if (!media) throw new ApiError(404, "IMAGE_NOT_FOUND", "Rasm topilmadi.");
    const src = `/api/services/media/${id}`;
    const [publicListing] =
      await db`SELECT slug FROM service_listings WHERE published IS NOT NULL AND published->'images' @> ${db.json([{ src }])}::jsonb LIMIT 1`;
    if (!publicListing) await requireAdmin();
    const object = await readMedia(media.object_key);
    const bytes = Buffer.from(await object.Body!.transformToByteArray());
    return new Response(bytes, {
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": String(bytes.length),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (e) {
    return adminError(e);
  }
}
