import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import {
  getSessionUser,
  missingAuthConfig,
  verifySameOrigin,
} from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";
import { listFavorites, mergeFavorites } from "@/server/favorites";

export const runtime = "nodejs";
const inputSchema = z.object({
  userId: z.uuid(),
  templateIds: z.array(z.string().regex(/^[a-z0-9-]{1,100}$/)).max(500),
  savedAt: z
    .record(z.string().regex(/^[a-z0-9-]{1,100}$/), z.iso.datetime())
    .optional(),
});
export async function GET() {
  try {
    const user = missingAuthConfig().length ? null : await getSessionUser();
    return NextResponse.json(
      {
        userId: user?.id ?? null,
        favorites: user ? await listFavorites(user.id) : [],
      },
      { headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}

async function change(request: Request, remove: boolean) {
  try {
    verifySameOrigin(request);
    const user = await getSessionUser();
    if (!user)
      throw new ApiError(401, "LOGIN_REQUIRED", "Avval hisobingizga kiring.");
    const input = inputSchema.parse(await readJson(request, 64000));
    // A request queued before an account switch must never modify the new user.
    if (input.userId !== user.id)
      throw new ApiError(
        409,
        "ACCOUNT_CHANGED",
        "Hisob o‘zgardi. Qayta urinib ko‘ring.",
      );
    let favorites;
    if (remove) {
      const db = getDb();
      if (input.templateIds.length)
        await db`DELETE FROM template_favorites WHERE user_id=${user.id} AND template_id IN ${db(input.templateIds)}`;
      favorites = await listFavorites(user.id);
    } else
      favorites = await mergeFavorites(
        user.id,
        input.templateIds,
        input.savedAt,
      );
    return NextResponse.json(
      { userId: user.id, favorites },
      { headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: Request) {
  return change(request, false);
}
export async function DELETE(request: Request) {
  return change(request, true);
}
