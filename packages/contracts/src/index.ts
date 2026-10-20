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
  "uz-Latn": "Uz",
  "uz-Cyrl": "Уз",
  en: "En",
  ru: "Ru",
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
const localizedShortText = z.partialRecord(localeSchema, short);
const localizedLongText = z.partialRecord(localeSchema, text);
export const dressCodeSchema = z.object({
  enabled: z.boolean().default(false),
  style: localizedShortText.default({}),
  text: localizedLongText.default({}),
  note: localizedLongText.default({}),
  colors: z
    .array(
      z.object({
        id: z.string().min(1).max(100),
        name: localizedShortText.default({}),
        hex: z.string().regex(/^#[0-9a-f]{3,8}$/i),
      }),
    )
    .max(12)
    .default([]),
});
export const storyChapterSchema = z.object({
  id: z.string().min(1).max(100),
  title: localizedShortText.default({}),
  text: localizedLongText.default({}),
});
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
    story: z.array(storyChapterSchema).max(20).default([]),
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
    voiceMessage: z
      .object({
        enabled: z.boolean(),
        assetId: z.string().max(100).nullable(),
        url: safeUrl,
        filename: short,
      })
      .default({ enabled: false, assetId: null, url: "", filename: "" }),
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
    dressCode: dressCodeSchema.default({
      enabled: false,
      style: {},
      text: {},
      note: {},
      colors: [],
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
    if (
      value.status === "published" &&
      value.voiceMessage.enabled &&
      (!value.voiceMessage.url || !value.voiceMessage.assetId)
    )
      ctx.addIssue({
        code: "custom",
        path: ["voiceMessage", "url"],
        message: "An enabled voice greeting must include an uploaded audio file",
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
  {
    id: "oltin-nur",
    name: "Oltin Nur",
    description: "Qora baxmal va oltin nur.",
    previewImage: "/templates/marxaba/nikoh/templates/oltin-nur/preview.webp",
    categoryIds: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#c6a45b",
    published: false,
  },
  {
    id: "samarqand-kechasi",
    name: "Samarqand Kechasi",
    description: "Registon oqshomi va oltin salyut.",
    previewImage:
      "/templates/marxaba/nikoh/templates/samarqand-kechasi/preview.webp",
    categoryIds: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#d2a84a",
    published: false,
  },
  {
    id: "bogi-eram",
    name: "Bog‘i Eram",
    description: "O‘ymakor darvoza va jannat bog‘i.",
    previewImage: "/templates/marxaba/nikoh/templates/bogi-eram/preview.webp",
    categoryIds: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#9c6c3a",
    published: false,
  },
  {
    id: "atlas",
    name: "Atlas",
    description: "Zamonaviy atlas va adras ranglari.",
    previewImage: "/templates/marxaba/nikoh/templates/atlas/preview.webp",
    categoryIds: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#c2185b",
    published: false,
  },
  {
    id: "uchar-gilam",
    name: "Uchar Gilam",
    description: "Gilam ustida Buxoro uzra parvoz.",
    previewImage: "/templates/marxaba/nikoh/templates/uchar-gilam/preview.webp",
    categoryIds: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#be8738",
    published: false,
  },
  {
    id: "oq-kabutar",
    name: "Oq Kabutar",
    description: "Oq kabutarlar va ipak lenta.",
    previewImage: "/templates/marxaba/nikoh/templates/oq-kabutar/preview.webp",
    categoryIds: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#9a7957",
    published: false,
  },
  {
    id: "kuzgi-chinor",
    name: "Kuzgi Chinor",
    description: "Oltin kuz va chinor barglari.",
    previewImage:
      "/templates/marxaba/nikoh/templates/kuzgi-chinor/preview.webp",
    categoryIds: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#a65724",
    published: false,
  },
  {
    id: "muhabbat-kitobi",
    name: "Muhabbat Kitobi",
    description: "Sevgi hikoyasi kitob sahifalarida.",
    previewImage:
      "/templates/marxaba/nikoh/templates/muhabbat-kitobi/preview.webp",
    categoryIds: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#8a6348",
    published: false,
  },
  {
    id: "sahifa",
    name: "Sahifa",
    description: "Jurnal muqovasidan ilhomlangan taklifnoma.",
    previewImage: "/templates/marxaba/nikoh/templates/sahifa/preview.webp",
    categoryIds: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#9f7551",
    published: false,
  },
  {
    id: "oltin-uzuk",
    name: "Oltin Uzuk",
    description: "Haqiqiy 3D oltin uzuklar.",
    previewImage: "/templates/marxaba/nikoh/templates/oltin-uzuk/preview.webp",
    categoryIds: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#c8a14e",
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
    story: [],
    gallery: [],
    music: { enabled: false, assetId: null, url: "", filename: "" },
    voiceMessage: { enabled: false, assetId: null, url: "", filename: "" },
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
    dressCode: {
      enabled: false,
      style: {},
      text: {},
      note: {},
      colors: [],
    },
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
