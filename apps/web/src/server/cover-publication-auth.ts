import { createHmac, timingSafeEqual } from "node:crypto";

export function publicationCoverSignature(id: string, expires: number) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("Cover signing is not configured");
  return `${expires}.${createHmac("sha256", secret).update(`published-cover:${id}:${expires}`).digest("hex")}`;
}

export function verifyPublicationCover(
  id: string,
  signature: string,
  now = Date.now(),
) {
  const expires = Number(signature.split(".")[0]);
  if (!Number.isSafeInteger(expires) || expires < now || expires > now + 120000)
    return false;
  try {
    const expected = Buffer.from(publicationCoverSignature(id, expires));
    const actual = Buffer.from(signature);
    return (
      actual.length === expected.length && timingSafeEqual(actual, expected)
    );
  } catch {
    return false;
  }
}
