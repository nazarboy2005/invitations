"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeEternalRosePayload } from "./adapter";
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
  qaMobile?: boolean;
};

export function WedivoEternalRoseGarden({ fullPreview = false, qaMobile = false, ...props }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const message = useMemo(() => makeEternalRosePayload(props.invitation, props.locale, props), [props.invitation, props.locale, props.invitationId, props.guestName, props.guestToken, props.preview, props.sampleWishes, props.catalogMusic, props.silentPlayback, props.qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  const send = () => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);
  useEffect(send, [message]);
  const mode = fullPreview ? styles.full : props.preview ? styles.preview : styles.public;
  return <div className={`${mode}${qaMobile && props.preview ? ` ${styles.mobile}` : ""}`}>
    <iframe ref={frame} title={props.invitation.content[props.locale]?.title || "So‘lmas atirgullar"} src="/templates/wedivo-eternal-rose-garden/index.html" onLoad={send} allow="autoplay; fullscreen; clipboard-write" loading="eager" />
  </div>;
}
