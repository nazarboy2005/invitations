"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  loadClientSession,
  miniAppAdminDestination,
} from "@/modules/session/client-session";

export function TelegramWebAppScript() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.Telegram?.WebApp?.initData) setReady(true);
  }, [pathname]);
  useEffect(() => {
    if (!ready || (pathname !== "/" && pathname !== "/dashboard")) return;
    const app = window.Telegram?.WebApp;
    if (!app?.initData) return;
    app.ready?.();
    app.expand?.();
    let active = true;
    void loadClientSession(app.initData)
      .then((session) => {
        if (!active) return;
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
        window.dispatchEvent(new Event("taklifnoma:session-changed"));
        if (!session.user && pathname === "/")
          window.location.replace("/dashboard");
      })
      .catch(() => {
        // The account page exposes login/retry controls; never loop on an auth error.
        if (active && pathname === "/") window.location.replace("/dashboard");
      });
    return () => {
      active = false;
    };
  }, [pathname, ready]);
  // Admin confirmation uses the bot link, not the Mini App SDK. Keep remote
  // executable code out of a freshly loaded privileged document.
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) return null;
  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
      onReady={() => setReady(true)}
    />
  );
}
