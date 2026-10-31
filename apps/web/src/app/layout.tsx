import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { publicAsset } from "../lib/public-asset";
import { TelegramWebAppScript } from "@/components/telegram-web-app-script";
import "./globals.css";
const assetBackgrounds = Object.fromEntries(
  [
    ["--catalog-floral-header", "/images/catalog/floral-header.webp"],
    ["--paper-creases", "/images/home/paper/creases.jpg"],
    ["--hero-mobile-backdrop", "/images/home/invitation-scene-mobile.webp"],
    ["--studio-gallery-desktop", "/images/home/paper/gallery-desktop.webp"],
    ["--studio-gallery-mobile", "/images/home/paper/gallery-mobile.webp"],
  ].map(([name, path]) => [name, `url("${publicAsset(path)}")`]),
) as CSSProperties;
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
      <body style={assetBackgrounds}>
        <TelegramWebAppScript />
        {children}
      </body>
    </html>
  );
}
