"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makeYubileySahifasiPayload } from "./adapter";
import styles from "./renderer.module.css";

export type YubileySahifasiProps = {
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

/** Source renderer shared across catalog, studio and public invitations. */
export function TakliflaYubileySahifasi({
  invitation, invitationId, locale, guestName = "", guestToken = "",
  preview = false, fullPreview = false, catalogMusic = false,
  silentPlayback = false, qaReducedMotion = false,
}: YubileySahifasiProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [activeLocale, setActiveLocale] = useState(locale);
  useEffect(() => setActiveLocale(locale), [locale]);
  useEffect(() => {
    const onLocale = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow ||
          event.origin !== window.location.origin ||
          event.data?.type !== "taklifla-yubiley-sahifasi:locale") return;
      if (invitation.enabledLocales.includes(event.data.locale)) setActiveLocale(event.data.locale);
    };
    window.addEventListener("message", onLocale);
    return () => window.removeEventListener("message", onLocale);
  }, [invitation.enabledLocales]);
  const message = useMemo(() => {
    const base = makeYubileySahifasiPayload(invitation, activeLocale, {
      invitationId, guestName, guestToken, preview,
    });
    return { ...base, payload: {
      ...base.payload,
      music: preview && catalogMusic ? { enabled: true, url: CATALOG_PREVIEW_MUSIC.url } : base.payload.music,
      silentPlayback: preview && (silentPlayback || (!catalogMusic && !fullPreview)),
      reducedMotion: preview && qaReducedMotion,
    } };
  }, [invitation, activeLocale, invitationId, guestName, guestToken, preview, catalogMusic, fullPreview, silentPlayback, qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => {
    frame.current?.contentWindow?.postMessage(message, window.location.origin);
  }, [message]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <iframe ref={frame} src="/templates/taklifla-yubiley-sahifasi/index.html"
      title={message.payload.company || { "uz-Latn": "Yubiley sahifasi", "uz-Cyrl": "Юбилей саҳифаси", en: "Anniversary page", ru: "Юбилейная страница" }[activeLocale]}
      onLoad={(event) => event.currentTarget.contentWindow?.postMessage(latest.current, window.location.origin)}
      allow="autoplay" loading="eager" />
  </div>;
}
