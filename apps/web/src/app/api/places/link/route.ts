import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, privateHeaders, readJson } from "@/server/api";
import { limitPlaceSearch, resolveMapLink } from "@/server/yandex-places";

export const runtime = "nodejs";
const inputSchema = z.object({ url: z.string().trim().min(1).max(4000), locale: z.enum(["uz-Latn", "uz-Cyrl", "en", "ru"]).default("uz-Latn") });
export async function POST(request: Request) {
  try {
    limitPlaceSearch(request);
    const input = inputSchema.parse(await readJson(request, 8000));
    return NextResponse.json(await resolveMapLink(input.url, input.locale), { headers: privateHeaders });
  } catch (error) { return apiError(error); }
}
