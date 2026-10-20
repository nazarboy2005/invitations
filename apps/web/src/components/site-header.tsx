import Link from "next/link";
import { Flower2, ArrowUpRight } from "lucide-react";
import styles from "./site-header.module.css";
export function SiteHeader({ compact = false }: { compact?: boolean }) {
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
          <Link href="/dashboard">Taklifnomalarim</Link>
          <Link href="/studio" className={styles.create}>
            Yaratish <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
