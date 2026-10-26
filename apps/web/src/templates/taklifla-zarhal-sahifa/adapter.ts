import { getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, formatDate } from "../date-format";
import { createTemplatePreviewSample, getTemplatePreviewWishes } from "@/modules/catalog/preview-sample";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";

export const ZARHAL_SAHIFA_ID = "taklifla-zarhal-sahifa";
export type ZarhalOptions = {
  invitationId: string;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  sampleWishes?: boolean;
  catalogMusic?: boolean;
  silentPlayback?: boolean;
  reducedMotion?: boolean;
};

/** Narrow, read-only projection: no gift, RSVP, contacts or owner/session data. */
export function makeZarhalPayload(invitation: Invitation, locale: Locale, options: ZarhalOptions) {
  const enabledLocales = invitation.enabledLocales;
  const active = enabledLocales.includes(locale) ? locale : invitation.defaultLocale;
  const variants = Object.fromEntries(enabledLocales.map((lang) => {
    const content = getContent(invitation, lang);
    const dress = invitation.dressCode;
    const date = (format: Intl.DateTimeFormatOptions) => formatDate(invitation.startsAt, lang, invitation.timezone, format);
    return [lang, {
      title: content.title,
      names: content.people.filter((name) => name.trim()),
      greeting: options.guestName && content.personalGreeting
        ? content.personalGreeting.replaceAll("{name}", options.guestName)
        : content.greeting,
      message: content.message,
      eventLabel: content.eventLabel,
      date: date({ day: "2-digit", month: "2-digit", year: "numeric" }),
      dateLong: date({ day: "numeric", month: "long", year: "numeric" }),
      weekday: date({ weekday: "long" }),
      time: date({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      venueName: content.venueName,
      address: [content.address, content.landmark].filter(Boolean).join(" · "),
      dressStyle: dress.enabled ? dress.style[lang] || "" : "",
      dressText: dress.enabled ? [dress.text[lang], dress.note[lang]].filter(Boolean).join("\n") : "",
      sampleWishes: options.preview && options.sampleWishes ? getTemplatePreviewWishes(lang) : [],
    }];
  }));
  const creatorPhotos = invitation.gallery.filter((photo) => photo.url.trim());
  const sampleMedia = !!options.preview && !!options.sampleWishes && !creatorPhotos.length;
  const gallery = sampleMedia
    ? createTemplatePreviewSample(ZARHAL_SAHIFA_ID).gallery.filter((photo) => photo.url.trim())
    : creatorPhotos;
  const music = options.preview && options.catalogMusic
    ? { enabled: true, url: CATALOG_PREVIEW_MUSIC.url }
    : { enabled: invitation.music.enabled, url: invitation.music.url };
  return {
    type: "zarhal-sahifa:update" as const,
    payload: {
      locale: active, enabledLocales: [...enabledLocales], variants,
      eventInstant: eventInstant(invitation.startsAt, invitation.timezone)?.getTime() ?? null,
      gallery,
      previewMedia: sampleMedia,
      mapUrl: invitation.venue.mapUrl,
      coordinates: { latitude: invitation.venue.latitude, longitude: invitation.venue.longitude },
      wishesEnabled: invitation.wishes.enabled,
      invitationId: options.invitationId,
      guestToken: options.guestToken || "",
      guestName: options.guestName || "",
      preview: !!options.preview,
      music: { ...music, enabled: music.enabled && !!music.url && !options.silentPlayback, catalogAutoplay: !!options.preview && !!options.catalogMusic },
      reducedMotion: !!options.preview && !!options.reducedMotion,
    },
  };
}
