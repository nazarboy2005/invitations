import { DEFAULT_INVITATION_MUSIC } from "@taklifnoma/contracts/music";
import {
  createInvitation,
  invitationSchema,
  templateById,
  type Invitation,
  type Locale,
  type EventType,
} from "@taklifnoma/contracts";
import previewSample from "./preview-sample.json";

type EventSample = {
  personIndex?: number;
  celebrantAge?: number;
  details?: {programLabels:Record<string,Partial<Record<Locale,string>>>;families:{bride:Partial<Record<Locale,string>>;groom:Partial<Record<Locale,string>>};reminderTitle:Partial<Record<Locale,string>>;reminderText:Partial<Record<Locale,string>>;footerNote:Partial<Record<Locale,string>>;giftNote:Partial<Record<Locale,string>>;stayText:Partial<Record<Locale,string>>;hashtag:string};
  housewarmingDetails?: Invitation["templateData"][string];
  anniversaryDetails?: Invitation["templateData"][string];
  story?: Invitation["story"];
  /** Optional localized one-person name used by source templates such as Bitiruv. */
  personName?: Record<Locale, string>;
  title?: Record<Locale, string>;
  hosts?: Record<Locale, string>;
  eventLabel?: Record<Locale, string>;
  startsAt?: string;
  programTimes?: string[];
  message?: Record<Locale, string>;
  venueName?: Record<Locale, string>;
  address?: Record<Locale, string>;
  venue?: Invitation["venue"];
  programHeading?: Record<Locale, string>;
  programTitles?: Record<Locale, string[]>;
  dressCode?: {
    style: Record<Locale, string>;
    text: Record<Locale, string>;
    note: Record<Locale, string>;
    colors?: Array<{ name: Record<Locale, string>; hex: string }>;
  };
};

type TemplateSample = {
  /** Preview-only source photo behind a template's scratch reveal. */
  scratchPhoto?: string;
  /** Preview-only photo captured in a source template without a shared contract field. */
  venuePhoto?: string;
  gallery?: Invitation["gallery"];
};

function rollingPreviewStart(timezone: string, reference: string): string {
  const formatter = new Intl.DateTimeFormat("en", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const localNow = Object.fromEntries(
    formatter.formatToParts(new Date()).map((part) => [part.type, part.value]),
  );
  const localDate = new Date(
    Date.UTC(Number(localNow.year), Number(localNow.month) - 1, Number(localNow.day) + 10),
  );
  const [hour = "18", minute = "00"] = reference.slice(11, 16).split(":");
  const desiredUtc = Date.UTC(
    localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(),
    Number(hour), Number(minute),
  );
  let instant = desiredUtc;
  for (let attempt = 0; attempt < 2; attempt++) {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
      }).formatToParts(new Date(instant)).map((part) => [part.type, part.value]),
    );
    const representedUtc = Date.UTC(
      Number(parts.year), Number(parts.month) - 1, Number(parts.day),
      Number(parts.hour), Number(parts.minute), Number(parts.second),
    );
    instant = desiredUtc - (representedUtc - instant);
  }
  return new Date(instant).toISOString();
}

const EVENT_SAMPLES = previewSample.eventSamples as Partial<
  Record<EventType, EventSample>
>;
const TEMPLATE_SAMPLES = previewSample.templateSamples as Partial<
  Record<string, TemplateSample>
>;

/** Source-only template media for catalog and blank template-selection previews. */
export function getTemplatePreviewVenuePhoto(templateId: string): string | undefined {
  return TEMPLATE_SAMPLES[templateId]?.venuePhoto;
}
export function getTemplatePreviewScratchPhoto(templateId: string): string | undefined {
  return TEMPLATE_SAMPLES[templateId]?.scratchPhoto;
}
/**
 * A presentation-only fixture for catalog and empty template-selection previews.
 * Never persist this value as a creator's invitation.
 */
export function createTemplatePreviewSample(
  templateId: string,
  localeSettings?: Pick<Invitation, "defaultLocale" | "enabledLocales"> &
    Partial<Pick<Invitation, "eventType">>,
  previewTimezone?: string,
): Invitation {
  const template = templateById(templateId);
  const sampleEventType = (
    localeSettings?.eventType &&
    template?.supportedEventTypes.includes(localeSettings.eventType)
      ? localeSettings.eventType
      : template?.previewEventType &&
        template.supportedEventTypes.includes(template.previewEventType)
      ? template.previewEventType
      : template?.supportedEventTypes.some(
            (eventType) => eventType === previewSample.eventType,
          )
        ? previewSample.eventType
        : (template?.supportedEventTypes[0] ?? previewSample.eventType)
  ) as EventType;
  const templateSample = TEMPLATE_SAMPLES[templateId];
  const content = structuredClone(previewSample.content) as Invitation["content"];
  const dressCode = structuredClone(previewSample.dressCode);
  const program = previewSample.program.map((entry) => ({ ...entry }));
  let startsAt = previewSample.startsAt;
  let timezone = previewSample.timezone;
  {
    const eventSample = EVENT_SAMPLES[sampleEventType];
    if (eventSample) {
      if (eventSample.startsAt) startsAt = eventSample.startsAt;
      program.forEach((entry, index) => {
        const time = eventSample.programTimes?.[index];
        if (time) entry.time = time;
      });
      for (const locale of Object.keys(content) as Locale[]) {
        content[locale].eventLabel = eventSample.eventLabel?.[locale] ?? (sampleEventType === "wedding" ? content[locale].eventLabel : "");
        if (eventSample.title) content[locale].title = eventSample.title[locale];
        content[locale].hosts = eventSample.hosts?.[locale] ?? content[locale].hosts;
        if (eventSample.message)
          content[locale].message = eventSample.message[locale];
        if (eventSample.venueName)
          content[locale].venueName = eventSample.venueName[locale];
        if (eventSample.address)
          content[locale].address = eventSample.address[locale];
        content[locale].programHeading = eventSample.programHeading?.[locale] ?? content[locale].programHeading;
        const honoree =
          eventSample.personName?.[locale] ??
          (eventSample.personIndex != null ? previewSample.content[locale].people[eventSample.personIndex] : undefined);
        if (eventSample.personIndex != null || eventSample.personName) content[locale].people = honoree ? [honoree] : [];
        program.forEach((entry, index) => {
          const title = eventSample.programTitles?.[locale]?.[index];
          if (title)
            (content[locale].programTitles as Record<string, string>)[
              entry.id
            ] = title;
        });
        if (eventSample.dressCode) {
          dressCode.style[locale] = eventSample.dressCode.style[locale];
          dressCode.text[locale] = eventSample.dressCode.text[locale];
          dressCode.note[locale] = eventSample.dressCode.note[locale];
        }
        if (eventSample.dressCode?.colors) {
          dressCode.colors = eventSample.dressCode.colors.map(
            (color, index) => ({
              ...dressCode.colors[index],
              name: color.name,
              hex: color.hex,
            }),
          );
        }
      }
    }
  }
  if (previewTimezone) {
    try {
      startsAt = rollingPreviewStart(previewTimezone, startsAt);
      timezone = previewTimezone;
    } catch {
      // Keep the stable fixture date when the browser reports an invalid zone.
    }
  }
  return invitationSchema.parse({
    ...createInvitation(templateId),
    defaultLocale: localeSettings?.defaultLocale ?? previewSample.defaultLocale,
    enabledLocales: localeSettings
      ? [...localeSettings.enabledLocales]
      : [...previewSample.enabledLocales],
    eventType: sampleEventType,
    celebrantAge: EVENT_SAMPLES[sampleEventType]?.celebrantAge ?? null,
    startsAt,
    timezone,
    venue: structuredClone(EVENT_SAMPLES[sampleEventType]?.venue ?? previewSample.venue),
    gift: structuredClone(previewSample.gift),
    contacts: structuredClone(previewSample.contacts),
    program,
    artistLineup: sampleEventType === "wedding" ? structuredClone(previewSample.artistLineup) : [],
    gallery: structuredClone(templateSample?.gallery ?? previewSample.gallery),
    story: structuredClone(EVENT_SAMPLES[sampleEventType]?.story ?? (sampleEventType === "wedding" ? previewSample.story : [])),
    templateData: templateId === "taklifla-terracotta" && EVENT_SAMPLES[sampleEventType]?.details ? {"taklifla-terracotta":structuredClone({infoNote:EVENT_SAMPLES[sampleEventType]!.details!.reminderText,footerNote:EVENT_SAMPLES[sampleEventType]!.details!.footerNote})} : templateId === "taklifla-yulduzli-tun" && EVENT_SAMPLES[sampleEventType]?.details ? {"taklifla-yulduzli-tun":structuredClone({infoNote:EVENT_SAMPLES[sampleEventType]!.details!.reminderText,footerNote:EVENT_SAMPLES[sampleEventType]!.details!.footerNote})} : templateId === "taklifla-sharlar" ? {"taklifla-sharlar":{doorsAt:previewSample.program[0]?.time || ""}} : templateId === "taklifla-sakura-guli" && EVENT_SAMPLES[sampleEventType]?.details
      ? { "taklifla-sakura-guli": structuredClone({infoNote:EVENT_SAMPLES[sampleEventType]!.details!.reminderText,footerNote:EVENT_SAMPLES[sampleEventType]!.details!.footerNote}) }
      : templateId === "taklifla-qogoz-ertagi" && EVENT_SAMPLES[sampleEventType]?.details
      ? { "taklifla-qogoz-ertagi": structuredClone({footerNote:EVENT_SAMPLES[sampleEventType]!.details!.footerNote}) }
      : templateId === "taklifla-parilar-ertagi" && EVENT_SAMPLES[sampleEventType]?.details
      ? { "taklifla-parilar-ertagi": structuredClone({arrivalNote:EVENT_SAMPLES[sampleEventType]!.details!.reminderText,programLabels:EVENT_SAMPLES[sampleEventType]!.details!.programLabels}) }
      : templateId === "taklifla-osmon" && EVENT_SAMPLES[sampleEventType]?.details
      ? { "taklifla-osmon": structuredClone({giftNote:EVENT_SAMPLES[sampleEventType]!.details!.giftNote}) }
      : templateId === "taklifla-oltin-yol" && EVENT_SAMPLES[sampleEventType]?.details
      ? { "taklifla-oltin-yol": structuredClone({arrivalNote:EVENT_SAMPLES[sampleEventType]!.details!.reminderText,giftNote:EVENT_SAMPLES[sampleEventType]!.details!.giftNote,footerNote:EVENT_SAMPLES[sampleEventType]!.details!.footerNote}) }
      : templateId === "taklifla-toglar-bagrida"
      ? { "taklifla-toglar-bagrida": {ceremonyTime:previewSample.program[0]?.time || "",celebrationTime:previewSample.program[1]?.time || ""} }
      : templateId === "taklifla-zarrin-gullar" && EVENT_SAMPLES[sampleEventType]?.details
      ? { "taklifla-zarrin-gullar": structuredClone({brideFamily:EVENT_SAMPLES[sampleEventType]!.details!.families.bride,groomFamily:EVENT_SAMPLES[sampleEventType]!.details!.families.groom,stayText:EVENT_SAMPLES[sampleEventType]!.details!.stayText,footerNote:EVENT_SAMPLES[sampleEventType]!.details!.footerNote,hashtag:EVENT_SAMPLES[sampleEventType]!.details!.hashtag}) }
      : templateId === "taklifla-gulbog" && EVENT_SAMPLES[sampleEventType]?.details
      ? { "taklifla-gulbog": structuredClone({brideFamily:EVENT_SAMPLES[sampleEventType]!.details!.families.bride,reminderTitle:EVENT_SAMPLES[sampleEventType]!.details!.reminderTitle,reminderText:EVENT_SAMPLES[sampleEventType]!.details!.reminderText,footerNote:EVENT_SAMPLES[sampleEventType]!.details!.footerNote}) }
      : templateId === "taklifla-fayzli-xonadon" && EVENT_SAMPLES[sampleEventType]?.housewarmingDetails
      ? { "taklifla-fayzli-xonadon": structuredClone(EVENT_SAMPLES[sampleEventType]!.housewarmingDetails!) }
      : templateId === "taklifla-yubiley-sahifasi" && EVENT_SAMPLES[sampleEventType]?.anniversaryDetails
      ? { "taklifla-yubiley-sahifasi": structuredClone(EVENT_SAMPLES[sampleEventType]!.anniversaryDetails!) }
      : templateId === "wedivo-pulau-sehati"
      ? { "wedivo-pulau-sehati": {
          inscription: { arabic: "", text: {}, attribution: {} },
          profiles: [
            { bio: {}, characterClass: "", origin: "", stats: [], skill: "", item: "" },
            { bio: {}, characterClass: "", origin: "", stats: [], skill: "", item: "" },
          ],
          hotels: [], media: { videoUrl: "", liveUrl: "", intro: "" }, giftWell: { enabled: false, currencyLabel: "UZS" },
          secondaryEvent: { enabled: false, date: "", time: "", label: "", venueName: "", address: "", mapUrl: "" }, storyDates: {}, coInviters: "",
          missions: [], keepsakes: [], hashtag: "",
        } }
      : {},
    content,
    dressCode,
    rsvp: { ...createInvitation(templateId).rsvp, enabled: true },
    wishes: { enabled: true, requireApproval: true },
  });
}

/** Localized sample guest wishes for previews only; these never enter saved invitations. */
export function getTemplatePreviewWishes(
  locale: Locale,
  templateId?: string,
): Array<{ name: string; text: string }> {
  return structuredClone(
    previewSample.wishes[locale],
  );
}

/** Create an ephemeral stress-test variant for responsive name lockups. */
export function createLongNamePreview(invitation: Invitation): Invitation {
  const content = Object.fromEntries(
    Object.entries(invitation.content).map(([locale, localized]) => [
      locale,
      {
        ...localized,
        people: [
          "Gulbahor-Marguba Sayyidabonu",
          "Jahongir-Shohruhbek Mirzohid",
        ],
      },
    ]),
  );
  return invitationSchema.parse({ ...invitation, content });
}

/** Detect creator-entered invitation content without counting default toggles. */
export function hasAuthoredInvitationContent(invitation: Invitation): boolean {
  const hasText = (values: Array<string | undefined>) =>
    values.some((value) => Boolean(value?.trim()));
  const authoredCopy = Object.values(invitation.content).some((content) =>
    hasText([
      content.title,
      content.hosts,
      content.greeting,
      content.personalGreeting,
      content.message,
      content.eventLabel,
      content.venueName,
      content.address,
      content.landmark,
      content.programHeading,
      ...content.people,
      ...Object.values(content.programTitles),
      ...Object.values(content.programDescriptions),
    ]),
  );
  const authoredStory = invitation.story.some((chapter) =>
    hasText([...Object.values(chapter.title), ...Object.values(chapter.text)]),
  );
  const dressCode = invitation.dressCode;
  const authoredDressCode =
    dressCode.enabled ||
    hasText([
      ...Object.values(dressCode.style),
      ...Object.values(dressCode.text),
      ...Object.values(dressCode.note),
      ...dressCode.colors.flatMap((color) => Object.values(color.name)),
      ...dressCode.colors.map((color) => color.hex),
    ]);
  const authoredGift =
    invitation.gift.enabled ||
    invitation.gift.receiptUploadEnabled ||
    hasText([invitation.gift.cardNumber, invitation.gift.cardHolder]);
  const authoredRsvp =
    invitation.rsvp.enabled !== true ||
    Boolean(invitation.rsvp.deadline.trim()) ||
    invitation.rsvp.maxPartySize !== 1;
  return Boolean(
    authoredCopy ||
    authoredStory ||
    invitation.artistLineup.some((artist) =>
      hasText([
        ...Object.values(artist.name),
        ...Object.values(artist.role),
        artist.imageUrl,
      ]),
    ) ||
    authoredDressCode ||
    authoredGift ||
    authoredRsvp ||
    !invitation.wishes.enabled ||
    invitation.eventType !== "other" ||
    invitation.celebrantAge !== null ||
    invitation.startsAt ||
    invitation.program.length ||
    invitation.gallery.length ||
    invitation.contacts.phoneNumber.trim() ||
    invitation.contacts.telegramUsername.trim() ||
    (invitation.music.url && invitation.music.url !== DEFAULT_INVITATION_MUSIC.url) ||
    invitation.music.assetId ||
    invitation.venue.mapUrl ||
    invitation.venue.latitude !== null ||
    invitation.venue.longitude !== null,
  );
}
