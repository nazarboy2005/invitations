"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

export function TelegramWebAppScript() {
  const pathname = usePathname();
  // Admin confirmation uses the bot link, not the Mini App SDK. Keep remote
  // executable code out of a freshly loaded privileged document.
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) return null;
  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
    />
  );
}
