import { getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { formatDate } from "../date-format";

export type UchrashuvOptions = {
  invitationId: string;
  guestToken?: string;
  preview?: boolean;
  silentPlayback?: boolean;
  reducedMotion?: boolean;
};

/** Pure projection: no sample imports, storage writes, or source-absent sections. */
export function makeUchrashuvPayload(invitation: Invitation, locale: Locale, guestName = "", options: UchrashuvOptions) {
  locale=invitation.enabledLocales.includes(locale)?locale:invitation.defaultLocale;
  const variants = Object.fromEntries(invitation.enabledLocales.map(language => {
    const c = getContent(invitation, language);
    const date = (format: Intl.DateTimeFormatOptions) => formatDate(invitation.startsAt, language, invitation.timezone, format);
    return [language, {
      title: c.title,
      sender: c.people[0] || "",
      recipient: guestName || c.people[1] || "",
      greeting: guestName && c.personalGreeting ? c.personalGreeting.replaceAll("{name}", guestName) : c.greeting,
      message: c.message,
      eventLabel: c.eventLabel,
      date: date({ day: "numeric", month: "long" }),
      weekday: date({ weekday: "long" }),
      time: date({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      venue: { name: c.venueName, address: [c.address, c.landmark].filter(Boolean).join(" · "), mapUrl: invitation.venue.mapUrl || (invitation.venue.latitude != null && invitation.venue.longitude != null ? `https://www.google.com/maps/search/?api=1&query=${invitation.venue.latitude},${invitation.venue.longitude}` : c.address||c.venueName?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address||c.venueName)}`:"") },
    }];
  }));
  return { type: "taklifla-uchrashuv:update", payload: {
    locale, variants, enabledLocales: invitation.enabledLocales,
    invitationId: options.invitationId, guestToken: options.guestToken || "",
    preview: !!options.preview, rsvpEnabled: invitation.rsvp.enabled,
    rsvpDeadline: invitation.rsvp.deadline, timezone: invitation.timezone,
    music: { enabled: invitation.music.enabled, url: invitation.music.url },
    silentPlayback: !!options.preview && !!options.silentPlayback,
    reducedMotion: !!options.preview && !!options.reducedMotion,
  } };
}
