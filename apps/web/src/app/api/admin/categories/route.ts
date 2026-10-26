import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import {
  requireAdmin,
  requireAdminMutation,
  recordAdminChange,
  adminError,
} from "@/server/admin";
import { ApiError, privateHeaders, readJson } from "@/server/api";
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
export async function GET() {
  try {
    await requireAdmin();
    const rows =
      await getDb()`SELECT id,name,position FROM template_categories ORDER BY position,id`;
    return NextResponse.json({ categories: rows }, { headers: privateHeaders });
  } catch (error) {
    return adminError(error);
  }
}
export async function POST(request: Request) {
  try {
    const user = await requireAdminMutation(request);
    const input = inputSchema.parse(await readJson(request, 5000));
    const category = await getDb().begin(async (tx) => {
      const [created] =
        await tx`INSERT INTO template_categories(id,name,position) VALUES(${input.id},${input.name},${input.position ?? 100}) ON CONFLICT(id) DO NOTHING RETURNING id,name,position`;
      if (!created)
        throw new ApiError(
          409,
          "CATEGORY_EXISTS",
          "Bu turkum identifikatori allaqachon mavjud.",
        );
      await recordAdminChange(
        tx,
        user.id,
        "category.create",
        input.id,
        null,
        created,
      );
      return created;
    });
    return NextResponse.json(
      { category },
      { status: 201, headers: privateHeaders },
    );
  } catch (error) {
    return adminError(error);
  }
}
