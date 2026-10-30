"use client";
import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import {CATALOG_PREVIEW_MUSIC} from "../../modules/catalog/catalog-music";
import { makeTerracottaPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = {
  invitation: Invitation; invitationId: string; locale: Locale;
  guestName?: string; guestToken?: string;
  preview?: boolean; fullPreview?: boolean; sampleWishes?: boolean;
  catalogMusic?:boolean;
  silentPlayback?: boolean; qaReducedMotion?: boolean;
};

/** One isolated source renderer for catalog, creator and public display. */
export function TakliflaTerracottaInvitation({ invitation, invitationId, locale, guestName = "", guestToken = "",
  preview = false, fullPreview = false, sampleWishes = false, catalogMusic=false,silentPlayback = false, qaReducedMotion = false }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const [activeLocale, setActiveLocale] = useState(locale);
  useEffect(() => setActiveLocale(locale), [locale]);
  const selectedLocale = invitation.enabledLocales.includes(activeLocale) ? activeLocale : locale;
  const message = useMemo(() => {const value=makeTerracottaPayload(invitation, selectedLocale, {
    invitationId, guestName, guestToken, preview, sampleWishes:preview&&(sampleWishes||catalogMusic), silentPlayback:preview&&(silentPlayback||(!catalogMusic&&!fullPreview)), reducedMotion: qaReducedMotion,
  });if(preview&&catalogMusic)value.payload.music={...value.payload.music,enabled:true,url:CATALOG_PREVIEW_MUSIC.url};return value;}, [invitation, selectedLocale, invitationId, guestName, guestToken, preview, sampleWishes,catalogMusic, fullPreview, silentPlayback, qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => {
    frame.current?.contentWindow?.postMessage(message, window.location.origin);
  }, [message]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "taklifla-terracotta:ready")
        frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);
      if (event.data?.type === "taklifla-terracotta:locale" && invitation.enabledLocales.includes(event.data.locale))
        setActiveLocale(event.data.locale);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [invitation.enabledLocales]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <iframe ref={frame} src="/templates/taklifla-terracotta/index.html"
      title={`${message.payload.content.title || message.payload.content.people.join(" & ")} — Sopol jilosi`}
      onLoad={() => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin)}
      allow="autoplay" loading="eager" />
  </div>;
}
