import { z } from "zod";
import { processAdminBroadcasts } from "@/server/jobs/admin-broadcast";
import { adminError, requireAdminMutation } from "@/server/admin";
import { privateHeaders } from "@/server/api";
export const maxDuration = 60;
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminMutation(request);
    const broadcastId = z.uuid().parse((await params).id);
    return Response.json(await processAdminBroadcasts({ broadcastId }), {
      headers: privateHeaders,
    });
  } catch (error) {
    return adminError(error);
  }
}
