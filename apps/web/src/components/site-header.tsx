import Link from "next/link";
import { UserRound } from "lucide-react";
import { getSessionUser } from "@/server/auth";
import styles from "./site-header.module.css";
import { ScrollHeader } from "./scroll-header";
import { sans } from "@/app/platform-fonts";
import { AccountLinkLabel } from "@/components/account-link-label";
import { HeroMobileMenu } from "@/components/hero-mobile-menu";
import { SiteSounds } from "./site-sounds";
export async function SiteHeader({
  dashboard = false,
  catalog = false,
}: {
  dashboard?: boolean;
  catalog?: boolean;
}) {
  const user = await getSessionUser().catch(() => null);
  return (
    <ScrollHeader
      className={`${styles.header} ${styles.heroHeader} ${catalog ? styles.catalogHeader : ""} ${sans.className}`}
      followScroll
      yieldToCatalog={catalog}
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
          <Link href="/templates">Shablonlar</Link>
          <a href="https://t.me/HyperLean">Bog‘lanish</a>
          <Link href="/#why-us">Biz haqimizda</Link>
        </nav>
        <SiteSounds />
        <Link
          href="/dashboard"
          className={styles.heroAccount}
          aria-current={dashboard ? "page" : undefined}
        >
          <UserRound size={19} strokeWidth={1.2} aria-hidden="true" />
          <AccountLinkLabel signedIn={Boolean(user)} />
        </Link>
        <HeroMobileMenu
          accountLabel={<AccountLinkLabel signedIn={Boolean(user)} />}
          isAdmin={user?.isAdmin ?? false}
        />
      </div>
    </ScrollHeader>
  );
}
