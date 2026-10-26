import { ApiError } from "./api";
import { hasAdminRole } from "./auth/admin-role";

// A sliding creator session must never silently extend administrative access.
export const ADMIN_AUTH_MAX_AGE_MS = 12 * 60 * 60 * 1000;

export function assertAdminSession(
  session: Record<string, unknown> | null,
  fresh = true,
  now = Date.now(),
) {
  if (!session)
    throw new ApiError(401, "LOGIN_REQUIRED", "Avval Telegram orqali kiring.");
  if (!hasAdminRole(session))
    throw new ApiError(403, "FORBIDDEN", "Administrator huquqi kerak.");
  const authenticatedAt = new Date(String(session.authenticated_at)).getTime();
  if (
    fresh &&
    (!Number.isFinite(authenticatedAt) ||
      authenticatedAt > now ||
      now - authenticatedAt >= ADMIN_AUTH_MAX_AGE_MS)
  )
    throw new ApiError(
      401,
      "ADMIN_REAUTH_REQUIRED",
      "Boshqaruvni davom ettirish uchun Telegram orqali qayta tasdiqlang.",
    );
  return session;
}
