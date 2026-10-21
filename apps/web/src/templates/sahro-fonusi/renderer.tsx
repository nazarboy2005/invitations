"use client";

import type { Invitation, Locale } from "@taklifnoma/contracts";
import { MarxabaInvitation } from "@/templates/marxaba/renderer";

type Props = {
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

/** Full-fidelity Sahro Fonusi capture rendered through the shared typed invitation bridge. */
export function SahroFonusiInvitation(props: Props) {
  return <MarxabaInvitation {...props} templateId="sahro-fonusi" />;
}
