import type { Invitation, Locale } from "@taklifnoma/contracts";
import { formatDate, intlLocale } from "./date-format";

export type ImageSlot = {
  key: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  size: number;
  min: number;
  italic?: boolean;
  tracking?: number;
  font?: "calligraphy" | "display";
  align?: "left" | "center" | "right";
  color?: string;
  lineHeight?: number;
};

export type StaticImageDesign = {
  folder: string;
  background: "background.png" | "background.svg";
  ink: string;
  qrInk: string;
  qrPaper: string;
  qr: { x: number; y: number; size: number };
  calligraphy?: boolean;
  displayFont?: boolean;
  composition?: string;
  slots: (invitation: Invitation, locale: Locale) => ImageSlot[];
};

export const imageSlot = (
  key: string,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  size: number,
  min: number,
  extra: Partial<ImageSlot> = {},
): ImageSlot => ({
  key,
  text: text.trim(),
  x,
  y,
  width,
  height,
  size,
  min,
  ...extra,
});

/** Shared contract/wording only; each design owns all visual decisions. */
export function staticContent(invitation: Invitation, locale: Locale) {
  const c = invitation.content[locale];
  if (!c) throw new Error("Missing image language");
  const date = (options: Intl.DateTimeFormatOptions) =>
    formatDate(invitation.startsAt, locale, invitation.timezone, options);
  const upper = (value: string) => value.toLocaleUpperCase(intlLocale[locale]);
  const labels = {
    "uz-Latn": {
      venue: "MAROSIM MANZILI",
      qr: "Sizni kutamiz",
      scan: "Manzil uchun QR kodni skanerlang",
      time: "SOAT",
    },
    "uz-Cyrl": {
      venue: "МАРОСИМ МАНЗИЛИ",
      qr: "Сизни кутамиз",
      scan: "Манзил учун QR кодни сканерланг",
      time: "СОАТ",
    },
    en: {
      venue: "THE VENUE",
      qr: "Join us here",
      scan: "Scan the QR code for directions",
      time: "TIME",
    },
    ru: {
      venue: "МЕСТО ТОРЖЕСТВА",
      qr: "Ждём вас",
      scan: "Сканируйте QR-код для маршрута",
      time: "ВРЕМЯ",
    },
  }[locale];
  return {
    c,
    date,
    upper,
    labels,
    month: upper(
      locale === "ru"
        ? date({ day: "numeric", month: "long" }).replace(/^\d+\s*/, "")
        : date({ month: "long" }),
    ),
    year: date({ year: "numeric" }),
    day: date({ day: "2-digit" }),
    weekday: date({ weekday: "long" }),
    time: date({ hour: "2-digit", minute: "2-digit", hour12: false }),
    address: [c.address, c.landmark].filter(Boolean).join(" · "),
    and: c.people[0]?.trim() && c.people[1]?.trim() ? "&" : "",
  };
}
