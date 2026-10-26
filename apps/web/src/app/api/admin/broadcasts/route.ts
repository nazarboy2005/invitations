import {
  createAdminBroadcast,
  listAdminBroadcasts,
} from "@/server/admin-broadcasts";
import { adminError, requireAdminMutation } from "@/server/admin";
import { privateHeaders, readJson } from "@/server/api";
import { broadcastCreateSchema } from "@/modules/admin/management-contract";
export async function GET() {
  try {
    return Response.json(
      { items: await listAdminBroadcasts() },
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
      await createAdminBroadcast(
        actor.id,
        broadcastCreateSchema.parse(await readJson(request, 32000)),
      ),
      { status: 201, headers: privateHeaders },
    );
  } catch (error) {
    return adminError(error);
  }
}
