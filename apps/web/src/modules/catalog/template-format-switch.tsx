"use client";

import { Globe2, ImageIcon } from "lucide-react";
import styles from "./template-format-switch.module.css";

export type TemplateFormat = "web" | "image";

export function TemplateFormatSwitch({
  value,
  onChange,
  disabled = false,
}: {
  value: TemplateFormat;
  onChange: (value: TemplateFormat) => void;
  disabled?: boolean;
}) {
  return (
    <div className={styles.switch} role="group" aria-label="Taklifnoma formati">
      {(
        [
          ["web", "Veb taklifnoma", Globe2],
          ["image", "Rasm taklifnoma", ImageIcon],
        ] as const
      ).map(([format, label, Icon]) => (
        <button
          key={format}
          type="button"
          aria-pressed={value === format}
          disabled={disabled}
          onClick={() => onChange(format)}
        >
          <Icon size={17} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}
