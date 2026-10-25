import Link from "next/link";
import { Flower2, ArrowUpRight } from "lucide-react";
import { getSessionUser } from "@/server/auth";
import styles from "./site-header.module.css";
import { ScrollHeader } from "./scroll-header";
import { sans } from "@/app/platform-fonts";
import { AccountLinkLabel } from "@/components/account-link-label";
export async function SiteHeader({
  compact = false,
  dashboard = false,
}: {
  compact?: boolean;
  dashboard?: boolean;
}) {
  const user = await getSessionUser().catch(() => null);
  return (
    <ScrollHeader
      className={`${styles.header} ${styles.editorial} ${sans.className}`}
    >
      <div className={`container ${styles.inner}`}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="Taklifnoma bosh sahifa"
        >
          <span className={styles.brandMark}>
            <Flower2 size={26} strokeWidth={1.3} />
          </span>
          <span>
            taklifnoma<span className={styles.dot}>.</span>
          </span>
        </Link>
        <nav aria-label="Asosiy menyu" className={styles.nav}>
          {!compact && (
            <Link href="/templates" className={styles.catalog}>
              Dizaynlar
            </Link>
          )}
          {!compact && (
            <>
              <Link href="/#how-it-works" className={styles.howItWorks}>
                Qanday ishlaydi
              </Link>
              <Link href="/#why-us" className={styles.questions}>
                Nega biz?
              </Link>
            </>
          )}
          <Link
            href="/dashboard"
            className={styles.account}
            aria-current={dashboard ? "page" : undefined}
          >
            <AccountLinkLabel signedIn={Boolean(user)} />
          </Link>
          <Link href="/studio" className={styles.create} aria-label="Yaratish">
            <span>Yaratish</span> <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </ScrollHeader>
  );
}
