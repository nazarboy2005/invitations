"use client";

import type { ComponentProps } from "react";
import { MarxabaInvitation } from "@/templates/marxaba";

/** Render Doira through the shared typed adapter and its captured source renderer. */
export type DoiraInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

export function DoiraInvitation(props: DoiraInvitationProps) {
  return <MarxabaInvitation {...props} templateId="doira" />;
}
