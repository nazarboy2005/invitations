import { CATALOG_COVERS } from "../catalog/catalog-covers";

// Bump whenever scene/framing/renderer changes require fresh personalized images.
export const COVER_VERSION = "portrait-4";
export const COVER_VIEWPORT = { width: 480, height: 800 };
export type CoverScene = "opening" | "opened" | "lid" | "book";
const openedHeroes = new Set([
  "anor",
  "taklifla-tort-fasl",
  "taklifla-gulbog",
  "taklifla-osmon",
  "taklifla-oltin-yol",
  "taklifla-zarrin-gullar",
  "taklifla-tungi-saroy",
  "taklifla-tovus",
  "cloud-castle",
  "kuzgi-chinor",
  "sahifa",
  "somon-yoli",
  "qogoz-turna",
  "nilufar",
  "retro-kino",
  "toscana",
  "kozgu",
]);
export function coverRecipe(templateId: string) {
  const scene: CoverScene =
    templateId === "nahor"
      ? "lid"
      : templateId === "qatlam"
        ? "book"
        : openedHeroes.has(templateId) || CATALOG_COVERS[templateId]
          ? "opened"
          : "opening";
  const viewport =
    templateId === "somon-yoli"
      ? { width: 540, height: 960 }
      : templateId === "oltin-uzuk"
        ? { width: 450, height: 800 }
        : COVER_VIEWPORT;
  return {
    version: COVER_VERSION,
    viewport,
    scene,
    element: templateId === "somon-yoli" ? "#hero" : undefined,
  };
}
