"use client";
import { publicAsset } from "../../lib/public-asset";

import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useEffect, useMemo, useRef } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makeTungiSaroyPayload } from "./adapter";
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

/** Same source renderer for catalog, studio and public invitations. */
export function TungiSaroyInvitation({
  invitation,
  invitationId,
  locale,
  guestName,
  guestToken,
  preview = false,
  fullPreview = false,
  catalogMusic = false,
  silentPlayback = false,
  qaReducedMotion = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const message = useMemo(() => {
    const projected = makeTungiSaroyPayload(invitation, locale, {
      invitationId,
      guestName,
      guestToken,
      preview,
      sampleWishes: preview && catalogMusic,
      silentPlayback: preview && (silentPlayback || (!catalogMusic && !fullPreview)),
      reducedMotion: qaReducedMotion,
    });
    return {
      ...projected,
      payload: {
        ...projected.payload,
        music:
          preview && catalogMusic
            ? { enabled: true, url: CATALOG_PREVIEW_MUSIC.url }
            : projected.payload.music,
      },
    };
  }, [
    invitation,
    invitationId,
    locale,
    guestName,
    guestToken,
    preview,
    catalogMusic,
    fullPreview,
    silentPlayback,
    qaReducedMotion,
  ]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => {
    frame.current?.contentWindow?.postMessage(message, window.location.origin);
  }, [message]);
  return (
    <div
      className={
        fullPreview ? styles.full : preview ? styles.preview : styles.public
      }
    >
      <iframe
        ref={frame}
        name={JSON.stringify(message)}
        src={publicAsset("/templates/taklifla-tungi-saroy/index.html")}
        title="Tungi Saroy — Taklifnoma"
        loading="eager"
        allow="autoplay"
        onLoad={() =>
          frame.current?.contentWindow?.postMessage(
            latest.current,
            window.location.origin,
          )
        }
      />
    </div>
  );
}
