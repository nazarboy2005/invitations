import renames from "./template-renames.json";

/** Canonical IDs are shared by storage, renderers and public links. Old IDs are input aliases only. */
const aliases = new Map<string, string>(renames.flatMap(item => item.aliases.map(alias => [alias, item.id] as [string, string])));

export function resolveTemplateId(id: string): string {
  return aliases.get(id) ?? id;
}

export const publicTemplateId = resolveTemplateId;

/** Upgrade recovered browser drafts without changing authored values. Canonical keys win conflicts. */
export function normalizeTemplateData(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const entries = Object.entries(value);
  const result = new Map<string, unknown>();
  const object = (item: unknown): item is Record<string, unknown> => !!item && typeof item === "object" && !Array.isArray(item);
  for (const [key, data] of entries.sort(([a], [b]) => Number(resolveTemplateId(a) === a) - Number(resolveTemplateId(b) === b))) {
    const id = resolveTemplateId(key);
    const previous = result.get(id);
    result.set(id, object(previous) && object(data) ? { ...previous, ...data } : data);
  }
  return Object.fromEntries(result);
}

export function publicTemplateName(name: string): string {
  return name
    .replace(/^(?:Taklifnomachi|Taklifla|Invitate|Chorlove|Wedivo|Marxaba|Onlinetaklifnoma|E-invitation)(?:\s*[\u00b7\u2014\u2013-]\s*|\s+)/i, "")
    .replace(/(?:\s*[\u00b7\u2014\u2013-]\s*|\s+)edition$/i, "")
    .trim();
}
