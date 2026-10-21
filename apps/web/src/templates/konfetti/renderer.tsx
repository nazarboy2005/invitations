"use client";

import { MarxabaInvitation } from "@/templates/marxaba/renderer";
import type { Invitation, Locale } from "@taklifnoma/contracts";

export type KonfettiInvitationProps = {
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

/** Runs Konfetti's captured birthday invitation through the shared adapter. */
export function KonfettiInvitation(props: KonfettiInvitationProps) {
  return <MarxabaInvitation {...props} templateId="konfetti" />;
}
