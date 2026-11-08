import { NextResponse } from "next/server";
import { getDb } from "@taklifnoma/database";
import { apiError } from "@/server/api";
import {
  newPublicVisitorToken,
  publicInvitation,
  publicVisitorIdentity,
  publicVisitorToken,
  resolveGuest,
  PUBLIC_VISITOR_COOKIE,
} from "@/server/public";

type Context = { params: Promise<{ id: string }> };
export const runtime = "nodejs";

export async function GET(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const { invitation, id: invitationId } = await publicInvitation(id);
    const guestToken = new URL(request.url).searchParams.get("guestToken") ?? undefined;
    const guest = await resolveGuest(invitationId, guestToken);
    const token = publicVisitorToken(request) ?? newPublicVisitorToken();
    const visitorHash = publicVisitorIdentity(invitationId, guest, token);
    const [response] = await getDb()`SELECT name,status,party_size AS "partySize",note
      FROM rsvp_responses
      WHERE invitation_id=${invitationId}
        AND (${guest?.id ?? null}::uuid IS NOT NULL AND guest_id=${guest?.id ?? null}::uuid
          OR response_token_hash=${visitorHash})
      ORDER BY created_at DESC LIMIT 1`;
    const [wishCountRow] = await getDb()`SELECT count(*)::int AS count FROM wishes
      WHERE invitation_id=${invitationId}
        AND (visitor_token_hash=${visitorHash}
          OR (${guest?.id ?? null}::uuid IS NOT NULL AND guest_id=${guest?.id ?? null}::uuid))`;
    const result = NextResponse.json(
      {
        response: response ?? null,
        wishCount: Number(wishCountRow?.count ?? 0),
        wishLimit: 2,
        canSubmitWish: Number(wishCountRow?.count ?? 0) < 2,
        wishesEnabled: invitation.wishes.enabled,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
    result.cookies.set(PUBLIC_VISITOR_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: new URL(request.url).protocol === "https:",
      path: "/api/public/invitations",
      maxAge: 365 * 24 * 60 * 60,
    });
    return result;
  } catch (error) {
    return apiError(error);
  }
}
