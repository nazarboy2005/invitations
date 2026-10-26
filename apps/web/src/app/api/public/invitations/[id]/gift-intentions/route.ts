import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { pulauSehatiDataSchema } from "@taklifnoma/contracts";
import { ApiError, apiError, readJson } from "@/server/api";
import { publicInvitation, resolveGuest, submissionLimit } from "@/server/public";
import { verifySameOrigin } from "@/server/auth";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  try {
    verifySameOrigin(request);
    const { id } = await params;
    const { invitation, id: invitationId } = await publicInvitation(id);
    const parsed = pulauSehatiDataSchema.safeParse(invitation.templateData["wedivo-pulau-sehati"] ?? {});
    const settings = parsed.success ? parsed.data.giftWell : null;
    if (invitation.templateId !== "wedivo-pulau-sehati" || !settings?.enabled)
      throw new ApiError(403, "GIFT_INTENTIONS_CLOSED", "Bu taklifnomada niyat yuborish yopiq.");
    const input = z.object({ name: z.string().trim().min(1).max(100), amount: z.number().int().min(1).max(1_000_000_000_000), message: z.string().max(1000).default(""), guestToken: z.string().max(128).optional() }).strict().parse(await readJson(request, 6000));
    await submissionLimit(request, invitationId, "gift-intention");
    const guest = await resolveGuest(invitationId, input.guestToken);
    await getDb()`INSERT INTO pulau_gift_intentions(invitation_id,guest_id,sender_name,amount,currency_label,message) VALUES(${invitationId},${guest?.id ?? null},${input.name},${input.amount},${settings.currencyLabel},${input.message})`;
    return NextResponse.json({ ok: true, message: "Sovg‘a niyatingiz egasiga yuborildi. Bu pul o‘tkazmasi emas." }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiError(error);
  }
}
