import {
  getContent,
  type Invitation,
  type Locale,
} from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";
import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";

export type TungiSaroyOptions = {
  invitationId: string;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  sampleWishes?: boolean;
  silentPlayback?: boolean;
  reducedMotion?: boolean;
};

/** Pure projection: no demo defaults, persistence, mutation, or source-absent UI. */
export function makeTungiSaroyPayload(
  invitation: Invitation,
  locale: Locale,
  options: TungiSaroyOptions,
) {
  const variants = Object.fromEntries(
    invitation.enabledLocales.map((language) => {
      const content = getContent(invitation, language);
      const greeting =
        options.guestName && content.personalGreeting
          ? content.personalGreeting.replaceAll("{name}", options.guestName)
          : content.greeting;
      const wall = eventWallDate(invitation.startsAt, invitation.timezone);
      const numericDate = wall
        ? `${String(wall.getUTCDate()).padStart(2, "0")} · ${String(wall.getUTCMonth() + 1).padStart(2, "0")} · ${wall.getUTCFullYear()}`
        : "";
      return [
        language,
        {
          people: content.people,
          hosts: content.hosts,
          greeting,
          message: content.message,
          eventLabel: content.eventLabel,
          venueName: content.venueName,
          address: content.address,
          landmark: content.landmark,
          programHeading: content.programHeading,
          wishes:
            options.preview && options.sampleWishes
              ? getTemplatePreviewWishes(language).map(({ name, text }) => ({
                  name,
                  message: text,
                }))
              : [],
          numericDate,
          dateLabel: formatDate(
            invitation.startsAt,
            language,
            invitation.timezone,
            {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            },
          ),
          timeLabel: formatDate(
            invitation.startsAt,
            language,
            invitation.timezone,
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            },
          ),
          deadlineLabel: formatDate(
            invitation.rsvp.deadline,
            language,
            invitation.timezone,
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            },
          ),
          program: invitation.program.map((item) => ({
            id: item.id,
            time: item.time,
            title: content.programTitles[item.id] ?? "",
            description: content.programDescriptions[item.id] ?? "",
          })),
          dressText: invitation.dressCode.enabled
            ? [
                invitation.dressCode.style[language],
                invitation.dressCode.text[language],
                invitation.dressCode.note[language],
                invitation.dressCode.colors
                  .map((color) => color.name[language])
                  .filter(Boolean)
                  .join(", "),
              ]
                .filter(Boolean)
                .join("\n")
            : "",
        },
      ];
    }),
  );
  const mapUrl =
    invitation.venue.mapUrl ||
    (invitation.venue.latitude !== null && invitation.venue.longitude !== null
      ? `https://www.google.com/maps/search/?api=1&query=${invitation.venue.latitude},${invitation.venue.longitude}`
      : "");
  return {
    type: "taklifla-tungi-saroy:update" as const,
    payload: {
      invitationId: options.invitationId,
      guestName: options.guestName ?? "",
      guestToken: options.guestToken ?? "",
      preview: options.preview ?? false,
      silentPlayback: (options.preview && options.silentPlayback) || false,
      reducedMotion: (options.preview && options.reducedMotion) || false,
      locale: invitation.enabledLocales.includes(locale)
        ? locale
        : invitation.defaultLocale,
      enabledLocales: invitation.enabledLocales,
      variants,
      instant:
        eventInstant(invitation.startsAt, invitation.timezone)?.toISOString() ??
        "",
      mapUrl,
      phone: invitation.contacts.phoneNumber,
      rsvpEnabled: invitation.rsvp.enabled,
      wishesEnabled: invitation.wishes.enabled,
      music: { enabled: invitation.music.enabled, url: invitation.music.url },
    },
  };
}
