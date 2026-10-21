"use client";

import type { ComponentProps } from "react";
import { MarxabaInvitation } from "@/templates/marxaba";

/** Render the captured one-celebrant Beshik source through the Marxaba adapter. */
export type BeshikInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

export function BeshikInvitation(props: BeshikInvitationProps) {
  return <MarxabaInvitation {...props} templateId="beshik" />;
}
