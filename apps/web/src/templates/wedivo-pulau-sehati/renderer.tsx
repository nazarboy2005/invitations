"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makePulauSehatiPayload } from "./adapter";
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

export function WedivoPulauSehati({
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
  const [activeLocale, setActiveLocale] = useState(locale);
  useEffect(() => setActiveLocale(locale), [locale]);
  useEffect(() => {
    const changeLocale = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow ||
        event.origin !== window.location.origin ||
        event.data?.type !== "wedivo-pulau-sehati:locale"
      )
        return;
      if (invitation.enabledLocales.includes(event.data.locale))
        setActiveLocale(event.data.locale);
    };
    window.addEventListener("message", changeLocale);
    return () => window.removeEventListener("message", changeLocale);
  }, [invitation.enabledLocales]);
  const message = useMemo(() => {
    const base = makePulauSehatiPayload(invitation, activeLocale, guestName, {
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
        silentPlayback: preview && (silentPlayback || (!catalogMusic && !fullPreview)),
        reducedMotion: preview && qaReducedMotion,
      },
    };
  }, [
    invitation,
    activeLocale,
    guestName,
    guestToken,
    invitationId,
    preview,
    sampleWishes,
    catalogMusic,
    fullPreview,
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
        title={`${invitation.content[activeLocale]?.people.slice(0, 2).join(" & ")} · ${{ "uz-Latn": "Taklifnoma", "uz-Cyrl": "Таклифнома", en: "Invitation", ru: "Приглашение" }[activeLocale]}`}
        src="/templates/wedivo-pulau-sehati/index.html"
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
