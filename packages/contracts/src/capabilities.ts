import type { Invitation, InvitationContent } from "./index";
import { TEMPLATE_CAPABILITIES } from "./template-capabilities";

export type TemplateCapabilities = {
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
  rsvpDeadline: boolean;
  age: boolean;
  people: number;
  artists: number;
};

const unsupported: TemplateCapabilities = {
  maps: false, music: false, wishes: false, gallery: 0, program: false,
  dressCode: false, story: 0, gift: false, receipts: false, phone: false,
  telegram: false, rsvp: "none", rsvpDeadline: false, age: false, people: 2, artists: 0,
};

export function templateCapabilities(id: string): TemplateCapabilities {
  return TEMPLATE_CAPABILITIES[id] ?? unsupported;
}

/** Project content onto the chosen design's actual slots before any persistence.
 * Pure and idempotent; also used by Studio, never dependent on client metadata.
 */
export function normalizeInvitation(invitation: Invitation): Invitation {
  if (!invitation.templateId) return invitation;
  const c = templateCapabilities(invitation.templateId);
  const content = Object.fromEntries(invitation.enabledLocales.map((locale) => {
    const value = invitation.content[locale];
    if (!value) return [locale, value];
    return [locale, {
      ...value,
      people: value.people.slice(0, c.people),
      ...(!c.program ? { programHeading: "", programTitles: {}, programDescriptions: {} } : {}),
    }];
  })) as Record<string, InvitationContent>;
  return {
    ...invitation,
    content,
    templateData: invitation.templateData[invitation.templateId] === undefined ? {} : {
      [invitation.templateId]: invitation.templateData[invitation.templateId],
    },
    celebrantAge: c.age ? invitation.celebrantAge : null,
    gallery: invitation.gallery.slice(0, c.gallery),
    program: c.program ? invitation.program : [],
    story: invitation.story.slice(0, c.story),
    artistLineup: invitation.artistLineup.slice(0, c.artists),
    venue: c.maps ? invitation.venue : { latitude: null, longitude: null, mapUrl: "" },
    dressCode: c.dressCode ? invitation.dressCode : { enabled: false, style: {}, text: {}, note: {}, colors: [] },
    music: c.music ? { ...invitation.music, enabled: invitation.music.enabled && !!invitation.music.url.trim() } : {
      enabled: false, assetId: null, url: "", filename: "",
    },
    gift: c.gift ? { ...invitation.gift, receiptUploadEnabled: c.receipts && invitation.gift.receiptUploadEnabled } : {
      enabled: false, receiptUploadEnabled: false, cardNumber: "", cardHolder: "",
    },
    contacts: {
      phoneNumber: c.phone ? invitation.contacts.phoneNumber : "",
      telegramUsername: c.telegram ? invitation.contacts.telegramUsername : "",
      instagramUrl: "",
    },
    rsvp: c.rsvp === "none" ? { enabled: false, deadline: "", maxPartySize: 1 } : { ...invitation.rsvp, deadline: c.rsvpDeadline ? invitation.rsvp.deadline : "", maxPartySize: 1 },
    wishes: { enabled: c.wishes && invitation.wishes.enabled, requireApproval: true },
  };
}
