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
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (!pending || confirmed) return;
    const controller = new AbortController();
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const deadline = Date.now() + 5 * 60_000;
    async function poll() {
      try {
        const response = await fetch(
          `/api/auth/telegram/status?requestId=${encodeURIComponent(pending!.id)}`,
          { cache: "no-store", signal: controller.signal },
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
          setConfirmed(true);
          return;
        }
        if (result.state === "expired" || Date.now() >= deadline)
          throw new Error("Tasdiqlash vaqti tugadi. Qayta boshlang.");
        timer = setTimeout(poll, 2000);
      } catch (cause) {
        if (!stopped) {
          setError(
            cause instanceof Error ? cause.message : "Ulanishni tekshiring.",
          );
          setPending(null);
        }
      }
    }
    timer = setTimeout(poll, 2000);
    return () => {
      stopped = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [pending, confirmed, userId]);
  async function start() {
    setBusy(true);
    setError("");
    setConfirmed(false);
    try {
      const response = await fetch("/api/auth/telegram/start", {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok || !result.requestId || !result.loginUrl)
        throw new Error("Tasdiqlash boshlanmadi. Biroz kutib qayta urining.");
      if (alive.current)
        setPending({ id: result.requestId, url: result.loginUrl });
    } catch (cause) {
      if (alive.current) setError((cause as Error).message);
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  async function complete() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/reauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: pending!.id }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error?.message ?? "Hisob tasdiqlanmadi.");
      window.location.assign("/admin");
    } catch (cause) {
      if (alive.current) {
        setError((cause as Error).message);
        setBusy(false);
      }
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
      {confirmed ? (
        <>
          <p role="status">
            Telegram hisobi tasdiqlandi. Boshqaruvni davom ettirishingiz mumkin.
          </p>
          <button className="button" disabled={busy} onClick={complete}>
            {busy ? "Tekshirilmoqda…" : "Boshqaruvga kirish"}
          </button>
        </>
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
          <button className="button secondary" disabled={busy} onClick={start}>
            Qayta boshlash
          </button>
        </>
      ) : (
        <button className="button" disabled={busy} onClick={start}>
          {busy ? "Boshlanmoqda…" : "Telegram orqali tasdiqlash"}
        </button>
      )}
      <Link href="/dashboard" className={styles.backLink}>
        Hisobga qaytish
      </Link>
    </section>
  );
}
