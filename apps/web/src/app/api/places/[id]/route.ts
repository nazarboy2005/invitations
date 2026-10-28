import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { ApiError, apiError, privateHeaders } from "@/server/api";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireUser();
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) throw new ApiError(503, "PLACES_UNCONFIGURED", "Google Places kaliti sozlanmagan.");
    const { id } = await context.params;
    if (!/^[\w-]{5,200}$/.test(id)) throw new ApiError(400, "INVALID_PLACE", "Joy identifikatori noto‘g‘ri.");
    const url = new URL(request.url);
    const session = url.searchParams.get("session") || "";
    if (!/^[0-9a-f-]{36}$/i.test(session)) throw new ApiError(400, "INVALID_SESSION", "Qidiruv sessiyasi noto‘g‘ri.");
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}?sessionToken=${encodeURIComponent(session)}`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "id,displayName,formattedAddress,location" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new ApiError(502, "PLACES_UNAVAILABLE", "Joy ma’lumotlari vaqtincha olinmadi.");
    const place = await response.json() as { id?: string; displayName?: { text?: string }; formattedAddress?: string; location?: { latitude?: number; longitude?: number } };
    if (!place.id) throw new ApiError(502, "INVALID_PLACE", "Joy ma’lumotlari to‘liq emas.");
    return NextResponse.json({
      id: place.id,
      name: place.displayName?.text || "",
      address: place.formattedAddress || "",
      latitude: place.location?.latitude ?? null,
      longitude: place.location?.longitude ?? null,
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.displayName?.text || place.formattedAddress || place.id)}&query_place_id=${encodeURIComponent(place.id)}`,
    }, { headers: privateHeaders });
  } catch (error) {
    return apiError(error);
  }
}
