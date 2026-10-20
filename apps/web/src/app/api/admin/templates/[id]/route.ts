import { NextResponse } from "next/server";
import { z } from "zod";
import { templateIdSchema } from "@taklifnoma/contracts";
import { getDb } from "@taklifnoma/database";
import { authenticatedUser } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";
const inputSchema = z
  .object({
    published: z.boolean().optional(),
    priceMinor: z.number().int().min(0).max(1_000_000_000_000).optional(),
    replacementTemplateId: templateIdSchema.optional(),
    categoryIds: z
      .array(z.string().min(1).max(64))
      .max(100)
      .refine(
        (ids) => new Set(ids).size === ids.length,
        "Duplicate category IDs",
      )
      .optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.published !== undefined ||
      value.priceMinor !== undefined ||
      value.categoryIds !== undefined,
  );
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
    templateIdSchema.parse(id);
    const input = inputSchema.parse(await readJson(request, 5000));
    let replaced = 0;
    await getDb().begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(74920319)`;
      const [template] =
        await tx`SELECT * FROM templates WHERE id=${id} FOR UPDATE`;
      if (!template) throw new ApiError(404, "NOT_FOUND", "Dizayn topilmadi.");
      if (input.categoryIds !== undefined) {
        const categories = input.categoryIds.length
          ? await tx`SELECT id FROM template_categories WHERE id=ANY(${tx.array(input.categoryIds)}::text[]) FOR SHARE`
          : [];
        if (categories.length !== input.categoryIds.length)
          throw new ApiError(
            400,
            "UNKNOWN_CATEGORY",
            "Tanlangan turkum topilmadi. Ro‘yxatni yangilang.",
          );
        await tx`DELETE FROM template_category_assignments WHERE template_id=${id}`;
        if (input.categoryIds.length)
          await tx`INSERT INTO template_category_assignments ${tx(
            input.categoryIds.map((categoryId) => ({
              template_id: id,
              category_id: categoryId,
            })),
            "template_id",
            "category_id",
          )}`;
      }
      if (input.published === false) {
        const [usage] =
          await tx`SELECT count(*)::int AS count FROM invitations WHERE template_id=${id}`;
        if (usage.count > 0 && !input.replacementTemplateId)
          throw new ApiError(
            409,
            "REPLACEMENT_REQUIRED",
            "Bu dizayn ishlatilmoqda. O‘rniga boshqa dizaynni tanlang.",
          );
        if (input.replacementTemplateId) {
          if (input.replacementTemplateId === id)
            throw new ApiError(
              400,
              "INVALID_REPLACEMENT",
              "Boshqa dizaynni tanlang.",
            );
          const [target] =
            await tx`SELECT * FROM templates WHERE id=${input.replacementTemplateId} AND published=true FOR UPDATE`;
          if (!target)
            throw new ApiError(
              409,
              "REPLACEMENT_UNAVAILABLE",
              "O‘rinbosar dizayn nashr qilinmagan.",
            );
          const updated =
            await tx`WITH affected AS (SELECT id,data FROM invitations WHERE template_id=${id} FOR UPDATE), changed AS (UPDATE invitations i SET template_id=${target.id},data=i.data||jsonb_build_object('templateId',${target.id}::text,'revision',COALESCE((i.data->>'revision')::int,1)+1),updated_at=now() FROM affected a WHERE i.id=a.id RETURNING i.id,a.data AS previous_values,i.data AS new_values) INSERT INTO invitation_audit_log(invitation_id,actor_id,action,previous_values,new_values) SELECT id,${user.id},'admin_template_replacement',previous_values,new_values FROM changed RETURNING invitation_id`;
          replaced = updated.length;
        }
      }
      await tx`UPDATE templates SET published=${input.published ?? template.published},price_minor=${input.priceMinor ?? Number(template.price_minor)},replacement_template_id=${input.published === undefined ? template.replacement_template_id : input.published === false ? (input.replacementTemplateId ?? null) : null},updated_at=now() WHERE id=${id}`;
    });
    return NextResponse.json(
      { ok: true, replaced },
      { headers: privateHeaders },
    );
  } catch (e) {
    return apiError(e);
  }
}
