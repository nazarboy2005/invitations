import Link from "next/link";
import { Flower2, ArrowUpRight } from "lucide-react";
import { getSessionUser } from "@/server/auth";
import styles from "./site-header.module.css";
export async function SiteHeader({ compact = false }: { compact?: boolean }) {
  const user = await getSessionUser().catch(() => null);
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="Taklifnoma bosh sahifa"
        >
          <Flower2 size={27} strokeWidth={1.5} />
          <span>
            taklifnoma<span className={styles.dot}>.</span>
          </span>
        </Link>
        <nav aria-label="Asosiy menyu" className={styles.nav}>
          {!compact && (
            <Link href="/#templates" className={styles.catalog}>
              Dizaynlar
            </Link>
          )}
          <Link href="/dashboard">{user ? "Taklifnomalarim" : "Kirish"}</Link>
          <Link href="/studio" className={styles.create}>
            Yaratish <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
