import test from "node:test";
import assert from "node:assert/strict";
import {
  paymentReturnPath,
  telegramPaymentReturnLink,
  miniAppPaymentDestination,
  rememberedPaymentOrder,
  rememberPaymentOrder,
} from "../apps/web/src/modules/payments/payment-navigation";

const id = "f9986cab-2ccf-4d14-afd0-bf17858ce154";
const user = {
  id: "creator",
  telegramUserId: "123",
  displayName: "Creator",
  phoneShared: true,
  isAdmin: false,
};

test("return links open the confirmation chat without /start, and Main Mini App only when enabled", () => {
  assert.equal(
    telegramPaymentReturnLink("@fixture_bot"),
    "https://t.me/fixture_bot",
  );
  assert.equal(
    telegramPaymentReturnLink("fixture_bot", id),
    "https://t.me/fixture_bot",
  );
  assert.equal(
    telegramPaymentReturnLink("fixture_bot", id, true),
    `https://t.me/fixture_bot?startapp=payment_return_${id}`,
  );
  assert.equal(
    telegramPaymentReturnLink("fixture_bot", "https://attacker.example"),
    "https://t.me/fixture_bot",
  );
  for (const bot of [
    undefined,
    "",
    "https://t.me/fixture_bot",
    "fixture_bot?start=evil",
    "fixture_bot/evil",
  ])
    assert.equal(telegramPaymentReturnLink(bot), null);
});

test("payment destinations are allowlisted navigation hints, with no arbitrary redirect", () => {
  assert.equal(paymentReturnPath("payment_return"), "/payment/return");
  assert.equal(
    paymentReturnPath(`payment_return_${id}`),
    `/payment/return?order=${id}`,
  );
  for (const param of [
    undefined,
    null,
    "",
    "https://attacker.example",
    "//attacker.example",
    "payment_return_/admin",
    `payment_return_${id}&paid=true`,
    "payment_return_../admin",
    "payment_return_" + "a".repeat(100),
  ])
    assert.equal(paymentReturnPath(param), null);
});

test("payment launches need a verified session/phone and can route admins to their own payment workspace", () => {
  const data = `start_param=payment_return_${id}&user=opaque&hash=opaque`;
  assert.equal(
    miniAppPaymentDestination(data, user),
    `/payment/return?order=${id}`,
  );
  assert.equal(
    miniAppPaymentDestination(data, { ...user, isAdmin: true }),
    `/payment/return?order=${id}`,
  );
  assert.equal(miniAppPaymentDestination(data, null), null);
  assert.equal(
    miniAppPaymentDestination(data, { ...user, phoneShared: false }),
    null,
  );
  assert.equal(miniAppPaymentDestination("", user), null);
  assert.equal(miniAppPaymentDestination("start_param=/admin", user), null);
});

test("remembered order IDs are isolated by verified account and storage denial is recoverable", () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    },
  });
  try {
    rememberPaymentOrder("account-a", id);
    assert.equal(rememberedPaymentOrder("account-a"), id);
    assert.equal(rememberedPaymentOrder("account-b"), "");
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new Error("denied");
      },
    });
    assert.equal(rememberedPaymentOrder("account-a"), "");
    assert.doesNotThrow(() => rememberPaymentOrder("account-a", id));
  } finally {
    if (previous) Object.defineProperty(globalThis, "localStorage", previous);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
