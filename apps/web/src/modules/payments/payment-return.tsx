"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@taklifnoma/contracts";
import {
  paymentStateLabels,
  type PaymentOrderView,
} from "@taklifnoma/contracts/payment";
import styles from "./payment-return.module.css";
import { CheckoutActions } from "./checkout-actions";
import {
  currentTelegramLaunchData,
  loadClientSession,
} from "../session/client-session";
import {
  rememberedPaymentOrder,
  rememberPaymentOrder,
  telegramPaymentReturnLink,
} from "./payment-navigation";

export function PaymentReturn({
  botUsername,
  mainMiniApp = false,
}: {
  botUsername?: string;
  mainMiniApp?: boolean;
}) {
  const [orders, setOrders] = useState<PaymentOrderView[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loginRequired, setLoginRequired] = useState(false);
  const [miniApp, setMiniApp] = useState(false);
  const [userId, setUserId] = useState("");
  const [retry, setRetry] = useState(0);
  const inFlight = useRef(false);
  const order = orders.find((item) => item.id === selected);
  const telegramUrl = telegramPaymentReturnLink(
    botUsername,
    selected || undefined,
    mainMiniApp,
  );
  const refresh = useCallback(async (id: string, signal?: AbortSignal) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    try {
      const response = await fetch(`/api/payments/${id}/refresh`, {
        method: "POST",
        signal,
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error?.message ?? "To‘lovni tekshirib bo‘lmadi.");
      setOrders((current) =>
        current.map((item) => (item.id === id ? body.order : item)),
      );
      setError("");
    } catch (cause) {
      if (!signal?.aborted)
        setError(
          cause instanceof Error ? cause.message : "Ulanishni tekshiring.",
        );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    const onReady = () => setRetry((value) => value + 1);
    window.addEventListener("taklifnoma:telegram-ready", onReady);
    return () =>
      window.removeEventListener("taklifnoma:telegram-ready", onReady);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoginRequired(false);
    setError("");
    setOrders([]);
    setSelected("");
    setUserId("");
    void (async () => {
      try {
        const initData = currentTelegramLaunchData();
        setMiniApp(Boolean(initData));
        // A newly opened Mini App may not have a cookie yet. Verify its signed
        // Telegram identity before requesting any private payment records.
        const session = await loadClientSession(initData);
        if (controller.signal.aborted) return;
        if (!session.user) {
          setLoginRequired(true);
          return;
        }
        const accountId = session.user.id;
        const response = await fetch("/api/payments", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.status === 401) {
          setLoginRequired(true);
          return;
        }
        const body = await response.json();
        if (!response.ok)
          throw new Error(body.error?.message ?? "Buyurtmalar olinmadi.");
        const items = body.orders as PaymentOrderView[];
        if (controller.signal.aborted) return;
        setUserId(accountId);
        setOrders(items);
        let remembered = "";
        try {
          remembered = sessionStorage.getItem("nodze-order") ?? "";
        } catch {
          /* Account records are the fallback. */
        }
        const requested = new URLSearchParams(window.location.search).get(
          "order",
        );
        setSelected(
          items.find((item) => item.id === requested)?.id ??
            items.find((item) => item.id === remembered)?.id ??
            items.find((item) => item.id === rememberedPaymentOrder(accountId))
              ?.id ??
            items[0]?.id ??
            "",
        );
      } catch (cause) {
        if (!controller.signal.aborted)
          setError(
            cause instanceof Error ? cause.message : "Ulanishni tekshiring.",
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    if (!selected || !userId) return;
    rememberPaymentOrder(userId, selected);
    // Selection survives reload, browser return and unavailable sessionStorage.
    const url = new URL(window.location.href);
    url.searchParams.set("order", selected);
    window.history.replaceState(window.history.state, "", url);
    try {
      sessionStorage.setItem("nodze-order", selected);
    } catch {
      /* Owned server records and the URL remain available. */
    }
  }, [selected, userId]);
  useEffect(() => {
    if (
      !order ||
      order.url ||
      [
        "FAILED",
        "CANCELLED",
        "EXPIRED",
        "REFUNDED",
        "PARTIALLY_REFUNDED",
        "REFUND_PENDING",
      ].includes(order.status)
    )
      return;
    const controller = new AbortController();
    void refresh(order.id, controller.signal);
    const onReturn = () => {
      if (!document.hidden) void refresh(order.id, controller.signal);
    };
    window.addEventListener("focus", onReturn);
    document.addEventListener("visibilitychange", onReturn);
    let attempts = 0;
    const timer = window.setInterval(() => {
      if (++attempts >= 8) {
        window.clearInterval(timer);
        return;
      }
      if (!document.hidden) void refresh(order.id, controller.signal);
    }, 15000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      window.removeEventListener("focus", onReturn);
      document.removeEventListener("visibilitychange", onReturn);
    };
  }, [selected, order?.status, order?.url, refresh]);
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link href="/" className={styles.brand}>
          Visol
        </Link>
        <p className={styles.eyebrow}>TO‘LOV VA NASHR</p>
        <h1>To‘lov holati</h1>
        {!miniApp && telegramUrl && (
          <div>
            <p>
              Telegram Mini App’da boshlagan bo‘lsangiz, o‘sha hisobda davom
              eting. Buyurtma va to‘lovingiz saqlangan. Brauzer Telegram’dagi
              kirishni avtomatik qabul qilmaydi.
            </p>
            <a className="button" href={telegramUrl}>
              Telegram’da davom etish
            </a>
            {!mainMiniApp && (
              <p>
                Telegram ochilgach, botdagi “To‘lov holatini ochish” tugmasini
                bosing.
              </p>
            )}
          </div>
        )}
        {loading ? (
          <p role="status">Buyurtma tekshirilmoqda…</p>
        ) : loginRequired ? (
          <>
            <p>
              {miniApp
                ? "Mini App’ni botdan qayta oching. Hisobingiz tekshirilgach, buyurtmangiz ko‘rinadi."
                : "Shu brauzerda davom etish uchun hisobingizga kiring yoki yuqoridagi tugma orqali Telegram’ga qayting. To‘lov yo‘qolmaydi."}
            </p>
            <Link className="button secondary" href="/dashboard">
              Brauzerda hisobga kirish
            </Link>
          </>
        ) : error && orders.length === 0 ? (
          <p>Buyurtmalar hozircha yuklanmadi. Qayta tekshiring.</p>
        ) : (
          <>
            {orders.length > 1 && (
              <label className={styles.select}>
                Buyurtma
                <select
                  value={selected}
                  onChange={(event) => setSelected(event.target.value)}
                >
                  {orders.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.templateName} — {formatPrice(item.amountMinor)} —{" "}
                      {item.id.slice(0, 8)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {order ? (
              <>
                <p>
                  {order.templateName} ·{" "}
                  <strong>{formatPrice(order.amountMinor)}</strong>
                </p>
                <p className={styles.status} role="status" aria-live="polite">
                  {paymentStateLabels[order.status]}
                </p>
                {order.url ? (
                  <>
                    <p>
                      Taklifnomangiz nashr qilindi. Havolani mehmonlarga
                      ulashing.
                    </p>
                    <a className="button" href={order.url}>
                      Taklifnomani ochish
                    </a>
                    <button
                      className="button secondary"
                      onClick={() =>
                        void navigator.clipboard
                          .writeText(order.url!)
                          .then(() => setError("Havola nusxalandi."))
                          .catch(() =>
                            setError("Havolani manzil satridan nusxalang."),
                          )
                      }
                    >
                      Havolani nusxalash
                    </button>
                  </>
                ) : (
                  <>
                    <p>
                      {order.status === "SUCCEEDED"
                        ? "To‘lov saqlandi. Nashrni yakunlash uchun quyidagi tafsilotlarni tekshiring. Qayta to‘lamang."
                        : "Tasdiq Click va server orqali tekshiriladi. Natija kechiksa, yangi to‘lov boshlamang."}
                    </p>
                    {order.publicationError && (
                      <p role="alert">{order.publicationError}</p>
                    )}
                    <div className={styles.actions}>
                      <button
                        className="button"
                        disabled={busy}
                        onClick={() => void refresh(order.id)}
                      >
                        {busy ? "Tekshirilmoqda…" : "Holatni tekshirish"}
                      </button>
                    </div>
                    {order.checkoutUrl && (
                      <CheckoutActions
                        key={order.id}
                        checkoutUrl={order.checkoutUrl}
                      />
                    )}
                  </>
                )}
                <Link
                  className={styles.link}
                  href={`/studio/${order.invitationId}`}
                >
                  {["FAILED", "CANCELLED", "EXPIRED"].includes(order.status)
                    ? "Qoralamaga qaytish / qayta urinish"
                    : "Taklifnomani tahrirlash"}
                </Link>
              </>
            ) : (
              <p>
                Hozircha to‘lov buyurtmasi yo‘q. Taklifnomangizdan “Nashr
                qilish”ni bosing.
              </p>
            )}
          </>
        )}
        {error && (
          <>
            <p role="status">{error}</p>
            <button
              className="button secondary"
              onClick={() => setRetry((value) => value + 1)}
            >
              Qayta tekshirish
            </button>
          </>
        )}
        <Link className={styles.link} href="/dashboard">
          Taklifnomalarim
        </Link>
      </section>
    </main>
  );
}
