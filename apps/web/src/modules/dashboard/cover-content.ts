import { invitationSchema, type Invitation } from "@taklifnoma/contracts";

/** Only render-affecting content: publishing, counters and audio don't change a cover. */
export function coverContent(invitation: Invitation): string {
  const { slug: _slug, ...data } = invitationSchema.parse(invitation);
  return JSON.stringify(
    {
      ...data,
      revision: 1,
      status: "draft",
      enabledLocales: [data.defaultLocale],
      content: { [data.defaultLocale]: data.content[data.defaultLocale] },
      music: { enabled: false, assetId: null, url: "", filename: "" },
    },
    (_key, value: unknown) =>
      value && typeof value === "object" && !Array.isArray(value)
        ? Object.fromEntries(
            Object.entries(value).sort(([a], [b]) =>
              a < b ? -1 : a > b ? 1 : 0,
            ),
          )
        : value,
  );
}

/** Draft screenshots are a name/design thumbnail, not a live preview of edits. */
export function thumbnailContent(invitation: Invitation): string {
  if (invitation.status === "published")
    return `published:${coverContent(invitation)}`;
  return JSON.stringify({
    kind: "draft",
    id: invitation.id,
    templateId: invitation.templateId,
    locale: invitation.defaultLocale,
    people: invitation.content[invitation.defaultLocale]?.people ?? [],
  });
}
