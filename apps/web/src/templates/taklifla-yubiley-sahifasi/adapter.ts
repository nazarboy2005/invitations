import { yubileySahifasiDataSchema, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { formatDate } from "../date-format";

/** Explicit public allowlist; no fixture, owner identity, gallery or gift data. */
export function makeYubileySahifasiPayload(
  invitation: Invitation,
  locale: Locale,
  options: { invitationId: string; guestName?: string; guestToken?: string; preview?: boolean },
) {
  const details = yubileySahifasiDataSchema.parse(invitation.templateData["taklifla-yubiley-sahifasi"] ?? {});
  const content = getContent(invitation, locale);
  const localized = (values: Partial<Record<Locale, string>>) =>
    values[locale] ?? values[invitation.defaultLocale] ?? "";
  return {
    type: "taklifla-yubiley-sahifasi:update" as const,
    payload: {
      locale,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId,
      guestToken: options.guestToken ?? "",
      preview: options.preview ?? false,
      company: content.people.filter(Boolean).join(" · "),
      title: content.title,
      greeting: (options.guestName && content.personalGreeting
        ? content.personalGreeting.replaceAll("{name}", options.guestName)
        : content.greeting),
      guestName: options.guestName ?? "",
      eventLabel: content.eventLabel,
      message: content.message,
      hosts: content.hosts,
      years: details.years,
      founderRole: localized(details.founderRole),
      statistics: details.statistics.map(item=>({id:item.id,value:item.value,label:localized(item.label)})),
      mapUrl: invitation.venue.mapUrl || (invitation.venue.latitude !== null && invitation.venue.longitude !== null ? `https://www.google.com/maps/search/?api=1&query=${invitation.venue.latitude},${invitation.venue.longitude}` : (content.venueName || content.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([content.venueName,content.address].filter(Boolean).join(" "))}` : "")),
      date: formatDate(invitation.startsAt, locale, invitation.timezone, {
        day: "2-digit", month: "2-digit", year: "numeric",
      }),
      time: formatDate(invitation.startsAt, locale, invitation.timezone, {
        hour: "2-digit", minute: "2-digit", hour12: false,
      }),
      timezone: invitation.timezone,
      venueName: content.venueName,
      address: [content.address,content.landmark].filter(Boolean).join(" · "),
      programHeading: content.programHeading,
      program: invitation.program.map((item) => ({
        id: item.id,
        time: item.time,
        title: content.programTitles[item.id] ?? "",
        description: content.programDescriptions[item.id] ?? "",
      })),
      story: invitation.story.map((item) => ({
        id: item.id, year: details.storyYears[item.id] || "", title: localized(item.title), text: localized(item.text),
      })),
      rsvp: { enabled: invitation.rsvp.enabled, deadline: invitation.rsvp.deadline },
      music: { enabled: invitation.music.enabled, url: invitation.music.url },
    },
  };
}
