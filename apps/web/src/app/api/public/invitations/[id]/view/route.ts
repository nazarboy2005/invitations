import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { digest } from "@/server/auth/crypto";
import { verifySameOrigin } from "@/server/auth";
import { apiError } from "@/server/api";

export const runtime = "nodejs";
const VIEWER_COOKIE = "taklifnoma_viewer";
const VIEWER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  try {
    verifySameOrigin(request);
    const { id } = await params;
    z.uuid().parse(id);

    const match = request.headers
      .get("cookie")
      ?.match(
        new RegExp(`(?:^|;\\s*)${VIEWER_COOKIE}=([A-Za-z0-9_-]{32,96})(?:;|$)`),
      );
    const visitorToken = match?.[1] ?? randomBytes(32).toString("base64url");
    const visitorHash = digest(visitorToken);

    const rows = await getDb()`
      WITH eligible AS (
        SELECT id FROM invitations WHERE id=${id} AND status='published'
      ), counted_view AS (
        INSERT INTO invitation_viewers(invitation_id,visitor_hash,last_viewed_at)
        SELECT id,${visitorHash},now() FROM eligible
        ON CONFLICT(invitation_id,visitor_hash) DO UPDATE
          SET last_viewed_at=now()
          WHERE invitation_viewers.last_viewed_at <= now() - interval '24 hours'
        RETURNING invitation_id
      ), incremented AS (
        UPDATE invitations
        SET view_count=view_count+1
        WHERE id IN (SELECT invitation_id FROM counted_view) AND status='published'
        RETURNING view_count
      )
      SELECT EXISTS(SELECT 1 FROM eligible) AS exists,
        (SELECT view_count FROM incremented LIMIT 1) AS view_count
    `;

    const exists = Boolean(rows[0]?.exists);
    const response = new NextResponse(null, {
      status: exists ? 204 : 404,
      headers: { "Cache-Control": "private, no-store" },
    });
    if (!match && exists) {
      response.cookies.set(VIEWER_COOKIE, visitorToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: VIEWER_COOKIE_MAX_AGE,
      });
    }
    return response;
  } catch (error) {
    return apiError(error);
  }
}
