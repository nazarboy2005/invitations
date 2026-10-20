import { z } from "zod";

export const LOCALES = ["uz-Latn", "uz-Cyrl", "en", "ru"] as const;
export const localeSchema = z.enum(LOCALES);
export const templateIdSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
const invitationTemplateIdSchema = templateIdSchema.or(z.literal(""));
export type Locale = z.infer<typeof localeSchema>;
export const LANGUAGE_NAMES: Record<Locale, string> = {
  "uz-Latn": "O‘zbekcha",
  "uz-Cyrl": "Ўзбекча",
  en: "English",
  ru: "Русский",
};
const short = z.string().max(300);
const text = z.string().max(10000);
const safeUrl = z
  .string()
  .max(2048)
  .refine(
    (v) => !v || /^https?:\/\//i.test(v) || /^\/(?!\/)/.test(v),
    "Use an http(s) URL or local asset path",
  );
export const contentSchema = z.object({
  title: short,
  people: z.array(short).max(20),
  hosts: short,
  greeting: short,
  personalGreeting: short,
  message: text,
  eventLabel: short,
  venueName: short,
  address: z.string().max(1000),
  landmark: z.string().max(1000),
  programHeading: short,
  programTitles: z.record(z.string(), short),
});
export type InvitationContent = z.infer<typeof contentSchema>;
export const invitationSchema = z
  .object({
    version: z.literal(1),
    revision: z.number().int().min(1).default(1),
    id: z.string().min(1).max(100),
    templateId: invitationTemplateIdSchema,
    status: z.enum(["draft", "published", "archived"]),
    defaultLocale: localeSchema,
    enabledLocales: z.array(localeSchema).min(1).max(4),
    content: z.record(z.string(), contentSchema),
    eventType: z.enum(["wedding", "birthday", "osh", "qiz-bazmi", "other"]),
    startsAt: z.string().max(50),
    timezone: z.string().max(100),
    venue: z.object({
      latitude: z.number().min(-90).max(90).nullable(),
      longitude: z.number().min(-180).max(180).nullable(),
      mapUrl: safeUrl,
    }),
    program: z
      .array(z.object({ id: z.string().max(100), time: z.string().max(10) }))
      .max(100),
    gallery: z
      .array(
        z.object({
          id: z.string().max(100),
          url: safeUrl,
          alt: short,
          caption: short,
        }),
      )
      .max(50),
    music: z.object({
      enabled: z.boolean(),
      assetId: z.string().max(100).nullable(),
      url: safeUrl,
      filename: short,
    }),
    gift: z.object({
      enabled: z.boolean(),
      receiptUploadEnabled: z.boolean(),
      cardNumber: z.string().max(30),
      cardHolder: short,
      bankName: short,
    }),
    contacts: z
      .array(
        z.object({
          id: z.string().max(100),
          type: z.enum(["phone", "telegram"]),
          label: short,
          value: short,
        }),
      )
      .max(20),
    rsvp: z.object({
      enabled: z.boolean(),
      deadline: z.string().max(50),
      maxPartySize: z.number().int().min(1).max(100),
    }),
    wishes: z.object({
      enabled: z.boolean(),
      requireApproval: z.literal(true),
    }),
  })
  .superRefine((value, ctx) => {
    if (!value.enabledLocales.includes(value.defaultLocale))
      ctx.addIssue({
        code: "custom",
        message: "Default language must be enabled",
      });
    if (value.status === "published" && !value.templateId)
      ctx.addIssue({
        code: "custom",
        path: ["templateId"],
        message: "A published invitation must have a template",
      });
    for (const locale of value.enabledLocales)
      if (!value.content[locale])
        ctx.addIssue({
          code: "custom",
          message: `Missing language: ${locale}`,
        });
    if (!value.gift.enabled && value.gift.receiptUploadEnabled)
      ctx.addIssue({
        code: "custom",
        message: "Receipt uploads require gift details",
      });
  });
export type Invitation = z.infer<typeof invitationSchema>;

export type TemplateCategory = { id: string; name: string; position: number };
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: "wedding", name: "Nikoh to‘yi", position: 0 },
  { id: "birthday", name: "Tug‘ilgan kun", position: 1 },
  { id: "osh", name: "Nahorgi osh", position: 2 },
  { id: "qiz-bazmi", name: "Qiz bazmi", position: 3 },
  { id: "other", name: "Boshqa tadbirlar", position: 4 },
];
export type TemplateDefinition = {
  id: z.infer<typeof templateIdSchema>;
  name: string;
  description: string;
  /** Exact catalog artwork supplied by this template's source, when available. */
  previewImage?: string;
  categoryIds: string[];
  priceMinor: number;
  currency: "UZS";
  accent: string;
  published: boolean;
};
export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "anor",
    name: "Anor",
    description:
      "Anor gullari, Rishton naqshlari va bog‘ tongidan ilhomlangan taklifnoma.",
    previewImage: "preview.webp",
    categoryIds: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#7c142b",
    published: false,
  },
];
export const templateById = (id: string) =>
  TEMPLATES.find((item) => item.id === id);
// Some browser builds lack Uzbek ICU data. Keep SSR and hydration identical.
export function formatPrice(minor: number): string {
  const absolute = Math.abs(minor);
  const whole = Math.floor(absolute / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  const fraction = absolute % 100;
  return `${minor < 0 ? "−" : ""}${whole}${fraction ? `,${String(fraction).padStart(2, "0")}` : ""} so‘m`;
}
export function emptyContent(): InvitationContent {
  return {
    title: "",
    people: [],
    hosts: "",
    greeting: "",
    personalGreeting: "",
    message: "",
    eventLabel: "",
    venueName: "",
    address: "",
    landmark: "",
    programHeading: "",
    programTitles: {},
  };
}
export function createInvitation(
  templateId: Invitation["templateId"] = "",
): Invitation {
  return {
    version: 1,
    revision: 1,
    id: crypto.randomUUID(),
    templateId,
    status: "draft",
    defaultLocale: "uz-Latn",
    enabledLocales: ["uz-Latn"],
    content: { "uz-Latn": emptyContent() },
    eventType: "other",
    startsAt: "",
    timezone: "Asia/Tashkent",
    venue: { latitude: null, longitude: null, mapUrl: "" },
    program: [],
    gallery: [],
    music: { enabled: false, assetId: null, url: "", filename: "" },
    gift: {
      enabled: false,
      receiptUploadEnabled: false,
      cardNumber: "",
      cardHolder: "",
      bankName: "",
    },
    contacts: [],
    rsvp: { enabled: true, deadline: "", maxPartySize: 5 },
    wishes: { enabled: true, requireApproval: true },
  };
}
export function getContent(
  invitation: Invitation,
  locale: Locale = invitation.defaultLocale,
): InvitationContent {
  return (
    invitation.content[locale] ??
    invitation.content[invitation.defaultLocale] ??
    emptyContent()
  );
}
export function switchTemplate(
  invitation: Invitation,
  templateId: Invitation["templateId"],
): Invitation {
  return { ...invitation, templateId };
}
export function addLanguage(
  invitation: Invitation,
  locale: Locale,
): Invitation {
  if (invitation.enabledLocales.includes(locale)) return invitation;
  const content = emptyContent();
  content.people = [...getContent(invitation).people];
  return {
    ...invitation,
    enabledLocales: [...invitation.enabledLocales, locale],
    content: { ...invitation.content, [locale]: content },
  };
}
export type SessionUser = {
  id: string;
  telegramUserId: string;
  displayName: string;
  phoneShared: boolean;
  isAdmin: boolean;
};
export type SessionResponse = {
  user: SessionUser | null;
  configured: boolean;
  missing?: string[];
};
