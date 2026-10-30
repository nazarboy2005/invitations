import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import { pariDataSchema, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";
import { eventInstant, eventWallDate, formatDate } from "../date-format";

export type PariOptions = {
  invitationId: string;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  sampleWishes?: boolean;
  silentPlayback?: boolean;
  reducedMotion?: boolean;
};

/** Presentation only. Never creates, saves, or fills an invitation with sample data. */
export function makePariPayload(invitation: Invitation, locale: Locale, options: PariOptions) {
  const details=pariDataSchema.parse(invitation.templateData["taklifla-parilar-ertagi"] ?? {});
  const variants = Object.fromEntries(invitation.enabledLocales.map((language) => {
    const content = getContent(invitation, language);
    const wall = eventWallDate(invitation.startsAt, invitation.timezone);
    const localized=(v:Partial<Record<Locale,string>>)=>v[language] ?? v[invitation.defaultLocale] ?? "";
    return [language, {
      arrivalNote:details.arrivalNote[language] ?? details.arrivalNote[invitation.defaultLocale] ?? "",
      phone:invitation.rsvp.enabled ? invitation.contacts.phoneNumber : "",
      content: { ...content, greeting: options.guestName && content.personalGreeting
        ? content.personalGreeting.replaceAll("{name}", options.guestName) : content.greeting },
      day: wall ? String(wall.getUTCDate()) : "",
      year: wall ? String(wall.getUTCFullYear()) : "",
      month: formatDate(invitation.startsAt, language, invitation.timezone, { month: "long" }),
      date: formatDate(invitation.startsAt, language, invitation.timezone, { day: "numeric", month: "long", year: "numeric" }),
      time: formatDate(invitation.startsAt, language, invitation.timezone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      program: invitation.program.map((item) => ({ ...item,
        label:details.programLabels[item.id]?.[language] ?? details.programLabels[item.id]?.[invitation.defaultLocale] ?? "",
        title: content.programTitles[item.id] ?? "", description: content.programDescriptions[item.id] ?? "" })),
      dress: invitation.dressCode.enabled ? [localized(invitation.dressCode.style), localized(invitation.dressCode.text),
        localized(invitation.dressCode.note), ...invitation.dressCode.colors.map((color) => localized(color.name)||color.hex)].filter(Boolean).join("\n") : "",
      previewWishes: options.preview && options.sampleWishes ? getTemplatePreviewWishes(language) : [],
    }];
  }));
  return { type: "taklifla-parilar-ertagi:update" as const, payload: {
    ...options, locale:invitation.enabledLocales.includes(locale)?locale:invitation.defaultLocale, variants, enabledLocales: invitation.enabledLocales,
    instant: eventInstant(invitation.startsAt, invitation.timezone)?.toISOString() ?? "",
    mapUrl: yandexMapUrl(invitation.venue) || (invitation.venue.latitude !== null && invitation.venue.longitude !== null
      ? `https://yandex.uz/maps/?text=${invitation.venue.latitude},${invitation.venue.longitude}` : ""),
    wishesEnabled: invitation.wishes.enabled,
    music: invitation.music,
  } };
}
