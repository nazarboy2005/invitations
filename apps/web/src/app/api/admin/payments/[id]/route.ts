import { z } from "zod";
import { updateAdminPayment } from "@/server/admin-management";
import { adminError, requireAdminMutation } from "@/server/admin";
import { privateHeaders, readJson } from "@/server/api";
import { paymentUpdateSchema } from "@/modules/admin/management-contract";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await requireAdminMutation(request);
    return Response.json(
      await updateAdminPayment(
        z.uuid().parse((await params).id),
        actor.id,
        paymentUpdateSchema.parse(await readJson(request, 5000)),
      ),
      { headers: privateHeaders },
    );
  } catch (error) {
    return adminError(error);
  }
}
