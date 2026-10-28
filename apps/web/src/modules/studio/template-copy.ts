import type { TemplateDefinition } from "@taklifnoma/contracts";

const descriptions: Record<string, string> = {
  "golden-card": "To‘q moviy va oltin naqshlar, nafis ochiladigan taklifnoma.",
  "green-white": "Oq va yashil ranglar, nozik o‘simlik bezaklari.",
  "jasmine-white": "Fil suyagi ranglari va nafis yasmin gullari.",
  lace: "Bordo to‘r, marvaridlar va nafis ochilish.",
  "love-sakura": "Sakura gullari va mayin pushti ranglar.",
  "modern-floral": "Zamonaviy gul bezaklari va mayin ranglar.",
};

export function studioTemplateDescription(template: TemplateDefinition) {
  return descriptions[template.id] ?? template.description;
}
