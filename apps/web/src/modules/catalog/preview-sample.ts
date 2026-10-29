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
  details?: {families:{bride:Partial<Record<Locale,string>>;groom:Partial<Record<Locale,string>>};reminderTitle:Partial<Record<Locale,string>>;reminderText:Partial<Record<Locale,string>>;footerNote:Partial<Record<Locale,string>>;giftNote:Partial<Record<Locale,string>>;stayText:Partial<Record<Locale,string>>;hashtag:string};
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
  /** Preview-only photo captured in a source template without a shared contract field. */
  venuePhoto?: string;
  gallery?: Invitation["gallery"];
};

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
/**
 * A presentation-only fixture for catalog and empty template-selection previews.
 * Never persist this value as a creator's invitation.
 */
export function createTemplatePreviewSample(
  templateId: string,
  localeSettings?: Pick<Invitation, "defaultLocale" | "enabledLocales">,
): Invitation {
  const template = templateById(templateId);
  const sampleEventType = (
    template?.previewEventType &&
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
  return invitationSchema.parse({
    ...createInvitation(templateId),
    defaultLocale: localeSettings?.defaultLocale ?? previewSample.defaultLocale,
    enabledLocales: localeSettings
      ? [...localeSettings.enabledLocales]
      : [...previewSample.enabledLocales],
    eventType: sampleEventType,
    celebrantAge: EVENT_SAMPLES[sampleEventType]?.celebrantAge ?? null,
    startsAt,
    timezone: previewSample.timezone,
    venue: structuredClone(EVENT_SAMPLES[sampleEventType]?.venue ?? previewSample.venue),
    gift: structuredClone(previewSample.gift),
    contacts: structuredClone(previewSample.contacts),
    program,
    artistLineup: sampleEventType === "wedding" ? structuredClone(previewSample.artistLineup) : [],
    gallery: structuredClone(templateSample?.gallery ?? previewSample.gallery),
    story: structuredClone(EVENT_SAMPLES[sampleEventType]?.story ?? (sampleEventType === "wedding" ? previewSample.story : [])),
    templateData: templateId === "taklifla-oltin-yol" && EVENT_SAMPLES[sampleEventType]?.details
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
    invitation.rsvp.maxPartySize !== 5;
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
    invitation.music.enabled ||
    invitation.music.url ||
    invitation.music.filename ||
    invitation.music.assetId ||
    invitation.venue.mapUrl ||
    invitation.venue.latitude !== null ||
    invitation.venue.longitude !== null,
  );
}
