"use client";
import { publicAsset } from "../../lib/public-asset";

import { useInvitationMaps } from "@/templates/use-invitation-maps";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import styles from "./renderer.module.css";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { useInvitationExtras } from "../use-invitation-extras";

type Props = {
  invitation: Invitation;
  invitationId: string;
  locale: Locale;
  templateId: string;
  guestName?: string;
  guestToken?: string;
  preview?: boolean;
  fullPreview?: boolean;
  catalogMusic?: boolean;
  sampleWishes?: boolean;
  silentPlayback?: boolean;
  qaReducedMotion?: boolean;
};

const sourceLocale: Record<Locale, string> = {
  "uz-Latn": "uz",
  "uz-Cyrl": "uz-Cyrl",
  en: "en",
  ru: "ru",
};

type PreviewGalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

type PreviewGalleryAlt = string | Record<Locale, string>;

const previewGalleryAssets: Record<
  string,
  Array<[string, PreviewGalleryAlt]>
> = {
  atlas: [
    ["silk-swatch-1.webp", "Atlas mato namunasi"],
    ["silk-swatch-3.webp", "Naqshli mato namunasi"],
    ["pouch.webp", "Atlas xaltacha bezagi"],
    ["silk-band.webp", "Atlas lenta bezagi"],
    ["silk-hero.webp", "Atlas mato bezagi"],
    ["silk-swatch-1.webp", "Atlas mato namunasi"],
  ],
  beshik: [["beshik.webp", "Beshikdagi bezak rasmi"]],
  bitiruv: [
    ["graduation-scene.webp", "Bitiruv qalpog‘i va diplom sahnasi"],
  ],
  doira: [
    ["courtyard-night-v2.webp", "Kechki hovli manzarasi"],
    ["velvet-curtains-v2.webp", "Baxmal parda bezagi"],
  ],
  hilol: [
    [
      "still-life.svg",
      {
        "uz-Latn": "Iftor dasturxoni va chiroq",
        "uz-Cyrl": "Ифтор дастурхони ва чироқ",
        en: "Iftar table and lantern",
        ru: "Стол для ифтара и фонарь",
      },
    ],
    [
      "girih-tile.svg",
      {
        "uz-Latn": "Hilol naqshli girih bezagi",
        "uz-Cyrl": "Ҳилол нақшли гирих безаги",
        en: "Crescent and girih ornament",
        ru: "Орнамент гирих с полумесяцем",
      },
    ],
    [
      "city-silhouette.svg",
      {
        "uz-Latn": "Shom paytidagi shahar manzarasi",
        "uz-Cyrl": "Шом пайтидаги шаҳар манзараси",
        en: "City skyline at dusk",
        ru: "Городской силуэт в сумерках",
      },
    ],
  ],
  korporativ: [
    [
      "event-01.svg",
      {
        "uz-Latn": "Korporativ oqshom sahnasidagi shisha monolit",
        "uz-Cyrl": "Корпоратив оқшом саҳнасидаги шиша монолит",
        en: "Glass monolith on the corporate evening stage",
        ru: "Стеклянный монолит на сцене корпоративного вечера",
      },
    ],
    [
      "event-02.svg",
      {
        "uz-Latn": "Elektrik ko‘k yorug‘likdagi sahna",
        "uz-Cyrl": "Электрик кўк ёруғликдаги саҳна",
        en: "Stage in electric blue light",
        ru: "Сцена в электрическом синем свете",
      },
    ],
    [
      "event-03.svg",
      {
        "uz-Latn": "Korporativ zalning me’moriy yorug‘ligi",
        "uz-Cyrl": "Корпоратив залнинг меъморий ёруғлиги",
        en: "Architectural lighting in the corporate ballroom",
        ru: "Архитектурный свет корпоративного зала",
      },
    ],
    [
      "venue.svg",
      {
        "uz-Latn": "Yil yakuni kechasining sahna kompozitsiyasi",
        "uz-Cyrl": "Йил якуни кечасининг саҳна композицияси",
        en: "Stage composition from the year-end evening",
        ru: "Сценическая композиция вечера по итогам года",
      },
    ],
  ],
  konfetti: [
    [
      "gallery-1.webp",
      {
        "uz-Latn": "Bayram uchun rangli sharlar",
        "uz-Cyrl": "Байрам учун рангли шарлар",
        en: "Colorful birthday balloons",
        ru: "Разноцветные праздничные шары",
      },
    ],
    [
      "gallery-2.webp",
      {
        "uz-Latn": "Shamlar bilan bezatilgan tort",
        "uz-Cyrl": "Шамлар билан безатилган торт",
        en: "Birthday cake with candles",
        ru: "Праздничный торт со свечами",
      },
    ],
    [
      "gallery-3.webp",
      {
        "uz-Latn": "Yaltirab uchayotgan konfetti",
        "uz-Cyrl": "Ялтираб учаётган конфетти",
        en: "Shimmering confetti",
        ru: "Сверкающее конфетти",
      },
    ],
    [
      "gallery-4.webp",
      {
        "uz-Latn": "Shamlar bilan bezatilgan bayram dasturxoni",
        "uz-Cyrl": "Шамлар билан безатилган байрам дастурхони",
        en: "Candlelit birthday table",
        ru: "Праздничный стол со свечами",
      },
    ],
  ],
  "oltin-kuz": [
    ["memory-01.svg", {
      "uz-Latn": "Oila davrasidagi qadrlik xotira",
      "uz-Cyrl": "Оила даврасидаги қадрли хотира",
      en: "A treasured memory with family",
      ru: "Дорогая память в кругу семьи",
    }],
    ["memory-02.svg", {
      "uz-Latn": "Farzandlar bilan birga o‘tgan yillar",
      "uz-Cyrl": "Фарзандлар билан бирга ўтган йиллар",
      en: "Years spent with her children",
      ru: "Годы рядом с детьми",
    }],
    ["memory-03.svg", {
      "uz-Latn": "Oilaviy bayramdan xotira",
      "uz-Cyrl": "Оилавий байрамдан хотира",
      en: "A family celebration",
      ru: "Семейный праздник",
    }],
    ["memory-04.svg", {
      "uz-Latn": "Nevaralar bilan quvonchli kun",
      "uz-Cyrl": "Набиралар билан қувончли кун",
      en: "A joyful day with grandchildren",
      ru: "Радостный день с внуками",
    }],
    ["memory-05.svg", {
      "uz-Latn": "Mehrga to‘la oilaviy surat",
      "uz-Cyrl": "Меҳрга тўла оилавий сурат",
      en: "A family portrait full of love",
      ru: "Семейная фотография, полная любви",
    }],
  ],
};

export function mapMarxabaPreviewGallery(
  templateId: string,
  invitationGallery: Invitation["gallery"],
  sourceGallery: PreviewGalleryItem[],
  locale: Locale,
  preview: boolean,
  samplePreview: boolean,
): PreviewGalleryItem[] {
  const hasCreatorPhotos = invitationGallery.some((photo) => photo.url.trim());
  const previewGallery = previewGalleryAssets[templateId];
  if (!preview || !samplePreview || hasCreatorPhotos || !previewGallery)
    return sourceGallery;

  return previewGallery.map(([file, alt], index) => {
    const localizedAlt = typeof alt === "string" ? alt : alt[locale];
    return {
      id: `${templateId}-source-preview-${index + 1}`,
      src: publicAsset(`/templates/${encodeURIComponent(templateId)}/art/${file}`),
      alt: localizedAlt,
      caption: localizedAlt,
    };
  });
}

export function mapMarxabaPreviewVenuePhoto(
  templateId: string,
  invitationGallery: Invitation["gallery"],
  preview: boolean,
  samplePreview: boolean,
): string | undefined {
  const hasCreatorPhotos = invitationGallery.some((photo) => photo.url.trim());
  if (templateId !== "oltin-kuz" || !preview || !samplePreview || hasCreatorPhotos)
    return undefined;

  return publicAsset("/templates/oltin-kuz/art/venue.svg");
}

export function MarxabaInvitation({
  invitation,
  invitationId,
  locale,
  templateId,
  guestName = "",
  guestToken = "",
  preview = false,
  fullPreview = false,
  catalogMusic = false,
  silentPlayback = false,
  qaReducedMotion = false,
  sampleWishes = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const initialized = useRef(false);
  const structuralSignature = useRef("");
  const [frameLocale, setFrameLocale] = useState(locale);
  useEffect(() => setFrameLocale(locale), [locale]);
  const sourceData = useMemo(
    () => makeLegacyData(invitation, frameLocale, guestName, sampleWishes),
    [invitation, frameLocale, guestName, sampleWishes],
  );
  const sendExtras = useInvitationExtras(
    frame,
    invitation,
    sourceData,
    frameLocale,
    invitationId,
    guestToken,
    preview,
  );
  const enabledLanguages = invitation.enabledLocales.map(
    (item) => sourceLocale[item],
  );
  const message = useMemo(() => {
    const gallery = mapMarxabaPreviewGallery(
      templateId,
      invitation.gallery,
      sourceData.gallery,
      frameLocale,
      preview,
      sampleWishes,
    );
    const venuePhoto = mapMarxabaPreviewVenuePhoto(
      templateId,
      invitation.gallery,
      preview,
      sampleWishes,
    );
    const musicUrl = sourceData.music.enabled
      ? sourceData.music.url
      : catalogMusic
        ? CATALOG_PREVIEW_MUSIC.url
        : "";
    return {
      ...sourceData,
      ...(venuePhoto
        ? { venue: { ...sourceData.venue, photo: venuePhoto } }
        : {}),
      gallery,
      // Several captured single-celebrant designs bind this source-only
      // slot. The shared contract's first person remains the source of truth.
      extras: {
        celebrant: sourceData.groom || sourceData.bride,
        ...(templateId === "muhabbat-kitobi"
          ? { story: sourceData.story }
          : {}),
      },
      ...(templateId === "muhabbat-kitobi" ? { story: undefined } : {}),
      ...(templateId === "bitiruv"
        ? { monogram: (sourceData.groom || sourceData.bride).trim().charAt(0) }
        : {}),
      // Samarqand Kechasi's original runtime uses `dataTime` in its lock
      // and opening sequence; the shared contract exposes `dateTime`.
      ...(templateId === "samarqand-kechasi"
        ? { dataTime: sourceData.dateTime }
        : {}),
      music: musicUrl,
      slug: preview ? "" : invitationId,
      rsvpDetails: invitation.rsvp,
      wishesEnabled: invitation.wishes.enabled,
      guestToken,
      name: guestName,
      defaultLang: sourceLocale[frameLocale],
      languages: enabledLanguages,
      languageSwitcher: true,
      silentPlayback: preview && silentPlayback,
      catalogPreview: catalogMusic,
      i18n: Object.fromEntries(
        invitation.enabledLocales.map((enabledLocale) => {
          const localized = makeLegacyData(
            invitation,
            enabledLocale,
            guestName,
            sampleWishes,
          );
          return [
            sourceLocale[enabledLocale],
            {
              // Some captured scripts build their opening name art from this
              // map, while the shared runtime uses program titles during its
              // first render. Keep both aligned with the active language.
              groom: localized.groom,
              bride: localized.bride,
              extras: {
                celebrant: localized.groom || localized.bride,
                ...(templateId === "muhabbat-kitobi"
                  ? { story: localized.story }
                  : {}),
              },
              ...(templateId === "muhabbat-kitobi" ? { story: undefined } : {}),
              ...(templateId === "bitiruv"
                ? {
                    monogram: (localized.groom || localized.bride)
                      .trim()
                      .charAt(0),
                  }
                : {}),
              program: localized.program,
              music: musicUrl,
            },
          ];
        }),
      ),
      preview,
      status: preview ? "published" : invitation.status,
      apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
    };
  }, [
    catalogMusic,
    enabledLanguages,
    frameLocale,
    guestName,
    guestToken,
    invitation.enabledLocales,
    invitation.status,
    invitation.gallery,
    invitationId,
    preview,
    sampleWishes,
    sourceData,
  ]);
  const latestMessage = useRef(message);
  latestMessage.current = message;
  const frameUrl = publicAsset(`/templates/${encodeURIComponent(templateId)}/index.html?lang=${sourceLocale[frameLocale]}${preview && qaReducedMotion ? "&qaReducedMotion=1" : ""}`);
  const currentStructure = JSON.stringify({
    frameUrl,
    start: invitation.startsAt,
    timezone: invitation.timezone,
    languages: enabledLanguages,
    music: message.music,
    dateTime: message.dateTime,
    dataTime: "dataTime" in message ? message.dataTime : undefined,
    silentPlayback: message.silentPlayback,
    rsvp: invitation.rsvp.enabled,
    wishes: invitation.wishes.enabled,
    gift: invitation.gift.enabled,
    gallery: invitation.gallery.map((item) => item.id),
  });
  // Keep React's iframe src stable. Locale changes are already handled by the
  // explicit replace below, after the latest locale data has been put in
  // window.name; updating both src and location at once can race and drop data.
  const initialFrameUrl = useRef(frameUrl);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== "marxaba:language" ||
        !invitation.enabledLocales.some(
          (enabled) => sourceLocale[enabled] === event.data.locale,
        )
      )
        return;
      const next = invitation.enabledLocales.find(
        (enabled) => sourceLocale[enabled] === event.data.locale,
      );
      if (next) setFrameLocale(next);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [invitation.enabledLocales]);

  useEffect(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    if (
      !initialized.current ||
      structuralSignature.current !== currentStructure
    ) {
      try {
        target.name = JSON.stringify(message);
        target.location.replace(frameUrl);
      } catch {
        target.location.replace(frameUrl);
      }
      initialized.current = true;
      structuralSignature.current = currentStructure;
      return;
    }
    target.postMessage(
      { type: "marxaba:update", payload: message },
      window.location.origin,
    );
  }, [currentStructure, frameUrl, message]);

  const frameClass = fullPreview
    ? styles.full
    : preview
      ? styles.preview
      : styles.public;

  return (
    <div className={frameClass}>
      <iframe
        ref={frame}
        title={`${sourceData.title || sourceData.eventType} invitation`}
        src={initialFrameUrl.current}
        onLoad={() => {
          sendExtras();
          frame.current?.contentWindow?.postMessage(
            { type: "marxaba:update", payload: latestMessage.current },
            window.location.origin,
          );
        }}
        allow="autoplay; fullscreen"
        loading="eager"
      />
    </div>
  );
}
