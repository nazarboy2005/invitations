import { defaultEventLabel, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";
import { CATALOG_PREVIEW_MUSIC } from "../../modules/catalog/catalog-music";
import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";
import sourcePreviewMedia from "../../../public/templates/wedivo-melting-reality/assets/preview-media.json";

export type MeltingOptions = {
  invitationId: string;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  catalogMusic?: boolean;
  sampleWishes?: boolean;
  silentPlayback?: boolean;
  qaReducedMotion?: boolean;
};

/** Public presentation values only. No defaults or source demo values enter the draft. */
export function makeMeltingRealityPayload(invitation: Invitation, locale: Locale, options: MeltingOptions) {
  const content = getContent(invitation, locale);
  const dateAt = eventInstant(invitation.startsAt, invitation.timezone);
  const wall = eventWallDate(invitation.startsAt, invitation.timezone);
  const dateFormat = (settings: Intl.DateTimeFormatOptions) => invitation.startsAt ? formatDate(invitation.startsAt, locale, invitation.timezone, settings) : "";
  const guestGreeting = options.guestName ? content.personalGreeting.replaceAll("{name}", options.guestName) : "";
  const data = {
    groom: content.people[0] ?? "", bride: content.people[1] ?? "", hosts: content.hosts,
    greeting: guestGreeting || content.greeting, message: content.message,
    eventType: content.eventLabel || defaultEventLabel(invitation.eventType, locale),
    programHeading: content.programHeading,
    dateTime: dateAt?.toISOString() ?? "", timezone: invitation.timezone,
    date: {
      day: wall?.getUTCDate() ?? "", monthNumber: wall ? wall.getUTCMonth() + 1 : "", year: wall?.getUTCFullYear() ?? "",
      weekday: dateFormat({ weekday: "long" }), short: dateFormat({ day: "numeric", month: "long", year: "numeric" }),
      long: dateFormat({ weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      time: dateFormat({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
    },
    venue: { name: content.venueName, address: content.address, note: content.landmark, mapUrl: invitation.venue.mapUrl, lat: invitation.venue.latitude, lng: invitation.venue.longitude },
    program: invitation.program.map(item => ({ ...item, title: content.programTitles[item.id] ?? "", description: content.programDescriptions[item.id] ?? "" })),
    story: invitation.story.map(chapter => ({ id: chapter.id, title: chapter.title[locale] ?? "", text: chapter.text[locale] ?? "" })).filter(chapter => chapter.title.trim() || chapter.text.trim()),
    gallery: invitation.gallery.map(item => ({ id: item.id, src: item.url, alt: item.alt, caption: item.caption })),
    wishes: options.preview && options.sampleWishes ? getTemplatePreviewWishes(locale) : [],
    wishesEnabled: invitation.wishes.enabled, rsvp: invitation.rsvp,
    music: { enabled: invitation.music.enabled, url: invitation.music.url },
    dressCode: {
      enabled: invitation.dressCode.enabled, style: invitation.dressCode.style[locale] ?? "", text: invitation.dressCode.text[locale] ?? "", note: invitation.dressCode.note[locale] ?? "",
      colors: invitation.dressCode.colors.map(color => ({ id: color.id, name: color.name[locale] ?? "", hex: color.hex })),
    },
  };
  return {
    type: "wedivo-melting-reality:update" as const,
    payload: {
      ...options,
      locale,
      enabledLocales: invitation.enabledLocales,
      data: {
        ...data,
        gallery: options.preview && options.sampleWishes && !data.gallery.some((item) => item.src)
          ? sourcePreviewMedia.map((item, index) => ({ ...item, id: `preview-source-${index}` }))
          : data.gallery,
        music: options.preview && options.catalogMusic
          ? { enabled: true, url: CATALOG_PREVIEW_MUSIC.url }
          : data.music,
      },
    },
  };
}
