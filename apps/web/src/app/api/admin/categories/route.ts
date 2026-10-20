import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { authenticatedUser } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";
const inputSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .max(64)
      .regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/),
    name: z.string().trim().min(1).max(120),
    position: z.number().int().min(0).max(10000).optional(),
  })
  .strict();
async function requireAdmin() {
  const user = await authenticatedUser();
  if (!user.isAdmin)
    throw new ApiError(403, "FORBIDDEN", "Administrator huquqi kerak.");
}
export async function GET() {
  try {
    await requireAdmin();
    const rows =
      await getDb()`SELECT id,name,position FROM template_categories ORDER BY position,id`;
    return NextResponse.json({ categories: rows }, { headers: privateHeaders });
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: Request) {
  try {
    verifySameOrigin(request);
    await requireAdmin();
    const input = inputSchema.parse(await readJson(request, 5000));
    const [category] =
      await getDb()`INSERT INTO template_categories(id,name,position) VALUES(${input.id},${input.name},${input.position ?? 100}) ON CONFLICT(id) DO NOTHING RETURNING id,name,position`;
    if (!category)
      throw new ApiError(
        409,
        "CATEGORY_EXISTS",
        "Bu turkum identifikatori allaqachon mavjud.",
      );
    return NextResponse.json(
      { category },
      { status: 201, headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
