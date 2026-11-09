import { templateById } from "@taklifnoma/contracts";
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
  removeMedia,
  readUploadBytes,
  verifiedMediaKey,
  putMedia,
} from "@/server/storage";
import { validateCreatorMedia } from "@/server/media-validation";
import { assertMediaBudget } from "@/server/media-policy";
import { enforceRateLimit } from "@/server/rate-limit";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let writtenKey: string | undefined;
  let committed = false;
  try {
    verifySameOrigin(request);
    const actor = await authenticatedUser();
    await enforceRateLimit({
      scope: "media-complete",
      identity: actor.id,
      maximum: 40,
      windowSeconds: 60,
    });
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
        if (
          asset.status !== "pending" ||
          new Date(asset.created_at).getTime() < Date.now() - 60 * 60_000
        )
          throw new ApiError(
            409,
            "UPLOAD_CLOSED",
            "Fayl rad etilgan. Qayta yuklang.",
          );
        const [invitation] =
          await tx`SELECT owner_id,status,template_id,identity_locked_at,edit_deadline_at FROM invitations WHERE id=${asset.draft_id} FOR SHARE`;
        if (
          invitation &&
          (invitation.owner_id !== user.id ||
            invitation.status === "deleted" ||
            templateById(invitation.template_id)?.format === "image" ||
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
        let validated;
        try {
          if (Number(asset.size_bytes) > 15 * 1024 * 1024)
            throw new ApiError(400, "INVALID_FILE", "Fayl hajmi juda katta.");
          validated = await validateCreatorMedia(
            await readUploadBytes(asset.object_key, Number(asset.size_bytes)),
            asset.mime_type,
          );
        } catch (error) {
          if (!(error instanceof ApiError) || error.code !== "INVALID_FILE")
            throw error;
          await removeMedia(asset.object_key);
          await tx`UPDATE media_assets SET status='rejected' WHERE id=${id}`;
          return { invalid: true as const, asset };
        }
        await assertMediaBudget(tx, user.id, validated.content.length, {
          exceptId: id,
        });
        const sealedKey = verifiedMediaKey(asset.object_key);
        writtenKey = sealedKey;
        await putMedia(sealedKey, validated.content, validated.mime);
        originalKey = asset.object_key;
        await tx`UPDATE media_assets SET status='ready',object_key=${sealedKey},size_bytes=${validated.content.length} WHERE id=${id} AND owner_id=${user.id}`;
        // A signed PUT can recreate the original until its URL expires. Delete
        // again after that window, including when the client abandons the page.
        await tx`INSERT INTO jobs(type,payload,idempotency_key,available_at)
          VALUES('media-cleanup',${tx.json({ key: asset.object_key, ownerId: user.id })},${`upload-source:${id}`},now()+interval '10 minutes')
          ON CONFLICT(idempotency_key) DO NOTHING`;
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
    committed = true;
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
    if (writtenKey && !committed) await removeMedia(writtenKey).catch(() => {});
    return apiError(e);
  }
}
