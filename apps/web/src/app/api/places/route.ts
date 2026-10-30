import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, privateHeaders } from "@/server/api";
import { limitPlaceSearch, suggestPlaces } from "@/server/yandex-places";

export const runtime = "nodejs";
const querySchema = z.object({ q: z.string().trim().min(2).max(120), locale: z.enum(["uz-Latn", "uz-Cyrl", "en", "ru"]).default("uz-Latn") });
export async function GET(request: Request) {
  try {
    limitPlaceSearch(request);
    const url = new URL(request.url);
    const input = querySchema.parse({ q: url.searchParams.get("q"), locale: url.searchParams.get("locale") || undefined });
    return NextResponse.json({ places: await suggestPlaces(input.q, input.locale) }, { headers: privateHeaders });
  } catch (error) { return apiError(error); }
}
