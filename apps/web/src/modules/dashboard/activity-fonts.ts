import localFont from "next/font/local";

export const activityDisplay = localFont({
  src: [
    {
      path: "../../app/fonts/cormorant-garamond-latin.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../app/fonts/cormorant-garamond-italic-500.ttf",
      weight: "500",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-activity-display",
});
