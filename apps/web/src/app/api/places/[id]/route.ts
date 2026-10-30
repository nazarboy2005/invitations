import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, privateHeaders } from "@/server/api";
import { limitPlaceSearch, resolvePlace } from "@/server/yandex-places";

export const runtime = "nodejs";
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    limitPlaceSearch(request);
    const { id } = await context.params;
    const locale = z.enum(["uz-Latn", "uz-Cyrl", "en", "ru"]).parse(new URL(request.url).searchParams.get("locale") || "uz-Latn");
    return NextResponse.json(await resolvePlace(id, locale), { headers: privateHeaders });
  } catch (error) { return apiError(error); }
}
