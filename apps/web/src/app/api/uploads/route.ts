import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { authenticatedUser } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";
import { presignMedia, storageClient } from "@/server/storage";
export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await authenticatedUser();
    const assets = await getDb()`
      SELECT id, url, filename, created_at
      FROM media_assets
      WHERE owner_id=${user.id}
        AND status='ready'
        AND mime_type LIKE 'audio/%'
      ORDER BY created_at DESC
      LIMIT 100`;
    return NextResponse.json(
      {
        assets: assets.map((asset) => ({
          id: asset.id,
          url: asset.url,
          filename: asset.filename,
          createdAt: asset.created_at,
        })),
      },
      { headers: privateHeaders },
    );
  } catch (e) {
    return apiError(e);
  }
}

const inputSchema = z
  .object({
    filename: z.string().min(1).max(200),
    size: z
      .number()
      .int()
      .min(16)
      .max(15 * 1024 * 1024),
    contentType: z.enum([
      "image/png",
      "image/jpeg",
      "image/webp",
      "audio/mpeg",
      "audio/wav",
      "audio/mp4",
      "audio/x-m4a",
    ]),
    kind: z.enum(["image", "audio"]),
    draftId: z.uuid().optional(),
    catalog: z.boolean().optional(),
  })
  .strict();
export async function POST(request: Request) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    storageClient();
    const input = inputSchema.parse(await readJson(request, 5000));
    if (input.catalog && (!user.isAdmin || input.kind !== "audio"))
      throw new ApiError(403, "FORBIDDEN", "Administrator huquqi kerak.");
    if (!input.catalog && !input.draftId)
      throw new ApiError(
        400,
        "INVALID_DRAFT",
        "Qoralama identifikatori kerak.",
      );
    if (!input.contentType.startsWith(input.kind + "/"))
      throw new ApiError(400, "INVALID_FILE", "Fayl turini tekshiring.");
    const existing = input.draftId
      ? await getDb()`SELECT owner_id,status,edit_deadline_at FROM invitations WHERE id=${input.draftId}`
      : [];
    if (
      existing[0] &&
      (existing[0].owner_id !== user.id ||
        existing[0].status === "archived" ||
        (existing[0].status === "published" &&
          (!existing[0].edit_deadline_at ||
            new Date(existing[0].edit_deadline_at) <= new Date())))
    )
      throw new ApiError(
        403,
        "UPLOAD_FORBIDDEN",
        "Bu taklifnomaga fayl yuklash mumkin emas.",
      );
    const [pending] =
      await getDb()`SELECT count(*)::int AS count FROM media_assets WHERE owner_id=${user.id} AND status='pending' AND created_at>now()-interval '10 minutes'`;
    if (pending.count >= 10)
      throw new ApiError(
        429,
        "UPLOAD_LIMIT",
        "Yuklashlar tugashini kuting va qayta urining.",
      );
    const extension = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
      "audio/mpeg": "mp3",
      "audio/wav": "wav",
      "audio/mp4": "m4a",
      "audio/x-m4a": "m4a",
    }[input.contentType];
    const id = randomUUID(),
      key = input.catalog
        ? `platform-music/${id}.${extension}`
        : `creators/${user.id}/${input.draftId}/${id}.${extension}`,
      url = `/api/media/${id}`,
      mime =
        input.contentType === "audio/x-m4a" ? "audio/mp4" : input.contentType;
    const uploadUrl = await presignMedia(key, mime);
    // A public media asset is only anonymously readable when currently referenced
    // by its owner's published invitation; drafts remain authenticated.
    await getDb()`INSERT INTO media_assets(id,owner_id,draft_id,object_key,url,filename,mime_type,size_bytes,visibility,status) VALUES(${id},${user.id},${input.draftId ?? null},${key},${url},${input.filename},${mime},${input.size},'public','pending')`;
    return NextResponse.json(
      {
        upload: {
          id,
          url: uploadUrl,
          headers: { "Content-Type": mime },
          completeUrl: `/api/uploads/${id}/complete`,
        },
      },
      { status: 201, headers: privateHeaders },
    );
  } catch (e) {
    return apiError(e);
  }
}
