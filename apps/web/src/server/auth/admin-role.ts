/** Server-only configuration. Never accept an administrator ID from a request. */
export function parseAdminTelegramIds(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  const ids = value
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean);
  if (
    ids.some(
      (id) => !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id)),
    )
  )
    throw new Error("Invalid PLATFORM_ADMIN_TELEGRAM_IDS configuration");
  return [...new Set(ids)];
}

export function hasAdminRole(account: Record<string, unknown>): boolean {
  const ids = parseAdminTelegramIds(process.env.PLATFORM_ADMIN_TELEGRAM_IDS);
  if (account.disabled_at != null) return false;
  return (
    account.is_admin === true ||
    ids.includes(String(account.telegram_user_id ?? ""))
  );
}
