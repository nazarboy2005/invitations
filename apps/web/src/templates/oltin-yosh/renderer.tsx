"use client";

import { MarxabaInvitation } from "@/templates/marxaba/renderer";
import type { Invitation, Locale } from "@taklifnoma/contracts";

export type OltinYoshInvitationProps = {
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

/** Runs Oltin Yosh's captured birthday invitation through the shared adapter. */
export function OltinYoshInvitation(props: OltinYoshInvitationProps) {
  return <MarxabaInvitation {...props} templateId="oltin-yosh" />;
}
