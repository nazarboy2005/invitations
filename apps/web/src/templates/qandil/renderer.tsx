"use client";

import type { Invitation, Locale } from "@taklifnoma/contracts";
import { MarxabaInvitation } from "@/templates/marxaba/renderer";

export type QandilInvitationProps = {
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

/** Qandil keeps its captured lantern scene and lighting effects in the shared typed renderer. */
export function QandilInvitation(props: QandilInvitationProps) {
  return <MarxabaInvitation {...props} templateId="qandil" />;
}
