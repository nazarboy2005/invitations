import { publicAsset } from "../../lib/public-asset";
import type { TemplateDefinition } from "@taklifnoma/contracts";
import { CATALOG_COVERS } from "./catalog-covers";

export function templatePoster(template: TemplateDefinition) {
  if (CATALOG_COVERS[template.id]) return publicAsset(CATALOG_COVERS[template.id]);
  return template.previewImage?.startsWith("/")
    ? publicAsset(template.previewImage)
    : publicAsset(`/templates/${template.id}/${template.previewImage ?? "stage.webp"}`);
}
