"use client";
import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import styles from "./renderer.module.css";
type Props={invitation:Invitation;invitationId:string;locale:Locale;guestName?:string;guestToken?:string;preview?:boolean;fullPreview?:boolean;catalogMusic?:boolean;sampleWishes?:boolean;silentPlayback?:boolean;qaReducedMotion?:boolean;qaMobile?:boolean};
export function OshEditionInvitation({invitation,invitationId,locale,guestName="",preview=false,fullPreview=false,catalogMusic=false,silentPlayback=false,qaReducedMotion=false,qaMobile=false}:Props){
 const frame=useRef<HTMLIFrameElement>(null);
 const data=useMemo(()=>{const base=makeLegacyData(invitation,locale,guestName);const playback=catalogMusic?CATALOG_PREVIEW_MUSIC.url:(base.music.enabled?base.music.url:"");return {...base,locale,introOpened:false,music:playback,silentPlayback:preview&&silentPlayback,venue:{...base.venue,name:base.venue.name,address:base.venue.address},landmark:"",invitationId};},[invitation,locale,guestName,catalogMusic,silentPlayback,preview,invitationId]);
 const latest=useRef(data);latest.current=data;const flags=[qaReducedMotion?"qaReducedMotion=1":"",qaMobile?"qaMobile=1":""].filter(Boolean).join("&");const src=`/templates/osh-edition-v1/index.html${preview&&flags?`?${flags}`:""}`;
 useEffect(()=>{frame.current?.contentWindow?.postMessage({type:"osh-edition-v1:update",payload:data},window.location.origin)},[data]);
 return <div className={`${fullPreview?styles.full:preview?styles.preview:styles.public}${preview&&qaMobile?` ${styles.qaMobile}`:""}`}><iframe ref={frame} name={JSON.stringify(data)} title={`${data.groom}${data.bride?` & ${data.bride}`:""} \u2014 Osh Edition`} src={src} onLoad={()=>{const w=frame.current?.contentWindow;if(w){w.name=JSON.stringify(latest.current);w.postMessage({type:"osh-edition-v1:update",payload:latest.current},window.location.origin)}}} allow="autoplay; fullscreen" loading="eager"/></div>
}
