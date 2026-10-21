"use client";

import type { ComponentProps } from "react";
import { MarxabaInvitation } from "@/templates/marxaba";

/** Render Vals through the shared typed Marxaba invitation adapter. */
export type ValsInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

export function ValsInvitation(props: ValsInvitationProps) {
  return <MarxabaInvitation {...props} templateId="vals" />;
}
