"use client";
import { useCallback, useEffect, type RefObject } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import type { LegacyData } from "./anor/renderer";

// Optional shared sections live in a separate adapter, leaving captured designs intact.
export function useInvitationExtras(
  frame: RefObject<HTMLIFrameElement | null>,
  invitation: Invitation,
  data: LegacyData,
  locale: Locale,
  invitationId: string,
  guestToken: string,
  preview: boolean,
  enabled = true,
) {
  const serialized = JSON.stringify({
    data,
    locale,
    invitationId,
    guestToken,
    preview,
    receiptUploadEnabled:
      invitation.gift.enabled && invitation.gift.receiptUploadEnabled,
    extraPeople: (invitation.content[locale]?.people ?? [])
      .slice(2)
      .filter((name) => name.trim()),
  });
  const send = useCallback(() => {
    if (!enabled) return;
    const target = frame.current?.contentWindow;
    const document = frame.current?.contentDocument;
    if (!target || !document?.body) return;
    const payload = JSON.parse(serialized);
    (target as Window & { __taklifnomaExtras?: unknown }).__taklifnomaExtras =
      payload;
    if (!document.querySelector("script[data-editor-sections]")) {
      const script = document.createElement("script");
      script.dataset.editorSections = "";
      script.src = "/templates/shared/editor-sections.js";
      document.body.append(script);
    }
    target.postMessage(
      { type: "taklifnoma:editor-sections", payload },
      window.location.origin,
    );
  }, [enabled, frame, serialized]);
  useEffect(send, [send]);
  return send;
}
