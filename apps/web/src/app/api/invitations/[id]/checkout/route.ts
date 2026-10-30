import { z } from "zod";
import { authenticatedUser } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { apiError, privateHeaders, readJson } from "@/server/api";
import { createCheckout } from "@/server/payments";
import { after } from "next/server";
import { processPaymentNotifications } from "@/server/payment-notifications";
import { preparePublishedCover } from "@/server/published-cover";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    const input = z
      .object({
        revision: z.number().int().positive(),
        expectedAmountMinor: z.number().int().min(1).max(1_000_000_000_000),
      })
      .strict()
      .parse(await readJson(request, 1000));
    const order = await createCheckout(
      id,
      input.revision,
      input.expectedAmountMinor,
      user,
    );
    after(async () => {
      await Promise.allSettled([
        processPaymentNotifications({ orderId: order.id, limit: 2 }),
        preparePublishedCover({ orderId: order.id }),
      ]);
    });
    return Response.json({ order }, { headers: privateHeaders });
  } catch (error) {
    return apiError(error);
  }
}
