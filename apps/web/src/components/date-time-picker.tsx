"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react";
import { SoftSelect } from "./soft-select";
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
const hours = Array.from({ length: 24 }, (_, hour) => ({
  value: String(hour).padStart(2, "0"),
  label: `${String(hour).padStart(2, "0")}:00`,
}));
const minutes = Array.from({ length: 60 }, (_, minute) => ({
  value: String(minute).padStart(2, "0"),
  label: String(minute).padStart(2, "0"),
}));
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
  const root = useRef<HTMLDivElement>(null);
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
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [open]);

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
  const displayValue = value
    ? `${displayDate(value.slice(0, 10))} · ${value.slice(11, 16)}`
    : "Sana va vaqtni tanlang";

  return (
    <div className={styles.root} ref={root}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.open : ""}`}
        aria-label="Tadbir sanasi va vaqtini tanlang"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => {
          if (!open) {
            setSelectedDate(value.slice(0, 10));
            setHour(value.slice(11, 13));
            setMinute(value.slice(14, 16));
          }
          setOpen(!open);
        }}
      >
        <span className={value ? styles.value : styles.placeholder}>
          {displayValue}
        </span>
        <CalendarDays size={18} aria-hidden="true" />
      </button>
      {open && (
        <div
          className={styles.popover}
          role="dialog"
          aria-label="Sana va vaqtni tanlash"
        >
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
                  <span className={styles.emptyDay} key={`empty-${index}`} />
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
                  onClick={() => setSelectedDate(dateValue)}
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
            <div className={styles.timeSelects}>
              <SoftSelect
                label="Soat"
                value={hour}
                placeholder="Soat"
                options={hours}
                onChange={setHour}
              />
              <span className={styles.timeSeparator}>:</span>
              <SoftSelect
                label="Daqiqa"
                value={minute}
                placeholder="Daqiqa"
                options={minutes}
                onChange={setMinute}
              />
            </div>
          </div>
          <div className={styles.footer}>
            <span>
              {chosenDate
                ? `${chosenDate}${hour && minute ? ` · ${hour}:${minute}` : ""}`
                : "Sana va vaqtni belgilang"}
            </span>
            <button
              type="button"
              className={styles.apply}
              disabled={!selectedDate || !hour || !minute}
              onClick={() => {
                onChange(`${selectedDate}T${hour}:${minute}`);
                setOpen(false);
              }}
            >
              Tasdiqlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function TimePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [hour, setHour] = useState(value.slice(0, 2));
  const [minute, setMinute] = useState(value.slice(3, 5));

  useEffect(() => {
    setHour(value.slice(0, 2));
    setMinute(value.slice(3, 5));
  }, [value]);

  return (
    <div className={styles.timeOnly}>
      <Clock3 size={16} aria-hidden="true" />
      <SoftSelect
        label="Soat"
        value={hour}
        placeholder="Soat"
        disabled={disabled}
        options={hours.map(({ value: optionValue }) => ({
          value: optionValue,
          label: optionValue,
        }))}
        onChange={(nextHour) => {
          setHour(nextHour);
          onChange(`${nextHour}:${minute || "00"}`);
        }}
      />
      <span className={styles.timeSeparator}>:</span>
      <SoftSelect
        label="Daqiqa"
        value={minute}
        placeholder="Daqiqa"
        disabled={disabled}
        options={minutes}
        onChange={(nextMinute) => {
          setMinute(nextMinute);
          onChange(`${hour || "00"}:${nextMinute}`);
        }}
      />
    </div>
  );
}
