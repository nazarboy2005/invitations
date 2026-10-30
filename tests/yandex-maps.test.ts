import assert from "node:assert/strict";
import test from "node:test";
import { createInvitation, invitationSchema } from "../packages/contracts/src/index";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import { hasVenuePoint, normalizeVenue, yandexMapUrl } from "../packages/contracts/src/maps";
import { readSuggestion, resolvePlace, resolveMapLink, signSuggestion, suggestPlaces, limitPlaceSearch } from "../apps/web/src/server/yandex-places";

const venue = { latitude: 41.328372, longitude: 69.224814, mapUrl: "https://yandex.uz/maps/?ll=1,2", placeUri: "ymapsbm1://org?oid=178096015422" };

test("maps and normalized saves share one Uzbek destination despite a conflicting old URL", () => {
  const map = new URL(yandexMapUrl(venue));
  assert.equal(map.searchParams.get("pt"), "69.224814,41.328372,pm2rdm");
  assert.equal(map.searchParams.get("lang"), "uz_UZ");
  assert.equal(map.pathname, "/maps/org/178096015422/");
  const invitation = createInvitation("cloud-castle"); invitation.venue = venue;
  const saved = normalizeInvitation(invitation);
  assert.equal(saved.venue.mapUrl, map.href);
  assert.equal(saved.venue.placeUri, venue.placeUri);
  assert.deepEqual(normalizeInvitation(saved), saved);
  assert.equal(invitation.venue.mapUrl, venue.mapUrl);
});

test("zero coordinates are real; incomplete/invalid points are cleared", () => {
  assert.equal(hasVenuePoint({ latitude: 0, longitude: 0 }), true);
  assert.equal(new URL(yandexMapUrl({ latitude: 0, longitude: 0, mapUrl: "" })).searchParams.get("pt"), "0,0,pm2rdm");
  const cleared = normalizeVenue({ ...venue, latitude: 100 });
  assert.equal(cleared.latitude, null); assert.equal(cleared.longitude, null); assert.equal(cleared.placeUri, undefined);
});

test("venue identity survives the shared contract and rejects unrelated URI schemes", () => {
  const invitation = createInvitation("cloud-castle"); invitation.venue = venue;
  assert.equal(invitationSchema.parse(invitation).venue.placeUri, venue.placeUri);
  assert.equal(invitationSchema.safeParse({ ...invitation, venue: { ...venue, placeUri: "https://attacker.example/" } }).success, false);
});

test("suggestions are scoped to Uzbekistan and retain the precise organization identity", async () => {
  const previous = process.env.YANDEX_GEOSUGGEST_API_KEY; process.env.YANDEX_GEOSUGGEST_API_KEY = "test-secret";
  try {
    const suggestions = await suggestPlaces("Versal", "uz-Latn", (async input => {
      const url = new URL(String(input));
      assert.equal(url.hostname, "suggest-maps.yandex.ru"); assert.equal(url.searchParams.get("countries"), "uz");
      assert.equal(url.searchParams.get("attrs"), "uri"); assert.equal(url.searchParams.get("lang"), "uz");
      return Response.json({ results: [{ title: { text: "Versal" }, address: { formatted_address: "Toshkent, Gulobod, 8A" }, uri: venue.placeUri }, { title: { text: "Unresolvable result" } }] });
    }) as typeof fetch);
    assert.equal(suggestions.length, 1); assert.equal(JSON.stringify(suggestions).includes("test-secret"), false);
    assert.equal(readSuggestion(suggestions[0].id).uri, venue.placeUri);
    assert.throws(() => readSuggestion(suggestions[0].id + "tampered"));
  } finally { if (previous === undefined) delete process.env.YANDEX_GEOSUGGEST_API_KEY; else process.env.YANDEX_GEOSUGGEST_API_KEY = previous; }
});

test("selection geocodes the signed URI, preserves the selected address, and checks country", async () => {
  const previous = process.env.YANDEX_GEOCODER_API_KEY; process.env.YANDEX_GEOCODER_API_KEY = "private-geocoder";
  const token = signSuggestion({ uri: venue.placeUri, name: "Versal", address: "Toshkent, Gulobod, 8A" });
  const result = (country: string, pos = "69.224814 41.328372") => Response.json({ response: { GeoObjectCollection: { featureMember: [{ GeoObject: { Point: { pos }, metaDataProperty: { GeocoderMetaData: { Address: { country_code: country } } } } }] } } });
  try {
    const selected = await resolvePlace(token, "en", (async input => {
      const url = new URL(String(input)); assert.equal(url.hostname, "geocode-maps.yandex.ru");
      assert.equal(url.searchParams.get("uri"), venue.placeUri); assert.equal(url.searchParams.has("geocode"), false);
      return result("UZ");
    }) as typeof fetch);
    assert.equal(selected.latitude, venue.latitude); assert.equal(selected.longitude, venue.longitude);
    assert.equal(selected.address, "Toshkent, Gulobod, 8A"); assert.equal(selected.placeUri, venue.placeUri);
    await assert.rejects(resolvePlace(token, "en", (async () => result("RU")) as typeof fetch), /aniq manzili/);
    await assert.rejects(resolvePlace(token, "en", (async () => result("UZ", "bad point")) as typeof fetch), /aniq manzili/);
    await assert.rejects(resolvePlace(token, "en", (async () => Response.json({})) as typeof fetch), /aniq manzili/);
  } finally { if (previous === undefined) delete process.env.YANDEX_GEOCODER_API_KEY; else process.env.YANDEX_GEOCODER_API_KEY = previous; }
});

test("provider failures expose no key or upstream URL", async () => {
  const previous = process.env.YANDEX_GEOSUGGEST_API_KEY; process.env.YANDEX_GEOSUGGEST_API_KEY = "private-key";
  try { await assert.rejects(suggestPlaces("Versal", "en", (async () => { throw new Error("https://provider/?apikey=private-key"); }) as typeof fetch), error => error instanceof Error && !error.message.includes("private-key") && error.message.includes("aloqa")); }
  finally { if (previous === undefined) delete process.env.YANDEX_GEOSUGGEST_API_KEY; else process.env.YANDEX_GEOSUGGEST_API_KEY = previous; }
});

test("public venue search accepts the actual same host and rejects cross-site use", () => {
  assert.doesNotThrow(() => limitPlaceSearch(new Request("http://localhost:3001/api/places", { headers: { host: "127.0.0.1:3001", origin: "http://127.0.0.1:3001", "x-real-ip": "test-same-host" } })));
  assert.throws(() => limitPlaceSearch(new Request("http://localhost:3001/api/places", { headers: { origin: "https://elsewhere.example", "sec-fetch-site": "cross-site" } })));
});

test("pasted organization and short share links resolve the exact identity and fetched name", async () => {
  const previous = process.env.YANDEX_GEOCODER_API_KEY; process.env.YANDEX_GEOCODER_API_KEY = "private-geocoder";
  const seen: string[] = [];
  const fetcher = (async (input, options) => {
    const url = new URL(String(input)); seen.push(url.hostname);
    if (url.pathname.includes("/-/")) {
      assert.equal(options?.redirect, "manual");
      return new Response(null, { status: 302, headers: { Location: "https://yandex.uz/maps/org/versal/178096015422/" } });
    }
    assert.equal(url.hostname, "geocode-maps.yandex.ru");
    assert.equal(url.searchParams.get("uri"), venue.placeUri);
    return Response.json({ response: { GeoObjectCollection: { featureMember: [{ GeoObject: {
      name: "Versal", Point: { pos: "69.224814 41.328372" },
      metaDataProperty: { GeocoderMetaData: { Address: { country_code: "UZ", formatted: "Toshkent, Gulobod, 8A" } } },
    } }] } } });
  }) as typeof fetch;
  try {
    for (const link of ["https://yandex.uz/maps/org/versal/178096015422/", "https://yandex.ru/maps/-/test-share"]) {
      const place = await resolveMapLink(link, "uz-Latn", fetcher);
      assert.equal(place.name, "Versal"); assert.equal(place.address, "Toshkent, Gulobod, 8A");
      assert.equal(place.placeUri, venue.placeUri); assert.equal(place.mapUrl, yandexMapUrl(venue));
    }
    assert.deepEqual(seen, ["geocode-maps.yandex.ru", "yandex.ru", "geocode-maps.yandex.ru"]);
  } finally { if (previous === undefined) delete process.env.YANDEX_GEOCODER_API_KEY; else process.env.YANDEX_GEOCODER_API_KEY = previous; }
});

test("picked points preserve the exact pin while resolving a name and address", async () => {
  const previous = process.env.YANDEX_GEOCODER_API_KEY; process.env.YANDEX_GEOCODER_API_KEY = "private-geocoder";
  try {
    const place = await resolveMapLink("https://yandex.uz/maps/?whatshere[point]=69.224814,41.328372&ll=1,2", "en", (async input => {
      const url = new URL(String(input)); assert.equal(url.searchParams.get("geocode"), "69.224814,41.328372");
      return Response.json({ response: { GeoObjectCollection: { featureMember: [{ GeoObject: { name: "Venue address", Point: { pos: "69.225 41.329" }, metaDataProperty: { GeocoderMetaData: { Address: { country_code: "UZ", formatted: "Venue address, Tashkent" } } } } }] } } });
    }) as typeof fetch);
    assert.equal(place.latitude, venue.latitude); assert.equal(place.longitude, venue.longitude);
    assert.equal(place.name, "Venue address"); assert.equal(place.placeUri, undefined);
  } finally { if (previous === undefined) delete process.env.YANDEX_GEOCODER_API_KEY; else process.env.YANDEX_GEOCODER_API_KEY = previous; }
});

test("link expansion rejects non-map URLs and every unsafe redirect before following it", async () => {
  let calls = 0;
  const fetcher = (async () => { calls++; return new Response(null, { status: 302, headers: { Location: "http://127.0.0.1/private" } }); }) as typeof fetch;
  for (const url of ["https://elsewhere.example/maps/org/1", "http://yandex.uz/maps/org/1", "https://yandex.uz:8443/maps/org/1", "https://user:pass@yandex.uz/maps/org/1", "https://yandex.uz/account", "not a url"]) await assert.rejects(resolveMapLink(url, "en", fetcher), /havolasini/);
  assert.equal(calls, 0);
  await assert.rejects(resolveMapLink("https://yandex.uz/maps/-/test", "en", fetcher), /havolasini/);
  assert.equal(calls, 1);
});
