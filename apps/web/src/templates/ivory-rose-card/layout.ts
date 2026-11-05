import type { Invitation, Locale } from "@taklifnoma/contracts";
import { formatDate } from "../date-format";
import type { ImageSlot } from "../static-design";
export type { ImageSlot } from "../static-design";

export const IMAGE_TEMPLATE_ID = "ivory-rose-card";
export const IMAGE_SIZE = { width: 1500, height: 2100 };
export const IMAGE_LOCATION_QR = { x: 345, y: 1735, size: 210 };
const dateLocales = {
  "uz-Latn": "uz-UZ",
  "uz-Cyrl": "uz-Cyrl-UZ",
  en: "en-GB",
  ru: "ru-RU",
};

/** Coordinates are in final 1500 × 2100 artwork pixels. No sample defaults. */
export function imageSlots(
  invitation: Invitation,
  locale: Locale,
): ImageSlot[] {
  const c = invitation.content[locale];
  if (!c) throw new Error("Missing image language");
  const datePart = (options: Intl.DateTimeFormatOptions) =>
    formatDate(invitation.startsAt, locale, invitation.timezone, options);
  // Russian months take the genitive form when paired with a day number.
  const month =
    locale === "ru"
      ? datePart({ day: "numeric", month: "long" }).replace(/^\d+\s*/, "")
      : datePart({ month: "long" });
  const labels = {
    "uz-Latn": {
      venue:
        invitation.eventType === "fotiha" ? "MAROSIM MANZILI" : "TO‘Y MANZILI",
      qr: "Manzilni ochish",
      scan: "QR kodni skanerlang",
    },
    "uz-Cyrl": {
      venue:
        invitation.eventType === "fotiha" ? "МАРОСИМ МАНЗИЛИ" : "ТЎЙ МАНЗИЛИ",
      qr: "Манзилни очиш",
      scan: "QR кодни сканерланг",
    },
    en: { venue: "THE VENUE", qr: "Find your way", scan: "Scan the QR code" },
    ru: {
      venue: "МЕСТО ТОРЖЕСТВА",
      qr: "Как добраться",
      scan: "Сканируйте QR-код",
    },
  }[locale];
  const slot = (
    key: string,
    text: string,
    y: number,
    height: number,
    size: number,
    min: number,
    extra: Partial<ImageSlot> = {},
  ): ImageSlot => ({
    key,
    text: text.trim(),
    x: 345,
    width: 790,
    y,
    height,
    size,
    min,
    ...extra,
  });
  return [
    slot(
      "eventLabel",
      c.eventLabel.toLocaleUpperCase(dateLocales[locale]),
      485,
      55,
      30,
      26,
      { x: 410, width: 800, tracking: 6, color: "#80704c" },
    ),
    slot("people.0", c.people[0] ?? "", 595, 170, 142, 66, {
      x: 390,
      width: 840,
      font: "calligraphy",
      lineHeight: 1.22,
    }),
    slot(
      "and",
      c.people[0]?.trim() && c.people[1]?.trim() ? "&" : "",
      758,
      55,
      44,
      40,
      { x: 750, width: 120, italic: true, color: "#978052" },
    ),
    slot("people.1", c.people[1] ?? "", 810, 170, 142, 66, {
      x: 390,
      width: 840,
      font: "calligraphy",
      lineHeight: 1.22,
    }),
    slot("message", c.message, 1010, 160, 39, 30, {
      x: 380,
      width: 830,
      lineHeight: 1.35,
    }),
    slot("date.day", datePart({ day: "2-digit" }), 1220, 135, 122, 96, {
      x: 345,
      width: 150,
    }),
    slot(
      "date.month",
      month.toLocaleUpperCase(dateLocales[locale]),
      1235,
      60,
      40,
      32,
      { x: 550, width: 275, align: "left", tracking: 3 },
    ),
    slot("date.year", datePart({ year: "numeric" }), 1295, 50, 34, 30, {
      x: 550,
      width: 275,
      align: "left",
      tracking: 5,
      color: "#80704c",
    }),
    slot("date.weekday", datePart({ weekday: "long" }), 1237, 45, 29, 25, {
      x: 880,
      width: 255,
      italic: true,
      color: "#80704c",
    }),
    slot(
      "time",
      datePart({ hour: "2-digit", minute: "2-digit", hour12: false }),
      1285,
      65,
      53,
      42,
      { x: 880, width: 255, tracking: 3 },
    ),
    slot(
      "venueLabel",
      c.venueName.trim() ? labels.venue : "",
      1420,
      38,
      25,
      23,
      { align: "left", tracking: 4, color: "#80704c" },
    ),
    slot("venueName", c.venueName, 1470, 95, 49, 35, {
      width: 710,
      align: "left",
      lineHeight: 1.12,
    }),
    slot(
      "address",
      [c.address, c.landmark].filter(Boolean).join(" · "),
      1580,
      115,
      34,
      27,
      { width: 665, align: "left", lineHeight: 1.3 },
    ),
    slot("qrLabel", labels.qr, 1740, 55, 35, 29, {
      x: 595,
      width: 300,
      align: "left",
      italic: true,
    }),
    slot("qrHint", labels.scan, 1795, 60, 27, 23, {
      x: 595,
      width: 280,
      align: "left",
      color: "#80704c",
      lineHeight: 1.25,
    }),
  ];
}
