import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { getContent } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";
import { makeLegacyData } from "@/templates/anor/renderer";

const sourceLocale: Record<Locale, string> = {
  "uz-Latn": "uz",
  "uz-Cyrl": "uz-Cyrl",
  en: "en",
  ru: "ru",
};

/** Adapt only the fields present in the Invitate Nahorgi Osh source. */
export function makeNahorgiOshData(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  guestToken: string,
  invitationId: string,
  preview: boolean,
  sampleWishes: boolean,
) {
  const source = makeLegacyData(invitation, locale, guestName, sampleWishes);
  const content = getContent(invitation, locale);
  const instant = invitation.startsAt
    ? eventInstant(invitation.startsAt, invitation.timezone)
    : null;
  const wall = invitation.startsAt
    ? eventWallDate(invitation.startsAt, invitation.timezone)
    : null;
  const dateText = (options: Intl.DateTimeFormatOptions) =>
    instant ? formatDate(invitation.startsAt, locale, invitation.timezone, options) : "";
  const wallParts = wall
    ? {
        year: wall.getUTCFullYear(),
        monthNumber: wall.getUTCMonth() + 1,
        day: wall.getUTCDate(),
      }
    : {};
  const personalized = guestName
    ? content.personalGreeting.replaceAll("{name}", guestName) || content.greeting
    : content.greeting;
  return {
    ...source,
    locale: sourceLocale[locale],
    languages: invitation.enabledLocales.map((item) => sourceLocale[item]),
    guestName,
    guestToken,
    people: content.people,
    greeting: personalized,
    message: content.message,
    hosts: content.hosts,
    eventType: content.eventLabel,
    dateTime: instant?.toISOString() ?? "",
    date: {
      ...source.date,
      ...wallParts,
      day: wallParts.day ?? "",
      time: dateText({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      short: dateText({ day: "numeric", month: "long", year: "numeric" }),
      long: dateText({ weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    },
    venue: {
      ...source.venue,
      name: content.venueName,
      address: content.address,
      landmark: content.landmark,
      lat: invitation.venue.latitude,
      lng: invitation.venue.longitude,
      mapUrl: yandexMapUrl(invitation.venue),
    },
    contacts: source.contacts,
    rsvp: invitation.rsvp,
    preview,
    apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
  };
}
