"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { TemplateFrame } from "@/templates/template-frame";
import { publicAsset } from "@/lib/public-asset";
import { makeLegacyData } from "@/templates/anor/renderer";
import { useInvitationExtras } from "@/templates/use-invitation-extras";
import { catalogPreviewMusic } from "@/modules/catalog/catalog-music";
import styles from "./renderer.module.css";

export type EInvitationProps = {
  invitation: Invitation;
  invitationId: string;
  locale: Locale;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  fullPreview?: boolean;
  catalogMusic?: boolean;
  sampleWishes?: boolean;
  silentPlayback?: boolean;
  qaReducedMotion?: boolean;
  qaMobile?: boolean;
};

export function EInvitation({ templateId, name, invitation, invitationId, locale, guestName = "", guestToken = "", preview = false, fullPreview = false, catalogMusic = false, sampleWishes = false, silentPlayback = false, qaReducedMotion = false, qaMobile = false }: EInvitationProps & { templateId: string; name: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [frameLocale, setFrameLocale] = useState(locale);
  const [ready, setReady] = useState(false);
  useEffect(() => setFrameLocale(locale), [locale]);
  const data = useMemo(() => makeLegacyData(invitation, frameLocale, guestName, sampleWishes, templateId), [invitation, frameLocale, guestName, sampleWishes, templateId]);
  const sendExtras = useInvitationExtras(frame, invitation, data, frameLocale, invitationId, guestToken, preview, ready, { receiptHostSelector: ".section-payment,.section-card,.section-gift", extraPeople: templateId !== "xatna" });
  const message = useMemo(() => ({
    ...data,
    people: invitation.content[frameLocale]?.people ?? [],
    locale: frameLocale,
    languages: invitation.enabledLocales,
    invitationId,
    guestName,
    guestToken,
    preview,
    catalogPreview: preview && catalogMusic,
    silentPlayback: preview && silentPlayback,
    apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
    music: preview && catalogMusic ? catalogPreviewMusic(invitation).url : data.music.enabled ? data.music.url : "",
  }), [data, frameLocale, invitation.content, invitation.enabledLocales, invitationId, guestName, guestToken, preview, catalogMusic, silentPlayback]);
  const latest = useRef(message); latest.current = message;
  useEffect(() => {
    const target = frame.current?.contentWindow;
    if (target) {
      target.name = JSON.stringify(message);
      target.postMessage({ type: `${templateId}:update`, payload: message }, window.location.origin);
    }
  }, [message, templateId]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === `${templateId}:ready`) setReady(true);
      if (event.data?.type === `${templateId}:language` && invitation.enabledLocales.includes(event.data.locale)) setFrameLocale(event.data.locale);
    };
    window.addEventListener("message", receive); return () => window.removeEventListener("message", receive);
  }, [templateId, invitation.enabledLocales, sendExtras]);
  const flags = new URLSearchParams();
  if (preview && qaReducedMotion) flags.set("qaReducedMotion", "1");
  const src = publicAsset(`/templates/${templateId}/index.html${flags.size ? `?${flags}` : ""}`);
  return <div className={`${fullPreview ? styles.full : preview ? styles.preview : styles.public}${preview && qaMobile ? ` ${styles.mobile}` : ""}`}>
    <TemplateFrame ref={frame} name={JSON.stringify(message)} title={`${message.groom}${message.bride ? ` & ${message.bride}` : ""} — ${name}`} src={src} onReady={() => {
      const target = frame.current?.contentWindow;
      if (target) { target.name = JSON.stringify(latest.current); target.postMessage({ type: `${templateId}:update`, payload: latest.current }, window.location.origin); }
    }} allow="autoplay; fullscreen; clipboard-write" loading="eager" />
  </div>;
}
