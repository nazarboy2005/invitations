import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { authenticatedUser } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readBytes } from "@/server/api";
import { detectMedia, putMedia } from "@/server/storage";
import { requireAdminMutation } from "@/server/admin";
import { invitationRequestActor } from "@/server/admin-invitation-access";
export const runtime = "nodejs";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    verifySameOrigin(request);
    const actor = await authenticatedUser();
    const target = request.headers.get("x-admin-invitation");
    const user = target
      ? (await invitationRequestActor(request, target, actor, true)).owner
      : actor;
    const { id } = await params;
    z.uuid().parse(id);
    const [upload] =
      await getDb()`SELECT object_key,draft_id FROM media_assets WHERE id=${id} AND owner_id=${user.id}`;
    if (!upload) throw new ApiError(404, "NOT_FOUND", "Fayl topilmadi.");
    if (target && upload.draft_id !== target)
      throw new ApiError(
        403,
        "ADMIN_CONTEXT_MISMATCH",
        "Fayl tanlangan taklifnomaga tegishli emas.",
      );
    if (upload.object_key.startsWith("local/platform-music/"))
      await requireAdminMutation(request);
    const bytes = await readBytes(request, 15 * 1024 * 1024);
    await getDb().begin(async (tx) => {
      const [asset] =
        await tx`SELECT * FROM media_assets WHERE id=${id} AND owner_id=${user.id} FOR UPDATE`;
      if (!asset || !asset.object_key.startsWith("local/"))
        throw new ApiError(404, "NOT_FOUND", "Fayl topilmadi.");
      if (target && asset.draft_id !== target)
        throw new ApiError(
          403,
          "ADMIN_CONTEXT_MISMATCH",
          "Fayl tanlangan taklifnomaga tegishli emas.",
        );
      if (asset.status !== "pending")
        throw new ApiError(
          409,
          "UPLOAD_CLOSED",
          "Bu faylni almashtirib bo‘lmaydi.",
        );
      const [invitation] =
        await tx`SELECT owner_id,status,identity_locked_at,edit_deadline_at FROM invitations WHERE id=${asset.draft_id} FOR SHARE`;
      if (
        invitation &&
        (invitation.owner_id !== user.id ||
          invitation.status === "deleted" ||
          ((invitation.status === "published" ||
            invitation.identity_locked_at) &&
            (!invitation.edit_deadline_at ||
              new Date(invitation.edit_deadline_at) <= new Date())))
      )
        throw new ApiError(
          403,
          "UPLOAD_FORBIDDEN",
          "Tahrirlash muddati tugagan.",
        );
      const format = detectMedia(
        bytes,
        asset.mime_type.startsWith("image/") ? "image" : "audio",
      );
      if (
        bytes.length !== Number(asset.size_bytes) ||
        !format ||
        format.mime !== asset.mime_type
      )
        throw new ApiError(
          400,
          "INVALID_FILE",
          "Fayl turi yoki hajmi mos kelmadi.",
        );
      await putMedia(asset.object_key, bytes, asset.mime_type);
    });
    return new Response(null, { status: 204, headers: privateHeaders });
  } catch (error) {
    return apiError(error);
  }
}
