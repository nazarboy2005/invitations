import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { authenticatedUser, getOwnedInvitation } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  try {
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    if (!(await getOwnedInvitation(id, user.id)))
      throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
    const page = z.coerce
      .number()
      .int()
      .min(0)
      .max(100000)
      .parse(new URL(request.url).searchParams.get("page") ?? 0);
    const offset = page * 50;
    const [responses, wishes, receipts, [totals]] = await Promise.all([
      getDb()`SELECT id,name,status,party_size AS "partySize",created_at AS "createdAt" FROM rsvp_responses WHERE invitation_id=${id} ORDER BY created_at DESC,id DESC LIMIT 51 OFFSET ${offset}`,
      getDb()`SELECT id,name,message,status,created_at AS "createdAt" FROM wishes WHERE invitation_id=${id} AND deleted_at IS NULL ORDER BY created_at DESC,id DESC LIMIT 51 OFFSET ${offset}`,
      getDb()`SELECT r.id,r.giver_names AS "giverNames",r.status,r.created_at AS "createdAt",r.destination->>'cardHolder' AS "cardHolder",right(regexp_replace(r.destination->>'cardNumber','[^0-9]','','g'),4) AS "cardLast4",a.url,a.filename FROM gift_receipts r JOIN media_assets a ON a.id=r.asset_id WHERE r.invitation_id=${id} ORDER BY r.created_at DESC,r.id DESC LIMIT 51 OFFSET ${offset}`,
      getDb()`SELECT (SELECT count(*)::int FROM rsvp_responses WHERE invitation_id=${id}) AS responses,(SELECT coalesce(sum(party_size),0)::int FROM rsvp_responses WHERE invitation_id=${id} AND status='yes') AS guests,(SELECT count(*)::int FROM wishes WHERE invitation_id=${id} AND status='pending' AND deleted_at IS NULL) AS pending`,
    ]);
    return Response.json(
      {
        responses: responses.slice(0, 50),
        wishes: wishes.slice(0, 50),
        receipts: receipts.slice(0, 50),
        totals,
        hasMore:
          responses.length > 50 || wishes.length > 50 || receipts.length > 50,
      },
      { headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
export async function PATCH(request: Request, { params }: Context) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    const input = z
      .union([
        z
          .object({ wishId: z.uuid(), status: z.enum(["approved", "hidden"]) })
          .strict(),
        z
          .object({
            receiptId: z.uuid(),
            status: z.enum(["received", "issue"]),
          })
          .strict(),
      ])
      .parse(await readJson(request, 1000));
    if ("receiptId" in input) {
      const rows =
        await getDb()`UPDATE gift_receipts SET status=${input.status},reviewed_at=now(),reviewed_by=${user.id} WHERE id=${input.receiptId} AND invitation_id=${id} AND EXISTS(SELECT 1 FROM invitations WHERE id=${id} AND owner_id=${user.id}) RETURNING id`;
      if (!rows.length) throw new ApiError(404, "NOT_FOUND", "Chek topilmadi.");
      return Response.json({ ok: true }, { headers: privateHeaders });
    }
    const rows =
      await getDb()`UPDATE wishes SET status=${input.status},moderated_at=now(),moderated_by=${user.id} WHERE id=${input.wishId} AND invitation_id=${id} AND deleted_at IS NULL AND EXISTS(SELECT 1 FROM invitations WHERE id=${id} AND owner_id=${user.id}) RETURNING id`;
    if (!rows.length) throw new ApiError(404, "NOT_FOUND", "Tilak topilmadi.");
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch (error) {
    return apiError(error);
  }
}
