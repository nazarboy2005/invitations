"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPrice } from "@taklifnoma/contracts";
import styles from "./payment-analytics.module.css";

type Point = {
  day: string;
  clickMinor: number;
  manualMinor: number;
  clickCount: number;
  manualCount: number;
};

function dayLabel(value: string) {
  const [, month, day] = value.split("-");
  return `${day}.${month}`;
}

function TooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length || !label) return null;
  const values = new Map(
    payload.map((item) => [item.name, Number(item.value ?? 0)]),
  );
  const total = [...values.values()].reduce((sum, value) => sum + value, 0);
  return (
    <div className={styles.tooltip}>
      <strong>{dayLabel(label)}</strong>
      <span>
        <i className={styles.onlineDot} /> Click{" "}
        <b>{formatPrice(values.get("clickMinor") ?? 0)}</b>
      </span>
      <span>
        <i className={styles.manualDot} /> Qo‘lda{" "}
        <b>{formatPrice(values.get("manualMinor") ?? 0)}</b>
      </span>
      <span className={styles.tooltipTotal}>
        Jami <b>{formatPrice(total)}</b>
      </span>
    </div>
  );
}

export function AdminPaymentRevenueChart({ data }: { data: Point[] }) {
  return (
    <div
      className={styles.chart}
      role="img"
      aria-label="Kunlik Click va qo‘lda qayd etilgan to‘lovlar summasi"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 4, left: 8, bottom: 0 }}
          barCategoryGap="34%"
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--analytics-grid)"
            strokeDasharray="4 5"
          />
          <XAxis
            dataKey="day"
            tickFormatter={dayLabel}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--analytics-muted)", fontSize: 11 }}
            minTickGap={16}
            dy={10}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={42}
            tick={{ fill: "var(--analytics-muted)", fontSize: 10 }}
            tickFormatter={(value: number) =>
              value === 0 ? "0" : `${Math.round(value / 100_000) / 10}k`
            }
          />
          <Tooltip
            content={<TooltipContent />}
            cursor={{ fill: "var(--analytics-hover)" }}
          />
          <Bar
            name="clickMinor"
            dataKey="clickMinor"
            stackId="revenue"
            fill="var(--analytics-online)"
            radius={[5, 5, 0, 0]}
            maxBarSize={36}
          />
          <Bar
            name="manualMinor"
            dataKey="manualMinor"
            stackId="revenue"
            fill="var(--analytics-manual)"
            radius={[5, 5, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
