"use client";
import { publicAsset } from "../../lib/public-asset";

import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import styles from "./renderer.module.css";
import { makeSafirData } from "./safir-adapter";

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

export function SafirInvitation({
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
  useInvitationMaps(frame);
  const initialized = useRef(false);
  const [frameLocale, setFrameLocale] = useState(locale);
  useEffect(() => setFrameLocale(locale), [locale]);

  const payload = useMemo(
    () =>
      makeSafirData(
        invitation,
        frameLocale,
        guestName,
        guestToken,
        invitationId,
        preview,
        sampleWishes,
        catalogMusic,
        silentPlayback,
      ),
    [
      catalogMusic,
      frameLocale,
      guestName,
      guestToken,
      invitation,
      invitationId,
      preview,
      sampleWishes,
      silentPlayback,
    ],
  );
  const latest = useRef(payload);
  latest.current = payload;
  const frameUrl = publicAsset(`/templates/safir/index.html?lang=${sourceLocale[locale]}`);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== "safir:language"
      )
        return;
      const next = invitation.enabledLocales.find(
        (enabled) => sourceLocale[enabled] === event.data.locale,
      );
      if (next) setFrameLocale(next);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [invitation.enabledLocales]);

  useEffect(() => {
    frame.current?.contentWindow?.postMessage(
      { type: "safir:update", payload: latest.current },
      window.location.origin,
    );
  }, [payload]);

  const classes = fullPreview
    ? styles.full
    : preview
      ? styles.preview
      : styles.public;
  return (
    <div className={classes}>
      <iframe
        key="safir"
        ref={frame}
        title={`${payload.groom} & ${payload.bride} invitation`}
        src={frameUrl}
        onLoad={() => {
          const target = frame.current?.contentWindow;
          if (!target) return;
          if (!initialized.current) {
            target.name = JSON.stringify(latest.current);
            target.location.replace(frameUrl);
            initialized.current = true;
            return;
          }
          target.postMessage(
            { type: "safir:update", payload: latest.current },
            window.location.origin,
          );
        }}
        allow="autoplay; fullscreen; clipboard-write"
        loading="eager"
      />
    </div>
  );
}
