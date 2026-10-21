"use client";

import type { ComponentProps } from "react";
import { MarxabaInvitation } from "@/templates/marxaba";

/** Run Bitiruv's captured one-person graduation design in the shared renderer. */
export type BitiruvInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

export function BitiruvInvitation(props: BitiruvInvitationProps) {
  return <MarxabaInvitation {...props} templateId="bitiruv" />;
}
