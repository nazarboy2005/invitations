import type { Metadata } from "next";
import { TelegramWebAppScript } from "@/components/telegram-web-app-script";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Taklifnoma — Yaxshi kunlar birga",
    template: "%s | Taklifnoma",
  },
  description: "Unutilmas kuningiz uchun shaxsiy elektron taklifnoma yarating.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz-Latn" suppressHydrationWarning>
      <body>
        <TelegramWebAppScript />
        <a className="skip-link" href="#main">
          Asosiy sahifaga o‘tish
        </a>
        {children}
      </body>
    </html>
  );
}
