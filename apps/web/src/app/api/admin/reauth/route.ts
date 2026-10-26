import { cookies } from "next/headers";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { requireAdminMutation, adminError } from "@/server/admin";
import { ApiError, readJson } from "@/server/api";
import {
  browserHash,
  cookieOptions,
  json,
  SESSION_COOKIE,
} from "@/server/auth";
import { digest, randomToken } from "@/server/auth/crypto";
import { hasAdminRole } from "@/server/auth/admin-role";

export async function POST(request: Request) {
  try {
    const user = await requireAdminMutation(request, false);
    const { requestId } = z
      .object({ requestId: z.uuid() })
      .strict()
      .parse(await readJson(request, 5000));
    const hash = await browserHash();
    const jar = await cookies();
    const previousToken = jar.get(SESSION_COOKIE)!.value;
    const token = randomToken();
    await getDb().begin(async (tx) => {
      const [auth] =
        await tx`SELECT * FROM auth_requests WHERE id=${requestId} AND browser_hash=${hash} FOR UPDATE`;
      if (
        !auth ||
        auth.state !== "confirmed" ||
        new Date(auth.expires_at).getTime() <= Date.now()
      )
        throw new ApiError(
          409,
          "LOGIN_NOT_READY",
          "Tasdiqlash muddati tugagan yoki allaqachon ishlatilgan.",
        );
      // Reauthentication cannot change accounts or elevate a different identity.
      if (auth.user_id !== user.id)
        throw new ApiError(
          403,
          "IDENTITY_MISMATCH",
          "Joriy administratorning Telegram hisobidan tasdiqlang.",
        );
      const [admin] =
        await tx`SELECT id,telegram_user_id,is_admin FROM users WHERE id=${user.id} AND phone_shared_at IS NOT NULL AND disabled_at IS NULL FOR SHARE`;
      const [session] =
        await tx`UPDATE sessions SET revoked_at=now() WHERE token_hash=${digest(previousToken)} AND user_id=${user.id} AND revoked_at IS NULL AND expires_at>now() AND absolute_expires_at>now() RETURNING id`;
      if (!admin || !hasAdminRole(admin) || !session)
        throw new ApiError(401, "LOGIN_REQUIRED", "Hisobga qayta kiring.");
      await tx`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${user.id},${digest(token)},${request.headers.get("user-agent")?.slice(0, 500) ?? ""},now()+interval '30 days',now()+interval '90 days')`;
      await tx`UPDATE auth_requests SET state='consumed',consumed_at=now() WHERE id=${requestId}`;
    });
    jar.set(SESSION_COOKIE, token, cookieOptions(30 * 86400));
    return json({ ok: true });
  } catch (error) {
    return adminError(error);
  }
}
