import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import {
  getContent,
  type Invitation,
  type Locale,
} from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";

import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";

export const FASLLAR_ID = "taklifla-tort-fasl";
export const FASLLAR_NAME = "To‘rt fasl";

/** Maps source-visible fields from the shared invitation contract. */
export function makeFasllarPayload(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  options: {
    invitationId: string;
    guestToken?: string;
    preview?: boolean;
    sampleWishes?: boolean;
    silentPlayback?: boolean;
    reducedMotion?: boolean;
  },
) {
  const wall = eventWallDate(invitation.startsAt, invitation.timezone);
  const variants = Object.fromEntries(
    invitation.enabledLocales.map((language) => {
      const content = getContent(invitation, language);
      const dress = invitation.dressCode;
      return [
        language,
        {
          title: content.title,
          sampleWishes: options.preview && options.sampleWishes ? getTemplatePreviewWishes(language).map(w => ({name:w.name,message:w.text})) : [],
          people: content.people.filter((name) => name.trim()),
          greeting:
            guestName && content.personalGreeting
              ? content.personalGreeting.replaceAll("{name}", guestName)
              : content.greeting,
          message: content.message,
          eventLabel: content.eventLabel,
          venueName: content.venueName,
          address: [content.address, content.landmark]
            .filter(Boolean)
            .join(" · "),
          dateLong: wall
            ? formatDate(invitation.startsAt, language, invitation.timezone, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "",
          time: wall
            ? formatDate(invitation.startsAt, language, invitation.timezone, {
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h23",
              })
            : "",
          deadline: invitation.rsvp.deadline
            ? formatDate(
                invitation.rsvp.deadline,
                language,
                invitation.timezone,
                { day: "numeric", month: "long", year: "numeric" },
              )
            : "",
          programHeading: content.programHeading,
          program: invitation.program.map((row) => ({
            ...row,
            title: content.programTitles[row.id] || "",
            description: content.programDescriptions[row.id] || "",
          })),
          dressText: dress.enabled
            ? [
                dress.style[language],
                dress.text[language],
                dress.note[language],
              ]
                .filter(Boolean)
                .join("\n")
            : "",
          colors: dress.enabled
            ? dress.colors.map((color) => ({
                id: color.id,
                hex: color.hex,
                name: color.name[language] || "",
              }))
            : [],
        },
      ];
    }),
  );
  const lat = invitation.venue.latitude,
    lng = invitation.venue.longitude;
  const mapUrl =
    yandexMapUrl(invitation.venue) ||
    (lat !== null && lng !== null
      ? `https://yandex.uz/maps/?text=${lat},${lng}`
      : "");
  return {
    type: `${FASLLAR_ID}:update` as const,
    payload: {
      locale,
      enabledLocales: invitation.enabledLocales,
      variants,
      invitationId: options.invitationId,
      guestToken: options.guestToken || "",
      guestName,
      preview: Boolean(options.preview),
      silentPlayback: Boolean(options.silentPlayback),
      reducedMotion: Boolean(options.reducedMotion),
      instant:
        eventInstant(invitation.startsAt, invitation.timezone)?.getTime() ??
        null,
      dateNumeric: wall
        ? `${String(wall.getUTCDate()).padStart(2, "0")} · ${String(wall.getUTCMonth() + 1).padStart(2, "0")} · ${wall.getUTCFullYear()}`
        : "",
      mapUrl,
      phone: invitation.contacts.phoneNumber,
      replyEnabled: invitation.rsvp.enabled,
      wishesEnabled: invitation.wishes.enabled,
      music: { enabled: invitation.music.enabled, url: invitation.music.url },
    },
  };
}

export type FasllarMessage = ReturnType<typeof makeFasllarPayload>;
