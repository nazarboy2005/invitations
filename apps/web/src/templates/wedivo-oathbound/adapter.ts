import { getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";

const previewPhotos = [
  "fe8888373dd36d27981061d3.jpg", "3564de63889b8a2d7a251ba8.jpg",
  "019289a9c89374b0fedad5b8.jpg", "8c81116edf474831e4a7ebfa.jpg",
  "82bcd84120b1457d9b3c9cc4.jpg", "f1bc4ba8d9367baaf80bc54b.jpg",
];

/** No fixture is created here: callers supply the canonical ephemeral sample. */
export function makeOathboundPayload(
  invitation: Invitation,
  locale: Locale,
  options: {
    invitationId: string;
    guestName?: string;
    guestToken?: string;
    preview?: boolean;
    sampleWishes?: boolean;
    silentPlayback?: boolean;
    reducedMotion?: boolean;
  },
) {
  const content = getContent(invitation, locale);
  const wall = eventWallDate(invitation.startsAt, invitation.timezone);
  const instant = eventInstant(invitation.startsAt, invitation.timezone);
  const guestName = options.guestName ?? "";
  const authoredPhotos = invitation.gallery.filter((photo) => photo.url);
  const gallery = options.preview && options.sampleWishes && !authoredPhotos.length
    ? previewPhotos.map((filename, index) => ({
      id: `oathbound-preview-${index + 1}`,
      url: `/templates/wedivo-oathbound/assets/preview/${filename}`,
      alt: "", caption: "",
    })) : authoredPhotos;
  return {
    type: "wedivo-oathbound:update" as const,
    payload: {
      ...options,
      locale,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId,
      preview: options.preview ?? false,
      guestName,
      guestToken: options.guestToken ?? "",
      content: {
        ...content,
        greeting: guestName && content.personalGreeting
          ? content.personalGreeting.replaceAll("{name}", guestName)
          : content.greeting,
      },
      wallDate: wall?.toISOString().slice(0, 10) ?? "",
      wallTime: formatDate(invitation.startsAt, locale, invitation.timezone, {
        hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      }),
      instant: instant?.toISOString() ?? "",
      dateLabel: formatDate(invitation.startsAt, locale, invitation.timezone, {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      }),
      timezone: invitation.timezone,
      mapUrl: invitation.venue.mapUrl || (
        invitation.venue.latitude !== null && invitation.venue.longitude !== null
          ? `https://www.google.com/maps/search/?api=1&query=${invitation.venue.latitude},${invitation.venue.longitude}`
          : ""
      ),
      program: invitation.program.map((item) => ({
        ...item,
        instant: wall ? eventInstant(`${wall.toISOString().slice(0, 10)}T${item.time}`, invitation.timezone)?.toISOString() ?? "" : "",
        title: content.programTitles[item.id] ?? "",
        description: content.programDescriptions[item.id] ?? "",
      })),
      story: invitation.story.map((chapter) => ({
        id: chapter.id,
        title: chapter.title[locale] ?? "",
        text: chapter.text[locale] ?? "",
      })).filter((chapter) => chapter.title.trim() || chapter.text.trim()),
      gallery,
      music: invitation.music,
      rsvp: invitation.rsvp,
      wishesEnabled: invitation.wishes.enabled,
      // The source gift UI has no card/receipt controls. Never inject these fields.
      giftEnabled: invitation.gift.enabled,
      instagramUrl: invitation.contacts.instagramUrl,
      dressCode: {
        enabled: invitation.dressCode.enabled,
        style: invitation.dressCode.style[locale] ?? "",
        text: invitation.dressCode.text[locale] ?? "",
        note: invitation.dressCode.note[locale] ?? "",
        colors: invitation.dressCode.colors.map((color) => ({
          id: color.id, hex: color.hex, name: color.name[locale] ?? "",
        })),
      },
    },
  };
}
