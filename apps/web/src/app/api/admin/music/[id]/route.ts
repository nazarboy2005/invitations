import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import {
  requireAdminMutation,
  recordAdminChange,
  adminError,
} from "@/server/admin";
import { ApiError, privateHeaders, readJson } from "@/server/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAdminMutation(request);
    const { id } = await params;
    z.uuid().parse(id);
    const input = z
      .object({
        title: z.string().trim().min(1).max(160).optional(),
        active: z.boolean().optional(),
      })
      .strict()
      .refine((value) => Object.keys(value).length > 0)
      .parse(await readJson(request, 5000));
    const track = await getDb().begin(async (tx) => {
      const [before] =
        await tx`SELECT title,active FROM catalog_music_tracks WHERE id=${id} FOR UPDATE`;
      if (!before) throw new ApiError(404, "NOT_FOUND", "Musiqa topilmadi.");
      const [updated] = await tx`
      UPDATE catalog_music_tracks
      SET title=COALESCE(${input.title ?? null},title),
          active=COALESCE(${input.active ?? null},active), updated_at=now()
      WHERE id=${id}
      RETURNING id,title,active,position,created_at`;
      await recordAdminChange(tx, user.id, "music.update", id, before, {
        title: updated.title,
        active: updated.active,
      });
      return updated;
    });
    return NextResponse.json({ track }, { headers: privateHeaders });
  } catch (error) {
    return adminError(error);
  }
}
