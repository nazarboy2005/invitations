// Disposable PostgreSQL identity only; every Telegram call is intercepted.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb, closeDb } from "../packages/database/src/index";
import { processTelegramUpdate } from "../apps/web/src/server/auth/telegram";

test("payment return bot entry opens the local Mini App without login confirmation or payment creation", async () => {
  const db = getDb(),
    originalFetch = globalThis.fetch;
  const userId = randomUUID(),
    orderId = randomUUID();
  const telegramId = Math.floor(Math.random() * 1e12) + 1;
  const updates: number[] = [],
    bodies: any[] = [];
  const previousUrl = process.env.APP_URL;
  process.env.APP_URL = "https://invitation.example";
  globalThis.fetch = async (input, init) => {
    assert.equal(new URL(String(input)).hostname, "api.telegram.org");
    assert.ok(String(input).endsWith("/sendMessage"));
    bodies.push(JSON.parse(String(init?.body)));
    return Response.json({ ok: true });
  };
  async function command(param: string) {
    const updateId = Math.floor(Math.random() * 1e12) + 1;
    updates.push(updateId);
    await processTelegramUpdate({
      update_id: updateId,
      message: {
        message_id: 1,
        chat: { id: telegramId, type: "private" },
        from: { id: telegramId, first_name: "Payment return QA" },
        text: `/start ${param}`,
      },
    });
  }
  try {
    await db`INSERT INTO users(id,telegram_user_id,display_name,phone_shared_at) VALUES(${userId},${telegramId},'Payment return QA',now())`;
    await command("payment_return");
    let button = bodies.at(-1).reply_markup.inline_keyboard[0][0];
    assert.equal(button.text, "To‘lov holatini ochish");
    assert.equal(
      button.web_app.url,
      "https://invitation.example/payment/return",
    );
    await command(`payment_return_${orderId}`);
    button = bodies.at(-1).reply_markup.inline_keyboard[0][0];
    assert.equal(
      button.web_app.url,
      `https://invitation.example/payment/return?order=${orderId}`,
    );
    assert.equal(
      (await db`SELECT id FROM sessions WHERE user_id=${userId}`).length,
      0,
    );
    assert.equal(
      (await db`SELECT id FROM payment_orders WHERE owner_id=${userId}`).length,
      0,
    );
    await db`UPDATE users SET disabled_at=now() WHERE id=${userId}`;
    await command("payment_return");
    assert.equal(bodies.at(-1).reply_markup, undefined);
    assert.match(bodies.at(-1).text, /cheklangan/);
  } finally {
    globalThis.fetch = originalFetch;
    if (previousUrl === undefined) delete process.env.APP_URL;
    else process.env.APP_URL = previousUrl;
    await db.begin(async (tx) => {
      for (const updateId of updates)
        await tx`DELETE FROM telegram_updates WHERE update_id=${updateId}`;
      await tx`DELETE FROM telegram_connections WHERE user_id=${userId}`;
      await tx`DELETE FROM users WHERE id=${userId}`;
    });
    await closeDb();
  }
});
