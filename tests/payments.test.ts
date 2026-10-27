import test from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import {
  decimalToMinor,
  minorToDecimal,
  parseNodzeJson,
  verifyNodzeWebhook,
  safeCheckoutUrl,
  nodzeRequest,
} from "../apps/web/src/server/nodze";
import {
  paymentIdentity,
  nextPaymentState,
} from "../packages/contracts/src/payment";
import { completeInvitation } from "./fixtures/publication";

const secret = "mock-webhook-secret-only-for-tests";
test("out-of-order states cannot reopen checkout or undo success; rejection can resolve", () => {
  assert.equal(nextPaymentState("PROCESSING", "PENDING"), "PROCESSING");
  assert.equal(nextPaymentState("REJECTED", "PENDING"), "REJECTED");
  assert.equal(nextPaymentState("REJECTED", "SUCCEEDED"), "SUCCEEDED");
  assert.equal(nextPaymentState("SUCCEEDED", "CANCELLED"), "SUCCEEDED");
  assert.equal(nextPaymentState("CANCELLED", "PENDING"), "CANCELLED");
});
function signed(
  body: Buffer,
  id: string,
  timestamp = String(Math.floor(Date.now() / 1000)),
) {
  return new Headers({
    "X-Nodze-Event-Id": id,
    "X-Nodze-Timestamp": timestamp,
    "X-Nodze-Signature":
      "v1=" +
      createHmac("sha256", secret)
        .update(`${timestamp}.${id}.`)
        .update(body)
        .digest("hex"),
  });
}
test("decimal source text survives JSON parsing, without rounding high-value amounts", () => {
  const parsed = parseNodzeJson('{"amount":99999999999999999.99}') as {
    amount: string;
  };
  assert.equal(parsed.amount, "99999999999999999.99");
  assert.equal(decimalToMinor(parsed.amount), 9999999999999999999n);
  assert.equal(minorToDecimal(100000n), "1000.00");
  assert.equal(minorToDecimal(100001n), "1000.01");
  for (const value of [
    "NaN",
    "-1",
    "0.001",
    "1e3",
    "1000.000",
    "Infinity",
    "1,000",
  ])
    assert.throws(() => decimalToMinor(value));
});
test("webhooks authenticate exact UTF-8 bytes, headers, timestamp and matching event IDs", () => {
  process.env.NODZE_WEBHOOK_SECRET = secret;
  const id = randomUUID();
  const body = Buffer.from(
    JSON.stringify({
      id,
      type: "payment.succeeded",
      data: {
        paymentId: randomUUID(),
        orderId: randomUUID(),
        amount: 1000,
        currency: "UZS",
        status: "SUCCEEDED",
      },
      note: "Taklifnoma o‘zbekcha",
    }),
  );
  assert.equal(verifyNodzeWebhook(body, signed(body, id)).id, id);
  assert.throws(() =>
    verifyNodzeWebhook(
      Buffer.concat([body, Buffer.from(" ")]),
      signed(body, id),
    ),
  );
  assert.throws(() => verifyNodzeWebhook(body, new Headers()));
  for (const offset of [-301, 301]) {
    const time = String(Math.floor(Date.now() / 1000) + offset);
    assert.throws(() => verifyNodzeWebhook(body, signed(body, id, time)));
  }
  assert.throws(() => verifyNodzeWebhook(body, signed(body, randomUUID())));
  const malformed = signed(body, id);
  malformed.set("X-Nodze-Signature", "v1=nothex");
  assert.throws(() => verifyNodzeWebhook(body, malformed));
  const contradictory = Buffer.from(
    body.toString().replace('"status":"SUCCEEDED"', '"status":"PENDING"'),
  );
  assert.throws(() =>
    verifyNodzeWebhook(contradictory, signed(contradictory, id)),
  );
});
test("purchase identity ignores practical edits and revision but binds the event/template/names", () => {
  const invitation = completeInvitation(),
    before = paymentIdentity(invitation);
  invitation.revision++;
  invitation.content["uz-Latn"].venueName = "New venue";
  invitation.content["uz-Latn"].message = "Corrected text";
  assert.equal(paymentIdentity(invitation), before);
  for (const change of [
    (i: typeof invitation) => {
      i.templateId = "suzani";
    },
    (i: typeof invitation) => {
      i.startsAt = "2028-01-01T12:00";
    },
    (i: typeof invitation) => {
      i.content["uz-Latn"].people[0] = "Other person";
    },
  ]) {
    const copy = structuredClone(invitation);
    change(copy);
    assert.notEqual(paymentIdentity(copy), before);
  }
});
test("checkout URLs reject scripts, HTTP and embedded credentials", () => {
  for (const value of [
    "javascript:alert(1)",
    "http://checkout.example/",
    "https://key@checkout.example/",
  ])
    assert.throws(() => safeCheckoutUrl(value));
  assert.equal(safeCheckoutUrl(null), null);
  assert.equal(
    safeCheckoutUrl("https://my.click.uz/services/pay"),
    "https://my.click.uz/services/pay",
  );
});
test("provider errors are sanitized and network ambiguity is never called failure", async () => {
  const saved = globalThis.fetch;
  process.env.APP_URL = "https://invitation.example";
  process.env.NODZE_API_KEY = "mock-api-key";
  process.env.NODZE_WEBHOOK_SECRET = secret;
  try {
    globalThis.fetch = async () =>
      new Response("secret upstream diagnostics", { status: 429 });
    await assert.rejects(
      nodzeRequest("/payments/" + randomUUID()),
      (error: any) => error.status === 429 && !error.message.includes("secret"),
    );
    globalThis.fetch = async () => {
      throw new Error("secret timeout");
    };
    await assert.rejects(
      nodzeRequest("/payments/" + randomUUID()),
      (error: any) => error.code === "PAYMENT_UNCERTAIN",
    );
  } finally {
    globalThis.fetch = saved;
  }
});
