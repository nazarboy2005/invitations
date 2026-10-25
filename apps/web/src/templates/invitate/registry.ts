export const INVITATE_TEMPLATE_IDS = [
  "evelina",
  "aurelia",
  "butterfly",
  "swan",
  "velvet",
  "velora",
  "estelle",
  "invitate-palov",
  "invitate-nahorgi-osh",
  "fairy",
  "golden-hour",
  "girlsparty",
  "bloom",
  "invitate-wedding",
  "whiteless",
  "safir",
] as const;

export function isInvitateTemplate(id: string): boolean {
  return (INVITATE_TEMPLATE_IDS as readonly string[]).includes(id);
}
