import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import styles from "./studio.module.css";

export function OptionalSection({
  title,
  summary,
  target,
  children,
}: {
  title: string;
  summary: string;
  target?: string;
  children: ReactNode;
}) {
  return (
    <details className={styles.optionalSection} data-preview-target={target}>
      <summary>
        <span>{title}</span>
        <small>{summary}</small>
        <ChevronRight size={16} />
      </summary>
      <div className={styles.optionalContent}>{children}</div>
    </details>
  );
}
