"use client";

import type { ComponentProps } from "react";
import { MarxabaInvitation } from "@/templates/marxaba";

/** Render Qatlam through the shared typed adapter and its captured source renderer. */
export type QatlamInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

export function QatlamInvitation(props: QatlamInvitationProps) {
  return <MarxabaInvitation {...props} templateId="qatlam" />;
}
