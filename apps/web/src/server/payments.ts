import { createHash, randomUUID } from "node:crypto";
import { getDb } from "@taklifnoma/database";
import {
  invitationSchema,
  templateById,
  type SessionUser,
} from "@taklifnoma/contracts";
import {
  paymentIdentity,
  nextPaymentState,
  type PaymentOrderView,
  type PaymentState,
  type InvitationPaymentContext,
} from "@taklifnoma/contracts/payment";
import { ApiError } from "./api";
import {
  assertPublishable,
  assertPublicMedia,
  publicInvitationUrl,
  publishInvitationInTransaction,
} from "./publication";
import {
  decimalToMinor,
  minorToDecimal,
  nodzeConfig,
  nodzeRequest,
  safeCheckoutUrl,
  verifyNodzeWebhook,
  type NodzePayment,
} from "./nodze";
import { toSessionUser } from "./auth";
import { getOwnedInvitation } from "./invitations";
import { enqueuePaymentNotifications } from "./payment-notifications";

type Order = {
  id: string;
  invitation_id: string;
  owner_id: string;
  template_id: string;
  template_name: string;
  identity_snapshot: string;
  amount_minor: string;
  currency: string;
  request_body: string;
  idempotency_key: string;
  payment_id: string | null;
  status: PaymentState;
  checkout_url: string | null;
  publication_error: string | null;
  fulfilled_at: Date | null;
  slug?: string | null;
};

export async function paymentBudget() {
  const [limit] =
    await getDb()`INSERT INTO rate_limits(key,count) VALUES('nodze-project',1)
    ON CONFLICT(key) DO UPDATE SET
    count=CASE WHEN rate_limits.window_start<date_trunc('minute',now()) THEN 1 ELSE rate_limits.count+1 END,
    window_start=CASE WHEN rate_limits.window_start<date_trunc('minute',now()) THEN now() ELSE rate_limits.window_start END RETURNING count`;
  if (limit.count > 100)
    throw new ApiError(
      429,
      "PAYMENT_RATE_LIMIT",
      "Bir daqiqadan so‘ng qayta tekshiring.",
    );
}
export async function createCheckout(
  id: string,
  revision: number,
  expectedAmountMinor: number,
  user: SessionUser,
) {
  if (process.env.PUBLISHING_MODE !== "paid")
    throw new ApiError(409, "CHECKOUT_DISABLED", "To‘lov hozir yoqilmagan.");
  const config = nodzeConfig();
  const order = await getDb().begin(async (tx) => {
    const [row] =
      await tx`SELECT * FROM invitations WHERE id=${id} AND owner_id=${user.id} FOR UPDATE`;
    if (!row || row.status === "deleted")
      throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
    if (row.status !== "draft")
      throw new ApiError(
        409,
        "NOT_DRAFT",
        "To‘lovni faqat qoralama uchun boshlash mumkin.",
      );
    const invitation = invitationSchema.parse(row.data);
    if (invitation.revision !== revision)
      throw new ApiError(
        409,
        "STALE_REVISION",
        "Taklifnoma o‘zgargan. Yangilangan nusxani oching.",
      );
    assertPublishable(invitation);
    await assertPublicMedia(tx, invitation, user.id);
    const [event] =
      await tx`SELECT (((${invitation.startsAt}::timestamp)::date+1)::timestamp AT TIME ZONE ${invitation.timezone})<=now() AS ended`;
    if (event.ended)
      throw new ApiError(400, "EVENT_ENDED", "Tadbir sanasini tekshiring.");
    const [template] =
      await tx`SELECT t.*,EXISTS(SELECT 1 FROM template_supported_event_types s WHERE s.template_id=t.id AND s.event_type=${invitation.eventType}) AS supports_event FROM templates t WHERE t.id=${invitation.templateId} FOR SHARE OF t`;
    if (
      !templateById(invitation.templateId) ||
      !template?.published ||
      !template.supports_event
    )
      throw new ApiError(
        409,
        "TEMPLATE_UNAVAILABLE",
        "Dizayn mavjud emas yoki tadbirga mos emas.",
      );
    const [existing] = await tx<
      Order[]
    >`SELECT * FROM payment_orders WHERE invitation_id=${id} AND status NOT IN ('FAILED','CANCELLED','EXPIRED') FOR UPDATE`;
    if (existing) {
      if (existing.identity_snapshot !== paymentIdentity(invitation))
        throw new ApiError(
          409,
          "ORDER_MISMATCH",
          "Buyurtma boshqa tadbir uchun.",
        );
      if (Number(existing.amount_minor) !== expectedAmountMinor)
        throw new ApiError(
          409,
          "PRICE_CHANGED",
          `Avvalgi buyurtma narxi ${minorToDecimal(BigInt(existing.amount_minor))} so‘m. To‘lov sahifasida davom eting.`,
        );
      return existing;
    }
    if (
      template.currency !== "UZS" ||
      Number(template.price_minor) !== expectedAmountMinor
    )
      throw new ApiError(
        409,
        "PRICE_CHANGED",
        "Dizayn narxi o‘zgardi. Sahifani yangilang va yangi narxni tekshiring.",
      );
    const orderId = randomUUID();
    const decimal = minorToDecimal(BigInt(template.price_minor));
    // Serialize decimal as a JSON number literal without binary floating point.
    const requestBody = JSON.stringify({
      orderId,
      currency: "UZS",
      provider: "click",
      description: `Taklifnoma: ${template.name}`.slice(0, 500),
      customerReference: user.id,
      successUrl: config.returnUrl,
      cancelUrl: config.returnUrl,
    }).replace(/}$/, `,"amount":${decimal}}`);
    const [created] = await tx<
      Order[]
    >`INSERT INTO payment_orders(id,invitation_id,owner_id,template_id,template_name,identity_snapshot,amount_minor,currency,request_body,idempotency_key)
      VALUES(${orderId},${id},${user.id},${invitation.templateId},${template.name},${paymentIdentity(invitation)},${template.price_minor},'UZS',${requestBody},${"create:" + orderId}) RETURNING *`;
    return created;
  });
  if (!order.payment_id) {
    await paymentBudget();
    const payment = await nodzeRequest(
      "/payments",
      order.request_body,
      order.idempotency_key,
    );
    matchPayment(order, payment);
    await applyPayment(payment);
  } else {
    await refreshPayment(order.id, user.id);
  }
  return getPaymentOrder(order.id, user.id);
}
function matchPayment(order: Order, payment: NodzePayment) {
  if (
    order.id !== payment.orderId ||
    (order.payment_id && order.payment_id !== payment.id) ||
    order.currency !== payment.currency ||
    BigInt(order.amount_minor) !== decimalToMinor(payment.amount)
  )
    throw new ApiError(
      409,
      "PAYMENT_MISMATCH",
      "To‘lov va buyurtma ma’lumotlari mos emas.",
    );
}

// Lock order is always invitation -> payment, shared by save/checkout/publication.
export async function applyPayment(
  payment: NodzePayment,
  event?: { id: string; hash: string },
) {
  return getDb().begin(async (tx) => {
    const [found] = await tx<
      Order[]
    >`SELECT * FROM payment_orders WHERE id=${payment.orderId}`;
    if (!found)
      throw new ApiError(404, "ORDER_NOT_FOUND", "Buyurtma topilmadi.");
    await tx`SELECT id FROM invitations WHERE id=${found.invitation_id} FOR UPDATE`;
    const [order] = await tx<
      Order[]
    >`SELECT * FROM payment_orders WHERE id=${found.id} FOR UPDATE`;
    matchPayment(order, payment);
    if (event) {
      const [previous] =
        await tx`SELECT * FROM payment_webhook_events WHERE event_id=${event.id}`;
      if (previous) {
        if (previous.order_id !== order.id || previous.body_hash !== event.hash)
          throw new ApiError(
            409,
            "EVENT_CONFLICT",
            "Webhook takroriy ma’lumotlari mos emas.",
          );
        return;
      }
    }
    // Stale create responses/events must never downgrade verified success or refunds.
    const next = nextPaymentState(order.status, payment.status);
    const checkout = safeCheckoutUrl(payment.checkoutUrl);
    await tx`UPDATE payment_orders SET payment_id=${payment.id},status=${next},
      checkout_url=COALESCE(${checkout},checkout_url),verified_at=CASE WHEN ${next}='SUCCEEDED' THEN COALESCE(verified_at,now()) ELSE verified_at END,
      updated_at=now(),sync_after=GREATEST(sync_after,now()+interval '30 seconds') WHERE id=${order.id}`;
    if (next === "SUCCEEDED" && !order.fulfilled_at) {
      const [owner] =
        await tx`SELECT * FROM users WHERE id=${order.owner_id} AND disabled_at IS NULL AND phone_shared_at IS NOT NULL FOR SHARE`;
      try {
        if (!owner)
          throw new ApiError(
            403,
            "ACCOUNT_UNAVAILABLE",
            "Hisobga kirish cheklangan.",
          );
        await tx.savepoint(async (savepoint) => {
          const [invitation] =
            await savepoint`SELECT data FROM invitations WHERE id=${order.invitation_id}`;
          const data = invitationSchema.parse(invitation.data);
          if (paymentIdentity(data) !== order.identity_snapshot)
            throw new ApiError(
              409,
              "ORDER_MISMATCH",
              "To‘langan dizayn yoki tadbir almashtirilgan.",
            );
          await publishInvitationInTransaction(
            savepoint,
            data.id,
            data.revision,
            toSessionUser(owner),
          );
          await savepoint`UPDATE payment_orders SET fulfilled_at=now(),publication_error=NULL WHERE id=${order.id}`;
        });
      } catch (error) {
        if (!(error instanceof ApiError)) throw error;
        // Payment remains confirmed when content/media/catalog needs correction.
        await tx`UPDATE payment_orders SET publication_error=${error.message} WHERE id=${order.id}`;
      }
    }
    if (next === "SUCCEEDED")
      await enqueuePaymentNotifications(tx, order.invitation_id);
    if (event)
      await tx`INSERT INTO payment_webhook_events(event_id,order_id,body_hash) VALUES(${event.id},${order.id},${event.hash})`;
  });
}
export async function consumeWebhook(raw: Buffer, headers: Headers) {
  const event = verifyNodzeWebhook(raw, headers);
  const hash = createHash("sha256").update(raw).digest("hex");
  const [previous] =
    await getDb()`SELECT body_hash FROM payment_webhook_events WHERE event_id=${event.id}`;
  if (previous) {
    if (previous.body_hash !== hash)
      throw new ApiError(
        409,
        "EVENT_CONFLICT",
        "Webhook ma’lumotlari o‘zgargan.",
      );
    return event.data.orderId;
  }
  let payment: NodzePayment = {
    id: event.data.paymentId,
    ...event.data,
    provider: "click",
  };
  if (event.type !== "payment.succeeded") {
    // REJECTED can resolve later; do not trust delivery order for competing events.
    await paymentBudget();
    payment = await nodzeRequest(`/payments/${event.data.paymentId}`);
    if (
      payment.id !== event.data.paymentId ||
      payment.orderId !== event.data.orderId ||
      payment.currency !== event.data.currency ||
      decimalToMinor(payment.amount) !== decimalToMinor(event.data.amount)
    )
      throw new ApiError(
        409,
        "PAYMENT_MISMATCH",
        "Webhook va to‘lov mos emas.",
      );
  }
  await applyPayment(payment, { id: event.id, hash });
  return event.data.orderId;
}
export async function refreshPayment(id: string, userId?: string) {
  const sql = getDb();
  const rows = await sql<
    Order[]
  >`UPDATE payment_orders SET sync_after=now()+interval '30 seconds'
    WHERE id=${id} AND (${userId ?? null}::uuid IS NULL OR owner_id=${userId ?? null}) AND sync_after<=now()
    AND status NOT IN ('FAILED','CANCELLED','EXPIRED','REFUND_PENDING','PARTIALLY_REFUNDED','REFUNDED') AND fulfilled_at IS NULL RETURNING *`;
  if (!rows[0]) return;
  const order = rows[0];
  await paymentBudget();
  try {
    const payment = order.payment_id
      ? await nodzeRequest(`/payments/${order.payment_id}`)
      : await nodzeRequest(
          "/payments",
          order.request_body,
          order.idempotency_key,
        );
    matchPayment(order, payment);
    await applyPayment(payment);
  } catch (error) {
    if (error instanceof ApiError && error.status === 429)
      await sql`UPDATE payment_orders SET sync_after=now()+interval '60 seconds' WHERE id=${id}`;
    throw error;
  }
}
function orderView(order: Order): PaymentOrderView {
  return {
    id: order.id,
    invitationId: order.invitation_id,
    templateName: order.template_name,
    amountMinor: Number(order.amount_minor),
    status: order.status,
    checkoutUrl: ["CREATED", "PENDING"].includes(order.status)
      ? order.checkout_url
      : null,
    url: order.slug ? publicInvitationUrl(order.slug) : null,
    publicationError: order.publication_error,
  };
}
export async function getPaymentOrder(id: string, userId: string) {
  const [row] = await getDb()<
    Order[]
  >`SELECT p.*,CASE WHEN i.status='published' THEN i.slug END AS slug FROM payment_orders p JOIN invitations i ON i.id=p.invitation_id WHERE p.id=${id} AND p.owner_id=${userId}`;
  if (!row) throw new ApiError(404, "NOT_FOUND", "Buyurtma topilmadi.");
  return orderView(row);
}
export async function listPaymentOrders(userId: string) {
  const rows = await getDb()<
    Order[]
  >`SELECT p.*,CASE WHEN i.status='published' THEN i.slug END AS slug FROM payment_orders p JOIN invitations i ON i.id=p.invitation_id WHERE p.owner_id=${userId} ORDER BY p.created_at DESC LIMIT 20`;
  return rows.map(orderView);
}

/** Resolve the current attempt for one owned invitation, including old return links. */
export async function getInvitationPayment(
  invitationId: string,
  userId: string,
  explicitOrder?: PaymentOrderView,
): Promise<InvitationPaymentContext> {
  const invitation = await getOwnedInvitation(invitationId, userId);
  if (
    !invitation ||
    (explicitOrder && explicitOrder.invitationId !== invitationId)
  )
    throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
  const [template] =
    await getDb()`SELECT name,price_minor FROM templates WHERE id=${invitation.templateId}`;
  const [row] = await getDb()<
    Order[]
  >`SELECT p.*,CASE WHEN i.status='published' THEN i.slug END AS slug
      FROM payment_orders p JOIN invitations i ON i.id=p.invitation_id
      WHERE p.invitation_id=${invitationId} AND p.owner_id=${userId}
      ORDER BY p.created_at DESC,p.id DESC LIMIT 1`;
  const order = row ? orderView(row) : null;
  return {
    invitation,
    order,
    template: template
      ? {
          name: String(template.name),
          priceMinor: Number(template.price_minor),
        }
      : null,
    publishingMode: process.env.PUBLISHING_MODE === "paid" ? "paid" : "free",
  };
}
export async function reconcilePayments() {
  const rows =
    await getDb()`SELECT id FROM payment_orders WHERE fulfilled_at IS NULL AND sync_after<=now() AND status IN ('CREATED','PENDING','PROCESSING','REJECTED','SUCCEEDED') ORDER BY sync_after LIMIT 10`;
  let checked = 0;
  let failed = 0;
  for (const row of rows) {
    try {
      await refreshPayment(row.id);
      checked++;
    } catch (error) {
      failed++;
      console.error(
        "Payment reconciliation failed",
        error instanceof ApiError ? error.code : "UNEXPECTED",
      );
      if (error instanceof ApiError && error.status === 429) break;
    }
  }
  return { checked, failed };
}
