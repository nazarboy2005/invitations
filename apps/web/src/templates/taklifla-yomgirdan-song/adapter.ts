import { defaultEventLabel, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";
import { getTemplatePreviewWishes } from "@/modules/catalog/preview-sample";

export type YomgirOptions = {
  invitationId: string;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  /** Only catalog/initial selection may request canonical sample wishes. */
  sampleWishes?: boolean;
  silentPlayback?: boolean;
  reducedMotion?: boolean;
};

/** Read-only, source-present projection. No personal samples or persistence. */
export function makeYomgirPayload(invitation: Invitation, locale: Locale, options: YomgirOptions) {
  const variants = Object.fromEntries(invitation.enabledLocales.map(language => {
    const c = getContent(invitation, language);
    const fmt = (format: Intl.DateTimeFormatOptions) => formatDate(invitation.startsAt, language, invitation.timezone, format);
    const wall = eventWallDate(invitation.startsAt, invitation.timezone);
    const date = wall && (language === "uz-Latn" || language === "uz-Cyrl")
      ? `${wall.getUTCDate()}-${fmt({month:"long"})} ${wall.getUTCFullYear()}`
      : fmt({day:"numeric",month:"long",year:"numeric"});
    const numericDate = wall ? `${String(wall.getUTCDate()).padStart(2,"0")} · ${String(wall.getUTCMonth()+1).padStart(2,"0")} · ${wall.getUTCFullYear()}` : "";
    const people = c.people.filter(name => name.trim());
    const query = invitation.venue.latitude !== null && invitation.venue.longitude !== null
      ? `${invitation.venue.latitude},${invitation.venue.longitude}` : c.address || c.venueName;
    const local = (value: Partial<Record<Locale,string>>) => value[language] || value[invitation.defaultLocale] || "";
    return [language, {
      title: c.title, names: people.join(" & "), monogram: people.slice(0,2).map(name => Array.from(name.trim())[0].toLocaleUpperCase()).join("·"),
      hosts: c.hosts,
      greeting: options.guestName && c.personalGreeting ? c.personalGreeting.replaceAll("{name}", options.guestName) : c.greeting,
      message: c.message, eventLabel: c.eventLabel || defaultEventLabel(invitation.eventType, language),
      date, numericDate, when: [fmt({weekday:"long"}), date, fmt({hour:"2-digit",minute:"2-digit",hourCycle:"h23"})].filter(Boolean).join(" · "),
      venueName: c.venueName, address: [c.address,c.landmark].filter(Boolean).join("\n"),
      mapUrl: invitation.venue.mapUrl || (query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : ""),
      programHeading: c.programHeading,
      program: invitation.program.map(item => ({id:item.id,time:item.time,title:c.programTitles[item.id] || "",description:c.programDescriptions[item.id] || ""})),
      dress: invitation.dressCode.enabled ? [local(invitation.dressCode.style),local(invitation.dressCode.text),local(invitation.dressCode.note),...invitation.dressCode.colors.map(color => local(color.name))].filter(Boolean).join("\n") : "",
      wishes: options.preview && options.sampleWishes ? getTemplatePreviewWishes(language) : [],
    }];
  }));
  return { type: "taklifla-yomgir:update" as const, payload: {
    variants, locale: invitation.enabledLocales.includes(locale) ? locale : invitation.defaultLocale,
    enabledLocales: invitation.enabledLocales,
    invitationId: options.invitationId, guestToken: options.guestToken || "", guestName: options.guestName || "",
    preview: !!options.preview, wishesEnabled: invitation.wishes.enabled,
    phone: invitation.contacts.phoneNumber,
    target: eventInstant(invitation.startsAt, invitation.timezone)?.getTime() ?? null,
    music: {enabled:invitation.music.enabled,url:invitation.music.url},
    silentPlayback: !!options.preview && !!options.silentPlayback,
    reducedMotion: !!options.preview && !!options.reducedMotion,
  } };
}

export type YomgirMessage = ReturnType<typeof makeYomgirPayload>;
