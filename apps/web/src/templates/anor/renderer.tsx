"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { getContent } from "@taklifnoma/contracts";
import { eventInstant, eventWallDate, formatDate } from "../date-format";
import styles from "./template.module.css";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { getTemplatePreviewWishes } from "@/modules/catalog/preview-sample";
import { useInvitationExtras } from "../use-invitation-extras";

type Props = {
  invitation: Invitation;
  invitationId: string;
  locale: Locale;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  fullPreview?: boolean;
  catalogMusic?: boolean;
  sampleWishes?: boolean;
};

type LegacyDate = {
  weekday: string;
  weekdayShort: string;
  day: number | "";
  month: string;
  monthNumber: number | "";
  year: number | "";
  time: string;
  long: string;
  short: string;
};

export type LegacyData = {
  title: string;
  footer: string;
  groom: string;
  bride: string;
  hosts: string;
  hostsLabel: string;
  greeting: string;
  monogram: string;
  eventType: string;
  message: string;
  programHeading: string;
  dateTime: string;
  date: LegacyDate;
  venue: {
    name: string;
    address: string;
    lat: number | null;
    lng: number | null;
    mapUrl: string;
  };
  program: Array<{ id: string; time: string; title: string }>;
  story: Array<{ id: string; title: string; text: string }>;
  gallery: Array<{ id: string; src: string; alt: string; caption: string }>;
  contacts: Array<{
    label: string;
    value: string;
    type: "phone" | "telegram";
    href: string;
  }>;
  rsvp: Invitation["rsvp"];
  wishesEnabled: boolean;
  wishes: Array<{ name: string; text: string }>;
  toyona: {
    enabled: boolean;
    cardNumber: string;
    cardHolder: string;
    note: string;
  };
  music: { enabled: boolean; url: string };
  timezone: string;
  dressCode: {
    enabled: boolean;
    style: string;
    text: string;
    note: string;
    colors: Array<{ id: string; name: string; hex: string }>;
  };
};

const eventLabels: Record<Locale, Record<Invitation["eventType"], string>> = {
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
const hostsLabels: Record<Locale, string> = {
  "uz-Latn": "Hurmat bilan",
  "uz-Cyrl": "Ҳурмат билан",
  en: "With love from",
  ru: "С уважением",
};
const footerLabels: Record<Locale, string> = {
  "uz-Latn": "Marxaba bilan yaratildi",
  "uz-Cyrl": "Marxaba билан яратилди",
  en: "Made with Marxaba",
  ru: "Создано с Marxaba",
};

export function makeLegacyData(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  sampleWishes = false,
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
      mapUrl: invitation.venue.mapUrl,
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
      src: item.url,
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
    ],
    rsvp: invitation.rsvp,
    wishesEnabled: invitation.wishes.enabled,
    wishes: sampleWishes ? getTemplatePreviewWishes(locale) : [],
    toyona: {
      enabled: invitation.gift.enabled,
      cardNumber: invitation.gift.cardNumber,
      cardHolder: invitation.gift.cardHolder,
      note: "",
    },
    music: {
      enabled: invitation.music.enabled,
      url: invitation.music.url,
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

export function AnorInvitation({
  invitation,
  invitationId,
  locale,
  guestName = "",
  guestToken = "",
  preview = false,
  fullPreview = false,
  catalogMusic = false,
  sampleWishes = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [frameLocale, setFrameLocale] = useState(locale);
  const data = useMemo(
    () => makeLegacyData(invitation, frameLocale, guestName, sampleWishes),
    [invitation, frameLocale, guestName, sampleWishes],
  );
  const sendExtras = useInvitationExtras(
    frame,
    invitation,
    data,
    frameLocale,
    invitationId,
    guestToken,
    preview,
  );
  const rendererData = useMemo(
    () =>
      catalogMusic
        ? {
            ...data,
            music: { enabled: true, url: CATALOG_PREVIEW_MUSIC.url },
          }
        : data,
    [catalogMusic, data],
  );
  const payload = useMemo(
    () => ({
      type: "taklifnoma:initialize",
      payload: {
        data: rendererData,
        locale: frameLocale,
        enabledLocales: invitation.enabledLocales,
        invitationId,
        guestName,
        guestToken,
        preview,
        catalogMusic,
      },
    }),
    [
      catalogMusic,
      frameLocale,
      invitation.enabledLocales,
      invitationId,
      guestName,
      guestToken,
      preview,
      rendererData,
    ],
  );

  useEffect(() => setFrameLocale(locale), [locale]);

  const sendData = useCallback(() => {
    frame.current?.contentWindow?.postMessage(payload, window.location.origin);
    sendExtras();
  }, [payload, sendExtras]);

  useEffect(() => {
    // On public SSR pages the iframe can load before hydration attaches onLoad.
    // Sending on mount also initializes that already-loaded frame. If it is
    // still loading, onLoad below delivers the same current authored content.
    sendData();
  }, [sendData]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== "anor:language"
      )
        return;
      const next = event.data.locale as Locale;
      if (invitation.enabledLocales.includes(next)) {
        setFrameLocale(next);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [invitation.enabledLocales]);

  return (
    <div
      className={
        fullPreview
          ? styles.sourceFullPreview
          : preview
            ? styles.sourcePreview
            : styles.sourcePublic
      }
    >
      <iframe
        key={frameLocale}
        ref={frame}
        title={`${data.title || data.eventType} invitation`}
        src={`/templates/anor/source/index.html?locale=${encodeURIComponent(frameLocale)}`}
        onLoad={sendData}
        allow="autoplay; fullscreen"
        loading="eager"
      />
    </div>
  );
}
