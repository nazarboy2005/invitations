"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeEnvelopePayload, type EnvelopeOptions } from "./adapter";
import styles from "./renderer.module.css";

export type MuhrliMaktubProps = EnvelopeOptions & {
  invitation: Invitation;
  locale: Locale;
  fullPreview?: boolean;
};

/** Private renderer; deliberately absent from every shared registry and route. */
export function MuhrliMaktubInvitation(props: MuhrliMaktubProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const message = useMemo(() => makeEnvelopePayload(props.invitation, props.locale, {
    ...props, catalogMusic: props.catalogMusic ?? props.fullPreview,
  }), [
    props.invitation, props.locale, props.invitationId, props.guestName,
    props.guestToken, props.preview, props.silentPlayback, props.catalogMusic, props.fullPreview,
  ]);
  const latest = useRef(message);
  latest.current = message;
  function send() {
    frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);
  }
  useEffect(send, [message]);
  return <div className={styles.frame}>
    <iframe ref={frame} title={props.invitation.content[props.locale]?.title || "Taklifnoma"}
      src="/templates/taklifla-muhrli-maktub/index.html" onLoad={send}
      allow="autoplay" loading="eager" />
  </div>;
}
