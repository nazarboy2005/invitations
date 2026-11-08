export const INVITATE_TEMPLATE_IDS = [
  "baxt-kaliti",
  "aurelia",
  "kapalak",
  "oqqush",
  "velvet",
  "velora",
  "estelle",
  "osh-ziyofati",
  "sahar-ziyofati",
  "sehrli-oqshom",
  "oltin-lahza",
  "dugonalar",
  "gullar-bayrami",
  "gulchambar",
  "orzular",
  "safir",
] as const;

export function isInvitateTemplate(id: string): boolean {
  return (INVITATE_TEMPLATE_IDS as readonly string[]).includes(id);
}
