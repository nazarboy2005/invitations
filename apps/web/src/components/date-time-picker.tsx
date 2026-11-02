"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  X,
} from "lucide-react";
import { TimeWheel } from "./time-wheel";
import styles from "./date-time-picker.module.css";

const months = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];
const weekdays = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const pad = (value: number) => String(value).padStart(2, "0");
const toDateValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

function displayDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "";
  return `${day}-${months[month - 1].toLocaleLowerCase("uz-Latn")} ${year}`;
}

export function DateTimePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const initialDate = value.slice(0, 10);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [hour, setHour] = useState(value.slice(11, 13));
  const [minute, setMinute] = useState(value.slice(14, 16));
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const [year, month] = initialDate.split("-").map(Number);
    return year && month
      ? new Date(year, month - 1, 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });

  useEffect(() => {
    const date = value.slice(0, 10);
    setSelectedDate(date);
    setHour(value.slice(11, 13));
    setMinute(value.slice(14, 16));
    const [year, month] = date.split("-").map(Number);
    if (year && month) setVisibleMonth(new Date(year, month - 1, 1));
  }, [value]);

  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    else if (!open && dialog.current?.open) dialog.current.close();
  }, [open]);

  function selectDateTime(date: string, nextHour: string, nextMinute: string) {
    nextHour ||= "00";
    nextMinute ||= "00";
    setSelectedDate(date);
    setHour(nextHour);
    setMinute(nextMinute);
    if (date && nextHour && nextMinute)
      onChange(`${date}T${nextHour}:${nextMinute}`);
  }

  const days = useMemo(() => {
    const offset = (visibleMonth.getDay() + 6) % 7;
    const count = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + 1,
      0,
    ).getDate();
    const total = Math.ceil((offset + count) / 7) * 7;
    return Array.from({ length: total }, (_, index) => {
      const day = index - offset + 1;
      return day > 0 && day <= count ? day : null;
    });
  }, [visibleMonth]);

  const chosenDate = displayDate(selectedDate);
  const displayValue = chosenDate
    ? `${chosenDate} · ${hour && minute ? `${hour}:${minute}` : "Vaqtni tanlang"}`
    : "Sana va vaqtni tanlang";

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.open : ""}`}
        aria-label="Tadbir sanasi va vaqtini tanlang"
        aria-expanded={open}
        disabled={disabled}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <span className={chosenDate ? styles.value : styles.placeholder}>
          {displayValue}
        </span>
        <CalendarDays size={18} aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        className={styles.popover}
        aria-label="Sana va vaqtni tanlash"
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            setOpen(false);
        }}
      >
        {open && (
          <>
            <div className={styles.dialogHeader}>
              <strong>Sana va vaqt</strong>
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setOpen(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className={styles.pickerBody}>
              <div className={styles.calendarHeader}>
                <button
                  type="button"
                  aria-label="Oldingi oy"
                  onClick={() =>
                    setVisibleMonth(
                      new Date(
                        visibleMonth.getFullYear(),
                        visibleMonth.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                >
                  <ChevronLeft size={18} />
                </button>
                <strong>
                  {months[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
                </strong>
                <button
                  type="button"
                  aria-label="Keyingi oy"
                  onClick={() =>
                    setVisibleMonth(
                      new Date(
                        visibleMonth.getFullYear(),
                        visibleMonth.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <div
                className={styles.calendarGrid}
                role="grid"
                aria-label="Kalendar"
              >
                {weekdays.map((weekday) => (
                  <span className={styles.weekday} key={weekday}>
                    {weekday}
                  </span>
                ))}
                {days.map((day, index) => {
                  if (day === null)
                    return (
                      <span
                        className={styles.emptyDay}
                        key={`empty-${index}`}
                      />
                    );
                  const date = new Date(
                    visibleMonth.getFullYear(),
                    visibleMonth.getMonth(),
                    day,
                  );
                  const dateValue = toDateValue(date);
                  return (
                    <button
                      type="button"
                      role="gridcell"
                      aria-selected={dateValue === selectedDate}
                      aria-label={`${day} ${months[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`}
                      className={`${styles.day} ${dateValue === selectedDate ? styles.selectedDay : ""}`}
                      key={dateValue}
                      onClick={() => selectDateTime(dateValue, hour, minute)}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <div className={styles.timeSection}>
                <div className={styles.timeTitle}>
                  <Clock3 size={16} />
                  <span>Vaqtni tanlang</span>
                </div>
                <TimeWheel
                  hour={hour}
                  minute={minute}
                  onChange={(nextHour, nextMinute) =>
                    selectDateTime(selectedDate, nextHour, nextMinute)
                  }
                />
              </div>
            </div>
            <div className={styles.footer}>
              <span aria-live="polite">
                {chosenDate
                  ? `${chosenDate}${hour && minute ? ` · ${hour}:${minute}` : ""}`
                  : "Sana va vaqtni belgilang"}
              </span>
              <button
                type="button"
                className={styles.apply}
                onClick={() => setOpen(false)}
              >
                Tayyor
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}

export function TimePicker({
  value,
  onChange,
  disabled = false,
  compact = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open && !disabled) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open, disabled]);

  return (
    <div
      className={`${styles.timeOnly}${compact ? ` ${styles.timeOnlyCompact}` : ""}`}
    >
      <button
        type="button"
        className={styles.trigger}
        disabled={disabled}
        aria-label="Vaqtni tanlang"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className={value ? styles.value : styles.placeholder}>
          {value || "Vaqt"}
        </span>
        <Clock3 size={compact ? 13 : 16} aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        className={styles.popover}
        aria-label="Vaqtni tanlash"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            setOpen(false);
        }}
      >
        {open && (
          <>
            <div className={styles.dialogHeader}>
              <strong>Vaqtni tanlang</strong>
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className={styles.pickerBody}>
              <TimeWheel
                hour={value.slice(0, 2)}
                minute={value.slice(3, 5)}
                onChange={(hour, minute) => onChange(`${hour}:${minute}`)}
              />
            </div>
            <div className={styles.footer}>
              <span>{value || "Vaqtni belgilang"}</span>
              <button
                type="button"
                className={styles.apply}
                onClick={() => setOpen(false)}
              >
                Tayyor
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
