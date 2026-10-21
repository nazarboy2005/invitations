import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { authenticatedUser } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    if (!user.isAdmin)
      throw new ApiError(403, "FORBIDDEN", "Administrator huquqi kerak.");
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
    const [track] = await getDb()`
      UPDATE catalog_music_tracks
      SET title=COALESCE(${input.title ?? null},title),
          active=COALESCE(${input.active ?? null},active), updated_at=now()
      WHERE id=${id}
      RETURNING id,title,active,position,created_at`;
    if (!track) throw new ApiError(404, "NOT_FOUND", "Musiqa topilmadi.");
    return NextResponse.json({ track }, { headers: privateHeaders });
  } catch (error) {
    return apiError(error);
  }
}
