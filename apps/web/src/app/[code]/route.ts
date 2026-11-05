import { getDb } from "@taklifnoma/database";

export const runtime = "nodejs";

async function redirectLocationCode(code: string) {
  if (!/^[0-9A-Za-z]{8}$/.test(code))
    return new Response("Not found", { status: 404 });

  const rows = await getDb()`
    SELECT target_url FROM static_location_short_links WHERE code=${code}
  `;
  const target = rows[0]?.target_url;
  if (typeof target !== "string") return new Response("Not found", { status: 404 });

  // Revalidate stored data before redirecting, even though entries are created
  // only by the Yandex destination validator.
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    !/^(?:www\.)?yandex\.(?:uz|ru|com)$/.test(url.hostname) ||
    !(url.pathname === "/maps" || url.pathname.startsWith("/maps/"))
  )
    return new Response("Not found", { status: 404 });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.href,
      "Cache-Control": "public, max-age=86400, immutable",
      "X-Robots-Tag": "noindex",
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  return redirectLocationCode(code);
}

export async function HEAD(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const response = await redirectLocationCode(code);
  return new Response(null, { status: response.status, headers: response.headers });
}
