"use client";

import type { Invitation, Locale } from "@taklifnoma/contracts";
import { MarxabaInvitation } from "@/templates/marxaba/renderer";

export type MonogramInvitationProps = {
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

/** Monogram's captured source runs through the shared Marxaba contract bridge. */
export function MonogramInvitation(props: MonogramInvitationProps) {
  return <MarxabaInvitation {...props} templateId="monogram" />;
}
