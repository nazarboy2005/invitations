import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { authenticatedUser } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";
const categoryIdSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
const inputSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    position: z.number().int().min(0).max(10000).optional(),
  })
  .strict()
  .refine((value) => value.name !== undefined || value.position !== undefined);
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    if (!user.isAdmin)
      throw new ApiError(403, "FORBIDDEN", "Administrator huquqi kerak.");
    const id = categoryIdSchema.parse((await params).id),
      input = inputSchema.parse(await readJson(request, 5000));
    const [category] =
      await getDb()`UPDATE template_categories SET name=COALESCE(${input.name ?? null}::text,name),position=COALESCE(${input.position ?? null}::integer,position),updated_at=now() WHERE id=${id} RETURNING id,name,position`;
    if (!category) throw new ApiError(404, "NOT_FOUND", "Turkum topilmadi.");
    return NextResponse.json({ category }, { headers: privateHeaders });
  } catch (error) {
    return apiError(error);
  }
}
