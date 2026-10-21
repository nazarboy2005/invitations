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
export function createTemplatePreviewSample(
  templateId: string,
  localeSettings?: Pick<Invitation, "defaultLocale" | "enabledLocales">,
): Invitation {
  return invitationSchema.parse({
    ...createInvitation(templateId),
    defaultLocale: localeSettings?.defaultLocale ?? previewSample.defaultLocale,
    enabledLocales: localeSettings
      ? [...localeSettings.enabledLocales]
      : [...previewSample.enabledLocales],
    eventType: previewSample.eventType,
    startsAt: previewSample.startsAt,
    timezone: previewSample.timezone,
    program: previewSample.program.map((entry) => ({ ...entry })),
    content: structuredClone(previewSample.content),
    rsvp: { ...createInvitation(templateId).rsvp, enabled: true },
    wishes: { enabled: true, requireApproval: true },
  });
}

/** Create an ephemeral stress-test variant for responsive name lockups. */
export function createLongNamePreview(invitation: Invitation): Invitation {
  const content = Object.fromEntries(
    Object.entries(invitation.content).map(([locale, localized]) => [
      locale,
      {
        ...localized,
        people: [
          "Gulbahor-Marguba Sayyidabonu",
          "Jahongir-Shohruhbek Mirzohid",
        ],
      },
    ]),
  );
  return invitationSchema.parse({ ...invitation, content });
}

/** Detect creator-entered invitation content without counting default toggles. */
export function hasAuthoredInvitationContent(invitation: Invitation): boolean {
  const hasText = (values: Array<string | undefined>) =>
    values.some((value) => Boolean(value?.trim()));
  const authoredCopy = Object.values(invitation.content).some((content) =>
    hasText([
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
    ]),
  );
  const authoredStory = invitation.story.some((chapter) =>
    hasText([...Object.values(chapter.title), ...Object.values(chapter.text)]),
  );
  const dressCode = invitation.dressCode;
  const authoredDressCode =
    dressCode.enabled ||
    hasText([
      ...Object.values(dressCode.style),
      ...Object.values(dressCode.text),
      ...Object.values(dressCode.note),
      ...dressCode.colors.flatMap((color) => Object.values(color.name)),
      ...dressCode.colors.map((color) => color.hex),
    ]);
  const authoredGift =
    invitation.gift.enabled ||
    invitation.gift.receiptUploadEnabled ||
    hasText([invitation.gift.cardNumber, invitation.gift.cardHolder]);
  const authoredRsvp =
    invitation.rsvp.enabled !== true ||
    Boolean(invitation.rsvp.deadline.trim()) ||
    invitation.rsvp.maxPartySize !== 5;
  return Boolean(
    authoredCopy ||
    authoredStory ||
    authoredDressCode ||
    authoredGift ||
    authoredRsvp ||
    !invitation.wishes.enabled ||
    invitation.eventType !== "other" ||
    invitation.startsAt ||
    invitation.program.length ||
    invitation.gallery.length ||
    invitation.contacts.phoneNumber.trim() ||
    invitation.contacts.telegramUsername.trim() ||
    invitation.music.enabled ||
    invitation.music.url ||
    invitation.music.filename ||
    invitation.music.assetId ||
    invitation.venue.mapUrl ||
    invitation.venue.latitude !== null ||
    invitation.venue.longitude !== null,
  );
}
