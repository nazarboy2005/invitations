"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeAsalariPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = { invitation: Invitation; invitationId: string; locale: Locale; guestName?: string; guestToken?: string; preview?: boolean; fullPreview?: boolean; sampleWishes?: boolean; silentPlayback?: boolean; qaReducedMotion?: boolean };

/** Private renderer: intentionally not registered in shared catalog or routing. */
export function TakliflaAsalari({ invitation, invitationId, locale, guestName = "", guestToken = "", preview = false, fullPreview = false, sampleWishes = false, silentPlayback = true, qaReducedMotion = false }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const message = useMemo(() => makeAsalariPayload(invitation, locale, guestName, { invitationId, guestToken, preview, sampleWishes, silentPlayback, reducedMotion: qaReducedMotion }), [invitation, invitationId, locale, guestName, guestToken, preview, sampleWishes, silentPlayback, qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  const send = () => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);
  useEffect(() => { send(); }, [message]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <iframe ref={frame} src="/templates/taklifla-asalari/index.html" title={invitation.content[locale]?.title || "Asalari"} onLoad={send} allow="autoplay" />
  </div>;
}
