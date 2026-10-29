"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeBarakaliPayload, type BarakaliOptions } from "./adapter";
import styles from "./renderer.module.css";

export type BarakaliProps = BarakaliOptions & { invitation: Invitation; locale: Locale; fullPreview?: boolean };

/** Exact source renderer shared by catalog, studio and public display. */
export function TakliflaBarakali({ invitation, locale, fullPreview, ...options }: BarakaliProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const message = useMemo(() => makeBarakaliPayload(invitation, locale, options), [invitation, locale,
    options.invitationId, options.guestName, options.guestToken, options.preview, options.sampleWishes,
    options.catalogMusic, options.silentPlayback, options.qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  const send = () => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);
  useEffect(() => {
    send();
    const ready = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === "taklifla-barakali:ready") send();
    };
    window.addEventListener("message", ready);
    return () => window.removeEventListener("message", ready);
  }, [message]);
  return <div className={options.preview && !fullPreview ? styles.preview : styles.full}>
    <iframe ref={frame} src="/templates/taklifla-barakali/index.html" title={invitation.content[locale]?.title || "Barakali"}
      onLoad={send} allow="autoplay" loading="eager" />
  </div>;
}
