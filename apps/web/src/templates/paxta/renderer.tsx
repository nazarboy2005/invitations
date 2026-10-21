"use client";

import type { Invitation, Locale } from "@taklifnoma/contracts";
import { MarxabaInvitation } from "@/templates/marxaba/renderer";

export type PaxtaInvitationProps = {
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

/** Paxta keeps its captured source in an isolated frame behind the shared adapter. */
export function PaxtaInvitation(props: PaxtaInvitationProps) {
  return <MarxabaInvitation {...props} templateId="paxta" />;
}
