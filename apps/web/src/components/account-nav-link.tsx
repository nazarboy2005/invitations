"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Send, UserRound } from "lucide-react";
import styles from "./site-header.module.css";
import { currentTelegramLaunchData } from "@/modules/session/client-session";

type Props = {
  signedIn: boolean;
  className?: string;
  dashboard?: boolean;
  icon?: boolean;
};

export function AccountNavLink({
  signedIn,
  className,
  dashboard = false,
  icon = false,
}: Props) {
  const [miniApp, setMiniApp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const sync = () => setMiniApp(Boolean(currentTelegramLaunchData()));
    sync();
    window.addEventListener("taklifnoma:telegram-ready", sync);
    return () => window.removeEventListener("taklifnoma:telegram-ready", sync);
  }, []);

  async function startLogin() {
    if (busy) return;
    setBusy(true);
    setError("");
    const telegramWindow = window.open("about:blank", "fotiha-telegram-login");
    try {
      const response = await fetch("/api/auth/telegram/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const result = await response.json();
      if (!response.ok || !result.loginUrl || !result.requestId)
        throw new Error(result.error?.message ?? "Telegram orqali kirish boshlanmadi.");
      if (!telegramWindow)
        throw new Error("Telegram oynasini ochish uchun qalqib chiquvchi oynalarga ruxsat bering.");
      telegramWindow.location.assign(result.loginUrl);

      const deadline = Date.now() + 5 * 60_000;
      while (Date.now() < deadline) {
        await new Promise((resolve) => window.setTimeout(resolve, 2000));
        const status = await fetch(
          `/api/auth/telegram/status?requestId=${encodeURIComponent(result.requestId)}`,
          { cache: "no-store" },
        );
        const state = await status.json();
        if (state.state === "expired")
          throw new Error("Kirish havolasining muddati tugadi. Qayta urinib ko‘ring.");
        if (state.state !== "confirmed") continue;
        const complete = await fetch("/api/auth/telegram/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId: result.requestId }),
        });
        if (!complete.ok) {
          const failure = await complete.json().catch(() => ({}));
          throw new Error(failure.error?.message ?? "Kirishni yakunlab bo‘lmadi.");
        }
        telegramWindow?.close();
        try {
          sessionStorage.removeItem("taklifnoma:manual-signout");
        } catch {
          /* A completed browser login is sufficient without storage. */
        }
        window.dispatchEvent(new CustomEvent("session-changed"));
        window.location.assign("/dashboard");
        return;
      }
      throw new Error("Telegram orqali kirish vaqti tugadi. Qayta urinib ko‘ring.");
    } catch (cause) {
      telegramWindow?.close();
      setError(cause instanceof Error ? cause.message : "Telegram orqali kirish amalga oshmadi.");
      setBusy(false);
    }
  }

  if (signedIn || miniApp)
    return (
      <Link href="/dashboard" className={className} aria-current={dashboard ? "page" : undefined}>
        {icon && <UserRound size={19} strokeWidth={1.2} aria-hidden="true" />}
        Taklifnomalarim
      </Link>
    );

  return (
    <span className={styles.accountLoginWrap}>
      <button type="button" className={className} onClick={() => void startLogin()} disabled={busy}>
        {icon && (busy ? <Send size={19} aria-hidden="true" /> : <UserRound size={19} strokeWidth={1.2} aria-hidden="true" />)}
        {busy ? "Telegramni kutyapmiz…" : "Kirish"}
      </button>
      {error && <span role="alert" className={styles.accountLoginError}>{error}</span>}
    </span>
  );
}
