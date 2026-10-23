"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { makeNahorgiOshData } from "./nahorgi-osh-adapter";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
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
  sampleWishes?: boolean;
  silentPlayback?: boolean;
};

const sourceLocale: Record<Locale, string> = {
  "uz-Latn": "uz",
  "uz-Cyrl": "uz-Cyrl",
  en: "en",
  ru: "ru",
};

export function InvitateInvitation({
  invitation,
  invitationId,
  locale,
  guestName = "",
  guestToken = "",
  preview = false,
  fullPreview = false,
  catalogMusic = false,
  sampleWishes = false,
  silentPlayback = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const initialized = useRef<string | null>(null);
  const [frameLocale, setFrameLocale] = useState(locale);
  const templateId = invitation.templateId;
  useEffect(() => setFrameLocale(locale), [locale]);

  const message = useMemo(() => {
    const source = makeLegacyData(
      invitation,
      frameLocale,
      guestName,
      sampleWishes,
    );
    const hasCreatorPhotos = invitation.gallery.some((photo) =>
      photo.url.trim(),
    );
    if (
      preview &&
      sampleWishes &&
      !hasCreatorPhotos &&
      templateId === "evelina"
    ) {
      source.gallery = [
        {
          id: "evelina-source-preview",
          src: "/templates/evelina/assets/previews/template/evelina/hero.png",
          alt: "Evelina manba fotosurati",
          caption: "Evelina manba fotosurati",
        },
      ];
    }

    const languages = invitation.enabledLocales.map(
      (item) => sourceLocale[item],
    );
    const music = source.music.enabled
      ? source.music.url
      : preview && catalogMusic
        ? CATALOG_PREVIEW_MUSIC.url
        : "";
    return {
      ...source,
      catalogPreview: preview && sampleWishes,
      locale: sourceLocale[frameLocale],
      defaultLang: sourceLocale[frameLocale],
      languages,
      guestName,
      guestToken,
      music,
      preview,
      silentPlayback: preview && silentPlayback,
      apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
    };
  }, [
    catalogMusic,
    frameLocale,
    guestName,
    guestToken,
    invitation,
    invitationId,
    preview,
    sampleWishes,
    silentPlayback,
  ]);
  const nahorgiOshMessage = useMemo(
    () =>
      makeNahorgiOshData(
        invitation,
        frameLocale,
        guestName,
        guestToken,
        invitationId,
        preview,
        sampleWishes,
      ),
    [frameLocale, guestName, guestToken, invitation, invitationId, preview, sampleWishes],
  );
  const activeMessage =
    templateId === "invitate-nahorgi-osh" ? nahorgiOshMessage : message;
  const latest = useRef(activeMessage);
  latest.current = activeMessage;
  const frameUrl = `/templates/${templateId}/index.html?lang=${sourceLocale[locale]}`;

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== `${templateId}:language`
      )
        return;
      const next = invitation.enabledLocales.find(
        (enabled) => sourceLocale[enabled] === event.data.locale,
      );
      if (next) setFrameLocale(next);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [invitation.enabledLocales, templateId]);

  useEffect(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    target.postMessage(
      { type: `${templateId}:update`, payload: latest.current },
      window.location.origin,
    );
  }, [activeMessage, templateId]);

  const classes = fullPreview
    ? styles.full
    : preview
      ? styles.preview
      : styles.public;
  return (
    <div className={classes}>
      <iframe
        key={templateId}
        ref={frame}
        title={`${activeMessage.groom} & ${activeMessage.bride} invitation`}
        src={frameUrl}
        onLoad={() => {
          const target = frame.current?.contentWindow;
          if (!target) return;
          if (initialized.current !== templateId) {
            target.name = JSON.stringify(latest.current);
            target.location.replace(frameUrl);
            initialized.current = templateId;
          } else {
            target.postMessage(
              { type: `${templateId}:update`, payload: latest.current },
              window.location.origin,
            );
          }
        }}
        allow="autoplay; fullscreen; clipboard-write"
        loading="eager"
      />
    </div>
  );
}
