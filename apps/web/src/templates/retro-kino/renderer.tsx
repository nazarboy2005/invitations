"use client";

import type { ComponentProps } from "react";
import { MarxabaInvitation } from "@/templates/marxaba";

/** Render Retro Kino through the shared typed Marxaba invitation adapter. */
export type RetroKinoInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

export function RetroKinoInvitation(props: RetroKinoInvitationProps) {
  return <MarxabaInvitation {...props} templateId="retro-kino" />;
}
