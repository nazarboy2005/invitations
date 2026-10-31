import { publicAsset } from "../../lib/public-asset";
import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import { mountainDataSchema, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";
import { eventInstant, eventWallDate, formatDate } from "../date-format";

export type MountainOptions = {
  invitationId: string;
  guestToken?: string;
  preview?: boolean;
  silentPlayback?: boolean;
  reducedMotion?: boolean;
  sampleWishes?: boolean;
};

/** Authored shared data; only explicit catalog previews receive canonical wishes. */
export function makeMountainPayload(invitation: Invitation, locale: Locale, guestName = "", options: MountainOptions) {
  const details=mountainDataSchema.parse(invitation.templateData["taklifla-toglar-bagrida"] ?? {});
  const localized = Object.fromEntries(invitation.enabledLocales.map((language) => {
    const content = getContent(invitation, language);
    const wall = eventWallDate(invitation.startsAt, invitation.timezone);
    const pad = (n: number) => String(n).padStart(2, "0");
    return [language, {
      title: content.title,
      sceneTimes:[details.ceremonyTime,details.celebrationTime],
      previewWishes:options.preview && options.sampleWishes ? getTemplatePreviewWishes(language) : [],
      mapUrl:yandexMapUrl(invitation.venue) || (invitation.venue.latitude !== null && invitation.venue.longitude !== null ? `https://yandex.uz/maps/?text=${invitation.venue.latitude},${invitation.venue.longitude}` : content.address || content.venueName ? `https://yandex.uz/maps/?text=${encodeURIComponent(content.address || content.venueName)}` : ""),
      people: content.people.filter(name=>name.trim()).slice(0, 2),
      greeting: guestName && content.personalGreeting ? content.personalGreeting.replaceAll("{name}", guestName) : content.greeting,
      message: content.message,
      eventLabel: content.eventLabel,
      hosts: content.hosts,
      venueName: content.venueName,
      address: [content.address, content.landmark].filter(Boolean).join("\n"),
      programHeading: content.programHeading,
      program: invitation.program.map((entry) => ({
        id: entry.id, time: entry.time,
        title: content.programTitles[entry.id] ?? "",
        description: content.programDescriptions[entry.id] ?? "",
      })),
      // The two source narrative cards have no dedicated scene fields.
      scenes: invitation.story.slice(0, 2).map((chapter) => ({
        id: chapter.id,
        title: chapter.title[language] ?? "",
        text: chapter.text[language] ?? "",
      })),
      heroDate: wall ? `${pad(wall.getUTCDate())} · ${pad(wall.getUTCMonth() + 1)} · ${wall.getUTCFullYear()}` : "",
      mandalaDate: formatDate(invitation.startsAt, language, invitation.timezone, { day: "numeric", month: "long" }),
      time: formatDate(invitation.startsAt, language, invitation.timezone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
    }];
  }));
  return {
    type: "taklifla-mountain:update" as const,
    payload: {
      locale: invitation.enabledLocales.includes(locale) ? locale : invitation.defaultLocale,
      enabledLocales: [...invitation.enabledLocales],
      localized,
      instant: eventInstant(invitation.startsAt, invitation.timezone)?.toISOString() ?? "",
      music: { enabled: invitation.music.enabled, url: publicAsset(invitation.music.url) },
      wishesEnabled: invitation.wishes.enabled,
      rsvp: { enabled: invitation.rsvp.enabled, deadline: invitation.rsvp.deadline },
      guestName,
      invitationId: options.invitationId,
      guestToken: options.preview ? "" : options.guestToken ?? "",
      preview: Boolean(options.preview),
      silentPlayback: Boolean(options.silentPlayback),
      reducedMotion: Boolean(options.preview && options.reducedMotion),
    },
  };
}
