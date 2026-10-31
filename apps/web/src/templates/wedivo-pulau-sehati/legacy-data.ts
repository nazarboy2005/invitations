import { publicAsset } from "../../lib/public-asset";
import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import { getContent, type Invitation, type Locale } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";
type LegacyDate = { weekday: string; weekdayShort: string; day: number | ""; month: string; monthNumber: number | ""; year: number | ""; time: string; long: string; short: string };
type LegacyData = { title: string; footer: string; groom: string; bride: string; hosts: string; hostsLabel: string; greeting: string; monogram: string; eventType: string; message: string; programHeading: string; dateTime: string; date: LegacyDate; venue: { name: string; address: string; lat: number | null; lng: number | null; mapUrl: string }; program: Array<{ id: string; time: string; title: string; description?: string }>; story: Array<{ id: string; title: string; text: string }>; gallery: Array<{ id: string; src: string; alt: string; caption: string }>; contacts: Array<{ label: string; value: string; type: "phone" | "telegram" | "instagram"; href: string }>; rsvp: Invitation["rsvp"]; wishesEnabled: boolean; wishes: Array<{ name: string; text: string }>; toyona: { enabled: boolean; cardNumber: string; cardHolder: string; note: string }; music: { enabled: boolean; url: string }; timezone: string; dressCode: { enabled: boolean; style: string; text: string; note: string; colors: Array<{ id: string; name: string; hex: string }> } };const hostsLabels: Record<Locale, string> = { "uz-Latn": "Hurmat bilan", "uz-Cyrl": "Ҳурмат билан", en: "With love from", ru: "С уважением" };
const footerLabels: Record<Locale, string> = { "uz-Latn": "Taklifnoma", "uz-Cyrl": "Таклифнома", en: "Invitation", ru: "Приглашение" };
const eventLabels: Record<Locale, Record<Invitation["eventType"], string>> = { "uz-Latn": { wedding: "Nikoh to‘yi", birthday: "Tug‘ilgan kun", yubiley: "Yubiley", osh: "Nahorgi osh", iftorlik: "Iftorlik", "qiz-bazmi": "Qiz bazmi", fotiha: "Fotiha", "qiz-uzatish": "Qiz uzatish", "sunnat-toyi": "Sunnat to‘yi", "beshik-toyi": "Beshik to‘yi", bitiruv: "Bitiruv", korporativ: "Tadbir", "yangi-uy": "Yangi uy", other: "Tadbir" }, "uz-Cyrl": { wedding: "Никоҳ тўйи", birthday: "Туғилган кун", yubiley: "Юбилей", osh: "Ош", iftorlik: "Ифторлик", "qiz-bazmi": "Қиз базми", fotiha: "Фотиҳа", "qiz-uzatish": "Узатиш", "sunnat-toyi": "Суннат тўйи", "beshik-toyi": "Бешик тўйи", bitiruv: "Битирув", korporativ: "Тадбир", "yangi-uy": "Янги уй", other: "Тадбир" }, en: { wedding: "Wedding", birthday: "Birthday", yubiley: "Anniversary", osh: "Morning osh", iftorlik: "Iftar", "qiz-bazmi": "Bride’s celebration", fotiha: "Engagement", "qiz-uzatish": "Send-off", "sunnat-toyi": "Sunnat", "beshik-toyi": "Cradle celebration", bitiruv: "Graduation", korporativ: "Event", "yangi-uy": "Housewarming", other: "Celebration" }, ru: { wedding: "Свадьба", birthday: "День рождения", yubiley: "Юбилей", osh: "Ош", iftorlik: "Ифтар", "qiz-bazmi": "Праздник невесты", fotiha: "Помолвка", "qiz-uzatish": "Проводы невесты", "sunnat-toyi": "Суннат-той", "beshik-toyi": "Праздник колыбели", bitiruv: "Выпускной", korporativ: "Мероприятие", "yangi-uy": "Новоселье", other: "Праздник" } };
export function makeLegacyData(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  _sampleWishes = false,
): LegacyData {
  const content = getContent(invitation, locale);
  const people = content.people.filter(Boolean);
  const eventAt = invitation.startsAt
    ? eventInstant(invitation.startsAt, invitation.timezone)
    : null;
  const wallDate = invitation.startsAt
    ? eventWallDate(invitation.startsAt, invitation.timezone)
    : null;
  const date: LegacyDate = wallDate
    ? {
        weekday: formatDate(invitation.startsAt, locale, invitation.timezone, {
          weekday: "long",
        }),
        weekdayShort: formatDate(
          invitation.startsAt,
          locale,
          invitation.timezone,
          { weekday: "short" },
        ),
        day: wallDate.getUTCDate(),
        month: formatDate(invitation.startsAt, locale, invitation.timezone, {
          month: "long",
        }),
        monthNumber: wallDate.getUTCMonth() + 1,
        year: wallDate.getUTCFullYear(),
        time: formatDate(invitation.startsAt, locale, invitation.timezone, {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
        long: formatDate(invitation.startsAt, locale, invitation.timezone, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        short: formatDate(invitation.startsAt, locale, invitation.timezone, {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      }
    : {
        weekday: "",
        weekdayShort: "",
        day: "",
        month: "",
        monthNumber: "",
        year: "",
        time: "",
        long: "",
        short: "",
      };
  const personalGreeting = guestName
    ? content.personalGreeting.replaceAll("{name}", guestName)
    : "";
  const greeting = personalGreeting || content.greeting;
  return {
    title: content.title,
    footer: footerLabels[locale],
    groom: people[0] ?? "",
    bride: people[1] ?? "",
    hosts: content.hosts,
    hostsLabel: hostsLabels[locale],
    greeting,
    monogram: `${people[0]?.trim().charAt(0) ?? ""} & ${people[1]?.trim().charAt(0) ?? ""}`,
    eventType: content.eventLabel || eventLabels[locale][invitation.eventType],
    message: content.message,
    programHeading:
      content.programHeading ||
      (
        {
          "uz-Latn": "To‘y dasturi",
          "uz-Cyrl": "Тўй дастури",
          en: "The evening",
          ru: "Программа вечера",
        } satisfies Record<Locale, string>
      )[locale],
    dateTime: eventAt?.toISOString() ?? "",
    date,
    venue: {
      name: content.venueName,
      address: [content.address, content.landmark].filter(Boolean).join(" · "),
      lat: invitation.venue.latitude,
      lng: invitation.venue.longitude,
      mapUrl: yandexMapUrl(invitation.venue),
    },
    program: invitation.program.map((item) => ({
      id: item.id,
      time: item.time,
      title: content.programTitles[item.id] ?? "",
    })),
    story: invitation.story
      .map((chapter) => ({
        id: chapter.id,
        title: chapter.title[locale] ?? "",
        text: chapter.text[locale] ?? "",
      }))
      .filter((chapter) => chapter.title.trim() || chapter.text.trim()),
    gallery: invitation.gallery.map((item) => ({
      id: item.id,
      src: publicAsset(item.url),
      alt: item.alt || item.caption,
      caption: item.caption,
    })),
    contacts: [
      ...(invitation.contacts.phoneNumber.trim()
        ? [
            {
              label:
                locale === "en"
                  ? "Phone"
                  : locale === "ru" || locale === "uz-Cyrl"
                    ? "Телефон"
                    : "Telefon",
              value: invitation.contacts.phoneNumber.trim(),
              type: "phone" as const,
              href: `tel:${invitation.contacts.phoneNumber.replace(/[^+\d]/g, "")}`,
            },
          ]
        : []),
      ...(invitation.contacts.telegramUsername.trim()
        ? [
            {
              label: "Telegram",
              value: invitation.contacts.telegramUsername.trim().startsWith("@")
                ? invitation.contacts.telegramUsername.trim()
                : `@${invitation.contacts.telegramUsername.trim()}`,
              type: "telegram" as const,
              href: `https://t.me/${invitation.contacts.telegramUsername.trim().replace(/^@/, "")}`,
            },
          ]
        : []),
      ...(invitation.contacts.instagramUrl.trim()
        ? [
            {
              label: "Instagram",
              value: invitation.contacts.instagramUrl.trim(),
              type: "instagram" as const,
              href: /^https?:\/\//i.test(invitation.contacts.instagramUrl.trim())
                ? invitation.contacts.instagramUrl.trim()
                : `https://www.instagram.com/${encodeURIComponent(invitation.contacts.instagramUrl.trim().replace(/^@/, ""))}/`,
            },
          ]
        : []),
    ],
    rsvp: invitation.rsvp,
    wishesEnabled: invitation.wishes.enabled,
    wishes: [],
    toyona: {
      enabled: invitation.gift.enabled,
      cardNumber: invitation.gift.cardNumber,
      cardHolder: invitation.gift.cardHolder,
      note: "",
    },
    music: {
      enabled: invitation.music.enabled,
      url: publicAsset(invitation.music.url),
    },
    dressCode: {
      enabled: invitation.dressCode.enabled,
      style: invitation.dressCode.enabled
        ? (invitation.dressCode.style[locale] ?? "")
        : "",
      text: invitation.dressCode.enabled
        ? (invitation.dressCode.text[locale] ?? "")
        : "",
      note: invitation.dressCode.enabled
        ? (invitation.dressCode.note[locale] ?? "")
        : "",
      colors: invitation.dressCode.enabled
        ? invitation.dressCode.colors.map((color) => ({
            id: color.id,
            name: color.name[locale] ?? "",
            hex: color.hex,
          }))
        : [],
    },
    timezone: invitation.timezone,
  };
}
