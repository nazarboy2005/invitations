// Opt-in local server configured with the same disposable allowlisted ID.
// No real Telegram calls or existing account role changes.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { parseAdminTelegramIds } from "../apps/web/src/server/auth/admin-role";
import { processTelegramUpdate } from "../apps/web/src/server/auth/telegram";
import { processAdminBroadcasts } from "../apps/web/src/server/jobs/admin-broadcast";

const telegramId = process.env.ADMIN_ALLOWLIST_TEST_TELEGRAM_ID;
test(
  "environment-only admin uses existing sessions, protected pages, reauthentication and worker authority without a persisted grant",
  { skip: !telegramId },
  async () => {
    const origin = process.env.APP_URL!;
    assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
    assert.ok(
      parseAdminTelegramIds(process.env.PLATFORM_ADMIN_TELEGRAM_IDS).includes(
        telegramId!,
      ),
    );
    const db = getDb(),
      userId = randomUUID(),
      ordinary = randomUUID(),
      token = randomToken(),
      stale = randomToken(),
      browser = randomToken(),
      campaignId = randomUUID(),
      revokedCampaignId = randomUUID(),
      updateId = Math.floor(Math.random() * 1e12) + 1;
    const originalFetch = globalThis.fetch,
      originalIds = process.env.PLATFORM_ADMIN_TELEGRAM_IDS;
    async function request(
      path: string,
      cookie = token,
      body?: unknown,
      browserCookie = "",
    ) {
      return originalFetch(origin + path, {
        redirect: "manual",
        ...(body === undefined
          ? {}
          : { method: "POST", body: JSON.stringify(body) }),
        headers: {
          Origin: origin,
          "Content-Type": "application/json",
          Cookie: `taklifnoma_session=${cookie}${browserCookie ? `; taklifnoma_auth_browser=${browserCookie}` : ""}`,
        },
      });
    }
    try {
      // No upsert: fail rather than touching an existing account if the fixture ID collides.
      await db`INSERT INTO users(id,telegram_user_id,display_name,phone_shared_at,is_admin) VALUES(${userId},${telegramId!},'Allowlist QA admin',now(),false),(${ordinary},${Math.floor(Math.random() * 1e12) + 1},'Allowlist QA creator',now(),false)`;
      for (const [value, age] of [
        [token, "0 hours"],
        [stale, "13 hours"],
      ])
        await db`INSERT INTO sessions(user_id,token_hash,created_at,expires_at,absolute_expires_at) VALUES(${userId},${digest(value)},now()-${age}::interval,now()+interval '1 hour',now()+interval '1 hour')`;
      const session = await request("/api/auth/session");
      assert.equal(session.status, 200);
      assert.equal((await session.json()).user.isAdmin, true);
      assert.equal((await request("/admin")).status, 200);
      const list = await request("/api/admin/users?q=Allowlist%20QA");
      assert.equal(list.status, 200);
      const accounts = (await list.json()).items;
      assert.equal(
        accounts.find((row: { id: string }) => row.id === userId).isAdmin,
        true,
      );
      assert.equal(
        accounts.find((row: { id: string }) => row.id === ordinary).isAdmin,
        false,
      );
      const staleResponse = await request("/api/admin/users", stale);
      assert.equal(staleResponse.status, 401);
      assert.equal(
        (await staleResponse.json()).error.code,
        "ADMIN_REAUTH_REQUIRED",
      );
      const [auth] =
        await db`INSERT INTO auth_requests(token_hash,browser_hash,user_id,state,confirmed_at,expires_at) VALUES(${digest(randomToken())},${digest(browser)},${userId},'confirmed',now(),now()+interval '5 minutes') RETURNING id`;
      const renewed = await request(
        "/api/admin/reauth",
        stale,
        { requestId: auth.id },
        browser,
      );
      assert.equal(renewed.status, 200, await renewed.clone().text());
      assert.ok(
        renewed.headers.get("set-cookie")?.includes("taklifnoma_session="),
      );

      // Fake Telegram acknowledgement; only the disposable account is identified.
      let acknowledgements = 0;
      globalThis.fetch = async (input) => {
        assert.equal(new URL(String(input)).hostname, "api.telegram.org");
        acknowledgements++;
        return Response.json({ ok: true });
      };
      await processTelegramUpdate({
        update_id: updateId,
        message: {
          message_id: 1,
          chat: { id: Number(telegramId), type: "private" },
          from: { id: Number(telegramId), first_name: "Allowlist QA admin" },
          text: "/stop",
        },
      });
      assert.equal(acknowledgements, 1);
      globalThis.fetch = originalFetch;
      assert.equal(
        (await db`SELECT is_admin FROM users WHERE id=${userId}`)[0].is_admin,
        false,
      );

      await db`INSERT INTO telegram_connections(user_id,telegram_chat_id,status) SELECT id,telegram_user_id,'active' FROM users WHERE id=${ordinary}`;
      async function queue(id: string) {
        await db`INSERT INTO admin_broadcasts(id,created_by,confirmed_by,title,message,audience,status,recipient_count,idempotency_key,confirmed_at) VALUES(${id},${userId},${userId},'Allowlist QA','Disposable worker test','selected','queued',1,${randomUUID()},now())`;
        await db`INSERT INTO admin_broadcast_recipients(broadcast_id,user_id) VALUES(${id},${ordinary})`;
      }
      let deliveries = 0;
      const send = async () => {
        deliveries++;
        return { state: "sent" as const, messageId: 1 };
      };
      await queue(campaignId);
      const processed = await processAdminBroadcasts({
        broadcastId: campaignId,
        send,
        pause: async () => {},
      });
      assert.equal(processed.busy, false);
      assert.equal(deliveries, 1);
      await queue(revokedCampaignId);
      process.env.PLATFORM_ADMIN_TELEGRAM_IDS = "";
      await processAdminBroadcasts({
        broadcastId: revokedCampaignId,
        send,
        pause: async () => {},
      });
      assert.equal(deliveries, 1);
      assert.equal(
        (
          await db`SELECT status FROM admin_broadcasts WHERE id=${revokedCampaignId}`
        )[0].status,
        "cancelled",
      );
    } finally {
      globalThis.fetch = originalFetch;
      if (originalIds === undefined)
        delete process.env.PLATFORM_ADMIN_TELEGRAM_IDS;
      else process.env.PLATFORM_ADMIN_TELEGRAM_IDS = originalIds;
      await db.begin(async (tx) => {
        await tx`DELETE FROM telegram_updates WHERE update_id=${updateId}`;
        await tx`DELETE FROM admin_broadcast_recipients WHERE broadcast_id IN (${campaignId},${revokedCampaignId})`;
        await tx`DELETE FROM admin_broadcasts WHERE id IN (${campaignId},${revokedCampaignId})`;
        await tx`DELETE FROM auth_requests WHERE user_id IN (${userId},${ordinary})`;
        await tx`DELETE FROM admin_audit_log WHERE actor_id IN (${userId},${ordinary})`;
        await tx`DELETE FROM telegram_connections WHERE user_id IN (${userId},${ordinary})`;
        await tx`DELETE FROM sessions WHERE user_id IN (${userId},${ordinary})`;
        await tx`DELETE FROM rate_limits WHERE key=${"admin-write:" + userId}`;
        await tx`DELETE FROM users WHERE id IN (${userId},${ordinary})`;
      });
      await closeDb();
    }
  },
);
