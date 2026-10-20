import {
  createInvitation,
  invitationSchema,
  type Invitation,
} from "@taklifnoma/contracts";
import previewSample from "./preview-sample.json";

/**
 * A presentation-only fixture for catalog and empty template-selection previews.
 * Never persist this value as a creator's invitation.
 */
export function createTemplatePreviewSample(templateId: string): Invitation {
  return invitationSchema.parse({
    ...createInvitation(templateId),
    defaultLocale: previewSample.defaultLocale,
    enabledLocales: [...previewSample.enabledLocales],
    eventType: previewSample.eventType,
    startsAt: previewSample.startsAt,
    timezone: previewSample.timezone,
    program: previewSample.program.map((entry) => ({ ...entry })),
    content: structuredClone(previewSample.content),
  });
}

/** Detect creator-entered invitation content without counting default toggles. */
export function hasAuthoredInvitationContent(invitation: Invitation): boolean {
  const text = Object.values(invitation.content).some((content) =>
    [
      content.title,
      content.hosts,
      content.greeting,
      content.personalGreeting,
      content.message,
      content.eventLabel,
      content.venueName,
      content.address,
      content.landmark,
      content.programHeading,
      ...content.people,
      ...Object.values(content.programTitles),
    ].some((value) => value.trim().length > 0),
  );
  return Boolean(
    text ||
      invitation.eventType !== "other" ||
      invitation.startsAt ||
      invitation.program.length ||
      invitation.gallery.length ||
      invitation.contacts.length ||
      invitation.music.enabled ||
      invitation.music.url ||
      invitation.gift.enabled ||
      invitation.venue.mapUrl ||
      invitation.venue.latitude !== null ||
      invitation.venue.longitude !== null,
  );
}
