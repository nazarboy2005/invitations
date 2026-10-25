import type { TemplateDefinition } from "@taklifnoma/contracts";

export function templatePoster(template: TemplateDefinition) {
  return template.previewImage?.startsWith("/")
    ? template.previewImage
    : `/templates/${template.id}/${template.previewImage ?? "stage.webp"}`;
}
