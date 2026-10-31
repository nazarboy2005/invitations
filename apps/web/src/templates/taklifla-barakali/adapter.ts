import { publicAsset } from "../../lib/public-asset";
import { defaultEventLabel, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";
import { getTemplatePreviewWishes } from "@/modules/catalog/preview-sample";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { copy } from "./copy";

export type BarakaliOptions = {
  invitationId: string; guestName?: string; guestToken?: string;
  preview?: boolean; sampleWishes?: boolean; catalogMusic?: boolean;
  silentPlayback?: boolean; qaReducedMotion?: boolean;
};

/** Narrow read-only mapping; neither source demos nor preview fixtures enter drafts. */
export function makeBarakaliPayload(invitation: Invitation, locale: Locale, options: BarakaliOptions) {
  const variants = Object.fromEntries(invitation.enabledLocales.map((language) => {
    const c = getContent(invitation, language);
    const names = c.people.filter(Boolean).join(" · ");
    const guest = options.guestName || "";
    const photo = invitation.gallery.find((item) => item.url);
    const date = formatDate(invitation.startsAt, language, invitation.timezone, { day: "numeric", month: "long", year: "numeric" });
    const weekday = formatDate(invitation.startsAt, language, invitation.timezone, { weekday: "long" });
    const time = formatDate(invitation.startsAt, language, invitation.timezone, { hour: "2-digit", minute: "2-digit" });
    return [language, {
      ui: copy[language], title: c.title, names,
      monogram: c.people.filter(Boolean).map((name) => Array.from(name.trim())[0]).join(" · "),
      year: eventWallDate(invitation.startsAt, invitation.timezone)?.getUTCFullYear() || "",
      eventLabel: c.eventLabel || defaultEventLabel(invitation.eventType, language),
      greeting: (guest && c.personalGreeting ? c.personalGreeting.replaceAll("{name}", guest) : c.greeting),
      message: c.message, hosts: c.hosts,
      date, weekday, time, target: eventInstant(invitation.startsAt, invitation.timezone)?.getTime() ?? null,
      venue: { name: c.venueName, address: c.address, landmark: c.landmark, ...invitation.venue },
      photo: photo ? { ...photo } : null,
      wishes: options.preview && options.sampleWishes ? getTemplatePreviewWishes(language).map((wish) => ({ name: wish.name, message: wish.text })) : [],
    }];
  }));
  return { type: "taklifla-barakali:update" as const, payload: {
    locale, variants, enabledLocales: [...invitation.enabledLocales], invitationId: options.invitationId,
    guestName: options.guestName || "", guestToken: options.guestToken || "",
    phone: invitation.contacts.phoneNumber,
    preview: Boolean(options.preview), wishesEnabled: invitation.wishes.enabled,
    music: options.preview && options.catalogMusic ? { enabled: true, url: CATALOG_PREVIEW_MUSIC.url } : { enabled: invitation.music.enabled, url: publicAsset(invitation.music.url) },
    silentPlayback: Boolean(options.preview && options.silentPlayback), reducedMotion: Boolean(options.preview && options.qaReducedMotion),
  } };
}
