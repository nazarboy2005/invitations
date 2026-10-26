import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

export const randomToken = () => randomBytes(32).toString("base64url");
export const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a),
    right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export type TelegramIdentity = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
};
export function verifyInitData(
  raw: string,
  botToken: string,
  now = Date.now(),
  authenticatedTelegramId?: string,
): TelegramIdentity {
  if (!raw || raw.length > 16384)
    throw new Error("Invalid Telegram launch data");
  const params = new URLSearchParams(raw);
  const keys = [...params.keys()];
  if (new Set(keys).size !== keys.length)
    throw new Error("Duplicate Telegram fields");
  const hash = params.get("hash");
  if (!hash || !/^[a-f0-9]{64}$/i.test(hash))
    throw new Error("Invalid Telegram signature");
  params.delete("hash");
  const checked = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "en"))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secret = createHmac("sha256", "WebAppData").update(botToken).digest();
  const expected = createHmac("sha256", secret).update(checked).digest("hex");
  if (!safeEqual(expected, hash.toLowerCase()))
    throw new Error("Invalid Telegram signature");
  const timestamp = Number(params.get("auth_date"));
  if (
    !Number.isSafeInteger(timestamp) ||
    timestamp <= 0 ||
    timestamp * 1000 > now + 30000
  )
    throw new Error("Telegram launch expired; reopen the Mini App");
  const user = JSON.parse(
    params.get("user") ?? "null",
  ) as TelegramIdentity | null;
  if (
    !user ||
    !Number.isSafeInteger(user.id) ||
    user.id <= 0 ||
    typeof user.first_name !== "string"
  )
    throw new Error("Telegram user missing");
  // Only a matching, already authenticated server session may keep using its
  // own older signed launch. This never permits a new login or session renewal.
  if (
    now - timestamp * 1000 > 300000 &&
    String(user.id) !== authenticatedTelegramId
  )
    throw new Error("Telegram launch expired; reopen the Mini App");
  return user;
}
export function verifyMiniAppLaunch(
  raw: string,
  botToken: string,
  now = Date.now(),
  authenticatedTelegramId?: string,
) {
  const user = verifyInitData(raw, botToken, now, authenticatedTelegramId);
  const params = new URLSearchParams(raw);
  // Only construct this fingerprint after signature validation. URL ordering and
  // equivalent percent encodings do not change the verified signature or fields.
  const replayKey = digest(
    JSON.stringify([
      "telegram-miniapp:v1",
      digest(botToken),
      params.get("hash")!.toLowerCase(),
      params.get("auth_date"),
      String(user.id),
    ]),
  );
  return { user, replayKey };
}
export function isOwnContact(
  senderId: number,
  contact: { user_id?: number; phone_number?: string },
  forwarded = false,
) {
  if (
    forwarded ||
    !Number.isSafeInteger(senderId) ||
    senderId <= 0 ||
    contact.user_id !== senderId ||
    typeof contact.phone_number !== "string"
  )
    return false;
  const digits = contact.phone_number.replace(/\D/g, "");
  return (
    /^\+?\d[\d\s()-]*$/.test(contact.phone_number) &&
    /^[1-9]\d{6,14}$/.test(digits)
  );
}
