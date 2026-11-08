import type { TemplateDefinition } from "@taklifnoma/contracts";

const descriptions: Record<string, string> = {
  "zarvaraq": "To‘q moviy va oltin naqshlar, nafis ochiladigan taklifnoma.",
  "oq-chechak": "Oq va yashil ranglar, nozik o‘simlik bezaklari.",
  "oq-yasmin": "Fil suyagi ranglari va nafis yasmin gullari.",
  lace: "Bordo to‘r, marvaridlar va nafis ochilish.",
  "sakura-sehri": "Sakura gullari va mayin pushti ranglar.",
  "gul-ifori": "Zamonaviy gul bezaklari va mayin ranglar.",
};

export function studioTemplateDescription(template: TemplateDefinition) {
  return descriptions[template.id] ?? template.description;
}
