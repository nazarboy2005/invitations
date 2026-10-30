"use client";
import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "../../modules/catalog/catalog-music";
import { makePariPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = {
  invitation: Invitation; invitationId: string; locale: Locale;
  guestName?: string; guestToken?: string; preview?: boolean; fullPreview?: boolean;
  sampleWishes?: boolean; catalogMusic?: boolean; silentPlayback?: boolean; qaReducedMotion?: boolean;
};

/** Complete source renderer for catalog, studio and public display. */
export function TakliflaParilarErtagiInvitation({ invitation, invitationId, locale,
  guestName = "", guestToken = "", preview = false, fullPreview = false,
  sampleWishes = false, catalogMusic = false, silentPlayback = false, qaReducedMotion = false }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const [language, setLanguage] = useState(locale);
  useEffect(() => setLanguage(locale), [locale]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow &&
          event.data?.type === "taklifla-parilar-ertagi:locale" && invitation.enabledLocales.includes(event.data.locale)) {
        setLanguage(event.data.locale);
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [invitation.enabledLocales]);
  const message = useMemo(() => {
    const value = makePariPayload(invitation, language, { invitationId, guestName, guestToken,
      preview, sampleWishes:sampleWishes||catalogMusic, silentPlayback: preview && (silentPlayback || (!catalogMusic && !fullPreview)),
      reducedMotion: preview && qaReducedMotion });
    if (preview && catalogMusic) value.payload.music = { ...value.payload.music, enabled: true, url: CATALOG_PREVIEW_MUSIC.url };
    return value;
  }, [invitation, invitationId, language, guestName, guestToken, preview, sampleWishes, silentPlayback, catalogMusic, qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => { frame.current?.contentWindow?.postMessage(message, window.location.origin); }, [message]);
  useEffect(()=>{const receive=(e:MessageEvent)=>{if(e.origin===location.origin&&e.source===frame.current?.contentWindow&&e.data?.type==="taklifla-parilar-ertagi:ready")frame.current?.contentWindow?.postMessage(latest.current,location.origin);};window.addEventListener("message",receive);return()=>window.removeEventListener("message",receive);},[]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <iframe ref={frame} src="/templates/taklifla-parilar-ertagi/index.html"
      title="Parilar ertagi — taklifnoma" allow="autoplay"
      onLoad={() => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin)} />
  </div>;
}
