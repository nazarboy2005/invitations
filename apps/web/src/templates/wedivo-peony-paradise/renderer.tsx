"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makePeonyPayload, type PeonyOptions } from "./adapter";
import styles from "./renderer.module.css";

type Props = PeonyOptions & {
  invitation: Invitation;
  locale?: Locale;
  fullPreview?: boolean;
  qaMobile?: boolean;
};

/** Shared preview/public renderer. Catalog and route registration belong to the coordinator. */
export function WedivoPeonyParadiseInvitation({
  invitation,
  locale = "uz-Latn",
  fullPreview = false,
  qaMobile = false,
  ...options
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [activeLocale, setActiveLocale] = useState(locale);
  const presentationLocale = invitation.enabledLocales.includes(activeLocale)
    ? activeLocale
    : invitation.enabledLocales.includes(locale)
      ? locale
      : invitation.defaultLocale;
  useEffect(() => setActiveLocale(locale), [locale]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === "wedivo-peony-paradise:locale" &&
        invitation.enabledLocales.includes(event.data.locale)
      )
        setActiveLocale(event.data.locale);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [invitation.enabledLocales]);
  const message = useMemo(
    () => makePeonyPayload(invitation, presentationLocale, options),
    [invitation, presentationLocale, options],
  );
  const serialized = JSON.stringify(message);
  const mode = fullPreview
    ? styles.full
    : options.preview
      ? styles.preview
      : styles.public;
  // A fresh document on an authored update cleanly disposes the captured source's
  // observers, animation frames, timers and audio while preserving creator data.
  return (
    <div
      className={`${mode}${options.preview && qaMobile ? ` ${styles.mobile}` : ""}`}
    >
      <iframe
        key={serialized}
        ref={frame}
        title={
          {
            "uz-Latn": "Gulbarglar sehri — taklifnoma",
            "uz-Cyrl": "Гулбарглар сеҳри — таклифнома",
            en: "Magic of petals — invitation",
            ru: "Волшебство лепестков — приглашение",
          }[presentationLocale]
        }
        src="/templates/wedivo-peony-paradise/index.html"
        onLoad={() =>
          frame.current?.contentWindow?.postMessage(
            message,
            window.location.origin,
          )
        }
        allow="autoplay; fullscreen; clipboard-write"
        loading="eager"
      />
    </div>
  );
}
