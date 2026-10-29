import {getTemplatePreviewWishes} from "../../modules/catalog/preview-sample";
import { starryDataSchema, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";

/** Pure projection. Never creates a fixture, persists values or changes the invitation. */
export function makeStarryPayload(
  invitation: Invitation,
  locale: Locale,
  options: {
    invitationId: string;
    guestName?: string;
    guestToken?: string;
    preview?: boolean;
    sampleWishes?: boolean;
    silentPlayback?: boolean;
    reducedMotion?: boolean;
    catalogMusicUrl?: string;
  },
) {
  const details=starryDataSchema.parse(invitation.templateData["taklifla-yulduzli-tun"] ?? {});
  const variants = Object.fromEntries(invitation.enabledLocales.map(language => {
    const content = getContent(invitation, language);
    const localized=(v:Partial<Record<Locale,string>>)=>v[language] ?? v[invitation.defaultLocale] ?? "";
    const wall = eventWallDate(invitation.startsAt, invitation.timezone);
    const date = (format: Intl.DateTimeFormatOptions) => formatDate(invitation.startsAt, language, invitation.timezone, format);
    const greeting = options.guestName && content.personalGreeting
      ? content.personalGreeting.replaceAll("{name}", options.guestName)
      : content.greeting;
    return [language, {
      infoNote:localized(details.infoNote),footerNote:details.footerNote[language] ?? details.footerNote[invitation.defaultLocale] ?? null,
      wishes:options.preview&&options.sampleWishes?getTemplatePreviewWishes(language):[],
      mapUrl:invitation.venue.mapUrl || (invitation.venue.latitude!==null&&invitation.venue.longitude!==null?`https://www.google.com/maps/search/?api=1&query=${invitation.venue.latitude},${invitation.venue.longitude}`:content.address||content.venueName?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.address||content.venueName)}`:""),
      people: content.people.filter(person => person.trim()),
      title: content.title, hosts: content.hosts, message: content.message, greeting,
      eventLabel: content.eventLabel, programHeading: content.programHeading,
      program: invitation.program.map(item => ({ ...item, title: content.programTitles[item.id] ?? "", description: content.programDescriptions[item.id] ?? "" })),
      venueName: content.venueName,
      address: [content.address, content.landmark].filter(Boolean).join(" · "),
      dottedDate: wall ? `${String(wall.getUTCDate()).padStart(2, "0")} · ${String(wall.getUTCMonth() + 1).padStart(2, "0")} · ${wall.getUTCFullYear()}` : "",
      day: wall ? String(wall.getUTCDate()) : "",
      year: wall ? String(wall.getUTCFullYear()) : "",
      weekday: date({ weekday: "long" }), month: date({ month: "long" }),
      longDate: date({ weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      shortDate: date({ day: "numeric", month: "long", year: "numeric" }),
      time: date({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
    }];
  }));
  return {
    type: "taklifla-yulduzli-tun:update" as const,
    payload: {
      variants, locale:invitation.enabledLocales.includes(locale)?locale:invitation.defaultLocale, enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId, guestName: options.guestName ?? "", guestToken: options.guestToken ?? "",
      preview: options.preview ?? false,
      silentPlayback: !!options.preview && !!options.silentPlayback,
      reducedMotion: !!options.preview && !!options.reducedMotion,
      instant: eventInstant(invitation.startsAt, invitation.timezone)?.toISOString() ?? "",
      mapUrl: invitation.venue.mapUrl || (invitation.venue.latitude !== null && invitation.venue.longitude !== null
        ? `https://www.google.com/maps/search/?api=1&query=${invitation.venue.latitude},${invitation.venue.longitude}`
        : ""),
      wishesEnabled: invitation.wishes.enabled,
      music: options.preview && options.catalogMusicUrl
        ? { enabled: true, url: options.catalogMusicUrl }
        : { enabled: invitation.music.enabled, url: invitation.music.url },
    },
  };
}
