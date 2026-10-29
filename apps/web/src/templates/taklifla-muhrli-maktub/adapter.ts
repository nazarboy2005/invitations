import { defaultEventLabel, getContent, muhrliMaktubDataSchema, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";
import { CATALOG_PREVIEW_MUSIC } from "../../modules/catalog/catalog-music";

import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";

export type EnvelopeOptions = {
  invitationId: string;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  silentPlayback?: boolean;
  catalogMusic?: boolean;
  sampleWishes?: boolean;
  fullPreview?: boolean;
};

/** Data projection only: never creates samples or mutates/persists invitation data. */
export function makeEnvelopePayload(invitation: Invitation, locale: Locale, options: EnvelopeOptions) {
  const templateData = muhrliMaktubDataSchema.parse(invitation.templateData["taklifla-muhrli-maktub"] ?? {});
  const variants = Object.fromEntries(invitation.enabledLocales.map((language) => {
    const c = getContent(invitation, language);
    const wall = eventWallDate(invitation.startsAt, invitation.timezone);
    const year = wall?.getUTCFullYear(), day = wall?.getUTCDate();
    const month = formatDate(invitation.startsAt, language, invitation.timezone, { month: "long" });
    const date = wall ? language === "uz-Latn" ? `${year}-yil ${day}-${month}`
      : language === "uz-Cyrl" ? `${year}-йил ${day}-${month}`
      : formatDate(invitation.startsAt, language, invitation.timezone, { year: "numeric", month: "long", day: "numeric" }) : "";
    const time = formatDate(invitation.startsAt, language, invitation.timezone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    const people = c.people.filter((name) => name.trim());
    const query = invitation.venue.latitude !== null && invitation.venue.longitude !== null
      ? `${invitation.venue.latitude},${invitation.venue.longitude}` : c.address || c.venueName;
    const telegram = invitation.contacts.telegramUsername.trim().replace(/^@/, "");
    return [language, {
      title: c.title, people,
      monogram: people.slice(0, 2).map(name => Array.from(name.trim())[0]?.toLocaleUpperCase()).join(" & "),
      greeting: (options.guestName ? c.personalGreeting.replaceAll("{name}", options.guestName) : "") || c.greeting,
      message: c.message, eventLabel: c.eventLabel || defaultEventLabel(invitation.eventType, language),
      date, dateTime: [date, time].filter(Boolean).join(" · "),
      footerDate: wall ? `${String(day).padStart(2,"0")} · ${String(wall.getUTCMonth()+1).padStart(2,"0")} · ${year}` : "",
      venueName: c.venueName, address: [c.address,c.landmark].filter(Boolean).join("\n"),
      mapGoogle: invitation.venue.mapUrl || (query ? `https://maps.google.com/?q=${encodeURIComponent(query)}` : ""),
      mapYandex: invitation.venue.mapUrl || (query ? `https://maps.google.com/?q=${encodeURIComponent(query)}` : ""),
      sampleWishes: options.preview && options.sampleWishes ? getTemplatePreviewWishes(language).map(wish => ({ name: wish.name, message: wish.text })) : [],
      telegram: telegram ? (/^https:\/\/t\.me\//i.test(telegram) ? telegram : `https://t.me/${encodeURIComponent(telegram)}`) : "",
      programHeading: c.programHeading,
      program: invitation.program.map(item => ({...item,title:c.programTitles[item.id] || "",description:c.programDescriptions[item.id] || ""})),
      dress: {
        enabled: invitation.dressCode.enabled,
        text: [invitation.dressCode.style[language],invitation.dressCode.text[language],invitation.dressCode.note[language]].filter(Boolean).join("\n"),
        colors: invitation.dressCode.colors.map(color => ({id:color.id,hex:color.hex,name:color.name[language] || ""})),
      },
      flowersNote: templateData.flowersNote?.[language] ?? templateData.flowersNote?.[invitation.defaultLocale] ?? null,
    }];
  }));
  return {
    type: "taklifla-envelope:update" as const,
    payload: {
      variants, locale: invitation.enabledLocales.includes(locale) ? locale : invitation.defaultLocale,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId, guestToken: options.guestToken || "", guestName: options.guestName || "",
      preview: !!options.preview, silentPlayback: !!options.preview && !!options.silentPlayback,
      previewAutoplay: !!options.preview && !!options.fullPreview,
      target: eventInstant(invitation.startsAt, invitation.timezone)?.getTime() ?? null,
      phone: invitation.rsvp.enabled ? invitation.contacts.phoneNumber : "",
      wishesEnabled: invitation.wishes.enabled,
      music: options.preview && options.catalogMusic
        ? { enabled: true, url: CATALOG_PREVIEW_MUSIC.url }
        : { enabled: invitation.music.enabled, url: invitation.music.url },
    },
  };
}

export type EnvelopeMessage = ReturnType<typeof makeEnvelopePayload>;
