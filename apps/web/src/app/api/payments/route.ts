import { authenticatedUser } from "@/server/invitations";
import { apiError, privateHeaders } from "@/server/api";
import { listPaymentOrders } from "@/server/payments";
export const runtime = "nodejs";
export async function GET() {
  try {
    const user = await authenticatedUser();
    return Response.json(
      { orders: await listPaymentOrders(user.id) },
      { headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
