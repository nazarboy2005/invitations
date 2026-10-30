import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import { gulbogDataSchema, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";

import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";
import { CATALOG_PREVIEW_MUSIC } from "../../modules/catalog/catalog-music";

export type GulbogOptions = {
  invitationId: string;
  preview?: boolean;
  catalogMusic?: boolean;
  guestName?: string;
  guestToken?: string;
  silentPlayback?: boolean;
  qaReducedMotion?: boolean;
};

/** Narrow public-view envelope. Never carries owner, gift or private guest records. */
export function makeGulbogPayload(invitation: Invitation, locale: Locale, options: GulbogOptions) {
  const details=gulbogDataSchema.parse(invitation.templateData["taklifla-gulbog"] ?? {});
  const variants = Object.fromEntries(invitation.enabledLocales.map((language) => {
    const c = getContent(invitation, language);
    const wall = eventWallDate(invitation.startsAt, invitation.timezone);
    const instant = eventInstant(invitation.startsAt, invitation.timezone);
    const guest = options.guestName || "";
    const greeting = guest && c.personalGreeting
      ? c.personalGreeting.replace(/\{\{?\s*(?:name|guest)\s*\}?\}/g, guest)
      : c.greeting;
    const mapUrl = yandexMapUrl(invitation.venue) || (
      invitation.venue.latitude !== null && invitation.venue.longitude !== null
        ? `https://yandex.uz/maps/?text=${invitation.venue.latitude},${invitation.venue.longitude}`
        : c.address || c.venueName
          ? `https://yandex.uz/maps/?text=${encodeURIComponent(c.address || c.venueName)}` : ""
    );
    return [language, {
      brideFamily:details.brideFamily[language] ?? "",reminderTitle:details.reminderTitle[language] ?? "",reminderText:details.reminderText[language] ?? "",footerNote:details.footerNote[language] ?? null,
      sampleWishes:options.preview && options.catalogMusic ? getTemplatePreviewWishes(language).map(w=>({name:w.name,message:w.text})) : [],
      title: c.title, people: c.people.filter(Boolean).slice(0, 2), hosts: c.hosts,
      greeting, message: c.message, eventLabel: c.eventLabel,
      date: wall && instant ? {
        instant: instant.toISOString(), day: String(wall.getUTCDate()), year: String(wall.getUTCFullYear()),
        month: formatDate(invitation.startsAt, language, invitation.timezone, { month: "long" }),
        full: formatDate(invitation.startsAt, language, invitation.timezone, { day: "numeric", month: "long", year: "numeric" }),
      } : null,
      venue: { name: c.venueName, address: c.address, landmark: c.landmark, mapUrl },
      programHeading: c.programHeading,
      program: invitation.program.map((item) => ({
        id: item.id, time: item.time, title: c.programTitles[item.id] || "",
        description: c.programDescriptions[item.id] || "",
      })),
      music: options.preview && options.catalogMusic ? {enabled:true,url:CATALOG_PREVIEW_MUSIC.url} : { enabled: invitation.music.enabled, url: invitation.music.url },
      wishesEnabled: invitation.wishes.enabled,
    }];
  }));
  return {
    type: "taklifla-gulbog:update" as const,
    payload: {
      locale, enabledLocales: invitation.enabledLocales, variants,
      invitationId: options.invitationId, guestName: options.guestName || "",
      guestToken: options.guestToken || "", preview: Boolean(options.preview),
      silentPlayback: Boolean(options.preview && options.silentPlayback),
      reducedMotion: Boolean(options.preview && options.qaReducedMotion),
    },
  };
}
