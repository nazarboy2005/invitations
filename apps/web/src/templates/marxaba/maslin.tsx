"use client";
import type { ComponentProps } from "react";
import { MarxabaInvitation } from "./renderer";
type Props = Omit<ComponentProps<typeof MarxabaInvitation>, "templateId">;
type Invitation = Props["invitation"];

function sourceOnlyFields(invitation: Invitation): Invitation {
  return {
    ...invitation,
    // Maslin has no story or additional-people section. Keep those authored
    // fields in the saved invitation while hiding them in this renderer.
    story: [],
    content: Object.fromEntries(
      Object.entries(invitation.content).map(([locale, content]) => [
        locale,
        { ...content, people: content.people.slice(0, 2) },
      ]),
    ),
    // The source has native To’yona details, but no receipt-upload control.
    gift: { ...invitation.gift, receiptUploadEnabled: false },
  };
}

/** Maslin keeps its original envelope scene and motion in the isolated Marxaba frame. */
export function MaslinInvitation(props: Props) {
  return (
    <MarxabaInvitation
      {...props}
      invitation={sourceOnlyFields(props.invitation)}
      templateId="maslin"
    />
  );
}
