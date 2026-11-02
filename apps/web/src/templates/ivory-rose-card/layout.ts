import type { Invitation, Locale } from "@taklifnoma/contracts";
import { formatDate } from "../date-format";

export const IMAGE_TEMPLATE_ID = "ivory-rose-card";
export const IMAGE_SIZE = { width: 1500, height: 2100 };
export const IMAGE_LOCATION_QR = { x: 585, y: 1710, size: 210 };
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
};
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
  let date = "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(invitation.startsAt)) {
    const localDate = new Date(
      invitation.startsAt + (invitation.startsAt.length === 16 ? ":00Z" : "Z"),
    );
    if (Number.isFinite(localDate.getTime()))
      date = formatDate(invitation.startsAt, locale, invitation.timezone, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  }
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
    x: 300,
    width: 900,
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
      480,
      80,
      35,
      27,
      { tracking: 6 },
    ),
    slot("people.0", c.people[0] ?? "", 650, 120, 88, 50, { italic: true }),
    slot(
      "and",
      c.people[0]?.trim() && c.people[1]?.trim() ? "&" : "",
      775,
      65,
      52,
      52,
      { italic: true },
    ),
    slot("people.1", c.people[1] ?? "", 850, 120, 88, 50, { italic: true }),
    slot("message", c.message, 1040, 170, 41, 30),
    slot("date", date, 1260, 100, 72, 45),
    slot(
      "time",
      date ? invitation.startsAt.slice(11, 16) : "",
      1370,
      60,
      42,
      36,
      { tracking: 4 },
    ),
    slot("venueName", c.venueName, 1470, 75, 43, 30),
    slot(
      "address",
      [c.address, c.landmark].filter(Boolean).join(" · "),
      1545,
      130,
      34,
      27,
      { x: 325, width: 780 },
    ),
  ];
}
