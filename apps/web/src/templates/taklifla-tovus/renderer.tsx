"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeTovusPayload } from "./adapter";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
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

/** Same source renderer for catalog, studio and public invitations. */
export function TakliflaTovus({
  invitation,
  invitationId,
  locale,
  guestName = "",
  guestToken = "",
  preview = false,
  fullPreview = false,
  sampleWishes = false,
  catalogMusic = false,
  silentPlayback = false,
  qaReducedMotion = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const message = useMemo(() => {
    const value = makeTovusPayload(invitation, locale, guestName, {
      invitationId,
      guestToken,
      preview,
      sampleWishes: preview && catalogMusic,
      silentPlayback: preview && (silentPlayback || (!catalogMusic && !fullPreview)),
      reducedMotion: qaReducedMotion,
    });
    if (preview && catalogMusic)
      value.payload.music = { enabled: true, url: CATALOG_PREVIEW_MUSIC.url };
    return value;
  }, [
    invitation,
    invitationId,
    locale,
    guestName,
    guestToken,
    preview,
    catalogMusic,
    fullPreview,
    silentPlayback,
    qaReducedMotion,
  ]);
  const latest = useRef(message);
  latest.current = message;
  const send = () =>
    frame.current?.contentWindow?.postMessage(
      latest.current,
      window.location.origin,
    );
  useEffect(() => {
    send();
  }, [message]);
  return (
    <div
      className={
        fullPreview ? styles.full : preview ? styles.preview : styles.public
      }
    >
      <iframe
        ref={frame}
        src="/templates/taklifla-tovus/index.html"
        title={invitation.content[locale]?.title || "Tovus"}
        onLoad={send}
        allow="autoplay"
      />
    </div>
  );
}
