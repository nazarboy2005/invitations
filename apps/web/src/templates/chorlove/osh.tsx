"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import styles from "./renderer.module.css";

type Props = {
  invitation: Invitation;
  invitationId: string;
  locale: Locale;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  catalogMusic?: boolean;
  fullPreview?: boolean;
  qaReducedMotion?: boolean;
  qaMobile?: boolean;
};

export function ChorloveOshInvitation({
  invitation,
  invitationId,
  locale,
  guestName = "",
  guestToken = "",
  preview = false,
  catalogMusic = false,
  fullPreview = false,
  qaReducedMotion = false,
  qaMobile = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const data = useMemo(() => {
    const mapped = makeLegacyData(invitation, locale, guestName);
    const localizedOshTitle: Record<Locale, string> = {
      "uz-Latn": "Nahorgi osh",
      "uz-Cyrl": "Наҳорги ош",
      en: "Morning osh",
      ru: "Утренний ош",
    };
    return {
      ...mapped,
      title: invitation.content[locale]?.eventLabel.trim() || localizedOshTitle[locale],
      ...(catalogMusic
        ? { music: { enabled: true, url: CATALOG_PREVIEW_MUSIC.url } }
        : {}),
    };
  }, [invitation, locale, guestName, catalogMusic]);
  const payload = useMemo(() => ({
    type: "osh:update",
    payload: {
      data,
      locale,
      enabledLocales: invitation.enabledLocales,
      invitationId,
      guestName,
      guestToken,
      preview,
      reducedMotion: preview && qaReducedMotion,
    },
  }), [data, enabledLocalesKey(invitation.enabledLocales), guestName, guestToken, invitationId, locale, preview, qaReducedMotion]);
  const latest = useRef(payload);
  latest.current = payload;

  useEffect(() => {
    const target = frame.current?.contentWindow;
    if (target) target.postMessage(payload, window.location.origin);
  }, [payload]);

  return (
    <div className={`${fullPreview ? styles.full : preview ? styles.preview : styles.public}${preview && qaMobile ? ` ${styles.qaMobile}` : ""}`}>
      <iframe
        ref={frame}
        title={`${data.groom} ${data.bride} Nahorgi osh taklifnomasi`}
        src="/templates/chorlove/osh/index.html"
        onLoad={() => frame.current?.contentWindow?.postMessage(latest.current, window.location.origin)}
        allow="autoplay; fullscreen"
        loading="eager"
      />
    </div>
  );
}

function enabledLocalesKey(locales: Locale[]) {
  return locales.join(",");
}
