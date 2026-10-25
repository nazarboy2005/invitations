import { getContent, type Invitation, type Locale } from "@taklifnoma/contracts";

/** Maps localized creator-authored Wedding fields into the isolated source bridge payload. */
export function makeWeddingFields(invitation: Invitation, locale: Locale) {
  const content = getContent(invitation, locale);
  return {
    program: invitation.program.map((item) => ({
      id: item.id,
      time: item.time,
      title: content.programTitles[item.id] ?? "",
      description: content.programDescriptions[item.id] ?? "",
    })),
    artists: invitation.artistLineup.map((artist) => ({
      id: artist.id,
      name: artist.name[locale] ?? "",
      role: artist.role[locale] ?? "",
      imageUrl: artist.imageUrl,
    })),
  };
}
