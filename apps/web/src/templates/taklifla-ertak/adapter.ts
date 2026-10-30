import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import { getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";

import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";

export const ERTAK_TEMPLATE = {
  id: "taklifla-ertak",
  name: "Ertak",
  supportedEventTypes: ["wedding"],
  published: true,
  selectable: true,
} as const;

/** Presentation projection only. This module neither creates nor persists fixtures. */
export function makeErtakPayload(
  invitation: Invitation,
  locale: Locale,
  options: {
    invitationId: string;
    preview?: boolean;
    sampleWishes?: boolean;
    guestName?: string;
    guestToken?: string;
    reducedMotion?: boolean;
    catalogMusicUrl?: string;
    silentPlayback?: boolean;
  },
) {
  const content = getContent(invitation, locale);
  const wall = eventWallDate(invitation.startsAt, invitation.timezone);
  const instant = eventInstant(invitation.startsAt, invitation.timezone);
  const people = content.people.filter((name) => name.trim());
  const preview = options.preview === true;
  const greeting = options.guestName && content.personalGreeting
    ? content.personalGreeting.replaceAll("{name}", options.guestName)
    : content.greeting;
  const mapUrl = /^https?:\/\//i.test(yandexMapUrl(invitation.venue))
    ? yandexMapUrl(invitation.venue)
    : invitation.venue.latitude !== null && invitation.venue.longitude !== null
      ? `https://yandex.uz/maps/?text=${invitation.venue.latitude},${invitation.venue.longitude}`
      : content.venueName || content.address ? `https://yandex.uz/maps/?text=${encodeURIComponent([content.venueName,content.address].filter(Boolean).join(" "))}` : "";
  return {
    type: "taklifla-ertak:update" as const,
    payload: {
      locale,
      enabledLocales: invitation.enabledLocales,
      preview,
      invitationId: preview ? "" : options.invitationId,
      guestToken: preview ? "" : options.guestToken ?? "",
      reducedMotion: preview && options.reducedMotion === true,
      title: content.title,
      people: people.slice(0, 2),
      greeting,
      hosts: content.hosts,
      message: content.message,
      eventLabel: content.eventLabel,
      date: wall ? {
        day: String(wall.getUTCDate()).padStart(2, "0"),
        month: String(wall.getUTCMonth() + 1).padStart(2, "0"),
        year: String(wall.getUTCFullYear()),
        weekday: formatDate(invitation.startsAt, locale, invitation.timezone, { weekday: "long" }),
        long: formatDate(invitation.startsAt, locale, invitation.timezone, { day: "numeric", month: "long" }),
        time: formatDate(invitation.startsAt, locale, invitation.timezone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      } : null,
      instant: instant?.toISOString() ?? "",
      venue: { name: content.venueName, address: content.address, landmark: content.landmark, mapUrl },
      programHeading: content.programHeading,
      program: invitation.program.map((item) => ({
        id: item.id,
        time: item.time,
        title: content.programTitles[item.id] ?? "",
        description: content.programDescriptions[item.id] ?? "",
      })),
      sampleWishes: preview && options.sampleWishes ? getTemplatePreviewWishes(locale).map((w,i)=>({id:`sample-${i}`,name:w.name,message:w.text})) : [],
      wishesEnabled: invitation.wishes.enabled,
      music: preview && options.catalogMusicUrl
        ? { enabled: true, url: options.catalogMusicUrl }
        : { enabled: invitation.music.enabled, url: invitation.music.url },
      silentPlayback: preview && options.silentPlayback === true,
    },
  };
}

export type ErtakPayload = ReturnType<typeof makeErtakPayload>;
