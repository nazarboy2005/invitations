import type { TemplateDefinition } from "@taklifnoma/contracts";

// Editorial selection: a mix of visual styles and occasions, not a popularity claim.
const FEATURED_TEMPLATE_IDS = [
  "anor",
  "atlas",
  "bulbul",
  "toscana",
  "konfetti",
  "lola",
  "nahorgi-osh",
  "yangi-uy",
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
  for (const [id, template] of published) ordered.set(id, template);
  return [...ordered.values()].slice(0, 8);
}
