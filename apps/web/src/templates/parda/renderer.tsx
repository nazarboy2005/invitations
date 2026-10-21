"use client";

import type { Invitation, Locale } from "@taklifnoma/contracts";
import { MarxabaInvitation } from "@/templates/marxaba/renderer";

export type PardaInvitationProps = {
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

/** Parda retains its embroidered curtain opening and source motion in the shared typed renderer. */
export function PardaInvitation(props: PardaInvitationProps) {
  return <MarxabaInvitation {...props} templateId="parda" />;
}
