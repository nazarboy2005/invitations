import { z } from "zod";

export const LOCALES = ["uz-Latn", "uz-Cyrl", "en", "ru"] as const;
export const localeSchema = z.enum(LOCALES);
export const EVENT_TYPES = [
  "wedding",
  "birthday",
  "yubiley",
  "osh",
  "iftorlik",
  "qiz-bazmi",
  "fotiha",
  "qiz-uzatish",
  "sunnat-toyi",
  "beshik-toyi",
  "bitiruv",
  "korporativ",
  "yangi-uy",
  "other",
] as const;
export const eventTypeSchema = z.enum(EVENT_TYPES);
export type EventType = z.infer<typeof eventTypeSchema>;
export const EVENT_TYPE_OPTIONS: Array<{ id: EventType; name: string }> = [
  { id: "wedding", name: "Nikoh to‘yi" },
  { id: "birthday", name: "Tug‘ilgan kun" },
  { id: "yubiley", name: "Yubiley" },
  { id: "osh", name: "Nahorgi osh" },
  { id: "iftorlik", name: "Iftorlik" },
  { id: "qiz-bazmi", name: "Qiz bazmi" },
  { id: "fotiha", name: "Fotiha" },
  { id: "qiz-uzatish", name: "Qiz uzatish" },
  { id: "sunnat-toyi", name: "Sunnat to‘yi" },
  { id: "beshik-toyi", name: "Beshik to‘yi" },
  { id: "bitiruv", name: "Bitiruv kechasi" },
  { id: "korporativ", name: "Korporativ tadbir" },
  { id: "yangi-uy", name: "Yangi uy to‘yi" },
  { id: "other", name: "Boshqa tadbir" },
];
const LOCALIZED_EVENT_LABELS: Record<Locale, Record<EventType, string>> = {
  "uz-Latn": {
    wedding: "Nikoh to‘yi",
    birthday: "Tug‘ilgan kun",
    yubiley: "Yubiley",
    osh: "Nahorgi osh",
    iftorlik: "Iftorlik",
    "qiz-bazmi": "Qiz bazmi",
    fotiha: "Fotiha",
    "qiz-uzatish": "Qiz uzatish",
    "sunnat-toyi": "Sunnat to‘yi",
    "beshik-toyi": "Beshik to‘yi",
    bitiruv: "Bitiruv kechasi",
    korporativ: "Korporativ tadbir",
    "yangi-uy": "Yangi uy to‘yi",
    other: "Tadbir",
  },
  "uz-Cyrl": {
    wedding: "Никоҳ тўйи",
    birthday: "Туғилган кун",
    yubiley: "Юбилей",
    osh: "Наҳорги ош",
    iftorlik: "Ифторлик",
    "qiz-bazmi": "Қиз базми",
    fotiha: "Фотиҳа",
    "qiz-uzatish": "Қиз узатиш",
    "sunnat-toyi": "Суннат тўйи",
    "beshik-toyi": "Бешик тўйи",
    bitiruv: "Битирув кечаси",
    korporativ: "Корпоратив тадбир",
    "yangi-uy": "Янги уй тўйи",
    other: "Тадбир",
  },
  en: {
    wedding: "Wedding",
    birthday: "Birthday",
    yubiley: "Anniversary",
    osh: "Morning osh",
    iftorlik: "Iftar gathering",
    "qiz-bazmi": "Bride’s celebration",
    fotiha: "Engagement ceremony",
    "qiz-uzatish": "Bride send-off",
    "sunnat-toyi": "Circumcision celebration",
    "beshik-toyi": "Cradle celebration",
    bitiruv: "Graduation celebration",
    korporativ: "Corporate event",
    "yangi-uy": "Housewarming celebration",
    other: "Celebration",
  },
  ru: {
    wedding: "Свадьба",
    birthday: "День рождения",
    yubiley: "Юбилей",
    osh: "Утренний ош",
    iftorlik: "Ифтар",
    "qiz-bazmi": "Праздник невесты",
    fotiha: "Помолвка",
    "qiz-uzatish": "Проводы невесты",
    "sunnat-toyi": "Суннат-той",
    "beshik-toyi": "Праздник в честь колыбели",
    bitiruv: "Выпускной вечер",
    korporativ: "Корпоративное мероприятие",
    "yangi-uy": "Новоселье",
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
  programDescriptions: z.record(z.string(), text).default({}),
});
export type InvitationContent = z.infer<typeof contentSchema>;
const localizedShortText = z.partialRecord(localeSchema, short);
const localizedLongText = z.partialRecord(localeSchema, text);
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (typeof value === "object") return Object.values(value).every(isJsonValue);
  return false;
}
const pulauLocalizedText = z.partialRecord(localeSchema, text);
export const sakuraDataSchema = z.object({contactNote:localizedLongText.default({}),infoNote:localizedLongText.default({}),footerNote:localizedLongText.default({})}).default({contactNote:{},infoNote:{},footerNote:{}});
export const qogozDataSchema = z.object({contactNote:localizedLongText.default({}),footerNote:localizedLongText.default({})}).default({contactNote:{},footerNote:{}});
export const pariDataSchema = z.object({arrivalNote:localizedLongText.default({}),programLabels:z.record(z.string().min(1).max(100),localizedShortText).default({})}).default({arrivalNote:{},programLabels:{}});
export const osmonDataSchema = z.object({rsvpNote:localizedLongText.default({}),giftNote:localizedLongText.default({})}).default({rsvpNote:{},giftNote:{}});
export const oltinYolDataSchema = z.object({arrivalNote:localizedLongText.default({}),giftNote:localizedLongText.default({}),contactNote:localizedLongText.default({}),footerNote:localizedLongText.default({})}).default({arrivalNote:{},giftNote:{},contactNote:{},footerNote:{}});
export const mountainDataSchema = z.object({ceremonyTime:z.string().max(80).default(""),celebrationTime:z.string().max(80).default("")}).default({ceremonyTime:"",celebrationTime:""});
export const zarrinDataSchema = z.object({brideFamily:localizedLongText.default({}),groomFamily:localizedLongText.default({}),stayText:localizedLongText.default({}),footerNote:localizedLongText.default({}),hashtag:z.string().max(100).default("")}).default({brideFamily:{},groomFamily:{},stayText:{},footerNote:{},hashtag:""});
export const gulbogDataSchema = z.object({brideFamily:localizedLongText.default({}),reminderTitle:localizedShortText.default({}),reminderText:localizedLongText.default({}),footerNote:localizedLongText.default({})}).default({brideFamily:{},reminderTitle:{},reminderText:{},footerNote:{}});
export const fayzliXonadonDataSchema = z.object({
  menu: z.array(z.object({id:z.string().min(1).max(100),label:localizedShortText.default({}),name:localizedShortText.default({}),description:localizedLongText.default({})})).max(12).default([]),
}).default({menu:[]});
export const yubileySahifasiDataSchema = z.object({
  years: z.number().int().min(1).max(999).nullable().default(null),
  founderRole: localizedShortText.default({}),
  storyYears: z.record(z.string().max(100), z.string().max(30)).default({}),
  statistics: z.array(z.object({ id: z.string().min(1).max(100), value: z.string().max(30), label: localizedShortText.default({}) })).max(8).default([]),
}).default({years:null,founderRole:{},storyYears:{},statistics:[]});
export const muhrliMaktubDataSchema = z.object({
  flowersNote: z.partialRecord(localeSchema, z.string().max(1000)).optional(),
}).default({});
export const pulauSehatiDataSchema = z.object({
  inscription: z.object({ arabic: z.string().max(4000), text: pulauLocalizedText, attribution: pulauLocalizedText }).default({ arabic: "", text: {}, attribution: {} }),
  profiles: z.array(z.object({ bio: pulauLocalizedText, characterClass: short, origin: short, stats: z.array(z.object({ label: short, value: z.number().int().min(0).max(10) })).max(6), skill: short, item: short })).length(2).default([{ bio: {}, characterClass: "", origin: "", stats: [], skill: "", item: "" }, { bio: {}, characterClass: "", origin: "", stats: [], skill: "", item: "" }]),
  hotels: z.array(z.object({ name: short, address: z.string().max(1000), distance: short, price: short, bookingUrl: safeUrl, note: z.string().max(1000) })).max(2).default([]),
  media: z.object({ videoUrl: safeUrl, liveUrl: safeUrl, intro: z.string().max(1000) }).default({ videoUrl: "", liveUrl: "", intro: "" }),
  giftWell: z.object({ enabled: z.boolean(), currencyLabel: short }).default({ enabled: false, currencyLabel: "UZS" }),
  secondaryEvent: z.object({ enabled: z.boolean(), date: z.string().max(50), time: z.string().max(10), label: short, venueName: short, address: z.string().max(1000), mapUrl: safeUrl }).default({ enabled: false, date: "", time: "", label: "", venueName: "", address: "", mapUrl: "" }),
  storyDates: z.record(z.string().max(100), z.string().max(50)).default({}),
  coInviters: z.string().max(1000).default(""),
  missions: z.array(z.object({ title: short, description: z.string().max(1000), reward: short })).max(5).default([]),
  keepsakes: z.array(z.object({ name: short, anecdote: z.string().max(1000), icon: z.enum(["tiket", "stik", "surat", "kerang", "kunci", "cincin", "bunga", "kamera"]) })).max(6).default([]),
  hashtag: z.string().max(100).default(""),
}).default({ inscription: { arabic: "", text: {}, attribution: {} }, profiles: [{ bio: {}, characterClass: "", origin: "", stats: [], skill: "", item: "" }, { bio: {}, characterClass: "", origin: "", stats: [], skill: "", item: "" }], hotels: [], media: { videoUrl: "", liveUrl: "", intro: "" }, giftWell: { enabled: false, currencyLabel: "UZS" }, secondaryEvent: { enabled: false, date: "", time: "", label: "", venueName: "", address: "", mapUrl: "" }, storyDates: {}, coInviters: "", missions: [], keepsakes: [], hashtag: "" });
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
export const invitationArtistSchema = z.object({
  id: z.string().min(1).max(100),
  name: localizedShortText.default({}),
  role: localizedShortText.default({}),
  imageUrl: safeUrl.default(""),
  imageAssetId: z.string().max(100).nullable().default(null),
});
export const invitationSchema = z
  .object({
    version: z.literal(1),
    revision: z.number().int().min(1).default(1),
    id: z.string().min(1).max(100),
    templateId: invitationTemplateIdSchema,
    templateData: z.record(z.string(), z.custom<JsonValue>(isJsonValue)).default({}).superRefine((data, ctx) => {
      if (data["taklifla-sakura-guli"] !== undefined && !sakuraDataSchema.safeParse(data["taklifla-sakura-guli"]).success) ctx.addIssue({code:"custom",path:["taklifla-sakura-guli"],message:"Invalid sakura notes"});
      if (data["taklifla-qogoz-ertagi"] !== undefined && !qogozDataSchema.safeParse(data["taklifla-qogoz-ertagi"]).success) ctx.addIssue({code:"custom",path:["taklifla-qogoz-ertagi"],message:"Invalid paper invitation notes"});
      if (data["taklifla-parilar-ertagi"] !== undefined && !pariDataSchema.safeParse(data["taklifla-parilar-ertagi"]).success) ctx.addIssue({code:"custom",path:["taklifla-parilar-ertagi"],message:"Invalid fairy invitation details"});
      if (data["taklifla-osmon"] !== undefined && !osmonDataSchema.safeParse(data["taklifla-osmon"]).success) ctx.addIssue({code:"custom",path:["taklifla-osmon"],message:"Invalid sky notes"});
      if (data["taklifla-oltin-yol"] !== undefined && !oltinYolDataSchema.safeParse(data["taklifla-oltin-yol"]).success) ctx.addIssue({code:"custom",path:["taklifla-oltin-yol"],message:"Invalid railway notes"});
      if (data["taklifla-toglar-bagrida"] !== undefined && !mountainDataSchema.safeParse(data["taklifla-toglar-bagrida"]).success) ctx.addIssue({code:"custom",path:["taklifla-toglar-bagrida"],message:"Invalid mountain scene times"});
      if (data["taklifla-zarrin-gullar"] !== undefined && !zarrinDataSchema.safeParse(data["taklifla-zarrin-gullar"]).success) ctx.addIssue({code:"custom",path:["taklifla-zarrin-gullar"],message:"Invalid marigold details"});
      if (data["taklifla-gulbog"] !== undefined && !gulbogDataSchema.safeParse(data["taklifla-gulbog"]).success) ctx.addIssue({code:"custom",path:["taklifla-gulbog"],message:"Invalid garden details"});
      if (data["taklifla-fayzli-xonadon"] !== undefined && !fayzliXonadonDataSchema.safeParse(data["taklifla-fayzli-xonadon"]).success) ctx.addIssue({code:"custom",path:["taklifla-fayzli-xonadon"],message:"Invalid housewarming menu"});
      if (data["taklifla-yubiley-sahifasi"] !== undefined && !yubileySahifasiDataSchema.safeParse(data["taklifla-yubiley-sahifasi"]).success) ctx.addIssue({ code:"custom", path:["taklifla-yubiley-sahifasi"], message:"Invalid anniversary details" });
      if (data["taklifla-muhrli-maktub"] !== undefined) {
        const checked = muhrliMaktubDataSchema.safeParse(data["taklifla-muhrli-maktub"]);
        if (!checked.success) ctx.addIssue({ code: "custom", path: ["taklifla-muhrli-maktub"], message: "Invalid Muhrli Maktub data" });
      }
      if (data["wedivo-pulau-sehati"] !== undefined) {
        const checked = pulauSehatiDataSchema.safeParse(data["wedivo-pulau-sehati"]);
        if (!checked.success) ctx.addIssue({ code: "custom", path: ["wedivo-pulau-sehati"], message: "Invalid Pulau Sehati data" });
      }
    }),
    status: z.enum(["draft", "published"]),
    // Assigned exclusively by the publication service. Optional for older drafts.
    slug: z
      .string()
      .regex(/^[0-9A-Za-z]{6}$/)
      .optional(),
    defaultLocale: localeSchema,
    enabledLocales: z.array(localeSchema).min(1).max(4),
    content: z.record(z.string(), contentSchema),
    eventType: eventTypeSchema,
    celebrantAge: z.number().int().min(1).max(120).nullable().default(null),
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
    artistLineup: z.array(invitationArtistSchema).max(50).default([]),
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
        const firstValue = (type: "phone" | "telegram" | "instagram") =>
          value.find(
            (contact) =>
              typeof contact?.value === "string" &&
              contact.type === type &&
              contact.value.trim(),
          )?.value ?? "";
        return {
          phoneNumber: firstValue("phone"),
          telegramUsername: firstValue("telegram"),
          instagramUrl: firstValue("instagram"),
        };
      },
      z.object({
        phoneNumber: short,
        telegramUsername: short,
        instagramUrl: short.default(""),
      }),
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
  { id: "iftorlik", name: "Iftorlik", position: 5 },
  { id: "yangi-uy", name: "Yangi uy", position: 6 },
];
export type TemplateDefinition = {
  id: z.infer<typeof templateIdSchema>;
  name: string;
  description: string;
  /** Exact catalog artwork supplied by this template's source, when available. */
  previewImage?: string;
  /** Preferred event type for the ephemeral catalog/empty-selection sample. */
  previewEventType?: EventType;
  categoryIds: string[];
  supportedEventTypes: EventType[];
  priceMinor: number;
  currency: "UZS";
  accent: string;
  published: boolean;
};
export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "wedivo-pulau-sehati",
    name: "Ko‘ngillar oroli",
    description: "Sayr, kashfiyot va o‘z hikoyangiz bilan bezatilgan interaktiv to‘y taklifnomasi.",
    previewImage: "/templates/wedivo-pulau-sehati/preview.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#35b7d6",
    published: false,
  },
  {
    id: "oltin-darvoza-ortidagi-baxt",
    name: "Oltin darvoza ortidagi baxt",
    description:
      "Oltin naqshli darvoza, gullar va kinematik ochilish bilan bezatilgan taklifnoma.",
    previewImage:
      "/templates/onlinetaklifnoma-oltin-darvoza-ortidagi-baxt/source/assets/dd2fe7c942f5a910.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#a88c5a",
    published: false,
  },
  {
    id: "gulli-darvoza",
    name: "Gulli darvoza",
    description:
      "Gulli darvoza va romantik video ochilishiga ega to‘y taklifnomasi.",
    previewImage:
      "/templates/onlinetaklifnoma-gulli-darvoza/source/assets/gate-thumb.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#a9824a",
    published: false,
  },
  {
    id: "ming-bir-kecha",
    name: "Ming bir kecha",
    description:
      "Tungi binafsha ranglar, oltin yoysimon naqsh va yulduzlar ostidagi taklifnoma.",
    previewImage:
      "/templates/onlinetaklifnoma-ming-bir-kecha/source/assets/71a55bb0516b6064.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#eabb62",
    published: false,
  },
  {
    id: "andalus-darvozasi",
    name: "Andalus darvozasi",
    description: "A source-faithful Andalusian doorway wedding invitation.",
    previewImage:
      "/templates/onlinetaklifnoma-andalus-darvozasi/source/assets/1d10c6e525d2c33c.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#e2b65e",
    published: false,
  },
  {
    id: "samarqand-peshtoqi",
    name: "Samarqand peshtoqi",
    description: "A source-faithful Registan portal wedding invitation.",
    previewImage:
      "/templates/onlinetaklifnoma-samarqand-peshtoqi/source/assets/portal.8f988e1a927420cc.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#b3842f",
    published: false,
  },
  {
    id: "shisha-bog",
    name: "Shisha bogʻ",
    description:
      "A source-faithful candlelit glass conservatory wedding invitation.",
    previewImage:
      "/templates/onlinetaklifnoma-shisha-bog/source/assets/portal.5a918f2300357ece.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#b58a3c",
    published: false,
  },
  {
    id: "kapadokiya-tongi",
    name: "Kapadokiya tongi",
    description:
      "A source-faithful rose-and-burgundy Cappadocia sunrise invitation.",
    previewImage:
      "/templates/onlinetaklifnoma-kapadokiya-tongi/source/assets/e924b6a0555070ae.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#a3263a",
    published: false,
  },
  {
    id: "buxoro-ravoq",
    name: "Buxoro ravoq",
    description:
      "A source-faithful Bukhara blue-and-gold portal wedding invitation.",
    previewImage:
      "/templates/onlinetaklifnoma-buxoro-ravoq/source/assets/portal-thumb.0e723b5657296b74.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c9973f",
    published: false,
  },
  {
    id: "jannat-bogi",
    name: "Jannat bogʻi",
    description: "A source-faithful floral paradise gate wedding invitation.",
    previewImage:
      "/templates/onlinetaklifnoma-jannat-bogi/source/assets/e32742ca7893c3a2.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#d4113f",
    published: false,
  },
  {
    id: "tojmahal-oltin-darvozasi",
    name: "Tojmahal oltin darvozasi",
    description:
      "A source-faithful Taj Mahal gate invitation in midnight blue and pale gold.",
    previewImage:
      "/templates/onlinetaklifnoma-tojmahal-oltin-darvozasi/source/assets/247f19e46f38efab.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#cdcd98",
    published: false,
  },
  {
    id: "zarrin-doppi",
    name: "Zarrin do‘ppi",
    description:
      "To‘q ko‘k doppi girihi, yulduzlar va tillarang naqshlar bilan sunnat to‘yi taklifnomasi.",
    previewImage:
      "/templates/onlinetaklifnoma-zarrin-doppi/source/assets/doppi-girih.svg",
    previewEventType: "sunnat-toyi",
    categoryIds: ["other"],
    supportedEventTypes: ["sunnat-toyi"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#d9b25f",
    published: false,
  },
  {
    id: "fairy",
    name: "Fairy",
    description:
      "Olive va oltin ranglar, nafis yurak bezaklari va romantik to‘y taklifnomasi.",
    previewImage: "/templates/fairy/preview.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#9c9869",
    published: true,
  },
  {
    id: "butterfly",
    name: "Butterfly",
    description:
      "Pushti kapalaklar, nafis gullar va romantik to‘y taklifnomasi.",
    previewImage: "/templates/butterfly/preview.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#d64d89",
    published: true,
  },
  {
    id: "girlsparty",
    name: "Girls Party",
    description:
      "Qizlar bazmi uchun video va gul yaproqlari bilan bezatilgan taklifnoma.",
    previewImage: "/templates/girlsparty/preview.png",
    previewEventType: "qiz-bazmi",
    categoryIds: ["qiz-bazmi"],
    supportedEventTypes: ["qiz-bazmi"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#d4637a",
    published: false,
  },
  {
    id: "estelle",
    name: "Estelle",
    description:
      "Классический дизайн со скретч-открытием даты и видео-приглашением.",
    previewImage: "/templates/estelle/preview.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#1b3a5c",
    published: false,
  },
  {
    id: "velora",
    name: "Velora",
    description: "Moviy ohanglar va nafis bezaklardagi to‘y taklifnomasi.",
    previewImage: "/templates/velora/preview.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#45607f",
    published: true,
  },
  {
    id: "velvet",
    name: "Velvet",
    description: "Velvet ranglar va video ochilishiga ega to‘y taklifnomasi.",
    previewImage: "/templates/velvet/preview.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#80505e",
    published: false,
  },
  {
    id: "aurelia",
    name: "Aurelia",
    description:
      "Tillarang bezaklar va nafis bulutlar orasidagi to‘y taklifnomasi.",
    previewImage: "/templates/aurelia/preview.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#b99a65",
    published: true,
  },
  {
    id: "evelina",
    name: "Evelina",
    description: "Nozik gul naqshlari, shaffof kristallar va romantik oqshom.",
    previewImage: "/templates/evelina/preview.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#a2865c",
    published: true,
  },
  {
    id: "anor",
    name: "Anor",
    description: "Anor gullari va Rishton naqshlari uyg‘unligi.",
    previewImage: "preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
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
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c6a45b",
    published: true,
  },
  {
    id: "samarqand-kechasi",
    name: "Samarqand Kechasi",
    description: "Registon oqshomi va oltin salyut.",
    previewImage: "/templates/samarqand-kechasi/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#d2a84a",
    published: true,
  },
  {
    id: "bogi-eram",
    name: "Bog‘i Eram",
    description: "O‘ymakor darvoza va jannat bog‘i.",
    previewImage: "/templates/bogi-eram/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#9c6c3a",
    published: true,
  },
  {
    id: "atlas",
    name: "Atlas",
    description: "Zamonaviy atlas va adras ranglari.",
    previewImage: "/templates/atlas/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c2185b",
    published: true,
  },
  {
    id: "uchar-gilam",
    name: "Uchar Gilam",
    description: "Gilam ustida Buxoro uzra parvoz.",
    previewImage: "/templates/uchar-gilam/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#be8738",
    published: false,
  },
  {
    id: "oq-kabutar",
    name: "Oq Kabutar",
    description: "Oq kabutarlar va ipak lenta.",
    previewImage: "/templates/oq-kabutar/preview-opening.png",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
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
    priceMinor: 100000,
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
    priceMinor: 100000,
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
    priceMinor: 100000,
    currency: "UZS",
    accent: "#9f7551",
    published: true,
  },
  {
    id: "oltin-uzuk",
    name: "Oltin Uzuk",
    description: "Haqiqiy 3D oltin uzuklar.",
    previewImage: "/templates/oltin-uzuk/catalog-cover-opening.png",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c8a14e",
    published: false,
  },
  {
    id: "oynavand",
    name: "Oynavand",
    description: "Oynakori gumbaz va ko‘zgu parchalari.",
    previewImage: "/templates/oynavand/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#3fb7b0",
    published: true,
  },
  {
    id: "somon-yoli",
    name: "Somon Yo‘li",
    description: "Ismlaringiz yulduzlar turkumida.",
    previewImage: "/templates/somon-yoli/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#4b2a7a",
    published: true,
  },
  {
    id: "qogoz-turna",
    name: "Qog‘oz Turna",
    description: "Qat-qat ochiladigan nafis taklifnoma.",
    previewImage: "/templates/qogoz-turna/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c9785a",
    published: true,
  },
  {
    id: "nilufar",
    name: "Nilufar",
    description: "Nilufar hovuzi va sokin suv manzarasi.",
    previewImage: "/templates/nilufar/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#7fa99b",
    previewEventType: "fotiha",
    published: true,
  },
  {
    id: "monogram",
    name: "Monogram",
    description: "Qora galstuk uslubidagi nafis monogramma.",
    previewImage: "/templates/monogram/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c9b183",
    published: true,
  },
  {
    id: "retro-kino",
    name: "Retro Kino",
    description: "Kino tasmasi va klassik premyera muhiti.",
    previewImage: "/templates/retro-kino/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#b3262e",
    published: true,
  },
  {
    id: "suzani",
    name: "Suzani",
    description: "Har bir chokda mehr, har bir naqshda xotira.",
    previewImage: "/templates/suzani/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#a8262b",
    published: true,
  },
  {
    id: "orik-guli",
    name: "O‘rik Guli",
    description: "Bahoriy bog‘ va o‘rik gullaridan ilhomlangan taklifnoma.",
    previewImage: "/templates/orik-guli/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha", "qiz-uzatish"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c06478",
    published: true,
  },
  {
    id: "paxta",
    name: "Paxta",
    description: "Oq oltin — sokin hashamat.",
    previewImage: "/templates/paxta/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#d9c7ae",
    published: true,
  },
  {
    id: "sahro-fonusi",
    name: "Sahro Fonusi",
    description: "Oltin qumlar uzra chiroqlar oqshomi.",
    previewImage: "/templates/sahro-fonusi/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#e8743b",
    published: true,
  },
  {
    id: "vals",
    name: "Vals",
    description: "Kinematik vals va oy nuridagi bal zali.",
    previewImage: "/templates/vals/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c9a050",
    published: true,
  },
  {
    id: "toscana",
    name: "Toscana",
    description: "Gul archadan boshlanadigan romantik Toskana to‘y kuni.",
    previewImage: "/templates/toscana/art/aisle.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#a3ad92",
    published: true,
  },
  {
    id: "muhr",
    name: "Muhr",
    description: "Bo‘rtma muhrli maktub tonggi bog‘ga ochiladi.",
    previewImage: "/templates/muhr/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha", "qiz-uzatish"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#7a1b2a",
    published: true,
  },
  {
    id: "bulbul",
    name: "Bulbul",
    description: "Tonggi bulbul va oltin qafas gullagan bog‘ga yo‘l ochadi.",
    previewImage: "/templates/bulbul/catalog-cover-opening.png",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha", "qiz-uzatish"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c19a57",
    published: true,
  },
  {
    id: "kozgu",
    name: "Ko‘zgu",
    description:
      "Qadimiy ko‘zguda ismlar paydo bo‘lib, oy bog‘iga yo‘l ochiladi.",
    previewImage: "/templates/kozgu/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "qiz-bazmi", "fotiha"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#93324c",
    published: true,
  },
  {
    id: "doira",
    name: "Doira",
    description: "Uch zarb. Unutilmas oqshom.",
    previewImage: "/templates/doira/preview.png",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "sunnat-toyi"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#d9a74a",
    published: true,
  },
  {
    id: "qandil",
    name: "Qandil",
    description: "Mis naqshlari va yulduzlar yog‘dusidagi Buxoro oqshomi.",
    previewImage: "/templates/qandil/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha", "qiz-uzatish"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#d2a457",
    published: true,
  },
  {
    id: "parda",
    name: "Parda",
    description: "Oltin kashtali parda ortida bog‘ oqshomi ochiladi.",
    previewImage: "/templates/parda/preview-browser-capture.jpg",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha", "qiz-uzatish"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#a5262a",
    published: true,
  },
  {
    id: "ganch",
    name: "Ganch",
    description: "Naqshli eshiklardan quyoshli Buxoro hovlisiga.",
    previewImage: "/templates/ganch/preview-browser-capture.jpg",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "fotiha", "qiz-bazmi"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#aa8a54",
    published: true,
  },
  {
    id: "qatlam",
    name: "Qatlam",
    description: "Zarhal kitob muqovasidan qatlam-qatlam Samarqand ochiladi.",
    previewImage: "/templates/qatlam/preview.webp",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding", "qiz-bazmi", "fotiha"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#2c575b",
    published: true,
  },
  {
    id: "lola",
    name: "Lola",
    description:
      "Lolalar va bahor ranglaridan ilhomlangan qiz uzatish taklifnomasi.",
    previewImage: "/templates/lola/preview.webp",
    categoryIds: ["qiz-bazmi"],
    supportedEventTypes: ["qiz-uzatish", "fotiha"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#e07a5f",
    published: true,
  },
  {
    id: "qiz-bazmi",
    name: "Qiz Bazmi",
    description: "Xina naqshlari va atlas jilosi bilan kelin oqshomi.",
    previewImage: "/templates/qiz-bazmi/preview.webp",
    categoryIds: ["qiz-bazmi"],
    supportedEventTypes: ["qiz-uzatish", "fotiha", "birthday"],
    previewEventType: "qiz-uzatish",
    priceMinor: 100000,
    currency: "UZS",
    accent: "#7a3b1e",
    published: true,
  },
  {
    id: "shahzoda",
    name: "Shahzoda",
    description: "Ko‘k va oltin ranglardagi sunnat to‘yi taklifnomasi.",
    previewImage: "/templates/shahzoda/preview.webp",
    categoryIds: ["other"],
    supportedEventTypes: ["sunnat-toyi"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#14213d",
    published: true,
  },
  {
    id: "chavandoz",
    name: "Chavandoz",
    description: "Atlas chodiridagi sehrli sunnat to‘yi taklifnomasi.",
    previewImage: "/templates/chavandoz/preview.webp",
    categoryIds: ["other"],
    supportedEventTypes: ["sunnat-toyi", "birthday"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#1d3a8a",
    published: true,
  },
  {
    id: "beshik",
    name: "Beshik",
    description: "Alla ohangidagi beshik to‘yi taklifnomasi.",
    previewImage: "/templates/beshik/preview.webp",
    categoryIds: ["other"],
    supportedEventTypes: ["beshik-toyi", "birthday"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#2B3A67",
    published: true,
  },
  {
    id: "shirin-bayram",
    name: "Shirin Bayram",
    description: "Shamlar, sharlar va shirin tabassumlar.",
    previewImage: "/templates/shirin-bayram/preview.webp",
    categoryIds: ["birthday"],
    supportedEventTypes: ["birthday"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#ff8fb1",
    published: true,
  },
  {
    id: "oltin-kuz",
    name: "Oltin Kuz",
    description: "Oltin kuz ohangidagi yubiley taklifnomasi.",
    previewImage: "/templates/oltin-kuz/preview.webp",
    categoryIds: ["birthday"],
    supportedEventTypes: ["yubiley", "birthday"],
    previewEventType: "birthday",
    priceMinor: 100000,
    currency: "UZS",
    accent: "#9b7b42",
    published: true,
  },
  {
    id: "oltin-yosh",
    name: "Oltin Yosh",
    description: "Yorqin va quvnoq yubiley taklifnomasi.",
    previewImage: "/templates/oltin-yosh/preview.webp",
    categoryIds: ["birthday"],
    supportedEventTypes: ["yubiley", "birthday"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c48b35",
    published: true,
  },
  {
    id: "konfetti",
    name: "Konfetti",
    description: "Shamlar va konfetti bilan zamonaviy bayram taklifnomasi.",
    previewImage: "/templates/konfetti/preview.webp",
    categoryIds: ["birthday"],
    supportedEventTypes: ["birthday", "yubiley"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#b8a4ff",
    published: true,
  },
  {
    id: "nahor",
    name: "Nahor",
    description: "Tonggi mahalla fayzidagi nahorgi osh taklifnomasi.",
    previewImage: "/templates/nahor/preview.webp",
    categoryIds: ["osh"],
    supportedEventTypes: ["osh"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#e8b04a",
    published: true,
  },
  {
    id: "nahorgi-osh",
    name: "Nahorgi Osh",
    description: "Tong nafasi bilan boshlangan ezgu davra.",
    previewImage: "/templates/nahorgi-osh/preview.webp",
    categoryIds: ["osh"],
    supportedEventTypes: ["osh", "sunnat-toyi", "wedding"],
    previewEventType: "osh",
    priceMinor: 100000,
    currency: "UZS",
    accent: "#e1a23b",
    published: true,
  },
  {
    id: "hilol",
    name: "Hilol",
    description: "Hilol naqshlari bilan fayzli iftorlik taklifnomasi.",
    previewImage: "/templates/hilol/preview.webp",
    previewEventType: "iftorlik",
    categoryIds: ["iftorlik"],
    supportedEventTypes: ["iftorlik", "osh"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#cda456",
    published: true,
  },
  {
    id: "bitiruv",
    name: "Bitiruv",
    description: "Yilnomadek unutilmas bitiruv oqshomi.",
    previewImage: "/templates/bitiruv/preview.webp",
    previewEventType: "bitiruv",
    categoryIds: ["other"],
    supportedEventTypes: ["bitiruv", "birthday", "korporativ"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#fca311",
    published: true,
  },
  {
    id: "korporativ",
    name: "Korporativ",
    description: "Aniq, texnologik va tantanavor tadbir taklifnomasi.",
    previewImage: "/templates/korporativ/preview.webp",
    previewEventType: "korporativ",
    categoryIds: ["other"],
    supportedEventTypes: ["korporativ", "bitiruv", "yubiley"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#4f7cff",
    published: true,
  },
  {
    id: "yangi-uy",
    name: "Yangi Uy",
    description: "Yangi xonadon quvonchini yaqinlaringiz bilan nishonlang.",
    previewImage: "/templates/yangi-uy/catalog-cover-opening.png",
    previewEventType: "yangi-uy",
    categoryIds: ["yangi-uy"],
    supportedEventTypes: ["yangi-uy", "osh"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c96f4a",
    published: true,
  },
  {
    id: "golden-card",
    name: "Golden Card",
    description:
      "Midnight blue and gold ornamental invitation with a folding-card reveal.",
    previewImage: "/templates/golden-card/preview-browser-capture.jpg",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#b57729",
    published: true,
  },
  {
    id: "green-garden",
    name: "Green Garden",
    description: "Shisha bog‘, nafis gullar va yashil ranglardagi taklifnoma.",
    previewImage: "/templates/green-garden/catalog-cover-opening.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#47613e",
    published: false,
  },
  {
    id: "green-gold",
    name: "Green Gold",
    description:
      "Gold ornaments and deep green tones for a wedding invitation.",
    previewImage: "/templates/green-gold/catalog-cover-opening.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#b99a42",
    published: false,
  },
  {
    id: "green-white",
    name: "Green White",
    description:
      "A botanical white-and-green wedding invitation with a dress-code palette.",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#667248",
    previewImage: "/templates/green-white/preview-opening.png",
    published: true,
  },
  {
    id: "jasmine-white",
    name: "Jasmine White",
    description:
      "An ivory and botanical wedding invitation with jasmine ornaments.",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#404a1d",
    previewImage: "/templates/jasmine-white/preview.png",
    published: true,
  },
  {
    id: "lace",
    name: "Lace",
    description:
      "A burgundy lace wedding invitation with pearl details and an animated cover.",
    previewImage: "/templates/lace/assets/bellagio-2-poster.jpg",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#6f2a3b",
    published: true,
  },
  {
    id: "love-sakura",
    name: "Love Sakura",
    description: "A romantic sakura wedding invitation with a blush palette.",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#df9c9b",
    previewImage: "/templates/love-sakura/catalog-opening.png",
    published: true,
  },
  {
    id: "luxury-gold",
    name: "Luxury Gold",
    description:
      "A dark, gold-accented wedding invitation with a refined layout.",
    previewImage: "/templates/luxury-gold/catalog-opening.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c8a45b",
    published: false,
  },
  {
    id: "modern-floral",
    name: "Modern Floral",
    description:
      "A soft floral wedding invitation with a modern botanical style.",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#b8797d",
    previewImage: "/templates/modern-floral/catalog-opening.jpg",
    published: true,
  },
  {
    id: "taklifla-zarhal-sahifa",
    name: "Zarhal Sahifa",
    description: "Zarhal bezaklar, nafis gullar va sayohat ohangidagi nikoh taklifnomasi.",
    previewImage: "/templates/taklifla-zarhal-sahifa/preview.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 150000,
    currency: "UZS",
    accent: "#b68d42",
    published: true,
  },
  {
    id: "taklifla-muhrli-maktub",
    name: "Muhrli Maktub",
    description: "Muhrli konvert, nafis maktub va klassik nikoh taklifnomasi.",
    previewImage: "/templates/taklifla-muhrli-maktub/preview.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 150000,
    currency: "UZS",
    accent: "#a1845e",
    published: true,
  },
  {
    id: "taklifla-asalari",
    name: "Asalari",
    description: "Quvnoq, asalrang bezakli tug‘ilgan kun taklifnomasi.",
    previewImage: "/templates/taklifla-asalari/preview.webp",
    previewEventType: "birthday",
    categoryIds: ["birthday"],
    supportedEventTypes: ["birthday"],
    priceMinor: 150000,
    currency: "UZS",
    accent: "#d4a52e",
    published: true,
  },
  {
    id: "taklifla-fayzli-xonadon", name: "Fayzli Xonadon", description: "Terrakota jilolari, xonadon chizmasi va samimiy uy to‘yi taklifnomasi.",
    previewImage: "/templates/taklifla-fayzli-xonadon/preview.webp", previewEventType: "yangi-uy",
    categoryIds: ["other"], supportedEventTypes: ["yangi-uy"],
    priceMinor: 100000, currency: "UZS", accent: "#b5523a", published: true,
  },
  {
    id: "taklifla-ertak", name: "Ertak", description: "Sehrli qal’a, ertak darvozasi va qatlamli bog manzarasi.",
    previewImage: "/templates/taklifla-ertak/preview.webp", previewEventType: "wedding",
    categoryIds: ["wedding"], supportedEventTypes: ["wedding"],
    priceMinor: 100000, currency: "UZS", accent: "#c9a24a", published: true,
  },
  {
    id: "taklifla-gulbog", name: "Gulbog", description: "Gullar darvozasi va nafis bog manzarasidagi nikoh taklifnomasi.",
    previewImage: "/templates/taklifla-gulbog/preview.webp", previewEventType: "wedding",
    categoryIds: ["wedding"], supportedEventTypes: ["wedding"],
    priceMinor: 100000, currency: "UZS", accent: "#6b8f5e", published: true,
  },
  {
    id: "taklifla-zarrin-gullar", name: "Zarrin gullar", description: "Iliq zarrin gullar, nafis bezaklar va bahoriy nikoh taklifnomasi.",
    previewImage: "/templates/taklifla-zarrin-gullar/preview.webp", previewEventType: "wedding",
    categoryIds: ["wedding"], supportedEventTypes: ["wedding"],
    priceMinor: 100000, currency: "UZS", accent: "#c67139", published: true,
  },
  {
    id: "taklifla-toglar-bagrida", name: "Tog‘lar bag‘rida", description: "Tog‘lar manzarasi, nafis gullar va qatlamli harakatli nikoh taklifnomasi.",
    previewImage: "/templates/taklifla-toglar-bagrida/preview.webp", previewEventType: "wedding",
    categoryIds: ["wedding"], supportedEventTypes: ["wedding"],
    priceMinor: 100000, currency: "UZS", accent: "#819480", published: true,
  },
  {
    id: "taklifla-oltin-yol", name: "Oltin Yo‘l", description: "Oltin poyezd sayohati, nafis chiptalar va harakatli temiryo‘l taklifnomasi.",
    previewImage: "/templates/taklifla-oltin-yol/preview.webp", previewEventType: "wedding",
    categoryIds: ["wedding"], supportedEventTypes: ["wedding"],
    priceMinor: 100000, currency: "UZS", accent: "#b3552f", published: true,
  },
  {
    id: "taklifla-osmon", name: "Cheksiz Osmon", description: "Bulutlar orasidagi sayohat, uchuvchi bezaklar va moviy nikoh taklifnomasi.",
    previewImage: "/templates/taklifla-osmon/preview.webp", previewEventType: "wedding",
    categoryIds: ["wedding"], supportedEventTypes: ["wedding"],
    priceMinor: 100000, currency: "UZS", accent: "#3d6a99", published: true,
  },
  {
    id: "taklifla-parilar-ertagi", name: "Parilar ertagi", description: "Qasrlar, ertaknamo arka qatlamlari va nafis harakatli nikoh taklifnomasi.",
    previewImage: "/templates/taklifla-parilar-ertagi/preview.webp", previewEventType: "wedding",
    categoryIds: ["wedding"], supportedEventTypes: ["wedding"],
    priceMinor: 100000, currency: "UZS", accent: "#b8a4c9", published: true,
  },
  {
    id: "taklifla-qogoz-ertagi", name: "Qog‘oz ertagi", description: "Qog‘oz kitob sahifalari, ochiluvchi muqova va qatlamli nikoh manzaralari.",
    previewImage: "/templates/taklifla-qogoz-ertagi/preview.webp", previewEventType: "wedding",
    categoryIds: ["wedding"], supportedEventTypes: ["wedding"],
    priceMinor: 100000, currency: "UZS", accent: "#c9a24b", published: true,
  },
  {
    id: "taklifla-sakura-guli", name: "Sakura Guli", description: "Sakura gullari, nafis sharshara manzarasi va harakatli gulbargli nikoh taklifnomasi.",
    previewImage: "/templates/taklifla-sakura-guli/preview.webp", previewEventType: "wedding",
    categoryIds: ["wedding"], supportedEventTypes: ["wedding"],
    priceMinor: 100000, currency: "UZS", accent: "#c2637f", published: true,
  },
  {
    id: "taklifla-yubiley-sahifasi", name: "Yubiley Sahifasi",
    description: "To‘q moviy va oltin bezaklar, korxona tarixi va tantanali yubiley.",
    previewImage: "/templates/taklifla-yubiley-sahifasi/preview.webp",
    previewEventType: "korporativ", categoryIds: ["other"], supportedEventTypes: ["korporativ"],
    priceMinor: 100000, currency: "UZS", accent: "#1f2a4a", published: true,
  },
  {
    id: "taklifla-barakali",
    name: "Barakali",
    description: "Nafis gul bezaklari, moviy-yashil jilolar va bayram xotiralari.",
    previewImage: "/templates/taklifla-barakali/preview.webp",
    previewEventType: "birthday",
    categoryIds: ["birthday"],
    supportedEventTypes: ["birthday"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#376c66",
    published: true,
  },
  {
    id: "taklifla-tungi-saroy",
    name: "Tungi Saroy",
    description: "Yulduzli tun, oltin bezaklar va muhtasham saroy manzarasi.",
    previewImage: "/templates/taklifla-tungi-saroy/preview.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#d8b65c",
    published: true,
  },
  {
    id: "taklifla-tovus",
    name: "Tovus",
    description: "Zumrad va oltin jilolar, tovus patlari va nafis saroy taklifnomasi.",
    previewImage: "/templates/taklifla-tovus/preview.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#0a4c40",
    published: true,
  },
  {
    id: "taklifla-tort-fasl",
    name: "To‘rt fasl",
    description: "Bahor, yoz, kuz va qish manzaralari bo‘ylab nafis nikoh taklifnomasi.",
    previewImage: "/templates/taklifla-tort-fasl/preview.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#a2506f",
    published: true,
  },
  {
    id: "glass-pink",
    name: "Glass Pink",
    description: "Nafis pushti gullar, nozik naqshlar va nafis taklifnoma.",
    previewImage: "/templates/glass-pink/catalog-cover-opening.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#cb5d6c",
    published: true,
  },
  {
    id: "manor-edition",
    name: "Manor",
    description:
      "Qo‘lda chizilgan gullar, xalqalar va romantik manor bezaklari.",
    previewImage:
      "/templates/manor-edition/source/reference/assets/intro-poster.jpg",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#8a6840",
    published: false,
  },
  {
    id: "olive-manor-edition",
    name: "Olive Manor",
    description: "Zaytun ranglari, nafis gullar va sokin manor muhiti.",
    previewImage:
      "/templates/olive-manor-edition/source/reference/assets/intro-start-v2.jpg",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#6e7556",
    published: false,
  },
  {
    id: "islamic-edition",
    name: "Islamic Edition",
    description:
      "Tungi ko‘k ranglar, islomiy naqshlar va sokin hilol bezaklari.",
    previewImage:
      "/templates/islamic-edition/source/reference/assets/video-start.jpg",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#d7b66a",
    published: false,
  },
  {
    id: "osh-edition-v1",
    name: "Osh Edition",
    description: "Iliq naqshlar, nafis xat va anʼanaviy osh dasturxoni.",
    previewImage:
      "/templates/osh-edition-v1/source/reference/assets/intro-osh-premium.webp",
    previewEventType: "osh",
    categoryIds: ["osh"],
    supportedEventTypes: ["osh"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#8c6845",
    published: false,
  },
  {
    id: "osh",
    name: "Osh",
    description:
      "Sharob rang va oltin suzani naqshlari bilan bezatilgan nahorgi osh taklifnomasi.",
    previewImage: "/templates/chorlove/osh/preview.jpg",
    previewEventType: "osh",
    categoryIds: ["osh"],
    supportedEventTypes: ["osh"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#6e1f2b",
    published: true,
  },
  {
    id: "palov",
    name: "Chorlove Palov",
    description:
      "An’anaviy nahorgi osh taklifnomasi palov bezagi va nafis naqshlar bilan.",
    previewImage: "/templates/chorlove/palov/catalog-opening.png",
    previewEventType: "osh",
    categoryIds: ["osh"],
    supportedEventTypes: ["osh"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#1e3557",
    published: true,
  },
  {
    id: "orchid-amplop",
    name: "Orchid Amplop",
    description:
      "O‘rmon manzarasi, nafis gul ramzi va ochiladigan konvertli nikoh taklifnomasi.",
    previewImage: "/templates/chorlove/orchid-amplop/assets/catalog-opening.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#e382d3",
    published: true,
  },
  {
    id: "invitate-palov",
    name: "Invitate Palov",
    description:
      "Peshtoq naqshlari, palov bezagi va nahorgi osh uchun taklifnoma.",
    previewEventType: "osh",
    categoryIds: ["osh"],
    supportedEventTypes: ["osh"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#2d4a34",
    previewImage: "/templates/invitate-palov/preview.png",
    published: false,
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description:
      "A warm birthday invitation with a cinematic floral opening, countdown, and celebration timeline.",
    previewImage: "/templates/golden-hour/assets/images/golden-hour/pink.png",
    previewEventType: "birthday",
    categoryIds: ["birthday"],
    supportedEventTypes: ["birthday"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#9b6d55",
    published: true,
  },
  {
    id: "bloom",
    name: "Bloom",
    description:
      "A floral birthday invitation with layered curtains, a countdown, and an event timeline.",
    previewImage: "/templates/bloom/preview.webp",
    previewEventType: "birthday",
    categoryIds: ["birthday"],
    supportedEventTypes: ["birthday"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#e97ab2",
    published: false,
  },
  {
    id: "invitate-nahorgi-osh",
    name: "Invitate Nahorgi Osh",
    description:
      "Yashil girih naqshlari, tillarang bezaklar va nahorgi osh uchun taklifnoma.",
    previewEventType: "osh",
    categoryIds: ["osh"],
    supportedEventTypes: ["osh"],
    previewImage: "/templates/invitate-nahorgi-osh/preview.png",
    priceMinor: 100000,
    currency: "UZS",
    accent: "#2d4a34",
    published: true,
  },
  {
    id: "invitate-wedding",
    name: "Invitate Wedding",
    description:
      "A dark cinematic wedding invitation with golden details, countdown, schedule, and RSVP.",
    previewImage: "/templates/invitate-wedding/preview.jpg",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c9a84c",
    published: false,
  },
  {
    id: "whiteless",
    name: "Whiteless",
    description:
      "A white, cinematic invitation with a lock opening, soft bokeh, and editorial details.",
    previewImage: "/templates/whiteless/preview.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#363636",
    published: false,
  },
  {
    id: "safir",
    name: "Safir",
    description:
      "Yashil fon, nafis oq gulli bezaklar va konvert ochilishiga ega to‘y taklifnomasi.",
    previewImage: "/templates/safir/catalog-cover-opening.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#585c43",
    published: false,
  },
  {
    id: "amru-maruf-edition-v1",
    name: "Amru Maruf Edition",
    description:
      "Chuqur zumrad ranglar, islomiy ravoq va tillarang bezakli nikoh taklifnomasi.",
    previewImage: "/templates/amru-maruf-edition-v1/preview.svg",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#c9a96e",
    published: false,
  },
  {
    id: "monochrome-editorial-edition",
    name: "Monochrome Editorial",
    description:
      "Qora-oq fotografiya, yirtilgan qog‘oz chetlari va nafis tipografika.",
    previewImage:
      "/templates/monochrome-editorial-edition/source/reference/assets/hero-hands.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#171717",
    published: false,
  },
  {
    id: "xatna-edition",
    name: "Xatna Edition",
    description:
      "Samarqand hovlisi, islimiy naqsh va nafis oq-yashil bezaklar.",
    previewImage:
      "/templates/xatna-edition/source/reference/assets/intro-ivory-doors.webp",
    previewEventType: "sunnat-toyi",
    categoryIds: ["other"],
    supportedEventTypes: ["sunnat-toyi"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#52644b",
    published: false,
  },
  {
    id: "cloud-castle",
    name: "Cloud Castle",
    description:
      "Oq bulutlar, nozik gul bezaklari va nafis saroyona taklifnoma.",
    previewImage: "/templates/cloud-castle/preview-opening.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#123467",
    published: true,
  },
  {
    id: "orchid-amplop",
    name: "Orchid Amplop",
    description:
      "O‘rmon manzarasi, nafis gul ramzi va ochiladigan konvertli nikoh taklifnomasi.",
    previewImage: "/templates/chorlove/orchid-amplop/assets/catalog-opening.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#e382d3",
    published: true,
  },
  {
    id: "palace-rose",
    name: "Palace Rose",
    description:
      "Bordo muhr, nafis atirgullar va saroy manzaralari bilan bezatilgan to‘y taklifnomasi.",
    previewImage: "/templates/palace-rose/preview.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#640e1b",
    published: true,
  },
  {
    id: "royal-burgundy-edition",
    name: "Velvet Royale",
    description:
      "Bordo baxmal pardalar, zarhal bezaklar va nafis saroyona uslub.",
    previewImage:
      "/templates/velvet-royale/source/reference/intro-v4-20261014-blank-poster-c521108180.webp",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#710510",
    published: true,
  },
  {
    id: "taklifnomachi-1",
    name: "Taklifnomachi · Klassik",
    description: "Bordo ranglar, nafis kalligrafiya va marosim sahifalari.",
    previewImage: "/templates/taklifnomachi-1/preview.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#690520",
    published: false,
  },
  {
    id: "taklifnomachi-12",
    name: "Taklifnomachi · Moviy osmon",
    description: "Moviy bulutlar, nafis muhr va ochiladigan taklifnoma.",
    previewImage:
      "/templates/taklifnomachi-12/source/templates/12/assets/hero.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#7ca5c1",
    published: false,
  },
  {
    id: "taklifnomachi-13",
    name: "Taklifnomachi - Oltin atirgul",
    description: "Golden silk, botanical details, and a rose calendar.",
    previewImage:
      "/templates/taklifnomachi-13/source/taklifnomachi.uz/templates/13/assets/p2/intro-golden.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#8a6942",
    published: false,
  },
  {
    id: "taklifnomachi-15",
    name: "Taklifnomachi - Monoxrom swap",
    description: "A cinematic charcoal invitation with a swipe-to-open reveal.",
    previewImage:
      "/templates/taklifnomachi-15/source/taklifnomachi.uz/templates/15/assets/main-bg.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#252525",
    published: false,
  },
  {
    id: "taklifnomachi-16",
    name: "Taklifnomachi - Zaytun guli",
    description: "An ivory envelope opens into an olive floral invitation.",
    previewImage:
      "/templates/taklifnomachi-16/source/taklifnomachi.uz/templates/16/assets/couple-top.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#7e8455",
    published: false,
  },
  {
    id: "taklifnomachi-17",
    name: "Taklifnomachi - Atlas va atlas ipak",
    description: "A walnut-toned floral invitation framed by flowing satin.",
    previewImage:
      "/templates/taklifnomachi-17/source/taklifnomachi.uz/templates/17/assets/main-bg.jpg",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#553b34",
    published: false,
  },
  {
    id: "taklifnomachi-18",
    name: "Taklifnomachi - Gul naqshli marosim",
    description:
      "A wide floral artboard with a detailed program and soft sage accents.",
    previewImage:
      "/templates/taklifnomachi-18/source/taklifnomachi.uz/templates-source/18/assets/bg.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#536d67",
    published: false,
  },
  {
    id: "taklifnomachi-19",
    name: "Taklifnomachi - Zaytun bogi",
    description:
      "A sage botanical invitation with an illustrated three-day calendar.",
    previewImage:
      "/templates/taklifnomachi-19/source/taklifnomachi.uz/templates-source/19/assets/hero.png",
    previewEventType: "wedding",
    categoryIds: ["wedding"],
    supportedEventTypes: ["wedding"],
    priceMinor: 100000,
    currency: "UZS",
    accent: "#798866",
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
    programDescriptions: {},
  };
}
export const DEFAULT_WEDDING_INVITATION_MESSAGE =
  "Hayotimizning eng quvonchli kunida — nikoh to‘yimizda — Sizni aziz mehmonimiz sifatida ko‘rishdan baxtiyormiz.";
export function defaultInvitationMessage(
  eventType: EventType,
  locale: Locale,
): string {
  if (eventType === "bitiruv" || eventType === "korporativ") {
    const defaults: Record<"bitiruv" | "korporativ", Record<Locale, string>> = {
      bitiruv: {
        "uz-Latn":
          "Bitiruv oqshomini siz bilan birga nishonlashga taklif qilamiz.",
        "uz-Cyrl":
          "Битирув оқшомини сиз билан бирга нишонлашга таклиф қиламиз.",
        en: "Join us to celebrate graduation together.",
        ru: "Приглашаем вас вместе отпраздновать выпускной вечер.",
      },
      korporativ: {
        "uz-Latn": "Sizni korporativ tadbirimizda kutib qolamiz.",
        "uz-Cyrl": "Сизни корпоратив тадбиримизда кутиб қоламиз.",
        en: "We look forward to celebrating together at our corporate event.",
        ru: "Будем рады видеть вас на нашем корпоративном мероприятии.",
      },
    };
    return defaults[eventType][locale];
  }
  if (eventType === "yangi-uy") {
    return {
      "uz-Latn":
        "Yangi xonadonimizdagi quvonchni siz bilan baham ko‘rishga taklif qilamiz.",
      "uz-Cyrl":
        "Янги хонадонимиздаги қувончни сиз билан баҳам кўришга таклиф қиламиз.",
      en: "Join us as we celebrate the joy of our new home.",
      ru: "Приглашаем вас разделить с нами радость новоселья.",
    }[locale];
  }
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
  yubiley: {
    "uz-Latn": "Yubiley dasturi",
    "uz-Cyrl": "Юбилей дастури",
    en: "Anniversary program",
    ru: "Программа юбилея",
  },
  osh: {
    "uz-Latn": "Nahorgi osh dasturi",
    "uz-Cyrl": "Наҳорги ош дастури",
    en: "Morning osh program",
    ru: "Программа утреннего оша",
  },
  iftorlik: {
    "uz-Latn": "Iftorlik dasturi",
    "uz-Cyrl": "Ифторлик дастури",
    en: "Iftar program",
    ru: "Программа ифтара",
  },
  "qiz-bazmi": {
    "uz-Latn": "Qiz bazmi dasturi",
    "uz-Cyrl": "Қиз базми дастури",
    en: "Bride’s celebration program",
    ru: "Программа праздника невесты",
  },
  fotiha: {
    "uz-Latn": "Fotiha marosimi dasturi",
    "uz-Cyrl": "Фотиҳа маросими дастури",
    en: "Engagement program",
    ru: "Программа помолвки",
  },
  "qiz-uzatish": {
    "uz-Latn": "Qiz uzatish dasturi",
    "uz-Cyrl": "Қиз узатиш дастури",
    en: "Bride send-off program",
    ru: "Программа проводов невесты",
  },
  "sunnat-toyi": {
    "uz-Latn": "Sunnat to‘yi dasturi",
    "uz-Cyrl": "Суннат тўйи дастури",
    en: "Celebration program",
    ru: "Программа суннат-тоя",
  },
  "beshik-toyi": {
    "uz-Latn": "Beshik to‘yi dasturi",
    "uz-Cyrl": "Бешик тўйи дастури",
    en: "Cradle celebration program",
    ru: "Программа праздника в честь колыбели",
  },
  bitiruv: {
    "uz-Latn": "Bitiruv kechasi dasturi",
    "uz-Cyrl": "Битирув кечаси дастури",
    en: "Graduation evening program",
    ru: "Программа выпускного вечера",
  },
  korporativ: {
    "uz-Latn": "Korporativ tadbir dasturi",
    "uz-Cyrl": "Корпоратив тадбир дастури",
    en: "Corporate event program",
    ru: "Программа корпоративного мероприятия",
  },
  "yangi-uy": {
    "uz-Latn": "Yangi uy to‘yi dasturi",
    "uz-Cyrl": "Янги уй тўйи дастури",
    en: "Housewarming program",
    ru: "Программа новоселья",
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
    celebrantAge: null,
    startsAt: "",
    timezone: "Asia/Tashkent",
    venue: { latitude: null, longitude: null, mapUrl: "" },
    program: [],
    artistLineup: [],
    templateData: {},
    story: [],
    gallery: [],
    music: { enabled: false, assetId: null, url: "", filename: "" },
    gift: {
      enabled: false,
      receiptUploadEnabled: false,
      cardNumber: "",
      cardHolder: "",
    },
    contacts: { phoneNumber: "", telegramUsername: "", instagramUrl: "" },
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
