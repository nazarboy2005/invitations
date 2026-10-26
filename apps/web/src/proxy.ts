import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

// Headers only. Each server page and API handler enforces authorization.
export function proxy(request: NextRequest) {
  const nonce = randomBytes(32).toString("base64");
  const dev = process.env.NODE_ENV === "development";
  const account = process.env.R2_ACCOUNT_ID ?? "";
  const bucket = process.env.R2_BUCKET_NAME ?? "";
  const storageOrigin = /^[a-z0-9]+$/i.test(account)
    ? [
        `https://${account}.r2.cloudflarestorage.com`,
        ...(/^[a-z0-9][a-z0-9.-]*$/i.test(bucket)
          ? [`https://${bucket}.${account}.r2.cloudflarestorage.com`]
          : []),
      ].join(" ")
    : "";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'", // Existing form components use style attributes.
    `img-src 'self' data: blob: ${storageOrigin}`,
    "frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com",
    "font-src 'self'",
    `media-src 'self' blob: ${storageOrigin}`,
    `connect-src 'self' ${storageOrigin}${dev ? " ws://127.0.0.1:* ws://localhost:*" : ""}`,
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(!dev ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  const headers = new Headers(request.headers);
  headers.set("Content-Security-Policy", csp);
  headers.set("x-nonce", nonce);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );
  return response;
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
