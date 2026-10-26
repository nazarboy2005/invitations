import { listAdminInvitations } from "@/server/admin-management";
import { adminError } from "@/server/admin";
import { privateHeaders } from "@/server/api";
export async function GET(request: Request) {
  try {
    return Response.json(
      await listAdminInvitations(
        Object.fromEntries(new URL(request.url).searchParams),
      ),
      { headers: privateHeaders },
    );
  } catch (error) {
    return adminError(error);
  }
}
