import { ApiError } from "./api";

export type TurnstileAction =
  "guest_wish" | "guest_rsvp" | "guest_receipt" | "guest_gift_intention";

/** A header keeps verification ahead of multipart upload parsing. Never trust client validation. */
export async function verifyTurnstile(
  request: Request,
  action: TurnstileAction,
) {
  const token = request.headers.get("cf-turnstile-response");
  const secret = process.env.TURNSTILE_SECRET;
  const hostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((host) => host.trim())
      .filter(Boolean),
  );
  if (
    !secret ||
    !hostnames.size ||
    (process.env.NODE_ENV === "production" &&
      [...hostnames].some((host) =>
        ["localhost", "127.0.0.1", "::1", "[::1]"].includes(host),
      ))
  ) {
    throw new ApiError(
      503,
      "TURNSTILE_UNAVAILABLE",
      "Tekshiruv vaqtincha mavjud emas. Keyinroq qayta urining.",
    );
  }
  const forbidden = () =>
    new ApiError(
      403,
      "TURNSTILE_FAILED",
      "Xavfsizlik tekshiruvidan qayta o‘ting.",
    );
  if (!token || token.length > 2048) throw forbidden();
  let result: unknown;
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      },
    );
    if (!response.ok) throw forbidden();
    result = await response.json();
  } catch {
    throw forbidden();
  }
  const verified = result as {
    success?: unknown;
    action?: unknown;
    hostname?: unknown;
  } | null;
  if (
    verified?.success !== true ||
    verified.action !== action ||
    typeof verified.hostname !== "string" ||
    !hostnames.has(verified.hostname)
  )
    throw forbidden();
}
