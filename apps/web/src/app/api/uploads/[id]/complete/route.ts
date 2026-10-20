import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { authenticatedUser } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders } from "@/server/api";
import { detectMedia, inspectMedia, removeMedia } from "@/server/storage";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    const [asset] =
      await getDb()`SELECT * FROM media_assets WHERE id=${id} AND owner_id=${user.id}`;
    if (!asset) throw new ApiError(404, "NOT_FOUND", "Fayl topilmadi.");
    if (asset.status !== "ready") {
      const [invitation] =
        await getDb()`SELECT owner_id,status,edit_deadline_at FROM invitations WHERE id=${asset.draft_id}`;
      if (
        invitation &&
        (invitation.owner_id !== user.id ||
          invitation.status === "archived" ||
          (invitation.status === "published" &&
            (!invitation.edit_deadline_at ||
              new Date(invitation.edit_deadline_at) <= new Date())))
      )
        throw new ApiError(
          403,
          "UPLOAD_FORBIDDEN",
          "Tahrirlash muddati tugagan.",
        );
      const inspection = await inspectMedia(asset.object_key);
      const format = detectMedia(
        inspection.bytes,
        asset.mime_type.startsWith("image/") ? "image" : "audio",
      );
      if (
        inspection.size !== Number(asset.size_bytes) ||
        inspection.size > 15 * 1024 * 1024 ||
        !format ||
        format.mime !== asset.mime_type
      ) {
        await removeMedia(asset.object_key);
        await getDb()`UPDATE media_assets SET status='rejected' WHERE id=${id}`;
        throw new ApiError(
          400,
          "INVALID_FILE",
          "Fayl turi yoki hajmi mos kelmadi.",
        );
      }
      await getDb()`UPDATE media_assets SET status='ready' WHERE id=${id} AND owner_id=${user.id}`;
    }
    return NextResponse.json(
      { asset: { id: asset.id, url: asset.url, filename: asset.filename } },
      { headers: privateHeaders },
    );
  } catch (e) {
    return apiError(e);
  }
}
