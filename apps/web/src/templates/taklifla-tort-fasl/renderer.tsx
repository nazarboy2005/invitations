"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { FASLLAR_ID, FASLLAR_NAME, makeFasllarPayload } from "./adapter";
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

/** Shared renderer for catalog, creator preview and published invitations. */
export function TakliflaTortFasl({
  invitation,
  invitationId,
  locale,
  guestName = "",
  guestToken = "",
  preview = false,
  fullPreview = false,
  catalogMusic = false,
  silentPlayback = false,
  qaReducedMotion = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const message = useMemo(() => {
    const value = makeFasllarPayload(invitation, locale, guestName, {
      invitationId,
      guestToken,
      preview,
      sampleWishes: preview && catalogMusic,
      silentPlayback: preview && (silentPlayback || (!catalogMusic && !fullPreview)),
      reducedMotion: preview && qaReducedMotion,
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
  useEffect(() => {
    frame.current?.contentWindow?.postMessage(message, window.location.origin);
  }, [message]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.source === frame.current?.contentWindow &&
        event.origin === window.location.origin &&
        event.data?.type === `${FASLLAR_ID}:ready`
      ) {
        frame.current?.contentWindow?.postMessage(
          latest.current,
          window.location.origin,
        );
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  return (
    <div
      className={
        fullPreview ? styles.full : preview ? styles.preview : styles.public
      }
    >
      <iframe
        ref={frame}
        title={`${invitation.content[locale]?.title || FASLLAR_NAME} — ${FASLLAR_NAME}`}
        src={`/templates/${FASLLAR_ID}/index.html`}
        onLoad={() =>
          frame.current?.contentWindow?.postMessage(
            latest.current,
            window.location.origin,
          )
        }
        allow="autoplay"
      />
    </div>
  );
}
