import { publicAsset } from "../../lib/public-asset";
import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import { osmonDataSchema, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";
import { eventInstant, formatDate } from "../date-format";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";

export type OsmonOptions = {
  invitationId: string;
  guestToken?: string;
  guestName?: string;
  preview?: boolean;
  catalogMusic?: boolean;
  silentPlayback?: boolean;
  fullPreview?: boolean;
  reducedMotion?: boolean;
};

/** Pure projection. No fixture import, persistence, fallback people or media. */
export function makeOsmonPayload(invitation: Invitation, locale: Locale, options: OsmonOptions) {
  const details=osmonDataSchema.parse(invitation.templateData["taklifla-osmon"] ?? {});
  const variants = Object.fromEntries(invitation.enabledLocales.map((lang) => {
    const content = getContent(invitation, lang);
    const date = (opts: Intl.DateTimeFormatOptions) => formatDate(invitation.startsAt, lang, invitation.timezone, opts);
    const day = date({ day: "2-digit" });
    const month = date({ month: "long" }).toUpperCase();
    const year = date({ year: "numeric" });
    const numericDate = date({ day: "2-digit", month: "2-digit", year: "numeric" });
    const time = date({ hour: "2-digit", minute: "2-digit", hour12: false });
    const dress = invitation.dressCode;
    const localized = (values: Partial<Record<Locale, string>>) => values[lang] || values[invitation.defaultLocale] || "";
    return [lang, {
      title: content.title,
      rsvpNote:details.rsvpNote[lang] ?? details.rsvpNote[invitation.defaultLocale] ?? null,
      giftNote:details.giftNote[lang] ?? details.giftNote[invitation.defaultLocale] ?? null,
      previewWishes:options.preview && options.catalogMusic ? getTemplatePreviewWishes(lang) : [],
      people: content.people,
      eventLabel: content.eventLabel,
      hosts: content.hosts,
      greeting: options.guestName && content.personalGreeting
        ? content.personalGreeting.replaceAll("{name}", options.guestName)
        : content.greeting,
      message: content.message,
      venueName: content.venueName,
      address: [content.address, content.landmark].filter(Boolean).join("\n"),
      cityAddress: content.address,
      programHeading: content.programHeading,
      program: invitation.program.map(item => ({
        id: item.id,
        time: item.time,
        title: content.programTitles[item.id] || "",
        description: content.programDescriptions[item.id] || "",
      })),
      dress: dress.enabled ? [localized(dress.style), localized(dress.text), localized(dress.note)].filter(Boolean).join("\n") : "",
      // Source has a prose dress-code row, not a palette widget.
      dressColors: dress.enabled ? dress.colors.map(color => ({name: localized(color.name), hex: color.hex})) : [],
      heroDate: day ? `${day} · ${month} · ${year}` : "",
      invitationDate: day ? `${day} ${month} ${year} · ${time}` : "",
      numericDate,
      countdownDate: day ? `${numericDate} · ${time}` : "",
      deadline: invitation.rsvp.deadline ? formatDate(invitation.rsvp.deadline, lang, invitation.timezone, {day:"numeric", month:"long"}) : "",
    }];
  }));
  const mapUrl = /^https?:\/\//i.test(yandexMapUrl(invitation.venue)) ? yandexMapUrl(invitation.venue)
    : invitation.venue.latitude !== null && invitation.venue.longitude !== null
      ? `https://yandex.uz/maps/?text=${invitation.venue.latitude},${invitation.venue.longitude}` : "";
  return {
    type: "taklifla-osmon:update" as const,
    payload: {
      locale: invitation.enabledLocales.includes(locale) ? locale : invitation.defaultLocale,
      enabledLocales: invitation.enabledLocales,
      variants,
      invitationId: options.invitationId,
      guestToken: options.guestToken || "",
      guestName: options.guestName || "",
      preview: !!options.preview,
      reducedMotion: !!options.reducedMotion,
      target: eventInstant(invitation.startsAt, invitation.timezone)?.getTime() ?? null,
      mapUrl,
      phone: invitation.rsvp.enabled ? invitation.contacts.phoneNumber : "",
      wishes: invitation.wishes.enabled,
      music: options.preview && options.catalogMusic
        ? {enabled: true, url: CATALOG_PREVIEW_MUSIC.url}
        : {enabled: invitation.music.enabled, url: publicAsset(invitation.music.url)},
      silentPlayback: !!options.silentPlayback || (!!options.preview && !options.catalogMusic && !options.fullPreview),
    },
  };
}

export type OsmonMessage = ReturnType<typeof makeOsmonPayload>;
