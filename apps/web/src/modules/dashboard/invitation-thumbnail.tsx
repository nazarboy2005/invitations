import type { TemplateDefinition } from "@taklifnoma/contracts";
import { templatePoster } from "@/modules/catalog/template-poster";
import styles from "./invitation-thumbnail.module.css";

/** Share the catalog's exact image URL and native browser cache across pages. */
export function InvitationThumbnail({
  template,
}: {
  template: TemplateDefinition;
}) {
  return (
    <div className={styles.thumbnail} data-format={template.format}>
      <img
        src={templatePoster(template)}
        alt=""
        width={template.format === "image" ? 500 : 480}
        height={template.format === "image" ? 700 : 800}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
