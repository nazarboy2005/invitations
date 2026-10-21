"use client";

import type { ComponentProps } from "react";
import { MarxabaInvitation } from "@/templates/marxaba";

export type KorporativInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

/** Runs Korporativ's captured source through the shared invitation adapter. */
export function KorporativInvitation(props: KorporativInvitationProps) {
  return <MarxabaInvitation {...props} templateId="korporativ" />;
}
