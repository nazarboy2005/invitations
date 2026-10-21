"use client";

import type { ComponentProps } from "react";
import { defaultEventLabel, type Locale } from "@taklifnoma/contracts";
import { MarxabaInvitation } from "@/templates/marxaba";

export type NahorgiOshInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

/** Runs Nahorgi Osh's captured source through the shared invitation adapter. */
export function NahorgiOshInvitation(props: NahorgiOshInvitationProps) {
  // The shared catalog fixture is a wedding. Show the template's morning-osh
  // sample label in preview while leaving creator-authored event data intact.
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
      templateId="nahorgi-osh"
    />
  );
}
