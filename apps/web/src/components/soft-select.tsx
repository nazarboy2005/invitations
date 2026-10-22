"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "./soft-select.module.css";

export type SelectOption = { value: string; label: string; disabled?: boolean };

export function SoftSelect({
  value,
  options,
  onChange,
  label,
  placeholder = "Tanlang",
  disabled = false,
  squareOptions = false,
  menuPlacement = "default",
  showSelectedCheck = true,
  showChevron = true,
}: {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  squareOptions?: boolean;
  menuPlacement?: "default" | "aboveOnMobile";
  showSelectedCheck?: boolean;
  showChevron?: boolean;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0));
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (!open) return;
    const optionIndex = options[activeIndex]?.disabled
      ? options.findIndex((option) => !option.disabled)
      : activeIndex;
    if (optionIndex >= 0) optionRefs.current[optionIndex]?.focus();
  }, [activeIndex, open, options]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [open]);

  function moveActive(start: number, direction: number) {
    if (!options.length) return;
    let index = start;
    for (let tries = 0; tries < options.length; tries++) {
      index = (index + direction + options.length) % options.length;
      if (!options[index].disabled) {
        setActiveIndex(index);
        return;
      }
    }
  }

  function openMenu(index = selectedIndex >= 0 ? selectedIndex : 0) {
    setActiveIndex(index);
    setOpen(true);
  }

  return (
    <div
      className={`${styles.root} ${squareOptions ? styles.squareOptions : ""}`}
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={`${styles.trigger} ${open ? styles.open : ""}`}
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) openMenu();
            else moveActive(activeIndex, event.key === "ArrowDown" ? 1 : -1);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!open) openMenu();
          }
        }}
      >
        <span className={selected ? "" : styles.placeholder}>
          {selected?.label ?? placeholder}
        </span>
        {showChevron && (
          <ChevronDown
            size={17}
            strokeWidth={1.8}
            className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
            aria-hidden="true"
          />
        )}
      </button>
      {open && (
        <div
          className={`${styles.menu} ${menuPlacement === "aboveOnMobile" ? styles.menuAboveOnMobile : ""}`}
          id={id}
          role="listbox"
          aria-label={label}
        >
          {options.map((option, index) => (
            <button
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              id={`${id}-option-${index}`}
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              disabled={option.disabled}
              className={`${styles.option} ${option.value === value ? styles.selected : ""} ${index === activeIndex ? styles.active : ""}`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
                trigger.current?.focus();
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  moveActive(index, event.key === "ArrowDown" ? 1 : -1);
                } else if (event.key === "Home" || event.key === "End") {
                  event.preventDefault();
                  const target =
                    event.key === "Home"
                      ? options.findIndex((item) => !item.disabled)
                      : options.findLastIndex((item) => !item.disabled);
                  if (target >= 0) setActiveIndex(target);
                }
              }}
            >
              <span>{option.label}</span>
              {showSelectedCheck && option.value === value && (
                <Check size={16} aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
