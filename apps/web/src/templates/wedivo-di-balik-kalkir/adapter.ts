import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";

/** Narrow source bridge. The captured DOM and motion code remain isolated in its frame. */
export function makeWedivoPayload(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  options: {
    invitationId: string;
    guestToken?: string;
    preview: boolean;
    sampleWishes?: boolean;
  },
) {
  const data = makeLegacyData(
    invitation,
    locale,
    guestName,
    options.sampleWishes,
  );
  const content = invitation.content[locale];
  data.program = data.program.map((item) => ({
    ...item,
    description: content?.programDescriptions[item.id] ?? "",
  }));
  return {
    type: "wedivo-di-balik-kalkir:update",
    payload: {
      data,
      locale,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId,
      guestName,
      guestToken: options.guestToken ?? "",
      preview: options.preview,
    },
  };
}
