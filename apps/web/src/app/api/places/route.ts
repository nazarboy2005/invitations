import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth";
import { ApiError, apiError, privateHeaders } from "@/server/api";

export const runtime = "nodejs";

const querySchema = z.object({
  q: z.string().trim().min(3).max(120),
  locale: z.enum(["uz-Latn", "uz-Cyrl", "en", "ru"]).default("uz-Latn"),
  session: z.string().uuid(),
});
const languageCode = { "uz-Latn": "uz", "uz-Cyrl": "uz", en: "en", ru: "ru" } as const;
const usage = new Map<string, { count: number; until: number }>();

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const now = Date.now();
    const bucket = usage.get(user.id);
    if (bucket && bucket.until > now && bucket.count >= 30)
      throw new ApiError(429, "PLACES_RATE_LIMIT", "Joy qidiruvi limiti tugadi. Birozdan so‘ng urinib ko‘ring.");
    usage.set(user.id, bucket && bucket.until > now ? { ...bucket, count: bucket.count + 1 } : { count: 1, until: now + 60_000 });
    if (usage.size > 1000) for (const [id, value] of usage) if (value.until < now) usage.delete(id);
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) throw new ApiError(503, "PLACES_UNCONFIGURED", "Google Places kaliti sozlanmagan.");
    const url = new URL(request.url);
    const input = querySchema.parse({
      q: url.searchParams.get("q"),
      locale: url.searchParams.get("locale") || undefined,
      session: url.searchParams.get("session"),
    });
    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key },
      body: JSON.stringify({
        input: input.q,
        languageCode: languageCode[input.locale],
        regionCode: "UZ",
        sessionToken: input.session,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new ApiError(502, "PLACES_UNAVAILABLE", "Joy qidiruvi vaqtincha ishlamayapti.");
    const data = await response.json() as {
      suggestions?: Array<{ placePrediction?: { placeId?: string; text?: { text?: string }; structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } } } }>;
    };
    return NextResponse.json({
      places: (data.suggestions || []).flatMap(({ placePrediction: place }) =>
        place?.placeId ? [{ id: place.placeId, name: place.structuredFormat?.mainText?.text || place.text?.text || "", address: place.structuredFormat?.secondaryText?.text || "" }] : []),
    }, { headers: privateHeaders });
  } catch (error) {
    return apiError(error);
  }
}
