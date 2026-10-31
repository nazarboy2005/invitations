import { publicAsset } from "../../lib/public-asset";
import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { getContent } from "@taklifnoma/contracts";
import { eventInstant, formatDate } from "../date-format";
import { makeLegacyData } from "../anor/renderer";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";

const localeNames: Record<Locale, string> = {
  "uz-Latn": "uz-Latn", "uz-Cyrl": "uz-Cyrl", en: "en", ru: "ru",
};

export function makeBloomData(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  guestToken: string,
  invitationId: string,
  preview: boolean,
  catalogMusic: boolean,
  silentPlayback: boolean,
) {
  const content = getContent(invitation, locale);
  const legacy = makeLegacyData(invitation, locale, guestName);
  const instant = eventInstant(invitation.startsAt, invitation.timezone);
  return {
    ...legacy,
    locale: localeNames[locale],
    eventType: content.eventLabel,
    dateTime: instant?.toISOString() ?? "",
    date: {
      short: instant ? formatDate(invitation.startsAt, locale, invitation.timezone, { day: "numeric", month: "long", year: "numeric" }) : "",
      long: instant ? formatDate(invitation.startsAt, locale, invitation.timezone, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "",
    },
    venue: {
      name: content.venueName,
      address: content.address,
      landmark: content.landmark,
      mapUrl: yandexMapUrl(invitation.venue),
      lat: invitation.venue.latitude,
      lng: invitation.venue.longitude,
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
    },
    gallery: preview ? [{
      url: publicAsset("/templates/bloom/source/assets/previews/template/bloom/pink.png"),
      alt: "",
      caption: "",
    }] : invitation.gallery.map((photo) => ({
      url: photo.url,
      alt: photo.alt,
      caption: photo.caption,
    })),
    music: invitation.music.enabled
      ? publicAsset(invitation.music.url)
      : preview && catalogMusic
        ? CATALOG_PREVIEW_MUSIC.url
        : "",
    rsvpEnabled: invitation.rsvp.enabled,
    guestName,
    guestToken,
    preview,
    silentPlayback: preview && silentPlayback,
    apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
  };
}
