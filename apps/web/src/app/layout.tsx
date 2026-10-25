import type { Metadata } from "next";
import Script from "next/script";
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
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="afterInteractive"
        />
        <a className="skip-link" href="#main">
          Asosiy sahifaga o‘tish
        </a>
        {children}
      </body>
    </html>
  );
}
