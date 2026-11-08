import { z } from "zod";
import { localeSchema, type Invitation } from "./index";
import { anniversaryYears, secondaryCeremony } from "./policies";

const name = z.string().trim().min(1).max(300);
const localized = z.partialRecord(localeSchema, z.string().max(300));
export const identityCorrectionSchema = z
  .object({
    locales: z.partialRecord(
      localeSchema,
      z
        .object({
          people: z.array(name).min(1).max(20),
          hosts: z.string().max(300),
        })
        .strict(),
    ),
    celebrantAge: z.number().int().min(1).max(120).nullable(),
    anniversaryYears: z.number().int().min(1).max(999).nullable(),
    familyLines: z
      .object({
        brideFamily: localized.optional(),
        groomFamily: localized.optional(),
      })
      .strict(),
    coInviters: z.string().max(1000).optional(),
  })
  .strict();
export const postponementSchema = z
  .object({
    startsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/),
    secondaryDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  })
  .strict();
const reason = z.string().trim().min(5).max(1000);
export const changeRequestSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("identity"),
      values: identityCorrectionSchema,
      reason,
    })
    .strict(),
  z
    .object({
      type: z.literal("postponement"),
      values: postponementSchema,
      reason,
    })
    .strict(),
]);
export type ChangeInput = z.infer<typeof changeRequestSchema>;
export function identityValues(
  invitation: Invitation,
): z.infer<typeof identityCorrectionSchema> {
  const data = invitation.templateData[invitation.templateId] as
    Record<string, unknown> | undefined;
  return structuredClone({
    locales: Object.fromEntries(
      invitation.enabledLocales.map((locale) => [
        locale,
        {
          people: invitation.content[locale].people,
          hosts: invitation.content[locale].hosts,
        },
      ]),
    ),
    celebrantAge: invitation.celebrantAge,
    anniversaryYears: anniversaryYears(invitation),
    familyLines: {
      ...(data?.brideFamily !== undefined
        ? { brideFamily: data.brideFamily as z.infer<typeof localized> }
        : {}),
      ...(data?.groomFamily !== undefined
        ? { groomFamily: data.groomFamily as z.infer<typeof localized> }
        : {}),
    },
    ...(data?.coInviters !== undefined
      ? { coInviters: data.coInviters as string }
      : {}),
  });
}
export function changeBase(invitation: Invitation, type: ChangeInput["type"]) {
  return type === "identity"
    ? identityValues(invitation)
    : {
        startsAt: invitation.startsAt,
        timezone: invitation.timezone,
        secondary: secondaryCeremony(invitation),
      };
}
export function applyChange(
  invitation: Invitation,
  input: ChangeInput,
): Invitation {
  const next = structuredClone(invitation);
  if (input.type === "identity") {
    const value = input.values;
    if (
      Object.keys(value.locales).sort().join() !==
      [...invitation.enabledLocales].sort().join()
    )
      throw new Error("INVALID_LOCALES");
    for (const locale of invitation.enabledLocales) {
      const content = value.locales[locale]!;
      if (content.people.length !== invitation.content[locale].people.length)
        throw new Error("INVALID_PEOPLE");
      next.content[locale] = { ...next.content[locale], ...content };
    }
    next.celebrantAge = value.celebrantAge;
    if (invitation.templateId === "umr-bahori") {
      const data = next.templateData[invitation.templateId] as Record<
        string,
        never
      >;
      next.templateData[invitation.templateId] = {
        ...data,
        years: value.anniversaryYears,
      };
    } else if (value.anniversaryYears !== null)
      throw new Error("INVALID_ANNIVERSARY");
    const old = identityValues(invitation);
    if (
      Object.keys(value.familyLines).sort().join() !==
        Object.keys(old.familyLines).sort().join() ||
      (value.coInviters === undefined) !== (old.coInviters === undefined)
    )
      throw new Error("INVALID_FAMILIES");
    if (
      Object.keys(value.familyLines).length ||
      value.coInviters !== undefined
    ) {
      const data = next.templateData[invitation.templateId] as Record<
        string,
        never
      >;
      next.templateData[invitation.templateId] = {
        ...data,
        ...value.familyLines,
        ...(value.coInviters !== undefined
          ? { coInviters: value.coInviters }
          : {}),
      };
    }
  } else {
    next.startsAt = input.values.startsAt;
    if (input.values.secondaryDate !== undefined) {
      if (!secondaryCeremony(invitation).enabled)
        throw new Error("INVALID_CEREMONY");
      const data = next.templateData["kongillar-oroli"] as {
        secondaryEvent: Record<string, string>;
      };
      next.templateData["kongillar-oroli"] = {
        ...data,
        secondaryEvent: {
          ...data.secondaryEvent,
          date: input.values.secondaryDate,
        },
      };
    }
  }
  return next;
}
export type ChangeRequestView = {
  id: string;
  invitationId: string;
  ownerName?: string;
  people: string;
  type: ChangeInput["type"];
  status: string;
  reason: string;
  reviewNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
  before: unknown;
  values: ChangeInput["values"];
  timezone: string;
};
