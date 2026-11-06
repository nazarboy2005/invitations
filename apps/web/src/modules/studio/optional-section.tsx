import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import styles from "./studio.module.css";

export function OptionalSection({
  title,
  summary,
  target,
  icon: Icon,
  enabled,
  onEnabledChange,
  onLeave,
  children,
}: {
  title: string;
  summary: string;
  target?: string;
  icon?: LucideIcon;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onLeave?: () => boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;
  const validateOnLeave = useCallback(() => {
    if (onLeaveRef.current?.()) setOpen(false);
  }, []);

  useEffect(() => {
    if (!open || !enabled || !onLeave) return;
    const leaveOnOutsidePointer = (event: PointerEvent) => {
      if (!sectionRef.current?.contains(event.target as Node))
        validateOnLeave();
    };
    document.addEventListener("pointerdown", leaveOnOutsidePointer, true);
    return () =>
      document.removeEventListener("pointerdown", leaveOnOutsidePointer, true);
  }, [enabled, onLeave, open, validateOnLeave]);

  return (
    <section
      ref={sectionRef}
      className={styles.optionalSection}
      data-preview-target={target}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;
        if (nextTarget instanceof Node && !sectionRef.current?.contains(nextTarget))
          validateOnLeave();
      }}
    >
      <div className={styles.optionalHeader}>
        <button
          className={styles.optionalDisclosure}
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => {
            if (open) {
              setOpen(false);
              validateOnLeave();
            } else setOpen(true);
          }}
        >
          {Icon && (
            <span className={styles.optionalIcon}>
              <Icon size={18} aria-hidden="true" />
            </span>
          )}
          <span className={styles.optionalHeading}>
            <span>{title}</span>
            <small>{summary}</small>
          </span>
          <ChevronRight
            className={open ? styles.optionalChevronOpen : ""}
            size={16}
            aria-hidden="true"
          />
        </button>
        <label className={styles.optionalSwitch}>
          <input
            type="checkbox"
            checked={enabled}
            aria-label={`${title}: ${enabled ? "yoqilgan" : "o‘chirilgan"}`}
            onChange={(event) => {
              const nextEnabled = event.target.checked;
              if (nextEnabled) setOpen(true);
              onEnabledChange(nextEnabled);
            }}
          />
          <span className={styles.switch} aria-hidden="true" />
        </label>
      </div>
      <div
        id={contentId}
        className={styles.optionalContent}
        hidden={!open}
      >
        {children}
      </div>
    </section>
  );
}
