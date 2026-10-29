import type { Invitation, Locale } from "@taklifnoma/contracts";
import { sakuraDataSchema,getContent } from "@taklifnoma/contracts";
import {getTemplatePreviewWishes} from "../../modules/catalog/preview-sample";
import { eventInstant, formatDate } from "@/templates/date-format";

/** Metadata; the shared registry and configured catalog control availability. */
export const sakuraGuli = {
  id: "taklifla-sakura-guli", name: "Sakura Guli", published: true,
  selectable: true, supportedEventTypes: ["wedding"],
} as const;

export function makeSakuraPayload(invitation: Invitation, locale: Locale, options: {
  invitationId: string; guestName?: string; guestToken?: string;
  preview?: boolean; silentPlayback?: boolean; reducedMotion?: boolean;sampleWishes?:boolean;
}) {
  locale=invitation.enabledLocales.includes(locale)?locale:invitation.defaultLocale;
  const c = getContent(invitation, locale),details=sakuraDataSchema.parse(invitation.templateData["taklifla-sakura-guli"] ?? {});
  const localized=(v:Partial<Record<Locale,string>>)=>v[locale] ?? v[invitation.defaultLocale] ?? "";
  const segs=c.address.split(",").map(s=>s.trim()).filter(Boolean),marked=segs[0]?.match(/^(.+?)\s+(?:sh\.?|shahri|шаҳри|ш\.)$/i)||segs[0]?.match(/^(?:г|g)\.\s*(.+)$/i),tail=segs.at(-1)||"",city=marked?.[1]?.trim()||(/(tuman|ko.?cha|kuchasi|mahalla|улиц|street|district|avenue)/i.test(tail)?"":tail);
  return {
    contactNote:localized(details.contactNote),infoNote:localized(details.infoNote),footerNote:details.footerNote[locale] ?? details.footerNote[invitation.defaultLocale] ?? null,
    previewWishes:options.preview&&options.sampleWishes?getTemplatePreviewWishes(locale):[],city,
    locale, enabledLocales: invitation.enabledLocales,
    names: c.people.filter(n=>n.trim()), hosts: c.hosts,
    greeting: options.guestName ? c.personalGreeting.replaceAll("{name}", options.guestName) || c.greeting : c.greeting,
    message: c.message, eventLabel: c.eventLabel,
    dateLong: formatDate(invitation.startsAt, locale, invitation.timezone, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    dateShort: formatDate(invitation.startsAt, locale, invitation.timezone, { day: "2-digit", month: "2-digit", year: "numeric" }),
    time: formatDate(invitation.startsAt, locale, invitation.timezone, { hour: "2-digit", minute: "2-digit" }),
    target: eventInstant(invitation.startsAt, invitation.timezone)?.getTime() ?? null,
    venueName: c.venueName, address: c.address, landmark: c.landmark,
    mapUrl: invitation.venue.mapUrl || (invitation.venue.latitude !== null && invitation.venue.longitude !== null
      ? `https://www.google.com/maps/search/?api=1&query=${invitation.venue.latitude},${invitation.venue.longitude}`
      : c.address || c.venueName ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address || c.venueName)}` : ""),
    programHeading: c.programHeading,
    program: invitation.program.map(item => ({ id: item.id, time: item.time, title: c.programTitles[item.id] ?? "", description: c.programDescriptions[item.id] ?? "" })),
    dressText: invitation.dressCode.enabled ? [localized(invitation.dressCode.style), localized(invitation.dressCode.text), localized(invitation.dressCode.note), ...invitation.dressCode.colors.map(color => localized(color.name)||color.hex)].filter(Boolean).join("\n") : "",
    contacts: { phone: invitation.contacts.phoneNumber, telegram: invitation.contacts.telegramUsername, instagram: invitation.contacts.instagramUrl },
    musicUrl: invitation.music.enabled ? invitation.music.url : "",
    wishesEnabled: invitation.wishes.enabled,
    apiBase: `/api/public/invitations/${encodeURIComponent(options.invitationId)}`,
    guestName: options.guestName ?? "", guestToken: options.guestToken ?? "",
    preview: !!options.preview,
    silentPlayback: !!options.preview && !!options.silentPlayback,
    reducedMotion: !!options.preview && !!options.reducedMotion,
  };
}
