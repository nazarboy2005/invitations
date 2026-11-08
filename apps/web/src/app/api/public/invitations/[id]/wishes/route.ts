import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { apiError, ApiError, readJson } from "@/server/api";
import {
  publicInvitation,
  resolveGuest,
  submissionLimit,
} from "@/server/public";
import { verifySameOrigin } from "@/server/auth";
import { enqueueGuestNotification } from "@/server/guest-notifications";
import { scheduleGuestNotification } from "@/server/schedule-guest-notification";
type Context = { params: Promise<{ id: string }> };
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const { invitation, id: invitationId } = await publicInvitation(id);
    if (!invitation.wishes.enabled)
      return NextResponse.json(
        { wishes: [] },
        { headers: { "Cache-Control": "no-store" } },
      );
    const rows =
      await getDb()`SELECT id,name,message,created_at AS "submittedAt" FROM wishes WHERE invitation_id=${invitationId} AND status='approved' AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 100`;
    return NextResponse.json(
      { wishes: rows },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request: Request, { params }: Context) {
  try {
    verifySameOrigin(request);
    const { id } = await params;
    const { invitation, id: invitationId } = await publicInvitation(id);
    if (!invitation.wishes.enabled)
      throw new ApiError(403, "WISHES_CLOSED", "Tilak yuborish yopilgan.");
    const input = z
      .object({
        name: z.string().trim().min(1).max(100),
        message: z.string().trim().min(1).max(2000),
        guestToken: z.string().max(128).optional(),
      })
      .parse(await readJson(request, 12000));
    await submissionLimit(request, invitationId, "wish");
    const guest = await resolveGuest(invitationId, input.guestToken);
    const jobId = await getDb().begin(async (tx) => {
      const [wish] =
        await tx`INSERT INTO wishes(invitation_id,guest_id,name,message,status) VALUES(${invitationId},${guest?.id ?? null},${input.name},${input.message},'pending') RETURNING id`;
      return enqueueGuestNotification(tx, { kind: "wish", invitationId, recordId: wish.id, name: input.name, message: input.message }, `wish:${wish.id}`);
    });
    scheduleGuestNotification(jobId);
    return NextResponse.json(
      {
        ok: true,
        message:
          "Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko‘rinadi.",
      },
      { status: 201 },
    );
  } catch (e) {
    return apiError(e);
  }
}
