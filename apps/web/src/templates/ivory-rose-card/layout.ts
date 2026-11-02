import type { Invitation, Locale } from "@taklifnoma/contracts";
import { formatDate } from "../date-format";

export const IMAGE_TEMPLATE_ID = "ivory-rose-card";
export const IMAGE_SIZE = { width: 1500, height: 2100 };
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
      date =
        formatDate(invitation.startsAt, locale, invitation.timezone, {
          day: "numeric",
          month: "long",
          year: "numeric",
        }) +
        "  ·  " +
        invitation.startsAt.slice(11, 16);
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
    slot("greeting", c.greeting, 615, 100, 37, 29),
    slot("people.0", c.people[0] ?? "", 740, 130, 108, 58, { italic: true }),
    slot(
      "and",
      c.people[0]?.trim() && c.people[1]?.trim() ? "&" : "",
      875,
      65,
      52,
      52,
      { italic: true },
    ),
    slot("people.1", c.people[1] ?? "", 945, 130, 108, 58, { italic: true }),
    slot("message", c.message, 1130, 190, 41, 30),
    slot("date", date, 1370, 65, 43, 33),
    slot("venueName", c.venueName, 1470, 85, 46, 32),
    slot(
      "address",
      [c.address, c.landmark].filter(Boolean).join(" · "),
      1560,
      125,
      34,
      27,
    ),
    slot("hosts", c.hosts, 1690, 95, 36, 28, { width: 760, x: 330 }),
    slot("phone", invitation.contacts.phoneNumber, 1785, 55, 30, 27, {
      width: 650,
      x: 330,
    }),
  ];
}
