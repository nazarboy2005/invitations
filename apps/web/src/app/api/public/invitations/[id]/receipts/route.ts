import { randomUUID, createHash } from "node:crypto";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { ApiError, apiError, privateHeaders, readBytes } from "@/server/api";
import { verifySameOrigin } from "@/server/auth";
import {
  publicInvitation,
  resolveGuest,
  submissionLimit,
} from "@/server/public";
import {
  detectMedia,
  mediaObjectKey,
  putMedia,
  removeMedia,
} from "@/server/storage";
export const runtime = "nodejs";
const MAX_SIZE = 5 * 1024 * 1024;
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let writtenKey: string | undefined;
  try {
    verifySameOrigin(request);
    const { id } = await params;
    const { invitation, id: invitationId } = await publicInvitation(id);
    if (!invitation.gift.enabled || !invitation.gift.receiptUploadEnabled)
      throw new ApiError(403, "RECEIPTS_CLOSED", "Chek yuborish yopilgan.");
    await submissionLimit(request, invitationId, "receipt");
    if (
      !request.headers.get("content-type")?.startsWith("multipart/form-data;")
    )
      throw new ApiError(400, "INVALID_INPUT", "Chek faylini tanlang.");
    const bytes = await readBytes(request, MAX_SIZE + 20_000);
    const form = await new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": request.headers.get("content-type") || "" },
      body: new Uint8Array(bytes),
    }).formData();
    const giverNames = z
      .string()
      .trim()
      .min(1)
      .max(300)
      .parse(form.get("giverNames"));
    const token = z
      .string()
      .max(128)
      .optional()
      .parse(form.get("guestToken") || undefined);
    const guest = await resolveGuest(invitationId, token);
    const file = form.get("file");
    if (!(file instanceof File) || file.size < 16 || file.size > MAX_SIZE)
      throw new ApiError(
        400,
        "INVALID_FILE",
        "JPG, PNG, WebP yoki PDF fayl tanlang (5 MB gacha).",
      );
    const content = Buffer.from(await file.arrayBuffer());
    const format =
      detectMedia(content, "image") ||
      (content.subarray(0, 5).toString() === "%PDF-" &&
      content.subarray(-1024).includes(Buffer.from("%%EOF"))
        ? { mime: "application/pdf", extension: "pdf" }
        : null);
    if (!format)
      throw new ApiError(
        400,
        "INVALID_FILE",
        "Fayl turi mos kelmadi. JPG, PNG, WebP yoki PDF tanlang.",
      );
    const hash = createHash("sha256").update(content).digest("hex");
    const assetId = randomUUID();
    const key = mediaObjectKey(
      `receipts/${invitationId}/${assetId}.${format.extension}`,
    );
    const result = await getDb().begin(async (tx) => {
      // Recheck under a lock so disabling uploads cannot race an in-flight submission.
      const [row] =
        await tx`SELECT owner_id,data FROM invitations WHERE id=${invitationId} AND status='published' FOR SHARE`;
      if (!row?.data.gift.enabled || !row.data.gift.receiptUploadEnabled)
        throw new ApiError(403, "RECEIPTS_CLOSED", "Chek yuborish yopilgan.");
      await tx`SELECT pg_advisory_xact_lock(hashtext(${invitationId}),hashtext(${hash}))`;
      const [duplicate] =
        await tx`SELECT id FROM gift_receipts WHERE invitation_id=${invitationId} AND file_hash=${hash}`;
      if (duplicate) return { duplicate: true };
      writtenKey = key;
      await putMedia(key, content, format.mime);
      await tx`INSERT INTO media_assets(id,owner_id,draft_id,object_key,url,filename,mime_type,size_bytes,visibility,status) VALUES(${assetId},${row.owner_id},${invitationId},${key},${`/api/media/${assetId}`},${file.name.slice(0, 200)},${format.mime},${content.length},'private','ready')`;
      await tx`INSERT INTO gift_receipts(invitation_id,guest_id,asset_id,giver_names,file_hash,destination) VALUES(${invitationId},${guest?.id ?? null},${assetId},${giverNames},${hash},${tx.json({ cardNumber: row.data.gift.cardNumber, cardHolder: row.data.gift.cardHolder })})`;
      return { duplicate: false };
    });
    writtenKey = undefined;
    return Response.json(
      {
        ok: true,
        ...result,
        message:
          "Chek saqlandi. Taklifnoma egasi ko‘rib chiqadi. Bu to‘lov tasdig‘i emas.",
      },
      { status: result.duplicate ? 200 : 201, headers: privateHeaders },
    );
  } catch (error) {
    if (writtenKey) await removeMedia(writtenKey).catch(() => {});
    return apiError(error);
  }
}
