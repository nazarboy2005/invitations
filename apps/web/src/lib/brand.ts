import type { Locale } from "@taklifnoma/contracts";

/** Public brand identity. Storage keys and invitation event labels are separate. */
export const BRAND_NAME = "Fotiha";

const localizedNames: Record<Locale, string> = {
  "uz-Latn": BRAND_NAME,
  "uz-Cyrl": "Фотиҳа",
  en: BRAND_NAME,
  ru: "Фотиха",
};

export function brandName(locale: Locale): string {
  return localizedNames[locale];
}
