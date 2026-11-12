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
} from "@/server/payment-analytics";
import { AdminPaymentRevenueChart } from "./admin-analytics-chart";
import { AdminAnalyticsDateRange } from "./admin-analytics-date-range";
import styles from "./payment-analytics.module.css";

const countFormat = new Intl.NumberFormat("uz-UZ");

export function AdminPaymentAnalytics({ data }: { data: PaymentAnalytics }) {
  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div>
          <h2>To‘lovlar tahlili</h2>
          <p>
            {data.from} – {data.to} · Sana Toshkent vaqti bilan hisoblanadi
          </p>
        </div>
        <AdminAnalyticsDateRange period={data.period} from={data.from} to={data.to} />
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
            <CalendarDays size={15} /> {data.from} – {data.to}
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
