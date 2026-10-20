import type { Invitation } from "./index";
export type EditState = {
  status: string;
  editDeadlineAt: string | Date | null;
};
export function assertCreatorCanEdit(
  previous: Invitation,
  next: Invitation,
  state: EditState,
  now = new Date(),
): void {
  if (state.status === "archived") throw new Error("INVITATION_ARCHIVED");
  if (next.id !== previous.id || next.status !== previous.status)
    throw new Error("IMMUTABLE_IDENTITY");
  if (state.status !== "published") return;
  if (!state.editDeadlineAt || now >= new Date(state.editDeadlineAt))
    throw new Error("EDIT_DEADLINE_PASSED");
  if (next.templateId !== previous.templateId)
    throw new Error("TEMPLATE_CHANGE_REQUIRES_REVIEW");
  if (
    next.eventType !== previous.eventType ||
    next.startsAt !== previous.startsAt ||
    next.timezone !== previous.timezone
  )
    throw new Error("EVENT_CHANGE_REQUIRES_REVIEW");
  for (const locale of previous.enabledLocales) {
    if (
      JSON.stringify(previous.content[locale]?.people) !==
        JSON.stringify(next.content[locale]?.people) ||
      previous.content[locale]?.hosts !== next.content[locale]?.hosts
    )
      throw new Error("NAME_CHANGE_REQUIRES_REVIEW");
  }
  if (
    next.enabledLocales.some(
      (locale) => !previous.enabledLocales.includes(locale),
    )
  )
    throw new Error("LANGUAGE_ADDITION_REQUIRES_REVIEW");
}
