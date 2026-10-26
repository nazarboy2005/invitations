import { z } from "zod";
import { getAdminUser, manageUser } from "@/server/admin-management";
import { adminError, requireAdminMutation } from "@/server/admin";
import { privateHeaders, readJson } from "@/server/api";
import { userActionSchema } from "@/modules/admin/management-contract";
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, { params }: Context) {
  try {
    return Response.json(await getAdminUser((await params).id), {
      headers: privateHeaders,
    });
  } catch (error) {
    return adminError(error);
  }
}
export async function PATCH(request: Request, { params }: Context) {
  try {
    const actor = await requireAdminMutation(request);
    const id = z.uuid().parse((await params).id);
    return Response.json(
      await manageUser(
        id,
        actor.id,
        userActionSchema.parse(await readJson(request, 5000)),
      ),
      { headers: privateHeaders },
    );
  } catch (error) {
    return adminError(error);
  }
}
