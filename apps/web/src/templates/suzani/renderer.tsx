"use client";

import type { ComponentProps } from "react";
import { MarxabaInvitation } from "@/templates/marxaba";

/** Render Suzani with the shared typed Marxaba adapter and source renderer. */
export type SuzaniInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

export function SuzaniInvitation(props: SuzaniInvitationProps) {
  return <MarxabaInvitation {...props} templateId="suzani" />;
}
