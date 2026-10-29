"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makeErtakPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = {
  invitation: Invitation;
  invitationId: string;
  locale: Locale;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  fullPreview?: boolean;
  catalogMusic?: boolean;
  silentPlayback?: boolean;
  qaReducedMotion?: boolean;
};

/** Complete source renderer shared by catalog, studio and public routes. */
export function TakliflaErtak({ invitation, invitationId, locale, guestName,
  guestToken, preview = false, fullPreview = false, catalogMusic = false,
  silentPlayback = false, qaReducedMotion = false }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [activeLocale, setActiveLocale] = useState(locale);
  useEffect(() => setActiveLocale(locale), [locale]);
  const message = useMemo(() => makeErtakPayload(invitation, activeLocale, {
    invitationId, guestName, guestToken, preview,
    sampleWishes: preview && catalogMusic,
    reducedMotion: qaReducedMotion,
    catalogMusicUrl: preview && catalogMusic ? CATALOG_PREVIEW_MUSIC.url : "",
    silentPlayback: preview && (silentPlayback || !catalogMusic),
  }), [invitation, activeLocale, invitationId, guestName, guestToken, preview,
    qaReducedMotion, catalogMusic, silentPlayback]);
  const latest = useRef(message);
  latest.current = message;
  const send = () => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);
  useEffect(() => { send(); }, [message]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.origin !== window.location.origin) return;
      if (event.data?.type === "taklifla-ertak:ready") send();
      if (event.data?.type === "taklifla-ertak:locale" && invitation.enabledLocales.includes(event.data.locale))
        setActiveLocale(event.data.locale);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [invitation.enabledLocales]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <iframe ref={frame} src="/templates/taklifla-ertak/index.html" onLoad={send}
      title={`Ertak · ${invitation.content[activeLocale]?.title ?? ""}`}
      allow="autoplay" loading="eager" />
  </div>;
}
