"use client";
import { TemplateFrame } from "@/templates/template-frame";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeRiwayatPayload } from "./adapter";
import styles from "./renderer.module.css";

type Props = {
  invitation: Invitation;
  invitationId: string;
  locale: Locale;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  fullPreview?: boolean;
  sampleWishes?: boolean;
  catalogMusic?: boolean;
  silentPlayback?: boolean;
  qaReducedMotion?: boolean;
};

/** One source renderer for creator preview, catalog and public invitations. */
export function WedivoRiwayatObrolanInvitation({
  invitation,
  invitationId,
  locale,
  guestName = "",
  guestToken = "",
  preview = false,
  fullPreview = false,
  sampleWishes = false,
  catalogMusic = false,
  silentPlayback = false,
  qaReducedMotion = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const message = useMemo(
    () =>
      makeRiwayatPayload(invitation, locale, guestName, {
        invitationId,
        guestToken,
        preview,
        sampleWishes,
        catalogMusic,
        silentPlayback,
        reducedMotion: qaReducedMotion,
      }),
    [
      invitation,
      invitationId,
      locale,
      guestName,
      guestToken,
      preview,
      sampleWishes,
      catalogMusic,
      silentPlayback,
      qaReducedMotion,
    ],
  );
  const latest = useRef(message);
  latest.current = message;
  const send = useCallback(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    target.name = JSON.stringify(latest.current);
    target.postMessage(latest.current, window.location.origin);
  }, []);
  useEffect(send, [message, send]);
  return (
    <div
      className={
        fullPreview ? styles.full : preview ? styles.preview : styles.public
      }
    >
      <TemplateFrame
        ref={frame}
        name={JSON.stringify(message)}
        title={`${message.payload.data.groom} & ${message.payload.data.bride} ${{ "uz-Latn": "taklifnomasi", "uz-Cyrl": "таклифномаси", en: "invitation", ru: "приглашение" }[locale]}`}
        src="/templates/wedivo-riwayat-obrolan/index.html"
        onReady={send}
        allow="autoplay; fullscreen; clipboard-write"
        loading="eager"
      />
    </div>
  );
}
