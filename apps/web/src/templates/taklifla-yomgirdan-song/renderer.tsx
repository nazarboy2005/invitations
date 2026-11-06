"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeYomgirPayload, type YomgirOptions } from "./adapter";
import styles from "./renderer.module.css";

export type YomgirdanSongProps = YomgirOptions & {invitation: Invitation;locale: Locale;fullPreview?: boolean};

/** Private package: intentionally absent from the shared catalog and renderer routes. */
export function YomgirdanSongInvitation(props: YomgirdanSongProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const message = useMemo(() => makeYomgirPayload(props.invitation, props.locale, props), [props.invitation,props.locale,props.invitationId,props.guestName,props.guestToken,props.preview,props.sampleWishes,props.silentPlayback,props.reducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  function send() { frame.current?.contentWindow?.postMessage(latest.current, window.location.origin); }
  useEffect(send,[message]);
  return <div className={styles.frame}><iframe ref={frame}
    title={props.invitation.content[props.locale]?.title || "Yomg‘irdan so‘ng — Taklifnoma"}
    src="/templates/taklifla-yomgirdan-song/index.html" onLoad={send} allow="autoplay" /></div>;
}
