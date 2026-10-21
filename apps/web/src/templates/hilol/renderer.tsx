"use client";

import { MarxabaInvitation } from "@/templates/marxaba/renderer";
import type { Invitation, Locale } from "@taklifnoma/contracts";

export type HilolInvitationProps = {
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

/** Runs Hilol's captured iftar invitation through the shared typed adapter. */
export function HilolInvitation(props: HilolInvitationProps) {
  return <MarxabaInvitation {...props} templateId="hilol" />;
}