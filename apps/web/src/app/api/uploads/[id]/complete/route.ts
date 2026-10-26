import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { authenticatedUser } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders } from "@/server/api";
import { requireAdminMutation } from "@/server/admin";
import { invitationRequestActor } from "@/server/admin-invitation-access";
import { recordAdminChange } from "@/server/admin";
import {
  detectMedia,
  inspectMedia,
  removeMedia,
  sealMedia,
} from "@/server/storage";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    verifySameOrigin(request);
    const actor = await authenticatedUser();
    const target = request.headers.get("x-admin-invitation");
    const access = target
      ? await invitationRequestActor(request, target, actor, true)
      : { owner: actor, admin: undefined };
    const user = access.owner;
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
    if (/^(?:(?:local|verified)\/)?platform-music\//.test(upload.object_key))
      await requireAdminMutation(request);
    let originalKey: string | undefined;
    const result = await getDb().begin(async (tx) => {
      const [asset] =
        await tx`SELECT * FROM media_assets WHERE id=${id} AND owner_id=${user.id} FOR UPDATE`;
      if (!asset) throw new ApiError(404, "NOT_FOUND", "Fayl topilmadi.");
      if (target && asset.draft_id !== target)
        throw new ApiError(
          403,
          "ADMIN_CONTEXT_MISMATCH",
          "Fayl tanlangan taklifnomaga tegishli emas.",
        );
      if (asset.status !== "ready") {
        if (asset.status !== "pending")
          throw new ApiError(
            409,
            "UPLOAD_CLOSED",
            "Fayl rad etilgan. Qayta yuklang.",
          );
        const [invitation] =
          await tx`SELECT owner_id,status,edit_deadline_at FROM invitations WHERE id=${asset.draft_id} FOR SHARE`;
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
          await tx`UPDATE media_assets SET status='rejected' WHERE id=${id}`;
          return { invalid: true as const, asset };
        }
        const sealedKey = await sealMedia(asset.object_key);
        if (sealedKey !== asset.object_key) originalKey = asset.object_key;
        await tx`UPDATE media_assets SET status='ready',object_key=${sealedKey} WHERE id=${id} AND owner_id=${user.id}`;
        if (access.admin)
          await recordAdminChange(
            tx,
            access.admin.actorId,
            "invitation.upload",
            id,
            null,
            {
              ownerId: user.id,
              invitationId: target,
              reason: access.admin.reason,
            },
          );
      }
      return { invalid: false as const, asset };
    });
    if (result.invalid)
      throw new ApiError(
        400,
        "INVALID_FILE",
        "Fayl turi yoki hajmi mos kelmadi.",
      );
    const asset = result.asset;
    if (originalKey) await removeMedia(originalKey).catch(() => {});
    return NextResponse.json(
      { asset: { id: asset.id, url: asset.url, filename: asset.filename } },
      { headers: privateHeaders },
    );
  } catch (e) {
    return apiError(e);
  }
}
