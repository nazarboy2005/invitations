import { templateById, type Invitation } from "./index";
export type EditState = {
  status: string;
  editDeadlineAt: string | Date | null;
  approvedEventDate?: string | null;
};
export type InvitationEditAccess = {
  locked: boolean;
  deadlineAt: string | null;
  approvedEventDate: string | null;
};
// Object key order is not an edit. Array order remains meaningful.
export function sameValue(a: unknown, b: unknown): boolean {
  const canonical = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value)
          .filter(([, v]) => v !== undefined)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => [k, canonical(v)]),
      );
    return value;
  };
  return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
}
export function eventDay(now: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function editingClosed(
  access: InvitationEditAccess,
  now = new Date(),
): boolean {
  return (
    access.locked &&
    (!access.deadlineAt ||
      !Number.isFinite(Date.parse(access.deadlineAt)) ||
      now >= new Date(access.deadlineAt))
  );
}
export function secondaryCeremony(invitation: Invitation) {
  const data = invitation.templateData["kongillar-oroli"] as
    { secondaryEvent?: { enabled?: boolean; date?: string } } | undefined;
  return {
    enabled: data?.secondaryEvent?.enabled ?? false,
    date: data?.secondaryEvent?.date ?? "",
  };
}
export function lastCeremonyDate(invitation: Invitation): string {
  const secondary = secondaryCeremony(invitation);
  return secondary.enabled && /^\d{4}-\d{2}-\d{2}$/.test(secondary.date)
    ? [invitation.startsAt.slice(0, 10), secondary.date].sort().at(-1)!
    : invitation.startsAt.slice(0, 10);
}
export function anniversaryYears(invitation: Invitation) {
  return (
    (
      invitation.templateData["umr-bahori"] as
        { years?: number | null } | undefined
    )?.years ?? null
  );
}
export function assertCreatorCanEdit(
  previous: Invitation,
  next: Invitation,
  state: EditState,
  now = new Date(),
): void {
  if (state.status !== "draft" && state.status !== "published")
    throw new Error("INVITATION_DELETED");
  if (next.id !== previous.id || next.status !== previous.status)
    throw new Error("IMMUTABLE_IDENTITY");
  if (state.status !== "published") return;
  if (
    editingClosed(
      {
        locked: true,
        deadlineAt:
          state.editDeadlineAt instanceof Date
            ? String(state.editDeadlineAt)
            : state.editDeadlineAt,
        approvedEventDate: null,
      },
      now,
    )
  )
    throw new Error("EDIT_DEADLINE_PASSED");
  if (next.templateId !== previous.templateId)
    throw new Error("TEMPLATE_CHANGE_REQUIRES_REVIEW");
  if (
    next.eventType !== previous.eventType ||
    next.timezone !== previous.timezone
  )
    throw new Error("EVENT_CHANGE_REQUIRES_REVIEW");
  const image = templateById(previous.templateId)?.format === "image";
  if (next.startsAt !== previous.startsAt) {
    const approved = state.approvedEventDate ?? previous.startsAt.slice(0, 10);
    const date = next.startsAt.slice(0, 10);
    if (
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(next.startsAt) ||
      (image
        ? date > approved || date < eventDay(now, previous.timezone)
        : date !== previous.startsAt.slice(0, 10))
    )
      throw new Error("EVENT_CHANGE_REQUIRES_REVIEW");
  }
  if (
    !sameValue(
      [...next.enabledLocales].sort(),
      [...previous.enabledLocales].sort(),
    ) ||
    next.defaultLocale !== previous.defaultLocale
  )
    throw new Error("LANGUAGE_CHANGE_REQUIRES_REVIEW");
  if (
    next.celebrantAge !== previous.celebrantAge ||
    anniversaryYears(next) !== anniversaryYears(previous)
  )
    throw new Error("AGE_CHANGE_REQUIRES_REVIEW");
  if (!sameValue(secondaryCeremony(previous), secondaryCeremony(next)))
    throw new Error("CEREMONY_CHANGE_REQUIRES_REVIEW");
  for (const locale of previous.enabledLocales) {
    if (
      !sameValue(
        previous.content[locale]?.people,
        next.content[locale]?.people,
      ) ||
      previous.content[locale]?.hosts !== next.content[locale]?.hosts
    )
      throw new Error("NAME_CHANGE_REQUIRES_REVIEW");
  }
  for (const id of [
    "gulbog",
    "zarrin-gullar",
    "kongillar-oroli",
  ]) {
    const before = previous.templateData[id] as
      Record<string, unknown> | undefined;
    const after = next.templateData[id] as Record<string, unknown> | undefined;
    for (const key of ["brideFamily", "groomFamily", "coInviters"])
      if (!sameValue(before?.[key], after?.[key]))
        throw new Error("NAME_CHANGE_REQUIRES_REVIEW");
  }
  if (image) {
    const fixed = (value: Invitation) => ({
      ...value,
      revision: 0,
      startsAt: "",
      venue: null,
      slug: undefined,
      imageExportedAt: undefined,
      content: Object.fromEntries(
        Object.entries(value.content).map(([locale, content]) => [
          locale,
          {
            ...content,
            venueName: "",
            address: "",
            landmark: "",
          },
        ]),
      ),
    });
    if (!sameValue(fixed(previous), fixed(next)))
      throw new Error("STATIC_CONTENT_LOCKED");
  }
}
