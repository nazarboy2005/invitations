import test from "node:test";
import assert from "node:assert/strict";
import {
  paymentTelegramMessage,
  sendPaymentConfirmation,
  type TelegramPaymentOrder,
} from "../apps/web/src/server/payment-notifications";
import { completeInvitation } from "./fixtures/publication";

const data = completeInvitation();
data.content["uz-Latn"].people = ["Ali <test>", "Malika & family"];
const order: TelegramPaymentOrder = {
  id: data.id,
  invitation_id: data.id,
  template_name: "Anor & <gold>",
  amount_minor: "100000",
  status: "SUCCEEDED",
  verified_at: new Date(),
  fulfilled_at: new Date(),
  invitation_status: "published",
  slug: "Ab1234",
  data,
};
process.env.APP_URL = "https://invitation.example";

test("verified, published payment has an escaped formatted receipt, amount and usable invitation URL", () => {
  const message = paymentTelegramMessage(order);
  assert.equal(message.parse_mode, "HTML");
  assert.match(message.text, /<b>To‘lov muvaffaqiyatli tasdiqlandi!<\/b>/);
  assert.match(message.text, /Ali &lt;test&gt;/);
  assert.match(message.text, /Malika &amp; family/);
  assert.match(message.text, /Anor &amp; &lt;gold&gt;/);
  assert.match(message.text, /1\s*000/);
  assert.match(message.text, /https:\/\/invitation.example\/i\/Ab1234/);
  assert.equal(
    message.reply_markup.inline_keyboard[0][0].url,
    "https://invitation.example/i/Ab1234",
  );
  assert.equal(
    message.reply_markup.inline_keyboard[1][0].web_app?.url,
    "https://invitation.example/dashboard?mode=personal",
  );
});

test("pending/failed/unverified payments never get success or an invitation link", () => {
  for (const change of [
    { status: "PENDING" },
    { status: "PROCESSING" },
    { status: "CANCELLED" },
    { status: "SUCCEEDED", verified_at: null },
  ]) {
    const message = paymentTelegramMessage({ ...order, ...change });
    assert.doesNotMatch(
      message.text,
      /muvaffaqiyatli|nashr qilindi|\/i\/Ab1234/,
    );
    assert.equal(
      message.reply_markup.inline_keyboard.some((row) =>
        row.some((button) => "url" in button),
      ),
      false,
    );
  }
});

test("verified payment awaiting publication is acknowledged without inventing a public URL", () => {
  for (const change of [
    { fulfilled_at: null, invitation_status: "draft" },
    { invitation_status: "archived" },
    { slug: "invalid/slug" },
  ]) {
    const message = paymentTelegramMessage({ ...order, ...change });
    assert.match(message.text, /To‘lov qabul qilindi/);
    assert.doesNotMatch(
      message.text,
      /nashr qilindi|https:\/\/invitation.example\/i\//,
    );
  }
  assert.doesNotMatch(paymentTelegramMessage(null).text, /To‘lov.*tasdiqlandi/);
});

test("Telegram sends use HTML; explicit rate limits can retry, ambiguous outcomes cannot", async () => {
  const originalFetch = globalThis.fetch;
  process.env.TELEGRAM_BOT_TOKEN = "fixture-token";
  try {
    let sent: any;
    globalThis.fetch = async (_input, init) => {
      sent = JSON.parse(String(init?.body));
      return Response.json({ ok: true, result: { message_id: 7 } });
    };
    assert.deepEqual(
      await sendPaymentConfirmation("123", paymentTelegramMessage(order)),
      { state: "sent" },
    );
    assert.equal(sent.chat_id, "123");
    assert.equal(sent.parse_mode, "HTML");
    globalThis.fetch = async () =>
      Response.json(
        { ok: false, error_code: 429, parameters: { retry_after: 42 } },
        { status: 429 },
      );
    assert.deepEqual(
      await sendPaymentConfirmation("123", paymentTelegramMessage(order)),
      { state: "retry", after: 42 },
    );
    globalThis.fetch = async () =>
      Response.json({ ok: false, error_code: 403 }, { status: 403 });
    assert.deepEqual(
      await sendPaymentConfirmation("123", paymentTelegramMessage(order)),
      { state: "failed" },
    );
    globalThis.fetch = async () => {
      throw new Error("network timeout");
    };
    assert.deepEqual(
      await sendPaymentConfirmation("123", paymentTelegramMessage(order)),
      { state: "uncertain" },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
