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
  personIndex: number;
  /** Optional localized one-person name used by source templates such as Bitiruv. */
  personName?: Record<Locale, string>;
  title?: Record<Locale, string>;
  hosts: Record<Locale, string>;
  eventLabel?: Record<Locale, string>;
  startsAt?: string;
  programTimes?: string[];
  message?: Record<Locale, string>;
  venueName?: Record<Locale, string>;
  address?: Record<Locale, string>;
  programHeading: Record<Locale, string>;
  programTitles: Record<Locale, string[]>;
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
  program?: Array<{
    id: string;
    time: string;
    title: Record<Locale, string>;
    description: Record<Locale, string>;
  }>;
  artists?: Array<{
    id: string;
    name: Record<Locale, string>;
    role: Record<Locale, string>;
    imageUrl: string;
    imageAssetId?: string | null;
  }>;
  gallery?: Invitation["gallery"];
  story?: Invitation["story"];
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
  const useTemplateSample =
    templateId === "invitate-wedding" && sampleEventType === "wedding";
  const content = structuredClone(previewSample.content) as Invitation["content"];
  const dressCode = structuredClone(previewSample.dressCode);
  const program =
    useTemplateSample && templateSample?.program
      ? templateSample.program.map(({ id, time }) => ({ id, time }))
      : previewSample.program.map((entry) => ({ ...entry }));
  if (useTemplateSample && templateSample?.program) {
    for (const locale of Object.keys(content) as Locale[]) {
      content[locale].programTitles = {
        ...content[locale].programTitles,
        ...Object.fromEntries(
          templateSample.program.map((item) => [item.id, item.title[locale]]),
        ),
      };
      content[locale].programDescriptions = Object.fromEntries(
        templateSample.program.map((item) => [item.id, item.description[locale]]),
      );
    }
  }
  let startsAt = previewSample.startsAt;
  const nilufarFotihaPreview = templateId === "nilufar" && sampleEventType === "fotiha";
  if (nilufarFotihaPreview) {
    const fotihaLabels: Record<Locale, string> = {
      "uz-Latn": "Fotiha to‘yi",
      "uz-Cyrl": "Фотиҳа тўйи",
      en: "Engagement celebration",
      ru: "Праздник фотиha",
    };
    for (const locale of Object.keys(content) as Locale[]) {
      content[locale].eventLabel = fotihaLabels[locale];
    }
  }
  if (sampleEventType !== previewSample.eventType && !nilufarFotihaPreview) {
    const eventSample = EVENT_SAMPLES[sampleEventType];
    if (eventSample) {
      if (eventSample.startsAt) startsAt = eventSample.startsAt;
      program.forEach((entry, index) => {
        const time = eventSample.programTimes?.[index];
        if (time) entry.time = time;
      });
      for (const locale of Object.keys(content) as Locale[]) {
        content[locale].eventLabel = eventSample.eventLabel?.[locale] ?? "";
        if (eventSample.title) content[locale].title = eventSample.title[locale];
        content[locale].hosts = eventSample.hosts[locale];
        if (eventSample.message)
          content[locale].message = eventSample.message[locale];
        if (eventSample.venueName)
          content[locale].venueName = eventSample.venueName[locale];
        if (eventSample.address)
          content[locale].address = eventSample.address[locale];
        content[locale].programHeading = eventSample.programHeading[locale];
        const honoree =
          eventSample.personName?.[locale] ??
          previewSample.content[locale].people[eventSample.personIndex];
        content[locale].people = honoree ? [honoree] : [];
        program.forEach((entry, index) => {
          const title = eventSample.programTitles[locale][index];
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
    startsAt,
    timezone: previewSample.timezone,
    gift: structuredClone(previewSample.gift),
    contacts: structuredClone(previewSample.contacts),
    program,
    artistLineup: useTemplateSample ? templateSample?.artists ?? [] : [],
    gallery: structuredClone(templateSample?.gallery ?? previewSample.gallery),
    story: structuredClone(templateSample?.story ?? createInvitation(templateId).story),
    templateData: templateId === "wedivo-pulau-sehati"
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
): Array<{ name: string; text: string }> {
  return structuredClone(previewSample.wishes[locale]);
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
