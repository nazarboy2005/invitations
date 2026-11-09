import {
  defaultLocalizedInvitationContent,
  type Invitation,
  type Locale,
} from "@taklifnoma/contracts";

/** Event identity is not interchangeable; shared event details remain reusable. */
export function switchEventType(
  invitation: Invitation,
  eventType: Invitation["eventType"],
): Invitation {
  if (eventType === invitation.eventType) return invitation;

  const content = { ...invitation.content };
  for (const locale of Object.keys(content) as Locale[]) {
    const previous = content[locale];
    if (!previous) continue;
    const before = defaultLocalizedInvitationContent(
      invitation.eventType,
      locale,
    );
    const after = defaultLocalizedInvitationContent(eventType, locale);
    const next = { ...previous, people: [] };
    for (const field of [
      "title",
      "greeting",
      "message",
      "eventLabel",
      "programHeading",
    ] as const) {
      if (!previous[field].trim() || previous[field] === before[field]) {
        next[field] = after[field];
      }
    }
    content[locale] = next;
  }
  return { ...invitation, eventType, content, celebrantAge: null };
}
