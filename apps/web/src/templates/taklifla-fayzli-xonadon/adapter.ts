import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import { fayzliXonadonDataSchema, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, formatDate } from "../date-format";

export type XonadonOptions = {
  invitationId: string;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  silentPlayback?: boolean;
  reducedMotion?: boolean;
};

/** Receives authored data or the caller's canonical preview fixture; creates no samples. */
export function makeXonadonPayload(invitation: Invitation, locale: Locale, options: XonadonOptions) {
  const details=fayzliXonadonDataSchema.parse(invitation.templateData["taklifla-fayzli-xonadon"] ?? {});
  const content = getContent(invitation, locale);
  const guest = options.guestName ?? "";
  const localized = (values: Partial<Record<Locale, string>>) => values[locale] ?? "";
  return {
    type: "taklifla-fayzli-xonadon:update" as const,
    payload: {
      locale,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId,
      guestToken: options.guestToken ?? "",
      guestName: guest,
      preview: options.preview ?? false,
      silentPlayback: options.preview && options.silentPlayback,
      reducedMotion: options.preview && options.reducedMotion,
      menu: details.menu.map(item=>({id:item.id,label:localized(item.label),name:localized(item.name),description:localized(item.description)})),
      content: {
        hosts: content.hosts || content.people.filter(Boolean).join(" & "),
        greeting: guest && content.personalGreeting
          ? content.personalGreeting.replaceAll("{name}", guest) : content.greeting,
        message: content.message,
        eventLabel: content.eventLabel,
        venueName: content.venueName,
        address: content.address,
        landmark: content.landmark,
      },
      dateLabel: formatDate(invitation.startsAt, locale, invitation.timezone, {
        day: "2-digit", month: "2-digit", year: "numeric",
      }),
      timeLabel: formatDate(invitation.startsAt, locale, invitation.timezone, {
        hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      }),
      mapUrl: yandexMapUrl(invitation.venue) || (
        invitation.venue.latitude !== null && invitation.venue.longitude !== null
          ? `https://yandex.uz/maps/?text=${invitation.venue.latitude},${invitation.venue.longitude}`
          : content.address ? `https://yandex.uz/maps/?text=${encodeURIComponent(content.address)}` : ""
      ),
      rsvp: {
        enabled: invitation.rsvp.enabled,
        deadline: eventInstant(invitation.rsvp.deadline, invitation.timezone)?.toISOString() ?? "",
        deadlineLabel: formatDate(invitation.rsvp.deadline, locale, invitation.timezone, {
          day: "numeric", month: "long", year: "numeric",
        }),
      },
      music: { enabled: invitation.music.enabled, url: invitation.music.url },
      dressCode: {
        enabled: invitation.dressCode.enabled,
        style: localized(invitation.dressCode.style),
        text: localized(invitation.dressCode.text),
        note: localized(invitation.dressCode.note),
        colors: invitation.dressCode.colors.map((color) => ({
          id: color.id, hex: color.hex, name: localized(color.name),
        })),
      },
    },
  };
}
