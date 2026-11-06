export const CHORLOVE_TEMPLATE_IDS = [
  "cloud-castle",
  "glass-pink",
  "golden-card",
  "green-garden",
  "green-gold",
  "green-white",
  "ivory-love",
  "jasmine-white",
  "lace",
  "love-sakura",
  "luxury-gold",
  "modern-floral",
  "orchid-amplop",
  "osh",
  "palace-rose",
  "palov",
  "pink-lotus",
  "purple-flower",
  "red-rose-card",
  "royal-purple",
  "stained-glass",
  "sunset",
  "swan-garden",
  "velvet-romance",
] as const;

export type ChorloveTemplateId = (typeof CHORLOVE_TEMPLATE_IDS)[number];

export function isChorloveTemplate(id: string): id is ChorloveTemplateId {
  return (CHORLOVE_TEMPLATE_IDS as readonly string[]).includes(id);
}
