import type { EventType, TemplateDefinition } from "@taklifnoma/contracts";

const NIKOH_TEMPLATE_IDS = [
  "anor",
  "bulutlar-qasri",
  "bogi-eram",
  "ganch",
  "yashil-makon",
  "kuzgi-chinor",
  "muhr",
  "orik-guli",
  "samarqand-kechasi",
  "baxt-kaliti",
  "kozgu",
];

const nikohRank = new Map(NIKOH_TEMPLATE_IDS.map((id, index) => [id, index]));

/** Catalog and studio share this ranking; homepage selections stay separate. */
function editorialCatalogTemplates(
  templates: TemplateDefinition[],
  categoryId: string,
): TemplateDefinition[] {
  if (categoryId !== "all" && categoryId !== "wedding") {
    return templates.filter((template) =>
      template.categoryIds.includes(categoryId),
    );
  }

  const nikoh = templates
    .filter((template) => template.categoryIds.includes("wedding"))
    .sort(
      (a, b) =>
        (nikohRank.get(a.id) ?? NIKOH_TEMPLATE_IDS.length) -
        (nikohRank.get(b.id) ?? NIKOH_TEMPLATE_IDS.length),
    );

  if (categoryId === "wedding") return nikoh;

  const ordered = nikoh.slice(0, 10);
  const otherCategories = new Map<string, TemplateDefinition[]>();
  for (const template of templates) {
    if (template.categoryIds.includes("wedding")) continue;
    // A design appears once in All, even when assigned to multiple categories.
    const category = template.categoryIds[0] ?? "uncategorized";
    const queue = otherCategories.get(category) ?? [];
    queue.push(template);
    otherCategories.set(category, queue);
  }

  // Alternate categories without shuffling the designs within each category.
  const queues = [...otherCategories.values(), nikoh.slice(10)];
  for (let index = 0; ordered.length < templates.length; index += 1) {
    for (const queue of queues) {
      if (index < queue.length) ordered.push(queue[index]);
    }
  }
  return ordered;
}

/** Latest pins lead; unpinned designs retain their price and curated ordering. */
export function compareCatalogTemplates(
  a: TemplateDefinition,
  b: TemplateDefinition,
): number {
  if (a.pinnedOrder != null || b.pinnedOrder != null) {
    if (a.pinnedOrder == null) return 1;
    if (b.pinnedOrder == null) return -1;
    const aOrder = BigInt(a.pinnedOrder);
    const bOrder = BigInt(b.pinnedOrder);
    return aOrder > bOrder ? -1 : aOrder < bOrder ? 1 : 0;
  }
  return b.priceMinor - a.priceMinor;
}

export function orderCatalogTemplates(
  templates: TemplateDefinition[],
  categoryId: string,
): TemplateDefinition[] {
  return editorialCatalogTemplates(templates, categoryId).sort(
    compareCatalogTemplates,
  );
}

/** Event compatibility is independent of the admin-managed catalog categories. */
export function orderEventTemplates(
  templates: TemplateDefinition[],
  eventType: EventType,
): TemplateDefinition[] {
  const compatible = templates.filter(
    (template) =>
      template.published && template.supportedEventTypes.includes(eventType),
  );
  if (eventType !== "wedding") return orderCatalogTemplates(compatible, "all");
  return [
    ...orderCatalogTemplates(compatible, "wedding"),
    ...compatible.filter(
      (template) => !template.categoryIds.includes("wedding"),
    ),
  ].sort(compareCatalogTemplates);
}
