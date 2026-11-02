"use client";

import { useEffect, useId, useLayoutEffect, useRef } from "react";
import styles from "./time-wheel.module.css";

const rowHeight = 36;
const pad = (value: number) => String(value).padStart(2, "0");

function Wheel({
  label,
  count,
  value,
  onChange,
}: {
  label: string;
  count: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const list = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const change = useRef(onChange);
  const currentValue = useRef(value);
  const drag = useRef<{ y: number; top: number } | null>(null);
  const dragged = useRef(false);
  const selected = Number(value || "00");
  useLayoutEffect(() => {
    change.current = onChange;
    currentValue.current = value;
  });
  useLayoutEffect(() => {
    if (list.current) list.current.scrollTop = selected * rowHeight;
  }, [selected]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function choose(index: number) {
    if (timer.current) clearTimeout(timer.current);
    const next = Math.max(0, Math.min(count - 1, index));
    if (list.current) list.current.scrollTop = next * rowHeight;
    if (pad(next) !== currentValue.current) change.current(pad(next));
  }

  return (
    <div className={styles.column}>
      <span id={id} className={styles.label}>
        {label}
      </span>
      <div className={styles.window}>
        <div className={styles.selection} aria-hidden="true" />
        <div
          ref={list}
          className={styles.wheel}
          role="spinbutton"
          tabIndex={0}
          aria-labelledby={id}
          aria-valuemin={0}
          aria-valuemax={count - 1}
          aria-valuenow={selected}
          aria-valuetext={pad(selected)}
          onWheel={(event) =>
            event.currentTarget.focus({ preventScroll: true })
          }
          onBlur={() => {
            if (list.current)
              choose(Math.round(list.current.scrollTop / rowHeight));
          }}
          onPointerDown={(event) => {
            dragged.current = false;
            event.currentTarget.focus({ preventScroll: true });
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            drag.current = {
              y: event.clientY,
              top: event.currentTarget.scrollTop,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!drag.current) return;
            const delta = drag.current.y - event.clientY;
            if (Math.abs(delta) > 3) dragged.current = true;
            if (dragged.current) {
              event.currentTarget.dataset.dragging = "true";
              event.currentTarget.scrollTop = drag.current.top + delta;
            }
          }}
          onPointerUp={(event) => {
            if (!drag.current) return;
            drag.current = null;
            delete event.currentTarget.dataset.dragging;
            if (dragged.current)
              choose(Math.round(event.currentTarget.scrollTop / rowHeight));
            event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={(event) => {
            drag.current = null;
            delete event.currentTarget.dataset.dragging;
          }}
          onClick={(event) => {
            if (dragged.current) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            choose(
              Math.floor(
                (event.clientY -
                  bounds.top +
                  event.currentTarget.scrollTop -
                  rowHeight * 2) /
                  rowHeight,
              ),
            );
          }}
          onScroll={() => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => {
              if (list.current && !drag.current)
                choose(Math.round(list.current.scrollTop / rowHeight));
            }, 140);
          }}
          onKeyDown={(event) => {
            const next =
              event.key === "ArrowUp"
                ? selected - 1
                : event.key === "ArrowDown"
                  ? selected + 1
                  : event.key === "PageUp"
                    ? selected - 5
                    : event.key === "PageDown"
                      ? selected + 5
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? count - 1
                          : null;
            if (next !== null) {
              event.preventDefault();
              choose(next);
            }
          }}
        >
          {Array.from({ length: count }, (_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className={styles.number}
              data-selected={index === selected || undefined}
            >
              {pad(index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** One time control: swipe, wheel-scroll or use arrow keys in either column. */
export function TimeWheel({
  hour,
  minute,
  onChange,
}: {
  hour: string;
  minute: string;
  onChange: (hour: string, minute: string) => void;
}) {
  return (
    <div
      className={styles.time}
      role="group"
      aria-label="Vaqtni aylantirib tanlash"
    >
      <Wheel
        label="Soat"
        count={24}
        value={hour}
        onChange={(next) => onChange(next, minute || "00")}
      />
      <span className={styles.separator} aria-hidden="true">
        :
      </span>
      <Wheel
        label="Daqiqa"
        count={60}
        value={minute}
        onChange={(next) => onChange(hour || "00", next)}
      />
    </div>
  );
}
