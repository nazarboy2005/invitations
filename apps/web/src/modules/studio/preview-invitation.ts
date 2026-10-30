import { getContent, type Invitation } from "@taklifnoma/contracts";
import { createTemplatePreviewSample } from "../catalog/preview-sample";

/** Required-field placeholders for the editor only. Never save this projection. */
export function createStudioPreviewInvitation(
  invitation: Invitation,
): Invitation {
  if (!invitation.templateId || invitation.status !== "draft")
    return invitation;
  const sample = createTemplatePreviewSample(invitation.templateId, invitation);
  const minimumPeople = ["wedding", "fotiha"].includes(invitation.eventType)
    ? 2
    : 1;
  const hasLocation = Boolean(
    invitation.venue.mapUrl.trim() ||
    (invitation.venue.latitude !== null &&
      invitation.venue.longitude !== null) ||
    Object.values(invitation.content).some((content) => content.address.trim() || content.venueName.trim()),
  );
  const content = { ...invitation.content };
  for (const locale of invitation.enabledLocales) {
    const current = getContent(invitation, locale);
    const defaults = getContent(sample, locale);
    content[locale] = {
      ...current,
      people: Array.from(
        { length: Math.max(minimumPeople, current.people.length) },
        (_, index) =>
          index < minimumPeople
            ? current.people[index]?.trim()
              ? current.people[index]
              : (defaults.people[index] ?? "")
            : current.people[index],
      ),
      eventLabel: current.eventLabel.trim()
        ? current.eventLabel
        : defaults.eventLabel,
      message: current.message.trim() ? current.message : defaults.message,
      venueName: current.venueName.trim()
        ? current.venueName
        : defaults.venueName,
      address:
        current.address.trim() || hasLocation
          ? current.address
          : defaults.address,
    };
  }
  return {
    ...invitation,
    startsAt: invitation.startsAt || sample.startsAt,
    venue: hasLocation ? invitation.venue : sample.venue,
    content,
  };
}
