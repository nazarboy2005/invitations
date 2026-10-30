/** Public design identities are independent of historical renderer/storage IDs. */
const aliases: Record<string, string> = {
  "taklifla-zarhal-sahifa": "zarhal-sahifa",
  "taklifla-muhrli-maktub": "muhrli-maktub",
  "taklifla-asalari": "asalari",
  "taklifla-fayzli-xonadon": "fayzli-xonadon",
  "taklifla-ertak": "ertak",
  "taklifla-gulbog": "gulbog",
  "taklifla-zarrin-gullar": "zarrin-gullar",
  "taklifla-toglar-bagrida": "toglar-bagrida",
  "taklifla-oltin-yol": "oltin-yol",
  "taklifla-osmon": "osmon",
  "taklifla-parilar-ertagi": "parilar-ertagi",
  "taklifla-qogoz-ertagi": "qogoz-ertagi",
  "taklifla-sakura-guli": "sakura-guli",
  "taklifla-sharlar": "sharlar",
  "taklifla-yulduzli-tun": "yulduzli-tun",
  "taklifla-terracotta": "terracotta",
  "taklifla-yubiley-sahifasi": "yubiley-sahifasi",
  "taklifla-barakali": "barakali",
  "taklifla-tungi-saroy": "tungi-saroy",
  "taklifla-tovus": "tovus",
  "taklifla-tort-fasl": "tort-fasl",
  "wedivo-pulau-sehati": "kongillar-oroli",
  "invitate-palov": "osh-ziyofati",
  "invitate-nahorgi-osh": "sahar-ziyofati",
  "invitate-wedding": "gulchambar",
  "taklifnomachi-1": "klassik-nafis",
  "taklifnomachi-12": "moviy-osmon",
  "taklifnomachi-13": "oltin-atirgul",
  "taklifnomachi-15": "monoxrom",
  "taklifnomachi-16": "zaytun-guli",
  "taklifnomachi-17": "atlas-ipak",
  "taklifnomachi-18": "gul-naqshli-marosim",
  "taklifnomachi-19": "zaytun-bogi",
};

export function publicTemplateId(id: string): string {
  return aliases[id] ?? id;
}

/** Resolve both new public links and historical bookmarks without changing drafts. */
export function resolveTemplateId(id: string): string {
  const match = Object.entries(aliases).find(([, slug]) => slug === id);
  return match?.[0] ?? id;
}

export function publicTemplateName(name: string): string {
  return name
    .replace(/^(?:Taklifnomachi|Taklifla|Invitate|Chorlove|Wedivo|Marxaba|Onlinetaklifnoma)(?:\s*[\u00b7\u2014\u2013-]\s*|\s+)/i, "")
    .trim();
}
