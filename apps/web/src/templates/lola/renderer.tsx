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

/** Full-fidelity Lola source rendered through the shared typed adapter. */
export function LolaInvitation(props: Props) {
  return <MarxabaInvitation {...props} templateId="lola" />;
}
