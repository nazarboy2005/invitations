"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import styles from "./renderer.module.css";
import { makeButterflyData } from "./butterfly-adapter";

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

const localeCode = (locale: Locale) => ({ "uz-Latn": "uz", "uz-Cyrl": "uz-Cyrl", en: "en", ru: "ru" })[locale];

export function ButterflyInvitation({
  invitation, invitationId, locale, guestName = "", guestToken = "", preview = false,
  fullPreview = false, catalogMusic = false, sampleWishes = false, silentPlayback = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [frameLocale, setFrameLocale] = useState(locale);
  useEffect(() => setFrameLocale(locale), [locale]);
  const message = useMemo(() => makeButterflyData(invitation, frameLocale, guestName, guestToken, invitationId, {
    preview, catalogMusic, sampleWishes, silentPlayback,
  }), [invitation, frameLocale, guestName, guestToken, invitationId, preview, catalogMusic, sampleWishes, silentPlayback]);
  const latest = useRef(message);
  latest.current = message;
  const templateId = invitation.templateId;
  const frameUrl = `/templates/${templateId}/index.html?lang=${localeCode(frameLocale)}`;

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "butterfly:language") return;
      const next = invitation.enabledLocales.find((item) => localeCode(item) === event.data.locale);
      if (next) setFrameLocale(next);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [invitation.enabledLocales]);

  const classes = fullPreview ? styles.full : preview ? styles.preview : styles.public;
  return <div className={classes}>
    <iframe
      key={templateId}
      ref={frame}
      title={`${message.groom} & ${message.bride} invitation`}
      src={frameUrl}
      onLoad={() => {
        const target = frame.current?.contentWindow;
        if (!target) return;
        target.postMessage({ type: "butterfly:update", payload: latest.current }, window.location.origin);
      }}
      allow="autoplay; fullscreen"
      loading="eager"
    />
  </div>;
}
