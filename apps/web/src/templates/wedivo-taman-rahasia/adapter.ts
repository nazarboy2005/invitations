import type { Invitation, Locale } from "@taklifnoma/contracts";
import { getContent } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";

export function makeTamanPayload(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  options: { invitationId: string; guestToken?: string; preview: boolean; sampleWishes?: boolean },
) {
  const variants = Object.fromEntries(invitation.enabledLocales.map((language) => {
    const content = getContent(invitation, language);
    const data = makeLegacyData(invitation, language, guestName, options.preview && options.sampleWishes);
    return [language, { ...data, program: data.program.map((item) => ({
      ...item, description: content.programDescriptions[item.id] || "",
    })) }] as const;
  }));
  return {
    type: "wedivo-taman-rahasia:update",
    payload: {
      data: variants[locale], variants, locale,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId,
      guestName, guestToken: options.guestToken || "",
      preview: options.preview,
      deadline: invitation.rsvp.deadline,
    },
  };
}
