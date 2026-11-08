"use client";
import { TemplateFrame } from "@/templates/template-frame";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { makeSundanesePuspaPayload } from "./adapter";
import { useInvitationExtras } from "../use-invitation-extras";
import styles from "./renderer.module.css";

type Props={invitation:Invitation;invitationId:string;locale:Locale;guestName?:string;guestToken?:string;preview?:boolean;fullPreview?:boolean;catalogMusic?:boolean;sampleWishes?:boolean;silentPlayback?:boolean;qaReducedMotion?:boolean;qaMobile?:boolean};
export function WedivoSundanesePuspaInvitation({invitation,invitationId,locale,guestName="",guestToken="",preview=false,fullPreview=false,catalogMusic=false,sampleWishes=false,silentPlayback=false,qaReducedMotion=false,qaMobile=false}:Props){
 const frame=useRef<HTMLIFrameElement>(null);
 const options={invitationId,guestToken,preview,sampleWishes,catalogMusic,silentPlayback,reducedMotion:qaReducedMotion};
 const [frameLocale,setFrameLocale]=useState(locale);useEffect(()=>setFrameLocale(locale),[locale]);
 const envelope=useMemo(()=>makeSundanesePuspaPayload(invitation,frameLocale,guestName,options),[invitation,frameLocale,guestName,invitationId,guestToken,preview,sampleWishes,catalogMusic,silentPlayback,qaReducedMotion]);
 const legacy=useMemo(()=>makeLegacyData(invitation,frameLocale,guestName,sampleWishes),[invitation,frameLocale,guestName,sampleWishes]);
 const sendReceiptAdapter=useInvitationExtras(frame,invitation,legacy,frameLocale,invitationId,guestToken,preview,true,{story:false,dressCode:false,extraPeople:false,receiptHostSelector:"#gifts-div-9"});
 const latest=useRef(envelope);latest.current=envelope;
 const send=useCallback(()=>{const target=frame.current?.contentWindow;if(!target)return;target.name=JSON.stringify(latest.current);target.postMessage(latest.current,location.origin);sendReceiptAdapter();},[sendReceiptAdapter]);
 useEffect(()=>{const onMessage=(event:MessageEvent)=>{if(event.origin!==window.location.origin||event.source!==frame.current?.contentWindow||event.data?.type!=="wedivo-sundanese-puspa:language")return;const next=event.data.locale as Locale;if(invitation.enabledLocales.includes(next))setFrameLocale(next);};window.addEventListener("message",onMessage);return()=>window.removeEventListener("message",onMessage);},[invitation.enabledLocales]);
 useEffect(send,[envelope,sendReceiptAdapter]);
 const frameUrl=`/templates/wedivo-sundanese-puspa/source/index.html${preview&&qaReducedMotion?"?qaReducedMotion=1":""}`;
 return <div className={`${fullPreview?styles.full:preview?styles.preview:styles.public}${preview&&qaMobile?` ${styles.qaMobile}`:""}`}><TemplateFrame ref={frame} name={JSON.stringify(envelope)} title={`${legacy.groom}${legacy.bride?` & ${legacy.bride}`:""} invitation`} src={frameUrl} onReady={send} allow="autoplay; fullscreen" loading="eager"/></div>;
}
