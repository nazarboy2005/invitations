import { NextResponse } from "next/server";
import { getCatalog } from "@/server/catalog";
import { authenticatedUser } from "@/server/invitations";
import { ApiError, apiError, privateHeaders } from "@/server/api";
export async function GET() {
  try {
    const user = await authenticatedUser();
    if (!user.isAdmin)
      throw new ApiError(403, "FORBIDDEN", "Administrator huquqi kerak.");
    return NextResponse.json(await getCatalog(true), {
      headers: privateHeaders,
    });
  } catch (e) {
    return apiError(e);
  }
}
