import { getDb } from "@taklifnoma/database";
import type postgres from "postgres";
import { AuthError } from "./index";
import { digest, isOwnContact, type TelegramIdentity } from "./crypto";
import { hasAdminRole } from "./admin-role";
import { paymentReturnPath } from "../../modules/payments/payment-navigation";

type TelegramMessage = {
  message_id?: number;
  from?: TelegramIdentity;
  chat: { id: number; type: string };
  text?: string;
  contact?: { user_id?: number; phone_number?: string };
  forward_origin?: unknown;
  forward_date?: number;
};
type Update = {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: {
    id: string;
    from: TelegramIdentity;
    data?: string;
    message?: TelegramMessage;
  };
};
export async function telegramCall(
  method: string,
  body: Record<string, unknown>,
) {
  const response = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    },
  );
  const data = (await response.json()) as { ok: boolean };
  if (!response.ok || !data.ok)
    throw new AuthError(
      "TELEGRAM_UNAVAILABLE",
      "Telegram is temporarily unavailable",
      503,
    );
}
function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );
}
async function sendSticker(chatId: number, stickerId: string | undefined) {
  if (!stickerId) return;
  try {
    await telegramCall("sendSticker", { chat_id: chatId, sticker: stickerId });
  } catch {
    // Stickers are optional decoration; they must not block login or onboarding.
  }
}
async function identify(
  identity: TelegramIdentity,
  chatId: number,
  db: postgres.TransactionSql,
) {
  const name = `${identity.first_name} ${identity.last_name ?? ""}`
    .trim()
    .slice(0, 300);
  const [user] =
    await db`INSERT INTO users(telegram_user_id,display_name,telegram_username) VALUES(${String(identity.id)},${name},${identity.username ?? null}) ON CONFLICT(telegram_user_id) DO UPDATE SET display_name=EXCLUDED.display_name,telegram_username=EXCLUDED.telegram_username,updated_at=now() RETURNING *`;
  await db`INSERT INTO telegram_connections(user_id,telegram_chat_id,status) VALUES(${user.id},${String(chatId)},'active') ON CONFLICT(user_id) DO UPDATE SET telegram_chat_id=EXCLUDED.telegram_chat_id,status='active',updated_at=now()`;
  return user;
}
const contactKeyboard = {
  keyboard: [[{ text: "Telefon raqamimni yuborish", request_contact: true }]],
  resize_keyboard: true,
  one_time_keyboard: true,
};
function continueKeyboard() {
  const url = process.env.APP_URL;
  return url
    ? {
        inline_keyboard: [
          [
            {
              text: "💌 Sayt / Mini Appga qaytish",
              web_app: { url },
            },
          ],
        ],
      }
    : undefined;
}
async function askContact(chatId: number) {
  await telegramCall("sendMessage", {
    chat_id: chatId,
    parse_mode: "HTML",
    text: "📱 <b>Telefon raqamingizni tasdiqlang</b>\n\nDavom etish uchun shaxsiy Telegram raqamingizni quyidagi tugma orqali yuboring. Raqam akkauntingizni himoyalash va tiklash uchun ishlatiladi. So‘ng ishni sayt yoki Mini App’da davom ettirish uchun quyidagi havolani bosing.",
    reply_markup: {
      ...contactKeyboard,
      ...(continueKeyboard()
        ? { inline_keyboard: continueKeyboard()!.inline_keyboard }
        : {}),
    },
  });
}
async function confirmSiteLogin(
  chatId: number,
  requestId: string,
  db: postgres.TransactionSql,
) {
  await db`UPDATE auth_requests a SET state='confirmed',confirmed_at=now() FROM users u WHERE a.id=${requestId} AND a.user_id=u.id AND u.phone_shared_at IS NOT NULL AND a.state='identified' AND a.expires_at>now() AND EXISTS(SELECT 1 FROM telegram_connections c WHERE c.user_id=u.id AND c.telegram_chat_id=${String(chatId)} AND c.status='active')`;
  await telegramCall("sendMessage", {
    chat_id: chatId,
    parse_mode: "HTML",
    text: "✅ <b>Kirish tasdiqlandi</b>\n\nSayt yoki Mini App’ga qayting — ishni davom ettirishingiz mumkin.",
    reply_markup: {
      remove_keyboard: true,
      ...(continueKeyboard()
        ? { inline_keyboard: continueKeyboard()!.inline_keyboard }
        : {}),
    },
  });
}
export async function processTelegramUpdate(raw: Record<string, unknown>) {
  const update = raw as unknown as Update;
  if (!Number.isSafeInteger(update.update_id))
    throw new AuthError("INVALID_UPDATE", "Invalid Telegram update");
  await getDb().begin(async (db) => {
    await db`SET LOCAL lock_timeout = '5s'`;
    // Serialize retries of the same Telegram delivery. All database effects and
    // the inbox marker commit together. Telegram API acknowledgments/prompts
    // remain at-least-once if a network failure happens after Telegram accepts.
    await db`SELECT pg_advisory_xact_lock(${update.update_id})`;
    await processLocked(update, db);
  });
}
async function processLocked(update: Update, db: postgres.TransactionSql) {
  if (
    (
      await db`SELECT update_id FROM telegram_updates WHERE update_id=${update.update_id}`
    ).length
  )
    return;
  const message = update.message;
  if (
    message?.chat.type === "private" &&
    message.from &&
    message.from.id === message.chat.id
  ) {
    const identity = message.from;
    if (
      !Number.isSafeInteger(identity.id) ||
      identity.id <= 0 ||
      typeof identity.first_name !== "string"
    )
      throw new AuthError("INVALID_UPDATE", "Invalid Telegram identity");
    const user = await identify(identity, message.chat.id, db);
    if (/^\/stop(?:@\w+)?\s*$/.test(message.text ?? "")) {
      await db`UPDATE telegram_connections SET broadcast_opt_out_at=now() WHERE user_id=${user.id}`;
      await telegramCall("sendMessage", {
        chat_id: message.chat.id,
        text: "Umumiy xabarlar o‘chirildi. Qayta yoqish uchun /subscribe yuboring. Hisobingizga oid zarur amallar ishlashda davom etadi.",
      });
      await db`INSERT INTO telegram_updates(update_id) VALUES(${update.update_id}) ON CONFLICT DO NOTHING`;
      return;
    }
    if (/^\/subscribe(?:@\w+)?\s*$/.test(message.text ?? "")) {
      await db`UPDATE telegram_connections SET broadcast_opt_out_at=NULL WHERE user_id=${user.id}`;
      await telegramCall("sendMessage", {
        chat_id: message.chat.id,
        text: "Umumiy xabarlar yoqildi. O‘chirish uchun /stop yuboring.",
      });
      await db`INSERT INTO telegram_updates(update_id) VALUES(${update.update_id}) ON CONFLICT DO NOTHING`;
      return;
    }
    const adminCommand = /^\/admin(?:@\w+)?\s*$/.test(message.text ?? "");
    if (adminCommand && !hasAdminRole(user)) {
      await db`INSERT INTO telegram_updates(update_id) VALUES(${update.update_id}) ON CONFLICT DO NOTHING`;
      return;
    }
    if (user.disabled_at) {
      await telegramCall("sendMessage", {
        chat_id: message.chat.id,
        text: "Hisobga kirish cheklangan. Qo‘llab-quvvatlash xizmatiga murojaat qiling.",
      });
      await db`INSERT INTO telegram_updates(update_id) VALUES(${update.update_id}) ON CONFLICT DO NOTHING`;
      return;
    }
    if (adminCommand) {
      if (!user.phone_shared_at) await askContact(message.chat.id);
      else
        await telegramCall("sendMessage", {
          chat_id: message.chat.id,
          text: "Boshqaruvni ochish uchun quyidagi tugmani bosing. Kirish Telegram hisobingiz orqali tekshiriladi.",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🛡 Boshqaruvga kirish",
                  web_app: {
                    url: new URL("/dashboard", process.env.APP_URL).href,
                  },
                },
              ],
            ],
          },
        });
      await db`INSERT INTO telegram_updates(update_id) VALUES(${update.update_id}) ON CONFLICT DO NOTHING`;
      return;
    }
    const start = message.text?.match(/^\/start(?:@\w+)?(?:\s+(\S+))?$/);
    const paymentPath = paymentReturnPath(start?.[1]);
    if (paymentPath) {
      if (!user.phone_shared_at) await askContact(message.chat.id);
      else
        await telegramCall("sendMessage", {
          chat_id: message.chat.id,
          text: "To‘lov holatini Mini App’da tekshiring. Buyurtmangiz saqlangan; qayta to‘lamang.",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "To‘lov holatini ochish",
                  web_app: {
                    url: new URL(paymentPath, process.env.APP_URL).href,
                  },
                },
              ],
            ],
          },
        });
    } else if (start?.[1]?.startsWith("auth_")) {
      const token = start[1].slice(5);
      const [auth] = /^[A-Za-z0-9_-]{43}$/.test(token)
        ? await db`UPDATE auth_requests SET user_id=${user.id},state='identified' WHERE token_hash=${digest(token)} AND expires_at>now() AND state IN ('pending','identified') AND (user_id IS NULL OR user_id=${user.id}) RETURNING *`
        : [];
      if (!auth)
        await telegramCall("sendMessage", {
          parse_mode: "HTML",
          chat_id: message.chat.id,
          text: "⌛ <b>Kirish havolasi eskirgan</b>\n\nSaytga qaytib, yangi kirish so‘rovini boshlang.",
        });
      else if (!user.phone_shared_at) await askContact(message.chat.id);
      else await confirmSiteLogin(message.chat.id, auth.id, db);
    } else if (message.contact) {
      if (
        !isOwnContact(
          identity.id,
          message.contact,
          !!message.forward_origin || !!message.forward_date,
        )
      )
        await askContact(message.chat.id);
      else {
        const normalized =
          "+" + message.contact.phone_number!.replace(/\D/g, "");
        await db`UPDATE users SET phone_number=${normalized},phone_source='telegram_contact',phone_shared_at=now(),updated_at=now() WHERE id=${user.id}`;
        await sendSticker(
          message.chat.id,
          process.env.TELEGRAM_SUCCESS_STICKER_ID,
        );
        await telegramCall("sendMessage", {
          parse_mode: "HTML",
          chat_id: message.chat.id,
          text: "✅ <b>Telefon raqamingiz qabul qilindi</b>\n\nQuyidagi havola orqali sayt yoki Mini App’ga qaytib ishingizni davom ettiring.",
          reply_markup: {
            remove_keyboard: true,
            ...(continueKeyboard()
              ? { inline_keyboard: continueKeyboard()!.inline_keyboard }
              : {}),
          },
        });
        const [auth] =
          await db`SELECT * FROM auth_requests WHERE user_id=${user.id} AND state='identified' AND expires_at>now() ORDER BY created_at DESC LIMIT 1`;
        if (auth) await confirmSiteLogin(message.chat.id, auth.id, db);
        else
          await telegramCall("sendMessage", {
            chat_id: message.chat.id,
            parse_mode: "HTML",
            text: "🎉 <b>Tayyor!</b>\n\nQuyidagi havola orqali Mini App yoki saytga qaytib davom eting.",
            reply_markup: continueKeyboard(),
          });
      }
    } else if (start) {
      if (!user.phone_shared_at) await askContact(message.chat.id);
      else
        await sendSticker(
          message.chat.id,
          process.env.TELEGRAM_WELCOME_STICKER_ID,
        );
      await telegramCall("sendMessage", {
        parse_mode: "HTML",
        chat_id: message.chat.id,
        text: `✨ <b>Taklifnoma</b>\n\nSalom, ${escapeHtml(identity.first_name)}!\n\nYaqinlaringiz uchun chiroyli taklifnoma yarating, mehmonlar javobi va tilaklarini bir joyda kuzating. 💌`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: hasAdminRole(user)
                  ? "🛡 Boshqaruvga kirish"
                  : "💌 Taklifnoma yaratish",
                web_app: {
                  url: hasAdminRole(user)
                    ? new URL("/dashboard", process.env.APP_URL).href
                    : process.env.APP_URL,
                },
              },
            ],
          ],
        },
      });
    }
  }
  const callback = update.callback_query;
  if (callback?.data?.startsWith("auth_confirm:")) {
    const id = callback.data.slice(13);
    if (
      /^[0-9a-f-]{36}$/i.test(id) &&
      callback.message?.chat.type === "private" &&
      callback.message.chat.id === callback.from.id
    ) {
      const [auth] =
        await db`UPDATE auth_requests a SET state='confirmed',confirmed_at=now() FROM users u WHERE a.id=${id} AND a.user_id=u.id AND u.telegram_user_id=${String(callback.from.id)} AND u.phone_shared_at IS NOT NULL AND u.disabled_at IS NULL AND a.state='identified' AND a.expires_at>now() RETURNING a.id`;
      await telegramCall("answerCallbackQuery", {
        callback_query_id: callback.id,
        text: auth
          ? "Tasdiqlandi. Saytga qayting."
          : "So‘rov eskirgan yoki tasdiqlangan.",
      });
    }
  }
  const moderation = callback?.data?.match(
    /^wish_(approve|delete):([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
  );
  if (callback && moderation) {
    const privateActor =
      callback.message?.chat.type === "private" &&
      callback.message.chat.id === callback.from.id &&
      Number.isSafeInteger(callback.from.id);
    if (!privateActor) {
      await telegramCall("answerCallbackQuery", {
        callback_query_id: callback.id,
        text: "Bu amal faqat shaxsiy bot suhbatida mavjud.",
        show_alert: true,
      });
    } else {
      const [wish] =
        await db`SELECT w.*,u.id AS actor_id,u.telegram_user_id,u.is_admin,i.owner_id FROM wishes w JOIN invitations i ON i.id=w.invitation_id JOIN users u ON u.telegram_user_id=${String(callback.from.id)} WHERE w.id=${moderation[2]} AND i.status<>'deleted' AND u.disabled_at IS NULL FOR UPDATE OF w`;
      if (!wish || (wish.owner_id !== wish.actor_id && !hasAdminRole(wish)))
        await telegramCall("answerCallbackQuery", {
          callback_query_id: callback.id,
          text: "Xabar topilmadi yoki ruxsatingiz yo‘q.",
          show_alert: true,
        });
      else {
        const status = moderation[1] === "approve" ? "approved" : "deleted";
        const canChange = wish.status !== "deleted" && wish.status !== status;
        if (canChange) {
          await db`UPDATE wishes SET status=${status},moderated_by=${wish.actor_id},moderated_at=now(),deleted_at=${status === "deleted" ? new Date() : null} WHERE id=${wish.id}`;
          await db`INSERT INTO invitation_audit_log(invitation_id,actor_id,action,previous_values,new_values) VALUES(${wish.invitation_id},${wish.actor_id},${"wish_" + moderation[1]},${db.json({ wishId: wish.id, status: wish.status })},${db.json({ wishId: wish.id, status })})`;
          if (callback.message?.message_id) {
            await telegramCall("editMessageReplyMarkup", {
              chat_id: callback.message.chat.id,
              message_id: callback.message.message_id,
              reply_markup: { inline_keyboard: [] },
            });
            await telegramCall("sendMessage", {
              parse_mode: "HTML",
              chat_id: callback.message.chat.id,
              text:
                status === "approved"
                  ? "🌟 <b>Tilak tasdiqlandi</b>\nEndi u ommaviy taklifnomada ko‘rinadi."
                  : "🗑️ <b>Tilak rad etildi va o‘chirildi</b>\nU ommaviy taklifnomada ko‘rinmaydi.",
            });
          }
        }
        await telegramCall("answerCallbackQuery", {
          callback_query_id: callback.id,
          text: !canChange
            ? "Bu xabar allaqachon ko‘rib chiqilgan."
            : status === "approved"
              ? "Tilak taklifnomada e’lon qilindi."
              : "Tilak rad etildi va o‘chirildi.",
        });
      }
    }
  }
  await db`INSERT INTO telegram_updates(update_id) VALUES(${update.update_id}) ON CONFLICT DO NOTHING`;
}
