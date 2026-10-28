import { getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, formatDate } from "../date-format";
import { getTemplatePreviewWishes } from "@/modules/catalog/preview-sample";

export type AsalariOptions = {
  invitationId: string;
  guestToken?: string;
  preview?: boolean;
  sampleWishes?: boolean;
  silentPlayback?: boolean;
  reducedMotion?: boolean;
};

/** Source-present fields only. Never inserts demo content or mutates an invitation. */
export function makeAsalariPayload(
  invitation: Invitation,
  locale: Locale,
  guestName = "",
  options: AsalariOptions,
) {
  const variants = Object.fromEntries(invitation.enabledLocales.map((language) => {
    const c = getContent(invitation, language);
    const local = (value: Partial<Record<Locale, string>>) => value[language] || value[invitation.defaultLocale] || "";
    const date = (format: Intl.DateTimeFormatOptions) => formatDate(invitation.startsAt, language, invitation.timezone, format);
    return [language, {
      title: c.title,
      child: c.people[0] || "",
      hosts: c.hosts,
      eventLabel: c.eventLabel,
      greeting: (guestName && c.personalGreeting ? c.personalGreeting.replaceAll("{name}", guestName) : c.greeting),
      message: c.message,
      date: { weekday: date({ weekday: "long" }), long: date({ day: "numeric", month: "long", year: "numeric" }), time: date({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) },
      target: eventInstant(invitation.startsAt, invitation.timezone)?.getTime() ?? null,
      programHeading: c.programHeading,
      program: invitation.program.map((item) => ({ id: item.id, time: item.time, title: c.programTitles[item.id] || "", description: c.programDescriptions[item.id] || "" })),
      venue: { name: c.venueName, address: [c.address, c.landmark].filter(Boolean).join(" · "), mapUrl: invitation.venue.mapUrl || (invitation.venue.latitude != null && invitation.venue.longitude != null ? `https://www.google.com/maps/search/?api=1&query=${invitation.venue.latitude},${invitation.venue.longitude}` : "") },
      dressCode: { enabled: invitation.dressCode.enabled, style: local(invitation.dressCode.style), text: local(invitation.dressCode.text), note: local(invitation.dressCode.note), colors: invitation.dressCode.colors.map((color) => local(color.name)).filter(Boolean) },
      wishes: options.preview && options.sampleWishes ? getTemplatePreviewWishes(language) : [],
    }];
  }));
  return { type: "taklifla-asalari:update", payload: {
    locale, variants, enabledLocales: invitation.enabledLocales,
    invitationId: options.invitationId, guestToken: options.guestToken || "",
    preview: !!options.preview, wishesEnabled: invitation.wishes.enabled,
    music: { enabled: invitation.music.enabled, url: invitation.music.url },
    silentPlayback: !!options.preview && !!options.silentPlayback,
    reducedMotion: !!options.preview && !!options.reducedMotion,
  } };
}
