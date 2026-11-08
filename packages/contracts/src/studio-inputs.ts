import {
  type Invitation,
  terracottaDataSchema, starryDataSchema, sharlarDataSchema, sakuraDataSchema,
  qogozDataSchema, pariDataSchema, osmonDataSchema, oltinYolDataSchema,
  mountainDataSchema, zarrinDataSchema, gulbogDataSchema, fayzliXonadonDataSchema,
  yubileySahifasiDataSchema, muhrliMaktubDataSchema, pulauSehatiDataSchema,
} from "./index";
import { templateCapabilities } from "./capabilities";

type Path = (string | number)[];
type Slot = { path: Path; value: unknown; empty: unknown };
export type UnsupportedInvitationInput = { path: string; message: string };
const meaningful = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.some(meaningful);
  if (value && typeof value === "object") return Object.values(value).some(meaningful);
  return value !== undefined && value !== null && value !== "" && value !== false;
};
const hasUnsupportedValue = (slot: Slot) =>
  (meaningful(slot.value) || slot.path.join(".") === "wishes.requireApproval") && !same(slot.value, slot.empty);
function same(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ak = Object.keys(a), bk = Object.keys(b);
  return ak.length === bk.length && ak.every(key => Object.hasOwn(b, key) && same((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
}
function read(value: unknown, path: Path): unknown {
  for (const key of path) value = value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined;
  return value;
}
function write(value: unknown, path: Path, replacement: unknown) {
  const parent = read(value, path.slice(0, -1)) as Record<string, unknown> | undefined;
  if (parent) parent[path.at(-1)!] = replacement;
}

/** Keep this allowlist aligned with the template-specific Studio editors. */
export function templateDataSchema(id: string) {
  return ({
    "terrakota": terracottaDataSchema,
    "yulduzli-tun": starryDataSchema,
    "sharlar": sharlarDataSchema,
    "sakura-guli": sakuraDataSchema,
    "qogoz-ertagi": qogozDataSchema,
    "parilar-ertagi": pariDataSchema,
    "osmon": osmonDataSchema,
    "oltin-yol": oltinYolDataSchema,
    "toglar-bagrida": mountainDataSchema,
    "zarrin-gullar": zarrinDataSchema,
    "gulbog": gulbogDataSchema,
    "fayzli-xonadon": fayzliXonadonDataSchema,
    "umr-bahori": yubileySahifasiDataSchema,
    "muhrli-maktub": muhrliMaktubDataSchema,
    "kongillar-oroli": pulauSehatiDataSchema,
  } as const)[id as "kongillar-oroli"];
}

function unsupportedSlots(invitation: Invitation): Slot[] {
  if (!invitation.templateId) return [];
  const c = templateCapabilities(invitation.templateId), slots: Slot[] = [];
  const add = (supported: boolean, path: Path, empty: unknown) => {
    if (!supported) slots.push({ path, value: read(invitation, path), empty });
  };
  const limit = (path: Path, items: unknown[], count: number) => {
    items.slice(count).forEach((value, index) => slots.push({ path: [...path, index + count], value, empty: undefined }));
  };
  for (const [locale, content] of Object.entries(invitation.content)) {
    const path = ["content", locale];
    add(!c.imageFields, [...path, "title"], "");
    for (const field of ["hosts", "greeting", "eventLabel"] as const)
      add(c.inputs[field] && (!c.imageFields || c.imageFields.includes(field)), [...path, field], "");
    add(c.inputs.greeting && !c.imageFields, [...path, "personalGreeting"], "");
    add(c.program && c.inputs.programHeading, [...path, "programHeading"], "");
    add(c.program, [...path, "programTitles"], {});
    add(c.program && c.inputs.programDescriptions, [...path, "programDescriptions"], {});
    limit([...path, "people"], content.people, c.people);
  }
  limit(["gallery"], invitation.gallery, c.gallery);
  limit(["program"], invitation.program, c.program ? c.programLimit : 0);
  limit(["story"], invitation.story, c.story);
  limit(["artistLineup"], invitation.artistLineup, c.artists);
  add(c.age && invitation.eventType === "birthday", ["celebrantAge"], null);
  add(c.maps, ["venue"], { latitude: null, longitude: null, mapUrl: "" });
  add(c.music, ["music"], { enabled: false, assetId: null, url: "", filename: "" });
  add(c.gift, ["gift"], { enabled: false, receiptUploadEnabled: false, cardNumber: "", cardHolder: "" });
  add(c.gift && c.receipts, ["gift", "receiptUploadEnabled"], false);
  add(c.phone, ["contacts", "phoneNumber"], "");
  add(c.telegram, ["contacts", "telegramUsername"], "");
  if (c.contactLimit === 1 && invitation.contacts.phoneNumber.trim() && invitation.contacts.telegramUsername.trim())
    slots.push({ path: ["contacts", "phoneNumber"], value: invitation.contacts.phoneNumber, empty: "" });
  add(false, ["contacts", "instagramUrl"], "");
  add(c.rsvp !== "none", ["rsvp", "enabled"], false);
  add(c.rsvp !== "none" && c.rsvpDeadline, ["rsvp", "deadline"], "");
  add(false, ["rsvp", "maxPartySize"], 1);
  add(c.wishes, ["wishes", "enabled"], false);
  add(false, ["wishes", "requireApproval"], true);
  add(c.dressCode, ["dressCode", "enabled"], false);
  for (const [field, supported] of [["style", c.inputs.dressStyle], ["text", c.inputs.dressText], ["note", c.inputs.dressNote]] as const)
    add(c.dressCode && supported, ["dressCode", field], {});
  const colorLimit = c.dressCode && (c.inputs.dressColorNames || c.inputs.dressColorHex) ? c.dressColorLimit : 0;
  limit(["dressCode", "colors"], invitation.dressCode.colors, colorLimit);
  invitation.dressCode.colors.slice(0, colorLimit).forEach((_, i) => {
    add(c.inputs.dressColorNames, ["dressCode", "colors", i, "name"], {});
    add(c.inputs.dressColorHex, ["dressCode", "colors", i, "hex"], "#000000");
  });
  const unknownKeys = (original: unknown, parsed: unknown, path: Path) => {
    if (!original || typeof original !== "object") return;
    for (const [key, value] of Object.entries(original)) {
      const nextPath = [...path, Array.isArray(original) ? Number(key) : key];
      if (!parsed || typeof parsed !== "object" || !Object.hasOwn(parsed, key)) slots.push({ path: nextPath, value, empty: undefined });
      else unknownKeys(value, (parsed as Record<string, unknown>)[key], nextPath);
    }
  };
  for (const [id, data] of Object.entries(invitation.templateData)) {
    const schema = id === invitation.templateId ? templateDataSchema(id) : undefined;
    if (!schema) slots.push({ path: ["templateData", id], value: data, empty: undefined });
    else {
      const parsed = schema.safeParse(data);
      if (parsed.success) unknownKeys(data, parsed.data, ["templateData", id]);
      // Invalid known structures are rejected by invitationSchema at API ingress.
    }
  }
  return slots;
}

/** Validate the submitted document BEFORE projection. Only server-loaded, owned
 * previous values may survive unchanged in slots hidden by a template switch.
 */
export function unsupportedInvitationInputs(invitation: Invitation, previous?: Invitation | null): UnsupportedInvitationInput[] {
  return unsupportedSlots(invitation).filter(slot =>
    hasUnsupportedValue(slot) &&
    !(previous && same(slot.value, read(previous, slot.path))),
  ).map(slot => ({ path: slot.path.join("."), message: "Tanlangan dizayn bu maydonni qo‘llamaydi." }));
}

/** Client convenience only. The server independently validates the raw request.
 * Pending content hidden by a switch stays in the browser, while existing
 * server-owned hidden data can round-trip unchanged without being editable.
 */
export function studioSavePayload(invitation: Invitation, previous?: Invitation | null): Invitation {
  const output = structuredClone(invitation);
  const slots = unsupportedSlots(invitation);
  // Process array tails backwards; object deletions must not leave undefined JSON.
  for (const slot of slots.reverse()) {
    if (!hasUnsupportedValue(slot) || (previous && same(slot.value, read(previous, slot.path)))) continue;
    const existing = previous ? read(previous, slot.path) : undefined;
    const parent = read(output, slot.path.slice(0, -1));
    if (Array.isArray(parent) && typeof slot.path.at(-1) === "number") {
      if (existing === undefined) parent.splice(slot.path.at(-1) as number, 1);
      else write(output, slot.path, structuredClone(existing));
    } else if (existing === undefined && slot.empty === undefined) {
      if (parent && typeof parent === "object") delete (parent as Record<string, unknown>)[slot.path.at(-1)!];
    } else write(output, slot.path, structuredClone(existing ?? slot.empty));
  }
  return output;
}

/** Canonicalize global policies without deleting valid, previously authored
 * hidden content. Renderers receive normalizeInvitation's separate projection.
 */
export function invitationForStorage(invitation: Invitation): Invitation {
  return { ...invitation,
    music: { ...invitation.music, enabled: invitation.music.enabled && !!invitation.music.url.trim() },
    rsvp: { ...invitation.rsvp, maxPartySize: 1 },
    wishes: { ...invitation.wishes, requireApproval: true },
  };
}
