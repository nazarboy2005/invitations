"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeZarhalPayload, type ZarhalOptions } from "./adapter";
import styles from "./renderer.module.css";

export type ZarhalSahifaProps = ZarhalOptions & {
  invitation: Invitation;
  locale: Locale;
  fullPreview?: boolean;
  qaReducedMotion?: boolean;
};

/** Source-derived renderer shared by preview and public invitation routes. */
export function TakliflaZarhalSahifaInvitation(props: ZarhalSahifaProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [locale, setLocale] = useState(props.locale);
  useEffect(() => setLocale(props.locale), [props.locale]);
  const message = useMemo(() => makeZarhalPayload(props.invitation, locale, {
    ...props, reducedMotion: props.qaReducedMotion ?? props.reducedMotion,
  }), [props, locale]);
  const latest = useRef(message);
  latest.current = message;
  const send = useCallback(() => {
    frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);
  }, []);
  useEffect(send, [message, send]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "zarhal-sahifa:ready") send();
      if (event.data?.type === "zarhal-sahifa:language" && props.invitation.enabledLocales.includes(event.data.locale)) setLocale(event.data.locale);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [props.invitation.enabledLocales, send]);
  return <div className={props.fullPreview ? styles.full : props.preview ? styles.preview : styles.public}>
    <iframe ref={frame} src="/templates/taklifla-zarhal-sahifa/index.html"
      title={message.payload.variants[message.payload.locale]?.title || "Taklifnoma"}
      onLoad={send} allow="autoplay; fullscreen" loading="eager" />
  </div>;
}
