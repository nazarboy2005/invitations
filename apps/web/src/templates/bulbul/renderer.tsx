"use client";

import type { ComponentProps } from "react";
import { MarxabaInvitation } from "@/templates/marxaba";

/** Render Bulbul with the shared typed adapter and its captured source renderer. */
export type BulbulInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

export function BulbulInvitation(props: BulbulInvitationProps) {
  return <MarxabaInvitation {...props} templateId="bulbul" />;
}
