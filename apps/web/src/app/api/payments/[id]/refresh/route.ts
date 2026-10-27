import { z } from "zod";
import { authenticatedUser } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { apiError, privateHeaders } from "@/server/api";
import { getPaymentOrder, refreshPayment } from "@/server/payments";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    await getPaymentOrder(id, user.id);
    await refreshPayment(id, user.id);
    return Response.json(
      { order: await getPaymentOrder(id, user.id) },
      { headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
