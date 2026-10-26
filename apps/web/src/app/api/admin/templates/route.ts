import { NextResponse } from "next/server";
import { getCatalog } from "@/server/catalog";
import { requireAdmin, adminError } from "@/server/admin";
import { ApiError, privateHeaders } from "@/server/api";
export async function GET() {
  try {
    await requireAdmin();
    const catalog = await getCatalog(true);
    if (!catalog.configured)
      throw new ApiError(
        503,
        "CATALOG_UNAVAILABLE",
        "Dizaynlar yuklanmadi. Qayta urinib ko‘ring.",
      );
    return NextResponse.json(catalog, {
      headers: privateHeaders,
    });
  } catch (e) {
    return adminError(e);
  }
}
