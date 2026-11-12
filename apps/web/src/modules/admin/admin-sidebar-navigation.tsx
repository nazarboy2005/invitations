"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChartNoAxesCombined,
  ChevronDown,
  ExternalLink,
  FileHeart,
  History,
  LayoutGrid,
  ListFilter,
  Music2,
  Send,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import styles from "./admin.module.css";

const sections = [
  { id: "users", label: "Foydalanuvchilar", icon: Users },
  { id: "invitations", label: "Taklifnomalar", icon: FileHeart },
  { id: "requests", label: "Tuzatish so‘rovlari", icon: ShieldCheck },
  { id: "payments", label: "To‘lovlar registri", icon: Wallet },
  { id: "broadcasts", label: "Xabarlar", icon: Send },
  { id: "templates", label: "Dizaynlar", icon: LayoutGrid },
  { id: "categories", label: "Kategoriyalar", icon: ListFilter },
  { id: "music", label: "Musiqa", icon: Music2 },
  { id: "activity", label: "O‘zgarishlar tarixi", icon: History },
];

export function AdminSidebarNavigation({ view }: { view: string }) {
  const [analyticsOpen, setAnalyticsOpen] = useState(view === "analytics");
  return (
    <nav className={styles.nav} aria-label="Boshqaruv bo‘limlari">
      {sections.slice(0, 4).map(({ id, label, icon: Icon }) => (
        <Link
          key={id}
          href={`/admin?view=${id}`}
          prefetch={false}
          aria-current={view === id ? "page" : undefined}
        >
          <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
          {label}
        </Link>
      ))}
      <div className={styles.navGroup}>
        <button
          type="button"
          className={styles.navToggle}
          aria-expanded={analyticsOpen}
          aria-controls="admin-analytics-links"
          data-active={view === "analytics"}
          onClick={() => setAnalyticsOpen((open) => !open)}
        >
          <ChartNoAxesCombined size={19} strokeWidth={1.6} aria-hidden="true" />
          <span>Analytics</span>
          <ChevronDown
            className={styles.navChevron}
            size={15}
            aria-hidden="true"
          />
        </button>
        {analyticsOpen && (
          <div id="admin-analytics-links" className={styles.navChildren}>
            <Link
              href="/admin?view=analytics&period=month"
              prefetch={false}
              aria-current={view === "analytics" ? "page" : undefined}
            >
              <Wallet size={16} strokeWidth={1.7} aria-hidden="true" />
              To‘lovlar
            </Link>
          </div>
        )}
      </div>
      {sections.slice(4).map(({ id, label, icon: Icon }) => (
        <Link
          key={id}
          href={`/admin?view=${id}`}
          prefetch={false}
          aria-current={view === id ? "page" : undefined}
        >
          <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AdminSidebarFooter({ userName }: { userName: string }) {
  return (
    <div className={styles.sidebarFoot}>
      <p>
        <ShieldCheck size={17} aria-hidden="true" />
        Administrator
      </p>
      <strong>{userName}</strong>
      <Link href="/dashboard?mode=personal">
        <ArrowLeft size={16} aria-hidden="true" />
        Hisobga qaytish
      </Link>
    </div>
  );
}

export function AdminTopbarActions() {
  return (
    <nav className={styles.topbarActions} aria-label="Hisob va katalog">
      <Link href="/dashboard?mode=personal" className={styles.mobileAccount}>
        Shaxsiy hisob
      </Link>
      <Link href="/templates" target="_blank" rel="noopener noreferrer">
        Katalogni ochish
        <ExternalLink size={15} aria-hidden="true" />
      </Link>
    </nav>
  );
}
