import { BRAND_NAME } from "@/lib/brand";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { SessionUser } from "@taklifnoma/contracts";
import { display, sans } from "@/app/platform-fonts";
import styles from "./admin.module.css";
import { AdminNavigationGuard } from "./admin-navigation-guard";
import {
  AdminSidebarFooter,
  AdminSidebarNavigation,
  AdminTopbarActions,
} from "./admin-sidebar-navigation";
const descriptions: Record<string, string> = {
  requests:
    "Ism tuzatishlari va sana ko‘chirish so‘rovlarini tekshiring va qarorni tarixga yozing.",
  users:
    "Hisoblar, foydalanuvchilar taklifnomalari va kirish huquqlarini boshqaring.",
  invitations:
    "Barcha foydalanuvchilarning taklifnomalari, havolalari va mehmonlar faolligi.",
  payments: "To‘lov yozuvlari, summalar va dizayn narxlarini nazorat qiling.",
  analytics:
    "Tasdiqlangan tushumlar va platforma to‘lovlari dinamikasini ko‘ring.",
  broadcasts:
    "Foydalanuvchilarga Telegram orqali xabar tayyorlang va yuborishni kuzating.",
  templates: "Dizaynlar, narxlar va nashr holatini bir joyda boshqaring.",
  categories:
    "Dizaynlarni tartiblang va katalogdagi kategoriya nomlarini yangilang.",
  music: "Taklifnomalar uchun umumiy fon musiqalarini boshqaring.",
  activity: "Kim, qachon va nimani o‘zgartirganini ko‘ring.",
};
const headings: Record<string, string> = {
  requests: "Tuzatish so‘rovlari",
  users: "Foydalanuvchilar",
  invitations: "Taklifnomalar",
  payments: "To‘lovlar registri",
  analytics: "Analytics",
  broadcasts: "Xabarlar",
  templates: "Dizaynlar",
  categories: "Kategoriyalar",
  music: "Musiqa",
  activity: "O‘zgarishlar tarixi",
};
export function AdminShell({
  user,
  view,
  children,
}: {
  user: SessionUser;
  view: string;
  children: React.ReactNode;
}) {
  return (
    <AdminNavigationGuard>
      <div
        className={`${styles.workspace} ${display.variable} ${sans.variable}`}
      >
        <aside className={styles.sidebar}>
          <Link
            href="/"
            className={styles.brand}
            aria-label={`${BRAND_NAME} bosh sahifa`}
          >
            ✦ <span>{BRAND_NAME}</span>
          </Link>
          <span className={styles.workspaceLabel}>Sayt boshqaruvi</span>
          <AdminSidebarNavigation view={view} />
          <AdminSidebarFooter userName={user.displayName} />
        </aside>
        <main id="main" className={styles.main}>
          <header className={styles.topbar}>
            <span>{BRAND_NAME} / Boshqaruv</span>
            <AdminTopbarActions />
          </header>
          <div className={styles.content}>
            <div className={styles.heading}>
              <div>
                <h1>{headings[view]}</h1>
                <p>{descriptions[view]}</p>
              </div>
              <Link
                className={styles.accessBadge}
                href="/admin/verify"
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
              >
                <ShieldCheck size={16} aria-hidden="true" />
                Hisobni tasdiqlash
              </Link>
            </div>
            {children}
          </div>
        </main>
      </div>
    </AdminNavigationGuard>
  );
}
