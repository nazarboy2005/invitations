export const CHORLOVE_TEMPLATE_IDS = [
  "bulutlar-qasri",
  "pushti-gulbarg",
  "zarvaraq",
  "yashil-makon",
  "zumrad",
  "oq-chechak",
  "oppoq-tuygu",
  "oq-yasmin",
  "marvarid",
  "sakura-sehri",
  "zar-jilosi",
  "gul-ifori",
  "ormon-maktubi",
  "osh",
  "saroy-atirguli",
  "palov",
  "pink-lotus",
  "purple-flower",
  "red-rose-card",
  "royal-purple",
  "shisha-naqshi",
  "sunset",
  "oqqushlar",
  "velvet-romance",
] as const;

export type ChorloveTemplateId = (typeof CHORLOVE_TEMPLATE_IDS)[number];

export function isChorloveTemplate(id: string): id is ChorloveTemplateId {
  return (CHORLOVE_TEMPLATE_IDS as readonly string[]).includes(id);
}
