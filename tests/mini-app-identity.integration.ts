// Local HTTP and disposable identities only; every Telegram reply is stubbed.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { getDb, closeDb } from "../packages/database/src/index";
import {
  digest,
  randomToken,
  verifyMiniAppLaunch,
} from "../apps/web/src/server/auth/crypto";
import { processTelegramUpdate } from "../apps/web/src/server/auth/telegram";

const db = getDb(),
  origin = process.env.APP_URL!,
  admin = randomUUID(),
  creator = randomUUID(),
  unverified = randomUUID(),
  users = [admin, creator, unverified],
  telegram = new Map<string, number>(),
  launchKeys: string[] = [],
  updates: number[] = [];
before(async () => {
  assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
  for (const id of users) {
    const tg = Math.floor(Math.random() * 1e12) + 1;
    telegram.set(id, tg);
    await db`INSERT INTO users(id,telegram_user_id,display_name,is_admin,phone_shared_at) VALUES(${id},${tg},'Mini App binding QA',${id === admin},${id === unverified ? null : new Date()})`;
  }
});
after(async () => {
  await db.begin(async (tx) => {
    for (const key of launchKeys)
      await tx`DELETE FROM miniapp_exchanges WHERE init_hash=${key}`;
    for (const update of updates)
      await tx`DELETE FROM telegram_updates WHERE update_id=${update}`;
    for (const id of users) {
      await tx`DELETE FROM telegram_connections WHERE user_id=${id}`;
      await tx`DELETE FROM sessions WHERE user_id=${id}`;
      await tx`DELETE FROM rate_limits WHERE key=${"admin-write:" + id}`;
      await tx`DELETE FROM users WHERE id=${id}`;
    }
  });
  await closeDb();
});
function signed(id: string, age = 0) {
  const fields = {
      auth_date: String(Math.floor(Date.now() / 1000) - age),
      query_id: randomUUID(),
      user: JSON.stringify({
        id: telegram.get(id),
        first_name: "Mini App binding QA",
      }),
    },
    params = new URLSearchParams(fields);
  const secret = createHmac("sha256", "WebAppData")
      .update(process.env.TELEGRAM_BOT_TOKEN!)
      .digest(),
    check = Object.entries(fields)
      .sort(([a], [b]) => a.localeCompare(b, "en"))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
  params.set("hash", createHmac("sha256", secret).update(check).digest("hex"));
  const raw = params.toString();
  launchKeys.push(
    verifyMiniAppLaunch(
      raw,
      process.env.TELEGRAM_BOT_TOKEN!,
      Date.now(),
      String(telegram.get(id)),
    ).replayKey,
  );
  return raw;
}
async function session(id: string, age = 0) {
  const token = randomToken();
  await db`INSERT INTO sessions(user_id,token_hash,created_at,expires_at,absolute_expires_at) VALUES(${id},${digest(token)},now()-${age}*interval '1 hour',now()+interval '1 hour',now()+interval '1 hour')`;
  return token;
}
function request(path: string, token?: string, body?: unknown) {
  return fetch(origin + path, {
    ...(body === undefined
      ? {}
      : { method: "POST", body: JSON.stringify(body) }),
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      ...(token ? { Cookie: `taklifnoma_session=${token}` } : {}),
    },
  });
}
function post(initData: string, token?: string) {
  return request("/api/auth/telegram/mini-app", token, { initData });
}
async function total(id: string) {
  return (
    await db`SELECT count(*)::int AS n FROM sessions WHERE user_id=${id}`
  )[0].n;
}

test("signed launch switches an unrelated browser account to the verified Telegram identity", async () => {
  const old = await session(creator),
    response = await post(signed(admin), old);
  assert.equal(response.status, 200, await response.clone().text());
  const cookie = response.headers
    .get("set-cookie")
    ?.match(/taklifnoma_session=([^;]+)/)?.[1];
  assert.ok(cookie);
  const current = await (await request("/api/auth/session", cookie)).json();
  assert.equal(current.user.id, admin);
  assert.equal(current.user.isAdmin, true);
});
test("matching older signed launch retains the original session and cannot bypass admin reconfirmation", async () => {
  const token = await session(admin, 13),
    raw = signed(admin, 600),
    count = await total(admin);
  for (let index = 0; index < 2; index++) {
    const result = await post(raw, token);
    assert.equal(result.status, 200);
    assert.equal(result.headers.get("set-cookie"), null);
  }
  assert.equal(await total(admin), count);
  const gate = await request("/api/admin/users", token);
  assert.equal(gate.status, 401);
  assert.equal((await gate.json()).error.code, "ADMIN_REAUTH_REQUIRED");
  assert.equal((await post(raw)).status, 401);
  assert.equal((await post(raw, await session(creator))).status, 401);
});
test("fresh launch replay cannot create another session in an unrelated browser", async () => {
  const raw = signed(admin),
    first = await post(raw);
  assert.equal(first.status, 200);
  const cookie = first.headers
      .get("set-cookie")!
      .match(/taklifnoma_session=([^;]+)/)![1],
    count = await total(admin);
  assert.equal((await post(raw)).status, 409);
  assert.equal((await post(raw, cookie)).status, 200);
  assert.equal(await total(admin), count);
});
test("a verified switch to an unverified phone account clears the previous browser identity", async () => {
  const response = await post(signed(unverified), await session(admin));
  assert.equal(response.status, 403);
  assert.equal((await response.json()).phoneRequired, true);
  assert.match(
    response.headers.get("set-cookie") ?? "",
    /taklifnoma_session=;/,
  );
  assert.match(response.headers.get("set-cookie") ?? "", /Max-Age=0/i);
});
test("bot admin entry uses the authenticated account route and stays silent for unauthorized users", async () => {
  const original = globalThis.fetch,
    bodies: Array<Record<string, any>> = [];
  globalThis.fetch = async (input, init) => {
    assert.equal(new URL(String(input)).hostname, "api.telegram.org");
    bodies.push(JSON.parse(String(init?.body)));
    return Response.json({ ok: true });
  };
  async function command(id: string, text: string) {
    const update = Math.floor(Math.random() * 1e12) + 1;
    updates.push(update);
    const tg = telegram.get(id)!;
    await processTelegramUpdate({
      update_id: update,
      message: {
        message_id: 1,
        chat: { id: tg, type: "private" },
        from: { id: tg, first_name: "Mini App binding QA" },
        text,
      },
    });
  }
  try {
    await command(admin, "/admin");
    const entry = bodies.at(-1)!.reply_markup.inline_keyboard[0][0];
    assert.equal(entry.web_app.url, origin + "/dashboard");
    assert.match(entry.text, /Boshqaruv/);
    const adminReplies = bodies.length;
    for (const id of [creator, unverified]) {
      for (const text of ["/admin", "/admin@TaklifnomaBot", "/admin  "]) {
        await command(id, text);
        assert.equal(bodies.length, adminReplies);
        const update = updates.at(-1)!;
        assert.equal(
          (
            await db`SELECT update_id FROM telegram_updates WHERE update_id=${update}`
          ).length,
          1,
        );
      }
    }
    await db`UPDATE users SET disabled_at=now() WHERE id=${creator}`;
    await command(creator, "/admin");
    assert.equal(bodies.length, adminReplies);
    await db`UPDATE users SET disabled_at=now() WHERE id=${admin}`;
    await command(admin, "/admin");
    assert.equal(bodies.length, adminReplies);
    await db`UPDATE users SET disabled_at=NULL WHERE id=${admin}`;
    await command(admin, "/start");
    assert.equal(
      bodies.at(-1)!.reply_markup.inline_keyboard[0][0].web_app.url,
      origin + "/dashboard",
    );
  } finally {
    globalThis.fetch = original;
  }
});
