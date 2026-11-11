// Disposable database records, mocked provider, no live payments or messages.
import test from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import { getDb, closeDb } from "../packages/database/src/index";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import type { SessionUser } from "../packages/contracts/src/index";
import {
  createCheckout,
  consumeWebhook,
  getPaymentOrder,
} from "../apps/web/src/server/payments";
import { assertStaticImageEntitlement } from "../apps/web/src/server/static-image-entitlement";
import { downloadStaticImage } from "../apps/web/src/server/static-images";
import { saveInvitation } from "../apps/web/src/server/invitations";
import { completeInvitation } from "./fixtures/publication";

test("5,000 UZS image checkout grants one-event PNG downloads without website publication", async () => {
  const sql = getDb();
  const owner: SessionUser = {
    id: randomUUID(),
    telegramUserId: "",
    displayName: "Disposable image payment",
    isAdmin: false,
  };
  let invitation = normalizeInvitation({
    ...completeInvitation(),
    templateId: "oq-atirgul",
  });
  const originalFetch = globalThis.fetch;
  const originalCwd = process.cwd();
  const secret = "mock-static-image-payment-secret";
  let provider: Record<string, unknown> | undefined;
  let providerRequests = 0;
  const originalEnv = {
    key: process.env.NODZE_API_KEY,
    secret: process.env.NODZE_WEBHOOK_SECRET,
    base: process.env.NODZE_API_BASE_URL,
    url: process.env.APP_URL,
  };
  process.env.NODZE_API_KEY = "mock-no-live-credentials";
  process.env.NODZE_WEBHOOK_SECRET = secret;
  process.env.NODZE_API_BASE_URL = "https://payments.nodze.org/api/v1";
  process.env.APP_URL = "https://invitations.example";
  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), "https://payments.nodze.org/api/v1/payments");
    assert.equal(init?.method, "POST");
    const body = JSON.parse(String(init?.body));
    assert.equal(body.amount, 5000);
    assert.match(String(init?.body), /"amount":5000\.00/);
    providerRequests++;
    provider = {
      id: randomUUID(),
      orderId: body.orderId,
      amount: "5000.00",
      currency: "UZS",
      provider: "click",
      status: "PENDING",
      checkoutUrl: "https://my.click.uz/services/pay?fixture=image",
    };
    return Response.json(provider, { status: 201 });
  };
  const rejected = (promise: Promise<unknown>, code: string) =>
    assert.rejects(promise, (error: any) => error.code === code);
  try {
    await sql`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${owner.id},${-Math.floor(Math.random() * 1e13) - 1},'Disposable image payment')`;
    await sql`INSERT INTO invitations(id,owner_id,template_id,data) VALUES(${invitation.id},${owner.id},${invitation.templateId},${sql.json(invitation)})`;
    await rejected(
      downloadStaticImage(invitation.id, invitation.revision, "uz-Latn", owner),
      "PAYMENT_REQUIRED",
    );
    // Neither a prior free-testing export nor a zero catalog price grants access.
    await rejected(
      assertStaticImageEntitlement(sql, {
        ...invitation,
        imageExportedAt: new Date().toISOString(),
      }, owner.id),
      "PAYMENT_REQUIRED",
    );
    await sql.begin(async (tx) => {
      await tx`UPDATE templates SET price_minor=0 WHERE id=${invitation.templateId}`;
      await rejected(assertStaticImageEntitlement(tx, invitation, owner.id), "PAYMENT_REQUIRED");
      // Roll back the temporary catalog change even if the assertion fails.
      throw new Error("rollback-zero-price-fixture");
    }).catch((error) => {
      if (error.message !== "rollback-zero-price-fixture") throw error;
    });
    await rejected(
      createCheckout(invitation.id, invitation.revision, 1, owner),
      "PRICE_CHANGED",
    );
    assert.equal(providerRequests, 0);
    const order = await createCheckout(
      invitation.id,
      invitation.revision,
      500000,
      owner,
    );
    assert.equal(order.amountMinor, 500000);
    assert.equal(order.status, "PENDING");
    await rejected(
      assertStaticImageEntitlement(sql, invitation, owner.id),
      "PAYMENT_REQUIRED",
    );
    const eventId = randomUUID(),
      timestamp = String(Math.floor(Date.now() / 1000));
    const raw = Buffer.from(
      JSON.stringify({
        id: eventId,
        type: "payment.succeeded",
        data: {
          paymentId: provider!.id,
          orderId: order.id,
          amount: "5000.00",
          currency: "UZS",
          status: "SUCCEEDED",
        },
      }),
    );
    const headers = new Headers({
      "x-nodze-event-id": eventId,
      "x-nodze-timestamp": timestamp,
      "x-nodze-signature":
        "v1=" +
        createHmac("sha256", secret)
          .update(`${timestamp}.${eventId}.`)
          .update(raw)
          .digest("hex"),
    });
    await consumeWebhook(raw, headers);
    await consumeWebhook(raw, headers);
    assert.equal(
      (await getPaymentOrder(order.id, owner.id)).publicationError,
      null,
    );
    const [paid] =
      await sql`SELECT i.status,i.slug,i.identity_locked_at,i.data,p.fulfilled_at FROM invitations i JOIN payment_orders p ON p.invitation_id=i.id WHERE i.id=${invitation.id}`;
    assert.equal(paid.status, "draft");
    assert.equal(paid.slug, null);
    assert.equal(paid.identity_locked_at, null);
    assert.ok(paid.fulfilled_at);
    assert.equal(paid.data.imageExportedAt, undefined);
    await assertStaticImageEntitlement(sql, invitation, owner.id);
    await rejected(
      assertStaticImageEntitlement(sql, invitation, randomUUID()),
      "PAYMENT_REQUIRED",
    );
    const changed = structuredClone(invitation);
    changed.content["uz-Latn"].people[0] = "Different person";
    await rejected(
      assertStaticImageEntitlement(sql, changed, owner.id),
      "PAYMENT_REQUIRED",
    );
    process.chdir(path.resolve(originalCwd, "apps/web"));
    const image = await downloadStaticImage(
      invitation.id,
      invitation.revision,
      "uz-Latn",
      owner,
    );
    const metadata = await sharp(image.bytes).metadata();
    assert.deepEqual(
      [metadata.width, metadata.height, metadata.format],
      [1500, 2100, "png"],
    );
    assert.ok(image.exportedAt);
    invitation = (
      await sql`SELECT data FROM invitations WHERE id=${invitation.id}`
    )[0].data;
    const practical = structuredClone(invitation);
    practical.startsAt = practical.startsAt.slice(0, 11) + "17:30";
    practical.content["uz-Latn"].address = "Updated venue address";
    invitation = await saveInvitation(practical, owner);
    const repeat = await downloadStaticImage(
      invitation.id,
      invitation.revision,
      "uz-Latn",
      owner,
    );
    assert.equal(repeat.exportedAt, image.exportedAt);
    await rejected(
      assertStaticImageEntitlement(sql, invitation, randomUUID()),
      "PAYMENT_REQUIRED",
    );
    const swapped = structuredClone(invitation);
    swapped.content["uz-Latn"].people[0] = "Unpaid different event";
    await rejected(assertStaticImageEntitlement(sql, swapped, owner.id), "PAYMENT_REQUIRED");
    assert.equal(providerRequests, 1);
    assert.equal(
      (
        await sql`SELECT count(*)::int AS count FROM payment_orders WHERE invitation_id=${invitation.id}`
      )[0].count,
      1,
    );
  } finally {
    process.chdir(originalCwd);
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries({
      NODZE_API_KEY: originalEnv.key,
      NODZE_WEBHOOK_SECRET: originalEnv.secret,
      NODZE_API_BASE_URL: originalEnv.base,
      APP_URL: originalEnv.url,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await sql.begin(async (tx) => {
      await tx`DELETE FROM jobs WHERE type='payment-confirmation' AND payload->>'orderId' IN (SELECT id::text FROM payment_orders WHERE owner_id=${owner.id})`;
      await tx`DELETE FROM payment_webhook_events WHERE order_id IN (SELECT id FROM payment_orders WHERE owner_id=${owner.id})`;
      await tx`DELETE FROM payment_orders WHERE owner_id=${owner.id}`;
      await tx`DELETE FROM invitation_audit_log WHERE invitation_id=${invitation.id}`;
      await tx`DELETE FROM invitations WHERE owner_id=${owner.id}`;
      await tx`DELETE FROM users WHERE id=${owner.id}`;
    });
    await closeDb();
  }
});
