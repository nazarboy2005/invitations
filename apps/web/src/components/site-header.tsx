import { BRAND_NAME } from "@/lib/brand";
import Link from "next/link";
import { Heart, Home, LayoutGrid, UserRound } from "lucide-react";
import { getSessionUser } from "@/server/auth";
import styles from "./site-header.module.css";
import { ScrollHeader } from "./scroll-header";
import { sans } from "@/app/platform-fonts";
import { AccountLinkLabel } from "@/components/account-link-label";
import { HeroMobileMenu } from "@/components/hero-mobile-menu";
import { SiteSounds } from "./site-sounds";
import { FavoritesLink } from "@/modules/favorites/favorite-button";
export async function SiteHeader({
  dashboard = false,
  catalog = false,
}: {
  dashboard?: boolean;
  catalog?: boolean;
}) {
  const user = await getSessionUser().catch(() => null);
  return (
    <>
    <ScrollHeader
      className={`${styles.header} ${styles.heroHeader} ${catalog ? styles.catalogHeader : ""} ${sans.className}`}
      followScroll
      yieldToCatalog={catalog}
    >
      <div className={styles.heroInner}>
        <Link
          href="/"
          className={styles.heroBrand}
          aria-label={`${BRAND_NAME} bosh sahifa`}
        >
          <svg viewBox="0 0 32 36" fill="none" aria-hidden="true">
            <path
              d="m16 1 4.3 12.7L32 18l-11.7 4.3L16 35l-4.3-12.7L0 18l11.7-4.3L16 1Z"
              fill="currentColor"
            />
          </svg>
          <span>{BRAND_NAME}</span>
        </Link>
        <nav className={styles.heroNav} aria-label="Asosiy menyu">
          <Link href="/templates">Shablonlar</Link>
          <a href="https://t.me/HyperLean">Bog‘lanish</a>
          <Link href="/#why-us">Biz haqimizda</Link>
        </nav>
        <SiteSounds />
        <div className={styles.heroActions}>
          <FavoritesLink className={styles.heroFavorites} />
          <Link
            href="/dashboard"
            className={styles.heroAccount}
            aria-current={dashboard ? "page" : undefined}
          >
            <UserRound size={19} strokeWidth={1.2} aria-hidden="true" />
            <AccountLinkLabel signedIn={Boolean(user)} />
          </Link>
        </div>
        <HeroMobileMenu
          accountLabel={<AccountLinkLabel signedIn={Boolean(user)} />}
          isAdmin={user?.isAdmin ?? false}
        />
      </div>
    </ScrollHeader>
      <nav className={`${styles.bottomNav} ${sans.className}`} aria-label="Mobil asosiy menyu">
        <Link href="/"><Home size={21} aria-hidden="true" />Asosiy</Link>
        <Link href="/templates"><LayoutGrid size={21} aria-hidden="true" />Shablonlar</Link>
        <Link href="/templates?favorites=1"><Heart size={21} aria-hidden="true" />Saqlangan</Link>
        <Link href="/dashboard" aria-current={dashboard ? "page" : undefined}>
          <UserRound size={21} aria-hidden="true" />Taklifnomalarim
        </Link>
      </nav>
    </>
  );
}
