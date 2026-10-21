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

/** Full-fidelity Ko‘zgu capture bridged through the shared typed invitation renderer. */
export function KozguInvitation(props: Props) {
  return <MarxabaInvitation {...props} templateId="kozgu" />;
}
