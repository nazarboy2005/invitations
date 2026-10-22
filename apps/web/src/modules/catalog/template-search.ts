import {
  EVENT_TYPE_OPTIONS,
  type TemplateCategory,
  type TemplateDefinition,
} from "@taklifnoma/contracts";

export function normalizeTemplateSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("uz")
    .replace(/[ʻʼ‘’'`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function matchesTemplateSearch(
  template: TemplateDefinition,
  categories: TemplateCategory[],
  query: string,
): boolean {
  const normalizedQuery = normalizeTemplateSearch(query);
  if (!normalizedQuery) return true;

  const searchableText = [
    template.name,
    template.description,
    ...categories
      .filter((category) => template.categoryIds.includes(category.id))
      .map((category) => category.name),
    ...template.supportedEventTypes.map(
      (id) =>
        EVENT_TYPE_OPTIONS.find((eventType) => eventType.id === id)?.name ?? id,
    ),
  ]
    .map(normalizeTemplateSearch)
    .join(" ");

  return searchableText.includes(normalizedQuery);
}
