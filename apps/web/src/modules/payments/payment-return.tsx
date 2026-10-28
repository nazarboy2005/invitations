"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { formatPrice, getContent, templateById } from "@taklifnoma/contracts";
import {
  paymentStateLabels,
  type InvitationPaymentContext,
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
import { formatDate } from "@/templates/date-format";

const retryableStates = ["FAILED", "CANCELLED", "EXPIRED"];
const pendingStates = ["CREATED", "PENDING", "PROCESSING", "REJECTED"];

export function PaymentReturn({
  botUsername,
  mainMiniApp = false,
}: {
  botUsername?: string;
  mainMiniApp?: boolean;
}) {
  const [context, setContext] = useState<InvitationPaymentContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loginRequired, setLoginRequired] = useState(false);
  const [miniApp, setMiniApp] = useState(false);
  const [userId, setUserId] = useState("");
  const [returnOrderId, setReturnOrderId] = useState("");
  const [retry, setRetry] = useState(0);
  const inFlight = useRef(false);
  const order = context?.order;
  const invitation = context?.invitation;
  const paid = order?.status === "SUCCEEDED";
  const pending = !!order && pendingStates.includes(order.status);
  const retryable = !!order && retryableStates.includes(order.status);
  const published = invitation?.status === "published" || !!order?.url;
  const publicUrl =
    order?.url ??
    (published && invitation?.slug
      ? `/i/${encodeURIComponent(invitation.slug)}`
      : null);
  const editUrl = invitation
    ? `/studio/${encodeURIComponent(invitation.id)}`
    : "/dashboard";
  const telegramUrl = telegramPaymentReturnLink(
    botUsername,
    returnOrderId || undefined,
    mainMiniApp,
  );

  const refresh = useCallback(async (id: string, signal?: AbortSignal) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    try {
      const response = await fetch(
        `/api/payments/${encodeURIComponent(id)}/refresh`,
        { method: "POST", signal },
      );
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error?.message ?? "To‘lovni tekshirib bo‘lmadi.");
      if (!signal?.aborted) {
        setContext((current) =>
          current?.order?.id === id
            ? {
                ...current,
                order: body.order,
              }
            : current,
        );
        setError("");
      }
    } catch (cause) {
      if (!signal?.aborted)
        setError(
          cause instanceof Error ? cause.message : "Ulanishni tekshiring.",
        );
    } finally {
      inFlight.current = false;
      if (!signal?.aborted) setBusy(false);
    }
  }, []);

  useEffect(() => {
    const onReady = () => setRetry((value) => value + 1);
    window.addEventListener("taklifnoma:telegram-ready", onReady);
    window.addEventListener("taklifnoma:session-changed", onReady);
    return () => {
      window.removeEventListener("taklifnoma:telegram-ready", onReady);
      window.removeEventListener("taklifnoma:session-changed", onReady);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setBusy(false);
    setLoginRequired(false);
    setError("");
    setNotice("");
    setContext(null);
    setUserId("");
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("order");
    const requestedInvitation = params.get("invitation");
    setReturnOrderId(requested ?? "");
    void (async () => {
      try {
        const initData = currentTelegramLaunchData();
        setMiniApp(Boolean(initData));
        // Verify signed Mini App identity before requesting private records.
        const session = await loadClientSession(initData);
        if (controller.signal.aborted) return;
        if (!session.user) {
          setLoginRequired(true);
          return;
        }
        setUserId(session.user.id);
        // The fixed provider return can recover this account's navigation hint.
        // Never choose an arbitrary latest order or substitute an invalid ID.
        const id =
          requested ??
          (requestedInvitation ? "" : rememberedPaymentOrder(session.user.id));
        if (!id && !requestedInvitation) return;
        setReturnOrderId(id);
        const endpoint = id
          ? `/api/payments/${encodeURIComponent(id)}`
          : `/api/invitations/${encodeURIComponent(requestedInvitation!)}/payment`;
        const response = await fetch(endpoint, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.status === 401) {
          setLoginRequired(true);
          return;
        }
        const body = await response.json();
        if (!response.ok)
          throw new Error(
            body.error?.message ?? "Taklifnoma ma’lumotlari yuklanmadi.",
          );
        if (requestedInvitation && body.invitation.id !== requestedInvitation)
          throw new Error("To‘lov ushbu taklifnomaga tegishli emas.");
        if (!controller.signal.aborted) setContext(body);
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
    if (!order?.id || !userId) return;
    rememberPaymentOrder(userId, order.id);
    setReturnOrderId(order.id);
    const url = new URL(window.location.href);
    url.searchParams.set("order", order.id);
    url.searchParams.delete("invitation");
    window.history.replaceState(window.history.state, "", url);
  }, [order?.id, userId]);

  useEffect(() => {
    if (!order || !pending || published) return;
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
      onReturn();
    }, 15000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      window.removeEventListener("focus", onReturn);
      document.removeEventListener("visibilitychange", onReturn);
    };
  }, [order?.id, pending, published, refresh]);

  async function startPayment() {
    if (!context || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        `/api/invitations/${context.invitation.id}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: context.invitation.revision,
            expectedAmountMinor: context.template?.priceMinor,
          }),
        },
      );
      const body = await response.json();
      if (!response.ok)
        throw new Error(
          body.error?.message ?? "To‘lov boshlanmadi. Qayta urinib ko‘ring.",
        );
      setContext((current) =>
        current?.invitation.id === context.invitation.id
          ? { ...current, order: body.order }
          : current,
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Ulanishni tekshiring.",
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  const title = loading
    ? "Taklifnomangiz yuklanmoqda"
    : loginRequired
      ? "Taklifnomangizga qayting"
      : !invitation
        ? error
          ? "Taklifnoma ochilmadi"
          : "Taklifnomani tanlang"
        : published
          ? "Taklifnomangiz tayyor"
          : invitation.status === "archived"
            ? "Taklifnoma arxivlangan"
            : paid
              ? "Nashrni yakunlang"
              : context?.publishingMode === "free" && !order
                ? "Taklifnomani nashr qiling"
                : order?.status === "PROCESSING" || order?.status === "REJECTED"
                  ? "To‘lov tasdiqlanmoqda"
                  : order && !pending && !retryable
                    ? "To‘lov bo‘yicha ma’lumot"
                    : "To‘lov qilish";
  const content = invitation ? getContent(invitation) : null;
  const templateName =
    (order && !retryable ? order.templateName : undefined) ??
    context?.template?.name ??
    templateById(invitation?.templateId ?? "")?.name ??
    "Tanlanmagan";
  const amount =
    published && !order
      ? undefined
      : order && !retryable
        ? order.amountMinor
        : context?.template?.priceMinor;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>
            Visol
          </Link>
          <Link href="/dashboard" className={styles.backLink}>
            <ArrowLeft size={16} aria-hidden="true" /> Taklifnomalarim
          </Link>
        </header>
        <section className={styles.card} aria-busy={loading}>
          <span
            className={styles.stateIcon}
            data-success={published || paid}
            aria-hidden="true"
          >
            {loading ? (
              <LoaderCircle size={27} className={styles.spinner} />
            ) : paid || published ? (
              <CheckCircle2 size={28} />
            ) : pending ? (
              <Clock3 size={27} />
            ) : (
              <CreditCard size={27} />
            )}
          </span>
          <h1 aria-live="polite">{title}</h1>
          {loading ? (
            <p role="status">Bir oz kuting…</p>
          ) : loginRequired ? (
            <p>
              {miniApp
                ? "Hisobingizni tasdiqlash uchun Mini App’ni botdan qayta oching."
                : "To‘lovni boshlagan hisobingizda davom eting. To‘lovingiz va taklifnomangiz saqlangan."}
            </p>
          ) : context && invitation ? (
            <>
              <div className={styles.invitationSummary}>
                <p className={styles.names}>
                  {content?.people.filter(Boolean).join(" & ") ||
                    "Taklifnomangiz"}
                </p>
                <p>
                  {formatDate(
                    invitation.startsAt,
                    "uz-Latn",
                    invitation.timezone,
                    { day: "numeric", month: "long", year: "numeric" },
                  ) || "Sana kiritilmagan"}
                </p>
                <dl>
                  <div>
                    <dt>Dizayn</dt>
                    <dd>{templateName}</dd>
                  </div>
                  {amount !== undefined && (
                    <div>
                      <dt>
                        {paid
                          ? "To‘langan summa"
                          : published || context.publishingMode === "free"
                            ? "Narx"
                            : "Jami to‘lov"}
                      </dt>
                      <dd>{formatPrice(amount)}</dd>
                    </div>
                  )}
                </dl>
              </div>
              {published && publicUrl ? (
                <>
                  <p>
                    Taklifnomangiz nashr qilindi. Havolani yaqinlaringiz bilan
                    ulashing.
                  </p>
                  <div className={styles.actions}>
                    <a className="button" href={publicUrl}>
                      Taklifnomani ochish{" "}
                      <ArrowRight size={16} aria-hidden="true" />
                    </a>
                    <button
                      className="button secondary"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            new URL(publicUrl, window.location.origin).href,
                          );
                          setNotice("Havola nusxalandi.");
                        } catch {
                          setNotice("Havolani quyidagi maydondan nusxalang.");
                        }
                      }}
                    >
                      <Copy size={16} aria-hidden="true" /> Havolani nusxalash
                    </button>
                  </div>
                  <input
                    className={styles.publicLink}
                    aria-label="Taklifnoma havolasi"
                    readOnly
                    value={
                      typeof window === "undefined"
                        ? publicUrl
                        : new URL(publicUrl, window.location.origin).href
                    }
                    onFocus={(event) => event.currentTarget.select()}
                  />
                </>
              ) : invitation.status === "archived" ? (
                <>
                  <p>
                    Taklifnomani avvalgi havolasi bilan qayta nashr qilishingiz
                    mumkin.
                  </p>
                  <Link className="button" href="/dashboard">
                    Taklifnomalarimga qaytish
                  </Link>
                </>
              ) : paid ? (
                <>
                  <p className={styles.paidNote} role="status">
                    <Check size={17} aria-hidden="true" /> To‘langan
                  </p>
                  <p>
                    To‘lov qabul qilindi. Taklifnoma ma’lumotlarini tekshirib,
                    nashrni yakunlang. Qo‘shimcha to‘lov talab qilinmaydi.
                  </p>
                  {order?.publicationError && (
                    <p className={styles.alert} role="alert">
                      {order.publicationError}
                    </p>
                  )}
                  <Link className="button" href={editUrl}>
                    Nashrni yakunlash{" "}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </>
              ) : order && !pending && !retryable ? (
                <p role="status">
                  {paymentStateLabels[order.status]}. Taklifnomangiz saqlangan.
                </p>
              ) : context.publishingMode === "free" && !order ? (
                <>
                  <p>Ma’lumotlarni tekshirib, taklifnomani nashr qiling.</p>
                  <Link className="button" href={editUrl}>
                    Nashr qilish <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </>
              ) : (
                <>
                  {order && (
                    <p className={styles.paymentStatus} role="status">
                      {paymentStateLabels[order.status]}
                    </p>
                  )}
                  <p>
                    {retryable
                      ? "Avvalgi to‘lov yakunlanmagan. Shu taklifnoma uchun qayta to‘lov boshlashingiz mumkin."
                      : pending
                        ? "To‘lov tasdiqlangach, taklifnomangiz avtomatik nashr qilinadi."
                        : "Bir martalik to‘lov. Tasdiqlangach, taklifnomangiz nashr qilinadi."}
                  </p>
                  {order?.checkoutUrl && pending && (
                    <CheckoutActions
                      key={order.id}
                      checkoutUrl={order.checkoutUrl}
                    />
                  )}
                  {(!order || retryable) && context.template && (
                    <button
                      className="button"
                      disabled={busy}
                      onClick={() => void startPayment()}
                    >
                      {busy ? "Tayyorlanmoqda…" : "To‘lov qilish"}{" "}
                      {!busy && <ArrowRight size={16} aria-hidden="true" />}
                    </button>
                  )}
                  {pending && (
                    <div className={styles.refresh}>
                      <button
                        disabled={busy}
                        onClick={() => void refresh(order!.id)}
                      >
                        {busy ? "Tekshirilmoqda…" : "To‘lovni tekshirish"}
                      </button>
                      <small>To‘lagan bo‘lsangiz, qayta to‘lamang.</small>
                    </div>
                  )}
                </>
              )}
              {!published && invitation.status !== "archived" && !paid && (
                <Link className={styles.editLink} href={editUrl}>
                  Ma’lumotlarni tahrirlash
                </Link>
              )}
            </>
          ) : !error ? (
            <p>Taklifnomalarim bo‘limidan kerakli taklifnomani oching.</p>
          ) : null}
          {!miniApp &&
            telegramUrl &&
            (loginRequired || !context) &&
            !loading && (
              <div className={styles.telegramReturn}>
                <a className="button" href={telegramUrl}>
                  Telegram’da davom etish
                </a>
                {!mainMiniApp && (
                  <p>
                    To‘lov tasdiqlangach, taklifnoma havolasi bot chatiga
                    yuboriladi.
                  </p>
                )}
              </div>
            )}
          {loginRequired && (
            <Link className={styles.editLink} href="/dashboard">
              Brauzerda hisobga kirish
            </Link>
          )}
          {error && (
            <div className={styles.alert} role="alert">
              <p>{error}</p>
              <button onClick={() => setRetry((value) => value + 1)}>
                Qayta yuklash
              </button>
            </div>
          )}
          {notice && (
            <p role="status" className={styles.notice}>
              {notice}
            </p>
          )}
        </section>
        <p className={styles.security}>
          <ShieldCheck size={15} aria-hidden="true" /> To‘lov faqat tanlangan
          taklifnomaga tegishli.
        </p>
      </div>
    </main>
  );
}
