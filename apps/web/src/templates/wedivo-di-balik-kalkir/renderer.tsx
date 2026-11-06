"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makeWedivoPayload } from "./adapter";
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

export function WedivoDiBalikKalkir({
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
    const base = makeWedivoPayload(invitation, locale, guestName, {
      invitationId,
      guestToken,
      preview,
      sampleWishes,
    });
    return {
      ...base,
      payload: {
        ...base.payload,
        data: {
          ...base.payload.data,
          music: catalogMusic
            ? { enabled: true, url: CATALOG_PREVIEW_MUSIC.url }
            : base.payload.data.music,
        },
        catalogMusic,
        silentPlayback: preview && (silentPlayback || !catalogMusic),
        reducedMotion: preview && qaReducedMotion,
      },
    };
  }, [
    invitation,
    locale,
    guestName,
    guestToken,
    invitationId,
    preview,
    sampleWishes,
    catalogMusic,
    silentPlayback,
    qaReducedMotion,
  ]);
  const latest = useRef(message);
  latest.current = message;

  useEffect(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    target.name = JSON.stringify(latest.current);
    target.postMessage(latest.current, window.location.origin);
  }, [message]);

  const mode = fullPreview
    ? styles.full
    : preview
      ? styles.preview
      : styles.public;
  return (
    <div className={mode}>
      <iframe
        ref={frame}
        title={`${invitation.content[locale]?.people.slice(0, 2).join(" va ")} — Taklifnoma`}
        src="/templates/wedivo-di-balik-kalkir/index.html"
        onLoad={(event) => {
          const target = event.currentTarget.contentWindow;
          if (!target) return;
          target.name = JSON.stringify(latest.current);
          target.postMessage(latest.current, window.location.origin);
        }}
        allow="autoplay; fullscreen; clipboard-write"
        loading="eager"
      />
    </div>
  );
}
