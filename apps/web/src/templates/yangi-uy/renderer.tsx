"use client";

import type { ComponentProps } from "react";
import { defaultEventLabel, type Locale } from "@taklifnoma/contracts";
import { MarxabaInvitation } from "@/templates/marxaba";

export type YangiUyInvitationProps = Omit<
  ComponentProps<typeof MarxabaInvitation>,
  "templateId"
>;

const previewEventLabels: Record<Locale, string> = {
  "uz-Latn": "Yangi uy to‘yi",
  "uz-Cyrl": "Янги уй тўйи",
  en: "Housewarming celebration",
  ru: "Новоселье",
};

/** Run the captured housewarming design through the shared invitation renderer. */
export function YangiUyInvitation(props: YangiUyInvitationProps) {
  const invitation = props.preview
    ? {
        ...props.invitation,
        content: Object.fromEntries(
          Object.entries(props.invitation.content).map(([key, content]) => {
            const locale = key as Locale;
            return [
              key,
              {
                ...content,
                eventLabel:
                  content.eventLabel ===
                  defaultEventLabel(props.invitation.eventType, locale)
                    ? previewEventLabels[locale]
                    : content.eventLabel,
              },
            ];
          }),
        ),
      }
    : props.invitation;

  return (
    <MarxabaInvitation
      {...props}
      invitation={invitation}
      templateId="yangi-uy"
    />
  );
}
