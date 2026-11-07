import { getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { catalogPreviewMusic } from "@/modules/catalog/catalog-music";

const openingArt = ["1792019131_0e4e8aaa.jpg","1792019169_9a85ba34.jpg","1792019168_5e59eb97.jpg","1792019208_e2bcacee.jpg","1792019219_100edecb.jpg","1792019261_0e3f44fa.jpg"].map((name)=>`/templates/wedivo-sundanese-puspa/assets/${name}`);
export function makeSundanesePuspaPayload(invitation:Invitation,locale:Locale,guestName:string,options:{invitationId:string;guestToken?:string;preview:boolean;sampleWishes?:boolean;catalogMusic?:boolean;silentPlayback?:boolean;reducedMotion?:boolean}){
 const content=getContent(invitation,locale);
 const legacy=makeLegacyData(invitation,locale,guestName,options.sampleWishes);
 const data={...legacy,
  brideFullName:content.people[1]||"",groomFullName:content.people[0]||"",
  program:invitation.program.map(item=>({id:item.id,time:item.time,title:content.programTitles[item.id]||"",description:content.programDescriptions[item.id]||"",location:content.venueName})),
  story:invitation.story.map(item=>({id:item.id,title:item.title[locale]||"",text:item.text[locale]||""})).filter(item=>item.title.trim()||item.text.trim()),
  gallery:invitation.gallery.map(item=>({id:item.id,src:item.url,alt:item.alt||item.caption,caption:item.caption})),
  wishes:options.sampleWishes?legacy.wishes:[],
  dressCode:legacy.dressCode,
 };
 if(options.preview&&options.sampleWishes&&data.gallery.every(item=>!item.src))data.gallery=openingArt.map((src,index)=>({id:`puspa-preview-${index+1}`,src,alt:"",caption:""}));
 if(options.catalogMusic)data.music={enabled:true,url:catalogPreviewMusic(invitation).url};
 if(options.silentPlayback)data.music={enabled:false,url:""};
 return {type:"wedivo-sundanese-puspa:update",payload:{data,locale,enabledLocales:invitation.enabledLocales,invitationId:options.invitationId,guestName,guestToken:options.guestToken??"",preview:options.preview,reducedMotion:options.preview&&!!options.reducedMotion,gallery:data.gallery,wishesEnabled:invitation.wishes.enabled,rsvpEnabled:invitation.rsvp.enabled,giftEnabled:invitation.gift.enabled,receiptUploadEnabled:invitation.gift.enabled&&invitation.gift.receiptUploadEnabled}};
}
