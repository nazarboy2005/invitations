import { z } from "zod";
import { manageAdminBroadcast } from "@/server/admin-broadcasts";
import { adminError, requireAdminMutation } from "@/server/admin";
import { privateHeaders, readJson } from "@/server/api";
import { broadcastActionSchema } from "@/modules/admin/management-contract";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await requireAdminMutation(request);
    return Response.json(
      await manageAdminBroadcast(
        z.uuid().parse((await params).id),
        actor.id,
        broadcastActionSchema.parse(await readJson(request, 1000)),
      ),
      { headers: privateHeaders },
    );
  } catch (error) {
    return adminError(error);
  }
}
