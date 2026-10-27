import { NextResponse } from "next/server";
import { getCatalog } from "@/server/catalog";
import { apiError } from "@/server/api";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return NextResponse.json(
      {
        ...(await getCatalog()),
        publishingMode: process.env.PUBLISHING_MODE ?? "free",
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (e) {
    return apiError(e);
  }
}
