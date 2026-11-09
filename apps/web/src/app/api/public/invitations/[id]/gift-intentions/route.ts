import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { pulauSehatiDataSchema } from "@taklifnoma/contracts";
import { ApiError, apiError, readJson } from "@/server/api";
import { publicInvitation, resolveGuest, submissionLimit } from "@/server/public";
import { verifySameOrigin } from "@/server/auth";
import { verifyTurnstile } from "@/server/turnstile";
import { templateVisitorFeatures } from "@taklifnoma/contracts/capabilities";
import { enqueueGuestNotification } from "@/server/guest-notifications";
import { scheduleGuestNotification } from "@/server/schedule-guest-notification";

export const runtime = "nodejs";
export const maxDuration = 60;
type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  try {
    verifySameOrigin(request);
    const { id } = await params;
    const { invitation, id: invitationId } = await publicInvitation(id);
    const parsed = pulauSehatiDataSchema.safeParse(invitation.templateData["kongillar-oroli"] ?? {});
    const settings = parsed.success ? parsed.data.giftWell : null;
    if (!templateVisitorFeatures(invitation.templateId).giftIntentions || !settings?.enabled)
      throw new ApiError(403, "GIFT_INTENTIONS_CLOSED", "Bu taklifnomada niyat yuborish yopiq.");
    const input = z.object({ name: z.string().trim().min(1).max(100), amount: z.number().int().min(1).max(1_000_000_000_000), message: z.string().max(1000).default(""), guestToken: z.string().max(128).optional() }).strict().parse(await readJson(request, 6000));
    await submissionLimit(request, invitationId, "gift-intention");
    await verifyTurnstile(request, "guest_gift_intention");
    const guest = await resolveGuest(invitationId, input.guestToken);
    const jobId = await getDb().begin(async (tx) => {
      const [intention] = await tx`INSERT INTO pulau_gift_intentions(invitation_id,guest_id,sender_name,amount,currency_label,message) VALUES(${invitationId},${guest?.id ?? null},${input.name},${input.amount},${settings.currencyLabel},${input.message}) RETURNING id`;
      return enqueueGuestNotification(tx, { kind: "intention", invitationId, recordId: intention.id, name: input.name, amount: String(input.amount), currencyLabel: settings.currencyLabel, message: input.message }, `intention:${intention.id}`);
    });
    scheduleGuestNotification(jobId);
    return NextResponse.json({ ok: true, message: "Sovg‘a niyatingiz egasiga yuborildi. Bu pul o‘tkazmasi emas." }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiError(error);
  }
}

