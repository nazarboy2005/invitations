"use client";
import { publicAsset } from "../../lib/public-asset";

import { useInvitationMaps } from "@/templates/use-invitation-maps";
import { yandexMapUrl } from "@taklifnoma/contracts/maps";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { getContent } from "@taklifnoma/contracts";
import { getTemplatePreviewWishes } from "@/modules/catalog/preview-sample";
import { eventInstant, formatDate } from "../date-format";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";
import { makeNahorgiOshData } from "./nahorgi-osh-adapter";
import styles from "./renderer.module.css";
import { makeBloomData } from "./bloom-adapter";
import { makeVelvetData } from "./velvet-adapter";
import { makeWeddingData } from "./wedding-adapter";
import { makeGoldenHourData } from "./golden-hour/adapter";
import { useInvitationExtras } from "@/templates/use-invitation-extras";
import { AureliaSoundtrack } from "./aurelia-soundtrack";
import { SafirInvitation } from "./safir-renderer";

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
  silentPlayback?: boolean;
  qaReducedMotion?: boolean;
};

const sourceLocale: Record<Locale, string> = {
  "uz-Latn": "uz",
  "uz-Cyrl": "uz-Cyrl",
  en: "en",
  ru: "ru",
};

export function InvitateInvitation({
  invitation,
  invitationId,
  locale,
  guestName = "",
  guestToken = "",
  preview = false,
  fullPreview = false,
  catalogMusic = false,
  sampleWishes = false,
  silentPlayback = false,
  qaReducedMotion = false,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  useInvitationMaps(frame);
  const initialized = useRef<string | null>(null);
  const [frameLocale, setFrameLocale] = useState(locale);
  const templateId = invitation.templateId;
  useEffect(() => setFrameLocale(locale), [locale]);

  const message = useMemo(() => {
    const source = makeLegacyData(
      invitation,
      frameLocale,
      guestName,
      sampleWishes,
    );
    const hasCreatorPhotos = invitation.gallery.some((photo) =>
      photo.url.trim(),
    );
    if (
      preview &&
      sampleWishes &&
      !hasCreatorPhotos &&
      templateId === "evelina"
    ) {
      source.gallery = [
        {
          id: "evelina-source-preview",
          src: publicAsset("/templates/evelina/assets/previews/template/evelina/hero.png"),
          alt: "Evelina manba fotosurati",
          caption: "Evelina manba fotosurati",
        },
      ];
    }
    if (preview && sampleWishes && !hasCreatorPhotos && templateId === "swan") {
      source.gallery = [
        {
          id: "swan-source-preview",
          src: publicAsset("/templates/swan/assets/images/0310/1.png"),
          alt: "Swan source preview photo",
          caption: "Swan source preview photo",
        },
      ];
    }
    const languages = invitation.enabledLocales.map(
      (item) => sourceLocale[item],
    );
    const music = source.music.enabled
      ? source.music.url
      : preview && catalogMusic
        ? CATALOG_PREVIEW_MUSIC.url
        : "";
    return {
      ...source,
      platformPreview: preview,
      catalogPreview: preview && sampleWishes,
      locale: sourceLocale[frameLocale],
      defaultLang: sourceLocale[frameLocale],
      languages,
      guestName,
      guestToken,
      music,
      preview,
      silentPlayback: preview && silentPlayback,
      apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
    };
  }, [
    catalogMusic,
    frameLocale,
    guestName,
    guestToken,
    invitation,
    invitationId,
    preview,
    sampleWishes,
    silentPlayback,
  ]);
  const estelleMessage = useMemo(() => {
    const source = makeLegacyData(
      invitation,
      frameLocale,
      guestName,
      sampleWishes,
    );
    const content = getContent(invitation, frameLocale);
    const when = eventInstant(invitation.startsAt, invitation.timezone);
    const date = when
      ? formatDate(invitation.startsAt, frameLocale, invitation.timezone, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";
    return {
      ...source,
      eventType: content.eventLabel,
      greeting: guestName
        ? content.personalGreeting.replaceAll("{name}", guestName) ||
          content.greeting
        : content.greeting,
      dateTime: when?.toISOString() ?? "",
      timezone: invitation.timezone,
      date: { short: date },
      venue: {
        ...source.venue,
        name: content.venueName,
        address: content.address,
        landmark: content.landmark,
        lat: invitation.venue.latitude,
        lng: invitation.venue.longitude,
        mapUrl: yandexMapUrl(invitation.venue),
      },
      programHeading: content.programHeading,
      program: invitation.program.map((entry) => ({
        id: entry.id,
        time: entry.time,
        title: content.programTitles[entry.id] ?? "",
      })),
      dressCode: {
        enabled: invitation.dressCode.enabled,
        style: invitation.dressCode.style[frameLocale] ?? "",
        text: invitation.dressCode.text[frameLocale] ?? "",
        note: invitation.dressCode.note[frameLocale] ?? "",
        colors: invitation.dressCode.colors.map((color) => ({
          hex: color.hex,
          name: color.name[frameLocale] ?? "",
        })),
      },
      wishesEnabled: invitation.wishes.enabled,
      rsvpIntro: content.message,
      rsvp: invitation.rsvp,
      hosts: content.hosts,
      gift: invitation.gift,
      preview: preview && sampleWishes,
      locale: sourceLocale[frameLocale],
      languages: invitation.enabledLocales.map((item) => sourceLocale[item]),
      guestName,
      guestToken,
      music: invitation.music.enabled
        ? publicAsset(invitation.music.url)
        : preview && catalogMusic
          ? CATALOG_PREVIEW_MUSIC.url
          : "",
      apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
      contacts: source.contacts,
      qaReducedMotion: preview && qaReducedMotion,
    };
  }, [
    catalogMusic,
    frameLocale,
    guestName,
    guestToken,
    invitation,
    invitationId,
    preview,
    qaReducedMotion,
    sampleWishes,
  ]);
  const veloraMessage = useMemo(() => {
    const source = makeLegacyData(
      invitation,
      frameLocale,
      guestName,
      sampleWishes,
    );
    const content = getContent(invitation, frameLocale);
    const when = eventInstant(invitation.startsAt, invitation.timezone);
    return {
      ...source,
      locale: sourceLocale[frameLocale],
      languages: invitation.enabledLocales.map((item) => sourceLocale[item]),
      eventType: content.eventLabel,
      greeting: guestName
        ? content.personalGreeting.replaceAll("{name}", guestName) ||
          content.greeting
        : content.greeting,
      invitationText: content.message,
      welcome: content.greeting,
      dateTime: when?.toISOString() ?? "",
      timezone: invitation.timezone,
      venue: {
        ...source.venue,
        name: content.venueName,
        address: content.address,
        landmark: content.landmark,
        lat: invitation.venue.latitude,
        lng: invitation.venue.longitude,
        mapUrl: yandexMapUrl(invitation.venue),
      },
      programHeading: content.programHeading,
      program: invitation.program.map((entry) => ({
        id: entry.id,
        time: entry.time,
        title: content.programTitles[entry.id] ?? "",
      })),
      dressCode: {
        enabled: invitation.dressCode.enabled,
        style: invitation.dressCode.style[frameLocale] ?? "",
        text: invitation.dressCode.text[frameLocale] ?? "",
        note: invitation.dressCode.note[frameLocale] ?? "",
        colors: invitation.dressCode.colors.map((color) => ({
          hex: color.hex,
          name: color.name[frameLocale] ?? "",
        })),
      },
      rsvp: invitation.rsvp,
      music: invitation.music.enabled
        ? publicAsset(invitation.music.url)
        : preview && catalogMusic
          ? CATALOG_PREVIEW_MUSIC.url
          : "",
      guestName,
      guestToken,
      apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
      contacts: source.contacts,
      preview: preview && sampleWishes,
    };
  }, [
    catalogMusic,
    frameLocale,
    guestName,
    guestToken,
    invitation,
    invitationId,
    preview,
    sampleWishes,
  ]);
  const velvetMessage = useMemo(
    () =>
      makeVelvetData(
        invitation,
        frameLocale,
        guestName,
        guestToken,
        invitationId,
        preview,
        catalogMusic,
        silentPlayback,
        qaReducedMotion,
      ),
    [
      catalogMusic,
      frameLocale,
      guestName,
      guestToken,
      invitation,
      invitationId,
      preview,
      qaReducedMotion,
      silentPlayback,
    ],
  );
  const nahorgiOshMessage = useMemo(
    () =>
      makeNahorgiOshData(
        invitation,
        frameLocale,
        guestName,
        guestToken,
        invitationId,
        preview,
        sampleWishes,
      ),
    [
      frameLocale,
      guestName,
      guestToken,
      invitation,
      invitationId,
      preview,
      sampleWishes,
    ],
  );
  const goldenHourMessage = useMemo(() => {
    const message = makeGoldenHourData(
      invitation,
      frameLocale,
      guestName,
      guestToken,
      invitationId,
      preview,
      preview && sampleWishes,
    );
    if (!message.music.enabled && preview && catalogMusic)
      message.music = { enabled: true, url: CATALOG_PREVIEW_MUSIC.url };
    return message;
  }, [
    catalogMusic,
    frameLocale,
    guestName,
    guestToken,
    invitation,
    invitationId,
    preview,
    sampleWishes,
  ]);
  const whitelessMessage = useMemo(() => {
    const source = makeLegacyData(
      invitation,
      frameLocale,
      guestName,
      preview && sampleWishes,
    );
    const content = getContent(invitation, frameLocale);
    const when = eventInstant(invitation.startsAt, invitation.timezone);
    return {
      ...source,
      locale: sourceLocale[frameLocale],
      languages: invitation.enabledLocales.map((item) => sourceLocale[item]),
      title: content.title,
      eventType: content.eventLabel,
      message: content.message,
      dateTime: when?.toISOString() ?? "",
      timezone: invitation.timezone,
      venue: {
        ...source.venue,
        name: content.venueName,
        address: [content.address, content.landmark].filter(Boolean).join(", "),
        mapUrl: yandexMapUrl(invitation.venue),
      },
      rsvp: invitation.rsvp,
      rsvpEnabled: invitation.rsvp.enabled,
      wishesEnabled: invitation.wishes.enabled,
      receiptUploadEnabled:
        invitation.gift.enabled && invitation.gift.receiptUploadEnabled,
      gallery: invitation.gallery
        .filter((item) => item.url.trim())
        .map((item) => ({
          id: item.id,
          src: publicAsset(item.url),
          alt: item.alt || item.caption,
          caption: item.caption,
        })),
      music: invitation.music.enabled ? publicAsset(invitation.music.url) : "",
      guestToken,
      preview,
      apiBase: `/api/public/invitations/${encodeURIComponent(invitationId)}`,
    };
  }, [
    frameLocale,
    guestName,
    guestToken,
    invitation,
    invitationId,
    preview,
    sampleWishes,
  ]);
  const sendGoldenHourExtras = useInvitationExtras(
    frame,
    invitation,
    goldenHourMessage,
    frameLocale,
    invitationId,
    guestToken,
    preview,
    templateId === "golden-hour",
  );
  const bloomMessage = useMemo(
    () =>
      makeBloomData(
        invitation,
        frameLocale,
        guestName,
        guestToken,
        invitationId,
        preview,
        catalogMusic,
        silentPlayback,
      ),
    [
      catalogMusic,
      frameLocale,
      guestName,
      guestToken,
      invitation,
      invitationId,
      preview,
      silentPlayback,
    ],
  );
  const weddingMessage = useMemo(
    () =>
      makeWeddingData(
        invitation,
        frameLocale,
        guestName,
        guestToken,
        invitationId,
        preview && sampleWishes,
        qaReducedMotion,
      ),
    [
      frameLocale,
      guestName,
      guestToken,
      invitation,
      invitationId,
      preview,
      qaReducedMotion,
      sampleWishes,
    ],
  );
  const activeMessage =
    templateId === "girlsparty"
      ? {
          ...message,
          wishes:
            preview && sampleWishes
              ? getTemplatePreviewWishes(frameLocale).map((item) => ({
                  name: item.name,
                  text: item.text,
                }))
              : [],
          title: getContent(invitation, frameLocale).title,
          greeting: guestName
            ? getContent(invitation, frameLocale).personalGreeting.replaceAll(
                "{name}",
                guestName,
              ) || getContent(invitation, frameLocale).greeting
            : getContent(invitation, frameLocale).greeting,
          message: getContent(invitation, frameLocale).message,
          dateTime:
            eventInstant(
              invitation.startsAt,
              invitation.timezone,
            )?.toISOString() ?? "",
          timezone: invitation.timezone,
          preview,
          rsvp: invitation.rsvp,
          wishesEnabled: invitation.wishes.enabled,
        }
      : templateId === "invitate-wedding"
        ? weddingMessage
        : templateId === "bloom"
          ? bloomMessage
          : templateId === "estelle"
            ? estelleMessage
            : templateId === "velora"
              ? veloraMessage
              : templateId === "velvet"
                ? velvetMessage
                : templateId === "invitate-nahorgi-osh"
                  ? nahorgiOshMessage
                  : templateId === "golden-hour"
                    ? goldenHourMessage
                    : templateId === "whiteless"
                      ? whitelessMessage
                      : message;
  const latest = useRef(activeMessage);
  latest.current = activeMessage;
  const frameUrl = publicAsset(`/templates/${templateId}/index.html?lang=${sourceLocale[locale]}${preview && templateId === "estelle" && qaReducedMotion ? "&qaReducedMotion=1" : ""}`);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== `${templateId}:language`
      )
        return;
      const next = invitation.enabledLocales.find(
        (enabled) => sourceLocale[enabled] === event.data.locale,
      );
      if (next) setFrameLocale(next);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [invitation.enabledLocales, templateId]);

  useEffect(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    target.postMessage(
      { type: `${templateId}:update`, payload: latest.current },
      window.location.origin,
    );
  }, [activeMessage, templateId]);

  if (templateId === "safir")
    return (
      <SafirInvitation
        invitation={invitation}
        invitationId={invitationId}
        locale={locale}
        guestName={guestName}
        guestToken={guestToken}
        preview={preview}
        fullPreview={fullPreview}
        catalogMusic={catalogMusic}
        sampleWishes={sampleWishes}
        silentPlayback={silentPlayback}
      />
    );

  const classes = fullPreview
    ? styles.full
    : preview
      ? styles.preview
      : styles.public;
  return (
    <div className={classes}>
      {templateId === "aurelia" && invitation.music.enabled && publicAsset(invitation.music.url) && !(preview && silentPlayback) && (
        <AureliaSoundtrack key={publicAsset(invitation.music.url)} url={publicAsset(invitation.music.url)} locale={frameLocale} />
      )}
      <iframe
        key={templateId}
        ref={frame}
        title={
          templateId === "golden-hour"
            ? `${activeMessage.title || activeMessage.eventType} invitation`
            : `${activeMessage.groom} & ${activeMessage.bride} invitation`
        }
        src={frameUrl}
        onLoad={() => {
          const target = frame.current?.contentWindow;
          if (!target) return;
          if (initialized.current !== templateId) {
            target.name = JSON.stringify(latest.current);
            target.location.replace(frameUrl);
            initialized.current = templateId;
          } else {
            target.postMessage(
              { type: `${templateId}:update`, payload: latest.current },
              window.location.origin,
            );
          }
          if (templateId === "golden-hour") sendGoldenHourExtras();
        }}
        allow="autoplay; fullscreen; clipboard-write"
        loading="eager"
      />
    </div>
  );
}
