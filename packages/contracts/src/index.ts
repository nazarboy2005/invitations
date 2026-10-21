import { z } from "zod";

export const LOCALES = ["uz-Latn", "uz-Cyrl", "en", "ru"] as const;
export const localeSchema = z.enum(LOCALES);
export const EVENT_TYPES = [
  "wedding",
  "birthday",
  "osh",
  "qiz-bazmi",
  "other",
] as const;
export const eventTypeSchema = z.enum(EVENT_TYPES);
export type EventType = z.infer<typeof eventTypeSchema>;
export const EVENT_TYPE_OPTIONS: Array<{ id: EventType; name: string }> = [
  { id: "wedding", name: "Nikoh to‘yi" },
  { id: "birthday", name: "Tug‘ilgan kun" },
  { id: "osh", name: "Nahorgi osh" },
  { id: "qiz-bazmi", name: "Qiz bazmi" },
  { id: "other", name: "Boshqa tadbir" },
];
const LOCALIZED_EVENT_LABELS: Record<Locale, Record<EventType, string>> = {
  "uz-Latn": {
    wedding: "Nikoh to‘yi",
    birthday: "Tug‘ilgan kun",
    osh: "Nahorgi osh",
    "qiz-bazmi": "Qiz bazmi",
    other: "Tadbir",
  },
  "uz-Cyrl": {
    wedding: "Никоҳ тўйи",
    birthday: "Туғилган кун",
    osh: "Наҳорги ош",
    "qiz-bazmi": "Қиз базми",
    other: "Тадбир",
  },
  en: {
    wedding: "Wedding",
    birthday: "Birthday",
    osh: "Morning osh",
    "qiz-bazmi": "Bride’s celebration",
    other: "Celebration",
  },
  ru: {
    wedding: "Свадьба",
    birthday: "День рождения",
    osh: "Утренний ош",
    "qiz-bazmi": "Праздник невесты",
    other: "Праздник",
  },
};
export function defaultEventLabel(
  eventType: EventType,
  locale: Locale,
): string {
  return LOCALIZED_EVENT_LABELS[locale][eventType];
}
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
    eventType: eventTypeSchema,
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
    gift: z.object({
      enabled: z.boolean(),
      receiptUploadEnabled: z.boolean(),
      cardNumber: z.string().max(30),
      cardHolder: short,
    }),
    contacts: z.preprocess(
      (value) => {
        if (!Array.isArray(value)) return value;
        const firstValue = (type: "phone" | "telegram") =>
          value.find(
            (contact) =>
              typeof contact?.value === "string" &&
              contact.type === type &&
              contact.value.trim(),
          )?.value ?? "";
        return {
          phoneNumber: firstValue("phone"),
          telegramUsername: firstValue("telegram"),
        };
      },
      z.object({ phoneNumber: short, telegramUsername: short }),
    ),
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

const DEFAULT_DRESS_CODE: Record<
  Locale,
  { style: string; text: string; note: string; colors: string[] }
> = {
  "uz-Latn": {
    style: "Kechki libos",
    text: "Ayollar uchun uzun kechki ko‘ylak, erkaklar uchun klassik kostyum. Quyidagi ranglardan tanlasangiz, suratlar yanada chiroyli chiqadi.",
    note: "Iltimos, oq libosdan saqlaning — bu kun oq rang kelinniki.",
    colors: ["Shampan", "Pudra", "Zaytun", "To‘q ko‘k", "Bordo"],
  },
  "uz-Cyrl": {
    style: "Кечки либос",
    text: "Аёллар учун узун кечки кўйлак, эркаклар учун классик костюм. Қуйидаги ранглардан танласангиз, суратлар янада чиройли чиқади.",
    note: "Илтимос, оқ либосдан сақланинг — бу кун оқ ранг келинники.",
    colors: ["Шампан", "Пудра", "Зайтун", "Тўқ кўк", "Бордо"],
  },
  en: {
    style: "Evening attire",
    text: "Women: long evening dresses. Men: classic suits. Choosing from the colors below will make the photos look even more beautiful.",
    note: "Please avoid wearing white — white belongs to the bride on this day.",
    colors: ["Champagne", "Powder", "Olive", "Navy", "Burgundy"],
  },
  ru: {
    style: "Вечерний наряд",
    text: "Для женщин — длинные вечерние платья, для мужчин — классические костюмы. Выбирайте цвета из палитры ниже, чтобы фотографии получились ещё красивее.",
    note: "Пожалуйста, не надевайте белое — в этот день белый цвет принадлежит невесте.",
    colors: ["Шампань", "Пудровый", "Оливковый", "Тёмно-синий", "Бордовый"],
  },
};

export function defaultDressCode(): Invitation["dressCode"] {
  const palette = ["#ead7b7", "#d7a7ad", "#78805b", "#243d5a", "#783645"];
  const colors = DEFAULT_DRESS_CODE["uz-Latn"].colors.map((_, index) => ({
    id: `dress-code-color-${index + 1}`,
    name: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        DEFAULT_DRESS_CODE[locale].colors[index],
      ]),
    ),
    hex: palette[index],
  }));
  return {
    enabled: true,
    style: Object.fromEntries(
      LOCALES.map((locale) => [locale, DEFAULT_DRESS_CODE[locale].style]),
    ),
    text: Object.fromEntries(
      LOCALES.map((locale) => [locale, DEFAULT_DRESS_CODE[locale].text]),
    ),
    note: Object.fromEntries(
      LOCALES.map((locale) => [locale, DEFAULT_DRESS_CODE[locale].note]),
    ),
    colors,
  };
}

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
  supportedEventTypes: EventType[];
  priceMinor: number;
  currency: "UZS";
  accent: string;
  published: boolean;
};
export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "anor",
    name: "Anor",
    description: "Anor gullari va Rishton naqshlari uyg‘unligi.",
    previewImage: "preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#7c142b",
    published: true,
  },
  {
    id: "oltin-nur",
    name: "Oltin Nur",
    description: "Qora baxmal va oltin nur.",
    previewImage: "/templates/oltin-nur/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#c6a45b",
    published: false,
  },
  {
    id: "samarqand-kechasi",
    name: "Samarqand Kechasi",
    description: "Registon oqshomi va oltin salyut.",
    previewImage: "/templates/samarqand-kechasi/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#d2a84a",
    published: false,
  },
  {
    id: "bogi-eram",
    name: "Bog‘i Eram",
    description: "O‘ymakor darvoza va jannat bog‘i.",
    previewImage: "/templates/bogi-eram/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#9c6c3a",
    published: false,
  },
  {
    id: "atlas",
    name: "Atlas",
    description: "Zamonaviy atlas va adras ranglari.",
    previewImage: "/templates/atlas/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#c2185b",
    published: false,
  },
  {
    id: "uchar-gilam",
    name: "Uchar Gilam",
    description: "Gilam ustida Buxoro uzra parvoz.",
    previewImage: "/templates/uchar-gilam/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#be8738",
    published: false,
  },
  {
    id: "oq-kabutar",
    name: "Oq Kabutar",
    description: "Oq kabutarlar va ipak lenta.",
    previewImage: "/templates/oq-kabutar/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#9a7957",
    published: false,
  },
  {
    id: "kuzgi-chinor",
    name: "Kuzgi Chinor",
    description: "Oltin kuz va chinor barglari.",
    previewImage: "/templates/kuzgi-chinor/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#a65724",
    published: false,
  },
  {
    id: "muhabbat-kitobi",
    name: "Muhabbat Kitobi",
    description: "Sevgi hikoyasi kitob sahifalarida.",
    previewImage: "/templates/muhabbat-kitobi/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#8a6348",
    published: false,
  },
  {
    id: "sahifa",
    name: "Sahifa",
    description: "Jurnal muqovasidan ilhomlangan taklifnoma.",
    previewImage: "/templates/sahifa/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 15000000,
    currency: "UZS",
    accent: "#9f7551",
    published: false,
  },
  {
    id: "oltin-uzuk",
    name: "Oltin Uzuk",
    description: "Haqiqiy 3D oltin uzuklar.",
    previewImage: "/templates/oltin-uzuk/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
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
export const DEFAULT_WEDDING_INVITATION_MESSAGE =
  "Hayotimizning eng quvonchli kunida — nikoh to‘yimizda — Sizni aziz mehmonimiz sifatida ko‘rishdan baxtiyormiz.";
export function defaultInvitationMessage(
  eventType: EventType,
  locale: Locale,
): string {
  if (eventType !== "wedding") return "";
  return {
    "uz-Latn": DEFAULT_WEDDING_INVITATION_MESSAGE,
    "uz-Cyrl":
      "Ҳаётимизнинг энг қувончли кунида — никоҳ тўйимизда — Сизни азиз меҳмонимиз сифатида кўришдан бахтиёрмиз.",
    en: "We would be delighted to have you with us on the happiest day of our lives—our wedding day.",
    ru: "Будем счастливы видеть вас среди гостей в самый радостный день нашей жизни — в день нашей свадьбы.",
  }[locale];
}
const DEFAULT_GREETINGS: Record<Locale, string> = {
  "uz-Latn": "Assalomu alaykum, aziz mehmon!",
  "uz-Cyrl": "Ассалому алайкум, азиз меҳмон!",
  en: "Hello, dear guest!",
  ru: "Здравствуйте, дорогой гость!",
};
const DEFAULT_INVITATION_TITLES: Record<Locale, string> = {
  "uz-Latn": "Bizning unutilmas kunimiz",
  "uz-Cyrl": "Бизнинг унутилмас кунимиз",
  en: "Our unforgettable day",
  ru: "Наш незабываемый день",
};
const DEFAULT_PROGRAM_HEADINGS: Record<EventType, Record<Locale, string>> = {
  wedding: {
    "uz-Latn": "To‘y dasturi",
    "uz-Cyrl": "Тўй дастури",
    en: "Wedding program",
    ru: "Программа свадьбы",
  },
  birthday: {
    "uz-Latn": "Tug‘ilgan kun dasturi",
    "uz-Cyrl": "Туғилган кун дастури",
    en: "Birthday program",
    ru: "Программа дня рождения",
  },
  osh: {
    "uz-Latn": "Nahorgi osh dasturi",
    "uz-Cyrl": "Наҳорги ош дастури",
    en: "Morning osh program",
    ru: "Программа утреннего оша",
  },
  "qiz-bazmi": {
    "uz-Latn": "Qiz bazmi dasturi",
    "uz-Cyrl": "Қиз базми дастури",
    en: "Bride’s celebration program",
    ru: "Программа праздника невесты",
  },
  other: {
    "uz-Latn": "Tadbir dasturi",
    "uz-Cyrl": "Тадбир дастури",
    en: "Event program",
    ru: "Программа мероприятия",
  },
};
export function defaultLocalizedInvitationContent(
  eventType: EventType,
  locale: Locale,
): InvitationContent {
  return {
    ...emptyContent(),
    title: DEFAULT_INVITATION_TITLES[locale],
    greeting: DEFAULT_GREETINGS[locale],
    message: defaultInvitationMessage(eventType, locale),
    eventLabel: defaultEventLabel(eventType, locale),
    programHeading: DEFAULT_PROGRAM_HEADINGS[eventType][locale],
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
    gift: {
      enabled: false,
      receiptUploadEnabled: false,
      cardNumber: "",
      cardHolder: "",
    },
    contacts: { phoneNumber: "", telegramUsername: "" },
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
  const content = defaultLocalizedInvitationContent(
    invitation.eventType,
    locale,
  );
  return {
    ...invitation,
    enabledLocales: [...invitation.enabledLocales, locale],
    content: { ...invitation.content, [locale]: content },
  };
}
export function removeLanguage(
  invitation: Invitation,
  locale: Locale,
): Invitation {
  if (
    invitation.enabledLocales.length <= 1 ||
    locale === invitation.defaultLocale ||
    !invitation.enabledLocales.includes(locale)
  )
    return invitation;

  const content = { ...invitation.content };
  delete content[locale];
  const removeLocale = <T extends Partial<Record<Locale, unknown>>>(
    value: T,
  ): T => {
    const copy = { ...value };
    delete copy[locale];
    return copy;
  };
  return {
    ...invitation,
    enabledLocales: invitation.enabledLocales.filter((item) => item !== locale),
    content,
    story: invitation.story.map((chapter) => ({
      ...chapter,
      title: removeLocale(chapter.title),
      text: removeLocale(chapter.text),
    })),
    dressCode: {
      ...invitation.dressCode,
      style: removeLocale(invitation.dressCode.style),
      text: removeLocale(invitation.dressCode.text),
      note: removeLocale(invitation.dressCode.note),
      colors: invitation.dressCode.colors.map((color) => ({
        ...color,
        name: removeLocale(color.name),
      })),
    },
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
