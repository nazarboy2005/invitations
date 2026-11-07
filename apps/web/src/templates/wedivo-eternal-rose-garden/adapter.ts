import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { catalogPreviewMusic } from "@/modules/catalog/catalog-music";

export function makeEternalRosePayload(
  invitation: Invitation,
  locale: Locale,
  options: {
    invitationId: string;
    guestName?: string;
    guestToken?: string;
    preview?: boolean;
    sampleWishes?: boolean;
    catalogMusic?: boolean;
    silentPlayback?: boolean;
    qaReducedMotion?: boolean;
  },
) {
  const data = makeLegacyData(invitation, locale, options.guestName ?? "", options.preview && options.sampleWishes);
  const content = invitation.content[locale] ?? invitation.content[invitation.defaultLocale];
  return {
    type: "wedivo-eternal-rose-garden:update" as const,
    payload: {
      data: {
        ...data,
        mapQuery: invitation.venue.latitude !== null && invitation.venue.longitude !== null
          ? `${invitation.venue.latitude},${invitation.venue.longitude}` : "",
        program: data.program.map((entry) => ({
          ...entry,
          description: content?.programDescriptions[entry.id] ?? "",
        })),
        music: options.silentPlayback ? { enabled: false, url: "" }
          : options.preview && options.catalogMusic ? { enabled: true, url: catalogPreviewMusic(invitation).url } : data.music,
      },
      locale,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId,
      guestName: options.guestName ?? "",
      guestToken: options.guestToken ?? "",
      preview: Boolean(options.preview),
      reducedMotion: Boolean(options.preview && options.qaReducedMotion),
      rsvpEnabled: invitation.rsvp.enabled,
      rsvpDeadline: invitation.rsvp.deadline,
      wishesEnabled: invitation.wishes.enabled,
    },
  };
}
