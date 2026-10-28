"use client";
import Script from "next/script";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  loadClientSession,
  miniAppAdminDestination,
  currentTelegramLaunchData,
} from "@/modules/session/client-session";
import { miniAppPaymentDestination } from "@/modules/payments/payment-navigation";

export function TelegramWebAppScript() {
  const pathname = usePathname();
  const entryPathname = useRef(pathname);
  const router = useRouter();
  const [ready, setReady] = useState(0);
  const handled = useRef<string | null>(null);
  useEffect(() => {
    const update = () => setReady((value) => value + 1);
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    if (pathname !== "/" && pathname !== "/dashboard") return;
    const app = window.Telegram?.WebApp;
    const initData = currentTelegramLaunchData();
    const key = pathname + ":" + initData;
    if (handled.current === key) return;
    app?.ready?.();
    app?.expand?.();
    let active = true;
    void loadClientSession(initData)
      .then((session) => {
        if (!active) return;
        handled.current = key;
        // An explicit payment launch takes precedence over the admin home entry.
        // The launch has been verified; ownership is checked again by payment APIs.
        // Consume the launch destination only on document entry. Telegram keeps
        // start_param for the app's lifetime; later dashboard/home navigation
        // must not send the creator back to payments again.
        const paymentDestination =
          pathname === entryPathname.current
            ? miniAppPaymentDestination(initData, session.user)
            : null;
        if (paymentDestination) {
          window.location.replace(paymentDestination + window.location.hash);
          return;
        }
        const destination = miniAppAdminDestination(
          pathname,
          window.location.search,
          session.user,
        );
        if (destination) {
          // Load a fresh privileged document with its own CSP and no Telegram SDK.
          window.location.replace(destination);
          return;
        }
        if (!session.user && initData && pathname === "/") {
          window.location.replace("/dashboard" + window.location.hash);
          return;
        }
        window.dispatchEvent(new Event("taklifnoma:session-changed"));
        // The verified launch may have switched accounts and replaced a cookie.
        // Refresh server-rendered navigation so the previous account's links disappear.
        if (initData) router.refresh();
      })
      .catch(() => {
        // The account page exposes login/retry controls; never loop on an auth error.
        if (active && initData && pathname === "/")
          window.location.replace("/dashboard" + window.location.hash);
      });
    return () => {
      active = false;
    };
  }, [pathname, ready, router]);
  // Admin confirmation uses the bot link, not the Mini App SDK. Keep remote
  // executable code out of a freshly loaded privileged document.
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) return null;
  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
      onReady={() => {
        window.Telegram?.WebApp?.ready?.();
        window.dispatchEvent(new Event("taklifnoma:telegram-ready"));
        setReady((value) => value + 1);
      }}
    />
  );
}
