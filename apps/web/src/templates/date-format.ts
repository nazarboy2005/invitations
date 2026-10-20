import type { Locale } from "@taklifnoma/contracts";

export const intlLocale: Record<Locale, string> = {
  "uz-Latn": "uz-UZ",
  "uz-Cyrl": "uz-Cyrl-UZ",
  en: "en-GB",
  ru: "ru-RU",
};

function capitalizeWeekday(value: string, locale: Locale): string {
  if (!value) return value;
  const [first, ...rest] = Array.from(value);
  return `${first.toLocaleUpperCase(intlLocale[locale])}${rest.join("")}`;
}
const uzbek = {
  "uz-Latn": {
    months: [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avgust",
      "sentabr",
      "oktabr",
      "noyabr",
      "dekabr",
    ],
    weekdays: [
      "yakshanba",
      "dushanba",
      "seshanba",
      "chorshanba",
      "payshanba",
      "juma",
      "shanba",
    ],
    shortWeekdays: ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"],
  },
  "uz-Cyrl": {
    months: [
      "январ",
      "феврал",
      "март",
      "апрел",
      "май",
      "июн",
      "июл",
      "август",
      "сентябр",
      "октябр",
      "ноябр",
      "декабр",
    ],
    weekdays: [
      "якшанба",
      "душанба",
      "сешанба",
      "чоршанба",
      "пайшанба",
      "жума",
      "шанба",
    ],
    shortWeekdays: ["Як", "Ду", "Се", "Чо", "Па", "Жу", "Ша"],
  },
};

// A datetime-local string represents the event's wall clock, not the visitor's
// timezone. Explicitly offset timestamps are converted into the event timezone.
export function eventDate(value: string, timezone: string) {
  if (!value) return null;
  const zoned = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  const date = new Date(
    zoned ? value : `${value.length === 10 ? `${value}T00:00` : value}Z`,
  );
  if (!Number.isFinite(date.getTime())) return null;
  let zone = zoned ? timezone : "UTC";
  try {
    new Intl.DateTimeFormat("en", { timeZone: zone }).format(date);
  } catch {
    zone = "UTC";
  }
  return { date, zone };
}

/** Resolve a creator-entered wall-clock time to an instant in its selected zone. */
export function eventInstant(value: string, timezone: string): Date | null {
  if (!value) return null;
  const raw = value.length === 10 ? `${value}T00:00` : value;
  if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw)) {
    const date = new Date(raw);
    return Number.isFinite(date.getTime()) ? date : null;
  }
  const wall = new Date(`${raw}Z`);
  if (!Number.isFinite(wall.getTime())) return null;
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      calendar: "gregory",
      numberingSystem: "latn",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(wall);
    const n = (type: string) =>
      Number(parts.find((part) => part.type === type)?.value);
    const represented = Date.UTC(
      n("year"),
      n("month") - 1,
      n("day"),
      n("hour"),
      n("minute"),
      n("second"),
    );
    return new Date(wall.getTime() - (represented - wall.getTime()));
  } catch {
    return wall;
  }
}

export function eventWallDate(value: string, timezone: string): Date | null {
  const info = eventDate(value, timezone);
  if (!info) return null;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: info.zone,
    calendar: "gregory",
    numberingSystem: "latn",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(info.date);
  const n = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  return new Date(Date.UTC(n("year"), n("month") - 1, n("day"), 12));
}

export function formatDate(
  value: string,
  locale: Locale,
  timezone: string,
  options: Intl.DateTimeFormatOptions,
) {
  const info = eventDate(value, timezone);
  if (!info) return "";
  if (locale !== "uz-Latn" && locale !== "uz-Cyrl") {
    const formatted = new Intl.DateTimeFormat(intlLocale[locale], {
      ...options,
      timeZone: info.zone,
    }).format(info.date);
    return options.weekday
      ? capitalizeWeekday(formatted, locale)
      : formatted;
  }

  // Some browsers ship incomplete Uzbek ICU data (for example "M12" as the
  // month name). Author Uzbek wording explicitly; use Intl only for numeric
  // Gregorian parts in the already-resolved event timezone.
  const wording = uzbek[locale];
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: info.zone,
    calendar: "gregory",
    numberingSystem: "latn",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(info.date);
  const number = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  const year = number("year"),
    month = number("month"),
    day = number("day");
  const tokens: string[] = [];
  if (options.weekday) {
    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    tokens.push(
      capitalizeWeekday(
        options.weekday === "long"
          ? wording.weekdays[weekday]
          : wording.shortWeekdays[weekday],
        locale,
      ),
    );
  }
  const dateTokens: string[] = [];
  if (options.day)
    dateTokens.push(
      options.day === "2-digit" ? String(day).padStart(2, "0") : String(day),
    );
  if (options.month) {
    const monthName = wording.months[month - 1];
    dateTokens.push(
      options.month === "2-digit"
        ? String(month).padStart(2, "0")
        : options.month === "numeric"
          ? String(month)
          : options.month === "short"
            ? monthName.slice(0, 3)
            : options.month === "narrow"
              ? monthName[0]
              : monthName,
    );
  }
  if (options.year)
    dateTokens.push(
      options.year === "2-digit" ? String(year).slice(-2) : String(year),
    );
  if (dateTokens.length)
    tokens.push(
      dateTokens.join(
        options.month === "numeric" || options.month === "2-digit" ? "." : " ",
      ),
    );
  if (options.hour || options.minute)
    tokens.push(
      new Intl.DateTimeFormat("en-GB", {
        hour: options.hour,
        minute: options.minute,
        hour12: options.hour12 ?? false,
        timeZone: info.zone,
      }).format(info.date),
    );
  return tokens.join(", ");
}

/** Calendar columns start on Monday in all invitation languages. */
export function calendarWeekdays(locale: Locale) {
  if (locale === "uz-Latn" || locale === "uz-Cyrl")
    return [
      ...uzbek[locale].shortWeekdays.slice(1),
      uzbek[locale].shortWeekdays[0],
    ];
  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(intlLocale[locale], {
      weekday: "short",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2026, 0, 5 + index))),
  );
}
