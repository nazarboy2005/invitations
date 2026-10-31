"use client";
import { publicAsset } from "../../lib/public-asset";

import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makeMountainPayload } from "./adapter";
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

/** Same complete source renderer for catalog, studio and public display. */
export function ToglarBagridaInvitation({ invitation, invitationId, locale, guestName = "", guestToken = "", preview = false, fullPreview = false, catalogMusic = false, silentPlayback = false, qaReducedMotion = false }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const [activeLocale, setActiveLocale] = useState(locale);
  useEffect(() => setActiveLocale(locale), [locale]);
  const message = useMemo(() => {
    const result = makeMountainPayload(invitation, activeLocale, guestName, { invitationId, guestToken, preview, silentPlayback, reducedMotion: qaReducedMotion, sampleWishes: preview && catalogMusic });
    if (preview && catalogMusic) result.payload.music = { enabled: true, url: CATALOG_PREVIEW_MUSIC.url };
    return result;
  }, [invitation, activeLocale, guestName, invitationId, guestToken, preview, silentPlayback, qaReducedMotion, catalogMusic]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => { frame.current?.contentWindow?.postMessage(message, window.location.origin); }, [message]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "taklifla-mountain:ready") frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);
      if (event.data?.type === "taklifla-mountain:language" && invitation.enabledLocales.includes(event.data.locale)) setActiveLocale(event.data.locale);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [invitation.enabledLocales]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <iframe ref={frame} title={`${invitation.content[activeLocale]?.title || "Tog‘lar bag‘rida"}`} src={publicAsset("/templates/taklifla-toglar-bagrida/index.html")} onLoad={() => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin)} allow="autoplay" />
  </div>;
}
