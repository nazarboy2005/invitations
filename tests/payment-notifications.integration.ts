// Real disposable PostgreSQL fixtures; all provider and Telegram traffic is mocked.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb, closeDb } from "../packages/database/src/index";
import {
  createCheckout,
  applyPayment,
  getPaymentOrder,
} from "../apps/web/src/server/payments";
import { publishInvitation } from "../apps/web/src/server/publication";
import { saveInvitation } from "../apps/web/src/server/invitations";
import { processTelegramUpdate } from "../apps/web/src/server/auth/telegram";
import { processPaymentNotifications } from "../apps/web/src/server/payment-notifications";
import { completeInvitation } from "./fixtures/publication";
import type { NodzePayment } from "../apps/web/src/server/nodze";
import type { SessionUser } from "../packages/contracts/src/index";

test("verified payment delivers one formatted invitation confirmation, with safe recovery and delivery states", async () => {
  const sql = getDb(),
    originalFetch = globalThis.fetch;
  const userId = randomUUID(),
    telegramId = String(Math.floor(Math.random() * 1e12) + 1);
  const owner: SessionUser = {
    id: userId,
    telegramUserId: telegramId,
    displayName: "Payment confirmation QA",
    phoneShared: true,
    isAdmin: false,
  };
  const provider = new Map<string, NodzePayment>();
  const messages: any[] = [],
    updates: number[] = [];
  process.env.APP_URL = "https://invitations.example";
  process.env.PUBLISHING_MODE = "paid";
  process.env.NODZE_API_KEY = "fixture-project-key";
  process.env.NODZE_WEBHOOK_SECRET = "fixture-webhook-secret";
  process.env.TELEGRAM_BOT_TOKEN = "fixture-bot-token";
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    const body = JSON.parse(String(init?.body ?? "{}"));
    if (url.hostname === "api.telegram.org") {
      assert.equal(url.pathname, "/botfixture-bot-token/sendMessage");
      messages.push(body);
      return Response.json({
        ok: true,
        result: { message_id: messages.length },
      });
    }
    assert.equal(
      url.hostname,
      "payments.nodze.org",
      "no other external requests allowed",
    );
    assert.equal(init?.method, "POST");
    const payment: NodzePayment = {
      id: randomUUID(),
      orderId: body.orderId,
      amount: "1000.00",
      currency: "UZS",
      provider: "click",
      status: "PENDING",
      checkoutUrl: "https://my.click.uz/services/pay?fixture=confirmation",
    };
    provider.set(payment.orderId, payment);
    return Response.json(payment, { status: 201 });
  };
  async function draft() {
    const data = completeInvitation();
    await sql`INSERT INTO invitations(id,owner_id,template_id,data) VALUES(${data.id},${userId},${data.templateId},${sql.json(data)})`;
    const order = await createCheckout(data.id, data.revision, 100000, owner);
    return { data, order, payment: provider.get(order.id)! };
  }
  async function returnToBot(orderId: string) {
    const update = Math.floor(Math.random() * 1e12) + 1;
    updates.push(update);
    await processTelegramUpdate({
      update_id: update,
      message: {
        message_id: 1,
        chat: { id: Number(telegramId), type: "private" },
        from: { id: Number(telegramId), first_name: "Confirmation QA" },
        text: `/start payment_return_${orderId}`,
      },
    });
  }
  try {
    await sql`INSERT INTO users(id,telegram_user_id,display_name,phone_shared_at) VALUES(${userId},${telegramId},'Payment confirmation QA',now())`;
    await sql`INSERT INTO telegram_connections(user_id,telegram_chat_id,status) VALUES(${userId},${telegramId},'active')`;
    const first = await draft();
    assert.equal(
      await processPaymentNotifications({ orderId: first.order.id }),
      0,
    );
    assert.equal(messages.length, 0, "checkout/return is not success");
    await returnToBot(first.order.id);
    assert.match(messages.at(-1).text, /To‘lov tasdig‘i kutilmoqda/);
    assert.doesNotMatch(messages.at(-1).text, /\/i\//);

    first.payment.status = "SUCCEEDED";
    await applyPayment(first.payment);
    await applyPayment(first.payment);
    const [count] =
      await sql`SELECT count(*)::int AS n FROM jobs WHERE type='payment-confirmation' AND payload->>'orderId'=${first.order.id}`;
    assert.equal(
      count.n,
      1,
      "duplicate verified responses do not enqueue duplicate receipts",
    );
    const before = messages.length;
    await Promise.all([
      processPaymentNotifications({ orderId: first.order.id }),
      processPaymentNotifications({ orderId: first.order.id }),
    ]);
    assert.equal(
      messages.length,
      before + 1,
      "concurrent workers deliver once",
    );
    const view = await getPaymentOrder(first.order.id, userId);
    assert.ok(view.url);
    const confirmation = messages.at(-1);
    assert.equal(confirmation.chat_id, telegramId);
    assert.equal(confirmation.parse_mode, "HTML");
    assert.match(confirmation.text, /To‘lov muvaffaqiyatli tasdiqlandi/);
    assert.ok(confirmation.text.includes(view.url));
    assert.equal(confirmation.reply_markup.inline_keyboard[0][0].url, view.url);
    assert.equal(
      await processPaymentNotifications({ orderId: first.order.id }),
      0,
    );
    await returnToBot(first.order.id);
    assert.ok(
      messages.at(-1).text.includes(view.url),
      "old return links show the actual confirmed invitation",
    );
    await returnToBot(randomUUID());
    assert.match(messages.at(-1).text, /buyurtmasi topilmadi/);
    assert.doesNotMatch(
      messages.at(-1).text,
      /\/i\//,
      "explicit unknown order cannot fall back to a paid order",
    );

    const blocked = await draft();
    blocked.data.content["uz-Latn"].venueName = "";
    const incomplete = await saveInvitation(blocked.data, owner);
    blocked.payment.status = "SUCCEEDED";
    await applyPayment(blocked.payment);
    await processPaymentNotifications({ orderId: blocked.order.id });
    assert.match(messages.at(-1).text, /To‘lov qabul qilindi/);
    assert.doesNotMatch(messages.at(-1).text, /\/i\//);
    incomplete.content["uz-Latn"].venueName = "Corrected venue";
    const corrected = await saveInvitation(incomplete, owner);
    await publishInvitation(corrected.id, corrected.revision, owner);
    const beforeReady = messages.length;
    await processPaymentNotifications({ orderId: blocked.order.id });
    assert.equal(messages.length, beforeReady + 1);
    assert.match(messages.at(-1).text, /Taklifnomangiz nashr qilindi/);
    assert.equal(
      await processPaymentNotifications({ orderId: blocked.order.id }),
      0,
    );

    // Known rejection can retry; an ambiguous send or crashed worker cannot.
    await sql`UPDATE jobs SET status='queued',attempts=0,available_at=now() WHERE idempotency_key=${"payment-confirmation:" + first.order.id}`;
    await processPaymentNotifications({
      orderId: first.order.id,
      send: async () => ({ state: "retry", after: 42 }),
    });
    let [job] =
      await sql`SELECT * FROM jobs WHERE idempotency_key=${"payment-confirmation:" + first.order.id}`;
    assert.equal(job.status, "queued");
    await sql`UPDATE jobs SET available_at=now()-interval '1 second' WHERE id=${job.id}`;
    await processPaymentNotifications({
      orderId: first.order.id,
      send: async () => ({ state: "uncertain" }),
    });
    [job] = await sql`SELECT * FROM jobs WHERE id=${job.id}`;
    assert.equal(job.status, "uncertain");
    assert.equal(
      await processPaymentNotifications({
        orderId: first.order.id,
        send: async () => {
          assert.fail("must not repeat uncertain delivery");
        },
      }),
      0,
    );
    await sql`UPDATE jobs SET status='processing',locked_at=now()-interval '3 minutes' WHERE id=${job.id}`;
    await processPaymentNotifications({
      orderId: first.order.id,
      send: async () => {
        assert.fail("crashed delivery must not be repeated");
      },
    });
    [job] = await sql`SELECT * FROM jobs WHERE id=${job.id}`;
    assert.equal(job.status, "uncertain");
    await sql`UPDATE jobs SET status='queued',available_at=now() WHERE id=${job.id}`;
    await sql`UPDATE users SET disabled_at=now() WHERE id=${userId}`;
    await processPaymentNotifications({
      orderId: first.order.id,
      send: async () => {
        assert.fail("suspended recipients must not receive messages");
      },
    });
    [job] = await sql`SELECT * FROM jobs WHERE id=${job.id}`;
    assert.equal(job.status, "skipped");
  } finally {
    globalThis.fetch = originalFetch;
    await sql.begin(async (tx) => {
      await tx`DELETE FROM jobs WHERE type='payment-confirmation' AND payload->>'orderId' IN (SELECT id::text FROM payment_orders WHERE owner_id=${userId})`;
      await tx`DELETE FROM payment_webhook_events WHERE order_id IN (SELECT id FROM payment_orders WHERE owner_id=${userId})`;
      await tx`DELETE FROM payment_orders WHERE owner_id=${userId}`;
      await tx`DELETE FROM platform_payments WHERE owner_id=${userId}`;
      await tx`DELETE FROM invitation_audit_log WHERE invitation_id IN (SELECT id FROM invitations WHERE owner_id=${userId})`;
      await tx`DELETE FROM invitations WHERE owner_id=${userId}`;
      for (const update of updates)
        await tx`DELETE FROM telegram_updates WHERE update_id=${update}`;
      await tx`DELETE FROM telegram_connections WHERE user_id=${userId}`;
      await tx`DELETE FROM users WHERE id=${userId}`;
    });
    await closeDb();
  }
});
