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

const sourceLocale: Record<Locale, string> = {
  "uz-Latn": "uz",
  "uz-Cyrl": "uz-Cyrl",
  en: "en",
  ru: "ru",
};

export function InvitateInvitation({
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
  const initialized = useRef(false);
  const [frameLocale, setFrameLocale] = useState(locale);
  useEffect(() => setFrameLocale(locale), [locale]);

  const message = useMemo(() => {
    const source = makeLegacyData(invitation, frameLocale, guestName, sampleWishes);
    const languages = invitation.enabledLocales.map((item) => sourceLocale[item]);
    const music = source.music.enabled
      ? source.music.url
      : preview && catalogMusic
        ? CATALOG_PREVIEW_MUSIC.url
        : "";
    return {
      ...source,
      locale: sourceLocale[frameLocale],
      defaultLang: sourceLocale[frameLocale],
      languages,
      guestName,
      guestToken,
      music,
      preview,
      silentPlayback: preview && silentPlayback,
      apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
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
    silentPlayback,
  ]);
  const latest = useRef(message);
  latest.current = message;
  const frameUrl = `/templates/evelina/index.html?lang=${sourceLocale[frameLocale]}`;
  const initialFrameUrl = useRef(frameUrl);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== "evelina:language"
      ) return;
      const next = invitation.enabledLocales.find(
        (enabled) => sourceLocale[enabled] === event.data.locale,
      );
      if (next) setFrameLocale(next);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [invitation.enabledLocales]);

  useEffect(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    target.postMessage({ type: "evelina:update", payload: latest.current }, window.location.origin);
  }, [message]);

  const classes = fullPreview ? styles.full : preview ? styles.preview : styles.public;
  return (
    <div className={classes}>
      <iframe
        ref={frame}
        title={`${message.groom} & ${message.bride} invitation`}
        src={initialFrameUrl.current}
        onLoad={() => {
          const target = frame.current?.contentWindow;
          if (!target) return;
          if (!initialized.current) {
            target.name = JSON.stringify(latest.current);
            target.location.replace(frameUrl);
            initialized.current = true;
          } else {
            target.postMessage({ type: "evelina:update", payload: latest.current }, window.location.origin);
          }
        }}
        allow="autoplay; fullscreen"
        loading="eager"
      />
    </div>
  );
}
