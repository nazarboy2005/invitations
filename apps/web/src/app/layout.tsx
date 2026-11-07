import { BRAND_NAME } from "@/lib/brand";
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
  metadataBase: new URL(process.env.APP_URL || "https://fotiha.uz"),
  title: {
    default: `${BRAND_NAME} — Yaxshi kunlar birga`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: "Unutilmas kuningiz uchun shaxsiy elektron taklifnoma yarating.",
  openGraph: {
    type: "website",
    siteName: BRAND_NAME,
    title: "Fotiha — Elektron taklifnomalar",
    description: "Yaxshi kunlar uchun chiroyli taklifnomalar.",
    images: [{ url: "/share/fotiha-logo-v1.png", width: 256, height: 256, alt: "Fotiha logotipi" }],
    locale: "uz_UZ",
  },
  twitter: {
    card: "summary",
    title: "Fotiha — Elektron taklifnomalar",
    description: "Yaxshi kunlar uchun chiroyli taklifnomalar.",
    images: ["/share/fotiha-logo-v1.png"],
  },
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
