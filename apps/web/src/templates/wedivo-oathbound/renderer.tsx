"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makeOathboundPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = {
  invitation: Invitation;
  invitationId: string;
  locale: Locale;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  fullPreview?: boolean;
  sampleWishes?: boolean;
  catalogMusic?: boolean;
  silentPlayback?: boolean;
  qaReducedMotion?: boolean;
};

export function WedivoOathboundInvitation({
  invitation, invitationId, locale, guestName = "", guestToken = "",
  preview = false, fullPreview = false, sampleWishes = false,
  catalogMusic = false, silentPlayback = false, qaReducedMotion = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const message = useMemo(() => {
    const message = makeOathboundPayload(invitation, locale, {
      invitationId, guestName, guestToken, preview, sampleWishes,
      silentPlayback: preview && (silentPlayback || !catalogMusic),
      reducedMotion: preview && qaReducedMotion,
    });
    return { ...message, payload: { ...message.payload,
      music: preview && catalogMusic
        ? { ...message.payload.music, enabled: true, url: CATALOG_PREVIEW_MUSIC.url }
        : message.payload.music,
    } };
  }, [invitation, invitationId, locale, guestName, guestToken, preview,
    sampleWishes, catalogMusic, silentPlayback, qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => {
    frame.current?.contentWindow?.postMessage(message, window.location.origin);
  }, [message]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <iframe ref={frame} name={JSON.stringify(message)}
      title={`${message.payload.content.people.join(" & ")} — Ahd yo‘li`}
      src="/templates/wedivo-oathbound/index.html"
      onLoad={() => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin)}
      allow="autoplay; fullscreen; clipboard-write" loading="eager" />
  </div>;
}
