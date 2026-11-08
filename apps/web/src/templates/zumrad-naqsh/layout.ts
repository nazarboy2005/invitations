import type { Invitation, Locale } from "@taklifnoma/contracts";
import { formatDate } from "../date-format";
import type { ImageSlot } from "../oq-atirgul/layout";

export const ZUMRAD_NAQSH_ID = "zumrad-naqsh";
export const ZUMRAD_NAQSH_QR = { x: 645, y: 1733, size: 210 };
const dateLocales = {
  "uz-Latn": "uz-UZ",
  "uz-Cyrl": "uz-Cyrl-UZ",
  en: "en-GB",
  ru: "ru-RU",
};

/** Distinct emerald-and-gold composition; all coordinates use 1500 x 2100. */
export function zumradNaqshSlots(invitation: Invitation, locale: Locale): ImageSlot[] {
  const c = invitation.content[locale];
  if (!c) throw new Error("Missing image language");
  const date = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(invitation.startsAt)
    ? formatDate(invitation.startsAt, locale, invitation.timezone, {
        day: "numeric", month: "long", year: "numeric",
      })
    : "";
  const slot = (key: string, text: string, x: number, y: number, width: number, height: number, size: number, min: number, extra: Partial<ImageSlot> = {}): ImageSlot => ({
    key, text: text.trim(), x, y, width, height, size, min, ...extra,
  });
  return [
    slot("eventLabel", c.eventLabel.toLocaleUpperCase(dateLocales[locale]), 210, 335, 1080, 60, 34, 26, { tracking: 5 }),
    slot("people.0", c.people[0] ?? "", 180, 490, 1140, 115, 88, 49, { italic: true }),
    slot("and", c.people[0]?.trim() && c.people[1]?.trim() ? "&" : "", 300, 615, 900, 58, 47, 42, { italic: true }),
    slot("people.1", c.people[1] ?? "", 180, 685, 1140, 115, 88, 49, { italic: true }),
    slot("message", c.message, 260, 875, 980, 190, 40, 29),
    slot("date", date, 235, 1110, 1030, 88, 67, 42),
    slot("time", date ? invitation.startsAt.slice(11, 16) : "", 430, 1213, 640, 55, 39, 33, { tracking: 4 }),
    slot("venueName", c.venueName, 230, 1350, 1040, 65, 42, 29),
    slot("address", [c.address, c.landmark].filter(Boolean).join(" · "), 290, 1430, 920, 135, 32, 25),
  ];
}
