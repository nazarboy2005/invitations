import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import { zarrinDataSchema, getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";
import { getTemplatePreviewWishes } from "../../modules/catalog/preview-sample";

export const TEMPLATE_ID = "taklifla-zarrin-gullar";
export const TEMPLATE_NAME = "Zarrin gullar";

export function makeZarrinPayload(
  invitation: Invitation,
  locale: Locale,
  options: { invitationId: string; guestName?: string; guestToken?: string; preview?: boolean; reducedMotion?: boolean; silentPlayback?: boolean; sampleWishes?: boolean },
) {
  const details=zarrinDataSchema.parse(invitation.templateData[TEMPLATE_ID] ?? {});
  const variants = Object.fromEntries(invitation.enabledLocales.map((language) => {
    const c = getContent(invitation, language);
    const date = (o: Intl.DateTimeFormatOptions) => formatDate(invitation.startsAt, language, invitation.timezone, o);
    const wall = eventWallDate(invitation.startsAt, invitation.timezone);
    const segments=c.address.split(",").map(s=>s.trim()).filter(Boolean);
    const marked=segments[0]?.match(/^(.+?)\s+(?:sh\.?|shahri|шаҳри|ш\.)$/i) || segments[0]?.match(/^(?:г|g)\.\s*(.+)$/i);
    const tail=segments.at(-1)||"";
    const city=marked?.[1]?.trim() || (/(tuman|ko'?cha|kuchasi|mavze|mahalla|MFY|uy\b|ул\.|улиц|дом|туман|кўча|street|district|avenue)/i.test(tail)?"":tail);
    const numeric = wall ? `${String(wall.getUTCDate()).padStart(2,"0")} · ${String(wall.getUTCMonth()+1).padStart(2,"0")} · ${wall.getUTCFullYear()}` : "";
    const localized = (record: Partial<Record<Locale, string>>) => record[language] ?? record[invitation.defaultLocale] ?? "";
    return [language, {
      brideFamily:localized(details.brideFamily),groomFamily:localized(details.groomFamily),stayText:localized(details.stayText),footerNote:details.footerNote[language] ?? null,hashtag:details.hashtag,
      people: c.people.filter(name=>name.trim()).slice(0, 2), hosts: c.hosts,
      greeting: options.guestName && c.personalGreeting ? c.personalGreeting.replaceAll("{name}", options.guestName) : c.greeting,
      message: c.message, eventLabel: c.eventLabel, programHeading: c.programHeading,
      date: { long: date({day:"numeric",month:"long",year:"numeric"}), numeric, weekday: date({weekday:"short"}).toLocaleUpperCase(), time: date({hour:"2-digit",minute:"2-digit",hour12:false}) },
      venue: { name:c.venueName, address:c.address, landmark:c.landmark, city,
        mapUrl: yandexMapUrl(invitation.venue) || (invitation.venue.latitude !== null && invitation.venue.longitude !== null
          ? `https://yandex.uz/maps/?text=${invitation.venue.latitude},${invitation.venue.longitude}`
          : c.address || c.venueName ? `https://yandex.uz/maps/?text=${encodeURIComponent(c.address || c.venueName)}` : "") },
      program: invitation.program.map((p) => ({id:p.id,time:p.time,title:c.programTitles[p.id] || "",description:c.programDescriptions[p.id] || ""})),
      dress: invitation.dressCode.enabled ? [localized(invitation.dressCode.style),localized(invitation.dressCode.text),localized(invitation.dressCode.note),...invitation.dressCode.colors.map((color)=>localized(color.name) || color.hex)].filter(Boolean).join("\n") : "",
      deadline: invitation.rsvp.enabled && invitation.rsvp.deadline ? formatDate(invitation.rsvp.deadline,language,invitation.timezone,{day:"numeric",month:"long"}) : "",
      phone: invitation.rsvp.enabled ? invitation.contacts.phoneNumber : "",
      previewWishes: options.preview && options.sampleWishes ? getTemplatePreviewWishes(language) : [],
    }];
  }));
  const selected = invitation.enabledLocales.includes(locale) ? locale : invitation.defaultLocale;
  return {type:"taklifla-zarrin-gullar:update" as const, payload:{
    variants, locale:selected, enabledLocales:invitation.enabledLocales,
    invitationId:options.invitationId, guestToken:options.guestToken || "",
    preview:options.preview === true, reducedMotion:options.reducedMotion === true,
    silentPlayback:options.preview === true && options.silentPlayback === true,
    epoch:eventInstant(invitation.startsAt,invitation.timezone)?.getTime() ?? null,
    music:invitation.music.enabled ? invitation.music.url : "",
    wishesEnabled:invitation.wishes.enabled,
  }};
}
