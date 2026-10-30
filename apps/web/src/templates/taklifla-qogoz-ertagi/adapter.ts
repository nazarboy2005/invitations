import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import { qogozDataSchema,getContent,type Invitation,type Locale } from "@taklifnoma/contracts";
import {eventInstant,eventWallDate,formatDate} from "../date-format";
import {getTemplatePreviewWishes} from "../../modules/catalog/preview-sample";
export type QogozOptions={invitationId:string;guestName?:string;guestToken?:string;preview?:boolean;sampleWishes?:boolean;silentPlayback?:boolean;reducedMotion?:boolean};
/** Shared authored data; only explicit catalog previews receive canonical wishes. */
export function makeQogozPayload(invitation:Invitation,locale:Locale,options:QogozOptions){
 const details=qogozDataSchema.parse(invitation.templateData["taklifla-qogoz-ertagi"] ?? {});
 const variants=Object.fromEntries(invitation.enabledLocales.map(language=>{
  const content=getContent(invitation,language),wall=eventWallDate(invitation.startsAt,invitation.timezone);
  const localized=(v:Partial<Record<Locale,string>>)=>v[language] ?? v[invitation.defaultLocale] ?? "";
  return [language,{
   content:{...content,greeting:options.guestName&&content.personalGreeting?content.personalGreeting.replaceAll("{name}",options.guestName):content.greeting},
   contactNote:localized(details.contactNote),footerNote:details.footerNote[language] ?? details.footerNote[invitation.defaultLocale] ?? null,
   wallDate:wall?.toISOString().slice(0,10) ?? "",
   dateLabel:formatDate(invitation.startsAt,language,invitation.timezone,{weekday:"long",day:"numeric",month:"long",year:"numeric"}),
   timeLabel:formatDate(invitation.startsAt,language,invitation.timezone,{hour:"2-digit",minute:"2-digit",hourCycle:"h23"}),
   mapUrl:yandexMapUrl(invitation.venue) || (invitation.venue.latitude!==null&&invitation.venue.longitude!==null?`https://yandex.uz/maps/?text=${invitation.venue.latitude},${invitation.venue.longitude}`:content.address||content.venueName?`https://yandex.uz/maps/?text=${encodeURIComponent(content.address||content.venueName)}`:""),
   program:invitation.program.map(p=>({...p,title:content.programTitles[p.id] ?? "",description:content.programDescriptions[p.id] ?? ""})),
   dressText:invitation.dressCode.enabled?[localized(invitation.dressCode.style),localized(invitation.dressCode.text),localized(invitation.dressCode.note),...invitation.dressCode.colors.map(c=>localized(c.name)||c.hex)].filter(Boolean).join("\n"):"",
   wishes:options.preview&&options.sampleWishes?getTemplatePreviewWishes(language):[]
  }];
 }));
 return {type:"taklifla-qogoz-ertagi:update" as const,payload:{...options,locale:invitation.enabledLocales.includes(locale)?locale:invitation.defaultLocale,enabledLocales:invitation.enabledLocales,variants,
  apiBase:`/api/public/invitations/${encodeURIComponent(options.invitationId)}`,guestToken:options.preview?"":options.guestToken ?? "",instant:eventInstant(invitation.startsAt,invitation.timezone)?.toISOString() ?? "",contacts:invitation.contacts,music:invitation.music,wishesEnabled:invitation.wishes.enabled}};
}
