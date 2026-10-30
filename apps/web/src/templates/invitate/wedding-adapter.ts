import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { getContent } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { formatDate } from "../date-format";
import { makeWeddingFields } from "./wedding-fields";

const locale: Record<Locale, string> = {
  "uz-Latn": "uz",
  "uz-Cyrl": "uz-Cyrl",
  en: "en",
  ru: "ru",
};

export function makeWeddingData(
  invitation: Invitation,
  activeLocale: Locale,
  guestName: string,
  guestToken: string,
  invitationId: string,
  preview: boolean,
  reducedMotion = false,
) {
  const content = getContent(invitation, activeLocale);
  const base = makeLegacyData(invitation, activeLocale, guestName, preview);
  const weddingFields = makeWeddingFields(invitation, activeLocale);
  const gallery = invitation.gallery
    .filter((photo) => photo.url.trim())
    .map((photo) => ({
      id: photo.id,
      src: photo.url,
      alt: photo.alt || photo.caption,
      caption: photo.caption,
    }));
  if (preview && gallery.length === 0) {
    gallery.push(
      ...Array.from({ length: 6 }, (_, index) => ({
        id: `wedding-preview-${index + 1}`,
        src: `/templates/invitate-wedding/assets/captured/${[
          "7419a394e8fcdc1a.jpg",
          "9df50deadd54b10f.jpg",
          "508106ed635af865.jpg",
          "9c6e060d31968064.jpg",
          "739da402a4d1adf7.jpg",
          "fbefe685d0037622.jpg",
        ][index]}`,
        alt: "",
        caption: "",
      })),
    );
  }
  return {
    ...base,
    locale: locale[activeLocale],
    languages: invitation.enabledLocales.map((item) => locale[item]),
    people: content.people,
    greeting: guestName
      ? content.personalGreeting.replaceAll("{name}", guestName) ||
        content.greeting
      : content.greeting,
    message: content.message,
    dateTime: base.dateTime,
    venueName: content.venueName,
    venueAddress: [content.address, content.landmark]
      .filter(Boolean)
      .join(" · "),
    mapUrl: yandexMapUrl(invitation.venue),
    phoneNumber: invitation.contacts.phoneNumber,
    telegramUsername: invitation.contacts.telegramUsername,
    programHeading: content.programHeading || base.programHeading,
    ...weddingFields,
    gallery,
    dressCode: invitation.dressCode.enabled
      ? {
          enabled: true,
          style: invitation.dressCode.style[activeLocale] ?? "",
          text: invitation.dressCode.text[activeLocale] ?? "",
          note: invitation.dressCode.note[activeLocale] ?? "",
          colors: invitation.dressCode.colors.map((item) => ({
            id: item.id,
            name: item.name[activeLocale] ?? "",
            hex: item.hex,
          })),
        }
      : { enabled: false, style: "", text: "", note: "", colors: [] },
    rsvpEnabled: invitation.rsvp.enabled,
    rsvpDeadline: invitation.rsvp.deadline
      ? formatDate(invitation.rsvp.deadline, activeLocale, invitation.timezone, {
          dateStyle: "long",
        })
      : "",
    guestName,
    guestToken,
    apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
    preview,
    reducedMotion: preview && reducedMotion,
    music: invitation.music.enabled
      ? { enabled: true, url: invitation.music.url }
      : { enabled: false, url: "" },
  };
}
