"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makeTamanPayload } from "./adapter";
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

export function WedivoTamanRahasia({
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
    const base = makeTamanPayload(invitation, locale, guestName, {
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
        variants: Object.fromEntries(Object.entries(base.payload.variants).map(([language, data]) => [language, {
          ...data,
          music: catalogMusic ? { enabled: true, url: CATALOG_PREVIEW_MUSIC.url } : data.music,
        }])),
        catalogMusic,
        silentPlayback: preview && silentPlayback,
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
        title={`${invitation.content[locale]?.people.slice(0, 2).join(" & ")} invitation`}
        src="/templates/wedivo-taman-rahasia/index.html"
        onLoad={(event) => {
          const target = event.currentTarget.contentWindow;
          if (!target) return;
          // The source engine initializes once. Its bridge reloads for language
          // or content changes, carrying the open/scroll/music state in name.
          // Do not overwrite that intentional in-frame locale selection here.
          try {
            const restored = JSON.parse(target.name);
            if (
              restored.type === latest.current.type &&
              restored.payload?.view &&
              restored.payload.invitationId === latest.current.payload.invitationId
            ) return;
          } catch { /* First load receives the host envelope below. */ }
          target.name = JSON.stringify(latest.current);
          target.postMessage(latest.current, window.location.origin);
        }}
        allow="autoplay; fullscreen; clipboard-write"
        loading="eager"
      />
    </div>
  );
}
