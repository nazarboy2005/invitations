"use client";
import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "../../modules/catalog/catalog-music";
import { makeQogozPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = {
  invitation: Invitation; invitationId: string; locale: Locale;
  guestName?: string; guestToken?: string; preview?: boolean;
  fullPreview?: boolean; sampleWishes?: boolean; catalogMusic?: boolean;
  silentPlayback?: boolean; qaReducedMotion?: boolean;
};

/** Complete source renderer shared by catalog, studio and public routes. */
export function TakliflaQogozErtagiInvitation({
  invitation, invitationId, locale, guestName = "", guestToken = "",
  preview = false, fullPreview = false, sampleWishes = false,
  catalogMusic = false, silentPlayback = false, qaReducedMotion = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const message = useMemo(() => {
    const value = makeQogozPayload(invitation, locale, {
      invitationId, guestName, guestToken, preview, sampleWishes:sampleWishes||catalogMusic,
      silentPlayback: preview && (silentPlayback || (!catalogMusic && !fullPreview)),
      reducedMotion: preview && qaReducedMotion,
    });
    if (preview && catalogMusic) value.payload.music = {
      ...value.payload.music, enabled: true, url: CATALOG_PREVIEW_MUSIC.url,
    };
    return value;
  }, [invitation, invitationId, locale, guestName, guestToken, preview,
    sampleWishes, catalogMusic, fullPreview, silentPlayback, qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => {
    frame.current?.contentWindow?.postMessage(message, window.location.origin);
  }, [message]);
  useEffect(()=>{const receive=(e:MessageEvent)=>{if(e.origin===location.origin&&e.source===frame.current?.contentWindow&&e.data?.type==="taklifla-qogoz-ertagi:ready")frame.current?.contentWindow?.postMessage(latest.current,location.origin);};window.addEventListener("message",receive);return()=>window.removeEventListener("message",receive);},[]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <iframe ref={frame} title={invitation.content[locale]?.title || "Qog‘oz Ertagi"}
      src="/templates/taklifla-qogoz-ertagi/index.html" allow="autoplay"
      onLoad={() => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin)} />
  </div>;
}
