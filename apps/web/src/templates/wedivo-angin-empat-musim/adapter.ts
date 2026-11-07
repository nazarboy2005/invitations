import {
  getContent,
  type Invitation,
  type Locale,
} from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { catalogPreviewMusic } from "@/modules/catalog/catalog-music";
import { eventInstant, eventWallDate } from "@/templates/date-format";

export const ANGIN_TEMPLATE_ID = "wedivo-angin-empat-musim";

/** Maps source-present fields only; never mutates or seeds the invitation. */
export function makeAnginPayload(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  options: {
    invitationId: string;
    guestToken?: string;
    preview?: boolean;
    sampleWishes?: boolean;
    catalogMusic?: boolean;
    silentPlayback?: boolean;
    reducedMotion?: boolean;
  },
) {
  const mapped = makeLegacyData(
    invitation,
    locale,
    guestName,
    !!options.preview && !!options.sampleWishes,
  );
  const content = getContent(invitation, locale);
  const instant = invitation.startsAt
    ? eventInstant(invitation.startsAt, invitation.timezone)
    : null;
  const wall = invitation.startsAt
    ? eventWallDate(invitation.startsAt, invitation.timezone)
    : null;
  const date = wall
    ? `${wall.getUTCFullYear()}-${String(wall.getUTCMonth() + 1).padStart(2, "0")}-${String(wall.getUTCDate()).padStart(2, "0")}`
    : "";
  const wallClock =
    date && mapped.date.time
      ? new Date(`${date}T${mapped.date.time}:00Z`).getTime()
      : 0;
  // These source images are decorative art. Source creator/demo photographs are
  // deliberately excluded, including from preview-only media substitution.
  const data = {
    title: mapped.title,
    bride: mapped.bride,
    groom: mapped.groom,
    hosts: mapped.hosts,
    greeting: mapped.greeting,
    message: mapped.message,
    eventType: mapped.eventType,
    date: mapped.date,
    venue: mapped.venue,
    programHeading: mapped.programHeading,
    program: mapped.program.map((item) => ({
      ...item,
      description: content.programDescriptions[item.id] ?? "",
    })),
    story: mapped.story,
    gallery: mapped.gallery.filter((item) => item.src),
    instagram:
      mapped.contacts.find((item) => item.type === "instagram") ?? null,
    rsvp: mapped.rsvp,
    wishesEnabled: mapped.wishesEnabled,
    wishes: options.preview && options.sampleWishes ? mapped.wishes : [],
    dressCode: mapped.dressCode,
    music:
      options.catalogMusic && options.preview
        ? { enabled: true, url: catalogPreviewMusic(invitation).url }
        : mapped.music,
    timezone: invitation.timezone,
  };
  if (options.preview && options.sampleWishes && data.gallery.length === 0) {
    data.gallery = [
      "1790402855_4b513ea0.jpg",
      "1790402855_a9baff28.jpg",
      "1790402894_efcca39f.jpg",
      "1790402900_a291aaa9.jpg",
      "1790402940_58fe76a4.jpg",
      "1790402946_a511758a.jpg",
    ].map((filename, index) => ({
      id: `angin-preview-art-${index + 1}`,
      src: `/templates/${ANGIN_TEMPLATE_ID}/assets/${filename}`,
      alt: "",
      caption: "",
    }));
  }
  return {
    type: `${ANGIN_TEMPLATE_ID}:update`,
    payload: {
      data,
      locale,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId,
      guestToken: options.guestToken ?? "",
      guestName,
      preview: !!options.preview,
      reducedMotion: !!options.preview && !!options.reducedMotion,
      silentPlayback:
        !!options.preview &&
        (!!options.silentPlayback || !options.catalogMusic),
      eventDate: date,
      eventTimestamp: instant?.getTime() ?? 0,
      timezoneOffset:
        wallClock && instant ? (wallClock - instant.getTime()) / 3600000 : 0,
    },
  };
}
