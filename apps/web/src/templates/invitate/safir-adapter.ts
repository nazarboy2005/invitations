import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { getContent } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makeLegacyData } from "@/templates/anor/renderer";

const sourceLocale: Record<Locale, string> = {
  "uz-Latn": "uz",
  "uz-Cyrl": "uz-Cyrl",
  en: "en",
  ru: "ru",
};

export function makeSafirData(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  guestToken: string,
  invitationId: string,
  preview: boolean,
  sampleWishes: boolean,
  catalogMusic: boolean,
  silentPlayback: boolean,
) {
  const source = makeLegacyData(invitation, locale, guestName, sampleWishes);
  const content = getContent(invitation, locale);
  return {
    ...source,
    eventType: content.eventLabel,
    dateTime: source.dateTime,
    date: source.date,
    greeting: guestName
      ? content.personalGreeting.replaceAll("{name}", guestName) ||
        content.greeting
      : content.greeting,
    venue: {
      ...source.venue,
      name: content.venueName,
      address: content.address,
      landmark: content.landmark,
      lat: invitation.venue.latitude,
      lng: invitation.venue.longitude,
      mapUrl: yandexMapUrl(invitation.venue),
    },
    programHeading: content.programHeading,
    program: invitation.program.map((entry) => ({
      id: entry.id,
      time: entry.time,
      title: content.programTitles[entry.id] ?? "",
    })),
    dressCode: {
      enabled: invitation.dressCode.enabled,
      style: invitation.dressCode.style[locale] ?? "",
      text: invitation.dressCode.text[locale] ?? "",
      note: invitation.dressCode.note[locale] ?? "",
      colors: invitation.dressCode.colors.map((color) => ({
        hex: color.hex,
        name: color.name[locale] ?? "",
      })),
    },
    rsvp: invitation.rsvp,
    wishesEnabled: invitation.wishes.enabled,
    rsvpIntro: content.message,
    locale: sourceLocale[locale],
    languages: invitation.enabledLocales.map((item) => sourceLocale[item]),
    guestName,
    guestToken,
    music: invitation.music.enabled
      ? invitation.music.url
      : preview && catalogMusic
        ? CATALOG_PREVIEW_MUSIC.url
        : "",
    silentPlayback: preview && silentPlayback,
    preview,
    apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
  };
}
