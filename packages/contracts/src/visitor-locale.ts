import type { Invitation, Locale } from "./index";

/** Explicit guest choice wins. Country is a coarse hosting hint, never GPS. */
export function visitorLocale(
  invitation: Pick<Invitation, "enabledLocales" | "defaultLocale">,
  explicit?: string | string[],
  country?: string | null,
  acceptLanguage = "",
): Locale {
  const enabled = invitation.enabledLocales;
  const choice = Array.isArray(explicit) ? explicit[0] : explicit;
  if (enabled.includes(choice as Locale)) return choice as Locale;
  const preferences = acceptLanguage.split(",").map((entry, order) => {
    const [tag, quality] = entry.trim().split(";");
    const q = quality?.trim().startsWith("q=") ? Number(quality.trim().slice(2)) : 1;
    return { tag: tag.toLowerCase(), q, order };
  }).filter(({ q }) => Number.isFinite(q) && q > 0).sort((a, b) => b.q - a.q || a.order - b.order);
  const browser = preferences.flatMap(({ tag }) => {
    if (tag.startsWith("uz-cyrl")) return ["uz-Cyrl", "uz-Latn"] as Locale[];
    if (tag.startsWith("uz")) return ["uz-Latn", "uz-Cyrl"] as Locale[];
    if (tag === "ru" || tag.startsWith("ru-")) return ["ru"] as Locale[];
    if (tag === "en" || tag.startsWith("en-")) return ["en"] as Locale[];
    return [];
  });
  const region = country?.toUpperCase();
  const regional: Locale[] = region === "UZ"
    ? [browser.find((l) => l.startsWith("uz")) ?? "uz-Latn", "uz-Latn", "uz-Cyrl"]
    : ["RU", "BY", "KZ", "KG", "TJ"].includes(region ?? "") ? ["ru"]
      : region && /^[A-Z]{2}$/.test(region) ? ["en"] : [];
  return [...regional, ...browser, invitation.defaultLocale, ...enabled].find((l) => enabled.includes(l))!;
}
