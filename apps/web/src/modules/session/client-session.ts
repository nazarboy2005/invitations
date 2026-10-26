import type { SessionResponse } from "@taklifnoma/contracts";

const pending = new Map<string, Promise<SessionResponse>>();

/** Share only in-flight work; never cache roles or persist Telegram launch data. */
export function loadClientSession(initData = ""): Promise<SessionResponse> {
  const existing = pending.get(initData);
  if (existing) return existing;
  const request = resolveSession(initData).finally(() => {
    if (pending.get(initData) === request) pending.delete(initData);
  });
  pending.set(initData, request);
  return request;
}

async function readSession(): Promise<SessionResponse> {
  const response = await fetch("/api/auth/session", {
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error("Hisobingizni tekshirib bo‘lmadi. Qayta urinib ko‘ring.");
  return response.json();
}

async function resolveSession(initData: string): Promise<SessionResponse> {
  if (!initData) return readSession();
  // The server binds the signed launch to the session, including account switches.
  // Reusing an unrelated browser cookie here would select the wrong account.
  const exchange = await fetch("/api/auth/telegram/mini-app", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData }),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (exchange.status === 403) return { user: null, configured: true };
  // Another tab may already have exchanged this launch. Trust only its resulting
  // server session, never launch metadata or an unverified identity in the browser.
  if (exchange.ok || exchange.status === 409) {
    const verified = await readSession();
    if (verified.user) return verified;
  }
  throw new Error(
    "Telegram hisobingizni tekshirib bo‘lmadi. Mini App’ni qayta oching.",
  );
}

/** Opaque signed data only. User/role claims are never decoded or trusted here. */
export function telegramLaunchData(
  sdkData: string | undefined,
  hash: string,
): string {
  if (sdkData) return sdkData;
  const value =
    new URLSearchParams(hash.replace(/^#/, "")).get("tgWebAppData") ?? "";
  return value.length <= 16384 ? value : "";
}

export function currentTelegramLaunchData(): string {
  return telegramLaunchData(
    window.Telegram?.WebApp?.initData,
    window.location.hash,
  );
}

export function miniAppAdminDestination(
  pathname: string,
  search: string,
  user: SessionResponse["user"],
): "/admin" | null {
  if (pathname !== "/" && pathname !== "/dashboard") return null;
  if (new URLSearchParams(search).get("mode") === "personal") return null;
  return user?.isAdmin === true && user.phoneShared === true ? "/admin" : null;
}
