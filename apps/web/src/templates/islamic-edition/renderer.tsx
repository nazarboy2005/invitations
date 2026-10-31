"use client";
import { publicAsset } from "../../lib/public-asset";

import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import styles from "./renderer.module.css";

type Props = { invitation: Invitation; invitationId: string; locale: Locale; guestName?: string; guestToken?: string; preview?: boolean; fullPreview?: boolean; catalogMusic?: boolean; sampleWishes?: boolean; silentPlayback?: boolean; qaReducedMotion?: boolean; qaMobile?: boolean };
const sourceLocale: Record<Locale, string> = { "uz-Latn": "uz", "uz-Cyrl": "uz-Cyrl", en: "en", ru: "ru" };

export function IslamicEditionInvitation({ invitation, invitationId, locale, guestName = "", guestToken = "", preview = false, fullPreview = false, catalogMusic = false, sampleWishes = false, silentPlayback = false, qaReducedMotion = false, qaMobile = false }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const [frameLocale, setFrameLocale] = useState(locale);
  useEffect(() => setFrameLocale(locale), [locale]);
  const message = useMemo(() => {
    const source = makeLegacyData(invitation, frameLocale, guestName, sampleWishes);
    return { ...source, locale: sourceLocale[frameLocale], defaultLang: sourceLocale[frameLocale], languages: invitation.enabledLocales.map(item => sourceLocale[item]), guestName, guestToken, music: preview && catalogMusic ? CATALOG_PREVIEW_MUSIC.url : source.music.enabled ? source.music.url : "", silentPlayback: preview && silentPlayback, catalogPreview: preview && catalogMusic, preview, apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`, rsvp: invitation.rsvp, wishesEnabled: invitation.wishes.enabled };
  }, [invitation, invitationId, frameLocale, guestName, guestToken, preview, catalogMusic, sampleWishes, silentPlayback]);
  const latest = useRef(message); latest.current = message;
  const flags = [qaReducedMotion ? "qaReducedMotion=1" : "", qaMobile ? "qaMobile=1" : ""].filter(Boolean).join("&");
  const frameUrl = publicAsset(`/templates/islamic-edition/index.html${preview && flags ? `?${flags}` : ""}`);
  useEffect(() => { frame.current?.contentWindow?.postMessage({ type: "islamic-edition:update", payload: message }, window.location.origin); }, [message]);
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "islamic-edition:language") return;
      const next = invitation.enabledLocales.find(item => sourceLocale[item] === event.data.locale);
      if (next) setFrameLocale(next);
    };
    window.addEventListener("message", onMessage); return () => window.removeEventListener("message", onMessage);
  }, [invitation.enabledLocales]);
  return <div className={`${fullPreview ? styles.full : preview ? styles.preview : styles.public}${preview && qaMobile ? ` ${styles.qaMobile}` : ""}`}><iframe ref={frame} name={JSON.stringify(message)} title={`${message.groom} & ${message.bride} — Islamic Edition`} src={frameUrl} onLoad={() => { const target = frame.current?.contentWindow; if (!target) return; target.name = JSON.stringify(latest.current); target.postMessage({ type: "islamic-edition:update", payload: latest.current }, window.location.origin); }} allow="autoplay; fullscreen" loading="eager" /></div>;
}
