"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import styles from "./renderer.module.css";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { useInvitationExtras } from "../use-invitation-extras";

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
  sampleWishes?: boolean;
  silentPlayback?: boolean;
  qaReducedMotion?: boolean;
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
  qaReducedMotion = false,
  sampleWishes = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const initialized = useRef(false);
  const structuralSignature = useRef("");
  const [frameLocale, setFrameLocale] = useState(locale);
  useEffect(() => setFrameLocale(locale), [locale]);
  const sourceData = useMemo(
    () => makeLegacyData(invitation, frameLocale, guestName, sampleWishes),
    [invitation, frameLocale, guestName, sampleWishes],
  );
  const sendExtras = useInvitationExtras(
    frame,
    invitation,
    sourceData,
    frameLocale,
    invitationId,
    guestToken,
    preview,
  );
  const enabledLanguages = invitation.enabledLocales.map(
    (item) => sourceLocale[item],
  );
  const message = useMemo(() => {
    const musicUrl = sourceData.music.enabled
      ? sourceData.music.url
      : catalogMusic
        ? CATALOG_PREVIEW_MUSIC.url
        : "";
    return {
      ...sourceData,
      // Several captured single-celebrant designs bind this source-only
      // slot. The shared contract's first person remains the source of truth.
      extras: { celebrant: sourceData.groom || sourceData.bride },
      ...(templateId === "bitiruv"
        ? { monogram: (sourceData.groom || sourceData.bride).trim().charAt(0) }
        : {}),
      // Samarqand Kechasi's original runtime uses `dataTime` in its lock
      // and opening sequence; the shared contract exposes `dateTime`.
      ...(templateId === "samarqand-kechasi"
        ? { dataTime: sourceData.dateTime }
        : {}),
      music: musicUrl,
      slug: preview ? "" : invitationId,
      rsvpDetails: invitation.rsvp,
      wishesEnabled: invitation.wishes.enabled,
      guestToken,
      name: guestName,
      defaultLang: sourceLocale[frameLocale],
      languages: enabledLanguages,
      languageSwitcher: true,
      silentPlayback: preview && silentPlayback,
      i18n: Object.fromEntries(
        invitation.enabledLocales.map((enabledLocale) => {
          const localized = makeLegacyData(
            invitation,
            enabledLocale,
            guestName,
            sampleWishes,
          );
          return [
            sourceLocale[enabledLocale],
            {
              // Some captured scripts build their opening name art from this
              // map, while the shared runtime uses program titles during its
              // first render. Keep both aligned with the active language.
              groom: localized.groom,
              bride: localized.bride,
              extras: { celebrant: localized.groom || localized.bride },
              ...(templateId === "bitiruv"
                ? {
                    monogram: (localized.groom || localized.bride)
                      .trim()
                      .charAt(0),
                  }
                : {}),
              program: localized.program,
              music: musicUrl,
            },
          ];
        }),
      ),
      preview,
      status: preview ? "published" : invitation.status,
      apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
    };
  }, [
    catalogMusic,
    enabledLanguages,
    frameLocale,
    guestName,
    guestToken,
    invitation.enabledLocales,
    invitation.status,
    invitationId,
    preview,
    sampleWishes,
    sourceData,
  ]);
  const latestMessage = useRef(message);
  latestMessage.current = message;
  const frameUrl = `/templates/${encodeURIComponent(templateId)}/index.html?lang=${sourceLocale[frameLocale]}${preview && qaReducedMotion ? "&qaReducedMotion=1" : ""}`;
  const currentStructure = JSON.stringify({
    frameUrl,
    start: invitation.startsAt,
    timezone: invitation.timezone,
    languages: enabledLanguages,
    music: message.music,
    dateTime: message.dateTime,
    dataTime: "dataTime" in message ? message.dataTime : undefined,
    silentPlayback: message.silentPlayback,
    rsvp: invitation.rsvp.enabled,
    wishes: invitation.wishes.enabled,
    gift: invitation.gift.enabled,
    gallery: invitation.gallery.map((item) => item.id),
  });
  // Keep React's iframe src stable. Locale changes are already handled by the
  // explicit replace below, after the latest locale data has been put in
  // window.name; updating both src and location at once can race and drop data.
  const initialFrameUrl = useRef(frameUrl);

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
    if (
      !initialized.current ||
      structuralSignature.current !== currentStructure
    ) {
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
    target.postMessage(
      { type: "marxaba:update", payload: message },
      window.location.origin,
    );
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
        src={initialFrameUrl.current}
        onLoad={() => {
          sendExtras();
          frame.current?.contentWindow?.postMessage(
            { type: "marxaba:update", payload: latestMessage.current },
            window.location.origin,
          );
        }}
        allow="autoplay; fullscreen"
        loading="eager"
      />
    </div>
  );
}
