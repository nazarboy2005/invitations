import type { Invitation, Locale } from "@taklifnoma/contracts";
import type { LegacyData } from "../anor/renderer";
import { catalogPreviewMusic } from "../../modules/catalog/catalog-music";
import { eventWallDate, eventInstant, formatDate } from "../date-format";
import { defaultEventLabel, getContent } from "@taklifnoma/contracts";
import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";

export type PeonyOptions = {
  invitationId: string;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  sampleWishes?: boolean;
  catalogMusic?: boolean;
  silentPlayback?: boolean;
  qaReducedMotion?: boolean;
};

/** Presentation only: never changes or persists creator invitation data. */
export function makePeonyPayload(
  invitation: Invitation,
  locale: Locale,
  options: PeonyOptions,
) {
  const content = getContent(invitation, locale);
  const wallDate = eventWallDate(invitation.startsAt, invitation.timezone);
  const date = (settings: Intl.DateTimeFormatOptions) =>
    formatDate(invitation.startsAt, locale, invitation.timezone, settings);
  const personalGreeting = options.guestName
    ? content.personalGreeting.replaceAll("{name}", options.guestName)
    : "";
  const data: LegacyData = {
    title: content.title,
    footer: "",
    groom: content.people[0] ?? "",
    bride: content.people[1] ?? "",
    hosts: content.hosts,
    hostsLabel: "",
    greeting: personalGreeting || content.greeting,
    monogram: content.people
      .slice(0, 2)
      .map((person) => Array.from(person.trim())[0] ?? "")
      .join(" & "),
    eventType:
      content.eventLabel || defaultEventLabel(invitation.eventType, locale),
    message: content.message,
    programHeading: content.programHeading,
    dateTime:
      eventInstant(invitation.startsAt, invitation.timezone)?.toISOString() ??
      "",
    date: wallDate
      ? {
          weekday: date({ weekday: "long" }),
          weekdayShort: date({ weekday: "short" }),
          day: wallDate.getUTCDate(),
          month: date({ month: "long" }),
          monthNumber: wallDate.getUTCMonth() + 1,
          year: wallDate.getUTCFullYear(),
          time: date({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
          long: date({
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          short: date({ day: "numeric", month: "long", year: "numeric" }),
        }
      : {
          weekday: "",
          weekdayShort: "",
          day: "",
          month: "",
          monthNumber: "",
          year: "",
          time: "",
          long: "",
          short: "",
        },
    venue: {
      name: content.venueName,
      address: [content.address, content.landmark].filter(Boolean).join(" · "),
      lat: invitation.venue.latitude,
      lng: invitation.venue.longitude,
      mapUrl: invitation.venue.mapUrl,
    },
    program: invitation.program.map((item) => ({
      ...item,
      title: content.programTitles[item.id] ?? "",
      description: content.programDescriptions[item.id] ?? "",
    })),
    story: invitation.story
      .map((item) => ({
        id: item.id,
        title: item.title[locale] ?? "",
        text: item.text[locale] ?? "",
      }))
      .filter((item) => item.title || item.text),
    gallery: invitation.gallery.map((item) => ({
      id: item.id,
      src: item.url,
      alt: item.alt || item.caption,
      caption: item.caption,
    })),
    contacts: invitation.contacts.instagramUrl
      ? [
          {
            type: "instagram",
            label: "Instagram",
            value: invitation.contacts.instagramUrl,
            href: /^https?:\/\//i.test(invitation.contacts.instagramUrl)
              ? invitation.contacts.instagramUrl
              : `https://www.instagram.com/${encodeURIComponent(invitation.contacts.instagramUrl.replace(/^@/, ""))}/`,
          },
        ]
      : [],
    rsvp: { ...invitation.rsvp },
    wishesEnabled: invitation.wishes.enabled,
    wishes:
      options.preview && options.sampleWishes
        ? getTemplatePreviewWishes(locale)
        : [],
    toyona: {
      enabled: invitation.gift.enabled,
      cardNumber: invitation.gift.cardNumber,
      cardHolder: invitation.gift.cardHolder,
      note: "",
    },
    music: { enabled: invitation.music.enabled, url: invitation.music.url },
    timezone: invitation.timezone,
    dressCode: {
      enabled: invitation.dressCode.enabled,
      style: invitation.dressCode.style[locale] ?? "",
      text: invitation.dressCode.text[locale] ?? "",
      note: invitation.dressCode.note[locale] ?? "",
      colors: invitation.dressCode.colors.map((color) => ({
        id: color.id,
        hex: color.hex,
        name: color.name[locale] ?? "",
      })),
    },
  };
  // Empty sample photo slots remain empty: this capture's photographs are a real
  // demo couple's personal uploads, not template-owned decorative artwork.
  data.gallery = data.gallery.filter((image) => Boolean(image.src));
  if (options.silentPlayback) data.music = { enabled: false, url: "" };
  else if (options.preview && options.catalogMusic)
    data.music = { enabled: true, url: catalogPreviewMusic(invitation).url };
  return {
    type: "wedivo-peony-paradise:update" as const,
    payload: {
      data,
      wallDate: wallDate?.toISOString().slice(0, 10) ?? "",
      locale,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId,
      guestName: options.guestName ?? "",
      guestToken: options.guestToken ?? "",
      preview: Boolean(options.preview),
      silentPlayback: Boolean(options.silentPlayback),
      reducedMotion: Boolean(options.preview && options.qaReducedMotion),
      receiptUploadEnabled:
        invitation.gift.enabled && invitation.gift.receiptUploadEnabled,
    },
  };
}
