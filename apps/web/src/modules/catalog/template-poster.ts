import type { TemplateDefinition } from "@taklifnoma/contracts";
import { CATALOG_COVERS } from "./catalog-covers";

export function templatePoster(template: TemplateDefinition) {
  if (CATALOG_COVERS[template.id]) return CATALOG_COVERS[template.id];
  return template.previewImage?.startsWith("/")
    ? template.previewImage
    : `/templates/${template.id}/${template.previewImage ?? "stage.webp"}`;
}
