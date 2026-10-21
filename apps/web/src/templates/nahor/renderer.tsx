"use client";

import type { ComponentProps } from "react";
import { defaultEventLabel, type Locale } from "@taklifnoma/contracts";
import { MarxabaInvitation } from "@/templates/marxaba";

export type NahorInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

/** Runs Nahor's captured morning-osh invitation using the shared renderer. */
export function NahorInvitation(props: NahorInvitationProps) {
  // Normalize generic preview invitations to this source's event label only;
  // creator content and persisted invitations always pass through unchanged.
  const invitation =
    props.preview && props.invitation.eventType !== "osh"
      ? {
          ...props.invitation,
          eventType: "osh" as const,
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
      templateId="nahor"
    />
  );
}
