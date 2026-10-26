import {
  createAdminPayment,
  listAdminPayments,
} from "@/server/admin-management";
import { adminError, requireAdminMutation } from "@/server/admin";
import { privateHeaders, readJson } from "@/server/api";
import { paymentCreateSchema } from "@/modules/admin/management-contract";
export async function GET(request: Request) {
  try {
    return Response.json(
      await listAdminPayments(
        Object.fromEntries(new URL(request.url).searchParams),
      ),
      { headers: privateHeaders },
    );
  } catch (error) {
    return adminError(error);
  }
}
export async function POST(request: Request) {
  try {
    const actor = await requireAdminMutation(request);
    return Response.json(
      await createAdminPayment(
        actor.id,
        paymentCreateSchema.parse(await readJson(request, 5000)),
      ),
      { status: 201, headers: privateHeaders },
    );
  } catch (error) {
    return adminError(error);
  }
}
