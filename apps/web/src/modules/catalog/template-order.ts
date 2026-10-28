import type { EventType, TemplateDefinition } from "@taklifnoma/contracts";

const NIKOH_TEMPLATE_IDS = [
  "anor",
  "cloud-castle",
  "bogi-eram",
  "ganch",
  "green-garden",
  "kuzgi-chinor",
  "muhr",
  "orik-guli",
  "samarqand-kechasi",
  "evelina",
  "kozgu",
];

const nikohRank = new Map(NIKOH_TEMPLATE_IDS.map((id, index) => [id, index]));

/** Catalog and studio share this ranking; homepage selections stay separate. */
export function orderCatalogTemplates(
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
  ];
}
