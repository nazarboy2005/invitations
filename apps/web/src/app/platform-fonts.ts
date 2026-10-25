import localFont from "next/font/local";

export const display = localFont({
  src: "./fonts/cormorant-garamond-latin.woff2",
  weight: "500",
  display: "swap",
  variable: "--font-home-display",
});
export const script = localFont({
  src: "./fonts/great-vibes-latin.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-home-script",
});
export const sans = localFont({
  src: "./fonts/manrope-latin.woff2",
  weight: "400 800",
  display: "swap",
  variable: "--font-home-body",
});

export const signature = localFont({
  src: "./fonts/nautigal-regular.ttf",
  weight: "400",
  display: "swap",
  variable: "--font-home-signature",
});
