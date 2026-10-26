import type { Invitation, Locale } from "@taklifnoma/contracts";
import { getContent } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";

export function makeGoldenHourData(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  guestToken: string,
  invitationId: string,
  preview: boolean,
  catalogPreview: boolean,
) {
  const data = makeLegacyData(invitation, locale, guestName, catalogPreview);
  const content = getContent(invitation, locale);
  const hasCreatorPhotos = invitation.gallery.some((photo) => photo.url.trim());
  if (catalogPreview && !hasCreatorPhotos) {
    data.gallery = [
      {
        id: "golden-hour-source-preview-1",
        src: "/templates/golden-hour/assets/images/golden-hour/pink.png",
        alt: "",
        caption: "",
      },
      {
        id: "golden-hour-source-preview-2",
        src: "/templates/golden-hour/assets/images/golden-hour/flowers.png",
        alt: "",
        caption: "",
      },
      {
        id: "golden-hour-source-preview-3",
        src: "/templates/golden-hour/assets/images/golden-hour/flocake.png",
        alt: "",
        caption: "",
      },
      {
        id: "golden-hour-source-preview-4",
        src: "/templates/golden-hour/assets/images/golden-hour/location.png",
        alt: "",
        caption: "",
      },
      {
        id: "golden-hour-source-preview-5",
        src: "/templates/golden-hour/assets/images/golden-hour/footerimage.png",
        alt: "",
        caption: "",
      },
    ];
  }
  return {
    ...data,
    title: content.title,
    eventType: content.eventLabel,
    greeting: guestName
      ? content.personalGreeting.replaceAll("{name}", guestName) ||
        content.greeting
      : content.greeting,
    message: content.message,
    hosts: content.hosts,
    dateTime: data.dateTime,
    timezone: invitation.timezone,
    programHeading: content.programHeading || data.programHeading,
    program: invitation.program.map((item) => ({
      id: item.id,
      time: item.time,
      title: content.programTitles[item.id] ?? "",
    })),
    venue: {
      ...data.venue,
      name: content.venueName,
      address: [content.address, content.landmark].filter(Boolean).join(" · "),
      lat: invitation.venue.latitude,
      lng: invitation.venue.longitude,
      mapUrl: invitation.venue.mapUrl,
    },
    dressCode: {
      enabled: invitation.dressCode.enabled,
      style: invitation.dressCode.style[locale] ?? "",
      text: invitation.dressCode.text[locale] ?? "",
      note: invitation.dressCode.note[locale] ?? "",
      colors: invitation.dressCode.colors.map((color) => ({
        id: color.id,
        hex: color.hex,
        name: color.name[locale] ?? "",
      })),
    },
    rsvp: invitation.rsvp,
    wishesEnabled: invitation.wishes.enabled,
    locale,
    guestName,
    guestToken,
    preview,
    catalogPreview,
    apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
  };
}
