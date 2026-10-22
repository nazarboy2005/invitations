"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
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
  catalogMusic?: boolean;
  sampleWishes?: boolean;
  silentPlayback?: boolean;
};

const locales: Record<Locale, string> = {
  "uz-Latn": "uz",
  "uz-Cyrl": "uz-Cyrl",
  en: "en",
  ru: "ru",
};

/** Keeps the source design in its own same-origin document; only contract data crosses the adapter. */
export function OltinDarvozaInvitation({
  invitation,
  invitationId,
  locale,
  guestName = "",
  guestToken = "",
  preview = false,
  fullPreview = false,
  catalogMusic = false,
  sampleWishes = false,
  silentPlayback = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [frameLocale, setFrameLocale] = useState(locale);
  useEffect(() => setFrameLocale(locale), [locale]);

  const message = useMemo(() => {
    const source = makeLegacyData(
      invitation,
      frameLocale,
      guestName,
      sampleWishes,
    );
    const musicUrl = preview && catalogMusic
      ? CATALOG_PREVIEW_MUSIC.url
      : source.music.enabled
        ? source.music.url
        : "";
    return {
      ...source,
      locale: frameLocale,
      languages: invitation.enabledLocales,
      guestName,
      guestToken,
      music: { ...source.music, url: musicUrl },
      preview,
      slug: preview ? "" : invitation.slug ?? "",
      apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
      rsvp: invitation.rsvp,
      wishesEnabled: invitation.wishes.enabled,
    };
  }, [
    catalogMusic,
    frameLocale,
    guestName,
    guestToken,
    invitation,
    invitationId,
    preview,
    sampleWishes,
  ]);

  const latest = useRef(message);
  latest.current = message;
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== "oltin-darvoza-ortidagi-baxt:language"
      ) return;
      const next = invitation.enabledLocales.find(
        (enabled) => enabled === event.data.locale,
      );
      if (next) setFrameLocale(next);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [invitation.enabledLocales]);

  useEffect(() => {
    frame.current?.contentWindow?.postMessage(
      { type: "oltin-darvoza-ortidagi-baxt:update", payload: message },
      window.location.origin,
    );
  }, [message]);

  const frameUrl = `/templates/onlinetaklifnoma-oltin-darvoza-ortidagi-baxt/index.html${preview && silentPlayback ? "?qaSilent=1" : ""}`;
  const mode = fullPreview ? styles.full : preview ? styles.preview : styles.public;
  return (
    <div className={mode}>
      <iframe
        ref={frame}
        title={`${message.groom} & ${message.bride} invitation`}
        src={frameUrl}
        onLoad={() => {
          const target = frame.current?.contentWindow;
          if (!target) return;
          target.name = JSON.stringify(latest.current);
          target.postMessage(
            { type: "oltin-darvoza-ortidagi-baxt:update", payload: latest.current },
            window.location.origin,
          );
        }}
        allow="autoplay; fullscreen; clipboard-write"
        loading="eager"
      />
    </div>
  );
}
