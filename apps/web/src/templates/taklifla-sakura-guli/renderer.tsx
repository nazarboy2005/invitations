"use client";
import { useInvitationMaps } from "@/templates/use-invitation-maps";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import {CATALOG_PREVIEW_MUSIC} from "../../modules/catalog/catalog-music";
import { makeSakuraPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = { invitation: Invitation; invitationId: string; locale: Locale; guestName?: string; guestToken?: string; preview?: boolean; fullPreview?: boolean; silentPlayback?: boolean; qaReducedMotion?: boolean;catalogMusic?:boolean };
export function SakuraGuliInvitation(props: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const [locale, setLocale] = useState(props.locale);
  useEffect(() => setLocale(props.locale), [props.locale]);
  const payload=useMemo(()=>{const value=makeSakuraPayload(props.invitation,locale,{...props,reducedMotion:props.qaReducedMotion,sampleWishes:props.preview&&props.catalogMusic});if(props.preview&&props.catalogMusic)value.musicUrl=CATALOG_PREVIEW_MUSIC.url;return value;},[props.invitation,locale,props.invitationId,props.guestName,props.guestToken,props.preview,props.catalogMusic,props.silentPlayback,props.qaReducedMotion]);
  const latest = useRef(payload); latest.current = payload;
  const send = () => frame.current?.contentWindow?.postMessage({ type: "sakura:update", payload: latest.current }, window.location.origin);
  useEffect(send, [payload]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "sakura:ready") send();
      if (event.data?.type === "sakura:locale" && props.invitation.enabledLocales.includes(event.data.locale)) setLocale(event.data.locale);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [props.invitation.enabledLocales]);
  return <div className={props.fullPreview ? styles.full : props.preview ? styles.preview : styles.public}>
    <iframe ref={frame} title={props.invitation.content[locale]?.title || "Sakura Guli"} src="/templates/taklifla-sakura-guli/index.html" onLoad={send} allow="autoplay" />
  </div>;
}
