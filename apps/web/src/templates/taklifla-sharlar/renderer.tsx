"use client";
import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makeSharlarPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = {
  invitation: Invitation; invitationId: string; locale: Locale;
  guestName?: string; guestToken?: string; preview?: boolean; fullPreview?: boolean;
  sampleWishes?: boolean; catalogMusic?: boolean; silentPlayback?: boolean; qaReducedMotion?: boolean;
};

/** The same source renderer serves catalog, studio and public invitations. */
export function TakliflaSharlarInvitation({ invitation, invitationId, locale,
  guestName = "", guestToken = "", preview = false, fullPreview = false,
  catalogMusic = false, silentPlayback = false, qaReducedMotion = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const message = useMemo(() => {
    const message = makeSharlarPayload(invitation, locale, {
      invitationId, guestName, guestToken, preview, sampleWishes:preview&&catalogMusic,
      silentPlayback: preview && (silentPlayback || (!catalogMusic && !fullPreview)),
      reducedMotion: preview && qaReducedMotion,
    });
    if (preview && catalogMusic) message.payload.music = { enabled: true, url: CATALOG_PREVIEW_MUSIC.url };
    return message;
  }, [invitation, invitationId, locale, guestName, guestToken, preview, catalogMusic, fullPreview, silentPlayback, qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => { frame.current?.contentWindow?.postMessage(message, window.location.origin); }, [message]);
  useEffect(()=>{const receive=(e:MessageEvent)=>{if(e.origin===window.location.origin && e.source===frame.current?.contentWindow && e.data?.type==="sharlar:ready") frame.current?.contentWindow?.postMessage(latest.current,window.location.origin);};window.addEventListener("message",receive);return()=>window.removeEventListener("message",receive);},[]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <iframe ref={frame} title="Sharlar — taklifnoma"
      src="/templates/taklifla-sharlar/index.html" allow="autoplay"
      onLoad={() => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin)} />
  </div>;
}
