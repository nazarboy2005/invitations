"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { useInvitationExtras } from "@/templates/use-invitation-extras";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { isChorloveTemplate } from "./registry";
import styles from "./renderer.module.css";

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
  qaMobile?: boolean;
};

const sourceLocale: Record<Locale, string> = {
  "uz-Latn": "uz-Latn",
  "uz-Cyrl": "uz-Cyrl",
  en: "en",
  ru: "ru",
};

export function ChorloveInvitation({
  invitation,
  invitationId,
  locale,
  templateId,
  guestName = "",
  guestToken = "",
  preview = false,
  fullPreview = false,
  catalogMusic = false,
  sampleWishes = false,
  silentPlayback = false,
  qaReducedMotion = false,
  qaMobile = false,
}: Props) {
  if (!isChorloveTemplate(templateId)) {
    throw new Error(`Unknown Chorlove template: ${templateId}`);
  }

  const frame = useRef<HTMLIFrameElement>(null);
  const [frameLocale, setFrameLocale] = useState(locale);
  useEffect(() => setFrameLocale(locale), [locale]);

  const data = useMemo(() => {
    const mapped = makeLegacyData(invitation, frameLocale, guestName, sampleWishes);
    if (templateId === "orchid-amplop") {
      const hasCreatorPhotos = invitation.gallery.some((photo) => photo.url.trim());
      if (preview && sampleWishes && !hasCreatorPhotos) {
        mapped.gallery = [
          "gallery-2.webp",
          "gallery-1.webp",
          "gallery-3.webp",
          "gallery-6.webp",
          "gallery-4.webp",
          "gallery-5.webp",
        ].map((file, index) => ({
          id: `orchid-preview-${index + 1}`,
          src: `/templates/chorlove/orchid-amplop/assets/${file}`,
          alt: "",
          caption: "",
        }));
      }
    } else if (templateId === "lace") {
      const hasCreatorPhotos = invitation.gallery.some((photo) => photo.url.trim());
      if (preview && sampleWishes && !hasCreatorPhotos) {
        mapped.gallery = ["gallery-2.webp", "gallery-1.webp", "gallery-3.webp", "gallery-6.webp", "gallery-4.webp", "gallery-5.webp"].map((file, index) => ({
          id: `lace-preview-${index + 1}`,
          src: `/templates/lace/assets/${file}`,
          alt: "",
          caption: "",
        }));
      }
    }
    return mapped;
  }, [invitation, frameLocale, guestName, sampleWishes, preview, templateId]);
  const sendExtras = useInvitationExtras(
    frame,
    invitation,
    data,
    frameLocale,
    invitationId,
    guestToken,
    preview,
    true,
    templateId === "palov"
      ? {
          story: false,
          dressCode: false,
          extraPeople: false,
        }
      : templateId === "orchid-amplop"
      ? {
          dressCode: false,
          extraPeople: false,
          receiptHostSelector: "[data-orchid-receipt-host]",
        }
      : templateId === "palace-rose"
        ? {
            story: false,
            dressCode: false,
            extraPeople: false,
            receiptHostSelector: "[data-pr-gift-receipt-host]",
          }
      : templateId === "green-gold"
        ? {
            story: false,
            dressCode: false,
            extraPeople: false,
          }
      : undefined,
  );
  const message = useMemo(() => {
    const music = catalogMusic
      ? CATALOG_PREVIEW_MUSIC.url
      : data.music.enabled
        ? data.music.url
        : "";
    return {
      type: `${templateId}:update`,
      payload: {
        data: {
          ...data,
          music: { enabled: Boolean(music), url: music },
        },
        templateId,
        locale: frameLocale,
        sampleGallery: templateId === "orchid-amplop" && preview && sampleWishes,
        enabledLocales: invitation.enabledLocales,
        invitationId,
        guestName,
        guestToken,
        preview,
        catalogMusic,
        silentPlayback: preview && silentPlayback,
        reducedMotion: preview && qaReducedMotion,
        mobile: preview && qaMobile,
      },
    };
  }, [
    catalogMusic,
    data,
    frameLocale,
    guestName,
    guestToken,
    invitation.enabledLocales,
    invitationId,
    preview,
    qaMobile,
    qaReducedMotion,
    silentPlayback,
    templateId,
  ]);
  const latest = useRef(message);
  latest.current = message;

  const query = new URLSearchParams({ lang: sourceLocale[frameLocale] });
  if (preview && qaReducedMotion) query.set("qaReducedMotion", "1");
  const namespaced = templateId === "palov" || templateId === "orchid-amplop";
  const frameUrl = namespaced
    ? `/templates/chorlove/${templateId}/index.html?${query}`
    : `/templates/${templateId}/index.html?${query}`;

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== `${templateId}:language`
      ) return;
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
    target.postMessage(latest.current, window.location.origin);
    sendExtras();
  }, [message, sendExtras]);

  const mode = fullPreview ? styles.full : preview ? styles.preview : styles.public;
  return (
    <div className={`${mode}${preview && qaMobile ? ` ${styles.qaMobile}` : ""}`}>
      <iframe
        key={templateId}
        ref={frame}
        title={`${data.groom} & ${data.bride} invitation`}
        src={frameUrl}
        onLoad={() => {
          const target = frame.current?.contentWindow;
          if (!target) return;
          target.name = JSON.stringify(latest.current);
          target.postMessage(latest.current, window.location.origin);
          sendExtras();
        }}
        allow="autoplay; fullscreen; clipboard-write"
        loading="eager"
      />
    </div>
  );
}
