"use client";

import type { Invitation, Locale } from "@taklifnoma/contracts";
import { MarxabaInvitation } from "@/templates/marxaba/renderer";

export type QizBazmiInvitationProps = {
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

/** Qiz Bazmi retains its captured henna celebration opening and source animation in the shared typed renderer. */
export function QizBazmiInvitation(props: QizBazmiInvitationProps) {
  return <MarxabaInvitation {...props} templateId="qiz-bazmi" />;
}
