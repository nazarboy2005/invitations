import { publicAsset } from "../../lib/public-asset";
import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import {
  getContent,
  type Invitation,
  type Locale,
} from "@taklifnoma/contracts";
import { eventInstant, formatDate } from "../date-format";
import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";

export type TovusOptions = {
  invitationId: string;
  guestToken?: string;
  preview?: boolean;
  sampleWishes?: boolean;
  silentPlayback?: boolean;
  reducedMotion?: boolean;
};

/** Narrow, read-only binding: no sample content is inserted into invitations. */
export function makeTovusPayload(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  options: TovusOptions,
) {
  const variants = Object.fromEntries(
    invitation.enabledLocales.map((language) => {
      const c = getContent(invitation, language);
      const local = (value: Partial<Record<Locale, string>>) =>
        value[language] || value[invitation.defaultLocale] || "";
      const date = (format: Intl.DateTimeFormatOptions) =>
        formatDate(invitation.startsAt, language, invitation.timezone, format);
      return [
        language,
        {
          title: c.title,
          people: c.people,
          hosts: c.hosts,
          eventLabel: c.eventLabel,
          greeting:
            guestName && c.personalGreeting
              ? c.personalGreeting.replaceAll("{name}", guestName)
              : c.greeting,
          message: c.message,
          date: {
            numeric: date({
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
            long: date({ day: "numeric", month: "long", year: "numeric" }),
            time: date({
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h23",
            }),
          },
          target:
            eventInstant(invitation.startsAt, invitation.timezone)?.getTime() ??
            null,
          programHeading: c.programHeading,
          program: invitation.program.map((item) => ({
            id: item.id,
            time: item.time,
            title: c.programTitles[item.id] || "",
            description: c.programDescriptions[item.id] || "",
          })),
          venue: {
            name: c.venueName,
            address: c.address,
            landmark: c.landmark,
            mapUrl:
              yandexMapUrl(invitation.venue) ||
              (invitation.venue.latitude != null &&
              invitation.venue.longitude != null
                ? `https://yandex.uz/maps/?text=${invitation.venue.latitude},${invitation.venue.longitude}`
                : ""),
          },
          story: invitation.story.map((item) => ({
            id: item.id,
            title: local(item.title),
            text: local(item.text),
          })),
          dressCode: invitation.dressCode.enabled
            ? [
                local(invitation.dressCode.style),
                local(invitation.dressCode.text),
                local(invitation.dressCode.note),
                ...invitation.dressCode.colors.map((color) =>
                  local(color.name),
                ),
              ]
                .filter(Boolean)
                .join(" · ")
            : "",
          rsvpDeadline:
            invitation.rsvp.enabled && invitation.rsvp.deadline
              ? formatDate(
                  invitation.rsvp.deadline,
                  language,
                  invitation.timezone,
                  { day: "numeric", month: "long", year: "numeric" },
                )
              : "",
          wishes:
            options.preview && options.sampleWishes
              ? getTemplatePreviewWishes(language).map(({ name, text }) => ({
                  name,
                  message: text,
                }))
              : [],
        },
      ];
    }),
  );
  return {
    type: "taklifla-tovus:update" as const,
    payload: {
      locale: invitation.enabledLocales.includes(locale)
        ? locale
        : invitation.defaultLocale,
      variants,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId,
      guestToken: options.guestToken || "",
      preview: !!options.preview,
      wishesEnabled: invitation.wishes.enabled,
      music: { enabled: invitation.music.enabled, url: publicAsset(invitation.music.url) },
      silentPlayback: !!options.preview && !!options.silentPlayback,
      reducedMotion: !!options.preview && !!options.reducedMotion,
    },
  };
}
