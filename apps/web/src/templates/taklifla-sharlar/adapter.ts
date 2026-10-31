import { publicAsset } from "../../lib/public-asset";
import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import {getTemplatePreviewWishes} from "../../modules/catalog/preview-sample";
import { sharlarDataSchema, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";

export type SharlarOptions = {
  invitationId: string;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  sampleWishes?: boolean;
  silentPlayback?: boolean;
  reducedMotion?: boolean;
};

/** Presentation only. The caller owns fixture selection and persistence. */
export function makeSharlarPayload(invitation: Invitation, locale: Locale, options: SharlarOptions) {
  const locales = invitation.enabledLocales;
  const details=sharlarDataSchema.parse(invitation.templateData["taklifla-sharlar"] ?? {});
  const views = Object.fromEntries(locales.map((language) => {
    const content = getContent(invitation, language);
    const localized=(value:Partial<Record<Locale,string>>)=>value[language] ?? value[invitation.defaultLocale] ?? "";
    return [language, {
      content: {
        ...content,
        greeting: options.guestName && content.personalGreeting
          ? content.personalGreeting.replaceAll("{name}", options.guestName)
          : content.greeting,
      },
      previewWishes:options.preview&&options.sampleWishes?getTemplatePreviewWishes(language):[],
      wallDate:eventWallDate(invitation.startsAt,invitation.timezone)?.toISOString().slice(0,10) ?? "",
      mapUrl:yandexMapUrl(invitation.venue) || (invitation.venue.latitude!==null&&invitation.venue.longitude!==null?`https://yandex.uz/maps/?text=${invitation.venue.latitude},${invitation.venue.longitude}`:content.address||content.venueName?`https://yandex.uz/maps/?text=${encodeURIComponent(content.address||content.venueName)}`:""),
      date: formatDate(invitation.startsAt, language, invitation.timezone, { day: "numeric", month: "long", year: "numeric" }),
      numericDate: formatDate(invitation.startsAt, language, invitation.timezone, { day: "2-digit", month: "2-digit", year: "numeric" }),
      time: formatDate(invitation.startsAt, language, invitation.timezone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      program: invitation.program.map(item => ({
        id: item.id, time: item.time,
        title: content.programTitles[item.id] ?? "",
        description: content.programDescriptions[item.id] ?? "",
      })),
      dressCode: invitation.dressCode.enabled ? [
        localized(invitation.dressCode.style), localized(invitation.dressCode.text), localized(invitation.dressCode.note), ...invitation.dressCode.colors.map(c=>localized(c.name)||c.hex),
      ].filter(Boolean).join("\n") : "",
    }];
  }));
  return {
    type: "taklifla-sharlar:update" as const,
    payload: {
      ...options, locale:invitation.enabledLocales.includes(locale)?locale:invitation.defaultLocale, views, doorsAt:details.doorsAt,celebrantAge:invitation.celebrantAge,apiBase:`/api/public/invitations/${encodeURIComponent(options.invitationId)}`,enabledLocales: invitation.enabledLocales,
      preview: options.preview ?? false,
      instant: eventInstant(invitation.startsAt, invitation.timezone)?.toISOString() ?? "",
      mapUrl: yandexMapUrl(invitation.venue) || (
        invitation.venue.latitude !== null && invitation.venue.longitude !== null
          ? `https://yandex.uz/maps/?text=${invitation.venue.latitude},${invitation.venue.longitude}` : ""
      ),
      music: { enabled: invitation.music.enabled, url: publicAsset(invitation.music.url) },
      phone: invitation.contacts.phoneNumber,
      wishesEnabled: invitation.wishes.enabled,
    },
  };
}
