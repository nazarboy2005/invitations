"use client";
import { publicAsset } from "../../lib/public-asset";

import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makeXonadonPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = {
  invitation: Invitation;
  invitationId: string;
  locale: Locale;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  fullPreview?: boolean;
  catalogMusic?: boolean;
  silentPlayback?: boolean;
  qaReducedMotion?: boolean;
};

/** Exact source renderer shared by catalog, studio and public display. */
export function TakliflaFayzliXonadonInvitation({
  invitation, invitationId, locale, guestName, guestToken,
  preview = false, fullPreview = false, catalogMusic = false,
  silentPlayback = false, qaReducedMotion = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const [activeLocale, setActiveLocale] = useState(locale);
  useEffect(() => setActiveLocale(locale), [locale]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow ||
          event.data?.type !== "taklifla-fayzli-xonadon:locale") return;
      const next = event.data.locale as Locale;
      if (!invitation.enabledLocales.includes(next)) return;
      setActiveLocale(next);
      if (!preview) {
        const url = new URL(location.href); url.searchParams.set("lang", next);
        history.replaceState(null, "", url);
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [invitation.enabledLocales, preview]);
  const message = useMemo(() => {
    const value = makeXonadonPayload(invitation, activeLocale, {
      invitationId, guestName, guestToken, preview,
      silentPlayback: silentPlayback || (!catalogMusic && !fullPreview),
      reducedMotion: qaReducedMotion,
    });
    return { ...value, payload: { ...value.payload,
      music: preview && catalogMusic
        ? { enabled: true, url: CATALOG_PREVIEW_MUSIC.url } : value.payload.music,
    } };
  }, [invitation, invitationId, activeLocale, guestName, guestToken, preview,
    catalogMusic, fullPreview, silentPlayback, qaReducedMotion]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => {
    frame.current?.contentWindow?.postMessage(message, window.location.origin);
  }, [message]);
  return <div className={fullPreview ? styles.full : preview ? styles.preview : styles.public}>
    <iframe ref={frame} name={JSON.stringify(message)}
      src={publicAsset("/templates/taklifla-fayzli-xonadon/index.html")}
      title={`${message.payload.content.hosts || "Fayzli Xonadon"} — taklifnoma`}
      onLoad={() => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin)}
      allow="autoplay" loading="eager" />
  </div>;
}
