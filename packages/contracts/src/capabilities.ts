import type { Invitation, InvitationContent } from "./index";
import { TEMPLATE_CAPABILITIES } from "./template-capabilities";
import { normalizeVenue } from "./maps";

export type ImageContentField =
  | "eventLabel"
  | "people"
  | "message"
  | "venueName"
  | "address"
  | "landmark"
  | "greeting"
  | "hosts";
// Required for every image design; location can be a written address or a map point.
export const IMAGE_REQUIRED_FIELDS = [
  "people",
  "eventLabel",
  "message",
  "startsAt",
  "timezone",
  "venueName",
  "location",
] as const;

export type TemplateCapabilities = {
  hasRenderer: boolean;
  imageFields?: readonly ImageContentField[];
  locationQr?: boolean;
  maps: boolean;
  music: boolean;
  wishes: boolean;
  gallery: number;
  program: boolean;
  dressCode: boolean;
  story: number;
  gift: boolean;
  receipts: boolean;
  phone: boolean;
  telegram: boolean;
  rsvp: "none" | "deadline" | "phone" | "form";
  /** The RSVP adapter saves an additional note or source-supported contact detail. */
  rsvpNotes: boolean;
  rsvpDeadline: boolean;
  age: boolean;
  people: number;
  artists: number;
  contactLimit: number;
  /** Individual editable slots, beyond section-level support. */
  inputs: {
    hosts: boolean;
    greeting: boolean;
    eventLabel: boolean;
    programHeading: boolean;
    programDescriptions: boolean;
    dressStyle: boolean;
    dressText: boolean;
    dressNote: boolean;
    dressColorNames: boolean;
    dressColorHex: boolean;
  };
  programLimit: number;
  dressColorLimit: number;
};

const unsupported: TemplateCapabilities = {
  hasRenderer: false,
  maps: false,
  music: false,
  wishes: false,
  gallery: 0,
  program: false,
  dressCode: false,
  story: 0,
  gift: false,
  receipts: false,
  phone: false,
  telegram: false,
  rsvp: "none",
  rsvpNotes: false,
  rsvpDeadline: false,
  age: false,
  people: 2,
  artists: 0,
  contactLimit: 0,
  inputs: { hosts: false, greeting: false, eventLabel: false, programHeading: false, programDescriptions: false, dressStyle: false, dressText: false, dressNote: false, dressColorNames: false, dressColorHex: false },
  programLimit: 0,
  dressColorLimit: 0,
};

export function templateCapabilities(id: string): TemplateCapabilities {
  return TEMPLATE_CAPABILITIES[id] ?? unsupported;
}

/** Source-supported visitor interactions; stored on every catalog template. */
export type TemplateVisitorFeatures = {
  rsvp: TemplateCapabilities["rsvp"];
  wishes: boolean;
  receipts: boolean;
  giftIntentions: boolean;
};

export function templateVisitorFeatures(id: string): TemplateVisitorFeatures {
  const c = templateCapabilities(id);
  return {
    rsvp: c.rsvp,
    wishes: c.wishes,
    receipts: c.gift && c.receipts,
    giftIntentions: id === "wedivo-pulau-sehati",
  };
}

export function invitationActivityFeatures(invitation: Invitation, counts = { responses: 0, wishes: 0, receipts: 0, intentions: 0 }) {
  const f = templateVisitorFeatures(invitation.templateId);
  const giftWell = (invitation.templateData["wedivo-pulau-sehati"] as { giftWell?: { enabled?: boolean } } | undefined)?.giftWell;
  // Keep previous submissions accessible after the owner turns an optional form off.
  return {
    responses: f.rsvp === "form" && (invitation.rsvp.enabled || counts.responses > 0),
    wishes: f.wishes && (invitation.wishes.enabled || counts.wishes > 0),
    receipts: f.receipts && ((invitation.gift.enabled && invitation.gift.receiptUploadEnabled) || counts.receipts > 0),
    intentions: f.giftIntentions && (!!giftWell?.enabled || counts.intentions > 0),
  };
}

/** Project authored content onto the chosen design's actual rendering slots.
 * Pure and idempotent; persistence validates separately before any projection.
 */
export function normalizeInvitation(invitation: Invitation): Invitation {
  if (!invitation.templateId) return invitation;
  const c = templateCapabilities(invitation.templateId);
  const content = Object.fromEntries(
    Object.entries(invitation.content).map(([locale, value]) => {
      if (!value) return [locale, value];
      return [
        locale,
        {
          ...value,
          ...(c.imageFields
            ? Object.fromEntries(
                [
                  "title",
                  "greeting",
                  "personalGreeting",
                  "hosts",
                  "eventLabel",
                  "message",
                  "venueName",
                  "address",
                  "landmark",
                ]
                  .filter(
                    (field) =>
                      !c.imageFields!.includes(field as ImageContentField),
                  )
                  .map((field) => [field, ""]),
              )
            : {}),
          people: value.people.slice(0, c.people),
          hosts: c.inputs.hosts ? value.hosts : "",
          greeting: c.inputs.greeting ? value.greeting : "",
          personalGreeting: c.inputs.greeting ? value.personalGreeting : "",
          eventLabel: c.inputs.eventLabel ? value.eventLabel : "",
          programHeading: c.program && c.inputs.programHeading ? value.programHeading : "",
          programDescriptions: c.program && c.inputs.programDescriptions ? value.programDescriptions : {},
          ...(!c.program
            ? { programHeading: "", programTitles: {}, programDescriptions: {} }
            : {}),
        },
      ];
    }),
  ) as Record<string, InvitationContent>;
  return {
    ...invitation,
    content,
    templateData:
      invitation.templateData[invitation.templateId] === undefined
        ? {}
        : {
            [invitation.templateId]:
              invitation.templateData[invitation.templateId],
          },
    celebrantAge: c.age && invitation.eventType === "birthday" ? invitation.celebrantAge : null,
    gallery: invitation.gallery.slice(0, c.gallery),
    program: c.program ? invitation.program.slice(0, c.programLimit) : [],
    story: invitation.story.slice(0, c.story),
    artistLineup: invitation.artistLineup.slice(0, c.artists),
    venue: c.maps
      ? normalizeVenue(invitation.venue)
      : { latitude: null, longitude: null, mapUrl: "" },
    dressCode: c.dressCode
      ? { ...invitation.dressCode,
          style: c.inputs.dressStyle ? invitation.dressCode.style : {},
          text: c.inputs.dressText ? invitation.dressCode.text : {},
          note: c.inputs.dressNote ? invitation.dressCode.note : {},
          colors: c.inputs.dressColorNames || c.inputs.dressColorHex
            ? invitation.dressCode.colors.slice(0, c.dressColorLimit).map(color => ({ ...color,
                name: c.inputs.dressColorNames ? color.name : {},
                hex: c.inputs.dressColorHex ? color.hex : "#000000",
              })) : [],
        }
      : { enabled: false, style: {}, text: {}, note: {}, colors: [] },
    music: c.music
      ? {
          ...invitation.music,
          enabled: invitation.music.enabled && !!invitation.music.url.trim(),
        }
      : {
          enabled: false,
          assetId: null,
          url: "",
          filename: "",
        },
    gift: c.gift
      ? {
          ...invitation.gift,
          receiptUploadEnabled:
            c.receipts && invitation.gift.receiptUploadEnabled,
        }
      : {
          enabled: false,
          receiptUploadEnabled: false,
          cardNumber: "",
          cardHolder: "",
        },
    contacts: {
      phoneNumber: c.phone && !(c.contactLimit === 1 && c.telegram && invitation.contacts.telegramUsername.trim()) ? invitation.contacts.phoneNumber : "",
      telegramUsername: c.telegram ? invitation.contacts.telegramUsername : "",
      instagramUrl: "",
    },
    rsvp:
      c.rsvp === "none"
        ? { enabled: false, deadline: "", maxPartySize: 1 }
        : {
            ...invitation.rsvp,
            deadline: c.rsvpDeadline ? invitation.rsvp.deadline : "",
            maxPartySize: 1,
          },
    wishes: {
      enabled: c.wishes && invitation.wishes.enabled,
      requireApproval: true,
    },
  };
}

/** Hide optional creator sections from guest-facing renderers without deleting saved content. */
export function applyOptionalFeatureVisibility(invitation: Invitation): Invitation {
  const features = invitation.optionalFeatures;
  if (features.gallery && features.artists && features.contacts) return invitation;
  return {
    ...invitation,
    gallery: features.gallery ? invitation.gallery : [],
    artistLineup: features.artists ? invitation.artistLineup : [],
    contacts: features.contacts
      ? invitation.contacts
      : { phoneNumber: "", telegramUsername: "", instagramUrl: "" },
  };
}
