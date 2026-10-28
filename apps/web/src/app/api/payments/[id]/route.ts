import { z } from "zod";
import { authenticatedUser } from "@/server/invitations";
import { apiError, privateHeaders } from "@/server/api";
import { getInvitationPayment, getPaymentOrder } from "@/server/payments";

export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    const order = await getPaymentOrder(id, user.id);
    return Response.json(
      await getInvitationPayment(order.invitationId, user.id, order),
      { headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
