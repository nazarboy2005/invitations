import type { Metadata } from "next";
import {
  defaultEventLabel,
  getContent,
  type Invitation,
  type Locale,
} from "@taklifnoma/contracts";
import { formatDate } from "../../templates/date-format";
import artwork from "./share-artwork.json";

const wording: Record<
  Locale,
  { invitation: string; open: string; artwork: string; ogLocale: string }
> = {
  "uz-Latn": {
    invitation: "Sizga taklifnoma",
    open: "Taklifnomani ochish uchun bosing.",
    artwork: "Taklifnoma bezagi",
    ogLocale: "uz_UZ",
  },
  "uz-Cyrl": {
    invitation: "Сизга таклифнома",
    open: "Таклифномани очиш учун босинг.",
    artwork: "Таклифнома безаги",
    ogLocale: "uz_UZ",
  },
  en: {
    invitation: "You’re invited",
    open: "Open your invitation.",
    artwork: "Invitation artwork",
    ogLocale: "en_GB",
  },
  ru: {
    invitation: "Приглашение для вас",
    open: "Откройте ваше приглашение.",
    artwork: "Оформление приглашения",
    ogLocale: "ru_RU",
  },
};

export function invitationLocale(
  invitation: Invitation,
  requested?: string | string[],
): Locale {
  return typeof requested === "string" &&
    invitation.enabledLocales.includes(requested as Locale)
    ? (requested as Locale)
    : invitation.defaultLocale;
}

const compact = (value: string) => value.replace(/\s+/g, " ").trim();
const shorten = (value: string, limit: number) => {
  const chars = Array.from(value);
  return chars.length > limit
    ? `${chars
        .slice(0, limit - 1)
        .join("")
        .trimEnd()}…`
    : value;
};

/** Public event data only: guest tokens, greetings, drafts and catalog samples never enter previews. */
export function invitationShareMetadata(
  invitation: Invitation,
  slug: string,
  origin: string,
  requestedLocale?: string | string[],
): Metadata {
  const locale = invitationLocale(invitation, requestedLocale);
  const text = wording[locale];
  const content = getContent(invitation, locale);
  const event =
    compact(content.eventLabel) ||
    defaultEventLabel(invitation.eventType, locale);
  const names = content.people
    .map(compact)
    .filter(Boolean)
    .join(invitation.eventType === "wedding" ? " & " : ", ");
  const identity = names || compact(content.title) || compact(content.hosts);
  const title = shorten(
    identity && identity !== event
      ? `${identity} — ${event}`
      : event || text.invitation,
    160,
  );
  const date = formatDate(invitation.startsAt, locale, invitation.timezone, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const description = `${[event, date].filter(Boolean).join(" · ")}. ${text.open}`;
  const url = new URL(`/i/${encodeURIComponent(slug)}`, origin);
  if (locale !== invitation.defaultLocale) url.searchParams.set("lang", locale);
  const imagePath =
    (artwork as Record<string, string>)[invitation.templateId] ??
    artwork.default;
  const image = {
    url: new URL(imagePath, origin).href,
    width: 1200,
    height: 1200,
    type: "image/jpeg",
    alt: text.artwork,
  };
  return {
    title: { absolute: `${title} | Visol` },
    description,
    robots: { index: false, follow: false, noarchive: true },
    alternates: { canonical: url.href },
    openGraph: {
      type: "website",
      siteName: "Visol",
      title,
      description,
      url: url.href,
      locale: text.ogLocale,
      alternateLocale: [
        ...new Set(
          invitation.enabledLocales.map((value) => wording[value].ogLocale),
        ),
      ].filter((value) => value !== text.ogLocale),
      images: [image],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
