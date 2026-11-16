import { z } from "zod";
import categories from "./data/categories.json";
import { serviceExternalUrl, servicePhoneUrl } from "./services-utils";

export const serviceCategoryChoices = categories.map((c) =>
  c.id === "invitation" ? { ...c, name: "Bosma taklifnomalar" } : c,
);
export const serviceSlug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100)
  .refine(
    (value) => !["images", "imports", "slug-availability"].includes(value),
    "Bu havola tizim uchun ajratilgan. Boshqa nom tanlang.",
  );
const text = (max: number) => z.string().trim().max(max);
const number = z.number().finite().nonnegative().max(1e12).nullable();
export const serviceImageSchema = z
  .object({
    src: z
      .string()
      .regex(
        /^\/(?:images\/services\/[a-zA-Z0-9_./-]+|api\/services\/media\/[0-9a-f-]{36})$/,
      ),
    width: z.number().int().positive().max(10000),
    height: z.number().int().positive().max(10000),
    alt: text(300),
  })
  .strict();
export const serviceEditorSchema = z
  .object({
    slug: serviceSlug,
    name: text(180).min(1),
    categoryIds: z
      .array(
        z
          .string()
          .refine((id) => serviceCategoryChoices.some((c) => c.id === id)),
      )
      .min(1)
      .max(15),
    categoryLabel: text(180),
    description: text(12000),
    region: text(120),
    district: text(120),
    address: text(600),
    phones: z
      .array(
        z
          .object({
            label: text(80),
            value: text(50).refine(
              (v) => !!servicePhoneUrl(v),
              "Telefon raqamini tekshiring.",
            ),
          })
          .strict(),
      )
      .max(10),
    links: z
      .array(
        z
          .object({
            label: text(80),
            url: text(2000).refine(
              (v) => !!serviceExternalUrl(v),
              "HTTP yoki HTTPS havola kiriting.",
            ),
          })
          .strict(),
      )
      .max(15),
    email: z.union([z.email().max(254), z.null()]),
    latitude: z.number().finite().min(-90).max(90).nullable(),
    longitude: z.number().finite().min(-180).max(180).nullable(),
    price: z
      .object({
        kind: z.enum(["range", "from", "fixed", "negotiable"]),
        min: number,
        max: number,
        currency: z.enum(["UZS", "USD"]),
        sourceText: text(2000),
        unit: z.literal("person").optional(),
      })
      .strict()
      .superRefine((p, ctx) => {
        if (p.kind !== "negotiable" && (p.min === null || p.min <= 0))
          ctx.addIssue({
            code: "custom",
            path: ["min"],
            message: "Narx noldan katta bo‘lishi kerak.",
          });
        if (
          p.kind === "range" &&
          (p.max === null || p.min === null || p.max < p.min)
        )
          ctx.addIssue({
            code: "custom",
            path: ["max"],
            message: "Eng yuqori narx eng past narxdan kam bo‘lmasin.",
          });
      }),
    images: z.array(serviceImageSchema).max(20),
    importedAt: z.iso.datetime(),
    featured: z.boolean(),
    featuredOrder: z.number().int().min(0).max(100000).optional(),
  })
  .strict()
  .superRefine((s, ctx) => {
    if ((s.latitude === null) !== (s.longitude === null))
      ctx.addIssue({
        code: "custom",
        path: ["latitude"],
        message: "Ikkala koordinatani kiriting.",
      });
  });
export type ServiceEditor = z.infer<typeof serviceEditorSchema>;
export type ServiceRecord = {
  slug: string;
  draft: ServiceEditor;
  published: ServiceEditor | null;
  status: "active" | "hidden";
  revision: number;
  updatedAt: string;
  evidence: Record<string, unknown> | null;
  reviewRequired: boolean;
};
export const serviceWriteSchema = z
  .object({
    revision: z.number().int().nonnegative(),
    intent: z.enum(["active", "hidden"]),
    listing: serviceEditorSchema,
    reviewed: z.boolean().default(false),
  })
  .strict();

export const serviceDeleteSchema = z
  .object({
    revision: z.number().int().positive(),
  })
  .strict();

function mapsUrl(value: string) {
  try {
    const u = new URL(value);
    if (!/^https?:$/.test(u.protocol) || u.username || u.password || u.port)
      return false;
    return (
      (/^(?:www\.)?yandex\.(?:uz|ru|com|kz|com\.tr)$/.test(u.hostname) &&
        /^\/maps(?:\/|$)/.test(u.pathname)) ||
      (/^(?:www\.|maps\.)?google\.(?:com|co\.uz|ru)$/.test(u.hostname) &&
        (/^\/maps(?:\/|$)/.test(u.pathname) ||
          (u.hostname.startsWith("maps.") && u.pathname === "/"))) ||
      u.hostname === "maps.app.goo.gl" ||
      (u.hostname === "goo.gl" && u.pathname.startsWith("/maps/"))
    );
  } catch {
    return false;
  }
}
export const serviceImportSchema = z
  .object({
    urls: z
      .array(
        z
          .string()
          .max(2000)
          .refine(mapsUrl, "Google Maps yoki Yandex Maps havolasini kiriting."),
      )
      .max(2)
      .default([]),
    query: text(180).default(""),
    city: text(120).min(1),
    categoryId: z
      .string()
      .refine((id) => serviceCategoryChoices.some((c) => c.id === id)),
    region: text(120).default(""),
    imageSource: z.enum(["single", "mixed"]).default("single"),
  })
  .strict()
  .refine(
    (v) => v.urls.length > 0 || v.query.length > 1,
    "Havola yoki tashkilot nomini kiriting.",
  );

export function emptyService(): ServiceEditor {
  return {
    slug: "",
    name: "",
    categoryIds: ["restaurant"],
    categoryLabel: "To‘yxonalar",
    description: "",
    region: "",
    district: "",
    address: "",
    phones: [],
    links: [],
    email: null,
    latitude: null,
    longitude: null,
    price: {
      kind: "negotiable",
      min: null,
      max: null,
      currency: "UZS",
      sourceText: "",
    },
    images: [],
    importedAt: new Date().toISOString(),
    featured: false,
    featuredOrder: 0,
  };
}
