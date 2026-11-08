"use client";
import { TemplateFrame } from "@/templates/template-frame";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import {catalogPreviewMusic} from "../../modules/catalog/catalog-music";
import { makeUchrashuvPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = { invitation: Invitation; invitationId: string; locale: Locale; guestName?: string; guestToken?: string; preview?: boolean; fullPreview?: boolean; catalogMusic?:boolean; silentPlayback?: boolean; qaReducedMotion?: boolean };

/** Source renderer shared by catalog, studio and public display. */
export function TakliflaUchrashuv({ invitation, invitationId, locale, guestName = "", guestToken = "", preview = false, fullPreview = false, catalogMusic=false,silentPlayback = false, qaReducedMotion = false }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const message = useMemo(() => {const value=makeUchrashuvPayload(invitation, locale, guestName, { invitationId, guestToken, preview, silentPlayback:preview&&(silentPlayback||!catalogMusic), reducedMotion: qaReducedMotion });if(preview&&catalogMusic)value.payload.music={enabled:true,url:catalogPreviewMusic(invitation).url};return value;}, [invitation, invitationId, locale, guestName, guestToken, preview,catalogMusic,silentPlayback, qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  const send = () => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);
  useEffect(() => { send(); }, [message]);
  useEffect(()=>{const receive=(e:MessageEvent)=>{if(e.origin===window.location.origin && e.source===frame.current?.contentWindow && e.data?.type==="uchrashuv:ready")send();};addEventListener("message",receive);return()=>removeEventListener("message",receive);},[]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <TemplateFrame ref={frame} src="/templates/taklifla-uchrashuv/index.html" title={invitation.content[locale]?.title || "Uchrashuv maktubi"} onReady={send} allow="autoplay" />
  </div>;
}
