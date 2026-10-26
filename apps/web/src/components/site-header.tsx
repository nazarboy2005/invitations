import Link from "next/link";
import { Flower2, ArrowUpRight, UserRound } from "lucide-react";
import { getSessionUser } from "@/server/auth";
import styles from "./site-header.module.css";
import { ScrollHeader } from "./scroll-header";
import { sans } from "@/app/platform-fonts";
import { AccountLinkLabel } from "@/components/account-link-label";
import { HeroMobileMenu } from "@/components/hero-mobile-menu";
import { SiteSounds } from "./site-sounds";
export async function SiteHeader({
  compact = false,
  dashboard = false,
  hero = false,
  catalog = false,
}: {
  compact?: boolean;
  dashboard?: boolean;
  hero?: boolean;
  catalog?: boolean;
}) {
  const user = await getSessionUser().catch(() => null);
  if (hero || catalog) {
    return (
      <ScrollHeader
        className={`${styles.header} ${styles.heroHeader} ${catalog ? styles.catalogHeader : ""} ${sans.className}`}
        followScroll
      >
        <div className={styles.heroInner}>
          <Link
            href="/"
            className={styles.heroBrand}
            aria-label="Visol bosh sahifa"
          >
            <svg viewBox="0 0 32 36" fill="none" aria-hidden="true">
              <path
                d="m16 1 4.3 12.7L32 18l-11.7 4.3L16 35l-4.3-12.7L0 18l11.7-4.3L16 1Z"
                fill="currentColor"
              />
            </svg>
            <span>visol</span>
          </Link>
          <nav className={styles.heroNav} aria-label="Asosiy menyu">
            <Link href="/templates?category=wedding">To‘ylar</Link>
            <Link href="/templates?category=osh">Marosimlar</Link>
            <Link href="/templates?category=other">Tantanalar</Link>
            <Link href="/#why-us">Biz haqimizda</Link>
          </nav>
          <SiteSounds />
          <Link href="/dashboard" className={styles.heroAccount}>
            <UserRound size={19} strokeWidth={1.2} aria-hidden="true" />
            <AccountLinkLabel signedIn={Boolean(user)} />
          </Link>
          <HeroMobileMenu
            accountLabel={<AccountLinkLabel signedIn={Boolean(user)} />}
          />
        </div>
      </ScrollHeader>
    );
  }
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
          {user?.isAdmin && (
            <a href="/admin" className={styles.account}>
              Boshqaruv
            </a>
          )}
          <Link href="/studio" className={styles.create} aria-label="Yaratish">
            <span>Yaratish</span> <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </ScrollHeader>
  );
}
