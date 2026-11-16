import { NextResponse } from "next/server";
import { requireAdmin, adminError } from "@/server/admin";
import { privateHeaders } from "@/server/api";
import { serviceSlugAvailability } from "@/server/admin-services";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const query = new URL(request.url).searchParams;
    const result = await serviceSlugAvailability(
      query.get("slug") ?? "",
      query.get("current") ?? undefined,
    );
    return NextResponse.json(result, { headers: privateHeaders });
  } catch (e) {
    return adminError(e);
  }
}
