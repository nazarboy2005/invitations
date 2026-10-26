import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  LayoutGrid,
  ListFilter,
  Music2,
  History,
  ShieldCheck,
  Users,
  FileHeart,
  Wallet,
  Send,
} from "lucide-react";
import type { SessionUser } from "@taklifnoma/contracts";
import { display, sans } from "@/app/platform-fonts";
import styles from "./admin.module.css";
import { AdminNavigationGuard } from "./admin-navigation-guard";
const sections = [
  { id: "users", label: "Foydalanuvchilar", icon: Users },
  { id: "invitations", label: "Taklifnomalar", icon: FileHeart },
  { id: "payments", label: "To‘lovlar", icon: Wallet },
  { id: "broadcasts", label: "Xabarlar", icon: Send },
  { id: "templates", label: "Dizaynlar", icon: LayoutGrid },
  { id: "categories", label: "Kategoriyalar", icon: ListFilter },
  { id: "music", label: "Musiqa", icon: Music2 },
  { id: "activity", label: "O‘zgarishlar tarixi", icon: History },
];
const descriptions: Record<string, string> = {
  users:
    "Hisoblar, foydalanuvchilar taklifnomalari va kirish huquqlarini boshqaring.",
  invitations:
    "Barcha foydalanuvchilarning taklifnomalari, havolalari va mehmonlar faolligi.",
  payments: "To‘lov yozuvlari, summalar va dizayn narxlarini nazorat qiling.",
  broadcasts:
    "Foydalanuvchilarga Telegram orqali xabar tayyorlang va yuborishni kuzating.",
  templates: "Dizaynlar, narxlar va nashr holatini bir joyda boshqaring.",
  categories:
    "Dizaynlarni tartiblang va katalogdagi kategoriya nomlarini yangilang.",
  music: "Taklifnomalar uchun umumiy fon musiqalarini boshqaring.",
  activity: "Kim, qachon va nimani o‘zgartirganini ko‘ring.",
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
            aria-label="Visol bosh sahifa"
          >
            ✦ <span>visol</span>
          </Link>
          <span className={styles.workspaceLabel}>Sayt boshqaruvi</span>
          <nav className={styles.nav} aria-label="Boshqaruv bo‘limlari">
            {sections.map(({ id, label, icon: Icon }) => (
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
          <div className={styles.sidebarFoot}>
            <p>
              <ShieldCheck size={17} aria-hidden="true" />
              Administrator
            </p>
            <strong>{user.displayName}</strong>
            <Link href="/dashboard?mode=personal">
              <ArrowLeft size={16} aria-hidden="true" />
              Hisobga qaytish
            </Link>
          </div>
        </aside>
        <main id="main" className={styles.main}>
          <header className={styles.topbar}>
            <span>Visol / Boshqaruv</span>
            <nav className={styles.topbarActions} aria-label="Hisob va katalog">
              <Link
                href="/dashboard?mode=personal"
                className={styles.mobileAccount}
              >
                Shaxsiy hisob
              </Link>
              <Link href="/templates" target="_blank" rel="noopener noreferrer">
                Katalogni ochish
                <ExternalLink size={15} aria-hidden="true" />
              </Link>
            </nav>
          </header>
          <div className={styles.content}>
            <div className={styles.heading}>
              <div>
                <h1>{sections.find((item) => item.id === view)?.label}</h1>
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
