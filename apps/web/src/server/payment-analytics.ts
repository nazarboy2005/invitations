import { getDb } from "@taklifnoma/database";
import { requireAdmin } from "./admin";

export const paymentAnalyticsPeriods = ["week", "month", "30days"] as const;
export type PaymentAnalyticsPeriod = (typeof paymentAnalyticsPeriods)[number];

const TASHKENT_TIME_ZONE = "Asia/Tashkent";
const TASHKENT_OFFSET_MINUTES = 5 * 60;

function tashkentToday() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TASHKENT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) =>
    Number(parts.find((item) => item.type === type)?.value);
  return { year: part("year"), month: part("month"), day: part("day") };
}

function addDays(
  date: { year: number; month: number; day: number },
  amount: number,
) {
  const value = new Date(
    Date.UTC(date.year, date.month - 1, date.day + amount),
  );
  return {
    year: value.getUTCFullYear(),
    month: value.getUTCMonth() + 1,
    day: value.getUTCDate(),
  };
}

function startOfTashkentDay(date: {
  year: number;
  month: number;
  day: number;
}) {
  return new Date(
    Date.UTC(date.year, date.month - 1, date.day) -
      TASHKENT_OFFSET_MINUTES * 60_000,
  );
}

function dateKey(value: unknown) {
  return String(value).slice(0, 10);
}

export async function getPaymentAnalytics(period: PaymentAnalyticsPeriod) {
  await requireAdmin();

  const today = tashkentToday();
  let firstDay: { year: number; month: number; day: number };
  if (period === "month") {
    firstDay = { ...today, day: 1 };
  } else if (period === "week") {
    const weekday = new Date(
      Date.UTC(today.year, today.month - 1, today.day),
    ).getUTCDay();
    firstDay = addDays(today, -((weekday + 6) % 7));
  } else {
    firstDay = addDays(today, -29);
  }

  const start = startOfTashkentDay(firstDay);
  const end = new Date();
  const [summary] = await getDb() /* sql */ `
    WITH payments AS (
      SELECT amount_minor, status, created_at, verified_at AS paid_at, 'click'::text AS method
      FROM payment_orders
      UNION ALL
      SELECT amount_minor,
        CASE status WHEN 'received' THEN 'SUCCEEDED' WHEN 'refunded' THEN 'REFUNDED'
          WHEN 'failed' THEN 'FAILED' WHEN 'cancelled' THEN 'CANCELLED' ELSE 'PENDING' END,
        created_at, received_at AS paid_at, 'manual'::text AS method
      FROM platform_payments
    ), paid AS (
      SELECT * FROM payments WHERE paid_at >= ${start} AND paid_at < ${end}
    )
    SELECT
      count(*)::int AS paid_count,
      coalesce(sum(amount_minor), 0)::text AS gross_minor,
      count(*) FILTER (WHERE status = 'REFUNDED')::int AS refunded_count,
      coalesce(sum(amount_minor) FILTER (WHERE status = 'REFUNDED'), 0)::text AS refunded_minor,
      count(*) FILTER (WHERE status = 'PARTIALLY_REFUNDED')::int AS partial_refund_count,
      count(*) FILTER (WHERE status = 'REFUND_PENDING')::int AS refund_pending_count,
      count(*) FILTER (WHERE method = 'click')::int AS click_count,
      coalesce(sum(amount_minor) FILTER (WHERE method = 'click'), 0)::text AS click_minor,
      count(*) FILTER (WHERE method = 'manual')::int AS manual_count,
      coalesce(sum(amount_minor) FILTER (WHERE method = 'manual'), 0)::text AS manual_minor,
      (SELECT count(*)::int FROM payments p WHERE p.created_at >= ${start} AND p.created_at < ${end}
        AND p.paid_at IS NULL AND p.status IN ('CREATED','PENDING','PROCESSING','REJECTED')) AS pending_count
    FROM paid`;

  const dailyRows = await getDb()`
    WITH payments AS (
      SELECT amount_minor, verified_at AS paid_at, 'click'::text AS method FROM payment_orders
      UNION ALL
      SELECT amount_minor, received_at AS paid_at, 'manual'::text AS method FROM platform_payments
    )
    SELECT to_char(paid_at AT TIME ZONE ${TASHKENT_TIME_ZONE}, 'YYYY-MM-DD') AS day,
      count(*) FILTER (WHERE method='click')::int AS click_count,
      coalesce(sum(amount_minor) FILTER (WHERE method='click'),0)::text AS click_minor,
      count(*) FILTER (WHERE method='manual')::int AS manual_count,
      coalesce(sum(amount_minor) FILTER (WHERE method='manual'),0)::text AS manual_minor
    FROM payments WHERE paid_at >= ${start} AND paid_at < ${end}
    GROUP BY day ORDER BY day`;

  const dayCount = Math.max(
    1,
    Math.ceil(
      (startOfTashkentDay(today).getTime() - start.getTime()) / 86_400_000,
    ) + 1,
  );
  const totalsByDay = new Map(dailyRows.map((row) => [dateKey(row.day), row]));
  const chart = Array.from({ length: dayCount }, (_, index) => {
    const date = addDays(firstDay, index);
    const key = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
    const row = totalsByDay.get(key);
    return {
      day: key,
      clickMinor: Number(row?.click_minor ?? 0),
      manualMinor: Number(row?.manual_minor ?? 0),
      clickCount: Number(row?.click_count ?? 0),
      manualCount: Number(row?.manual_count ?? 0),
    };
  });

  return {
    period,
    start: start.toISOString(),
    end: end.toISOString(),
    paidCount: Number(summary.paid_count),
    grossMinor: Number(summary.gross_minor),
    refundedCount: Number(summary.refunded_count),
    refundedMinor: Number(summary.refunded_minor),
    partialRefundCount: Number(summary.partial_refund_count),
    refundPendingCount: Number(summary.refund_pending_count),
    pendingCount: Number(summary.pending_count),
    clickCount: Number(summary.click_count),
    clickMinor: Number(summary.click_minor),
    manualCount: Number(summary.manual_count),
    manualMinor: Number(summary.manual_minor),
    chart,
  };
}

export type PaymentAnalytics = Awaited<ReturnType<typeof getPaymentAnalytics>>;
