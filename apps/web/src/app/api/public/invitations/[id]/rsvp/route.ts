import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { apiError, ApiError, readJson } from "@/server/api";
import {
  publicInvitation,
  resolveGuest,
  submissionLimit,
  publicVisitorIdentity,
  publicVisitorToken,
  newPublicVisitorToken,
  PUBLIC_VISITOR_COOKIE,
} from "@/server/public";
import { verifySameOrigin } from "@/server/auth";
import { randomUUID } from "node:crypto";
import { templateVisitorFeatures } from "@taklifnoma/contracts/capabilities";
import { enqueueGuestNotification } from "@/server/guest-notifications";
import { scheduleGuestNotification } from "@/server/schedule-guest-notification";
import { verifyTurnstile } from "@/server/turnstile";
type Context = { params: Promise<{ id: string }> };
export const runtime = "nodejs";
export const maxDuration = 60;
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
      templateVisitorFeatures(invitation.templateId).rsvp !== "form" ||
      !invitation.rsvp.enabled ||
      (invitation.rsvp.deadline && invitation.rsvp.deadline < today)
    )
      throw new ApiError(403, "RSVP_CLOSED", "Javob yuborish muddati tugagan.");
    await submissionLimit(request, invitationId, "rsvp");
    await verifyTurnstile(request, "guest_rsvp");
    const input = z
      .object({
        name: z.string().trim().min(1).max(100),
        status: z.enum(["yes", "no", "maybe"]),
        partySize: z.number().int().min(0).max(100),
        note: z.string().trim().max(1000).optional().default(""),
        guestToken: z.string().max(128).optional(),
      })
      .parse(await readJson(request, 5000));
    const guest = await resolveGuest(invitationId, input.guestToken);
    const previousToken = publicVisitorToken(request);
    const responseToken = previousToken ?? newPublicVisitorToken();
    const responseHash = publicVisitorIdentity(invitationId, guest, responseToken);
    const party = input.status === "yes" ? input.partySize : 0;
    const maximum = Math.min(
      invitation.rsvp.maxPartySize,
      Number(guest?.max_party_size ?? 100),
    );
    if (input.status === "yes" && (party < 1 || party > maximum))
      throw new ApiError(400, "PARTY_SIZE", "Mehmonlar sonini tekshiring.");
    const jobId = await getDb().begin(async (tx) => {
      if (guest) {
        await tx`SELECT id FROM invitation_guests WHERE id=${guest.id} FOR UPDATE`;
      }
      const [saved] = await tx`INSERT INTO rsvp_responses(invitation_id,guest_id,name,status,party_size,note,response_token_hash) VALUES(${invitationId},${guest?.id ?? null},${input.name},${input.status},${party},${input.note},${responseHash}) ON CONFLICT(response_token_hash) DO UPDATE SET name=EXCLUDED.name,status=EXCLUDED.status,party_size=EXCLUDED.party_size,note=EXCLUDED.note,created_at=now()
        WHERE (rsvp_responses.name,rsvp_responses.status,rsvp_responses.party_size,COALESCE(rsvp_responses.note,'')) IS DISTINCT FROM (EXCLUDED.name,EXCLUDED.status,EXCLUDED.party_size,EXCLUDED.note) RETURNING id`;
      if (!saved) return;
      return enqueueGuestNotification(tx, { kind: "response", invitationId, recordId: saved.id, name: input.name, status: input.status, note: input.note }, `response:${saved.id}:${randomUUID()}`);
    });
    scheduleGuestNotification(jobId);
    const response = NextResponse.json(
      { ok: true, message: "Javobingiz saqlandi. Rahmat!" },
      { status: 201 },
    );
    response.cookies.set(PUBLIC_VISITOR_COOKIE, responseToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: new URL(request.url).protocol === "https:",
      path: "/api/public/invitations",
      maxAge: 365 * 24 * 60 * 60,
    });
    return response;
  } catch (e) {
    return apiError(e);
  }
}
