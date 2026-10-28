// Opt-in real PostgreSQL transactions; ALL network requests intercepted in this process.
// Never creates a payment on Nodze or Click. Only disposable users/invitations/orders.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { getDb, closeDb } from "../packages/database/src/index";
import { type SessionUser } from "../packages/contracts/src/index";
import {
  createCheckout,
  consumeWebhook,
  getPaymentOrder,
  applyPayment,
  refreshPayment,
  listPaymentOrders,
} from "../apps/web/src/server/payments";
import { saveInvitation } from "../apps/web/src/server/invitations";
import { publishInvitation } from "../apps/web/src/server/publication";
import { type NodzePayment } from "../apps/web/src/server/nodze";
import { completeInvitation } from "./fixtures/publication";

const sql = getDb(),
  originalFetch = globalThis.fetch;
const owner: SessionUser = {
  id: randomUUID(),
  telegramUserId: "",
  displayName: "Payment test",
  phoneShared: true,
  isAdmin: false,
};
const stranger = { ...owner, id: randomUUID() };
const remote = new Map<string, NodzePayment>();
const requests: Array<{ body: string; key: string }> = [];
let loseNextResponse = false;
const secret = "mock-payment-webhook-secret-only";
before(async () => {
  process.env.PUBLISHING_MODE = "paid";
  process.env.APP_URL = "https://invitations.example";
  process.env.NODZE_API_BASE_URL = "https://payments.nodze.org/api/v1";
  process.env.NODZE_API_KEY = "mock-project-key-no-live-credentials";
  process.env.NODZE_WEBHOOK_SECRET = secret;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    assert.ok(
      url.startsWith("https://payments.nodze.org/api/v1/payments"),
      "All external network traffic is prohibited in payment tests",
    );
    assert.equal(
      new Headers(init?.headers).get("authorization"),
      "Bearer mock-project-key-no-live-credentials",
    );
    let payment: NodzePayment | undefined;
    if (init?.method === "POST") {
      const body = String(init.body),
        data = JSON.parse(body),
        key = new Headers(init.headers).get("idempotency-key")!;
      assert.equal(data.amount, 1000);
      assert.match(body, /"amount":1000\.00/);
      assert.equal(
        data.successUrl,
        "https://invitations.example/payment/return",
      );
      assert.equal(data.cancelUrl, data.successUrl);
      requests.push({ body, key });
      payment = [...remote.values()].find(
        (item) => item.orderId === data.orderId,
      );
      if (!payment) {
        payment = {
          id: randomUUID(),
          orderId: data.orderId,
          amount: "1000.00",
          currency: "UZS",
          provider: "click",
          status: "PENDING",
          checkoutUrl: "https://my.click.uz/services/pay?fixture=1",
        };
        remote.set(payment.id, payment);
      }
      if (loseNextResponse) {
        loseNextResponse = false;
        throw new TypeError("Mock lost response after provider commit");
      }
    } else payment = remote.get(url.split("/").at(-1)!);
    assert.ok(payment, "Mock payment must exist");
    return Response.json(payment, {
      status: init?.method === "POST" ? 201 : 200,
    });
  };
  for (const user of [owner, stranger]) {
    await sql`INSERT INTO users(id,telegram_user_id,display_name,phone_shared_at) VALUES(${user.id},${-Math.floor(Math.random() * 1e13) - 1},'Disposable payment test',now())`;
  }
});
after(async () => {
  globalThis.fetch = originalFetch;
  await sql.begin(async (tx) => {
    await tx`DELETE FROM jobs WHERE type='payment-confirmation' AND payload->>'orderId' IN (SELECT id::text FROM payment_orders WHERE owner_id IN (${owner.id},${stranger.id}))`;
    await tx`DELETE FROM payment_webhook_events WHERE order_id IN (SELECT id FROM payment_orders WHERE owner_id IN (${owner.id},${stranger.id}))`;
    await tx`DELETE FROM payment_orders WHERE owner_id IN (${owner.id},${stranger.id})`;
    await tx`DELETE FROM platform_payments WHERE owner_id IN (${owner.id},${stranger.id})`;
    await tx`DELETE FROM invitation_audit_log WHERE invitation_id IN (SELECT id FROM invitations WHERE owner_id IN (${owner.id},${stranger.id}))`;
    await tx`DELETE FROM invitations WHERE owner_id IN (${owner.id},${stranger.id})`;
    await tx`DELETE FROM users WHERE id IN (${owner.id},${stranger.id})`;
  });
  await closeDb();
});
async function draft() {
  const invitation = completeInvitation();
  await sql`INSERT INTO invitations(id,owner_id,template_id,data) VALUES(${invitation.id},${owner.id},${invitation.templateId},${sql.json(invitation)})`;
  return invitation;
}
async function fails(promise: Promise<unknown>, code: string) {
  await assert.rejects(promise, (error: any) => error.code === code);
}
function event(
  payment: NodzePayment,
  type = "payment.succeeded",
  id = randomUUID(),
) {
  const body = Buffer.from(
    JSON.stringify({
      id,
      type,
      data: {
        paymentId: payment.id,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
    }),
  );
  const timestamp = String(Math.floor(Date.now() / 1000));
  return {
    body,
    headers: new Headers({
      "x-nodze-event-id": id,
      "x-nodze-timestamp": timestamp,
      "x-nodze-signature":
        "v1=" +
        createHmac("sha256", secret)
          .update(`${timestamp}.${id}.`)
          .update(body)
          .digest("hex"),
    }),
  };
}
async function paymentFor(id: string) {
  const [row] = await sql`SELECT payment_id FROM payment_orders WHERE id=${id}`;
  return remote.get(row.payment_id)!;
}
test("unpaid direct publish, wrong owner, stale revision and tampered price fail before creating checkout", async () => {
  const d = await draft(),
    before = requests.length;
  await fails(publishInvitation(d.id, d.revision, owner), "PAYMENT_REQUIRED");
  await fails(createCheckout(d.id, d.revision, 100000, stranger), "NOT_FOUND");
  await fails(
    createCheckout(d.id, d.revision + 1, 100000, owner),
    "STALE_REVISION",
  );
  await fails(createCheckout(d.id, d.revision, 1, owner), "PRICE_CHANGED");
  assert.equal(requests.length, before);
});
test("double submission shares one order/payment and reserves its event identity", async () => {
  const d = await draft();
  const [a, b] = await Promise.all([
    createCheckout(d.id, d.revision, 100000, owner),
    createCheckout(d.id, d.revision, 100000, owner),
  ]);
  assert.equal(a.id, b.id);
  assert.equal(a.amountMinor, 100000);
  assert.equal(a.status, "PENDING");
  assert.equal(
    [...remote.values()].filter((p) => p.orderId === a.id).length,
    1,
  );
  const changed = structuredClone(d);
  changed.content["uz-Latn"].people[0] = "Another event";
  await fails(saveInvitation(changed, owner), "CHECKOUT_IDENTITY_LOCKED");
  d.content["uz-Latn"].venueName = "Corrected venue";
  await saveInvitation(d, owner);
  await fails(getPaymentOrder(a.id, stranger.id), "NOT_FOUND");
  assert.equal((await listPaymentOrders(stranger.id)).length, 0);
  await assert.rejects(
    sql`UPDATE payment_orders SET amount_minor=1 WHERE id=${a.id}`,
    /immutable/,
  );
});
test("a lost create response retries identical body/key and recovers the same provider payment", async () => {
  const d = await draft();
  loseNextResponse = true;
  await fails(
    createCheckout(d.id, d.revision, 100000, owner),
    "PAYMENT_UNCERTAIN",
  );
  const original = requests.at(-1)!;
  const order = await createCheckout(d.id, d.revision, 100000, owner);
  assert.deepEqual(requests.at(-1), original);
  assert.equal(
    [...remote.values()].filter((p) => p.orderId === order.id).length,
    1,
  );
});
test("signed success publishes once, concurrent redelivery keeps the link/deadline, stale state cannot downgrade", async () => {
  const d = await draft(),
    order = await createCheckout(d.id, d.revision, 100000, owner),
    p = await paymentFor(order.id);
  p.status = "SUCCEEDED";
  const e = event(p);
  await Promise.all([
    consumeWebhook(e.body, e.headers),
    consumeWebhook(e.body, e.headers),
  ]);
  const view = await getPaymentOrder(order.id, owner.id);
  assert.equal(view.status, "SUCCEEDED");
  assert.match(view.url!, /^https:\/\/invitations.example\/i\/[A-Za-z0-9]{6}$/);
  const [before] =
    await sql`SELECT slug,first_published_at,edit_deadline_at FROM invitations WHERE id=${d.id}`;
  await applyPayment({ ...p, status: "PENDING" });
  await publishInvitation(d.id, d.revision, owner);
  const [after] =
    await sql`SELECT slug,first_published_at,edit_deadline_at FROM invitations WHERE id=${d.id}`;
  assert.deepEqual(after, before);
  const [audit] =
    await sql`SELECT count(*)::int AS count FROM invitation_audit_log WHERE invitation_id=${d.id} AND action='published_paid'`;
  assert.equal(audit.count, 1);
  const [events] =
    await sql`SELECT count(*)::int AS count FROM payment_webhook_events WHERE event_id=${e.headers.get("x-nodze-event-id")!}`;
  assert.equal(events.count, 1);
});
test("wrong amount, payment ID and mutated duplicate event cannot grant publication", async () => {
  const d = await draft(),
    order = await createCheckout(d.id, d.revision, 100000, owner),
    p = await paymentFor(order.id);
  const bad = event({ ...p, status: "SUCCEEDED", amount: "1000.01" });
  await fails(consumeWebhook(bad.body, bad.headers), "PAYMENT_MISMATCH");
  await fails(
    applyPayment({ ...p, id: randomUUID(), status: "SUCCEEDED" }),
    "PAYMENT_MISMATCH",
  );
  assert.equal((await getPaymentOrder(order.id, owner.id)).url, null);
  const valid = event({ ...p, status: "SUCCEEDED" });
  await consumeWebhook(valid.body, valid.headers);
  const conflict = event(
    { ...p, status: "SUCCEEDED", amount: "1.00" },
    "payment.succeeded",
    valid.headers.get("x-nodze-event-id")!,
  );
  await fails(
    consumeWebhook(conflict.body, conflict.headers),
    "EVENT_CONFLICT",
  );
});
test("REJECTED can later succeed; stale cancelled events consult authenticated current state", async () => {
  const d = await draft(),
    order = await createCheckout(d.id, d.revision, 100000, owner),
    p = await paymentFor(order.id);
  p.status = "REJECTED";
  const rejected = event(p, "payment.rejected");
  await consumeWebhook(rejected.body, rejected.headers);
  assert.equal((await getPaymentOrder(order.id, owner.id)).status, "REJECTED");
  p.status = "SUCCEEDED";
  const cancelled = event({ ...p, status: "CANCELLED" }, "payment.cancelled");
  await consumeWebhook(cancelled.body, cancelled.headers);
  assert.ok((await getPaymentOrder(order.id, owner.id)).url);
});
test("status lookup recovers success without a webhook; rapid lookups are throttled", async () => {
  const d = await draft(),
    order = await createCheckout(d.id, d.revision, 100000, owner),
    p = await paymentFor(order.id);
  p.status = "SUCCEEDED";
  await refreshPayment(order.id, owner.id);
  assert.equal((await getPaymentOrder(order.id, owner.id)).status, "PENDING");
  await sql`UPDATE payment_orders SET sync_after=now()-interval '1 minute' WHERE id=${order.id}`;
  await refreshPayment(order.id, owner.id);
  assert.ok((await getPaymentOrder(order.id, owner.id)).url);
});
test("publication validation failure preserves verified payment and can be corrected without charging again", async () => {
  const d = await draft(),
    order = await createCheckout(d.id, d.revision, 100000, owner),
    p = await paymentFor(order.id);
  d.content["uz-Latn"].venueName = "";
  const saved = await saveInvitation(d, owner);
  const success = event({ ...p, status: "SUCCEEDED" });
  await consumeWebhook(success.body, success.headers);
  const view = await getPaymentOrder(order.id, owner.id);
  assert.equal(view.status, "SUCCEEDED");
  assert.equal(view.url, null);
  assert.ok(view.publicationError);
  saved.content["uz-Latn"].venueName = "Corrected venue";
  const corrected = await saveInvitation(saved, owner);
  await publishInvitation(corrected.id, corrected.revision, owner);
  assert.ok((await getPaymentOrder(order.id, owner.id)).url);
});
test("cancellation preserves the draft and permits an explicitly retried new order", async () => {
  const d = await draft(),
    order = await createCheckout(d.id, d.revision, 100000, owner),
    p = await paymentFor(order.id);
  p.status = "CANCELLED";
  const cancelled = event(p, "payment.cancelled");
  await consumeWebhook(cancelled.body, cancelled.headers);
  assert.equal((await getPaymentOrder(order.id, owner.id)).url, null);
  const retry = await createCheckout(d.id, d.revision, 100000, owner);
  assert.notEqual(retry.id, order.id);
});
