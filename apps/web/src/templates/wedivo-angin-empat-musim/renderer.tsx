"use client";
import { TemplateFrame } from "@/templates/template-frame";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { ANGIN_TEMPLATE_ID, makeAnginPayload } from "./adapter";
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

/** The coordinator can dispatch this same renderer from preview and public routes. */
export function WedivoAnginEmpatMusim({
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
  const [frameLocale, setFrameLocale] = useState(locale);
  useEffect(() => {
    setFrameLocale(locale);
  }, [locale]);
  const message = useMemo(
    () =>
      makeAnginPayload(invitation, frameLocale, guestName, {
        invitationId,
        guestToken,
        preview,
        sampleWishes,
        catalogMusic,
        silentPlayback,
        reducedMotion: qaReducedMotion,
      }),
    [
      invitation,
      invitationId,
      frameLocale,
      guestName,
      guestToken,
      preview,
      sampleWishes,
      catalogMusic,
      silentPlayback,
      qaReducedMotion,
    ],
  );
  const latest = useRef(message);
  latest.current = message;
  const send = () =>
    frame.current?.contentWindow?.postMessage(
      latest.current,
      window.location.origin,
    );
  useEffect(() => {
    const ready = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow
      )
        return;
      if (event.data?.type === `${ANGIN_TEMPLATE_ID}:ready`) send();
      if (
        event.data?.type === `${ANGIN_TEMPLATE_ID}:locale` &&
        invitation.enabledLocales.includes(event.data.locale)
      )
        setFrameLocale(event.data.locale);
    };
    window.addEventListener("message", ready);
    return () => window.removeEventListener("message", ready);
  }, [invitation.enabledLocales]);
  useEffect(() => {
    send();
  }, [message]);
  return (
    <div
      className={
        fullPreview ? styles.full : preview ? styles.preview : styles.public
      }
    >
      <TemplateFrame
        ref={frame}
        title={`${invitation.content[frameLocale]?.people.slice(0, 2).join(" & ")} ${{ "uz-Latn": "taklifnomasi", "uz-Cyrl": "таклифномаси", en: "invitation", ru: "приглашение" }[frameLocale]}`}
        src={`/templates/${ANGIN_TEMPLATE_ID}/index.html`}
        onReady={send}
        allow="autoplay; fullscreen; clipboard-write"
        loading="eager"
      />
    </div>
  );
}
