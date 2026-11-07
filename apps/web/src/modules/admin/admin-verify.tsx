"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Send } from "lucide-react";
import styles from "./admin.module.css";

export function AdminVerify({
  userId,
  displayName,
}: {
  userId: string;
  displayName: string;
}) {
  const [pending, setPending] = useState<{ id: string; url: string } | null>(
    null,
  );
  const [busy, setBusy] = useState<"starting" | "completing" | null>(null);
  const [error, setError] = useState("");
  const alive = useRef(true);
  const exchanging = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    let checking = false;
    async function checkSession() {
      if (checking || exchanging.current || document.hidden) return;
      checking = true;
      try {
        const response = await fetch("/api/admin/reauth", {
          cache: "no-store",
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(10_000),
          ]),
        });
        if (controller.signal.aborted || exchanging.current) return;
        if (response.status === 401 || response.status === 403) {
          window.location.replace("/admin");
          return;
        }
        if (!response.ok) return;
        const result = await response.json();
        if (controller.signal.aborted || exchanging.current) return;
        if (result.verified) window.location.replace("/admin");
        else if (result.user?.id !== userId) window.location.reload();
      } catch {
        // A temporary connection failure must not clear the pending bot confirmation.
      } finally {
        checking = false;
      }
    }
    void checkSession();
    const timer = setInterval(checkSession, 15_000);
    window.addEventListener("focus", checkSession);
    window.addEventListener("pageshow", checkSession);
    window.addEventListener("session-changed", checkSession);
    window.addEventListener("taklifnoma:session-changed", checkSession);
    document.addEventListener("visibilitychange", checkSession);
    return () => {
      controller.abort();
      clearInterval(timer);
      window.removeEventListener("focus", checkSession);
      window.removeEventListener("pageshow", checkSession);
      window.removeEventListener("session-changed", checkSession);
      window.removeEventListener("taklifnoma:session-changed", checkSession);
      document.removeEventListener("visibilitychange", checkSession);
    };
  }, [userId]);
  useEffect(() => {
    if (!pending) return;
    const controller = new AbortController();
    let stopped = false;
    let polling = false;
    let timer: ReturnType<typeof setTimeout>;
    const deadline = Date.now() + 5 * 60_000;
    async function poll() {
      if (stopped || polling || exchanging.current) return;
      polling = true;
      clearTimeout(timer);
      try {
        const response = await fetch(
          `/api/auth/telegram/status?requestId=${encodeURIComponent(pending!.id)}`,
          {
            cache: "no-store",
            signal: AbortSignal.any([
              controller.signal,
              AbortSignal.timeout(15_000),
            ]),
          },
        );
        if (!response.ok)
          throw new Error("Tasdiqlashni tekshirib bo‘lmadi. Qayta boshlang.");
        const result = await response.json();
        if (stopped) return;
        if (result.state === "confirmed") {
          if (result.user?.id !== userId)
            throw new Error(
              "Joriy administratorning Telegram hisobidan tasdiqlang.",
            );
          // Bot confirmation alone does not renew the administrator's session.
          exchanging.current = true;
          setBusy("completing");
          const complete = await fetch("/api/admin/reauth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId: pending!.id }),
            signal: AbortSignal.any([
              controller.signal,
              AbortSignal.timeout(15_000),
            ]),
          });
          const completion = await complete.json();
          if (!complete.ok)
            throw new Error(
              completion.error?.message ?? "Hisob tasdiqlanmadi.",
            );
          if (!stopped) {
            stopped = true;
            window.location.replace("/admin");
          }
          return;
        }
        if (
          result.state === "expired" ||
          result.state === "consumed" ||
          Date.now() >= deadline
        )
          throw new Error("Tasdiqlash vaqti tugadi. Qayta boshlang.");
        timer = setTimeout(poll, 2000);
      } catch (cause) {
        if (!stopped) {
          setError(
            cause instanceof Error ? cause.message : "Ulanishni tekshiring.",
          );
          setPending(null);
          setBusy(null);
        }
      } finally {
        polling = false;
        exchanging.current = false;
      }
    }
    const resume = () => {
      if (!document.hidden) void poll();
    };
    void poll();
    window.addEventListener("focus", resume);
    document.addEventListener("visibilitychange", resume);
    return () => {
      stopped = true;
      clearTimeout(timer);
      controller.abort();
      window.removeEventListener("focus", resume);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [pending, userId]);
  async function start() {
    if (busy) return;
    setPending(null);
    setBusy("starting");
    setError("");
    try {
      const response = await fetch("/api/auth/telegram/start", {
        method: "POST",
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json();
      if (!response.ok || !result.requestId || !result.loginUrl)
        throw new Error(
          result.error?.message ??
            "Tasdiqlash boshlanmadi. Biroz kutib qayta urining.",
        );
      if (alive.current)
        setPending({ id: result.requestId, url: result.loginUrl });
    } catch (cause) {
      if (alive.current) setError((cause as Error).message);
    } finally {
      if (alive.current) setBusy(null);
    }
  }
  return (
    <section className={styles.verifyCard}>
      <ShieldCheck size={34} strokeWidth={1.4} aria-hidden="true" />
      <h1>Hisobingizni tasdiqlang</h1>
      <p>
        <strong>{displayName}</strong>, boshqaruvga kirish uchun Telegram
        hisobingizdan tasdiqlang. Tasdiq 12 soat amal qiladi.
      </p>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {busy === "completing" ? (
        <p role="status">Boshqaruvga kirilmoqda…</p>
      ) : pending ? (
        <>
          <a
            className="button"
            href={pending.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Send size={17} aria-hidden="true" />
            Telegramni ochish
          </a>
          <p role="status">Botdagi tasdiqni kutyapmiz…</p>
          <button
            className="button secondary"
            disabled={!!busy}
            onClick={start}
          >
            Qayta boshlash
          </button>
        </>
      ) : (
        <button className="button" disabled={!!busy} onClick={start}>
          {busy ? "Boshlanmoqda…" : "Telegram orqali tasdiqlash"}
        </button>
      )}
      <Link href="/dashboard" className={styles.backLink}>
        Hisobga qaytish
      </Link>
    </section>
  );
}
