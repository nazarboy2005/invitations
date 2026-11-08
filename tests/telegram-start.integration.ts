// Disposable database identity only; all Telegram requests are intercepted.
import test from "node:test";
import assert from "node:assert/strict";
import { randomInt } from "node:crypto";
import { getDb, closeDb } from "../packages/database/src/index";
import { processTelegramUpdate } from "../apps/web/src/server/auth/telegram";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";

test("bot welcome and login use Telegram identity without collecting phone numbers", async (t) => {
  const db = getDb();
  const originalFetch = globalThis.fetch;
  const environment = {
    APP_URL: process.env.APP_URL,
  };
  const origin = "https://invitation.example";
  process.env.APP_URL = origin;
  const telegramId = randomInt(1e12);
  const updates: number[] = [];
  const calls: { method: string; body: any }[] = [];

  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    assert.equal(url.hostname, "api.telegram.org");
    const body = JSON.parse(String(init?.body));
    const markup = body.reply_markup;
    if (markup) {
      // Telegram keyboard variants cannot be combined in a single payload.
      assert.equal(
        [
          "keyboard",
          "inline_keyboard",
          "remove_keyboard",
          "force_reply",
        ].filter((key) => key in markup).length,
        1,
      );
    }
    calls.push({ method: url.pathname.split("/").at(-1)!, body });
    return Response.json({ ok: true });
  };

  async function deliver(fields: Record<string, unknown>, name = "Nodir") {
    calls.length = 0;
    const updateId = randomInt(1e12);
    updates.push(updateId);
    const update = {
      update_id: updateId,
      message: {
        message_id: 1,
        chat: { id: telegramId, type: "private" },
        from: { id: telegramId, first_name: name },
        ...fields,
      },
    };
    await processTelegramUpdate(update);
    return update;
  }

  function assertMiniApp(body: any, expectedUrl = origin) {
    assert.deepEqual(body.reply_markup, {
      inline_keyboard: [
        [{ text: "🌸 Taklifnoma yaratish", web_app: { url: expectedUrl } }],
      ],
    });
  }

  try {
    await t.test(
      "new users see one complete welcome without phone input",
      async () => {
        const update = await deliver({ text: "/start" });
        assert.equal(calls.length, 1);
        assert.ok(calls.every((call) => call.method === "sendMessage"));
        const welcome = calls[0].body;
        assert.equal(welcome.parse_mode, "HTML");
        assert.ok(
          welcome.text.startsWith(
            "<b>Fotiha</b> ♡\n\nAssalomu alaykum, <b>Nodir</b>! 👋",
          ),
        );
        const quotes = [
          ...welcome.text.matchAll(/<blockquote>(.*?)<\/blockquote>/gs),
        ];
        assert.deepEqual(
          quotes.map((quote) => quote[1]),
          [
            "<i><b>Baxt</b> — quvonchingizni siz uchun eng aziz insonlar bilan baham ko‘rishdir.</i>",
            "<i><b>To‘y</b> esa ana shunday baxt ulashuvchi unutilmas kunlardan biridir.</i>",
          ],
        );
        assert.match(welcome.text, /<\/blockquote>\n\n<blockquote>/);
        assert.ok(
          welcome.text.includes(
            '<b>🌿<a href="https://fotiha.uz/">Fotiha</a></b>',
          ),
        );
        assert.ok(
          welcome.text.includes(
            "🤫 Kichik bir sir: <tg-spoiler>Eng go‘zal xotiralar eng samimiy taklifdan boshlanadi.</tg-spoiler>",
          ),
        );
        assert.deepEqual(welcome.link_preview_options, { is_disabled: true });
        assert.ok(welcome.text.endsWith("\n\nBoshlaymizmi?"));
        assertMiniApp(welcome);
        assert.ok(
          calls.every(
            ({ body }) => !body.text.includes("Telefon raqamingizni ulashing"),
          ),
        );
        await processTelegramUpdate(update);
        assert.equal(
          calls.length,
          1,
          "delivery retries must not send duplicate welcomes",
        );
      },
    );

    await t.test(
      "website login confirms Telegram identity without asking for a phone",
      async () => {
        const token = randomToken();
        const [auth] =
          await db`INSERT INTO auth_requests(token_hash,browser_hash,expires_at) VALUES(${digest(token)},${digest(randomToken())},now()+interval '5 minutes') RETURNING id`;
        try {
          await deliver({ text: `/start auth_${token}` });
          assert.equal(calls.length, 1);
          assert.match(calls[0].body.text, /Kirish tasdiqlandi/);
          assertMiniApp(calls[0].body);
          const [confirmed] =
            await db`SELECT state FROM auth_requests WHERE id=${auth.id}`;
          assert.equal(confirmed.state, "confirmed");
        } finally {
          await db`DELETE FROM auth_requests WHERE id=${auth.id}`;
        }
      },
    );

    await t.test(
      "unsolicited own, forwarded, and other contacts are ignored",
      async () => {
        for (const contact of [
          { user_id: telegramId, phone_number: "+998901234567" },
          { user_id: telegramId + 1, phone_number: "+998901234568" },
        ]) {
          await deliver({ contact });
          assert.equal(calls.length, 0);
        }
        await deliver({
          contact: { user_id: telegramId, phone_number: "+998901234567" },
          forward_origin: { type: "user" },
        });
        assert.equal(calls.length, 0);
        const [user] =
          await db`SELECT * FROM users WHERE telegram_user_id=${String(telegramId)}`;
        // Compatible during deployment before or after the drop-column migration.
        assert.ok(user.phone_number == null);
        assert.ok(user.phone_shared_at == null);
        assert.ok(user.phone_source == null);
      },
    );

    await t.test(
      "returning users receive just one welcome and no phone input",
      async () => {
        await deliver({ text: "/start" }, '<Nodir & "Ali">');
        assert.equal(calls.length, 1);
        const welcome = calls[0].body;
        assert.ok(
          welcome.text.includes(
            "<b>&lt;Nodir &amp; &quot;Ali&quot;&gt;</b>! 👋",
          ),
        );
        assert.ok(welcome.text.endsWith("\n\nBoshlaymizmi?"));
        assertMiniApp(welcome);
        await deliver({ text: "/start phone" });
        assert.equal(calls.length, 1);
        assertMiniApp(calls[0].body);
        assert.match(calls[0].body.text, /Boshlaymizmi/);
      },
    );

    await t.test(
      "the welcome retains administrator routing and disabled-account checks",
      async () => {
        await db`UPDATE users SET is_admin=true WHERE telegram_user_id=${String(telegramId)}`;
        await deliver({ text: "/start" });
        assert.equal(calls.length, 1);
        assertMiniApp(calls[0].body, origin + "/dashboard");
        await deliver({ text: "/admin" });
        assert.equal(calls.length, 1);
        assert.equal(
          calls[0].body.reply_markup.inline_keyboard[0][0].web_app.url,
          origin + "/dashboard",
        );
        await db`UPDATE users SET disabled_at=now() WHERE telegram_user_id=${String(telegramId)}`;
        await deliver({ text: "/start" });
        assert.equal(calls.length, 1);
        assert.match(calls[0].body.text, /cheklangan/);
        assert.equal(calls[0].body.reply_markup, undefined);
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(environment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    try {
      await db.begin(async (tx) => {
        for (const updateId of updates)
          await tx`DELETE FROM telegram_updates WHERE update_id=${updateId}`;
        await tx`DELETE FROM telegram_connections WHERE user_id IN (SELECT id FROM users WHERE telegram_user_id=${String(telegramId)})`;
        await tx`DELETE FROM users WHERE telegram_user_id=${String(telegramId)}`;
      });
    } finally {
      await closeDb();
    }
  }
});
