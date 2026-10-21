"use client";

import type { Invitation, Locale } from "@taklifnoma/contracts";
import { MarxabaInvitation } from "@/templates/marxaba/renderer";

export type ToscanaInvitationProps = {
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

/** Toscana retains its captured scene and motion inside the shared typed renderer. */
export function ToscanaInvitation(props: ToscanaInvitationProps) {
  return <MarxabaInvitation {...props} templateId="toscana" />;
}
