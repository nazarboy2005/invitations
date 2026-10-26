import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { getDb } from "@taklifnoma/database";
import type { SessionUser } from "@taklifnoma/contracts";
import { digest, randomToken } from "./crypto";
import { hasAdminRole } from "./admin-role";

export const SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-taklifnoma_session"
    : "taklifnoma_session";
export const BROWSER_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-taklifnoma_auth_browser"
    : "taklifnoma_auth_browser";
const DAY = 86400000;
export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function missingAuthConfig() {
  const missing = [
    "DATABASE_URL",
    "APP_URL",
    "SESSION_SECRET",
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_BOT_USERNAME",
    "TELEGRAM_WEBHOOK_SECRET",
  ].filter((key) => !process.env[key]);
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32)
    missing.push("SESSION_SECRET (minimum 32 characters)");
  if (process.env.APP_URL) {
    try {
      if (
        process.env.NODE_ENV === "production" &&
        new URL(process.env.APP_URL).protocol !== "https:"
      )
        missing.push("APP_URL (HTTPS required in production)");
    } catch {
      missing.push("APP_URL (valid absolute URL required)");
    }
  }
  return missing;
}
export function requireConfigured() {
  const missing = missingAuthConfig();
  if (missing.length)
    throw new AuthError(
      "NOT_CONFIGURED",
      "Authentication is not configured",
      503,
    );
}
export function verifySameOrigin(request: Request) {
  const expected = process.env.APP_URL;
  if (!expected)
    throw new AuthError("NOT_CONFIGURED", "APP_URL is not configured", 503);
  if (request.headers.get("origin") !== new URL(expected).origin)
    throw new AuthError("INVALID_ORIGIN", "Request origin is not allowed", 403);
}
export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});
export function toSessionUser(row: Record<string, unknown>): SessionUser {
  return {
    id: String(row.id),
    telegramUserId: String(row.telegram_user_id),
    displayName: String(row.display_name),
    phoneShared: !!row.phone_shared_at,
    isAdmin: hasAdminRole(row),
  };
}
export async function currentSession() {
  requireConfigured();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const rows =
    await getDb()`SELECT s.id AS session_id, s.created_at AS authenticated_at, s.expires_at, s.absolute_expires_at, u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=${digest(token)} AND s.revoked_at IS NULL AND s.expires_at>now() AND s.absolute_expires_at>now() AND u.phone_shared_at IS NOT NULL AND u.disabled_at IS NULL`;
  return rows[0] ?? null;
}
export async function getSessionUser(): Promise<SessionUser | null> {
  const row = await currentSession();
  return row ? toSessionUser(row) : null;
}
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new AuthError("UNAUTHORIZED", "Sign in with Telegram", 401);
  return user;
}
export async function issueSession(userId: string) {
  const token = randomToken();
  const agent = (await headers()).get("user-agent")?.slice(0, 500) ?? "";
  await getDb().begin(async (tx) => {
    const [user] =
      await tx`SELECT id FROM users WHERE id=${userId} AND disabled_at IS NULL AND phone_shared_at IS NOT NULL FOR SHARE`;
    if (!user)
      throw new AuthError(
        "ACCOUNT_UNAVAILABLE",
        "Hisobga kirish cheklangan.",
        403,
      );
    await tx`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${userId},${digest(token)},${agent},${new Date(Date.now() + 30 * DAY)},${new Date(Date.now() + 90 * DAY)})`;
  });
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(30 * 86400));
}
export async function browserHash() {
  const token = (await cookies()).get(BROWSER_COOKIE)?.value;
  if (!token || token.length > 100)
    throw new AuthError("INVALID_BROWSER", "Restart Telegram sign in", 403);
  return digest(token);
}
export async function readJson(
  request: Request,
): Promise<Record<string, unknown>> {
  const limit = 20000;
  if (Number(request.headers.get("content-length")) > limit)
    throw new AuthError("INVALID_INPUT", "Request too large", 413);
  if (!request.body) throw new AuthError("INVALID_INPUT", "Invalid JSON body");
  const reader = request.body.getReader(),
    chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        throw new AuthError("INVALID_INPUT", "Request too large", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const raw = Buffer.concat(chunks, bytes).toString("utf8");
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error();
    return value as Record<string, unknown>;
  } catch {
    throw new AuthError("INVALID_INPUT", "Invalid JSON body");
  }
}
export function uuid(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  )
    throw new AuthError("INVALID_INPUT", "Invalid request identifier");
  return value;
}
export async function authRoute(action: () => Promise<Response>) {
  try {
    return await action();
  } catch (error) {
    const known = error instanceof AuthError;
    if (!known)
      console.error(
        "Authentication backend unavailable",
        error instanceof Error ? error.name : "Error",
      );
    return NextResponse.json(
      {
        error: {
          code: known ? error.code : "SERVICE_UNAVAILABLE",
          message: known
            ? error.message
            : "Authentication is temporarily unavailable",
        },
      },
      {
        status: known ? error.status : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
export const json = (value: unknown, status = 200) =>
  NextResponse.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
