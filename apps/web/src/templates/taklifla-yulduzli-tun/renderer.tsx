"use client";
import { publicAsset } from "../../lib/public-asset";

import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makeStarryPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = {
  invitation: Invitation; invitationId: string; locale: Locale;
  guestName?: string; guestToken?: string; preview?: boolean; fullPreview?: boolean;
  catalogMusic?: boolean; silentPlayback?: boolean; qaReducedMotion?: boolean;
};

/** Shared native source renderer for catalog, creator and public display. */
export function TakliflaYulduzliTun({ invitation, invitationId, locale, guestName = "", guestToken = "", preview = false, fullPreview = false, catalogMusic = false, silentPlayback = false, qaReducedMotion = false }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const message = useMemo(() => makeStarryPayload(invitation, locale, {
    invitationId, guestName, guestToken, preview, sampleWishes:preview&&catalogMusic,silentPlayback, reducedMotion: qaReducedMotion,
    catalogMusicUrl: preview && catalogMusic ? CATALOG_PREVIEW_MUSIC.url : undefined,
  }), [invitation, invitationId, locale, guestName, guestToken, preview, catalogMusic, silentPlayback, qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => { frame.current?.contentWindow?.postMessage(message, window.location.origin); }, [message]);
  useEffect(()=>{const receive=(e:MessageEvent)=>{if(e.origin===window.location.origin && e.source===frame.current?.contentWindow && e.data?.type==="starry:ready")frame.current?.contentWindow?.postMessage(latest.current,window.location.origin);};addEventListener("message",receive);return()=>removeEventListener("message",receive);},[]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <iframe ref={frame} title={invitation.content[locale]?.title || "Yulduzli Tun"}
      src={publicAsset("/templates/taklifla-yulduzli-tun/index.html")}
      onLoad={event => event.currentTarget.contentWindow?.postMessage(latest.current, window.location.origin)}
      allow="autoplay" />
  </div>;
}
