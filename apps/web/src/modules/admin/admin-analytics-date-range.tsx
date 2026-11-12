"use client";

import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronDown, RotateCcw } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { PaymentAnalyticsPeriod } from "@/server/payment-analytics";
import styles from "./payment-analytics.module.css";

const presets: Array<{ period: Exclude<PaymentAnalyticsPeriod, "custom">; label: string }> = [
  { period: "today", label: "Bugun" },
  { period: "yesterday", label: "Kecha" },
  { period: "week", label: "Bu hafta" },
  { period: "lastWeek", label: "O‘tgan hafta" },
  { period: "month", label: "Bu oy" },
  { period: "lastMonth", label: "O‘tgan oy" },
  { period: "7days", label: "Oxirgi 7 kun" },
  { period: "30days", label: "Oxirgi 30 kun" },
  { period: "90days", label: "Oxirgi 90 kun" },
];

function tashkentToday() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tashkent", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
  return new Date(part("year"), part("month") - 1, part("day"));
}

function parseCalendarDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function displayDate(value: string) {
  return new Intl.DateTimeFormat("uz-UZ", {
    timeZone: "Asia/Tashkent", day: "numeric", month: "short", year: "numeric",
  }).format(parseCalendarDate(value));
}

export function AdminAnalyticsDateRange({
  period, from, to,
}: {
  period: PaymentAnalyticsPeriod;
  from: string;
  to: string;
}) {
  const router = useRouter();
  const today = useMemo(tashkentToday, []);
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(() => ({
    from: parseCalendarDate(from), to: parseCalendarDate(to),
  }));
  useEffect(() => {
    setRange({ from: parseCalendarDate(from), to: parseCalendarDate(to) });
  }, [from, to]);
  const activePreset = presets.find((item) => item.period === period);
  const label = activePreset?.label ?? `${displayDate(from)} – ${displayDate(to)}`;

  function choosePreset(nextPeriod: Exclude<PaymentAnalyticsPeriod, "custom">) {
    router.push(`/admin?view=analytics&period=${nextPeriod}`);
    setOpen(false);
  }

  function applyRange() {
    if (!range?.from || !range.to) return;
    router.push(`/admin?view=analytics&period=custom&from=${dateKey(range.from)}&to=${dateKey(range.to)}`);
    setOpen(false);
  }

  function resetRange() {
    setRange(undefined);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className={styles.rangeTrigger} aria-label="Tahlil sanalari" aria-expanded={open}>
          <CalendarDays size={16} /> <span>{label}</span> <ChevronDown size={14} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.rangePopover} sideOffset={8} align="end" aria-label="Davrni tanlang">
          <div className={styles.rangePresets} aria-label="Tayyor davrlar">
            <p>Tez tanlash</p>
            {presets.map((item) => (
              <button key={item.period} type="button" data-active={item.period === period} onClick={() => choosePreset(item.period)}>
                {item.label}
              </button>
            ))}
          </div>
          <div className={styles.rangeCalendar}>
            <div className={styles.rangeCalendarHeading}>
              <div><strong>Maxsus davr</strong><span>Boshlanish va tugash sanasini tanlang</span></div>
              <button type="button" className={styles.rangeReset} onClick={resetRange} aria-label="Tanlovni tozalash"><RotateCcw size={14} /></button>
            </div>
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              defaultMonth={range?.from ?? today}
              disabled={{ after: today }}
              numberOfMonths={2}
              weekStartsOn={1}
              showOutsideDays
              className={styles.calendar}
              classNames={{
                months: styles.calendarMonths, month: styles.calendarMonth,
                month_caption: styles.calendarCaption, caption_label: styles.calendarCaptionLabel,
                nav: styles.calendarNav, button_previous: styles.calendarNavButton,
                button_next: styles.calendarNavButton, month_grid: styles.calendarGrid,
                weekdays: styles.calendarWeekdays, weekday: styles.calendarWeekday,
                week: styles.calendarWeek, day: styles.calendarDay,
                day_button: styles.calendarDayButton, selected: styles.calendarSelected,
                range_start: styles.calendarRangeStart, range_end: styles.calendarRangeEnd,
                range_middle: styles.calendarRangeMiddle, today: styles.calendarToday,
                outside: styles.calendarOutside, disabled: styles.calendarDisabled,
              }}
            />
            <div className={styles.rangeApplyRow}>
              <span>{range?.from && range.to ? `${displayDate(dateKey(range.from))} – ${displayDate(dateKey(range.to))}` : "Sana oralig‘ini tanlang"}</span>
              <button type="button" onClick={applyRange} disabled={!range?.from || !range.to}>Qo‘llash</button>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
