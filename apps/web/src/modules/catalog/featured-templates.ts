import type { TemplateDefinition } from "@taklifnoma/contracts";

// Owner-selected order. Unavailable designs are omitted, never substituted.
const FEATURED_TEMPLATE_IDS = [
  "anor",
  "bogi-eram",
  "cloud-castle",
  "ganch",
  "kuzgi-chinor",
  "nahor",
  "yangi-uy",
  "shirin-bayram",
];

export function selectFeaturedTemplates(templates: TemplateDefinition[]) {
  const published = new Map(
    templates
      .filter((template) => template.published)
      .map((template) => [template.id, template]),
  );
  const ordered = new Map<string, TemplateDefinition>();
  for (const id of FEATURED_TEMPLATE_IDS) {
    const template = published.get(id);
    if (template) ordered.set(id, template);
  }
  return [...ordered.values()];
}
