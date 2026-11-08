"use client";
import { TemplateFrame } from "@/templates/template-frame";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeMeltingRealityPayload, type MeltingOptions } from "./adapter";
import styles from "./renderer.module.css";

type Props = MeltingOptions & { invitation: Invitation; locale: Locale; fullPreview?: boolean; qaMobile?: boolean };

export function WedivoMeltingRealityInvitation({ invitation, locale, fullPreview = false, qaMobile = false, ...options }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [frameLocale, setFrameLocale] = useState(locale);
  useEffect(() => setFrameLocale(locale), [locale]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "wedivo-melting-reality:locale") return;
      const next = event.data.locale as Locale;
      if (!invitation.enabledLocales.includes(next)) return;
      setFrameLocale(next);
      if (!options.preview) { const url = new URL(location.href); url.searchParams.set("lang", next); history.replaceState(null, "", url); }
    };
    addEventListener("message", receive);
    return () => removeEventListener("message", receive);
  }, [invitation.enabledLocales, options.preview]);
  const message = useMemo(() => makeMeltingRealityPayload(invitation, frameLocale, options), [invitation, frameLocale, options.invitationId, options.guestName, options.guestToken, options.preview, options.catalogMusic, options.sampleWishes, options.silentPlayback, options.qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => {
    frame.current?.contentWindow?.postMessage(message, window.location.origin);
  }, [message]);
  return <div className={`${fullPreview ? styles.full : options.preview ? styles.preview : styles.public}${qaMobile && options.preview ? ` ${styles.mobile}` : ""}`}>
    <TemplateFrame ref={frame} title={invitation.content[frameLocale]?.people.filter(Boolean).join(" & ") || "Tush va haqiqat"}
      src="/templates/wedivo-melting-reality/index.html"
      onReady={() => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin)}
      allow="autoplay; fullscreen; clipboard-write" loading="eager" />
  </div>;
}
