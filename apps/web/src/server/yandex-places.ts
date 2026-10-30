import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { ApiError } from "./api";
import { yandexMapUrl } from "@taklifnoma/contracts/maps";

const tokenSecret = process.env.SESSION_SECRET || randomBytes(32).toString("hex");
const suggestionSchema = z.object({
  uri: z.string().max(2000).regex(/^ymapsbm1:\/\/(?:org|geo)\?/),
  name: z.string().min(1).max(300), address: z.string().max(1000), expires: z.number(),
});
type Suggestion = z.infer<typeof suggestionSchema>;
type Fetch = typeof fetch;
const usage = new Map<string, { count: number; until: number }>();

/** Public Studio search is available before sign-in, with bounded provider usage. */
export function limitPlaceSearch(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  let sameHost = false;
  try { sameHost = !!origin && new URL(origin).host === request.headers.get("host"); } catch { /* Reject malformed origins below. */ }
  if ((origin && origin !== requestOrigin && !sameHost) || request.headers.get("sec-fetch-site") === "cross-site")
    throw new ApiError(403, "FORBIDDEN", "Joy qidiruvini studiyadan oching.");
  const key = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now(), previous = usage.get(key);
  if (previous && previous.until > now && previous.count >= 45)
    throw new ApiError(429, "PLACES_RATE_LIMIT", "Joy qidiruvi limiti tugadi. Bir daqiqadan so‘ng urinib ko‘ring.");
  usage.set(key, previous && previous.until > now ? { ...previous, count: previous.count + 1 } : { count: 1, until: now + 60_000 });
  if (usage.size > 1000) for (const [id, item] of usage) if (item.until < now) usage.delete(id);
}

export function signSuggestion(value: Omit<Suggestion, "expires">): string {
  const body = Buffer.from(JSON.stringify({ ...value, expires: Date.now() + 10 * 60_000 })).toString("base64url");
  return `${body}.${createHmac("sha256", tokenSecret).update(body).digest("base64url")}`;
}

export function readSuggestion(token: string): Suggestion {
  if (token.length > 6000) throw new ApiError(400, "INVALID_PLACE", "Joyni ro‘yxatdan qayta tanlang.");
  const [body, signature, extra] = token.split(".");
  const expected = createHmac("sha256", tokenSecret).update(body || "").digest();
  const actual = Buffer.from(signature || "", "base64url");
  if (extra || actual.length !== expected.length || !timingSafeEqual(actual, expected))
    throw new ApiError(400, "INVALID_PLACE", "Joyni ro‘yxatdan qayta tanlang.");
  try {
    const value = suggestionSchema.parse(JSON.parse(Buffer.from(body, "base64url").toString()));
    if (value.expires < Date.now()) throw new Error("expired");
    return value;
  } catch { throw new ApiError(400, "INVALID_PLACE", "Joyni ro‘yxatdan qayta tanlang."); }
}

async function providerJson(url: URL, fetcher: Fetch) {
  let response: Response;
  try { response = await fetcher(url, { cache: "no-store", signal: AbortSignal.timeout(8000) }); }
  catch { throw new ApiError(502, "PLACES_UNAVAILABLE", "Yandex qidiruvi bilan aloqa uzildi. Qayta urinib ko‘ring."); }
  if (!response.ok) throw new ApiError(response.status === 429 ? 429 : 502, "PLACES_UNAVAILABLE", "Yandex joy qidiruvi vaqtincha ishlamayapti.");
  return response.json();
}

export async function suggestPlaces(query: string, locale: string, fetcher: Fetch = fetch) {
  const key = process.env.YANDEX_GEOSUGGEST_API_KEY;
  if (!key) throw new ApiError(503, "PLACES_UNCONFIGURED", "Yandex joy qidiruvi sozlanmagan.");
  const url = new URL("https://suggest-maps.yandex.ru/v1/suggest");
  url.search = new URLSearchParams({ apikey: key, text: query, countries: "uz", types: "biz,geo",
    print_address: "1", attrs: "uri", results: "7", highlight: "0", lang: locale === "ru" || locale === "uz-Cyrl" ? "ru" : locale === "en" ? "en" : "uz",
    ll: "64.6,41.3", spn: "18,10" }).toString();
  const data = await providerJson(url, fetcher) as { results?: Array<{ title?: { text?: string }; subtitle?: { text?: string }; address?: { formatted_address?: string }; uri?: string }> };
  return (data.results || []).flatMap(item => {
    if (!item.uri || !/^ymapsbm1:\/\/(?:org|geo)\?/.test(item.uri) || !item.title?.text) return [];
    const name = item.title.text.slice(0, 300), address = (item.address?.formatted_address || item.subtitle?.text || "").slice(0, 1000);
    return [{ id: signSuggestion({ uri: item.uri, name, address }), name, address }];
  });
}

async function geocodePlace(target: { uri: string } | { geocode: string }, locale: string, fetcher: Fetch) {
  const key = process.env.YANDEX_GEOCODER_API_KEY;
  if (!key) throw new ApiError(503, "PLACES_UNCONFIGURED", "Yandex manzil aniqlash xizmati sozlanmagan.");
  const url = new URL("https://geocode-maps.yandex.ru/v1/");
  url.search = new URLSearchParams({ apikey: key, ...target, format: "json", results: "1", lang: locale === "ru" || locale === "uz-Cyrl" ? "ru_RU" : "en_US" }).toString();
  const data = await providerJson(url, fetcher) as { response?: { GeoObjectCollection?: { featureMember?: Array<{ GeoObject?: { name?: string; uri?: string; description?: string; Point?: { pos?: string }; metaDataProperty?: { GeocoderMetaData?: { Address?: { country_code?: string; formatted?: string } } } } }> } } };
  const object = data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
  const [longitude, latitude] = (object?.Point?.pos || "").trim().split(/\s+/).map(Number);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180 || object?.metaDataProperty?.GeocoderMetaData?.Address?.country_code?.toUpperCase() !== "UZ")
    throw new ApiError(422, "PLACE_NOT_RESOLVED", "Bu joyning aniq manzili topilmadi. Boshqa natijani tanlang.");
  return { object, latitude, longitude };
}

export async function resolvePlace(token: string, locale: string, fetcher: Fetch = fetch) {
  const suggestion = readSuggestion(token);
  const { latitude, longitude } = await geocodePlace({ uri: suggestion.uri }, locale, fetcher);
  const venue = { latitude, longitude, mapUrl: "", placeUri: suggestion.uri };
  return { ...venue, id: suggestion.uri, name: suggestion.name, address: suggestion.address, mapUrl: yandexMapUrl(venue) };
}

function invalidLink(): never {
  throw new ApiError(422, "INVALID_MAP_LINK", "Yandex Maps’dagi joyning havolasini kiriting. «Ulashish» orqali nusxalashingiz mumkin.");
}

/** Only Yandex Maps pages are eligible for share-link expansion, including redirects. */
function mapLink(value: string) {
  let url: URL;
  try { url = new URL(value); } catch { return invalidLink(); }
  if (url.protocol !== "https:" || url.username || url.password || url.port ||
      !/^(?:(?:www\.)?yandex\.(?:uz|ru|com)|maps\.yandex\.(?:uz|ru|com))$/.test(url.hostname) ||
      (!url.hostname.startsWith("maps.") && !/^\/maps(?:\/|$)/.test(url.pathname))) invalidLink();
  return url;
}

export async function resolveMapLink(value: string, locale: string, fetcher: Fetch = fetch) {
  let url = mapLink(value.trim());
  for (let hop = 0; /\/maps\/-\//.test(url.pathname); hop++) {
    if (hop >= 4) invalidLink();
    let response: Response;
    try { response = await fetcher(url, { redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(8000) }); }
    catch { throw new ApiError(502, "PLACES_UNAVAILABLE", "Havola ochilmadi. Qayta urinib ko‘ring."); }
    const redirect = response.headers.get("location");
    await response.body?.cancel();
    if (response.status < 300 || response.status >= 400 || !redirect) invalidLink();
    url = mapLink(new URL(redirect, url).href);
  }
  const organization = url.pathname.match(/\/org\/(?:[^/]+\/)?(\d+)(?:\/|$)/)?.[1] || url.searchParams.get("oid");
  const suppliedUri = url.searchParams.get("uri");
  const uri = organization && /^\d+$/.test(organization) ? `ymapsbm1://org?oid=${organization}` :
    suppliedUri && /^ymapsbm1:\/\/(?:org|geo)\?/.test(suppliedUri) ? suppliedUri : undefined;
  const coordinates = url.searchParams.get("whatshere[point]") || url.searchParams.get("pt") || url.searchParams.get("ll");
  const [lng, lat] = (coordinates || "").split(",").map(Number);
  const validPoint = !!coordinates && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  if (!uri && !validPoint) invalidLink();
  const resolved = await geocodePlace(uri ? { uri } : { geocode: `${lng},${lat}` }, locale, fetcher);
  // A coordinate share link pins that exact point; reverse geocoding adds its
  // name/address without silently snapping the destination to another building.
  const venue = { latitude: uri ? resolved.latitude : lat, longitude: uri ? resolved.longitude : lng, mapUrl: "", ...(uri ? { placeUri: uri } : {}) };
  const address = resolved.object?.metaDataProperty?.GeocoderMetaData?.Address?.formatted || resolved.object?.description || "";
  return { ...venue, id: uri || `${lng},${lat}`, name: (resolved.object?.name || "").slice(0, 300), address: address.slice(0, 1000), mapUrl: yandexMapUrl(venue) };
}
