"use client";
import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeOsmonPayload, type OsmonOptions } from "./adapter";
import styles from "./renderer.module.css";

type Props = OsmonOptions & {
  invitation: Invitation;
  locale: Locale;
  fullPreview?: boolean;
  qaReducedMotion?: boolean;
};

/** Complete source renderer shared by catalog, studio and public routes. */
export function TakliflaOsmonInvitation({invitation, locale, fullPreview, qaReducedMotion, ...options}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const message = useMemo(() => makeOsmonPayload(invitation, locale, {
    ...options, fullPreview, reducedMotion: qaReducedMotion || options.reducedMotion,
  }), [invitation, locale, options.invitationId, options.guestName, options.guestToken,
    options.preview, options.catalogMusic, options.silentPlayback, options.reducedMotion, qaReducedMotion, fullPreview]);
  const latest = useRef(message);
  latest.current = message;
  const send = useCallback(() => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin), []);
  useEffect(send, [message, send]);
  useEffect(()=>{const receive=(e:MessageEvent)=>{if(e.origin===location.origin&&e.source===frame.current?.contentWindow&&e.data?.type==="taklifla-osmon:ready")send();};window.addEventListener("message",receive);return()=>window.removeEventListener("message",receive);},[send]);
  return <div className={fullPreview ? styles.full : options.preview ? styles.preview : styles.public}>
    <iframe ref={frame} title={invitation.content[locale]?.title || "Cheksiz Osmon"}
      src="/templates/taklifla-osmon/index.html" onLoad={send}
      allow="autoplay" loading="eager" />
  </div>;
}
