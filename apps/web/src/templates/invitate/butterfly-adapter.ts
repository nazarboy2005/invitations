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

/** The single contract to source mapping used by Butterfly's isolated page. */
export function makeButterflyData(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  guestToken: string,
  invitationId: string,
  options: { preview: boolean; catalogMusic: boolean; sampleWishes: boolean; silentPlayback: boolean },
) {
  const data = makeLegacyData(invitation, locale, guestName, options.sampleWishes);
  const content = getContent(invitation, locale);
  const start = invitation.startsAt ? eventInstant(invitation.startsAt, invitation.timezone) : null;
  const wall = invitation.startsAt ? eventWallDate(invitation.startsAt, invitation.timezone) : null;
  const format = (style: Intl.DateTimeFormatOptions) =>
    start ? formatDate(invitation.startsAt, locale, invitation.timezone, style) : "";
  const wallDate = wall
    ? { year: wall.getUTCFullYear(), monthNumber: wall.getUTCMonth() + 1, day: wall.getUTCDate() }
    : {};
  const gallery = invitation.gallery
    .filter((item) => item.url.trim())
    .map((item) => ({ id: item.id, src: item.url, alt: item.alt || item.caption, caption: item.caption }));
  if (options.preview && !gallery.length) {
    // These source photographs are presentation-only and never enter invitation data.
    gallery.push(
      { id: "butterfly-preview-memory-1", src: "/templates/butterfly/assets/images/afina/image2.png", alt: "Preview memory", caption: "" },
      { id: "butterfly-preview-memory-2", src: "/templates/butterfly/assets/images/afina/image3.png", alt: "Preview memory", caption: "" },
    );
  }
  const music = invitation.music.enabled ? invitation.music.url : "";
  return {
    ...data,
    locale: sourceLocale[locale],
    languages: invitation.enabledLocales.map((item) => sourceLocale[item]),
    guestName,
    guestToken,
    groom: content.people[0] || "",
    bride: content.people[1] || "",
    greeting: guestName ? content.personalGreeting.replaceAll("{name}", guestName) : content.greeting,
    message: content.message,
    hosts: content.hosts,
    eventType: content.eventLabel || data.eventType,
    dateTime: start?.toISOString() || "",
    date: {
      ...data.date,
      ...wallDate,
      weekday: format({ weekday: "long" }),
      day: wallDate.day || "",
      month: format({ month: "long" }),
      time: format({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      short: format({ day: "numeric", month: "long", year: "numeric" }),
      long: format({ weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    },
    venue: {
      name: content.venueName,
      address: [content.address, content.landmark].filter(Boolean).join(" · "),
      lat: invitation.venue.latitude,
      lng: invitation.venue.longitude,
      mapUrl: invitation.venue.mapUrl,
    },
    gallery,
    music: { enabled: Boolean(music), url: music },
    catalogMusic: options.preview && options.catalogMusic,
    preview: options.preview,
    catalogPreview: options.preview && options.sampleWishes,
    silentPlayback: options.preview && options.silentPlayback,
    apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
  };
}
