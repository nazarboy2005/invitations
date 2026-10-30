import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import { terracottaDataSchema, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";
import { eventInstant, eventWallDate, formatDate } from "../date-format";

export type TerracottaOptions = {
  invitationId: string;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  sampleWishes?: boolean;
  silentPlayback?: boolean;
  reducedMotion?: boolean;
};

/** Presentation only: never creates, mutates, saves, or fills an invitation. */
export function makeTerracottaPayload(invitation: Invitation, locale: Locale, options: TerracottaOptions) {
  locale=invitation.enabledLocales.includes(locale)?locale:invitation.defaultLocale;
  const details=terracottaDataSchema.parse(invitation.templateData["taklifla-terracotta"] ?? {});
  const localized=(v:Partial<Record<Locale,string>>)=>v[locale] ?? v[invitation.defaultLocale] ?? "";
  const wall=eventWallDate(invitation.startsAt,invitation.timezone);
  const content = getContent(invitation, locale);
  const guestName = options.guestName ?? "";
  const enabledLocales = invitation.enabledLocales.filter((item) => invitation.content[item]);
  return {
    type: "taklifla-terracotta:update" as const,
    payload: {
      locale, enabledLocales,infoNote:localized(details.infoNote),footerNote:details.footerNote[locale] ?? details.footerNote[invitation.defaultLocale] ?? null,
      invitationId: options.invitationId,apiBase:`/api/public/invitations/${encodeURIComponent(options.invitationId)}`,
      guestToken: options.guestToken ?? "",
      guestName,
      preview: options.preview ?? false,
      silentPlayback: options.preview && options.silentPlayback || false,
      reducedMotion: options.preview && options.reducedMotion || false,
      content: { ...content, greeting: guestName && content.personalGreeting
        ? content.personalGreeting.replaceAll("{name}", guestName) : content.greeting },
      date:wall?`${String(wall.getUTCDate()).padStart(2,"0")} · ${String(wall.getUTCMonth()+1).padStart(2,"0")} · ${wall.getUTCFullYear()}`:"",
      formalDate: formatDate(invitation.startsAt, locale, invitation.timezone, { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      instant: eventInstant(invitation.startsAt, invitation.timezone)?.toISOString() ?? "",
      mapUrl: yandexMapUrl(invitation.venue) || (invitation.venue.latitude !== null && invitation.venue.longitude !== null
        ? `https://yandex.uz/maps/?text=${invitation.venue.latitude},${invitation.venue.longitude}` : content.address||content.venueName?`https://yandex.uz/maps/?text=${encodeURIComponent(content.address||content.venueName)}`:""),
      program: invitation.program.map((item) => ({ ...item,
        title: content.programTitles[item.id] ?? "",
        description: content.programDescriptions[item.id] ?? "",
      })),
      music: invitation.music,
      wishesEnabled: invitation.wishes.enabled,
      sampleWishes: options.preview && options.sampleWishes ? getTemplatePreviewWishes(locale) : [],
    },
  };
}
