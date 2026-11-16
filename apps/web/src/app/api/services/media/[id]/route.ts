import { getDb } from "@taklifnoma/database";
import { z } from "zod";
import { requireAdmin, adminError } from "@/server/admin";
import { ApiError } from "@/server/api";
import { serviceImageResponse } from "@/server/service-image-cache";
import { uploadedServiceImageSource } from "@/server/service-image-source";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
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
    return await serviceImageResponse(
      request,
      uploadedServiceImageSource(media.object_key),
      {
        cacheable: Boolean(publicListing),
      },
    );
  } catch (e) {
    return adminError(e);
  }
}
export const HEAD = GET;
