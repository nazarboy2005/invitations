import Link from "next/link";
import {
  ArrowDownLeft,
  Banknote,
  CalendarDays,
  CircleCheck,
  Clock3,
} from "lucide-react";
import { formatPrice } from "@taklifnoma/contracts";
import type {
  PaymentAnalytics,
  PaymentAnalyticsPeriod,
} from "@/server/payment-analytics";
import { AdminPaymentRevenueChart } from "./admin-analytics-chart";
import styles from "./payment-analytics.module.css";

const periods: Array<{ id: PaymentAnalyticsPeriod; label: string }> = [
  { id: "week", label: "Bu hafta" },
  { id: "month", label: "Bu oy" },
  { id: "30days", label: "Oxirgi 30 kun" },
];

const countFormat = new Intl.NumberFormat("uz-UZ");

function rangeLabel(period: PaymentAnalyticsPeriod) {
  return periods.find((item) => item.id === period)?.label ?? "Bu oy";
}

export function AdminPaymentAnalytics({ data }: { data: PaymentAnalytics }) {
  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div>
          <h2>To‘lovlar tahlili</h2>
          <p>
            {rangeLabel(data.period)} · Sana Toshkent vaqti bilan hisoblanadi
          </p>
        </div>
        <nav className={styles.periods} aria-label="Tahlil davri">
          {periods.map((item) => (
            <Link
              key={item.id}
              href={`/admin?view=analytics&period=${item.id}`}
              aria-current={data.period === item.id ? "page" : undefined}
              data-active={data.period === item.id}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <section
        className={styles.metrics}
        aria-label="To‘lovlar ko‘rsatkichlari"
      >
        <article className={styles.metric}>
          <span className={styles.metricIcon}>
            <Banknote size={19} />
          </span>
          <span className={styles.metricLabel}>Yalpi tushum</span>
          <strong>{formatPrice(data.grossMinor)}</strong>
          <small>To‘lov tasdiqlangan sana bo‘yicha</small>
        </article>
        <article className={styles.metric}>
          <span className={styles.metricIcon}>
            <CircleCheck size={19} />
          </span>
          <span className={styles.metricLabel}>Tasdiqlangan to‘lovlar</span>
          <strong>{countFormat.format(data.paidCount)}</strong>
          <small>Click va qo‘lda qayd etilgan</small>
        </article>
        <article className={styles.metric}>
          <span className={styles.metricIcon}>
            <ArrowDownLeft size={19} />
          </span>
          <span className={styles.metricLabel}>To‘liq qaytarilgan</span>
          <strong>{formatPrice(data.refundedMinor)}</strong>
          <small>{countFormat.format(data.refundedCount)} ta, shu davrda to‘langan</small>
        </article>
        <article className={styles.metric}>
          <span className={styles.metricIcon}>
            <Clock3 size={19} />
          </span>
          <span className={styles.metricLabel}>Kutilayotgan to‘lovlar</span>
          <strong>{countFormat.format(data.pendingCount)}</strong>
          <small>Davr ichida boshlangan buyurtmalar</small>
        </article>
      </section>

      <section className={styles.panel} aria-labelledby="revenue-title">
        <div className={styles.panelHeading}>
          <div>
            <h3 id="revenue-title">Kunlik tushum</h3>
            <p>Click va administrator qayd etgan to‘lovlar</p>
          </div>
          <span className={styles.updated}>
            <CalendarDays size={15} /> {rangeLabel(data.period)}
          </span>
        </div>
        <div className={styles.legend}>
          <span>
            <i className={styles.onlineDot} /> Click ·{" "}
            {countFormat.format(data.clickCount)} ta ·{" "}
            {formatPrice(data.clickMinor)}
          </span>
          <span>
            <i className={styles.manualDot} /> Qo‘lda ·{" "}
            {countFormat.format(data.manualCount)} ta ·{" "}
            {formatPrice(data.manualMinor)}
          </span>
        </div>
        <AdminPaymentRevenueChart data={data.chart} />
      </section>

      <p className={styles.note}>
        Yalpi tushum tasdiqlangan to‘lovlarning boshlang‘ich summasidir. To‘liq
        qaytarilgan summa yuqorida alohida ko‘rsatilgan. Qaytarilishi
        tekshirilayotgan {countFormat.format(data.refundPendingCount)} ta va qisman
        qaytarilgan {countFormat.format(data.partialRefundCount)} ta buyurtma
        yalpi tushumdan chegirilmagan; qisman qaytarish summasi saqlanmaydi.
        Qaytarishlar tanlangan davrda to‘langan buyurtmalar bo‘yicha sanaladi.
      </p>
    </div>
  );
}
