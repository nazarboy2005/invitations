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
  verifiedSubmissionLimit,
} from "@/server/public";
import { verifySameOrigin } from "@/server/auth";
import { enqueueGuestNotification } from "@/server/guest-notifications";
import { scheduleGuestNotification } from "@/server/schedule-guest-notification";
import { verifyTurnstile } from "@/server/turnstile";
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
      await getDb()`SELECT id,name,message,created_at AS "submittedAt" FROM wishes WHERE invitation_id=${invitationId} AND status='approved' AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 6`;
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
    await submissionLimit(request, invitationId, "wish");
    await verifyTurnstile(request, "guest_wish");
    await verifiedSubmissionLimit(request, invitationId, "wish");
    const input = z
      .object({
        name: z.string().trim().min(1).max(100),
        message: z.string().trim().min(1).max(2000),
        guestToken: z.string().max(128).optional(),
      })
      .parse(await readJson(request, 12000));
    const guest = await resolveGuest(invitationId, input.guestToken);
    const previousToken = publicVisitorToken(request);
    const visitorToken = previousToken ?? newPublicVisitorToken();
    const visitorHash = publicVisitorIdentity(invitationId, guest, visitorToken);
    const result = await getDb().begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtextextended(${visitorHash}, 0))`;
      const [existing] = await tx`SELECT count(*)::int AS count FROM wishes
        WHERE invitation_id=${invitationId}
          AND (visitor_token_hash=${visitorHash} OR (${guest?.id ?? null}::uuid IS NOT NULL AND guest_id=${guest?.id ?? null}::uuid))`;
      if (Number(existing?.count ?? 0) >= 2)
        throw new ApiError(429, "WISH_LIMIT_REACHED", "Har bir mehmon ko‘pi bilan ikki marta tilak yuborishi mumkin.");
      const [wish] =
        await tx`INSERT INTO wishes(invitation_id,guest_id,visitor_token_hash,name,message,status) VALUES(${invitationId},${guest?.id ?? null},${visitorHash},${input.name},${input.message},'pending') RETURNING id`;
      const jobId = await enqueueGuestNotification(tx, { kind: "wish", invitationId, recordId: wish.id, name: input.name, message: input.message }, `wish:${wish.id}`);
      return { jobId, wishCount: Number(existing.count) + 1 };
    });
    scheduleGuestNotification(result.jobId);
    const response = NextResponse.json(
      {
        ok: true,
        wishCount: result.wishCount,
        message:
          "Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko‘rinadi.",
      },
      { status: 201 },
    );
    response.cookies.set(PUBLIC_VISITOR_COOKIE, visitorToken, {
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
