import type { ReactNode } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import styles from "./studio.module.css";

export function OptionalSection({
  title,
  summary,
  target,
  icon: Icon,
  children,
}: {
  title: string;
  summary: string;
  target?: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <details className={styles.optionalSection} data-preview-target={target}>
      <summary>
        {Icon && (
          <span className={styles.optionalIcon}>
            <Icon size={18} aria-hidden="true" />
          </span>
        )}
        <span>{title}</span>
        <small>{summary}</small>
        <ChevronRight size={16} />
      </summary>
      <div className={styles.optionalContent}>{children}</div>
    </details>
  );
}
