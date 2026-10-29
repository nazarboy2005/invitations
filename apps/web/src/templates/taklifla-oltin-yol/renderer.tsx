"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "../../modules/catalog/catalog-music";
import { makeOltinYolPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = { invitation:Invitation; invitationId:string; locale:Locale; guestName?:string; guestToken?:string; preview?:boolean; qaReducedMotion?:boolean; silentPlayback?:boolean; sampleWishes?:boolean; catalogMusic?:boolean; fullPreview?:boolean };

/** Complete source renderer shared by catalog, studio and public routes. */
export function TakliflaOltinYol(props:Props) {
  const frame=useRef<HTMLIFrameElement>(null);
  const message=useMemo(()=>{
    const value=makeOltinYolPayload(props.invitation,props.locale,{...props,reducedMotion:props.preview && props.qaReducedMotion,sampleWishes:props.preview && props.catalogMusic});
    if(props.preview && props.catalogMusic)value.payload.music=CATALOG_PREVIEW_MUSIC.url;
    return value;
  },[props.invitation,props.locale,props.invitationId,props.guestName,props.guestToken,props.preview,props.qaReducedMotion,props.silentPlayback,props.sampleWishes,props.catalogMusic]);
  const latest=useRef(message); latest.current=message;
  useEffect(()=>{frame.current?.contentWindow?.postMessage(message,window.location.origin)},[message]);
  useEffect(()=>{
    const ready=(event:MessageEvent)=>{
      if(event.origin===window.location.origin && event.source===frame.current?.contentWindow && event.data?.type==="taklifla-oltin-yol:ready")
        frame.current?.contentWindow?.postMessage(latest.current,window.location.origin);
    };
    window.addEventListener("message",ready);return()=>window.removeEventListener("message",ready);
  },[]);
  return <div className={props.fullPreview ? styles.full : props.preview ? styles.preview : styles.public}><iframe ref={frame} className={styles.frame} title="Oltin Yo‘l" src="/templates/taklifla-oltin-yol/index.html" onLoad={()=>frame.current?.contentWindow?.postMessage(latest.current,window.location.origin)} allow="autoplay" /></div>;
}
