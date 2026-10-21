"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import styles from "./renderer.module.css";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";

type Props = {
  invitation: Invitation;
  invitationId: string;
  locale: Locale;
  templateId: string;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  fullPreview?: boolean;
  catalogMusic?: boolean;
  silentPlayback?: boolean;
};

const sourceLocale: Record<Locale, string> = {
  "uz-Latn": "uz",
  "uz-Cyrl": "uz-Cyrl",
  en: "en",
  ru: "ru",
};

export function MarxabaInvitation({
  invitation,
  invitationId,
  locale,
  templateId,
  guestName = "",
  guestToken = "",
  preview = false,
  fullPreview = false,
  catalogMusic = false,
  silentPlayback = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const initialized = useRef(false);
  const structuralSignature = useRef("");
  const [frameLocale, setFrameLocale] = useState(locale);
  useEffect(() => setFrameLocale(locale), [locale]);
  const sourceData = useMemo(
    () => makeLegacyData(invitation, frameLocale, guestName),
    [invitation, frameLocale, guestName],
  );
  const enabledLanguages = invitation.enabledLocales.map((item) => sourceLocale[item]);
  const message = useMemo(
    () => {
      const musicUrl = sourceData.music.enabled
        ? sourceData.music.url
        : catalogMusic
          ? CATALOG_PREVIEW_MUSIC.url
          : "";
      return {
        ...sourceData,
        // Samarqand Kechasi's original runtime uses `dataTime` in its lock
        // and opening sequence; the shared contract exposes `dateTime`.
        ...(templateId === "samarqand-kechasi"
          ? { dataTime: sourceData.dateTime }
          : {}),
        voiceMessage: invitation.voiceMessage.enabled
          ? invitation.voiceMessage
          : { enabled: false, assetId: null, url: "", filename: "" },
        music: musicUrl,
        slug: preview ? "" : invitationId,
        guestToken,
        name: guestName,
        defaultLang: sourceLocale[frameLocale],
        languages: enabledLanguages,
        languageSwitcher: true,
        silentPlayback: preview && silentPlayback,
        i18n: musicUrl
          ? Object.fromEntries(
              enabledLanguages.map((language) => [language, { music: musicUrl }]),
            )
          : {},
        preview,
        status: preview ? "published" : invitation.status,
        apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
      };
    },
    [catalogMusic, enabledLanguages, frameLocale, guestName, guestToken, invitation.status, invitationId, preview, sourceData],
  );
  const frameUrl = `/templates/${encodeURIComponent(templateId)}/index.html?lang=${sourceLocale[frameLocale]}`;
  const currentStructure = JSON.stringify({
    frameUrl,
    start: invitation.startsAt,
    timezone: invitation.timezone,
    languages: enabledLanguages,
    music: message.music,
    dateTime: message.dateTime,
    dataTime: "dataTime" in message ? message.dataTime : undefined,
    voiceMessage: message.voiceMessage,
    silentPlayback: message.silentPlayback,
    rsvp: invitation.rsvp.enabled,
    wishes: invitation.wishes.enabled,
    gift: invitation.gift.enabled,
    gallery: invitation.gallery.map((item) => item.id),
  });

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== "marxaba:language" ||
        !invitation.enabledLocales.some(
          (enabled) => sourceLocale[enabled] === event.data.locale,
        )
      )
        return;
      const next = invitation.enabledLocales.find(
        (enabled) => sourceLocale[enabled] === event.data.locale,
      );
      if (next) setFrameLocale(next);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [invitation.enabledLocales]);

  useEffect(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    if (!initialized.current || structuralSignature.current !== currentStructure) {
      try {
        target.name = JSON.stringify(message);
        target.location.replace(frameUrl);
      } catch {
        target.location.replace(frameUrl);
      }
      initialized.current = true;
      structuralSignature.current = currentStructure;
      return;
    }
    target.postMessage({ type: "marxaba:update", payload: message }, window.location.origin);
  }, [currentStructure, frameUrl, message]);

  const frameClass = fullPreview
    ? styles.full
    : preview
      ? styles.preview
      : styles.public;

  return (
    <div className={frameClass}>
      <iframe
        ref={frame}
        title={`${sourceData.title || sourceData.eventType} invitation`}
        src={frameUrl}
        allow="autoplay; fullscreen"
        loading="eager"
      />
    </div>
  );
}
