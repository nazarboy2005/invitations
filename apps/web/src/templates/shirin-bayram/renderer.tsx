"use client";

import type { ComponentProps } from "react";
import { defaultEventLabel, type Locale } from "@taklifnoma/contracts";
import { MarxabaInvitation } from "@/templates/marxaba";

/** Render the captured one-celebrant birthday source through Marxaba's adapter. */
export type ShirinBayramInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

export function ShirinBayramInvitation(props: ShirinBayramInvitationProps) {
  // Catalog and blank selection previews use the wedding sample fixture. This
  // birthday design presents the same sample names/date with its real event
  // label; actual authored invitation content is passed through unchanged.
  const invitation =
    props.preview && props.invitation.eventType !== "birthday"
      ? {
          ...props.invitation,
          eventType: "birthday" as const,
          content: Object.fromEntries(
            Object.entries(props.invitation.content).map(
              ([locale, content]) => [
                locale,
                {
                  ...content,
                  eventLabel:
                    content.eventLabel ===
                    defaultEventLabel(
                      props.invitation.eventType,
                      locale as Locale,
                    )
                      ? ""
                      : content.eventLabel,
                },
              ],
            ),
          ),
        }
      : props.invitation;
  return (
    <MarxabaInvitation
      {...props}
      invitation={invitation}
      templateId="shirin-bayram"
    />
  );
}
