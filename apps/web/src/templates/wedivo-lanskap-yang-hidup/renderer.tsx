"use client";
import { TemplateFrame } from "@/templates/template-frame";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { catalogPreviewMusic } from "@/modules/catalog/catalog-music";
import { makeLanskapPayload } from "./adapter";
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
  sampleWishes?: boolean;
  silentPlayback?: boolean;
  qaReducedMotion?: boolean;
};

export function WedivoLanskapYangHidup({ invitation, invitationId, locale, guestName = "", guestToken = "", preview = false, fullPreview = false, catalogMusic = false, sampleWishes = false, silentPlayback = false, qaReducedMotion = false }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const message = useMemo(() => {
    const base = makeLanskapPayload(invitation, locale, guestName, { invitationId, guestToken, preview, sampleWishes });
    return {
      ...base,
      payload: {
        ...base.payload,
        data: { ...base.payload.data, music: preview && catalogMusic ? { enabled: true, url: catalogPreviewMusic(invitation).url } : base.payload.data.music },
        silentPlayback: preview && (silentPlayback || !catalogMusic),
        reducedMotion: preview && qaReducedMotion,
      },
    };
  }, [invitation, invitationId, locale, guestName, guestToken, preview, sampleWishes, catalogMusic, silentPlayback, qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => { frame.current?.contentWindow?.postMessage(message, window.location.origin); }, [message]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.origin !== window.location.origin) return;
      if (event.data?.type === "wedivo-lanskap-yang-hidup:ready") frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [invitation.enabledLocales]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <TemplateFrame ref={frame} title={`${invitation.content[locale]?.title || "Taklifnoma"} — Jonli vodiy`} src="/templates/wedivo-lanskap-yang-hidup/index.html" onReady={() => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin)} allow="autoplay; fullscreen; clipboard-write" />
  </div>;
}
