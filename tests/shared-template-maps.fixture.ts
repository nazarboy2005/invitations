import { TEMPLATES } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";
console.log(
  JSON.stringify(
    TEMPLATES.filter((t) => t.published || t.id === "taklifla-tort-fasl").map(
      (t) => ({
        id: t.id,
        url: createTemplatePreviewSample(t.id).venue.mapUrl,
      }),
    ),
  ),
);
