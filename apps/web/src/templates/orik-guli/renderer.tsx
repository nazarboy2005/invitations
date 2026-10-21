"use client";

import type { Invitation, Locale } from "@taklifnoma/contracts";
import { MarxabaInvitation } from "@/templates/marxaba/renderer";

export type OrikGuliInvitationProps = {
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

/** O‘rik Guli's captured source uses the shared Marxaba contract adapter. */
export function OrikGuliInvitation(props: OrikGuliInvitationProps) {
  return <MarxabaInvitation {...props} templateId="orik-guli" />;
}
