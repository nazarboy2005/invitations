"use client";
import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeGulbogPayload, type GulbogOptions } from "./adapter";
import styles from "./renderer.module.css";

type Props = GulbogOptions & { invitation: Invitation; locale: Locale; fullPreview?: boolean };

/** Complete source renderer shared by catalog, studio and public display. */
export function TakliflaGulbog({ invitation, locale, fullPreview, ...options }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const message = useMemo(() => makeGulbogPayload(invitation, locale, options), [
    invitation, locale, options.invitationId, options.guestName, options.guestToken,
    options.preview, options.catalogMusic, options.silentPlayback, options.qaReducedMotion,
  ]);
  const latest = useRef(message);
  latest.current = message;
  const send = () => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);
  useEffect(send, [message]);
  return <div className={fullPreview ? styles.full : options.preview ? styles.preview : styles.public}>
    <iframe ref={frame} title={locale === "en" ? "Gulbog‘ invitation" : locale === "ru" ? "Приглашение Гулбог" : locale === "uz-Cyrl" ? "Гулбоғ таклифномаси" : "Gulbog‘ taklifnomasi"}
      src="/templates/taklifla-gulbog/index.html" onLoad={send} allow="autoplay" />
  </div>;
}
