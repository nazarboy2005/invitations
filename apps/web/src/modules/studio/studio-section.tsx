import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import styles from "./studio.module.css";

export function StudioSection({
  id,
  title,
  description,
  icon: Icon,
  action,
  disabled = false,
  children,
}: {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={styles.scheduleCard} aria-labelledby={id}>
      <header className={styles.scheduleHeading}>
        <span>
          <Icon size={19} aria-hidden="true" />
        </span>
        <div>
          <h2 id={id}>{title}</h2>
          <p>{description}</p>
        </div>
        {action}
      </header>
      <fieldset className={styles.lockedFields} disabled={disabled}>{children}</fieldset>
    </section>
  );
}
