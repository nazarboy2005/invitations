"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import styles from "./renderer.module.css";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";

export type ChavandozInvitationProps = {
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

/** Runs the captured Chavandoz document in the same-origin platform bridge. */
export function ChavandozInvitation({
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
}: ChavandozInvitationProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const initialized = useRef(false);
  const signature = useRef("");
  const [frameLocale, setFrameLocale] = useState(locale);
  useEffect(() => setFrameLocale(locale), [locale]);

  const message = useMemo(() => {
    const active = makeLegacyData(invitation, frameLocale, guestName, sampleWishes);
    const musicUrl = active.music.enabled
      ? active.music.url
      : catalogMusic
        ? CATALOG_PREVIEW_MUSIC.url
        : "";
    const enrich = (data: ReturnType<typeof makeLegacyData>) => ({
      ...data,
      // Chavandoz is a one-celebrant reference. The shared invitation contract
      // stores people in order; this source-only alias keeps creator data intact.
      extras: { celebrant: data.groom || data.bride },
      music: musicUrl,
      slug: preview ? "" : invitationId,
      guestToken,
      name: guestName,
      defaultLang: sourceLocale[frameLocale],
      languages: invitation.enabledLocales.map((item) => sourceLocale[item]),
      languageSwitcher: true,
      silentPlayback: preview && silentPlayback,
      preview,
      status: preview ? "published" : invitation.status,
      apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
    });
    return {
      ...enrich(active),
      i18n: Object.fromEntries(
        invitation.enabledLocales.map((enabledLocale) => {
          const localized = makeLegacyData(invitation, enabledLocale, guestName, sampleWishes);
          return [sourceLocale[enabledLocale], enrich(localized)];
        }),
      ),
    };
  }, [catalogMusic, frameLocale, guestName, guestToken, invitation, invitationId, preview, sampleWishes, silentPlayback]);

  const frameUrl = `/templates/chavandoz/index.html?lang=${sourceLocale[frameLocale]}`;
  const structure = JSON.stringify({
    frameUrl,
    startsAt: invitation.startsAt,
    timezone: invitation.timezone,
    locales: invitation.enabledLocales,
    music: message.music,
    silentPlayback: message.silentPlayback,
    rsvp: invitation.rsvp.enabled,
    wishes: invitation.wishes.enabled,
    gift: invitation.gift.enabled,
    gallery: invitation.gallery.map((item) => item.id),
  });
  const initialUrl = useRef(frameUrl);
  const latestMessage = useRef(message);
  latestMessage.current = message;

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "marxaba:language") return;
      const next = invitation.enabledLocales.find((item) => sourceLocale[item] === event.data.locale);
      if (next) setFrameLocale(next);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [invitation.enabledLocales]);

  useEffect(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    if (!initialized.current || signature.current !== structure) {
      target.name = JSON.stringify(message);
      target.location.replace(frameUrl);
      initialized.current = true;
      signature.current = structure;
      return;
    }
    target.postMessage({ type: "marxaba:update", payload: message }, window.location.origin);
  }, [frameUrl, message, structure]);

  const className = fullPreview ? styles.full : preview ? styles.preview : styles.public;
  return (
    <div className={className}>
      <iframe
        ref={frame}
        title={`${message.title || message.eventType} invitation`}
        src={initialUrl.current}
        allow="autoplay; fullscreen"
        loading="eager"
        onLoad={() => frame.current?.contentWindow?.postMessage({ type: "marxaba:update", payload: latestMessage.current }, window.location.origin)}
      />
    </div>
  );
}
