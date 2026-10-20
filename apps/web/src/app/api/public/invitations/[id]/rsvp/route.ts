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
type Context = { params: Promise<{ id: string }> };
export const runtime = "nodejs";
export async function POST(request: Request, { params }: Context) {
  try {
    verifySameOrigin(request);
    const { id } = await params;
    const { invitation, id: invitationId } = await publicInvitation(id);
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: invitation.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    if (
      !invitation.rsvp.enabled ||
      (invitation.rsvp.deadline && invitation.rsvp.deadline < today)
    )
      throw new ApiError(403, "RSVP_CLOSED", "Javob yuborish muddati tugagan.");
    const input = z
      .object({
        name: z.string().trim().min(1).max(100),
        status: z.enum(["yes", "no", "maybe"]),
        partySize: z.number().int().min(0).max(100),
        guestToken: z.string().max(128).optional(),
      })
      .parse(await readJson(request, 5000));
    await submissionLimit(request, invitationId, "rsvp");
    const guest = await resolveGuest(invitationId, input.guestToken);
    const party = input.status === "yes" ? input.partySize : 0;
    const maximum = Math.min(
      invitation.rsvp.maxPartySize,
      Number(guest?.max_party_size ?? 100),
    );
    if (input.status === "yes" && (party < 1 || party > maximum))
      throw new ApiError(400, "PARTY_SIZE", "Mehmonlar sonini tekshiring.");
    await getDb().begin(async (tx) => {
      if (guest) {
        await tx`SELECT id FROM invitation_guests WHERE id=${guest.id} FOR UPDATE`;
        await tx`DELETE FROM rsvp_responses WHERE invitation_id=${invitationId} AND guest_id=${guest.id}`;
      }
      await tx`INSERT INTO rsvp_responses(invitation_id,guest_id,name,status,party_size) VALUES(${invitationId},${guest?.id ?? null},${input.name},${input.status},${party})`;
    });
    return NextResponse.json(
      { ok: true, message: "Javobingiz saqlandi. Rahmat!" },
      { status: 201 },
    );
  } catch (e) {
    return apiError(e);
  }
}
