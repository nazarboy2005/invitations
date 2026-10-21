"use client";

import type { ComponentProps } from "react";
import { MarxabaInvitation } from "@/templates/marxaba";

/** Render the captured Shahzoda source through the shared invitation adapter. */
export type ShahzodaInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

export function ShahzodaInvitation(props: ShahzodaInvitationProps) {
  // The canonical catalog fixture describes a wedding. For this Sunnat-only
  // design, keep its sample people/date but use this template's actual event
  // label in the empty catalog preview. Authored Sunnat labels pass through.
  const invitation =
    props.preview && props.invitation.eventType !== "sunnat-toyi"
      ? {
          ...props.invitation,
          eventType: "sunnat-toyi" as const,
          content: Object.fromEntries(
            Object.entries(props.invitation.content).map(([locale, content]) => [
              locale,
              { ...content, eventLabel: "" },
            ]),
          ),
        }
      : props.invitation;
  return (
    <MarxabaInvitation
      {...props}
      invitation={invitation}
      templateId="shahzoda"
    />
  );
}
